// Blogs Management Dashboard JavaScript
import Quill from "quill";
import "quill/dist/quill.snow.css";

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
let quill = null; // Quill editor instance

// DOM Elements (will be initialized in DOMContentLoaded)
let blogForm = null;
let blogsTableBody = null;
let submitBtn = null;
let cancelBtn = null;
let formTitle = null;
let imageInput = null;
let imagePreview = null;
let imagePreviewContainer = null;
let removePreviewBtn = null;

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  // Initialize DOM elements
  blogForm = document.getElementById("blogForm");
  blogsTableBody = document.getElementById("blogsTableBody");
  submitBtn = document.getElementById("submitBtn");
  cancelBtn = document.getElementById("cancelBtn");
  formTitle = document.getElementById("formTitle");
  imageInput = document.getElementById("blogImage");
  imagePreview = document.getElementById("imagePreview");
  imagePreviewContainer = document.getElementById("imagePreviewContainer");
  removePreviewBtn = document.getElementById("removePreview");

  initializeQuill();
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

// Initialize Quill Editor
function initializeQuill() {
  const editorElement = document.getElementById("editor");
  if (!editorElement) {
    console.error("Editor element not found");
    return;
  }

  quill = new Quill("#editor", {
    theme: "snow",
    placeholder: "Write your blog description here...",
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["link", "image"],
        ["clean"],
      ],
    },
  });

  // Set default text color to black for visibility
  quill.format("color", "#000");
}

// Setup Event Listeners
function setupEventListeners() {
  if (blogForm) blogForm.addEventListener("submit", handleFormSubmit);
  if (cancelBtn) cancelBtn.addEventListener("click", resetForm);
  if (imageInput) imageInput.addEventListener("change", handleImagePreview);
  if (removePreviewBtn)
    removePreviewBtn.addEventListener("click", removeImagePreview);

  // Event delegation for dynamically created edit and delete buttons
  document.addEventListener("click", function (e) {
    // Handle Edit button click
    if (e.target.closest(".btn-edit-blog")) {
      const btn = e.target.closest(".btn-edit-blog");
      const blogId = btn.dataset.id;
      const header = btn.dataset.header;
      const title = btn.dataset.title;
      const description = btn.dataset.description;
      const footer = btn.dataset.footer;
      const image = btn.dataset.image;

      editBlog(blogId, header, title, description, footer, image);
    }

    // Handle Delete button click
    if (e.target.closest(".btn-delete-blog")) {
      const btn = e.target.closest(".btn-delete-blog");
      const blogId = btn.dataset.id;
      const header = btn.dataset.header;

      deleteBlog(blogId, header);
    }
  });
}

// Handle Image Preview
function handleImagePreview(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      if (imagePreview) imagePreview.src = e.target.result;
      if (imagePreviewContainer) imagePreviewContainer.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
}

// Remove Image Preview
function removeImagePreview() {
  if (imageInput) imageInput.value = "";
  if (imagePreview) imagePreview.src = "";
  if (imagePreviewContainer) imagePreviewContainer.style.display = "none";
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
    if (blogsTableBody) {
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
}

// Display Blogs in Table
function displayBlogs(blogs) {
  if (!blogsTableBody) return;

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
    .map((blog, index) => {
      // Store the actual data in a way that won't break HTML attributes
      const blogData = {
        id: blog.id,
        header: blog.header || "",
        title: blog.title || "",
        description: blog.description || "",
        footer: blog.footer || "",
        image: blog.image || "",
      };

      return `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHtml(blog.header) || "N/A"}</td>
      <td>${escapeHtml(blog.title) || "N/A"}</td>
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
          <button 
            class="btn btn-success btn-edit-blog" 
            data-id="${blogData.id}"
            data-header="${escapeForAttribute(blogData.header)}"
            data-title="${escapeForAttribute(blogData.title)}"
            data-description="${escapeForAttribute(blogData.description)}"
            data-footer="${escapeForAttribute(blogData.footer)}"
            data-image="${escapeForAttribute(blogData.image)}"
          >
            <i class="fas fa-edit"></i> Edit
          </button>
          <button 
            class="btn btn-danger btn-delete-blog" 
            data-id="${blogData.id}"
            data-header="${escapeForAttribute(blogData.header)}"
          >
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </td>
    </tr>
  `;
    })
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
  return div.innerHTML;
}

// Escape for HTML attributes (for data attributes)
function escapeForAttribute(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Unescape HTML entities
function unescapeHtml(text) {
  if (!text) return "";
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

// Handle Form Submit (Create or Update)
async function handleFormSubmit(e) {
  e.preventDefault();

  // Validate form
  const header = document.getElementById("blogHeader").value.trim();
  const title = document.getElementById("blogTitle").value.trim();
  const description = quill.root.innerHTML.trim(); // Get HTML from Quill
  const footer = document.getElementById("blogFooter").value.trim();
  const imageFile = imageInput.files[0];

  // Check if Quill editor is empty (only contains <p><br></p> or similar)
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = description;
  const textContent = tempDiv.textContent || tempDiv.innerText || "";

  if (!header || !title || !textContent.trim() || !footer) {
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
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Creating...';
    }

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
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-plus"></i> Create Blog';
    }
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
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Updating...';
    }

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
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-plus"></i> Create Blog';
    }
  }
}

// Edit Blog (Fill form with blog data)
function editBlog(blogId, header, title, description, footer, imageUrl) {
  isEditMode = true;
  currentEditingBlogId = blogId;
  currentImageUrl = imageUrl;

  const headerInput = document.getElementById("blogHeader");
  const titleInput = document.getElementById("blogTitle");
  const footerInput = document.getElementById("blogFooter");

  // Unescape HTML entities from data attributes
  if (headerInput) headerInput.value = unescapeHtml(header);
  if (titleInput) titleInput.value = unescapeHtml(title);

  // Set Quill content with unescaped HTML
  if (quill) {
    const unescapedDescription = unescapeHtml(description);
    quill.root.innerHTML = unescapedDescription;
  }

  if (footerInput) footerInput.value = unescapeHtml(footer);

  // Show existing image if available
  if (imageUrl) {
    if (imagePreview) imagePreview.src = imageUrl;
    if (imagePreviewContainer) imagePreviewContainer.style.display = "block";
  }

  // Clear file input but keep preview
  if (imageInput) imageInput.value = "";

  if (formTitle) formTitle.textContent = "Update Blog";
  if (submitBtn)
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Blog';
  if (cancelBtn) cancelBtn.style.display = "inline-flex";

  // Scroll to form
  const formContainer = document.querySelector(".blog-form-container");
  if (formContainer) formContainer.scrollIntoView({ behavior: "smooth" });
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

  if (blogForm) blogForm.reset();

  // Clear Quill editor
  if (quill) {
    quill.setContents([]);
  }

  removeImagePreview();
  if (formTitle) formTitle.textContent = "Create New Blog";
  if (submitBtn)
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Create Blog';
  if (cancelBtn) cancelBtn.style.display = "none";
}
