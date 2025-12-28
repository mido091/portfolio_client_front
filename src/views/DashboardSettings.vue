<template>
  <div class="settings-container">
    <div class="settings-header">
      <h1>Site Settings</h1>
      <p>Manage your site configuration and appearance</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-skeleton">
      <div class="skeleton-card" v-for="i in 3" :key="i">
        <div class="skeleton-title"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <font-awesome-icon :icon="['fas', 'circle-exclamation']" size="3x" />
      <h3>Failed to Load Settings</h3>
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="fetchSettings">
        <font-awesome-icon :icon="['fas', 'rotate-right']" /> Retry
      </button>
    </div>

    <!-- Settings Form -->
    <form v-else @submit.prevent="saveSettings" class="settings-form">
      <div class="settings-grid">
        <!-- Site Identity Section -->
        <div class="settings-card">
          <h2>
            <font-awesome-icon :icon="['fas', 'globe']" />
            Site Identity
          </h2>

          <div class="form-group">
            <label>Site Name <span class="required">*</span></label>
            <input
              type="text"
              v-model="formSettings.site.name"
              required
              placeholder="Ahmed Kaoud"
            />
          </div>

          <div class="form-group">
            <label>Tagline</label>
            <input
              type="text"
              v-model="formSettings.site.tagline"
              placeholder="Portfolio & Dashboard"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Logo Text</label>
              <input
                type="text"
                v-model="formSettings.site.logoText"
                placeholder="Ahmed"
              />
            </div>
            <div class="form-group">
              <label>Logo Accent</label>
              <input
                type="text"
                v-model="formSettings.site.logoAccent"
                placeholder="Kaoud"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea
              v-model="formSettings.site.description"
              rows="3"
              placeholder="Professional portfolio and dashboard system"
            ></textarea>
          </div>
        </div>

        <!-- Theme Settings Section -->
        <div class="settings-card">
          <h2>
            <font-awesome-icon :icon="['fas', 'palette']" />
            Theme Settings
          </h2>

          <div class="form-group">
            <label>Default Theme</label>
            <select v-model="formSettings.theme.default">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>

          <div class="form-group">
            <label class="toggle-label">
              <input type="checkbox" v-model="formSettings.theme.allowToggle" />
              <span>Allow Theme Toggle</span>
            </label>
            <small>Let users switch between dark and light themes</small>
          </div>

          <div class="form-group">
            <label class="toggle-label">
              <input
                type="checkbox"
                v-model="formSettings.theme.persistPreference"
              />
              <span>Persist User Preference</span>
            </label>
            <small>Remember user's theme choice in localStorage</small>
          </div>
        </div>

        <!-- Primary Color Section -->
        <div class="settings-card">
          <h2>
            <font-awesome-icon :icon="['fas', 'droplet']" />
            Primary Color
          </h2>

          <div class="form-group">
            <label>Primary Color</label>
            <div class="color-input-group">
              <input
                type="color"
                v-model="formSettings.colors.primary"
                class="color-picker"
              />
              <input
                type="text"
                v-model="formSettings.colors.primary"
                placeholder="#ff4500"
                class="color-text"
              />
            </div>
            <small>Main accent color used throughout the site</small>
          </div>
        </div>

        <!-- Dark Theme Colors Section -->
        <div class="settings-card">
          <h2>
            <font-awesome-icon :icon="['fas', 'moon']" />
            Dark Theme Colors
          </h2>

          <div class="form-group">
            <label>Background</label>
            <div class="color-input-group">
              <input
                type="color"
                v-model="formSettings.colors.dark.background"
                class="color-picker"
              />
              <input
                type="text"
                v-model="formSettings.colors.dark.background"
                class="color-text"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Surface</label>
            <div class="color-input-group">
              <input
                type="color"
                v-model="formSettings.colors.dark.surface"
                class="color-picker"
              />
              <input
                type="text"
                v-model="formSettings.colors.dark.surface"
                class="color-text"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Surface Alt</label>
            <div class="color-input-group">
              <input
                type="color"
                v-model="formSettings.colors.dark.surfaceAlt"
                class="color-picker"
              />
              <input
                type="text"
                v-model="formSettings.colors.dark.surfaceAlt"
                class="color-text"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Text</label>
              <div class="color-input-group">
                <input
                  type="color"
                  v-model="formSettings.colors.dark.text"
                  class="color-picker"
                />
                <input
                  type="text"
                  v-model="formSettings.colors.dark.text"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  class="color-text"
                />
              </div>
            </div>
            <div class="form-group">
              <label>Text Secondary</label>
              <div class="color-input-group">
                <input
                  type="color"
                  v-model="formSettings.colors.dark.textSecondary"
                  class="color-picker"
                />
                <input
                  type="text"
                  v-model="formSettings.colors.dark.textSecondary"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  class="color-text"
                />
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Mobile</label>
              <div class="color-input-group">
                <input
                  type="color"
                  v-model="formSettings.colors.dark.mobile"
                  class="color-picker"
                />
                <input
                  type="text"
                  v-model="formSettings.colors.dark.mobile"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  class="color-text"
                />
              </div>
            </div>
            <div class="form-group">
              <label>Placeholder</label>
              <div class="color-input-group">
                <input
                  type="color"
                  v-model="formSettings.colors.dark.placeholder"
                  class="color-picker"
                />
                <input
                  type="text"
                  v-model="formSettings.colors.dark.placeholder"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  class="color-text"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Light Theme Colors Section -->
        <div class="settings-card">
          <h2>
            <font-awesome-icon :icon="['fas', 'sun']" />
            Light Theme Colors
          </h2>

          <div class="form-group">
            <label>Background</label>
            <div class="color-input-group">
              <input
                type="color"
                v-model="formSettings.colors.light.background"
                class="color-picker"
              />
              <input
                type="text"
                v-model="formSettings.colors.light.background"
                pattern="^#[0-9A-Fa-f]{6}$"
                class="color-text"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Surface</label>
            <div class="color-input-group">
              <input
                type="color"
                v-model="formSettings.colors.light.surface"
                class="color-picker"
              />
              <input
                type="text"
                v-model="formSettings.colors.light.surface"
                pattern="^#[0-9A-Fa-f]{6}$"
                class="color-text"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Surface Alt</label>
            <div class="color-input-group">
              <input
                type="color"
                v-model="formSettings.colors.light.surfaceAlt"
                class="color-picker"
              />
              <input
                type="text"
                v-model="formSettings.colors.light.surfaceAlt"
                pattern="^#[0-9A-Fa-f]{6}$"
                class="color-text"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Text</label>
              <div class="color-input-group">
                <input
                  type="color"
                  v-model="formSettings.colors.light.text"
                  class="color-picker"
                />
                <input
                  type="text"
                  v-model="formSettings.colors.light.text"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  class="color-text"
                />
              </div>
            </div>
            <div class="form-group">
              <label>Text Secondary</label>
              <div class="color-input-group">
                <input
                  type="color"
                  v-model="formSettings.colors.light.textSecondary"
                  class="color-picker"
                />
                <input
                  type="text"
                  v-model="formSettings.colors.light.textSecondary"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  class="color-text"
                />
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Mobile</label>
              <div class="color-input-group">
                <input
                  type="color"
                  v-model="formSettings.colors.light.mobile"
                  class="color-picker"
                />
                <input
                  type="text"
                  v-model="formSettings.colors.light.mobile"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  class="color-text"
                />
              </div>
            </div>
            <div class="form-group">
              <label>Placeholder</label>
              <div class="color-input-group">
                <input
                  type="color"
                  v-model="formSettings.colors.light.placeholder"
                  class="color-picker"
                />
                <input
                  type="text"
                  v-model="formSettings.colors.light.placeholder"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  class="color-text"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Layout Settings Section -->
        <div class="settings-card">
          <h2>
            <font-awesome-icon :icon="['fas', 'ruler-combined']" />
            Layout Settings
          </h2>

          <div class="form-group">
            <label>Max Width</label>
            <input
              type="text"
              v-model="formSettings.layout.maxWidth"
              placeholder="1250px"
            />
            <small>Maximum width for content containers</small>
          </div>

          <div class="form-group">
            <label>Container Padding</label>
            <input
              type="text"
              v-model="formSettings.layout.containerPadding"
              placeholder="0 2rem"
            />
            <small>Horizontal padding for containers</small>
          </div>
        </div>

        <!-- Animation Settings Section -->
        <div class="settings-card">
          <h2>
            <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" />
            Animation Settings
          </h2>

          <div class="form-group">
            <label>Transition Speed</label>
            <input
              type="text"
              v-model="formSettings.animations.transitionSpeed"
              placeholder="0.3s"
            />
            <small>Default transition duration (e.g., 0.3s, 300ms)</small>
          </div>

          <div class="form-group">
            <label>Hover Transform</label>
            <input
              type="text"
              v-model="formSettings.animations.hoverTransform"
              placeholder="translateY(-7px)"
            />
            <small>CSS transform on hover (e.g., translateY(-7px))</small>
          </div>

          <div class="form-group">
            <label>Glow Effect</label>
            <input
              type="text"
              v-model="formSettings.animations.glowEffect"
              placeholder="0 0 0.7rem"
            />
            <small>Box shadow for glow effects</small>
          </div>
        </div>

        <!-- Social Media Section -->
        <div class="settings-card">
          <h2>
            <font-awesome-icon :icon="['fas', 'share-nodes']" />
            Social Media Links
          </h2>

          <div class="form-group">
            <label>Facebook</label>
            <input
              type="url"
              v-model="formSettings.social.facebook"
              placeholder="https://facebook.com/username"
            />
          </div>

          <div class="form-group">
            <label>Instagram</label>
            <input
              type="url"
              v-model="formSettings.social.instagram"
              placeholder="https://instagram.com/username"
            />
          </div>

          <div class="form-group">
            <label>Twitter</label>
            <input
              type="url"
              v-model="formSettings.social.twitter"
              placeholder="https://twitter.com/username"
            />
          </div>
        </div>

        <!-- Live Preview Panel -->
        <div class="settings-card preview-card">
          <h2>
            <font-awesome-icon :icon="['fas', 'eye']" />
            Live Preview
          </h2>

          <div class="preview-content">
            <div class="preview-item">
              <label>Site Name:</label>
              <span>{{ settings.site.name || "N/A" }}</span>
            </div>
            <div class="preview-item">
              <label>Tagline:</label>
              <span>{{ settings.site.tagline || "N/A" }}</span>
            </div>
            <div class="preview-item">
              <label>Logo:</label>
              <span class="logo-preview">
                {{ settings.site.logoText }}
                <span class="accent">{{ settings.site.logoAccent }}</span>
              </span>
            </div>
            <div class="preview-item">
              <label>Primary Color:</label>
              <div class="color-swatch-group">
                <div
                  class="color-swatch"
                  :style="{ backgroundColor: settings.colors.primary }"
                ></div>
                <span>{{ settings.colors.primary }}</span>
              </div>
            </div>
            <div class="preview-item">
              <label>Dark Background:</label>
              <div class="color-swatch-group">
                <div
                  class="color-swatch"
                  :style="{ backgroundColor: settings.colors.dark.background }"
                ></div>
                <span>{{ settings.colors.dark.background }}</span>
              </div>
            </div>
            <div class="preview-item">
              <label>Light Background:</label>
              <div class="color-swatch-group">
                <div
                  class="color-swatch"
                  :style="{ backgroundColor: settings.colors.light.background }"
                ></div>
                <span>{{ settings.colors.light.background }}</span>
              </div>
            </div>
            <div class="preview-item">
              <label>Default Theme:</label>
              <span class="theme-badge" :class="settings.theme.default">
                {{ settings.theme.default }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Success/Error Message -->
      <div
        v-if="saveMessage.text"
        class="save-message"
        :class="saveMessage.type"
      >
        {{ saveMessage.text }}
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button
          type="button"
          class="btn btn-secondary"
          @click="resetForm"
          :disabled="saving"
        >
          <font-awesome-icon :icon="['fas', 'rotate-left']" />
          Reset
        </button>
        <button
          type="button"
          class="btn btn-warning"
          @click="resetToDefaults"
          :disabled="saving"
        >
          <font-awesome-icon :icon="['fas', 'rotate-right']" />
          Reset to Defaults
        </button>
        <button type="submit" class="btn btn-primary" :disabled="saving">
          <font-awesome-icon
            :icon="saving ? ['fas', 'spinner'] : ['fas', 'floppy-disk']"
            :spin="saving"
          />
          {{ saving ? "Saving..." : "Save Changes" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { useSettingsStore } from "@/stores/settingsStore";
import {
  deepClone,
  mergeKeepOld,
  normalizeColor,
} from "@/utils/settingsHelpers";

// Get the global settings store
const store = useSettingsStore();

// Local state for form editing
const formSettings = reactive({
  site: {
    name: "",
    tagline: "",
    logoText: "",
    logoAccent: "",
    description: "",
  },
  colors: {
    primary: "#ff4500",
    dark: {
      background: "#1c1c1d",
      surface: "#333",
      surfaceAlt: "#3e3e3e",
      text: "#fff",
      textSecondary: "#000",
      mobile: "#363636",
      placeholder: "#afafaf",
    },
    light: {
      background: "#f2f2f2",
      surface: "#e5e5e5",
      surfaceAlt: "#e5e5e5",
      text: "#222",
      textSecondary: "#fff",
      mobile: "#eae6e6",
      placeholder: "#6b6b6b",
    },
  },
  theme: {
    default: "dark",
    allowToggle: true,
    persistPreference: true,
  },
  layout: {
    maxWidth: "1250px",
    containerPadding: "0 2rem",
  },
  animations: {
    transitionSpeed: "0.3s",
    hoverTransform: "translateY(-7px)",
    glowEffect: "0 0 0.7rem",
  },
  social: {
    facebook: "",
    instagram: "",
    twitter: "",
  },
});

// Store original form state for reset
let originalFormSettings = null;

// UI state
const saving = ref(false);
const saveMessage = ref({ type: "", text: "" });

// Computed values from store
const loading = store.loading;
const error = store.error;
const settings = store.settings;

/**
 * Initialize Form with Store Data
 * Called on mount and after successful save
 */
function initializeForm() {
  if (store.settings.value) {
    const clonedSettings = deepClone(store.settings.value);
    Object.assign(formSettings, clonedSettings);
    originalFormSettings = deepClone(clonedSettings);
  }
}

/**
 * Save Settings
 * Merges form values with original, normalizes colors, and updates via API
 */
async function saveSettings() {
  console.log("[DashboardSettings] saveSettings called");
  console.log(
    "[DashboardSettings] Current formSettings:",
    deepClone(formSettings)
  );

  // Clear previous messages
  saveMessage.value = { type: "", text: "" };

  // Basic validation - only site name is required
  if (!formSettings.site?.name || !formSettings.site.name.trim()) {
    saveMessage.value = { type: "error", text: "Site name is required" };
    return;
  }

  saving.value = true;

  try {
    // Normalize all color values
    const normalizedSettings = deepClone(formSettings);

    if (normalizedSettings.colors) {
      normalizedSettings.colors.primary = normalizeColor(
        normalizedSettings.colors.primary
      );

      if (normalizedSettings.colors.dark) {
        for (const key in normalizedSettings.colors.dark) {
          normalizedSettings.colors.dark[key] = normalizeColor(
            normalizedSettings.colors.dark[key]
          );
        }
      }

      if (normalizedSettings.colors.light) {
        for (const key in normalizedSettings.colors.light) {
          normalizedSettings.colors.light[key] = normalizeColor(
            normalizedSettings.colors.light[key]
          );
        }
      }
    }

    // Merge with original to preserve unedited values
    const payload = mergeKeepOld(
      store.originalSettings.value || store.settings.value,
      normalizedSettings
    );

    console.log("[DashboardSettings] Sending payload to store:", payload);

    // Update via store
    const result = await store.updateSettings(payload);

    console.log("[DashboardSettings] Update result:", result);

    if (result.success) {
      console.log(
        "[DashboardSettings] Save successful, store.settings is now:",
        store.settings.value
      );

      // Re-initialize form with updated settings from store
      initializeForm();

      console.log(
        "[DashboardSettings] Form re-initialized with:",
        formSettings
      );

      // Show success message
      saveMessage.value = {
        type: "success",
        text: "Settings saved successfully! Changes applied to website.",
      };

      // Clear message after 3 seconds
      setTimeout(() => {
        saveMessage.value = { type: "", text: "" };
      }, 3000);
    } else {
      throw new Error(result.error || "Failed to save settings");
    }
  } catch (err) {
    console.error("[DashboardSettings] Error saving settings:", err);
    saveMessage.value = {
      type: "error",
      text: err.message || "Failed to save settings. Please try again.",
    };
  } finally {
    saving.value = false;
  }
}

/**
 * Reset Form to Last Fetched State
 * Restores form to the original values from when page loaded
 */
function resetForm() {
  console.log("[DashboardSettings] resetForm called");
  console.log(
    "[DashboardSettings] originalFormSettings:",
    originalFormSettings
  );

  if (originalFormSettings) {
    Object.assign(formSettings, deepClone(originalFormSettings));
    saveMessage.value = {
      type: "info",
      text: "Form reset to last loaded state",
    };
    setTimeout(() => {
      saveMessage.value = { type: "", text: "" };
    }, 2000);
  }
}

/**
 * Reset to Server Defaults
 * Calls API to reset settings to default values
 */
async function resetToDefaults() {
  if (
    !confirm(
      "Are you sure you want to reset all settings to default values? This cannot be undone."
    )
  ) {
    return;
  }

  saving.value = true;
  saveMessage.value = { type: "", text: "" };

  try {
    const response = await fetch(
      "https://portfolio-client-server.vercel.app/api/settings/reset",
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to reset settings: ${response.status}`);
    }

    // Re-fetch settings from server
    await store.fetchSettings();

    // Re-initialize form
    initializeForm();

    saveMessage.value = {
      type: "success",
      text: "Settings reset to defaults successfully!",
    };

    setTimeout(() => {
      saveMessage.value = { type: "", text: "" };
    }, 3000);
  } catch (err) {
    console.error("Error resetting settings:", err);
    saveMessage.value = {
      type: "error",
      text: err.message || "Failed to reset settings. Please try again.",
    };
  } finally {
    saving.value = false;
  }
}

// REMOVED: This watcher was causing the form to reset after save
// The store already handles updates internally
// watch(
//   () => store.settings.value,
//   (newSettings) => {
//     if (newSettings && !saving.value) {
//       initializeForm();
//     }
//   },
//   { deep: true }
// );

// Initialize form on mount
onMounted(async () => {
  console.log("[DashboardSettings] Component mounted");

  // Ensure settings are loaded
  if (!store.settings.value || !store.lastLoadedAt.value) {
    console.log("[DashboardSettings] Settings not loaded, fetching...");
    await store.fetchSettings();
  }

  console.log("[DashboardSettings] Store settings:", store.settings.value);

  // Initialize form with store data
  initializeForm();

  console.log("[DashboardSettings] Form initialized with:", formSettings);
});
</script>

<style scoped>
/* Main Container */
.settings-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  color: white;
}

/* Header */
.settings-header {
  margin-bottom: 30px;
}

.settings-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
}

.settings-header p {
  color: #aaa;
  font-size: 14px;
}

/* Loading Skeleton */
.loading-skeleton {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.skeleton-card {
  background: rgb(56, 55, 55);
  padding: 20px;
  border-radius: 12px;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-title {
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 15px;
  width: 60%;
}

.skeleton-line {
  height: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  margin-bottom: 10px;
}

.skeleton-line.short {
  width: 70%;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Error State */
.error-state {
  text-align: center;
  padding: 60px 20px;
  background: rgb(56, 55, 55);
  border-radius: 12px;
}

.error-state svg {
  color: #e74c3c;
  margin-bottom: 20px;
}

.error-state h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: white;
}

.error-state p {
  color: #aaa;
  margin-bottom: 20px;
}

/* Settings Grid */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

/* Settings Card */
.settings-card {
  background: rgb(56, 55, 55);
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.3);
}

.settings-card h2 {
  font-size: 18px;
  font-weight: 600;
  color: #0481ff;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.settings-card h2 svg {
  font-size: 20px;
}

/* Form Elements */
.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #ddd;
}

.form-group label .required {
  color: #e74c3c;
}

.form-group input[type="text"],
.form-group input[type="url"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  background: rgb(40, 39, 39);
  border: 1px solid #444;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #0481ff;
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.form-group small {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #888;
}

/* Form Row (2 columns) */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

/* Toggle Label */
.toggle-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  margin-bottom: 0 !important;
}

.toggle-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #0481ff;
}

.toggle-label span {
  font-weight: 500;
}

/* Color Input Group */
.color-input-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.color-picker {
  width: 50px;
  height: 40px;
  padding: 2px;
  border: 1px solid #444;
  border-radius: 6px;
  background: rgb(40, 39, 39);
  cursor: pointer;
}

.color-text {
  flex: 1;
}

/* Preview Card */
.preview-card {
  grid-column: 1 / -1;
  background: linear-gradient(
    135deg,
    rgba(4, 129, 255, 0.1) 0%,
    rgba(4, 129, 255, 0.05) 100%
  );
  border: 1px solid rgba(4, 129, 255, 0.2);
}

.preview-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.preview-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.preview-item label {
  font-size: 12px;
  color: #888;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.preview-item span {
  font-size: 14px;
  color: white;
}

.logo-preview {
  font-size: 18px;
  font-weight: 600;
}

.logo-preview .accent {
  color: #0481ff;
}

.color-swatch-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.theme-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.theme-badge.dark {
  background: rgba(28, 28, 29, 0.8);
  border: 1px solid #444;
}

.theme-badge.light {
  background: rgba(242, 242, 242, 0.2);
  border: 1px solid #666;
}

/* Save Message */
.save-message {
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 500;
  font-size: 15px;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.save-message.success {
  background: rgba(34, 197, 94, 0.15);
  border: 2px solid rgba(34, 197, 94, 0.5);
  color: #22c55e;
}

.save-message.error {
  background: rgba(239, 68, 68, 0.15);
  border: 2px solid rgba(239, 68, 68, 0.5);
  color: #ef4444;
}

.save-message.info {
  background: rgba(59, 130, 246, 0.15);
  border: 2px solid rgba(59, 130, 246, 0.5);
  color: #3b82f6;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  padding: 20px;
  background: rgb(56, 55, 55);
  border-radius: 12px;
  position: sticky;
  bottom: 20px;
  z-index: 10;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #0481ff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0366cc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(4, 129, 255, 0.4);
}

.btn-secondary {
  background: #666;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #555;
}

.btn-warning {
  background: #f59e0b;
  color: white;
}

.btn-warning:hover:not(:disabled) {
  background: #d97706;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .settings-container {
    padding: 15px;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .preview-content {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
    position: static;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
