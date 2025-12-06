document.addEventListener("DOMContentLoaded", () => {
  const blogContent = document.getElementById("blog-content");
  const loadingEl = document.getElementById("loading");
  const titleEl = document.getElementById("blog-title");
  const dateEl = document.getElementById("blog-date");
  const imageEl = document.getElementById("blog-image");
  const descEl = document.getElementById("blog-description-text");
  const footerEl = document.getElementById("blog-footer");
  const backBtn = document.getElementById("back-btn");

  // Get Blog ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const blogId = urlParams.get("id");

  // Check authentication (Allow any logged-in user)
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  if (!blogId) {
    loadingEl.textContent = "Blog ID not provided.";
    return;
  }

  // Fetch All Blogs and Filter
  fetch("https://portfolio-client-server.vercel.app/api/plogs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (res.status === 401) {
        // Unauthorized, redirect to login
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "login.html";
        throw new Error("Unauthorized");
      }
      if (!res.ok) throw new Error("Failed to fetch blogs");
      return res.json();
    })
    .then((response) => {
      const blogs = response.plogs || [];
      // Find the specific blog by ID (ensure type comparison works)
      const blog = blogs.find((b) => b.id == blogId);

      if (!blog) {
        throw new Error("Blog not found");
      }

      // Hide loading, show content
      loadingEl.style.display = "none";
      blogContent.classList.remove("hidden");

      // Render Data
      titleEl.textContent = blog.title;

      // Date Formatting
      const dateStr = blog.updated_at || blog.created_at;
      const date = new Date(dateStr);
      dateEl.textContent = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Image Handling
      if (blog.image) {
        imageEl.src = blog.image;
        imageEl.parentElement.style.display = "block";
      } else {
        imageEl.parentElement.style.display = "none";
      }

      // Description
      descEl.innerHTML = blog.description;

      // Footer / Author
      footerEl.textContent = blog.footer || "Unknown Author";

      // Detect Arabic content and apply RTL
      const content = blog.title + blog.description + (blog.footer || "");
      const isArabic = /[\u0600-\u06FF]/.test(content);
      if (isArabic) {
        blogContent.classList.add("rtl-post");
      }
    })
    .catch((err) => {
      if (err.message !== "Unauthorized") {
        console.error("Error fetching blog details:", err);
        loadingEl.textContent =
          err.message === "Blog not found"
            ? "Blog not found."
            : "Failed to load blog details. Please try again later.";
      }
    });

  // Back Button Logic
  backBtn.addEventListener("click", () => {
    window.location.href = "blogs.html";
  });
});
