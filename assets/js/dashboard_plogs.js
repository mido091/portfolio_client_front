// Blogs Management Dashboard JavaScript
// API Configuration
const API_BASE_URL = "https://portfolio-client-server.vercel.app/api";
const API_ENDPOINTS = {
  plogs: `${API_BASE_URL}/plogs`,
};

// Global Variables
let currentUser = null;
let currentEditingBlogId = null;
let isEditMode = false;
let currentImageUrl = null;

// DOM Elements
const blogForm = document.getElementById("blogForm");
const blogsTableBody = document.getElementById("blogsTableBody");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("formTitle");
const imageInput = document.getElementById("blogImage");
const imagePreview = document.getElementById("imagePreview");
const imagePreviewContainer = document.getElementById("imagePreviewContainer");
const removePreviewBtn = document.getElementById("removePreview");

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

  // Only owner and admin can access
  if (currentUser.role !== "admin" && currentUser.role !== "owner") {
    alert("Access denied. Admin or Owner role required.");
    window.location.href = "login.html";
    return;
  }

  // Update profile name
  const profileName = document.querySelector(".profile h2");
  if (profileName && currentUser.name) {
    profileName.textContent = currentUser.name;
  }

  // Load blogs
  loadBlogs();
}

// Setup Event Listeners
function setupEventListeners() {
  blogForm.addEventListener("submit", handleFormSubmit);
  cancelBtn.addEventListener("click", resetForm);
  imageInput.addEventListener("change", handleImagePreview);
  removePreviewBtn.addEventListener("click", removeImagePreview);
}

// Handle Image Preview
function handleImagePreview(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreviewContainer.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
}

// Remove Image Preview
function removeImagePreview() {
  imageInput.value = "";
  imagePreview.src = "";
  imagePreviewContainer.style.display = "none";
  currentImageUrl = null;
}

// Load Blogs from API
async function loadBlogs() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(API_ENDPOINTS.plogs, {
      method: "GET",
      headers: {
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
      throw new Error("Failed to fetch blogs");
    }

    const data = await response.json();
    const blogs = data.plogs || [];

    displayBlogs(blogs);
  } catch (error) {
    console.error("Error loading blogs:", error);
    blogsTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Failed to load blogs. Please try again.</p>
        </td>
      </tr>
    `;
  }
}

// Display Blogs in Table
function displayBlogs(blogs) {
  if (blogs.length === 0) {
    blogsTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          <i class="fas fa-blog"></i>
          <p>No blogs found. Create your first blog!</p>
        </td>
      </tr>
    `;
    return;
  }

  blogsTableBody.innerHTML = blogs
    .map(
      (blog, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${blog.header || "N/A"}</td>
      <td>${blog.title || "N/A"}</td>
      <td>
        ${
          blog.image
            ? `<img src="${blog.image}" alt="Blog Image" class="blog-image-thumb" />`
            : '<span class="no-image">No Image</span>'
        }
      </td>
      <td><span class="date-display">${formatDate(blog.created_at)}</span></td>
      <td><span class="date-display">${formatDate(blog.updated_at)}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-success" onclick="editBlog(${
            blog.id
          }, '${escapeHtml(blog.header)}', '${escapeHtml(
        blog.title
      )}', '${escapeHtml(blog.description)}', '${escapeHtml(
        blog.footer || ""
      )}', '${blog.image || ""}')">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn btn-danger" onclick="deleteBlog(${
            blog.id
          }, '${escapeHtml(blog.header)}')">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </td>
    </tr>
  `
    )
    .join("");
}

// Format Date
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML.replace(/'/g, "&#39;");
}

// Handle Form Submit (Create or Update)
async function handleFormSubmit(e) {
  e.preventDefault();

  // Validate form
  const header = document.getElementById("blogHeader").value.trim();
  const title = document.getElementById("blogTitle").value.trim();
  const description = document.getElementById("blogDescription").value.trim();
  const footer = document.getElementById("blogFooter").value.trim();
  const imageFile = imageInput.files[0];

  if (!header || !title || !description || !footer) {
    alert("Please fill in all required fields");
    return;
  }

  // For create mode, image is required
  if (!isEditMode && !imageFile) {
    alert("Please upload an image");
    return;
  }

  if (isEditMode) {
    await updateBlog(
      currentEditingBlogId,
      header,
      title,
      description,
      footer,
      imageFile
    );
  } else {
    await createBlog(header, title, description, footer, imageFile);
  }
}

// Create Blog
async function createBlog(header, title, description, footer, imageFile) {
  const token = localStorage.getItem("token");

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';

    const formData = new FormData();
    formData.append("header", header);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("footer", footer);
    formData.append("image", imageFile);

    const response = await fetch(API_ENDPOINTS.plogs, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create blog");
    }

    alert("Blog created successfully!");
    resetForm();
    loadBlogs();
  } catch (error) {
    console.error("Error creating blog:", error);
    alert(`Error: ${error.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Create Blog';
  }
}

// Update Blog
async function updateBlog(
  blogId,
  header,
  title,
  description,
  footer,
  imageFile
) {
  const token = localStorage.getItem("token");

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';

    const formData = new FormData();
    formData.append("header", header);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("footer", footer);

    // Only append image if a new one is selected
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch(`${API_ENDPOINTS.plogs}/${blogId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update blog");
    }

    alert("Blog updated successfully!");
    resetForm();
    loadBlogs();
  } catch (error) {
    console.error("Error updating blog:", error);
    alert(`Error: ${error.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Create Blog';
  }
}

// Edit Blog (Fill form with blog data)
function editBlog(blogId, header, title, description, footer, imageUrl) {
  isEditMode = true;
  currentEditingBlogId = blogId;
  currentImageUrl = imageUrl;

  // Decode HTML entities
  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  document.getElementById("blogHeader").value = decodeHtml(header);
  document.getElementById("blogTitle").value = decodeHtml(title);
  document.getElementById("blogDescription").value = decodeHtml(description);
  document.getElementById("blogFooter").value = decodeHtml(footer);

  // Show existing image if available
  if (imageUrl) {
    imagePreview.src = imageUrl;
    imagePreviewContainer.style.display = "block";
  }

  // Clear file input but keep preview
  imageInput.value = "";

  formTitle.textContent = "Update Blog";
  submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Blog';
  cancelBtn.style.display = "inline-flex";

  // Scroll to form
  document
    .querySelector(".blog-form-container")
    .scrollIntoView({ behavior: "smooth" });
}

// Delete Blog
async function deleteBlog(blogId, blogHeader) {
  if (!confirm(`Are you sure you want to delete blog "${blogHeader}"?`)) {
    return;
  }

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_ENDPOINTS.plogs}/${blogId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to delete blog");
    }

    alert("Blog deleted successfully!");
    loadBlogs();
  } catch (error) {
    console.error("Error deleting blog:", error);
    alert(`Error: ${error.message}`);
  }
}

// Reset Form
function resetForm() {
  isEditMode = false;
  currentEditingBlogId = null;
  currentImageUrl = null;

  blogForm.reset();
  removeImagePreview();
  formTitle.textContent = "Create New Blog";
  submitBtn.innerHTML = '<i class="fas fa-plus"></i> Create Blog';
  cancelBtn.style.display = "none";
}
