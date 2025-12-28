// Composable for accessing site settings throughout the application
// This provides a reactive interface to site settings from the global store

import { useSettingsStore } from "@/stores/settingsStore";

// Re-export the settings store composable
// This maintains backward compatibility with existing code
export function useSiteSettings() {
  return useSettingsStore();
}

// Export default for easy import
export default useSiteSettings;
