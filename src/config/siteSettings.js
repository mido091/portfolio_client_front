// Global Site Settings Configuration
// This is the single source of truth for all site-wide settings

export const siteSettings = {
  // Site Identity
  site: {
    name: "Ahmed Kaoud",
    tagline: "Portfolio & Dashboard",
    logoText: "Ahmed",
    logoAccent: "Kaoud",
    description: "Professional portfolio and dashboard system",
  },

  // Theme Colors
  colors: {
    // Primary brand color (orange accent)
    primary: "#ff4500",

    // Dark theme colors
    dark: {
      background: "#1c1c1d",
      surface: "#333",
      surfaceAlt: "#3e3e3e",
      text: "#fff",
      textSecondary: "#000",
      mobile: "#363636",
      placeholder: "#afafaf",
    },

    // Light theme colors
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

  // Theme Configuration
  theme: {
    default: "dark", // 'dark' or 'light'
    allowToggle: true,
    persistPreference: true, // Save user preference to localStorage
  },

  // Container Settings
  layout: {
    maxWidth: "1250px",
    containerPadding: "0 2rem",
  },

  // Animation Settings
  animations: {
    transitionSpeed: "0.3s",
    hoverTransform: "translateY(-7px)",
    glowEffect: "0 0 0.7rem",
  },

  // Social Links (optional - can be managed here too)
  social: {
    facebook: "https://www.facebook.com/share/15nQ9gTgBS/",
    instagram:
      "https://www.instagram.com/a7medka3oud?igsh=MWt4ZjdmczA4czh6ag==",
    twitter: "https://x.com/a7medka3oud?t=_A5jmuHr7HmIzL0HLKx5Rg&s=09",
  },
};

// Helper function to get current theme colors
export function getThemeColors(isDark = true) {
  return isDark ? siteSettings.colors.dark : siteSettings.colors.light;
}

// Helper function to apply CSS variables to document root
export function applySiteSettings(isDark = true) {
  const root = document.documentElement;
  const theme = getThemeColors(isDark);

  // Apply color variables
  root.style.setProperty("--color", siteSettings.colors.primary);
  root.style.setProperty("--bg-color", theme.background);
  root.style.setProperty("--box-bg", theme.surface);
  root.style.setProperty("--clr-bg", theme.surfaceAlt);
  root.style.setProperty("--first", theme.text);
  root.style.setProperty("--second", theme.textSecondary);
  root.style.setProperty("--mob-color", theme.mobile);
  root.style.setProperty("--place-clr", theme.placeholder);
  root.style.setProperty("--text-color", "#fff");

  // Apply layout variables
  root.style.setProperty("--max-width", siteSettings.layout.maxWidth);
  root.style.setProperty(
    "--container-padding",
    siteSettings.layout.containerPadding
  );

  // Apply animation variables
  root.style.setProperty(
    "--transition-speed",
    siteSettings.animations.transitionSpeed
  );
}

// Export default for easy import
export default siteSettings;
