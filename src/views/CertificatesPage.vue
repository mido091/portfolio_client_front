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
          v-for="(certificate, index) in certificates"
          :key="index"
          class="certificate-card"
        >
        <router-link :to="`/certificates/${certificate.id}`">
          <img :src="certificate.src" :alt="certificate.alt" />
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

const certificates = ref([
  {
    id:1,
    src: "/src/assets/images/about/yyy.jpeg",
    alt: "Google Digital Marketing Certificate",
  },
  {
    id:2,
    src: "/src/assets/images/about/yyy.jpeg",
    alt: "Google Digital Marketing Certificate",
  },
  {
    id:3,
    src: "/src/assets/images/about/yyy.jpeg",
    alt: "Google Digital Marketing Certificate",
  },
  {
    id:4,
    src: "/src/assets/images/about/yyy.jpeg",
    alt: "Google Digital Marketing Certificate",
  },
  {
    id:5,
    src: "/src/assets/images/about/yyy.jpeg",
    alt: "Google Digital Marketing Certificate",
  },
  {
    id:6,
    src: "/src/assets/images/about/yyy.jpeg",
    alt: "Google Digital Marketing Certificate",
  },
  {
    id:7,
    src: "/src/assets/images/about/yyy.jpeg",
    alt: "Google Digital Marketing Certificate",
  },
  {
    id:8,
    src: "/src/assets/images/about/yyy.jpeg",
    alt: "Google Digital Marketing Certificate",
  },
]);

// Set body background on mount, reset on unmount
onMounted(() => {
  document.body.style.background = "#3e3e3e";
});

onUnmounted(() => {
  document.body.style.background = "";
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 3rem;
}

.certificate-card {
  width: 100%;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
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

/* Responsive adjustments */
@media (max-width: 1200px) {
  .certificates-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .certificates-page {
    padding: 10rem 5% 3rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-header h1 {
    font-size: 2.2em;
  }

  .certificates-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.8em;
  }

  .certificates-grid {
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
