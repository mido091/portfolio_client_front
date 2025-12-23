const API_BASE_URL_2 = "https://portfolio-client-server.vercel.app/api";

document.addEventListener("DOMContentLoaded", () => {
  loadDashboardData();
  loadUserProfile();
});

function loadDashboardData() {
  const token = localStorage.getItem("token");
  if (!token) return; // Auth handled by other scripts/inline

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // User Count
  const userCount = document.getElementsByClassName("user_count")[0];
  if (userCount) {
    fetch(`${API_BASE_URL_2}/users`, { method: "GET", headers })
      .then((res) => res.json())
      .then((data) => {
        if (data.users) userCount.innerHTML = data.users.length;
      })
      .catch((err) => console.error("Error fetching users count:", err));
  }

  // Posts Count
  const postCount = document.getElementsByClassName("post_count")[0];
  if (postCount) {
    fetch(`${API_BASE_URL_2}/plogs`, { method: "GET", headers })
      .then((res) => res.json())
      .then((data) => {
        if (data.plogs) postCount.innerHTML = data.plogs.length;
      })
      .catch((err) => console.error("Error fetching posts count:", err));
  }
}

function loadUserProfile() {
  const token = localStorage.getItem("token");
  if (!token) return;

  // Utilize parseJwt from auth.js if available, or define locally if needed.
  // Assuming auth.js is loaded before this file as per dashboard.html order.
  let userId = null;
  if (typeof parseJwt === "function") {
    const decoded = parseJwt(token);
    userId = decoded ? decoded.id || decoded.userId || decoded._id : null;
  } else {
    // Basic fallback parsing if auth.js failed to load or parseJwt missing
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const decoded = JSON.parse(jsonPayload);
      userId = decoded.id || decoded.userId || decoded._id;
    } catch (e) {
      console.error("Error parsing JWT locally", e);
    }
  }

  if (!userId) {
    console.error("Could not extract User ID from token");
    return;
  }

  fetch(`${API_BASE_URL_2}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    })
    .then((data) => {
      // Robust data handling
      let user = null;
      if (Array.isArray(data)) user = data[0];
      else if (data.user) user = data.user;
      else if (data.users && data.users.length) user = data.users[0];
      else user = data; // Fallback

      if (user) {
        // Update Sidebar Image
        const profileImg = document.querySelector(".profile .img-box img");
        if (profileImg) {
          const defaultImage =
            "https://res.cloudinary.com/ddqlt5oqu/image/upload/v1764967019/default_pi1ur8.webp";
          profileImg.src = user.image || defaultImage;
          profileImg.onerror = () => {
            profileImg.src = defaultImage;
          };
        }

        // Update Sidebar Name
        const profileName = document.querySelector(".profile h2");
        if (profileName) {
          profileName.textContent = user.username || user.name || "User";
        }
      }
    })
    .catch((err) => console.error("Error loading profile:", err));
}
