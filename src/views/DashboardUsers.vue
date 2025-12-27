<template>
  <div class="users-container">
    <!-- Header Section -->
    <div class="title-info">
      <p>Users Management</p>
      <font-awesome-icon :icon="['fas', 'user-group']" />
    </div>

    <!-- User Form Section (Only visible for owner) -->
    <div v-if="isOwner" class="user-form-container" id="userFormContainer">
      <div class="form-header">
        <h3 id="formTitle">
          {{ isEditMode ? "Update User Account" : "Register New User" }}
        </h3>
        <p class="form-subtitle">
          Fill in the details below to manage access levels
        </p>
      </div>

      <form
        @submit.prevent="handleFormSubmit"
        id="userForm"
        class="styled-form"
      >
        <div class="form-grid">
          <div class="form-group">
            <label for="userName">Full Name</label>
            <input
              v-model="formData.name"
              type="text"
              id="userName"
              name="name"
              placeholder="Enter name"
              required
            />
          </div>
          <div class="form-group">
            <label for="userEmail">Email Address</label>
            <input
              v-model="formData.email"
              type="email"
              id="userEmail"
              name="email"
              placeholder="example@mail.com"
              required
            />
          </div>
          <div class="form-group">
            <label for="userPassword">
              Password
              <span class="optional-hint">{{
                isEditMode ? "(Leave empty to keep current)" : "*"
              }}</span>
            </label>
            <input
              v-model="formData.password"
              type="password"
              id="userPassword"
              name="password"
              :required="!isEditMode"
              placeholder="Min. 6 characters"
              minlength="6"
            />
          </div>
          <div class="form-group">
            <label for="userRole">Access Level / Role</label>
            <select v-model="formData.role" id="userRole" name="role" required>
              <option value="user">User (Standard Access)</option>
              <option value="admin">Admin (Full Management)</option>
              <option value="owner">Owner (Root Access)</option>
            </select>
          </div>
          <div class="form-group full-width-mobile">
            <label for="userImage">Profile Portrait (Optional)</label>
            <div class="file-input-wrapper">
              <input
                type="file"
                @change="handleImageSelect"
                id="userImage"
                name="image"
                accept="image/*"
              />
              <small class="help-text">JPG, PNG or WEBP. Max 5MB.</small>
            </div>
          </div>
        </div>

        <!-- Compact Image Preview Section -->
        <div v-if="imagePreview" class="preview-card-compact">
          <div class="preview-image-wrapper">
            <img
              :src="imagePreview"
              alt="Profile Preview"
              class="preview-img"
            />
            <button
              type="button"
              class="remove-img-btn"
              @click="clearImage"
              title="Remove Image"
            >
              <font-awesome-icon :icon="['fas', 'times']" />
            </button>
          </div>
          <div class="preview-details">
            <span class="preview-label">Image Selected</span>
            <small class="preview-subtext">Will be saved on update</small>
          </div>
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="btn btn-primary"
            id="submitBtn"
            :disabled="submitting"
          >
            <font-awesome-icon
              :icon="[
                'fas',
                submitting ? 'spinner' : isEditMode ? 'save' : 'user-plus',
              ]"
              :spin="submitting"
            />
            {{
              submitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Save Changes"
                : "Create User"
            }}
          </button>
          <button
            v-if="isEditMode"
            type="button"
            class="btn btn-secondary"
            id="cancelBtn"
            @click="resetForm"
          >
            <font-awesome-icon :icon="['fas', 'times']" /> Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Users Table Section -->
    <div class="title-info section-divider">
      <p>Registry Overview</p>
      <font-awesome-icon :icon="['fas', 'users']" />
    </div>

    <div class="table-wrapper">
      <table id="usersTable">
        <thead>
          <tr>
            <th>#</th>
            <th>Avatar</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Permission</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="6" class="status-cell">
              <font-awesome-icon :icon="['fas', 'spinner']" spin />
              <p>Fetching encrypted user data...</p>
            </td>
          </tr>
          <tr v-else-if="users.length === 0">
            <td colspan="6" class="empty-state">
              <font-awesome-icon :icon="['fas', 'users-slash']" />
              <p>No registers found in the database.</p>
            </td>
          </tr>
          <tr v-for="(u, index) in users" :key="u.id" class="table-row">
            <td>{{ index + 1 }}</td>
            <td class="avatar-cell">
              <img
                :src="
                  u.image ||
                  'https://res.cloudinary.com/ddqlt5oqu/image/upload/v1764967019/default_pi1ur8.webp'
                "
                alt="Avatar"
                class="row-avatar"
                @error="
                  $event.target.src =
                    'https://res.cloudinary.com/ddqlt5oqu/image/upload/v1764967019/default_pi1ur8.webp'
                "
              />
            </td>
            <td class="name-cell">{{ u.name || u.username }}</td>
            <td class="email-cell">{{ u.email }}</td>
            <td>
              <span :class="['role-badge', `role-${u.role}`]">{{
                u.role
              }}</span>
            </td>
            <td class="actions-cell">
              <div class="action-buttons-group">
                <template v-if="isOwner">
                  <button
                    class="btn-action btn-edit"
                    title="Edit User"
                    @click="editUser(u)"
                  >
                    <font-awesome-icon :icon="['fas', 'edit']" />
                  </button>
                  <button
                    class="btn-action btn-delete"
                    title="Remove User"
                    @click="confirmDeleteUser(u)"
                  >
                    <font-awesome-icon :icon="['fas', 'trash']" />
                  </button>
                </template>
                <button
                  v-else-if="isAdmin"
                  class="btn-action btn-view"
                  title="View Details"
                  @click="viewUser(u)"
                >
                  <font-awesome-icon :icon="['fas', 'eye']" />
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
import { ref, reactive, onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";
import api from "@/services/api";

const { isOwner, isAdmin } = useAuth();

const users = ref([]);
const loading = ref(true);
const submitting = ref(false);
const isEditMode = ref(false);
const currentEditingUserId = ref(null);
const imagePreview = ref(null);
const selectedFile = ref(null);

const formData = reactive({
  name: "",
  email: "",
  password: "",
  role: "user",
});

const loadUsers = async () => {
  loading.value = true;
  try {
    const data = await api("/users");
    users.value = data.users || [];
  } catch (error) {
    console.error("Critical error fetching users:", error);
  } finally {
    loading.value = false;
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
  const fileInput = document.getElementById("userImage");
  if (fileInput) fileInput.value = "";
};

const resetForm = () => {
  isEditMode.value = false;
  currentEditingUserId.value = null;
  formData.name = "";
  formData.email = "";
  formData.password = "";
  formData.role = "user";
  clearImage();
};

const editUser = (userToEdit) => {
  isEditMode.value = true;
  currentEditingUserId.value = userToEdit.id;
  formData.name = userToEdit.name || userToEdit.username;
  formData.email = userToEdit.email;
  formData.password = "";
  formData.role = userToEdit.role;
  imagePreview.value = userToEdit.image;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleFormSubmit = async () => {
  submitting.value = true;
  try {
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    if (formData.password) payload.append("password", formData.password);
    payload.append("role", formData.role);
    if (selectedFile.value) payload.append("image", selectedFile.value);

    const endpoint = isEditMode.value
      ? `/users/${currentEditingUserId.value}`
      : "/users/register";
    const method = isEditMode.value ? "PUT" : "POST";

    await api(endpoint, {
      method,
      body: payload,
    });

    resetForm();
    loadUsers();
  } catch (error) {
    console.error("Form submission failure:", error);
    alert("Operation failed. Please check console for details.");
  } finally {
    submitting.value = false;
  }
};

const confirmDeleteUser = async (u) => {
  if (
    !confirm(
      `Are you sure you want to permanently delete register "${
        u.name || u.email
      }"?`
    )
  )
    return;
  try {
    await api(`/users/${u.id}`, { method: "DELETE" });
    loadUsers();
  } catch (error) {
    console.error("Deletion failure:", error);
  }
};

const viewUser = (u) => {
  alert(
    `Register: ${u.name || u.username}\nEmail: ${u.email}\nSecurity Level: ${
      u.role
    }`
  );
};

onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.users-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Polished Form Section */
.user-form-container {
  background-color: #2a2a2a;
  padding: 25px;
  margin: 10px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border-left: 5px solid #0481ff;
}

.form-header {
  margin-bottom: 25px;
}

.form-header h3 {
  color: #0481ff;
  font-size: 24px;
  margin: 0 0 5px 0;
  font-weight: 700;
}

.form-subtitle {
  color: #888;
  font-size: 14px;
  margin: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
  margin-bottom: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #0481ff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.optional-hint {
  font-size: 11px;
  color: #666;
  text-transform: none;
  font-weight: normal;
}

.form-group input,
.form-group select {
  padding: 12px 15px;
  border: 1px solid #444;
  background-color: #1a1a1a;
  border-radius: 8px;
  font-size: 15px;
  color: #eee;
  outline: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-group input:focus,
.form-group select:focus {
  border-color: #0481ff;
  background-color: #222;
  box-shadow: 0 0 0 3px rgba(4, 129, 255, 0.15);
}

.help-text {
  color: #555;
  font-size: 11px;
  margin-top: 4px;
}

/* Compact Image Preview */
.preview-card-compact {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #1a1a1a;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 25px;
  border: 1px solid #333;
  width: fit-content;
}

.preview-image-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
}

.preview-img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #0481ff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.remove-img-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #ff4444;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s;
}

.remove-img-btn:hover {
  transform: scale(1.1);
  background: #cc0000;
}

.preview-details {
  display: flex;
  flex-direction: column;
}

.preview-label {
  color: #0481ff;
  font-weight: bold;
  font-size: 14px;
}

.preview-subtext {
  color: #666;
  font-size: 11px;
}

/* Actions Section */
.form-actions {
  display: flex;
  gap: 15px;
}

.btn {
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
  border: none;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.btn-primary {
  background-color: #0481ff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #036cd6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(4, 129, 255, 0.4);
}

.btn-secondary {
  background-color: #444;
  color: #ccc;
}

.btn-outline-danger {
  background: transparent;
  border: 1px solid #ff4444;
  color: #ff4444;
}

.btn-outline-danger:hover {
  background: #ff4444;
  color: white;
}

/* Table Polishing */
.section-divider {
  margin-top: 40px !important;
  opacity: 0.9;
}

.table-wrapper {
  margin: 10px;
  border-radius: 12px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

#usersTable {
  border-collapse: separate;
  border-spacing: 0 10px;
  min-width: 700px;
}

#usersTable th {
  padding: 15px;
  font-size: 13px;
  letter-spacing: 1px;
}

#usersTable td {
  background-color: #222;
  border: none;
  font-size: 14px;
}

#usersTable td:first-child {
  border-radius: 10px 0 0 10px;
}
#usersTable td:last-child {
  border-radius: 0 10px 10px 0;
}

