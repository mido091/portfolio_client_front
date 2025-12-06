// Users Management Dashboard JavaScript
// API Configuration
const API_BASE_URL = "https://portfolio-client-server.vercel.app/api";
const API_ENDPOINTS = {
  users: `${API_BASE_URL}/users`,
  register: `${API_BASE_URL}/users/register`,
};

// Global Variables
let currentUser = null;
let currentEditingUserId = null;
let isEditMode = false;

// DOM Elements
const userForm = document.getElementById("userForm");
const userFormContainer = document.getElementById("userFormContainer");
const usersTableBody = document.getElementById("usersTableBody");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("formTitle");
const imageInput = document.getElementById("userImage");
const imagePreview = document.getElementById("imagePreview");
const imagePreviewContainer = document.getElementById("imagePreviewContainer");
const clearImageBtn = document.getElementById("clearImageBtn");

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  checkAuthAndRole();
  setupEventListeners();
});

// Check Authentication and Role
function checkAuthAndRole() {
  const userStr = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!userStr || !token) {
    alert("Please login to access this page");
    window.location.href = "login.html";
    return;
  }

  currentUser = JSON.parse(userStr);

  // Check if user has admin or owner role
  if (
    currentUser.role !== "admin" &&
    currentUser.role !== "owner" &&
    currentUser.role !== "user"
  ) {
    alert("Access denied. You don't have permission to view this page.");
    window.location.href = "index.html";
    return;
  }

  // If user role is "user", redirect to login
  if (currentUser.role === "user") {
    alert("Access denied. Admin or Owner role required.");
    window.location.href = "login.html";
    return;
  }

  // Update profile name
  const profileName = document.querySelector(".profile h2");
  if (profileName && currentUser.name) {
    profileName.textContent = currentUser.name;
  }

  // Show/Hide form based on role
  if (currentUser.role === "owner") {
    userFormContainer.style.display = "block";
  } else {
    userFormContainer.style.display = "none";
  }

  // Load users
  loadUsers();
}

// Setup Event Listeners
function setupEventListeners() {
  userForm.addEventListener("submit", handleFormSubmit);
  cancelBtn.addEventListener("click", resetForm);

  // Image upload handling
  if (imageInput) {
    imageInput.addEventListener("change", handleImageSelect);
  }

  if (clearImageBtn) {
    clearImageBtn.addEventListener("click", clearImagePreview);
  }
}

// Handle Image Selection
function handleImageSelect(e) {
  const file = e.target.files[0];

  if (file) {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      imageInput.value = "";
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      imageInput.value = "";
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreviewContainer.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
}

// Clear Image Preview
function clearImagePreview() {
  imageInput.value = "";
  imagePreview.src = "";
  imagePreviewContainer.style.display = "none";
}

// Load Users from API
async function loadUsers() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(API_ENDPOINTS.users, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      alert("Session expired. Please login again.");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    const users = data.users || [];

    displayUsers(users);
  } catch (error) {
    console.error("Error loading users:", error);
    usersTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Failed to load users. Please try again.</p>
        </td>
      </tr>
    `;
  }
}

// Display Users in Table
function displayUsers(users) {
  if (users.length === 0) {
    usersTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          <i class="fas fa-users-slash"></i>
          <p>No users found</p>
        </td>
      </tr>
    `;
    return;
  }

  usersTableBody.innerHTML = users
    .map((user, index) => {
      // Use user image or default
      const userImage =
        user.image ||
        "https://res.cloudinary.com/ddqlt5oqu/image/upload/v1764967019/default_pi1ur8.webp";

      return `
    <tr>
      <td>${index + 1}</td>
      <td>
        <img src="${userImage}" alt="${user.name || "User"}" 
             style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid #ddd;" 
             onerror="this.src='https://res.cloudinary.com/ddqlt5oqu/image/upload/v1764967019/default_pi1ur8.webp'" />
      </td>
      <td>${user.name || user.username || "N/A"}</td>
      <td>${user.email}</td>
      <td><span class="role-badge role-${user.role}">${user.role}</span></td>
      <td>
        <div class="action-buttons">
          ${getActionButtons(user)}
        </div>
      </td>
    </tr>
  `;
    })
    .join("");
}

