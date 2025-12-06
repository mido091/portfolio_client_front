// Shared Authentication Utilities
// This file provides authentication functions for all pages

// Get user data from localStorage
function getUserData() {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}

// Get authentication token
function getToken() {
  return localStorage.getItem("token");
}

// Check if user is authenticated
function isAuthenticated() {
  return getUserData() !== null && getToken() !== null;
}

// Logout function
function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  // Redirect to home page
  window.location.href = "index.html";
}

// Update header based on authentication status
function updateHeaderForAuth() {
  const nav = document.querySelector("header nav");
  if (!nav) return;

  const listDarkModeMenu = nav.querySelector(".list-darkmode-menu");
  if (!listDarkModeMenu) return;

  const ul = listDarkModeMenu.querySelector("ul");
  if (!ul) return;

  // Remove existing auth elements
  const existingUserInfo = nav.querySelector(".user-info");
  const existingLoginLink = nav.querySelector(".login-link");
  const existingDashboardLink = ul.querySelector('li a[href="dashboard.html"]');

  if (existingUserInfo) existingUserInfo.remove();
  if (existingLoginLink) existingLoginLink.remove();
  if (existingDashboardLink) existingDashboardLink.parentElement.remove();

  const user = getUserData();

  console.log("Auth check - Saved user:", user);
  if (user) {
    console.log("User role detected:", user.role);
  }

  if (user) {
    // User is logged in - show user info and logout

    // Add Dashboard link for admin/owner
    if (user.role === "admin" || user.role === "owner") {
      console.log("Adding Dashboard link for role:", user.role);
      const dashboardLi = document.createElement("li");
      const dashboardLink = document.createElement("a");
      dashboardLink.href = "dashboard.html";
      dashboardLink.textContent = "Dashboard";
      dashboardLi.appendChild(dashboardLink);
      ul.insertBefore(dashboardLi, ul.firstChild);
    }

    // Create user info container
    const userInfo = document.createElement("div");
    userInfo.className = "user-info";
    userInfo.style.cssText = `
      display: flex;
      align-items: center;
      gap: 15px;
      margin-right: 20px;
    `;

    // Add user image
    const userImage = document.createElement("img");
    userImage.className = "user-avatar";
    userImage.src =
      user.image ||
      "https://res.cloudinary.com/ddqlt5oqu/image/upload/v1764967019/default_pi1ur8.webp";
    userImage.alt = user.name || user.username || "User";
    userImage.style.cssText = `
      width: 35px;
      height: 35px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--color);
    `;
    userImage.onerror = function () {
      this.src =
        "https://res.cloudinary.com/ddqlt5oqu/image/upload/v1764967019/default_pi1ur8.webp";
    };

    // Add user name display (Link to Profile)
    const userName = document.createElement("a");
    userName.href = "profile.html";
    userName.className = "user-name";
    userName.textContent = user.name || user.username || user.email;
    userName.style.cssText = `
      color: var(--first);
      font-size: 16px;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: color 0.3s ease;
    `;
    userName.addEventListener("mouseenter", function () {
      this.style.color = "var(--first-color-alt)";
    });
    userName.addEventListener("mouseleave", function () {
      this.style.color = "var(--first)";
    });

    // Add logout button
    const logoutBtn = document.createElement("button");
    logoutBtn.className = "logout-btn logout-trigger"; // Add logout-trigger class for modal
    logoutBtn.textContent = "Logout";
    logoutBtn.style.cssText = `
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 20px;
      color: #fff;
      background: var(--color);
      border: 2px solid var(--color);
      cursor: pointer;
      transition: all 0.3s ease;
    `;
    logoutBtn.addEventListener("mouseenter", function () {
      this.style.color = "var(--color)";
      this.style.background = "transparent";
    });
    logoutBtn.addEventListener("mouseleave", function () {
      this.style.color = "#fff";
      this.style.background = "var(--color)";
    });
    // Logout is now handled by logout-modal.js via the logout-trigger class

    userInfo.appendChild(userImage);
    userInfo.appendChild(userName);
    userInfo.appendChild(logoutBtn);

    // Insert user info before dark mode toggle
    const modeToggle = listDarkModeMenu.querySelector(".mode");
    if (modeToggle) {
      listDarkModeMenu.insertBefore(userInfo, modeToggle);
    } else {
      listDarkModeMenu.appendChild(userInfo);
    }
  } else {
    // User is NOT logged in - show Login link
    const loginLink = document.createElement("a");
    loginLink.href = "login.html";
    loginLink.className = "login-link";
    loginLink.textContent = "Login";
    loginLink.style.cssText = `
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 20px;
      color: #fff;
      background: var(--color);
      border: 2px solid var(--color);
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
      margin-right: 20px;
    `;
    loginLink.addEventListener("mouseenter", function () {
      this.style.color = "var(--color)";
      this.style.background = "transparent";
    });
    loginLink.addEventListener("mouseleave", function () {
      this.style.color = "#fff";
      this.style.background = "var(--color)";
    });

    // Insert login link before dark mode toggle
    const modeToggle = listDarkModeMenu.querySelector(".mode");
    if (modeToggle) {
      listDarkModeMenu.insertBefore(loginLink, modeToggle);
    } else {
      listDarkModeMenu.appendChild(loginLink);
    }
  }
}

// Check authentication status and update header
function checkAuth() {
  updateHeaderForAuth();
}

// Initialize authentication on page load
document.addEventListener("DOMContentLoaded", function () {
  checkAuth();
});
