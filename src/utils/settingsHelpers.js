// Helper utilities for settings management
// Deep clone, merge, and normalization functions

/**
 * Deep Clone Helper
 * Creates a deep copy of an object to avoid reference issues
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map((item) => deepClone(item));

  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * Deep Merge Helper
 * Merges source into target recursively, preferring source values
 */
export function mergeDeep(target, source) {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }

  return output;
}

function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * Merge Keep Old Helper
 * Merges formSettings into originalSettings, preserving original values
 * when form values are empty/null/undefined
 */
export function mergeKeepOld(original, form) {
  if (original === null || typeof original !== "object") {
    return form;
  }

  if (Array.isArray(original)) {
    if (Array.isArray(form) && form.length > 0) {
      return form;
    }
    return original;
  }

  const merged = {};

  for (const key in original) {
    if (original.hasOwnProperty(key)) {
      const originalValue = original[key];
      const formValue = form?.[key];

      const isEmpty =
        formValue === undefined ||
        formValue === null ||
        (typeof formValue === "string" && formValue.trim() === "");

      if (isEmpty) {
        merged[key] = originalValue;
      } else if (
        typeof originalValue === "object" &&
        !Array.isArray(originalValue)
      ) {
        merged[key] = mergeKeepOld(originalValue, formValue);
      } else {
        merged[key] = formValue;
      }
    }
  }

  for (const key in form) {
    if (form.hasOwnProperty(key) && !merged.hasOwnProperty(key)) {
      merged[key] = form[key];
    }
  }

  return merged;
}

/**
 * Normalize Color Helper
 * Accepts various color formats and normalizes to #RRGGBB
 */
export function normalizeColor(value) {
  if (!value || typeof value !== "string") return value;

  let color = value.trim();

  if (color.startsWith("#")) {
    color = color.substring(1);
  }

  if (color.length === 3) {
    color = color
      .split("")
      .map((c) => c + c)
      .join("");
  }

  if (color.length === 6 && /^[0-9A-Fa-f]{6}$/.test(color)) {
    return "#" + color;
  }

  return value;
}

/**
 * Normalize Settings Response
 * Ensures the settings object has all required fields
 * Merges API response with defaults for missing fields
 */
export function normalizeSettings(apiResponse, defaults) {
  if (!apiResponse || typeof apiResponse !== "object") {
    return deepClone(defaults);
  }

  // Handle wrapped response {data: {...}}
  const data = apiResponse.data || apiResponse;

  // Normalize colors
  const normalizedColors = {
    primary: normalizeColor(data.colors?.primary || defaults.colors.primary),
    dark: {},
    light: {},
  };

  // Normalize dark theme colors
  const darkKeys = [
    "background",
    "surface",
    "surfaceAlt",
    "text",
    "textSecondary",
    "mobile",
    "placeholder",
  ];
  darkKeys.forEach((key) => {
    normalizedColors.dark[key] = normalizeColor(
      data.colors?.dark?.[key] || defaults.colors.dark[key]
    );
  });

  // Normalize light theme colors
  darkKeys.forEach((key) => {
    normalizedColors.light[key] = normalizeColor(
      data.colors?.light?.[key] || defaults.colors.light[key]
    );
  });

  // Build complete settings object
  return {
    site: {
      name: data.site?.name || defaults.site.name,
      tagline: data.site?.tagline || defaults.site.tagline,
      logoText: data.site?.logoText || defaults.site.logoText,
      logoAccent: data.site?.logoAccent || defaults.site.logoAccent,
      description: data.site?.description || defaults.site.description,
    },
    colors: normalizedColors,
    theme: {
      default: data.theme?.default || defaults.theme.default,
      allowToggle: data.theme?.allowToggle ?? defaults.theme.allowToggle,
      persistPreference:
        data.theme?.persistPreference ?? defaults.theme.persistPreference,
    },
    layout: {
      maxWidth: data.layout?.maxWidth || defaults.layout.maxWidth,
      containerPadding:
        data.layout?.containerPadding || defaults.layout.containerPadding,
    },
    animations: {
      transitionSpeed:
        data.animations?.transitionSpeed || defaults.animations.transitionSpeed,
      hoverTransform:
        data.animations?.hoverTransform || defaults.animations.hoverTransform,
      glowEffect: data.animations?.glowEffect || defaults.animations.glowEffect,
    },
    social: {
      facebook: data.social?.facebook || defaults.social.facebook || "",
      instagram: data.social?.instagram || defaults.social.instagram || "",
      twitter: data.social?.twitter || defaults.social.twitter || "",
    },
  };
}
