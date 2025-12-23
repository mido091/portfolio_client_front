<template>
  <section class="profile-section">
    <div class="container">
      <div class="profile-container">
        <div class="profile-header">
          <h2>My <span>Profile</span></h2>
          <p>Manage your account settings and preferences</p>
        </div>

        <form @submit.prevent="handleProfileUpdate" class="profile-form">
          <!-- Profile Image -->
          <div class="profile-image-container">
            <div class="image-wrapper">
              <img
                :src="
                  imagePreview ||
                  user?.image ||
                  'https://res.cloudinary.com/ddqlt5oqu/image/upload/v1764967019/default_pi1ur8.webp'
                "
                alt="Profile"
              />
              <label for="imageInput" class="upload-overlay">
                <i class="fas fa-camera"></i>
                <span>Change</span>
              </label>
            </div>
            <input
              type="file"
              id="imageInput"
              @change="handleImageSelect"
              accept="image/*"
              hidden
            />

            <!-- Distinct Upload Trigger Button -->
            <div class="upload-btn-wrapper">
              <button
                type="button"
                @click="triggerImageSelect"
                class="btn-upload"
              >
                <i class="fas fa-upload"></i> Upload Image
              </button>
            </div>

            <p class="image-help">Allowed: JPG, PNG, GIF (Max 5MB)</p>
          </div>

          <!-- Messages -->
          <div v-if="statusMsg" :class="['status-message', statusType]">
            {{ statusMsg }}
          </div>

          <!-- Form Fields -->
          <div class="form-grid">
            <div class="form-group">
              <label>Full Name</label>
              <div class="input-wrapper">
                <i class="fas fa-user"></i>
                <input
                  v-model="formData.name"
                  type="text"
                  required
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div class="form-group">
              <label>Email Address</label>
              <div class="input-wrapper">
                <i class="fas fa-envelope"></i>
                <input
                  v-model="formData.email"
                  type="email"
                  required
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div class="form-group">
              <label>New Password (Optional)</label>
              <div class="input-wrapper">
                <i class="fas fa-lock"></i>
                <input
                  v-model="formData.password"
                  type="password"
                  placeholder="Leave blank to keep current"
                  minlength="6"
                />
              </div>
            </div>

            <div class="form-group">
              <label>Confirm New Password</label>
              <div class="input-wrapper">
                <i class="fas fa-lock"></i>
                <input
                  v-model="formData.confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <router-link to="/" class="btn-cancel">Cancel</router-link>
            <button type="submit" class="btn-save" :disabled="submitting">
              <i
                class="fas"
                :class="submitting ? 'fa-spinner fa-spin' : 'fa-save'"
              ></i>
              {{ submitting ? "Saving..." : "Save Changes" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";
import api from "@/services/api";
import "/src/assets/js/all.js/all.js";

const { user, setUser } = useAuth();

const submitting = ref(false);
const statusMsg = ref("");
const statusType = ref("error");
const imagePreview = ref(null);
const selectedFile = ref(null);

const formData = reactive({
  name: user.value?.name || "",
  email: user.value?.email || "",
  password: "",
  confirmPassword: "",
});

const handleImageSelect = (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const triggerImageSelect = () => {
  document.getElementById("imageInput").click();
};

const handleProfileUpdate = async () => {
  if (formData.password && formData.password !== formData.confirmPassword) {
    statusMsg.value = "Passwords do not match";
    statusType.value = "error";
    return;
  }

  submitting.value = true;
  statusMsg.value = "";

  try {
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    if (formData.password) payload.append("password", formData.password);
    if (selectedFile.value) payload.append("image", selectedFile.value);

    // Assuming endpoint /users/:id exists for update
    const data = await api(`/users/${user.value.id}`, {
      method: "PUT",
      body: payload,
      headers: { "Content-Type": undefined },
    });

    // Updated user data from backend
    if (data.user) {
      setUser(
        {
          id: data.user.id,
          name: data.user.username || data.user.name,
          email: data.user.email,
          image: data.user.image,
          role: data.user.role,
        },
        localStorage.getItem("token")
      );
    }

    statusMsg.value = "Profile updated successfully!";
    statusType.value = "success";
    formData.password = "";
    formData.confirmPassword = "";
  } catch (error) {
    statusMsg.value = error.message;
    statusType.value = "error";
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
@import "/src/assets/css/all.css/all.css";
@import "/src/assets/css/home/home.css";
@import "/src/assets/css/profile.css";

.status-message.error {
  background: #fdeaea;
  color: #d9534f;
  border: 1px solid #f5c6cb;
}
.status-message.success {
  background: #e9f7ef;
  color: #28a745;
  border: 1px solid #c3e6cb;
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
