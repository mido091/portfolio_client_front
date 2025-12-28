<template>
  <div class="blogs-container">
    <div class="title-info">
      <p>Blogs Management</p>
      <font-awesome-icon :icon="['fas', 'pen']" />
    </div>

    <!-- Blog Form Section -->
    <div class="blog-form-container">
      <h3>{{ isEditMode ? "Update Blog" : "Create New Blog" }}</h3>
      <form @submit.prevent="handleFormSubmit" class="blog-form">
        <div class="form-grid">
          <div class="form-group">
            <label>Header <span class="required">*</span></label>
            <input
              v-model="formData.header"
              type="text"
              placeholder="e.g. Technology"
              required
            />
          </div>
          <div class="form-group">
            <label>Title <span class="required">*</span></label>
            <input
              v-model="formData.title"
              type="text"
              placeholder="Blog Title"
              required
            />
          </div>
          <div class="form-group full-width">
            <label>Description <span class="required">*</span></label>
            <div ref="editorRef" class="quill-editor"></div>
          </div>
          <div class="form-group">
            <label>Footer (Author Info) <span class="required">*</span></label>
            <input
              v-model="formData.footer"
              type="text"
              placeholder="Author name/info"
              required
            />
          </div>
          <div class="form-group">
            <label>Category</label>
            <select v-model="formData.category" class="category-select">
              <option value="">-- Select Category --</option>
              <option v-for="cat in uniqueCategories" :key="cat" :value="cat">
                {{ cat }}
              </option>
              <option value="__other__">Other (Custom)</option>
            </select>
            <!-- Custom category input (shown when "Other" is selected) -->
            <input
              v-if="formData.category === '__other__'"
              v-model="customCategory"
              type="text"
              placeholder="Enter custom category"
              class="custom-category-input"
            />
            <small>Optional: Categorize your blog post</small>
          </div>
          <div class="form-group">
            <label>Banner Image</label>
            <input type="file" @change="handleImageSelect" accept="image/*" />
            <small>Max size: 5MB</small>
          </div>
        </div>

        <!-- Image Preview -->
        <div v-if="imagePreview" class="image-preview">
          <div class="preview-box">
            <img :src="imagePreview" alt="Preview" />
            <button type="button" class="btn-clear" @click="clearImage">
              <font-awesome-icon :icon="['fas', 'times']" />
            </button>
          </div>
          <p>Banner Preview</p>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            <font-awesome-icon
              :icon="[
                'fas',
                submitting ? 'spinner' : isEditMode ? 'save' : 'plus',
              ]"
              :spin="submitting"
            />
            {{
              submitting
                ? isEditMode
                  ? "Saving..."
                  : "Posting..."
                : isEditMode
                ? "Update Blog"
                : "Publish Blog"
            }}
          </button>
          <button
            v-if="isEditMode"
            type="button"
            class="btn btn-secondary"
            @click="resetForm"
          >
            <font-awesome-icon :icon="['fas', 'times']" /> Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Blogs Table Section -->
    <div class="title-info">
      <p>Published Stories</p>
      <font-awesome-icon :icon="['fas', 'pen-fancy']" />
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Header</th>
            <th>Title</th>
            <th>Banner</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="6" class="status-cell">
              <font-awesome-icon :icon="['fas', 'spinner']" spin /> Loading...
            </td>
          </tr>
          <tr v-else-if="blogs.length === 0">
            <td colspan="6" class="status-cell">No blogs found.</td>
          </tr>
          <tr v-for="(blog, index) in blogs" :key="blog.id">
            <td>{{ index + 1 }}</td>
            <td>{{ blog.header }}</td>
            <td>{{ blog.title }}</td>
            <td>
              <img :src="blog.image" class="blog-img" />
            </td>
            <td>{{ new Date(blog.created_at).toLocaleDateString() }}</td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-success" @click="editBlog(blog)">
                  <font-awesome-icon :icon="['fas', 'edit']" />
                </button>
                <button class="btn btn-danger" @click="confirmDeleteBlog(blog)">
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import api from "@/services/api";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { normalizeCategory, getUniqueCategories } from "@/utils/categoryUtils";

const blogs = ref([]);
const loading = ref(true);
const submitting = ref(false);
const isEditMode = ref(false);
const currentEditingBlogId = ref(null);
const imagePreview = ref(null);
const selectedFile = ref(null);
const editorRef = ref(null);
const customCategory = ref(""); // For "Other" option
let quill = null;

const formData = reactive({
  header: "",
  title: "",
  footer: "",
  category: "", // Category field
});

// Computed property to get unique categories from existing blogs
const uniqueCategories = computed(() => {
  return getUniqueCategories(blogs.value);
});

const loadBlogs = async () => {
  loading.value = true;
  try {
    const data = await api("/plogs");
    blogs.value = data.plogs || [];
  } catch (error) {
    console.error("Error loading blogs:", error);
  } finally {
    loading.value = false;
  }
};

const initQuill = () => {
  if (editorRef.value && !quill) {
    quill = new Quill(editorRef.value, {
      theme: "snow",
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"],
          ["link", "blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
      },
    });
  }
};

