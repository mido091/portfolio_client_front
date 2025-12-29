<template>
  <section class="books-page">
    <div class="container">
      <div class="page-header">
        <h1>Books I've <span>Read</span></h1>
        <router-link to="/about" class="back-link">
          <button class="back-btn">
            <i class="fa-solid fa-arrow-left"></i> Back to About
          </button>
        </router-link>
      </div>

      <div class="books-grid">
        <div
          v-for="(book, index) in paginatedBooks"
          :key="index"
          class="book-card"
          ref="itemRefs"
        >
          <img :src="book.coverSrc" :alt="book.title" />
          <h3>{{ book.title }}</h3>
          <p>{{ book.description }}</p>
          <router-link :to="`/my-books/${book.title}`" id="btn">
            <button class="details-btn">View Details</button>
          </router-link>
        </div>
      </div>

      <div id="pagination" v-if="totalPages > 1">
        <button id="prev-btn" @click="prevPage" :disabled="currentPage === 1">
          السابق
        </button>
        <span id="page-indicators">
          <span
            v-for="page in totalPages"
            :key="page"
            class="page-number"
            :class="{ active: currentPage === page }"
            @click="goToPage(page)"
            >{{ page }}</span
          >
        </span>
        <button
          id="next-btn"
          @click="nextPage"
          :disabled="currentPage === totalPages"
        >
          التالي
        </button>
      </div>
    </div>
  </section>

  <!-- scroll to top button -->
  <div id="progress">
    <span id="progress-value">
      <i class="fa-solid fa-arrow-up"></i>
    </span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import { usePagination } from "@/composables/usePagination";

const books = ref([
  {
    coverSrc: "/images/books/book.webp",
    title: "Clean Code",
    description:
      "A Handbook of Agile Software Craftsmanship by Robert C. Martin",
  },
  {
    coverSrc: "/images/books/book.webp",
    title: "The Pragmatic Programmer",
    description: "Your Journey To Mastery by David Thomas and Andrew Hunt",
  },
  {
    coverSrc: "/images/books/book.webp",
    title: "Design Patterns",
    description: "Elements of Reusable Object-Oriented Software",
  },
  {
    coverSrc: "/images/books/book.webp",
    title: "Refactoring",
    description: "Improving the Design of Existing Code by Martin Fowler",
  },
  {
    coverSrc: "/images/books/book.webp",
    title: "You Don't Know JS",
    description: "A deep dive into the core mechanisms of JavaScript",
  },
  {
    coverSrc: "/images/books/book.webp",
    title: "Eloquent JavaScript",
    description: "A Modern Introduction to Programming by Marijn Haverbeke",
  },
  {
    coverSrc: "/images/books/book.webp",
    title: "JavaScript: The Good Parts",
    description: "Unearthing the Excellence in JavaScript by Douglas Crockford",
  },
  {
    coverSrc: "/images/books/book.webp",
    title: "Code Complete",
    description:
      "A Practical Handbook of Software Construction by Steve McConnell",
  },
]);

// Pagination using composable (9 items per page)
const {
  currentPage,
  totalPages,
  paginatedItems: paginatedBooks,
  setPage: goToPage,
  next: nextPage,
  prev: prevPage,
} = usePagination(books, 9);

const itemRefs = ref([]);

// Animation
const animateItems = () => {
  if (!itemRefs.value) return;
  itemRefs.value.forEach((el, index) => {
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";

    setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, index * 100);
  });
};

watch(currentPage, () => {
  nextTick(() => {
    animateItems();
  });
});

// Set body background on mount, reset on unmount
onMounted(() => {
  document.body.style.background = "#1c1c1d";
  nextTick(() => {
    animateItems();
  });
});

onUnmounted(() => {
  document.body.style.background = "";
});
</script>

<style scoped>
@import "/src/assets/css/all.css/all.css";

.books-page {
  min-height: 100vh;
  padding: 12rem 9% 4rem;
  background: #1c1c1d;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.page-header h1 {
  font-size: 2.8em;
  color: var(--first);
  font-weight: bold;
}

.page-header h1 span {
  color: var(--color);
}

.back-link {
  text-decoration: none;
}

.back-btn {
  font-size: 15px;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 25px;
  color: var(--color);
  background: transparent;
  border: 2px solid var(--color);
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease-in;
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-btn:hover {
  color: #fff;
  background: var(--color);
  transform: translateY(-3px);
  box-shadow: 0 0 0.7rem var(--color);
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 2rem;
}

/* Responsive Grid Breakpoints */
@media (max-width: 992px) {
  .books-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .books-grid {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 20px;
  }
}

/* Extra small mobile devices */
@media (max-width: 412px) {
  .books-grid {
    padding: 0 1rem;
  }
}

.book-card {
  width: 100%;
  background: var(--box-bg);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 1.5em var(--color);
}

.book-card img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 15px;
}

.book-card h3 {
  font-size: 1.3em;
  color: var(--first);
  margin-bottom: 10px;
  font-weight: 600;
}

.book-card p {
  font-size: 0.95em;
  color: var(--first);
  opacity: 0.85;
  line-height: 1.6;
}

/* Pagination Styles */
#pagination {
  margin-top: 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

#pagination button {
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 600;
  color: var(--first);
  background-color: var(--box-bg);
  border: 2px solid var(--color);
  border-radius: 25px;
  cursor: pointer;
  transition: 0.4s ease;
}

#pagination button:hover:not(:disabled) {
  background-color: var(--color);
  color: var(--text-color);
  transform: translateY(-3px);
  box-shadow: 0 0 0.7rem var(--color);
}

#pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

#pagination .page-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: var(--box-bg);
  border: 2px solid var(--color);
  color: var(--first);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.4s ease;
}

#pagination .page-number:hover {
  background-color: var(--color);
  color: var(--text-color);
}

#pagination .page-number.active {
  background-color: var(--color);
  color: var(--text-color);
  border-color: var(--color);
}
</style>
