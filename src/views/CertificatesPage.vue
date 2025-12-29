<template>
  <section class="certificates-page">
    <div class="container">
      <div class="page-header">
        <h1>My <span>Certificates</span></h1>
        <router-link to="/about" class="back-link">
          <button class="back-btn">
            <i class="fa-solid fa-arrow-left"></i> Back to About
          </button>
        </router-link>
      </div>

      <div class="certificates-grid">
        <div
          v-for="(certificate, index) in paginatedCertificates"
          :key="index"
          class="certificate-card"
          ref="itemRefs"
        >
          <router-link :to="`/certificates/${certificate.id}`">
            <img :src="certificate.src" :alt="certificate.alt" />
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

const certificates = ref([
  {
    id: 1,
    src: "/images/about/yyy.jpeg",
    alt: "Google Digital Marketing Certificate",
  },
  {
    id: 2,
    src: "/images/about/yyy.jpeg",
    alt: "Google Digital Marketing Certificate",
  },
  {
    id: 3,
    src: "/images/about/yyy.jpeg",
    alt: "Google Digital Marketing Certificate",
  },
  {
    id: 4,
    src: "/images/about/yyy.jpeg",
    alt: "Google Digital Marketing Certificate",
  },
  {
    id: 5,
    src: "/images/about/yyy.jpeg",
    alt: "Google Digital Marketing Certificate",
  },
  {
    id: 6,
    src: "/images/about/yyy.jpeg",
    alt: "Google Digital Marketing Certificate",
  },
  {
    id: 7,
    src: "/images/about/yyy.jpeg",
    alt: "Google Digital Marketing Certificate",
  },
  {
    id: 8,
    src: "/images/about/yyy.jpeg",
    alt: "Google Digital Marketing Certificate",
  },
]);

// Pagination using composable (9 items per page)
const {
  currentPage,
  totalPages,
  paginatedItems: paginatedCertificates,
  setPage: goToPage,
  next: nextPage,
  prev: prevPage,
} = usePagination(certificates, 9);

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
  document.body.style.background = "#3e3e3e";
  document.body.classList.add("certificates-page-footer-fix");
  nextTick(() => {
    animateItems();
  });
});

onUnmounted(() => {
  document.body.style.background = "";
  document.body.classList.remove("certificates-page-footer-fix");
});
</script>

<style scoped>
@import "/src/assets/css/all.css/all.css";

.certificates-page {
  min-height: 100vh;
  padding: 12rem 9% 4rem;
  background: #1c1c1d !important;
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

.certificates-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 2rem;
}

/* Responsive Grid Breakpoints */
@media (max-width: 992px) {
  .certificates-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .certificates-grid {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 20px;
  }
}

/* Extra small mobile devices */
@media (max-width: 412px) {
  .certificates-grid {
    padding: 0 1rem;
  }
}

.certificate-card {
  width: 100%;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
  cursor: pointer;
}

.certificate-card img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 15px;
  transition: transform 0.3s ease;
}

.certificate-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 1.5em var(--color);
}

.certificate-card:hover img {
  transform: scale(1.05);
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

<style>
/* Global override for footer on this page only */
body.certificates-page-footer-fix .footer {
  background-color: #1c1c1d !important;
  background: #1c1c1d !important;
}
</style>
