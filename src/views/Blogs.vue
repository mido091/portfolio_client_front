<template>
  <section class="blogs-section">
    <div class="container">
      <h2>Latest <span>Blogs</span></h2>

      <!-- Category Filter Chips -->
      <div
        v-if="!loading && categoryOptions.length > 0"
        class="category-filters"
      >
        <!-- "All" chip -->
        <button
          class="filter-chip"
          :class="{ active: selectedCategories.length === 0 }"
          @click="clearFilters"
        >
          All ({{ blogs.length }})
        </button>

        <!-- Category chips with counts -->
        <button
          v-for="cat in categoryOptions"
          :key="cat.name"
          class="filter-chip"
          :class="{ active: selectedCategories.includes(cat.name) }"
          @click="toggleCategory(cat.name)"
        >
          {{ cat.name }} ({{ cat.count }})
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin"></i> Loading blogs...
      </div>

      <!-- Error state -->
      <p v-else-if="error" class="error-message">{{ error }}</p>

      <!-- No blogs state -->
      <p v-else-if="blogs.length === 0" class="loading">No blogs available.</p>

      <!-- Empty filter results -->
      <div v-else-if="filteredBlogs.length === 0" class="empty-state">
        <i class="fas fa-filter"></i>
        <p>No blogs match the selected categories.</p>
        <button class="btn-clear-filters" @click="clearFilters">
          Clear Filters
        </button>
      </div>

      <!-- Blogs grid (single grid with all filtered results) -->
      <div v-else class="blogs-grid">
        <div
          v-for="blog in paginatedBlogs"
          :key="blog.id"
          class="blog-card"
          @click="navigateToBlog(blog.id)"
        >
          <div v-if="blog.image" class="blog-image">
            <img :src="blog.image" :alt="blog.title || blog.header" />
          </div>
          <div class="blog-info">
            <!-- Category badge -->
            <span class="category-badge">{{ getBlogCategory(blog) }}</span>
            <h3>{{ blog.header }}</h3>
            <p v-if="formatDate(blog)" class="blog-date">
              <i class="far fa-calendar-alt"></i> {{ formatDate(blog) }}
            </p>
            <p v-if="getExcerpt(blog.description)" class="blog-excerpt">
              {{ getExcerpt(blog.description) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Pagination Controls (only show if filtered blogs > blogsPerPage) -->
      <div v-if="showPagination" id="pagination">
        <!-- Previous Button -->
        <button
          @click="prevPage"
          :disabled="isFirstPage"
          :class="{ disabled: isFirstPage }"
          aria-label="Previous page"
        >
          Prev
        </button>

        <!-- Page Numbers -->
        <button
          v-for="page in pageNumbers"
          :key="page"
          @click="goToPage(page)"
          :class="['page-number', { active: currentPage === page }]"
          :aria-label="`Go to page ${page}`"
          :aria-current="currentPage === page ? 'page' : undefined"
        >
          {{ page }}
        </button>

        <!-- Next Button -->
        <button
          @click="nextPage"
          :disabled="isLastPage"
          :class="{ disabled: isLastPage }"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";
import { normalizeCategory } from "@/utils/categoryUtils";

const router = useRouter();
const blogs = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const blogsPerPage = 6;
const selectedCategories = ref([]); // Multi-select filter state

/**
 * Get normalized category for a blog
 */
const getBlogCategory = (blog) => {
  return normalizeCategory(blog.category) || "Uncategorized";
};

/**
 * Get unique categories with counts
 */
const categoryOptions = computed(() => {
  const categoryMap = new Map();

  blogs.value.forEach((blog) => {
    const category = getBlogCategory(blog);
    if (categoryMap.has(category)) {
      categoryMap.set(category, categoryMap.get(category) + 1);
    } else {
      categoryMap.set(category, 1);
    }
  });

  // Convert to array and sort alphabetically, but keep "Uncategorized" last
  const categories = Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      if (a.name === "Uncategorized") return 1;
      if (b.name === "Uncategorized") return -1;
      return a.name.localeCompare(b.name);
    });

  return categories;
});

/**
 * Filter blogs based on selected categories
 */
const filteredBlogs = computed(() => {
  // If no categories selected, show all blogs
  if (selectedCategories.value.length === 0) {
    return blogs.value;
  }

  // Filter blogs that match any of the selected categories (OR behavior)
  return blogs.value.filter((blog) => {
    const blogCategory = getBlogCategory(blog);
    return selectedCategories.value.includes(blogCategory);
  });
});

/**
 * Paginated blogs from filtered results
 */
const paginatedBlogs = computed(() => {
  const start = (currentPage.value - 1) * blogsPerPage;
  const end = start + blogsPerPage;
  return filteredBlogs.value.slice(start, end);
});

/**
 * Total pages based on filtered results
 */
const totalPages = computed(() => {
  return Math.ceil(filteredBlogs.value.length / blogsPerPage);
});

/**
 * Show pagination if filtered results exceed blogsPerPage
 */
