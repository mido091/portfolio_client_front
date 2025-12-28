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
        <div v-for="(book, index) in books" :key="index" class="book-card">
          <img :src="book.coverSrc" :alt="book.title" />
          <h3>{{ book.title }}</h3>
          <p>{{ book.description }}</p>
          <router-link :to="`/my-books/${book.title}`" id="btn">
            <button class="details-btn">View Details</button>
          </router-link>
        </div>
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
import { ref, onMounted, onUnmounted } from "vue";

const books = ref([
  {
    coverSrc: "/src/assets/images/books/book.webp",
    title: "Clean Code",
    description:
      "A Handbook of Agile Software Craftsmanship by Robert C. Martin",
  },
  {
    coverSrc: "/src/assets/images/books/book.webp",
    title: "The Pragmatic Programmer",
    description: "Your Journey To Mastery by David Thomas and Andrew Hunt",
  },
  {
    coverSrc: "/src/assets/images/books/book.webp",
    title: "Design Patterns",
    description: "Elements of Reusable Object-Oriented Software",
  },
  {
    coverSrc: "/src/assets/images/books/book.webp",
    title: "Refactoring",
    description: "Improving the Design of Existing Code by Martin Fowler",
  },
  {
    coverSrc: "/src/assets/images/books/book.webp",
    title: "You Don't Know JS",
    description: "A deep dive into the core mechanisms of JavaScript",
  },
  {
    coverSrc: "/src/assets/images/books/book.webp",
    title: "Eloquent JavaScript",
    description: "A Modern Introduction to Programming by Marijn Haverbeke",
  },
  {
    coverSrc: "/src/assets/images/books/book.webp",
    title: "JavaScript: The Good Parts",
    description: "Unearthing the Excellence in JavaScript by Douglas Crockford",
  },
  {
    coverSrc: "/src/assets/images/books/book.webp",
    title: "Code Complete",
    description:
      "A Practical Handbook of Software Construction by Steve McConnell",
  },
]);

// Set body background on mount, reset on unmount
onMounted(() => {
  document.body.style.background = "#1c1c1d";
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 3rem;
}

.book-card {
  width: 100%;
  background: var(--box-bg);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
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

/* Responsive adjustments */
@media (max-width: 1200px) {
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .books-page {
    padding: 10rem 5% 3rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-header h1 {
    font-size: 2.2em;
  }

  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.8em;
  }

  .books-grid {
    grid-template-columns: 1fr;
  }

  .back-btn {
    font-size: 14px;
    padding: 10px 20px;
  }
}

/* Scroll to top button */
#progress {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: var(--color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;
  z-index: 1000;
}

#progress.active {
  opacity: 1;
  pointer-events: auto;
}

#progress:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 1rem var(--color);
}

#progress-value {
  color: #fff;
  font-size: 20px;
}
</style>
