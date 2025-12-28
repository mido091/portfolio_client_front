<template>
  <div class="submissions-container">
    <!-- Brief Submissions Section -->
    <div class="title-info">
      <p>Brief Submissions</p>
      <font-awesome-icon :icon="['fas', 'file-lines']" />
    </div>

    <div class="section-card">
      <!-- Search Bar -->
      <div class="search-bar">
        <input
          v-model="searchBrief"
          type="text"
          placeholder="Search by name, email, or project type..."
          class="search-input"
        />
        <font-awesome-icon :icon="['fas', 'search']" class="search-icon" />
      </div>

      <!-- Loading State -->
      <div v-if="loadingBrief" class="status-message">
        <font-awesome-icon :icon="['fas', 'spinner']" spin /> Loading...
      </div>

      <!-- Error State -->
      <div v-else-if="errorBrief" class="status-message error">
        <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
        {{ errorBrief }}
      </div>

      <!-- Empty State -->
      <div v-else-if="paginatedBriefs.length === 0" class="status-message">
        <font-awesome-icon :icon="['fas', 'inbox']" />
        {{ searchBrief ? "No matching submissions" : "No submissions yet" }}
      </div>

      <!-- Desktop Table -->
      <div v-else class="table-wrapper">
        <table class="compact-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Project Type</th>
              <th>Budget</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="brief in paginatedBriefs" :key="brief?.id">
              <td>{{ brief?.id }}</td>
              <td>{{ brief?.full_name || "N/A" }}</td>
              <td>{{ brief?.email || "N/A" }}</td>
              <td>
                {{ brief?.project_type || brief?.project_type_other || "N/A" }}
              </td>
              <td>{{ brief?.budget || "N/A" }}</td>
              <td>{{ formatDate(brief?.created_at) }}</td>
              <td>
                <div class="action-buttons">
                  <button
                    class="btn btn-view"
                    @click="viewDetails('brief', brief)"
                    title="View Details"
                  >
                    <font-awesome-icon :icon="['fas', 'eye']" />
                  </button>
                  <button
                    class="btn btn-danger"
                    @click="confirmDelete('brief', brief)"
                    title="Delete"
                  >
                    <font-awesome-icon :icon="['fas', 'trash']" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div
        v-if="!loadingBrief && !errorBrief && paginatedBriefs.length > 0"
        class="mobile-cards"
      >
        <div
          v-for="brief in paginatedBriefs"
          :key="brief?.id"
          class="summary-card"
        >
          <div class="card-header">
            <h4>{{ brief?.full_name || "Unknown" }}</h4>
            <span class="card-id">#{{ brief?.id }}</span>
          </div>
          <div class="card-body">
            <div class="card-row">
              <strong>Email:</strong> {{ brief?.email || "N/A" }}
            </div>
            <div class="card-row">
              <strong>Project:</strong>
              {{ brief?.project_type || brief?.project_type_other || "N/A" }}
            </div>
            <div class="card-row">
              <strong>Budget:</strong> {{ brief?.budget || "N/A" }}
            </div>
            <div class="card-row">
              <strong>Created:</strong> {{ formatDate(brief?.created_at) }}
            </div>
          </div>
          <div class="card-actions">
            <button class="btn btn-view" @click="viewDetails('brief', brief)">
              <font-awesome-icon :icon="['fas', 'eye']" /> View Details
            </button>
            <button
              class="btn btn-danger"
              @click="confirmDelete('brief', brief)"
            >
              <font-awesome-icon :icon="['fas', 'trash']" /> Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPagesBrief > 1" class="pagination">
        <button
          class="btn btn-secondary"
          :disabled="currentPageBrief === 1"
          @click="currentPageBrief--"
        >
          <font-awesome-icon :icon="['fas', 'chevron-left']" /> Previous
        </button>
        <span class="page-info"
          >Page {{ currentPageBrief }} of {{ totalPagesBrief }}</span
        >
        <button
          class="btn btn-secondary"
          :disabled="currentPageBrief === totalPagesBrief"
          @click="currentPageBrief++"
        >
          Next <font-awesome-icon :icon="['fas', 'chevron-right']" />
        </button>
      </div>
    </div>

    <!-- Contact Messages Section -->
    <div class="title-info">
      <p>Contact Messages</p>
      <font-awesome-icon :icon="['fas', 'envelope']" />
    </div>

    <div class="section-card">
      <!-- Search Bar -->
      <div class="search-bar">
        <input
          v-model="searchContact"
          type="text"
          placeholder="Search by name, email, or subject..."
          class="search-input"
        />
        <font-awesome-icon :icon="['fas', 'search']" class="search-icon" />
      </div>

      <!-- Loading State -->
      <div v-if="loadingContact" class="status-message">
        <font-awesome-icon :icon="['fas', 'spinner']" spin /> Loading...
      </div>

      <!-- Error State -->
      <div v-else-if="errorContact" class="status-message error">
        <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
        {{ errorContact }}
      </div>

      <!-- Empty State -->
      <div v-else-if="paginatedContacts.length === 0" class="status-message">
        <font-awesome-icon :icon="['fas', 'inbox']" />
        {{ searchContact ? "No matching messages" : "No messages yet" }}
      </div>

      <!-- Desktop Table -->
      <div v-else class="table-wrapper">
        <table class="compact-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="contact in paginatedContacts" :key="contact?.id">
              <td>{{ contact?.id }}</td>
              <td>{{ contact?.full_name || contact?.name || "N/A" }}</td>
              <td>{{ contact?.email || "N/A" }}</td>
              <td>{{ contact?.subject || "N/A" }}</td>
              <td>{{ formatDate(contact?.created_at) }}</td>
              <td>
                <div class="action-buttons">
                  <button
                    class="btn btn-view"
                    @click="viewDetails('contact', contact)"
                    title="View Details"
                  >
                    <font-awesome-icon :icon="['fas', 'eye']" />
                  </button>
                  <button
                    class="btn btn-danger"
                    @click="confirmDelete('contact', contact)"
                    title="Delete"
                  >
                    <font-awesome-icon :icon="['fas', 'trash']" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div
        v-if="!loadingContact && !errorContact && paginatedContacts.length > 0"
        class="mobile-cards"
      >
        <div
          v-for="contact in paginatedContacts"
          :key="contact?.id"
          class="summary-card"
        >
          <div class="card-header">
            <h4>{{ contact?.full_name || contact?.name || "Unknown" }}</h4>
            <span class="card-id">#{{ contact?.id }}</span>
          </div>
          <div class="card-body">
            <div class="card-row">
              <strong>Email:</strong> {{ contact?.email || "N/A" }}
            </div>
            <div class="card-row">
              <strong>Subject:</strong> {{ contact?.subject || "N/A" }}
            </div>
            <div class="card-row">
              <strong>Created:</strong> {{ formatDate(contact?.created_at) }}
            </div>
          </div>
          <div class="card-actions">
            <button
              class="btn btn-view"
              @click="viewDetails('contact', contact)"
            >
              <font-awesome-icon :icon="['fas', 'eye']" /> View Details
            </button>
            <button
              class="btn btn-danger"
              @click="confirmDelete('contact', contact)"
            >
              <font-awesome-icon :icon="['fas', 'trash']" /> Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPagesContact > 1" class="pagination">
        <button
          class="btn btn-secondary"
          :disabled="currentPageContact === 1"
          @click="currentPageContact--"
        >
          <font-awesome-icon :icon="['fas', 'chevron-left']" /> Previous
        </button>
        <span class="page-info"
          >Page {{ currentPageContact }} of {{ totalPagesContact }}</span
        >
        <button
          class="btn btn-secondary"
          :disabled="currentPageContact === totalPagesContact"
          @click="currentPageContact++"
        >
          Next <font-awesome-icon :icon="['fas', 'chevron-right']" />
        </button>
      </div>
    </div>

    <!-- Details Drawer -->
    <div v-if="detailsDrawer.show" class="drawer-overlay" @click="closeDrawer">
      <div class="drawer" @click.stop>
        <div class="drawer-header">
          <h3>
            {{
              detailsDrawer.type === "brief"
                ? "Brief Submission Details"
                : "Contact Message Details"
            }}
          </h3>
          <button class="btn-close" @click="closeDrawer">
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
        </div>
        <div class="drawer-body">
          <div v-if="detailsDrawer.type === 'brief'" class="details-content">
            <!-- Logos Section -->
            <div
              v-if="extractLogos(detailsDrawer.item).length > 0"
              class="detail-section"
            >
              <h4>Logos</h4>
              <div class="logos-grid">
                <img
                  v-for="(logo, idx) in extractLogos(detailsDrawer.item)"
                  :key="idx"
                  :src="logo"
                  class="logo-thumb"
                  @click="openImageModal(extractLogos(detailsDrawer.item), idx)"
                  @error="(e) => (e.target.style.display = 'none')"
                  :alt="`Logo ${idx + 1}`"
                />
              </div>
            </div>

            <!-- All Fields Dynamically -->
            <div class="detail-section">
              <h4>All Fields</h4>
              <div
                v-for="[key, value] in filteredEntries"
                :key="key"
                class="detail-row"
                :class="{ 'full-width': isLongTextField(key) }"
              >
                <span class="label">{{ formatFieldName(key) }}:</span>
                <span class="value" :class="{ longtext: isLongTextField(key) }">
                  <a
                    v-if="isUrl(value)"
                    :href="value"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ value }}
                  </a>
                  <template v-else-if="isDateField(key)">
                    {{ formatDate(value) }}
                  </template>
                  <template v-else-if="isArrayField(key)">
                    {{ formatArray(value) }}
                  </template>
                  <template v-else>
                    {{ formatValue(value) }}
                  </template>
                </span>
              </div>
            </div>
          </div>

          <div v-else class="details-content">
            <!-- Contact Details - All Fields Dynamically -->
            <div class="detail-section">
              <h4>All Fields</h4>
              <div
                v-for="[key, value] in contactEntries"
                :key="key"
                class="detail-row"
                :class="{ 'full-width': isLongTextField(key) }"
              >
                <span class="label">{{ formatFieldName(key) }}:</span>
                <span class="value" :class="{ longtext: isLongTextField(key) }">
                  <template v-if="isDateField(key)">
                    {{ formatDate(value) }}
                  </template>
                  <template v-else>
                    {{ formatValue(value) }}
                  </template>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div
      v-if="imageModal.show"
      class="image-modal"
      @click.self="closeImageModal"
    >
      <button class="modal-close" @click="closeImageModal">
        <font-awesome-icon :icon="['fas', 'times']" />
      </button>
      <button
        v-if="imageModal.images.length > 1"
        class="modal-nav modal-prev"
        @click="prevImage"
        :disabled="imageModal.currentIndex === 0"
      >
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </button>
      <div class="modal-content">
        <img
          :src="imageModal.images[imageModal.currentIndex]"
          alt="Logo Preview"
        />
        <div class="modal-counter">
          {{ imageModal.currentIndex + 1 }} / {{ imageModal.images.length }}
        </div>
      </div>
      <button
        v-if="imageModal.images.length > 1"
        class="modal-nav modal-next"
        @click="nextImage"
        :disabled="imageModal.currentIndex === imageModal.images.length - 1"
      >
        <font-awesome-icon :icon="['fas', 'chevron-right']" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useNotifications } from "@/composables/useNotifications";

