// Composable for accessing site settings throughout the application
// This provides a reactive interface to site settings

import { ref, computed, watch } from "vue";
import siteSettings, { applySiteSettings } from "@/config/siteSettings";

// Reactive state for current theme
const isDarkMode = ref(true);

// Initialize theme from localStorage or default
const initializeTheme = () => {
  if (siteSettings.theme.persistPreference) {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      isDarkMode.value = savedTheme === "dark";
    } else {
      isDarkMode.value = siteSettings.theme.default === "dark";
    }
  } else {
    isDarkMode.value = siteSettings.theme.default === "dark";
  }

  // Apply theme on initialization
  applySiteSettings(isDarkMode.value);
  updateBodyClass(isDarkMode.value);
};

// Update body class for theme
const updateBodyClass = (isDark) => {
  if (isDark) {
    document.body.classList.remove("dark-mode");
  } else {
    document.body.classList.add("dark-mode");
  }
};

// Watch for theme changes and apply them
watch(isDarkMode, (newValue) => {
  applySiteSettings(newValue);
  updateBodyClass(newValue);

  if (siteSettings.theme.persistPreference) {
    localStorage.setItem("theme", newValue ? "dark" : "light");
  }
});

export function useSiteSettings() {
  // Site information
  const siteName = computed(() => siteSettings.site.name);
  const siteTagline = computed(() => siteSettings.site.tagline);
  const logoText = computed(() => siteSettings.site.logoText);
  const logoAccent = computed(() => siteSettings.site.logoAccent);
  const siteDescription = computed(() => siteSettings.site.description);

  // Colors
  const primaryColor = computed(() => siteSettings.colors.primary);
  const currentTheme = computed(() =>
    isDarkMode.value ? siteSettings.colors.dark : siteSettings.colors.light
  );

  // Theme state
  const isLightTheme = computed(() => !isDarkMode.value);

  // Social links
  const socialLinks = computed(() => siteSettings.social);

  // Layout settings
  const layoutSettings = computed(() => siteSettings.layout);

  // Theme toggle function
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
  };

  // Set specific theme
  const setTheme = (theme) => {
    isDarkMode.value = theme === "dark";
  };

  // Get all settings (for advanced use cases)
  const getAllSettings = () => siteSettings;

  return {
    // Site info
    siteName,
    siteTagline,
    logoText,
    logoAccent,
    siteDescription,

    // Colors
    primaryColor,
    currentTheme,

    // Theme state
    isDarkMode,
    isLightTheme,

    // Social
    socialLinks,

    // Layout
    layoutSettings,

    // Methods
    toggleTheme,
    setTheme,
    getAllSettings,
  };
}

// Initialize theme on module load
initializeTheme();
