// Global Settings Store - Single Source of Truth
// Fetches settings from API and provides reactive access throughout the app

import { ref, computed, watch } from "vue";
import { deepClone, normalizeSettings } from "@/utils/settingsHelpers";

const BASE_URL = "https://portfolio-client-server.vercel.app/api";

// Default fallback settings (used if API fails)
const DEFAULT_SETTINGS = {
  site: {
    name: "Ahmed Kaoud",
    tagline: "Portfolio & Dashboard",
    logoText: "Ahmed",
    logoAccent: "Kaoud",
    description: "Professional portfolio and dashboard system",
  },
  colors: {
    primary: "#ff4500",
    dark: {
      background: "#1c1c1d",
      surface: "#333333",
      surfaceAlt: "#3e3e3e",
      text: "#ffffff",
      textSecondary: "#000000",
      mobile: "#363636",
      placeholder: "#afafaf",
    },
    light: {
      background: "#f2f2f2",
      surface: "#e5e5e5",
      surfaceAlt: "#e5e5e5",
      text: "#222222",
      textSecondary: "#ffffff",
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
};

// Global reactive state
const settings = ref(null);
const originalSettings = ref(null);
const loading = ref(false);
const error = ref(null);
const lastLoadedAt = ref(null);
const isDarkMode = ref(true);

/**
 * Apply Settings to DOM (CSS Variables)
 * Maps settings to CSS custom properties on :root
 */
function applyToDom() {
  const currentSettings = settings.value || DEFAULT_SETTINGS;
  const theme = isDarkMode.value
    ? currentSettings.colors.dark
    : currentSettings.colors.light;

  console.log("[applyToDom] Applying settings to DOM:", {
    siteName: currentSettings.site.name,
    logoText: currentSettings.site.logoText,
    primaryColor: currentSettings.colors.primary,
    isDarkMode: isDarkMode.value,
    theme,
  });

  const root = document.documentElement;

  // Apply color variables
  root.style.setProperty("--color", currentSettings.colors.primary);
  root.style.setProperty("--bg-color", theme.background);
  root.style.setProperty("--box-bg", theme.surface);
  root.style.setProperty("--clr-bg", theme.surfaceAlt);
  root.style.setProperty("--first", theme.text);
  root.style.setProperty("--second", theme.textSecondary);
  root.style.setProperty("--mob-color", theme.mobile);
  root.style.setProperty("--place-clr", theme.placeholder);
  root.style.setProperty("--text-color", "#fff");

  // Apply layout variables
  root.style.setProperty("--max-width", currentSettings.layout.maxWidth);
  root.style.setProperty(
    "--container-padding",
    currentSettings.layout.containerPadding
  );

  // Apply animation variables
  root.style.setProperty(
    "--transition-speed",
    currentSettings.animations.transitionSpeed
  );

  // Update body class for theme
  if (isDarkMode.value) {
    document.body.classList.remove("dark-mode");
  } else {
    document.body.classList.add("dark-mode");
  }

  // Update document title if site name changed
  if (currentSettings.site.name) {
    document.title = `${currentSettings.site.name} - ${
      currentSettings.site.tagline || "Portfolio"
    }`;
  }

  console.log("[applyToDom] DOM updated successfully");
}

/**
 * Fetch Settings from API
 * GET /settings returns the current site configuration
 */
async function fetchSettings() {
  console.log("[fetchSettings] Starting fetch from API...");
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(`${BASE_URL}/settings`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch settings: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("[fetchSettings] Raw API response:", data);

    // Normalize and merge with defaults
    const normalized = normalizeSettings(data, DEFAULT_SETTINGS);
    console.log("[fetchSettings] Normalized settings:", normalized);

    // CRITICAL: Only update if we don't have settings yet OR if this is an explicit refresh
    // This prevents overwriting user changes during save
    if (!settings.value || !lastLoadedAt.value) {
      settings.value = deepClone(normalized);
      originalSettings.value = deepClone(normalized);
      lastLoadedAt.value = Date.now();

      console.log("[fetchSettings] Settings initialized from API");

      // Initialize theme from settings
      const persistPreference = normalized.theme?.persistPreference ?? true;
      const defaultTheme = normalized.theme?.default ?? "dark";

      if (persistPreference) {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
          isDarkMode.value = savedTheme === "dark";
        } else {
          isDarkMode.value = defaultTheme === "dark";
        }
      } else {
        isDarkMode.value = defaultTheme === "dark";
      }

      // Apply to DOM
      applyToDom();
    } else {
      console.log("[fetchSettings] Skipping update - settings already loaded");
    }
  } catch (err) {
    console.error("[fetchSettings] Error:", err);
    error.value = err.message || "Failed to load settings";

    // Only use defaults if we have NO settings at all
    if (!settings.value) {
      console.log("[fetchSettings] Using default settings as fallback");
      settings.value = deepClone(DEFAULT_SETTINGS);
      originalSettings.value = deepClone(DEFAULT_SETTINGS);
      isDarkMode.value = DEFAULT_SETTINGS.theme.default === "dark";
      applyToDom();
    }
  } finally {
    loading.value = false;
  }
}

/**
 * Update Settings via API
 * PUT /settings with JSON body
 * CRITICAL: Does NOT re-fetch - uses the saved payload as source of truth
 */
async function updateSettings(payload) {
  console.log("[updateSettings] Starting update with payload:", payload);
  loading.value = true;
  error.value = null;

  try {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    console.log("[updateSettings] Sending PUT request...");

    const response = await fetch(`${BASE_URL}/settings`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });

    console.log("[updateSettings] Response status:", response.status);
    const responseText = await response.text();
    console.log("[updateSettings] Response body:", responseText);

    if (!response.ok) {
      let errorMessage = "Failed to update settings";
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    // CRITICAL FIX: Use the payload we sent as the new settings
    // Don't re-fetch because the backend might return stale data
    const normalized = normalizeSettings(payload, DEFAULT_SETTINGS);
    console.log("[updateSettings] Normalized payload for store:", normalized);

    // Update store with the saved data
    settings.value = deepClone(normalized);
    originalSettings.value = deepClone(normalized);
    lastLoadedAt.value = Date.now();

    console.log("[updateSettings] Store updated with new settings");
    console.log("[updateSettings] Current store.settings:", settings.value);

    // Apply changes to DOM immediately
    applyToDom();

    console.log("[updateSettings] Success! Settings applied to DOM");

    return { success: true, data: normalized };
  } catch (err) {
    console.error("[updateSettings] Error:", err);
    error.value = err.message || "Failed to update settings";
    return { success: false, error: err.message };
  } finally {
    loading.value = false;
  }
}

/**
 * Reset to Last Fetched Settings
 * Restores settings to the last successfully saved state
 */
function resetToLastFetched() {
  if (originalSettings.value) {
    console.log("[resetToLastFetched] Restoring to original settings");
    settings.value = deepClone(originalSettings.value);
    applyToDom();
  }
}

/**
 * Reset to Default Settings (local fallback)
 */
function resetToDefault() {
  console.log("[resetToDefault] Restoring to default settings");
  settings.value = deepClone(DEFAULT_SETTINGS);
  originalSettings.value = deepClone(DEFAULT_SETTINGS);
  applyToDom();
}

/**
 * Toggle Theme (Dark/Light)
 */
function toggleTheme() {
  isDarkMode.value = !isDarkMode.value;

  if (settings.value?.theme?.persistPreference) {
    localStorage.setItem("theme", isDarkMode.value ? "dark" : "light");
  }

  applyToDom();
}

/**
 * Set Specific Theme
 */
function setTheme(theme) {
  isDarkMode.value = theme === "dark";

  if (settings.value?.theme?.persistPreference) {
    localStorage.setItem("theme", theme);
  }

  applyToDom();
}

// Watch settings for changes and re-apply to DOM
// REMOVED: This was causing settings to revert after save
// watch(settings, () => {
//   applyToDom();
// }, { deep: true });

// Watch theme changes
watch(isDarkMode, () => {
  applyToDom();
});

// Composable function to use in components
export function useSettingsStore() {
  return {
    // State
    settings: computed(() => settings.value),
    originalSettings: computed(() => originalSettings.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    lastLoadedAt: computed(() => lastLoadedAt.value),
    isDarkMode: computed(() => isDarkMode.value),
    isLightTheme: computed(() => !isDarkMode.value),

    // Computed values for easy access
    siteName: computed(
      () => settings.value?.site?.name || DEFAULT_SETTINGS.site.name
    ),
    siteTagline: computed(
      () => settings.value?.site?.tagline || DEFAULT_SETTINGS.site.tagline
    ),
    logoText: computed(
      () => settings.value?.site?.logoText || DEFAULT_SETTINGS.site.logoText
    ),
    logoAccent: computed(
      () => settings.value?.site?.logoAccent || DEFAULT_SETTINGS.site.logoAccent
    ),
    siteDescription: computed(
      () =>
        settings.value?.site?.description || DEFAULT_SETTINGS.site.description
    ),
    primaryColor: computed(
      () => settings.value?.colors?.primary || DEFAULT_SETTINGS.colors.primary
    ),
    currentTheme: computed(() =>
      isDarkMode.value
        ? settings.value?.colors?.dark
        : settings.value?.colors?.light
    ),
    socialLinks: computed(
      () => settings.value?.social || DEFAULT_SETTINGS.social
    ),
    layoutSettings: computed(
      () => settings.value?.layout || DEFAULT_SETTINGS.layout
    ),

    // Methods
    fetchSettings,
    updateSettings,
    resetToLastFetched,
    resetToDefault,
    applyToDom,
    toggleTheme,
    setTheme,

    // Direct access to settings object (for advanced use)
    getAllSettings: () => settings.value,
    getDefaultSettings: () => DEFAULT_SETTINGS,
  };
}

// Export for direct use
export {
  settings,
  originalSettings,
  loading,
  error,
  isDarkMode,
  fetchSettings,
  updateSettings,
  resetToLastFetched,
  resetToDefault,
  applyToDom,
  toggleTheme,
  setTheme,
  DEFAULT_SETTINGS,
};
