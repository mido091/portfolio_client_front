// Profile Page Logic
const API_BASE_URL = "https://portfolio-client-server.vercel.app/api";

// Store current user data globaly to ensure we always have the latest values
// for fields that are not being modified in a specific request.
let currentUserData = {
  name: "",
  email: "",
  image: "",
  username: "",
};

document.addEventListener("DOMContentLoaded", function () {
  checkAuth();
  // Only load profile if we are on the profile page
  if (document.getElementById("profileForm")) {
    loadUserProfile();
    setupEventListeners();
  }
});

// Parse JWT Token to safely extract user ID
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
  // Requirement: Validate token exists
  if (!token) {
    console.error("checkAuth: No token found. Redirecting to login.");
    if (window.location.pathname.includes("profile.html")) {
      window.location.href = "login.html";
    }
    return;
  }

  // Verify token validity
  const decoded = parseJwt(token);
  if (!decoded || (decoded.exp && decoded.exp * 1000 < Date.now())) {
    console.warn("checkAuth: Token expired or invalid");
    logout();
  }
}

// Logout Helper
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

// Helper to get User ID safely
function getUserId() {
  // 1. Try Token
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = parseJwt(token);
    if (decoded && (decoded.id || decoded.userId || decoded._id)) {
      return decoded.id || decoded.userId || decoded._id;
    }
  }

  // 2. Try User Object in LocalStorage
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.id || user._id) {
        return user.id || user._id;
      }
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
    }
  }

  // 3. Fallback to direct 'userId'
  const storedId = localStorage.getItem("userId");
  if (storedId) return storedId;

  return null;
}

// Load User Profile (GET Request)
async function loadUserProfile() {
  const token = localStorage.getItem("token");
  const userId = getUserId();

  console.log("Loading Profile - User ID:", userId);

  if (!token || !userId) {
    console.error(
      "loadUserProfile: Missing token or User ID. Stopping execution."
    );
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
      throw new Error(`Failed to load profile: ${response.statusText}`);
    }

    const data = await response.json();

    // Robustly handle API response variations
    let fetchedData = null;
    if (Array.isArray(data)) {
      fetchedData = data[0];
    } else if (
      data.users &&
      Array.isArray(data.users) &&
      data.users.length > 0
    ) {
      fetchedData = data.users[0];
    } else if (data.user) {
      fetchedData = data.user;
    } else {
      fetchedData = data;
    }

    if (!fetchedData) {
      throw new Error("User data format not recognized");
    }

    // Update global state
    currentUserData = { ...fetchedData };

    // Populate Form
    const nameInput = document.getElementById("userName");
    const emailInput = document.getElementById("userEmail");
    const imagePreview = document.getElementById("profileImagePreview");

    // Use values from fetched data, defaulting to empty string
    if (nameInput)
      nameInput.value = currentUserData.name || currentUserData.username || "";
    if (emailInput) emailInput.value = currentUserData.email || "";

    // Set Profile Image
    if (imagePreview) {
      const defaultImage =
        "https://res.cloudinary.com/ddqlt5oqu/image/upload/v1764967019/default_pi1ur8.webp";
      imagePreview.src = currentUserData.image || defaultImage;

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

// Unified Helper to Send Profile Updates
// This ensures that we always send the full payload required by the backend.
// changes: Object containing fields to update (e.g., { image: File } or { name: "New Name" })
async function sendProfileUpdate(
  changes,
  loadingElement = null,
  loadingText = "Saving..."
) {
  const token = localStorage.getItem("token");
  const userId = getUserId();

  if (!token || !userId) {
    alert("Session invalid. Please login again.");
    return;
  }

  let originalBtnHTML = "";
  if (loadingElement) {
    originalBtnHTML = loadingElement.innerHTML;
    loadingElement.disabled = true;
    loadingElement.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
  }

  try {
    const formData = new FormData();

    // 1. Merge current data with changes to get the "master" state for this update
    // We prioritize 'changes' but fall back to 'currentUserData'

    // Name
    const nameToSend = changes.has("name")
      ? changes.get("name")
      : currentUserData.name || currentUserData.username || "";
    formData.append("name", nameToSend);

    // Email
    const emailToSend = changes.has("email")
      ? changes.get("email")
      : currentUserData.email || "";
    formData.append("email", emailToSend);

    // Password (only if provided in changes)
    if (changes.has("password")) {
      formData.append("password", changes.get("password"));
    }

    // Image Handling
    // If changes has an 'image' file, use it.
    // If not, and we have an existing image URL, send that as a string.
    if (changes.has("image")) {
      // It's a file from the upload
      formData.append("image", changes.get("image"));
    } else if (currentUserData.image) {
      // Unchanged image URL
      formData.append("image", currentUserData.image);
    }

    console.log("Sending PUT request with full data...");

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Update failed:", data);
      throw new Error(
        data.message || `Update failed (Status: ${response.status})`
      );
    }

    // Update successful - refresh local state
    let updatedUserFields = null;
    if (Array.isArray(data)) {
      updatedUserFields = data[0];
    } else if (
      data.users &&
      Array.isArray(data.users) &&
      data.users.length > 0
    ) {
      updatedUserFields = data.users[0];
    } else if (data.user) {
      updatedUserFields = data.user;
    } else {
      updatedUserFields = data;
    }

    // Update Global State
    currentUserData = { ...currentUserData, ...updatedUserFields };

    // Update LocalStorage
    const storedUser = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : {};
    localStorage.setItem(
      "user",
      JSON.stringify({ ...storedUser, ...updatedUserFields })
    );

    // Return the updated data for caller to use if needed
    return updatedUserFields;
  } catch (error) {
    console.error("Error in sendProfileUpdate:", error);
    throw error; // Re-throw to let caller handle specific alerts if different
  } finally {
    if (loadingElement) {
      loadingElement.disabled = false;
      loadingElement.innerHTML = originalBtnHTML;
    }
  }
}

// Setup Event Listeners
function setupEventListeners() {
  const imageInput = document.getElementById("imageInput");
  const uploadTriggerBtn = document.getElementById("uploadTriggerBtn");

  if (uploadTriggerBtn && imageInput) {
    uploadTriggerBtn.addEventListener("click", function () {
      imageInput.click();
    });
  }

  // Handle file selection (Image Upload)
  if (imageInput) {
    imageInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert("Image size must be less than 5MB");
          this.value = "";
          return;
        }
        uploadProfileImage(file);
      }
    });
  }

  // General Form Submit (Text Fields)
  const form = document.getElementById("profileForm");
  if (form) {
    form.addEventListener("submit", handleProfileUpdate);
  }
}