const showPagination = computed(() => {
  return filteredBlogs.value.length > blogsPerPage;
});

/**
 * Page numbers to display
 */
const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
  return pages;
});

/**
 * Check if on first page
 */
const isFirstPage = computed(() => currentPage.value === 1);

/**
 * Check if on last page
 */
const isLastPage = computed(() => currentPage.value === totalPages.value);

/**
 * Toggle category filter (multi-select)
 */
const toggleCategory = (category) => {
  const index = selectedCategories.value.indexOf(category);
  if (index > -1) {
    // Category is selected, remove it
    selectedCategories.value.splice(index, 1);
  } else {
    // Category is not selected, add it
    selectedCategories.value.push(category);
  }
  // Reset to first page when filter changes
  currentPage.value = 1;
};

/**
 * Clear all filters
 */
const clearFilters = () => {
  selectedCategories.value = [];
  currentPage.value = 1;
};

/**
 * Navigate to specific page
 */
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    scrollToTop();
  }
};

/**
 * Go to next page
 */
const nextPage = () => {
  if (!isLastPage.value) {
    currentPage.value++;
    scrollToTop();
  }
};

/**
 * Go to previous page
 */
const prevPage = () => {
  if (!isFirstPage.value) {
    currentPage.value--;
    scrollToTop();
  }
};

/**
 * Scroll to top of blogs section
 */
const scrollToTop = () => {
  const blogsSection = document.querySelector(".blogs-section");
  if (blogsSection) {
    blogsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const navigateToBlog = (id) => {
  router.push(`/blog-details?id=${id}`);
};

const formatDate = (blog) => {
  if (!blog.created_at && !blog.updated_at) return "";
  const dateStr = blog.updated_at || blog.created_at;
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getExcerpt = (description) => {
  if (!description) return "";

  // Create a temporary div to decode HTML entities properly
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = description;

  // Get the decoded text content
  const text = tempDiv.textContent || tempDiv.innerText || "";

  const maxLength = 150;
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

onMounted(async () => {
  try {
    const data = await api("/plogs");
    const blogsData = data.plogs || [];

    // Sort by updated_at then created_at (descending)
    blogsData.sort((a, b) => {
      const dateA = new Date(a.updated_at || a.created_at);
      const dateB = new Date(b.updated_at || b.created_at);
      return dateB - dateA;
    });

    blogs.value = blogsData;
  } catch (err) {
    console.error("Error fetching blogs:", err);
    error.value = "Failed to load blogs. Please try again later.";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
@import "/src/assets/css/all.css/all.css";
@import "/src/assets/css/home/home.css";
@import "/src/assets/css/blogs.css";

.blog-card {
  cursor: pointer;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  padding: 20px;
}

/* Pagination disabled state */
#pagination button.disabled,
#pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

#pagination button.disabled:hover,
#pagination button:disabled:hover {
  transform: none;
  box-shadow: none;
  background-color: var(--box-bg);
}

/* Category Filter Chips */
.category-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding: 20px 0;
  margin-bottom: 20px;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--main-color, #ff6b35) transparent;
}

.category-filters::-webkit-scrollbar {
  height: 6px;
}

.category-filters::-webkit-scrollbar-track {
  background: transparent;
}

.category-filters::-webkit-scrollbar-thumb {
  background: var(--main-color, #ff6b35);
  border-radius: 3px;
}

.filter-chip {
  display: inline-block;
  padding: 8px 16px;
  background: var(--box-bg, rgba(255, 255, 255, 0.05));
  border: 2px solid rgba(255, 107, 53, 0.3);
  border-radius: 20px;
  color: #ccc;
  text-decoration: none;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.filter-chip:hover {
  border-color: var(--main-color, #ff6b35);
  color: var(--main-color, #ff6b35);
  transform: translateY(-2px);
}

.filter-chip.active {
  background: var(--main-color, #ff6b35);
  border-color: var(--main-color, #ff6b35);
  color: white;
  font-weight: 600;
}

/* Category Badge on Blog Cards */
.category-badge {
  display: inline-block;
  padding: 4px 10px;
  background: rgba(255, 107, 53, 0.15);
  border: 1px solid var(--main-color, #ff6b35);
  border-radius: 12px;
  color: var(--main-color, #ff6b35);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state i {
  font-size: 48px;
  color: var(--main-color, #ff6b35);
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 18px;
  margin-bottom: 20px;
}

.btn-clear-filters {
  padding: 10px 24px;
  background: var(--main-color, #ff6b35);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-clear-filters:hover {
  background: #ff8555;
  transform: translateY(-2px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .category-filters {
    gap: 8px;
    padding: 15px 0;
    flex-wrap: nowrap;
    overflow-x: auto;
  }

  .filter-chip {
    padding: 6px 12px;
    font-size: 13px;
    flex-shrink: 0;
  }

  .empty-state {
    padding: 40px 15px;
  }

  .empty-state i {
    font-size: 36px;
  }

  .empty-state p {
    font-size: 16px;
  }
}
</style>