const { user } = useAuth();
const { markAllAsSeen } = useNotifications(user.value?.role);

// API helper
const BASE_URL = "https://portfolio-client-server.vercel.app/api";

async function api(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `API request failed: ${res.status} ${res.statusText}${
        text ? ` - ${text}` : ""
      }`
    );
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return { ok: true };
}

// State
const briefSubmissions = ref([]);
const loadingBrief = ref(true);
const errorBrief = ref(null);
const searchBrief = ref("");
const currentPageBrief = ref(1);

const contactMessages = ref([]);
const loadingContact = ref(true);
const errorContact = ref(null);
const searchContact = ref("");
const currentPageContact = ref(1);

const detailsDrawer = ref({
  show: false,
  type: null,
  item: null,
});

const imageModal = ref({
  show: false,
  images: [],
  currentIndex: 0,
});

const itemsPerPage = 10;

// Helper Functions
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatArray = (value) => {
  if (!value) return "N/A";

  try {
    if (typeof value === "string") {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.join(", ") : value;
    }
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return String(value);
  } catch {
    return String(value);
  }
};

const extractLogos = (brief) => {
  if (!brief) return [];
  const logos = [];
  for (let i = 1; i <= 5; i++) {
    const key = `logo_${i}`;
    if (brief[key]) logos.push(brief[key]);
  }
  return logos;
};

