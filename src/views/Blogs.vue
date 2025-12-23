<template>
  <section class="blogs-section">
    <div class="container">
      <h2>Latest <span>Blogs</span></h2>
      <div class="blogs-grid">
        <!-- Loading state -->
        <div v-if="loading" class="loading">
          <i class="fas fa-spinner fa-spin"></i> Loading blogs...
        </div>

        <!-- Error state -->
        <p v-else-if="error" class="error-message">{{ error }}</p>

        <!-- No blogs state -->
        <p v-else-if="blogs.length === 0" class="loading">
          No blogs available.
        </p>

        <!-- Blogs list (paginated) -->
        <div
          v-else
          v-for="blog in paginatedBlogs"
          :key="blog.id"
          class="blog-card"
          @click="navigateToBlog(blog.id)"
        >
          <div v-if="blog.image" class="blog-image">
            <img :src="blog.image" :alt="blog.title || blog.header" />
          </div>
          <div class="blog-info">
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

      <!-- Pagination Controls (only show if blogs > 6) -->
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

const router = useRouter();
const blogs = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const blogsPerPage = 6;

// Computed property for paginated blogs
const paginatedBlogs = computed(() => {
  const start = (currentPage.value - 1) * blogsPerPage;
  const end = start + blogsPerPage;
  return blogs.value.slice(start, end);
});

// Computed property for total pages
const totalPages = computed(() => {
  return Math.ceil(blogs.value.length / blogsPerPage);
});

// Computed property to check if pagination should be shown
const showPagination = computed(() => {
  return blogs.value.length > blogsPerPage;
});

// Computed property for page numbers to display
const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
  return pages;
});

// Check if on first page
const isFirstPage = computed(() => currentPage.value === 1);

// Check if on last page
const isLastPage = computed(() => currentPage.value === totalPages.value);

// Navigate to specific page
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    scrollToTop();
  }
};

// Go to next page
const nextPage = () => {
  if (!isLastPage.value) {
    currentPage.value++;
    scrollToTop();
  }
};

// Go to previous page
const prevPage = () => {
  if (!isFirstPage.value) {
    currentPage.value--;
    scrollToTop();
  }
};

// Scroll to top of blogs section
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
</style>
