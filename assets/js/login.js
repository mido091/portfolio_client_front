// Login & Register Page JavaScript with Backend API Integration

// API Configuration
const API_BASE_URL = "https://portfolio-client-server.vercel.app/api";
const API_ENDPOINTS = {
  register: `${API_BASE_URL}/users/register`,
  login: `${API_BASE_URL}/users/login`,
};

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {
  // Get form elements
  const loginToggle = document.getElementById("loginToggle");
  const registerToggle = document.getElementById("registerToggle");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const loginFormElement = document.getElementById("loginFormElement");
  const registerFormElement = document.getElementById("registerFormElement");
  const switchToRegister = document.getElementById("switchToRegister");
  const switchToLogin = document.getElementById("switchToLogin");

  // Check if user is already logged in
  checkAuthStatus();

  // Toggle between login and register forms
  function showLogin() {
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
    loginToggle.classList.add("active");
    registerToggle.classList.remove("active");
  }

  function showRegister() {
    registerForm.classList.add("active");
    loginForm.classList.remove("active");
    registerToggle.classList.add("active");
    loginToggle.classList.remove("active");
  }

  // Event listeners for toggle buttons
  loginToggle.addEventListener("click", showLogin);
  registerToggle.addEventListener("click", showRegister);
  switchToRegister.addEventListener("click", function (e) {
    e.preventDefault();
    showRegister();
  });
  switchToLogin.addEventListener("click", function (e) {
    e.preventDefault();
    showLogin();
  });

  // Create message element
  function createMessage(type, text) {
    const messageDiv = document.createElement("div");
    messageDiv.className =
      type === "error" ? "error-message show" : "success-message show";
    messageDiv.textContent = text;
    return messageDiv;
  }

  // Remove existing messages
  function removeMessages(form) {
    const messages = form.querySelectorAll(".error-message, .success-message");
    messages.forEach((msg) => msg.remove());
  }

  // Validate email format
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength (minimum 6 characters)
  function isValidPassword(password) {
    return password.length >= 6;
  }

  // Save user data to localStorage
  function saveUserData(userData, token) {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  }

  // Get user data from localStorage
  function getUserData() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check authentication status
  function checkAuthStatus() {
    const user = getUserData();
    if (user) {
      updateHeader(user);
    }
  }

  // Update header with user information
  function updateHeader(user) {
    const nav = document.querySelector("header nav");
    if (!nav) return;

    const listDarkModeMenu = nav.querySelector(".list-darkmode-menu");
    if (!listDarkModeMenu) return;

    const ul = listDarkModeMenu.querySelector("ul");
    if (!ul) return;

    // Remove existing user info if present
    const existingUserInfo = nav.querySelector(".user-info");
    if (existingUserInfo) {
      existingUserInfo.remove();
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

    // Add Dashboard link for admin/owner
    if (user.role === "admin" || user.role === "owner") {
      const existingDashboard = ul.querySelector('li a[href="dashboard.html"]');
      if (!existingDashboard) {
        const dashboardLi = document.createElement("li");
        const dashboardLink = document.createElement("a");
        dashboardLink.href = "dashboard.html";
        dashboardLink.textContent = "Dashboard";
        dashboardLi.appendChild(dashboardLink);
        ul.insertBefore(dashboardLi, ul.firstChild);
      }
    }

    // Add user name display
    const userName = document.createElement("span");
    userName.className = "user-name";
    userName.textContent = user.name;
    userName.style.cssText = `
            color: var(--first);
            font-size: 16px;
            font-weight: 500;
        `;

    // Add logout button
    const logoutBtn = document.createElement("button");
    logoutBtn.className = "logout-btn";
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
    logoutBtn.addEventListener("click", logout);

    userInfo.appendChild(userName);
    userInfo.appendChild(logoutBtn);

    // Insert user info before dark mode toggle
    const modeToggle = listDarkModeMenu.querySelector(".mode");
    if (modeToggle) {
      listDarkModeMenu.insertBefore(userInfo, modeToggle);
    } else {
      listDarkModeMenu.appendChild(userInfo);
    }
  }

  // Logout function
  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Remove user info from header
    const userInfo = document.querySelector(".user-info");
    if (userInfo) {
      userInfo.remove();
    }

    // Remove dashboard link
    const dashboardLink = document.querySelector(
      'header nav ul li a[href="dashboard.html"]'
    );
    if (dashboardLink) {
      dashboardLink.parentElement.remove();
    }

    // Redirect to login page
    window.location.href = "login.html";
  }

  // Register user via API
  async function registerUser(name, email, password) {
    try {
      const response = await fetch(API_ENDPOINTS.register, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Login user via API
  async function loginUser(email, password) {
    try {
      const response = await fetch(API_ENDPOINTS.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Login form submission
  loginFormElement.addEventListener("submit", async function (e) {
    e.preventDefault();
    removeMessages(loginFormElement);

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    // Validation checks
    if (!email || !password) {
      const message = createMessage("error", "Please fill in all fields");
      loginFormElement.insertBefore(message, loginFormElement.firstChild);
      return;
    }

    if (!isValidEmail(email)) {
      const message = createMessage(
        "error",
        "Please enter a valid email address"
      );
      loginFormElement.insertBefore(message, loginFormElement.firstChild);
      return;
    }

    if (!isValidPassword(password)) {
      const message = createMessage(
        "error",
        "Password must be at least 6 characters long"
      );
      loginFormElement.insertBefore(message, loginFormElement.firstChild);
      return;
    }

    // Show loading state
    const submitBtn = loginFormElement.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Logging in...";
    submitBtn.disabled = true;

    // Call API
    const result = await loginUser(email, password);

    // Reset button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;

    if (result.success) {
      // Backend returns: { username, role, token, message }
      // Transform to expected format: { name, role }
      const userData = {
        name: result.data.username,
        email: email,
        role: result.data.role,
      };

      console.log("Login successful - User data:", userData);
      console.log("Role detected:", userData.role);

      // Save user data and token
      saveUserData(userData, result.data.token);

      // Show success message
      const message = createMessage(
        "success",
        "Login successful! Redirecting..."
      );
      loginFormElement.insertBefore(message, loginFormElement.firstChild);

      // Update header
      updateHeader(userData);

      // Redirect to home page
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } else {
      // Show error message
      const message = createMessage("error", result.error);
      loginFormElement.insertBefore(message, loginFormElement.firstChild);
    }
  });

  // Register form submission
  registerFormElement.addEventListener("submit", async function (e) {
    e.preventDefault();
    removeMessages(registerFormElement);

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById(
      "registerConfirmPassword"
    ).value;
    const agreeTerms = document.getElementById("agreeTerms").checked;

    // Validation checks
    if (!name || !email || !password || !confirmPassword) {
      const message = createMessage("error", "Please fill in all fields");
      registerFormElement.insertBefore(message, registerFormElement.firstChild);
      return;
    }

    if (name.length < 3) {
      const message = createMessage(
        "error",
        "Name must be at least 3 characters long"
      );
      registerFormElement.insertBefore(message, registerFormElement.firstChild);
      return;
    }

    if (!isValidEmail(email)) {
      const message = createMessage(
        "error",
        "Please enter a valid email address"
      );
      registerFormElement.insertBefore(message, registerFormElement.firstChild);
      return;
    }

    if (!isValidPassword(password)) {
      const message = createMessage(
        "error",
        "Password must be at least 6 characters long"
      );
      registerFormElement.insertBefore(message, registerFormElement.firstChild);
      return;
    }

    if (password !== confirmPassword) {
      const message = createMessage("error", "Passwords do not match");
      registerFormElement.insertBefore(message, registerFormElement.firstChild);
      return;
    }

    if (!agreeTerms) {
      const message = createMessage(
        "error",
        "Please agree to the Terms & Conditions"
      );
      registerFormElement.insertBefore(message, registerFormElement.firstChild);
      return;
    }

    // Show loading state
    const submitBtn = registerFormElement.querySelector(
      'button[type="submit"]'
    );
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Registering...";
    submitBtn.disabled = true;

    // Call API
    const result = await registerUser(name, email, password);

    // Reset button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;

    if (result.success) {
      // Show success message
      const message = createMessage(
        "success",
        "Registration successful! Please login."
      );
      registerFormElement.insertBefore(message, registerFormElement.firstChild);

      // Switch to login form after delay
      setTimeout(() => {
        showLogin();
        registerFormElement.reset();
        removeMessages(registerFormElement);

        // Pre-fill email in login form
        document.getElementById("loginEmail").value = email;
      }, 1500);
    } else {
      // Show error message
      const message = createMessage("error", result.error);
      registerFormElement.insertBefore(message, registerFormElement.firstChild);
    }
  });

  // Real-time validation feedback
  const inputs = document.querySelectorAll(".input-group input");
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      if (this.value.trim() === "") {
        this.style.borderColor = "rgba(255, 0, 0, 0.5)";
      } else {
        this.style.borderColor = "";
      }
    });

    input.addEventListener("focus", function () {
      this.style.borderColor = "";
    });
  });

  // Email validation on blur
  const emailInputs = [
    document.getElementById("loginEmail"),
    document.getElementById("registerEmail"),
  ];

  emailInputs.forEach((input) => {
    input.addEventListener("blur", function () {
      if (this.value.trim() !== "" && !isValidEmail(this.value)) {
        this.style.borderColor = "rgba(255, 0, 0, 0.5)";
      }
    });
  });

  // Password match validation for register form
  const registerPassword = document.getElementById("registerPassword");
  const registerConfirmPassword = document.getElementById(
    "registerConfirmPassword"
  );

  registerConfirmPassword.addEventListener("input", function () {
    if (this.value !== "" && registerPassword.value !== this.value) {
      this.style.borderColor = "rgba(255, 0, 0, 0.5)";
    } else {
      this.style.borderColor = "";
    }
  });

  // ==================== FORGOT PASSWORD FUNCTIONALITY ====================

  // Get forgot password elements
  const forgotPasswordLink = document.querySelector(".forgot-password");
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  const forgotPasswordEmailForm = document.getElementById(
    "forgotPasswordEmailForm"
  );
  const forgotPasswordResetForm = document.getElementById(
    "forgotPasswordResetForm"
  );
  const backToLoginLink = document.getElementById("backToLogin");
  const resendOTPLink = document.getElementById("resendOTP");

  // Store OTP token
  let otpToken = null;
  let userEmail = null;

  // Show forgot password form
  function showForgotPassword() {
    loginForm.classList.remove("active");
    registerForm.classList.remove("active");
    forgotPasswordForm.classList.add("active");
    loginToggle.classList.remove("active");
    registerToggle.classList.remove("active");

    // Reset forms
    forgotPasswordEmailForm.reset();
    forgotPasswordResetForm.reset();
    forgotPasswordEmailForm.style.display = "block";
    forgotPasswordResetForm.style.display = "none";
    removeMessages(forgotPasswordEmailForm);
    removeMessages(forgotPasswordResetForm);
  }

  // Event listeners for forgot password navigation
  forgotPasswordLink.addEventListener("click", function (e) {
    e.preventDefault();
    showForgotPassword();
  });

  backToLoginLink.addEventListener("click", function (e) {
    e.preventDefault();
    showLogin();
  });

  // Step 1: Send OTP to email
  forgotPasswordEmailForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    removeMessages(forgotPasswordEmailForm);

    const email = document.getElementById("forgotEmail").value.trim();

    // Validation
    if (!email) {
      const message = createMessage("error", "Please enter your email address");
      forgotPasswordEmailForm.insertBefore(
        message,
        forgotPasswordEmailForm.firstChild
      );
      return;
    }

    if (!isValidEmail(email)) {
      const message = createMessage(
        "error",
        "Please enter a valid email address"
      );
      forgotPasswordEmailForm.insertBefore(
        message,
        forgotPasswordEmailForm.firstChild
      );
      return;
    }

    // Show loading state
    const submitBtn = forgotPasswordEmailForm.querySelector(
      'button[type="submit"]'
    );
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending OTP...";
    submitBtn.disabled = true;

    try {
      const response = await fetch(`${API_BASE_URL}/users/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      // Store token and email
      otpToken = data.token;
      userEmail = email;

      // Show success message
      const message = createMessage(
        "success",
        "OTP sent to your email! Please check your inbox."
      );
      forgotPasswordEmailForm.insertBefore(
        message,
        forgotPasswordEmailForm.firstChild
      );

      // Switch to reset form after delay
      setTimeout(() => {
        forgotPasswordEmailForm.style.display = "none";
        forgotPasswordResetForm.style.display = "block";
        removeMessages(forgotPasswordEmailForm);
      }, 2000);
    } catch (error) {
      console.error("Error sending OTP:", error);
      const message = createMessage("error", error.message);
      forgotPasswordEmailForm.insertBefore(
        message,
        forgotPasswordEmailForm.firstChild
      );

      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  // Step 2: Reset password with OTP
  forgotPasswordResetForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    removeMessages(forgotPasswordResetForm);

    const code = document.getElementById("otpCode").value.trim();
    const newPassword = document.getElementById("newPassword").value;
    const confirmNewPassword =
      document.getElementById("confirmNewPassword").value;

    // Validation
    if (!code || !newPassword || !confirmNewPassword) {
      const message = createMessage("error", "Please fill in all fields");
      forgotPasswordResetForm.insertBefore(
        message,
        forgotPasswordResetForm.firstChild
      );
      return;
    }

    if (!isValidPassword(newPassword)) {
      const message = createMessage(
        "error",
        "Password must be at least 6 characters long"
      );
      forgotPasswordResetForm.insertBefore(
        message,
        forgotPasswordResetForm.firstChild
      );
      return;
    }

    if (newPassword !== confirmNewPassword) {
      const message = createMessage("error", "Passwords do not match");
      forgotPasswordResetForm.insertBefore(
        message,
        forgotPasswordResetForm.firstChild
      );
      return;
    }

    if (!otpToken) {
      const message = createMessage(
        "error",
        "Session expired. Please request a new OTP"
      );
      forgotPasswordResetForm.insertBefore(
        message,
        forgotPasswordResetForm.firstChild
      );
      return;
    }

    // Show loading state
    const submitBtn = forgotPasswordResetForm.querySelector(
      'button[type="submit"]'
    );
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Resetting Password...";
    submitBtn.disabled = true;

    try {
      const response = await fetch(`${API_BASE_URL}/users/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: otpToken,
          code: code,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      // Show success message
      const message = createMessage(
        "success",
        "Password reset successful! Redirecting to login..."
      );
      forgotPasswordResetForm.insertBefore(
        message,
        forgotPasswordResetForm.firstChild
      );

      // Clear token
      otpToken = null;
      userEmail = null;

      // Redirect to login after delay
      setTimeout(() => {
        showLogin();
        forgotPasswordResetForm.reset();
        removeMessages(forgotPasswordResetForm);

        // Pre-fill email in login form
        if (userEmail) {
          document.getElementById("loginEmail").value = userEmail;
        }
      }, 2000);
    } catch (error) {
      console.error("Error resetting password:", error);
      const message = createMessage("error", error.message);
      forgotPasswordResetForm.insertBefore(
        message,
        forgotPasswordResetForm.firstChild
      );

      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  // Resend OTP
  resendOTPLink.addEventListener("click", async function (e) {
    e.preventDefault();

    if (!userEmail) {
      alert("Session expired. Please start over.");
      showForgotPassword();
      return;
    }

    removeMessages(forgotPasswordResetForm);

    try {
      const response = await fetch(`${API_BASE_URL}/users/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      // Update token
      otpToken = data.token;

      // Show success message
      const message = createMessage("success", "OTP resent successfully!");
      forgotPasswordResetForm.insertBefore(
        message,
        forgotPasswordResetForm.firstChild
      );

      // Remove message after 3 seconds
      setTimeout(() => {
        removeMessages(forgotPasswordResetForm);
      }, 3000);
    } catch (error) {
      console.error("Error resending OTP:", error);
      const message = createMessage("error", error.message);
      forgotPasswordResetForm.insertBefore(
        message,
        forgotPasswordResetForm.firstChild
      );
    }
  });
});
