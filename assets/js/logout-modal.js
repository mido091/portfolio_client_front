/**
 * Reusable Logout Confirmation Modal
 * Automatically works on any page with .log-out elements
 */

(function () {
  "use strict";

  console.log("[Logout Modal] Script loaded");

  // Modal HTML template
  const modalHTML = `
    <div class="logout-modal-overlay" id="logoutModalOverlay">
      <div class="logout-modal">
        <div class="logout-modal-header">
          <div class="logout-modal-icon">
            <i class="fas fa-sign-out-alt"></i>
          </div>
          <h2 class="logout-modal-title">Confirm Logout</h2>
        </div>
        <div class="logout-modal-body">
          <p class="logout-modal-message">Are you sure you want to log out?</p>
        </div>
        <div class="logout-modal-footer">
          <button class="logout-modal-btn logout-modal-btn-cancel" id="logoutModalCancel">
            <i class="fas fa-times"></i>
            Cancel
          </button>
          <button class="logout-modal-btn logout-modal-btn-logout" id="logoutModalConfirm">
            <i class="fas fa-sign-out-alt"></i>
            Log Out
          </button>
        </div>
      </div>
    </div>
  `;

  // Initialize modal on DOM ready
  function initLogoutModal() {
    console.log("[Logout Modal] Initializing...");

    // Inject modal HTML into body
    const modalContainer = document.createElement("div");
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);

    // Get modal elements
    const overlay = document.getElementById("logoutModalOverlay");
    const cancelBtn = document.getElementById("logoutModalCancel");
    const confirmBtn = document.getElementById("logoutModalConfirm");

    if (!overlay || !cancelBtn || !confirmBtn) {
      console.error("[Logout Modal] Failed to create modal elements");
      return;
    }

    console.log("[Logout Modal] Modal elements created successfully");

    // Show modal function
    function showModal() {
      console.log("[Logout Modal] Showing modal");
      overlay.classList.add("active");
      document.body.classList.add("logout-modal-open");
    }

    // Hide modal function
    function hideModal() {
      console.log("[Logout Modal] Hiding modal");
      overlay.classList.remove("active");
      document.body.classList.remove("logout-modal-open");
    }

    // Logout function
    function performLogout() {
      console.log("[Logout Modal] Performing logout");
      // Clear authentication data
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      // Redirect to login page
      window.location.href = "login.html";
    }

    // Event delegation for logout buttons - use capture phase
    document.addEventListener(
      "click",
      function (e) {
        // Check if clicked element or its parent has .log-out or .logout-trigger class
        const logoutElement = e.target.closest(".log-out, .logout-trigger");

        if (logoutElement) {
          console.log("[Logout Modal] Logout button clicked", e.target);
          e.preventDefault();
          e.stopPropagation(); // Prevent other handlers from executing
          e.stopImmediatePropagation(); // Prevent any other listeners on the same element
          showModal();
          return false;
        }
      },
      true
    ); // Use capture phase to intercept early

    console.log("[Logout Modal] Event listener attached");

    // Cancel button click
    cancelBtn.addEventListener("click", function () {
      hideModal();
    });

    // Confirm logout button click
    confirmBtn.addEventListener("click", function () {
      performLogout();
    });

    // Click outside modal to close
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        hideModal();
      }
    });

    // ESC key to close modal
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("active")) {
        hideModal();
      }
    });

    console.log("[Logout Modal] Initialization complete");
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    console.log("[Logout Modal] Waiting for DOMContentLoaded");
    document.addEventListener("DOMContentLoaded", initLogoutModal);
  } else {
    console.log("[Logout Modal] DOM already loaded, initializing immediately");
    initLogoutModal();
  }
})();