const handleImageSelect = (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const clearImage = () => {
  selectedFile.value = null;
  imagePreview.value = null;
};

const resetForm = () => {
  isEditMode.value = false;
  currentEditingBlogId.value = null;
  formData.header = "";
  formData.title = "";
  formData.footer = "";
  formData.category = ""; // Reset category
  customCategory.value = ""; // Reset custom category
  if (quill) quill.setContents([]);
  clearImage();
};

const editBlog = (blog) => {
  isEditMode.value = true;
  currentEditingBlogId.value = blog.id;
  formData.header = blog.header;
  formData.title = blog.title;
  formData.footer = blog.footer;

  // Handle category: if it exists in the list, select it; otherwise use "Other"
  const blogCategory = normalizeCategory(blog.category);
  if (blogCategory && uniqueCategories.value.includes(blogCategory)) {
    formData.category = blogCategory;
    customCategory.value = "";
  } else if (blogCategory) {
    // Category exists but not in the list - use "Other"
    formData.category = "__other__";
    customCategory.value = blogCategory;
  } else {
    // No category
    formData.category = "";
    customCategory.value = "";
  }

  if (quill) quill.root.innerHTML = blog.description;
  imagePreview.value = blog.image;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleFormSubmit = async () => {
  submitting.value = true;
  try {
    const endpoint = isEditMode.value
      ? `/plogs/${currentEditingBlogId.value}`
      : "/plogs";
    const method = isEditMode.value ? "PUT" : "POST";

    const payload = new FormData();
    payload.append("header", formData.header);
    payload.append("title", formData.title);
    payload.append("description", quill.root.innerHTML);
    payload.append("footer", formData.footer);

    // Determine which category to send
    let categoryToSend = null;
    if (formData.category === "__other__") {
      // User selected "Other" - use custom category
      categoryToSend = normalizeCategory(customCategory.value);
    } else if (formData.category) {
      // User selected a predefined category
      categoryToSend = normalizeCategory(formData.category);
    }
    // If categoryToSend is still null, we send null (no category)

    if (categoryToSend) {
      payload.append("category", categoryToSend);
    }

    // Only append image if a new file was selected
    // For updates without new image, omit the field entirely
    if (selectedFile.value) {
      payload.append("image", selectedFile.value);
    }

    await api(endpoint, {
      method,
      body: payload,
    });

    resetForm();
    loadBlogs();
  } catch (error) {
    console.error("Error saving blog:", error);
    alert(
      `Failed to ${isEditMode.value ? "update" : "create"} blog: ${
        error.message
      }`
    );
  } finally {
    submitting.value = false;
  }
};

const confirmDeleteBlog = async (blog) => {
  if (!confirm(`Delete "${blog.title}"?`)) return;
  try {
    await api(`/plogs/${blog.id}`, { method: "DELETE" });
    loadBlogs();
  } catch (error) {
    console.error("Error deleting blog:", error);
  }
};

onMounted(() => {
  loadBlogs();
  nextTick(() => {
    initQuill();
  });
});
</script>

<style scoped>
.blog-form-container {
  background-color: rgb(56, 55, 55);
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  border: 1px solid rgba(4, 129, 255, 0.2);
}

.blog-form-container h3 {
  color: #0481ff;
  margin-bottom: 25px;
  font-size: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.full-width {
  grid-column: span 2;
}

.form-group label {
  color: white;
  font-size: 14px;
}

.form-group input {
  background: rgb(40, 39, 39);
  border: 1px solid #444;
  padding: 12px;
  border-radius: 6px;
  color: white;
  outline: none;
}

.form-group select.category-select {
  background: rgb(40, 39, 39);
  border: 1px solid #444;
  padding: 12px;
  border-radius: 6px;
  color: white;
  outline: none;
  cursor: pointer;
}

.form-group select.category-select option {
  background: rgb(40, 39, 39);
  color: white;
}

.custom-category-input {
  margin-top: 8px;
}

.form-group small {
  color: #999;
  font-size: 12px;
}

.quill-editor {
  min-height: 200px;
  background: white;
  color: black;
  border-radius: 6px;
}

.required {
  color: #e74c3c;
}

.image-preview {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.preview-box {
  position: relative;
  width: 150px;
}

.preview-box img {
  width: 100%;
  border-radius: 8px;
}

.btn-clear {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-actions {
  margin-top: 30px;
  display: flex;
  gap: 15px;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: white;
}

.btn-primary {
  background: #0481ff;
}
.btn-secondary {
  background: #666;
}

.status-cell {
  padding: 40px;
  color: #888;
  text-align: center;
}

.blog-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn-success {
  background: #27ae60;
}
.btn-danger {
  background: #c0392b;
}

@media (max-width: 992px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .full-width {
    grid-column: span 1;
  }

  /* Quill editor mobile improvements */
  .blog-form-container {
    padding: 20px 15px;
  }

  :deep(.ql-toolbar) {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  :deep(.ql-editor) {
    min-height: 200px;
    font-size: 14px;
  }

  /* Table mobile improvements */
  .table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  table {
    min-width: 600px;
    font-size: 13px;
  }

  table th,
  table td {
    padding: 8px 6px;
  }

  /* Form actions mobile */
  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
    min-height: 48px;
  }

  /* Image preview mobile */
  .preview-box {
    max-width: 100%;
  }

  .preview-box img {
    max-height: 200px;
  }
}

@media (max-width: 640px) {
  .blog-form-container h3 {
    font-size: 18px;
  }

  .form-group label {
    font-size: 13px;
  }

  .form-group input,
  .form-group textarea {
    font-size: 14px;
    padding: 10px;
  }

  table {
    min-width: 500px;
    font-size: 12px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 6px;
  }

  .action-buttons .btn {
    width: 100%;
    font-size: 12px;
    padding: 8px 12px;
  }
}
</style>
