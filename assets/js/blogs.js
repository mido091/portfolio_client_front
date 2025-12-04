document.addEventListener("DOMContentLoaded", () => {
  const blogsContainer = document.getElementById("blogs-container");

  // Check authentication (Allow any logged-in user)
  const token = localStorage.getItem("token");

  if (!token) {
    // Not logged in, redirect to login
    window.location.href = "login.html";
    return;
  }

  // Fetch blogs from API with token
  fetch("https://portfolio-client-server.vercel.app/api/plogs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (res.status === 401) {
        // Token invalid or expired
        // Do NOT logout the user immediately; just redirect
        window.location.href = "login.html";
        throw new Error("Unauthorized");
      }
      return res.json();
    })
    .then((response) => {
      const data = response.plogs || [];

      if (data.length === 0) {
        blogsContainer.innerHTML = '<p class="loading">No blogs available.</p>';
        return;
      }

      // Sort blogs by updated_at (desc) then created_at (desc)
      data.sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at);
        const dateB = new Date(b.updated_at || b.created_at);
        return dateB - dateA;
      });

      // Clear previous content
      blogsContainer.innerHTML = "";

      // Create blog cards (display header only)
      data.forEach((blog) => {
        const card = document.createElement("div");
        card.className = "blog-card";

        const header = document.createElement("h3");
        header.textContent = blog.header;
        card.appendChild(header);

        // Click redirects to blog-details with correct id
        card.addEventListener("click", () => {
          window.location.href = `blog-details.html?id=${blog.id}`;
        });

        blogsContainer.appendChild(card);
      });
    })
    .catch((err) => {
      if (err.message !== "Unauthorized") {
        console.error("Error fetching blogs:", err);
        blogsContainer.innerHTML =
          '<p class="error-message">Failed to load blogs. Please try again later.</p>';
      }
    });
});