// Details Drawer Functions
const viewDetails = (type, item) => {
  detailsDrawer.value = {
    show: true,
    type,
    item,
  };
};

const closeDrawer = () => {
  detailsDrawer.value = {
    show: false,
    type: null,
    item: null,
  };
};

// Image Modal Functions
const openImageModal = (images, index) => {
  if (!Array.isArray(images) || images.length === 0) return;
  imageModal.value = { show: true, images, currentIndex: index || 0 };
};

const closeImageModal = () => {
  imageModal.value = { show: false, images: [], currentIndex: 0 };
};

const nextImage = () => {
  if (imageModal.value.currentIndex < imageModal.value.images.length - 1) {
    imageModal.value.currentIndex++;
  }
};

const prevImage = () => {
  if (imageModal.value.currentIndex > 0) {
    imageModal.value.currentIndex--;
  }
};

// API Functions
const fetchBriefSubmissions = async () => {
  loadingBrief.value = true;
  errorBrief.value = null;
  try {
    const response = await api("/briefs");
    briefSubmissions.value = response?.data || [];
  } catch (error) {
    console.error("Error fetching brief submissions:", error);
    errorBrief.value = error?.message || "Failed to load brief submissions";
    briefSubmissions.value = [];
  } finally {
    loadingBrief.value = false;
  }
};

