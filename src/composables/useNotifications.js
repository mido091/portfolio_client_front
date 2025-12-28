import { ref, computed, onMounted, onUnmounted } from "vue";

const API_BASE = "https://portfolio-client-server.vercel.app/api";

// Reactive state (shared across all instances)
const briefs = ref([]);
const contacts = ref([]);
const lastSeenBriefAt = ref(localStorage.getItem("lastSeenBriefAt") || null);
const lastSeenContactAt = ref(
  localStorage.getItem("lastSeenContactAt") || null
);
const isLoading = ref(false);
const error = ref(null);

let refreshInterval = null;

/**
 * Composable for managing admin notifications
 * Detects new brief submissions and contact messages using frontend-only timestamp comparison
 */
export function useNotifications(userRole = null) {
  // Only fetch if user is admin or owner
  const isAdmin = computed(() => userRole === "admin" || userRole === "owner");

  /**
   * Fetch briefs from API
   */
  const fetchBriefs = async () => {
    try {
      const response = await fetch(`${API_BASE}/briefs`);
      if (!response.ok) throw new Error("Failed to fetch briefs");
      const data = await response.json();
      briefs.value = data?.data || [];
    } catch (err) {
      console.error("[useNotifications] Error fetching briefs:", err);
      error.value = err.message;
    }
  };

  /**
   * Fetch contacts from API
   */
  const fetchContacts = async () => {
    try {
      const response = await fetch(`${API_BASE}/contact`);
      if (!response.ok) throw new Error("Failed to fetch contacts");
      const data = await response.json();
      contacts.value = data?.data || [];
    } catch (err) {
      console.error("[useNotifications] Error fetching contacts:", err);
      error.value = err.message;
    }
  };

  /**
   * Fetch both briefs and contacts in parallel
   */
  const fetchAll = async () => {
    if (!isAdmin.value) return;

    isLoading.value = true;
    error.value = null;

    try {
      await Promise.all([fetchBriefs(), fetchContacts()]);
    } catch (err) {
      console.error("[useNotifications] Error fetching notifications:", err);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Get the latest timestamp from an array of items
   */
  const getLatestTimestamp = (items) => {
    if (!items || items.length === 0) return null;

    const timestamps = items
      .map((item) => item?.created_at)
      .filter(Boolean)
      .map((ts) => new Date(ts).getTime())
      .filter((t) => !isNaN(t));

    if (timestamps.length === 0) return null;
    return Math.max(...timestamps);
  };

  /**
   * Count new items by comparing timestamps
   */
  const countNewItems = (items, lastSeenTimestamp) => {
    if (!items || items.length === 0) return 0;
    if (!lastSeenTimestamp) return items.length; // All items are new if never seen

    const lastSeen = new Date(lastSeenTimestamp).getTime();
    if (isNaN(lastSeen)) return items.length;

    return items.filter((item) => {
      const itemTime = new Date(item?.created_at).getTime();
      return !isNaN(itemTime) && itemTime > lastSeen;
    }).length;
  };

  // Computed: Latest timestamps
  const latestBriefTimestamp = computed(() => getLatestTimestamp(briefs.value));
  const latestContactTimestamp = computed(() =>
    getLatestTimestamp(contacts.value)
  );

  // Computed: New item counts
  const newBriefCount = computed(() =>
    countNewItems(briefs.value, lastSeenBriefAt.value)
  );

  const newContactCount = computed(() =>
    countNewItems(contacts.value, lastSeenContactAt.value)
  );

  const totalNewCount = computed(
    () => newBriefCount.value + newContactCount.value
  );

  // Computed: Has new items
  const hasNewBriefs = computed(() => newBriefCount.value > 0);
  const hasNewContacts = computed(() => newContactCount.value > 0);
  const hasNewNotifications = computed(() => totalNewCount.value > 0);

  /**
   * Mark all notifications as seen
   * Updates localStorage with latest timestamps
   */
  const markAllAsSeen = () => {
    if (latestBriefTimestamp.value) {
      const timestamp = new Date(latestBriefTimestamp.value).toISOString();
      lastSeenBriefAt.value = timestamp;
      localStorage.setItem("lastSeenBriefAt", timestamp);
    }

    if (latestContactTimestamp.value) {
      const timestamp = new Date(latestContactTimestamp.value).toISOString();
      lastSeenContactAt.value = timestamp;
      localStorage.setItem("lastSeenContactAt", timestamp);
    }
  };

  /**
   * Mark only brief notifications as seen
   */
  const markBriefsAsSeen = () => {
    if (latestBriefTimestamp.value) {
      const timestamp = new Date(latestBriefTimestamp.value).toISOString();
      lastSeenBriefAt.value = timestamp;
      localStorage.setItem("lastSeenBriefAt", timestamp);
    }
  };

  /**
   * Mark only contact notifications as seen
   */
  const markContactsAsSeen = () => {
    if (latestContactTimestamp.value) {
      const timestamp = new Date(latestContactTimestamp.value).toISOString();
      lastSeenContactAt.value = timestamp;
      localStorage.setItem("lastSeenContactAt", timestamp);
    }
  };

  /**
   * Start periodic refresh (90 seconds)
   * Only runs if user is admin
   */
  const startPeriodicRefresh = () => {
    if (!isAdmin.value) return;

    // Clear any existing interval
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }

    // Refresh every 90 seconds
    refreshInterval = setInterval(() => {
      fetchAll();
    }, 90000);
  };

  /**
   * Stop periodic refresh
   */
  const stopPeriodicRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
  };

  // Lifecycle: Auto-fetch on mount (if admin)
  onMounted(() => {
    if (isAdmin.value) {
      fetchAll();
      startPeriodicRefresh();
    }
  });

  // Lifecycle: Cleanup on unmount
  onUnmounted(() => {
    stopPeriodicRefresh();
  });

  return {
    // State
    briefs,
    contacts,
    isLoading,
    error,

    // Computed
    newBriefCount,
    newContactCount,
    totalNewCount,
    hasNewBriefs,
    hasNewContacts,
    hasNewNotifications,

    // Methods
    fetchAll,
    markAllAsSeen,
    markBriefsAsSeen,
    markContactsAsSeen,
    startPeriodicRefresh,
    stopPeriodicRefresh,
  };
}