// Upload Profile Image
async function uploadProfileImage(file) {
  const uploadBtn = document.getElementById("uploadTriggerBtn");
  const imagePreview = document.getElementById("profileImagePreview");

  // Optimistic Preview
  const reader = new FileReader();
  reader.onload = function (e) {
    if (imagePreview) imagePreview.src = e.target.result;
  };
  reader.readAsDataURL(file);

  // Prepare changes map
  const changes = new Map();
  changes.set("image", file);

  // Also grab current values from inputs as overrides just in case user typed but didn't save yet
  const nameInput = document.getElementById("userName");
  const emailInput = document.getElementById("userEmail");
  if (nameInput) changes.set("name", nameInput.value);
  if (emailInput) changes.set("email", emailInput.value);

  try {
    const updatedData = await sendProfileUpdate(
      changes,
      uploadBtn,
      "Uploading..."
    );

    // Confirm image update from server response
    if (updatedData.image && imagePreview) {
      imagePreview.src = updatedData.image;
    }
    alert("Profile image updated successfully!");
  } catch (error) {
    alert(error.message || "Failed to upload image");
    // Revert to saved state
    loadUserProfile();
  }
}

// Handle Profile Update (Form Submit)
async function handleProfileUpdate(e) {
  e.preventDefault();

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

  // Prepare Changes
  const changes = new Map();
  const nameInput = document.getElementById("userName");
  const emailInput = document.getElementById("userEmail");

  if (nameInput) changes.set("name", nameInput.value);
  if (emailInput) changes.set("email", emailInput.value);
  if (newPassword) changes.set("password", newPassword);

  const saveBtn = document.getElementById("saveBtn");

  try {
    await sendProfileUpdate(changes, saveBtn, "Saving...");

    alert("Profile info updated successfully!");

    // Clear password fields on success
    if (newPasswordInput) newPasswordInput.value = "";
    if (confirmPasswordInput) confirmPasswordInput.value = "";

    // Refresh UI to match perfectly
    loadUserProfile();
  } catch (error) {
    alert(error.message || "Failed to update profile");
  }
}