const fetchContactMessages = async () => {
  loadingContact.value = true;
  errorContact.value = null;
  try {
    const response = await api("/contact");
    contactMessages.value = response?.data || [];
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    errorContact.value = error?.message || "Failed to load contact messages";
    contactMessages.value = [];
  } finally {
    loadingContact.value = false;
  }
};

const deleteBrief = async (id) => {
  try {
    await api(`/brief/${id}`, { method: "DELETE" });
    briefSubmissions.value = briefSubmissions.value.filter((b) => b?.id !== id);
    if (paginatedBriefs.value.length === 0 && currentPageBrief.value > 1) {
      currentPageBrief.value--;
    }
  } catch (error) {
    console.error("Error deleting brief:", error);
    alert("Failed to delete brief submission: " + (error?.message || ""));
  }
};

const deleteContact = async (id) => {
  try {
    await api(`/contact/${id}`, { method: "DELETE" });
    contactMessages.value = contactMessages.value.filter((c) => c?.id !== id);
    if (paginatedContacts.value.length === 0 && currentPageContact.value > 1) {
      currentPageContact.value--;
    }
  } catch (error) {
    console.error("Error deleting contact:", error);
    alert("Failed to delete contact message: " + (error?.message || ""));
  }
};

const confirmDelete = (type, item) => {
  if (!item) return;
  const name = item.full_name || item.name || "Unknown";
  const message =
    type === "brief"
      ? `Delete brief submission from "${name}"?`
      : `Delete message from "${name}"?`;

  if (confirm(message)) {
    if (type === "brief") deleteBrief(item.id);
    else deleteContact(item.id);
  }
};