// Get Action Buttons Based on Role
function getActionButtons(user) {
  // If current user is owner, show Edit and Delete buttons
  if (currentUser.role === "owner") {
    const userImage = user.image || "";
    return `
      <button class="btn btn-success" onclick="editUser(${user.id}, '${
      user.name || user.username
    }', '${user.email}', '${user.role}', '${userImage}')">
        <i class="fas fa-edit"></i> Edit
      </button>
      <button class="btn btn-danger" onclick="deleteUser(${user.id}, '${
      user.name || user.username
    }')">
        <i class="fas fa-trash"></i> Delete
      </button>
    `;
  }

  // If current user is admin, show only View button
  if (currentUser.role === "admin") {
    return `
      <button class="btn btn-info" onclick="viewUser(${user.id})">
        <i class="fas fa-eye"></i> View
      </button>
    `;
  }

  return "";
}

// Handle Form Submit (Create or Update)
async function handleFormSubmit(e) {
  e.preventDefault();

  // Create FormData to handle file upload
  const formData = new FormData();
  formData.append("name", document.getElementById("userName").value.trim());
  formData.append("email", document.getElementById("userEmail").value.trim());
  formData.append("password", document.getElementById("userPassword").value);
  formData.append("role", document.getElementById("userRole").value);

  // Add image if selected
  const imageFile = imageInput.files[0];
  if (imageFile) {
    formData.append("image", imageFile);
  }

  if (isEditMode) {
    await updateUser(currentEditingUserId, formData);
  } else {
    await createUser(formData);
  }
}

// Create User
async function createUser(formData) {
  const token = localStorage.getItem("token");

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';

    const response = await fetch(API_ENDPOINTS.register, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type - browser will set it with boundary for multipart/form-data
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create user");
    }

    alert("User created successfully!");
    resetForm();
    loadUsers();
  } catch (error) {
    console.error("Error creating user:", error);
    alert(`Error: ${error.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create User';
  }
}

// Update User
async function updateUser(userId, userData) {
  const token = localStorage.getItem("token");

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';

    const response = await fetch(`${API_ENDPOINTS.users}/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update user");
    }

    alert("User updated successfully!");
    resetForm();
    loadUsers();
  } catch (error) {
    console.error("Error updating user:", error);
    alert(`Error: ${error.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create User';
  }
}

// Edit User (Fill form with user data)
function editUser(userId, name, email, role, imageUrl) {
  isEditMode = true;
  currentEditingUserId = userId;

  document.getElementById("userName").value = name;
  document.getElementById("userEmail").value = email;
  document.getElementById("userPassword").value = "";
  document.getElementById("userRole").value = role;

  // Show existing image if available
  if (imageUrl && imageUrl !== "null" && imageUrl !== "") {
    imagePreview.src = imageUrl;
    imagePreviewContainer.style.display = "block";
  } else {
    clearImagePreview();
  }

  formTitle.textContent = "Update User";
  submitBtn.innerHTML = '<i class="fas fa-save"></i> Update User';
  cancelBtn.style.display = "inline-flex";

  // Scroll to form
  userFormContainer.scrollIntoView({ behavior: "smooth" });
}

// Delete User
async function deleteUser(userId, userName) {
  if (!confirm(`Are you sure you want to delete user "${userName}"?`)) {
    return;
  }

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_ENDPOINTS.users}/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to delete user");
    }

    alert("User deleted successfully!");
    loadUsers();
  } catch (error) {
    console.error("Error deleting user:", error);
    alert(`Error: ${error.message}`);
  }
}

// View User (For admin role)
function viewUser(userId) {
  alert(
    `Viewing user details for ID: ${userId}\nThis feature can be expanded to show a modal with full user details.`
  );
}

// Reset Form
function resetForm() {
  isEditMode = false;
  currentEditingUserId = null;

  userForm.reset();
  formTitle.textContent = "Create New User";
  submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create User';
  cancelBtn.style.display = "none";

  // Clear image preview
  clearImagePreview();
}
