/**
 * Category utility functions for plogs
 * These helpers normalize, extract, and group plogs by category
 */

/**
 * Normalize a category string
 * @param {string|null} category - The category to normalize
 * @returns {string|null} - Trimmed category or null if empty
 */
export const normalizeCategory = (category) => {
  if (!category || typeof category !== "string") return null;
  const trimmed = category.trim();
  return trimmed === "" ? null : trimmed;
};

/**
 * Extract unique categories from an array of plogs
 * @param {Array} plogs - Array of plog objects
 * @returns {Array} - Sorted array of unique category names (excluding null/empty)
 */
export const getUniqueCategories = (plogs) => {
  if (!Array.isArray(plogs)) return [];

  const categorySet = new Set();

  plogs.forEach((plog) => {
    const normalized = normalizeCategory(plog.category);
    if (normalized) {
      categorySet.add(normalized);
    }
  });

  // Convert to array and sort alphabetically
  return Array.from(categorySet).sort((a, b) => a.localeCompare(b));
};

/**
 * Group plogs by category
 * @param {Array} plogs - Array of plog objects
 * @returns {Object} - Object with category names as keys and arrays of plogs as values
 */
export const groupByCategory = (plogs) => {
  if (!Array.isArray(plogs)) return {};

  const grouped = {};

  plogs.forEach((plog) => {
    const category = normalizeCategory(plog.category) || "Uncategorized";

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push(plog);
  });

  // Sort categories alphabetically, but keep "Uncategorized" last
  const sortedGrouped = {};
  const categories = Object.keys(grouped).sort((a, b) => {
    if (a === "Uncategorized") return 1;
    if (b === "Uncategorized") return -1;
    return a.localeCompare(b);
  });

  categories.forEach((category) => {
    sortedGrouped[category] = grouped[category];
  });

  return sortedGrouped;
};