// Computed Properties
const filteredBriefs = computed(() => {
  const list = Array.isArray(briefSubmissions.value)
    ? briefSubmissions.value
    : [];
  if (!searchBrief.value) return list;

  const query = searchBrief.value.toLowerCase();
  return list.filter((brief) => {
    if (!brief) return false;
    return (
      brief.full_name?.toLowerCase().includes(query) ||
      brief.email?.toLowerCase().includes(query) ||
      brief.project_type?.toLowerCase().includes(query) ||
      brief.project_type_other?.toLowerCase().includes(query)
    );
  });
});

const paginatedBriefs = computed(() => {
  const start = (currentPageBrief.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredBriefs.value.slice(start, end);
});

const totalPagesBrief = computed(() =>
  Math.max(1, Math.ceil(filteredBriefs.value.length / itemsPerPage))
);

const filteredContacts = computed(() => {
  const list = Array.isArray(contactMessages.value)
    ? contactMessages.value
    : [];
  if (!searchContact.value) return list;

  const query = searchContact.value.toLowerCase();
  return list.filter((contact) => {
    if (!contact) return false;
    return (
      contact.full_name?.toLowerCase().includes(query) ||
      contact.name?.toLowerCase().includes(query) ||
      contact.email?.toLowerCase().includes(query) ||
      contact.subject?.toLowerCase().includes(query)
    );
  });
});

const paginatedContacts = computed(() => {
  const start = (currentPageContact.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredContacts.value.slice(start, end);
});

const totalPagesContact = computed(() =>
  Math.max(1, Math.ceil(filteredContacts.value.length / itemsPerPage))
);

// Dynamic Field Rendering - Brief
const filteredEntries = computed(() => {
  if (!detailsDrawer.value.item) return [];

  const logoKeys = ["logo_1", "logo_2", "logo_3", "logo_4", "logo_5"];
  return Object.entries(detailsDrawer.value.item).filter(
    ([key]) => !logoKeys.includes(key)
  );
});

// Dynamic Field Rendering - Contact
const contactEntries = computed(() => {
  if (!detailsDrawer.value.item) return [];
  return Object.entries(detailsDrawer.value.item);
});

// Helper Functions for Dynamic Rendering
const formatFieldName = (key) => {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  return String(value);
};

const isUrl = (value) => {
  if (typeof value !== "string") return false;
  return value.startsWith("http://") || value.startsWith("https://");
};

const isDateField = (key) => {
  return key.includes("_at") || key === "deadline";
};

const isArrayField = (key) => {
  return key === "target_audience" || key === "applications";
};

const isLongTextField = (key) => {
  const longFields = [
    "message",
    "project_goals",
    "about_project",
    "name_details",
    "competitors",
    "design_references",
    "user_agent",
  ];
  return longFields.includes(key);
};

// Lifecycle
onMounted(() => {
  fetchBriefSubmissions();
  fetchContactMessages();

  // Mark notifications as seen when admin visits this page
  markAllAsSeen();
});
</script>

<style scoped>
/* Main Container */
.submissions-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  color: white;
}

/* Title Info */
.title-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px 20px;
  background: linear-gradient(135deg, #0481ff 0%, #0366cc 100%);
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(4, 129, 255, 0.3);
}

.title-info p {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: white;
}

.title-info svg {
  font-size: 24px;
  color: white;
}

/* Section Card */
.section-card {
  background-color: rgb(56, 55, 55);
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.3);
}

/* Search Bar */
.search-bar {
  position: relative;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  background: rgb(40, 39, 39);
  border: 1px solid #444;
  padding: 12px 40px 12px 12px;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #0481ff;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  pointer-events: none;
}

/* Status Messages */
.status-message {
  padding: 40px 20px;
  text-align: center;
  color: #888;
  font-size: 16px;
}

.status-message.error {
  color: #e74c3c;
}

/* Table Wrapper */
.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Compact Table */
.compact-table {
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
}

.compact-table th,
.compact-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.compact-table th {
  background-color: rgba(4, 129, 255, 0.1);
  color: #0481ff;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.5px;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 2px solid #0481ff;
}

