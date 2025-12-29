import { ref, computed, watch } from "vue";

/**
 * Reusable pagination composable
 * @param {Ref<Array>} itemsRef - Reactive array of items to paginate
 * @param {number} pageSize - Number of items per page (default: 9)
 * @returns {Object} Pagination state and methods
 */
export function usePagination(itemsRef, pageSize = 9) {
  const currentPage = ref(1);

  // Calculate total pages based on items length
  const totalPages = computed(() =>
    Math.max(1, Math.ceil(itemsRef.value.length / pageSize))
  );

  // Get paginated items for current page
  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return itemsRef.value.slice(start, start + pageSize);
  });

  // Navigate to specific page
  const setPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  // Navigate to next page
  const next = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  // Navigate to previous page
  const prev = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  // Reset to first page
  const reset = () => {
    currentPage.value = 1;
  };

  // Watch for items changes and adjust current page if needed
  // (e.g., when filtering/searching or deleting items)
  watch(
    () => itemsRef.value.length,
    () => {
      // If current page is now empty (beyond total pages), go to last valid page
      if (currentPage.value > totalPages.value) {
        currentPage.value = Math.max(1, totalPages.value);
      }
    }
  );

  return {
    currentPage,
    totalPages,
    paginatedItems,
    setPage,
    next,
    prev,
    reset,
  };
}
