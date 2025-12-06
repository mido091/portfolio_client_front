// Profile Page Logic
const API_BASE_URL = "https://portfolio-client-server.vercel.app/api";

document.addEventListener("DOMContentLoaded", function () {
  checkAuth();
  // Only load profile if we are on the profile page
  if (document.getElementById("profileForm")) {
    loadUserProfile();
    setupEventListeners();
  }
});

// Parse JWT Token
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error parsing JWT:", e);
    return null;
  }
}

// Check Authentication
function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    if (window.location.pathname.includes("profile.html")) {
      window.location.href = "login.html";
    }
    return;
  }

  // Verify token validity
  const decoded = parseJwt(token);
  if (!decoded || (decoded.exp && decoded.exp * 1000 < Date.now())) {
    console.warn("Token expired or invalid");
    logout();
  }
}

// Logout Helper
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

// Load User Profile
async function loadUserProfile() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const decoded = parseJwt(token);
  // Support both 'id' and 'userId' depending on how the backend signs the token
  const userId = decoded ? decoded.id || decoded.userId || decoded._id : null;

  if (!userId) {
    console.error("User ID not found in token");
    alert("Session invalid. Please login again.");
    logout();
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }
      throw new Error("Failed to load profile");
    }

    const data = await response.json();
    const userData = data.user || data;

    // Populate Form (with null checks)
    const nameInput = document.getElementById("userName");
    const emailInput = document.getElementById("userEmail");
    const imagePreview = document.getElementById("profileImagePreview");

    if (nameInput) nameInput.value = userData.name || userData.username || "";
    if (emailInput) emailInput.value = userData.email || "";

    // Set Profile Image
    if (imagePreview) {
      const defaultImage =
        "https://res.cloudinary.com/ddqlt5oqu/image/upload/v1764967019/default_pi1ur8.webp";
      imagePreview.src = userData.image || defaultImage;

      imagePreview.onerror = function () {
        this.src = defaultImage;
      };
    }
  } catch (error) {
    console.error("Error loading profile:", error);
    if (document.getElementById("profileForm")) {
      alert("Failed to load profile data. Please refresh the page.");
    }
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Image Preview
  const imageInput = document.getElementById("imageInput");
  const imagePreview = document.getElementById("profileImagePreview");

  if (imageInput && imagePreview) {
    imageInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert("Image size must be less than 5MB");
          this.value = "";
          return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
          imagePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Form Submit
  const form = document.getElementById("profileForm");
  if (form) {
    form.addEventListener("submit", handleProfileUpdate);
  }
}

// Handle Profile Update
async function handleProfileUpdate(e) {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    logout();
    return;
  }

  const decoded = parseJwt(token);
  const userId = decoded ? decoded.id || decoded.userId || decoded._id : null;

  if (!userId) {
    alert("Session invalid. Please login again.");
    return;
  }

  // Validate Passwords
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  const newPassword = newPasswordInput ? newPasswordInput.value : "";
  const confirmPassword = confirmPasswordInput
    ? confirmPasswordInput.value
    : "";

  if (newPassword && newPassword !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // Prepare FormData
  const formData = new FormData();

  const nameInput = document.getElementById("userName");
  const emailInput = document.getElementById("userEmail");

  if (nameInput) formData.append("name", nameInput.value);
  if (emailInput) formData.append("email", emailInput.value);

  if (newPassword) {
    formData.append("password", newPassword);
  }

  const imageInput = document.getElementById("imageInput");
  if (imageInput && imageInput.files[0]) {
    formData.append("image", imageInput.files[0]);
  }

  // Show Loading State
  const saveBtn = document.getElementById("saveBtn");
  let originalBtnText = "";

  if (saveBtn) {
    originalBtnText = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update profile");
    }

    // Update LocalStorage User Data (Merge with existing)
    const currentUserStr = localStorage.getItem("user");
    const currentUser = currentUserStr ? JSON.parse(currentUserStr) : {};
    const updatedUser = { ...currentUser, ...data.user };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert("Profile updated successfully!");
    window.location.reload();
  } catch (error) {
    console.error("Error updating profile:", error);
    alert(error.message || "Failed to update profile");
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = originalBtnText;
    }
  }
}