.compact-table tbody tr {
  transition: background-color 0.2s;
}

.compact-table tbody tr:hover {
  background-color: rgba(4, 129, 255, 0.05);
}

.compact-table tbody tr:nth-child(even) {
  background-color: rgba(255, 255, 255, 0.02);
}

/* Mobile Cards - Hidden on Desktop */
.mobile-cards {
  display: none;
}

.summary-card {
  background: rgb(40, 39, 39);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-header h4 {
  margin: 0;
  font-size: 16px;
  color: #0481ff;
}

.card-id {
  font-size: 12px;
  color: #888;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.card-row {
  font-size: 14px;
  color: #ddd;
}

.card-row strong {
  color: #aaa;
  font-size: 12px;
  margin-right: 8px;
}

.card-actions {
  display: flex;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.btn {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: white;
  font-size: 13px;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-view {
  background: #3498db;
}

.btn-view:hover:not(:disabled) {
  background: #2980b9;
}

.btn-danger {
  background: #c0392b;
}

.btn-danger:hover:not(:disabled) {
  background: #a93226;
}

.btn-secondary {
  background: #666;
}

.btn-secondary:hover:not(:disabled) {
  background: #555;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.page-info {
  color: #aaa;
  font-size: 14px;
  min-width: 120px;
  text-align: center;
}

/* Details Drawer */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9998;
  animation: fadeIn 0.3s;
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 600px;
  max-width: 90vw;
  height: 100vh;
  background: rgb(40, 39, 39);
  box-shadow: -5px 0 20px rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgb(56, 55, 55);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.drawer-header h3 {
  margin: 0;
  font-size: 18px;
  color: #0481ff;
}

.btn-close {
  width: 40px;
  height: 40px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(90deg);
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-section {
  background: rgb(50, 49, 49);
  padding: 15px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-section h4 {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #0481ff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(4, 129, 255, 0.2);
  padding-bottom: 8px;
}

.detail-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row.full-width {
  flex-direction: column;
  gap: 8px;
}

.detail-row .label {
  min-width: 150px;
  color: #aaa;
  font-size: 13px;
  font-weight: 600;
}

.detail-row .value {
  flex: 1;
  color: #ddd;
  font-size: 13px;
  word-break: break-word;
}

.detail-row .value.longtext {
  white-space: pre-wrap;
  line-height: 1.6;
}

.detail-row .value a {
  color: #3498db;
  text-decoration: none;
}

.detail-row .value a:hover {
  text-decoration: underline;
}

/* Logos Grid in Drawer */
.logos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
}

.logo-thumb {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.logo-thumb:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(4, 129, 255, 0.5);
}

/* Image Modal */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s;
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.modal-content img {
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 10001;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.modal-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.modal-nav:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.modal-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.modal-prev {
  left: 20px;
}

.modal-next {
  right: 20px;
}

.modal-counter {
  color: white;
  font-size: 16px;
  background: rgba(0, 0, 0, 0.7);
  padding: 8px 16px;
  border-radius: 20px;
}

/* Mobile Responsive (<1024px) */
@media (max-width: 1023px) {
  .submissions-container {
    padding: 15px;
  }

  /* Hide desktop table */
  .table-wrapper {
    display: none !important;
  }

  /* Show mobile cards */
  .mobile-cards {
    display: block !important;
  }

  .card-actions .btn {
    flex: 1;
    justify-content: center;
    min-height: 44px;
  }

  .section-card {
    padding: 15px;
  }

  .pagination {
    flex-direction: column;
    gap: 10px;
  }

  .pagination .btn {
    width: 100%;
    justify-content: center;
    min-height: 44px;
  }

  .drawer {
    width: 100vw;
    max-width: 100vw;
  }

  .logos-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .logo-thumb {
    height: 80px;
  }

  .modal-nav,
  .modal-close {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .modal-prev {
    left: 10px;
  }

  .modal-next {
    right: 10px;
  }
}
</style>