.table-row {
  transition: transform 0.2s;
}

.table-row:hover td {
  background-color: #2c2c2c;
}

.avatar-cell {
  width: 60px;
}

.row-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 2px solid #555;
}

.role-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  white-space: nowrap;
}

.role-owner {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
  border: 1px solid #dc3545;
}
.role-admin {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  border: 1px solid #ffc107;
}
.role-user {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
  border: 1px solid #28a745;
}

.actions-cell {
  width: 120px;
  text-align: center !important;
}

.action-buttons-group {
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
}

/* Polished Action Buttons */
.btn-action {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  font-size: 14px;
}

.btn-edit {
  background: rgba(40, 167, 69, 0.15);
  color: #28a745;
  border: 1px solid rgba(40, 167, 69, 0.3);
}

.btn-edit:hover {
  background: #28a745;
  color: white;
  box-shadow: 0 0 10px rgba(40, 167, 69, 0.4);
}

.btn-delete {
  background: rgba(220, 53, 69, 0.15);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
}

.btn-delete:hover {
  background: #dc3545;
  color: white;
  box-shadow: 0 0 10px rgba(220, 53, 69, 0.4);
}

.btn-view {
  background: rgba(23, 162, 184, 0.15);
  color: #17a2b8;
  border: 1px solid rgba(23, 162, 184, 0.3);
}

.btn-view:hover {
  background: #17a2b8;
  color: white;
  box-shadow: 0 0 10px rgba(23, 162, 184, 0.4);
}

/* Desktop-Mobile Responsiveness */
@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .user-form-container {
    padding: 20px 15px;
    margin: 10px 5px;
  }

  .form-header h3 {
    font-size: 20px;
  }

  .form-grid {
    gap: 20px;
  }

  .table-wrapper {
    margin: 10px 0;
  }

  #usersTable th,
  #usersTable td {
    padding: 10px 8px;
    font-size: 12px;
  }

  .role-badge {
    font-size: 10px;
    padding: 4px 8px;
  }

  .btn-action {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }

  .action-buttons-group {
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .form-actions {
    flex-direction: column;
  }
  .btn {
    width: 100%;
    justify-content: center;
  }

  .preview-card-compact {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
