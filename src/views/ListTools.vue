<template>
  <section class="Tools">
    <h2><span>Programs</span> And <span>Tools</span></h2>
    <div class="tools-container">
      <div
        v-for="(item, index) in paginatedItems"
        :key="index"
        class="tool-box"
        ref="itemRefs"
      >
        <div class="progress-circle" :data-percentage="item.percentage">
          <div class="image-container">
            <img :src="item.image" :alt="item.alt" />
          </div>
          <span class="percentage-text">0%</span>
        </div>
        <h3>{{ item.title }}</h3>
        <router-link :to="`/my-tools/${item.title}`">
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
  </section>

  <!-- Navigation Buttons -->
  <section class="buttons">
    <div>
      <router-link to="/list-experiences" target="_blank" id="btn">
        <button>contact me</button>
      </router-link>
    </div>
    <div>
      <router-link to="/list-experiences" target="_blank" id="btn">
        <button>go home</button>
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from "vue";
import { usePagination } from "@/composables/usePagination";
import "/src/assets/js/all.js/all.js";

// Extracted from original file via script
const items = ref([
  {
    image: "/images/liste_tools/Photoshop.jpeg",
    alt: "Photoshop",
    percentage: "85",
    title: "Photoshop",
  },
  {
    image: "/images/liste_tools/illustrator.jpeg",
    alt: "illustrator",
    percentage: "82",
    title: "Illustrator",
  },
  {
    image: "/images/liste_tools/Figma.jpeg",
    alt: "Figma",
    percentage: "75",
    title: "Figma",
  },
  {
    image: "/images/liste_tools/github.jpeg",
    alt: "Git Hub",
    percentage: "60",
    title: "Git Hub",
  },
  {
    image: "/images/liste_tools/Notion.jpeg",
    alt: "Notion",
    percentage: "90",
    title: "Notion",
  },
  {
    image: "/images/liste_tools/Canva.jpeg",
    alt: "Canva",
    percentage: "50",
    title: "Canva",
  },
  {
    image: "/images/liste_tools/ChatGPT.jpeg",
    alt: "ChatGPT",
    percentage: "80",
    title: "ChatGPT",
  },
  {
    image: "/images/liste_tools/Git.jpeg",
    alt: "Git",
    percentage: "60",
    title: "Git",
  },
  {
    image: "/images/liste_tools/Premiere.jpeg",
    alt: "Premiere",
    percentage: "60",
    title: "Premiere",
  },
  {
    image: "/images/liste_tools/Semrush.jpeg",
    alt: "Semrush",
    percentage: "30",
    title: "Semrush",
  },
]);

// Pagination using composable (9 items per page)
const {
  currentPage,
  totalPages,
  paginatedItems,
  setPage: goToPage,
  next: nextPage,
  prev: prevPage,
} = usePagination(items, 9);

const itemRefs = ref([]);

// Animation
const animateItems = () => {
  if (!itemRefs.value) return;
  itemRefs.value.forEach((el, index) => {
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.display = "flex"; // Ensure flex/block based on CSS, usually flex for tool-box

    setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, index * 100);
  });
};

// Progress Circle Logic
const animateCircles = () => {
  if (!itemRefs.value) return;
  itemRefs.value.forEach((box) => {
    const circle = box.querySelector(".progress-circle");
    if (!circle || circle.dataset.animated) return;

    const percentage = parseInt(circle.getAttribute("data-percentage"), 10);
    const percentageText = circle.querySelector(".percentage-text");

    circle.dataset.animated = "true";
    let currentProgress = 0;
    const targetProgress = percentage * 3.6;
    const speed = 20;

    const interval = setInterval(() => {
      if (currentProgress >= targetProgress) {
        clearInterval(interval);
      } else {
        currentProgress += 3;
        let currentPercentage = Math.min(
          Math.round(currentProgress / 3.6),
          percentage
        );
        circle.style.background = `conic-gradient(var(--main-color) ${currentProgress}deg, #ededed ${currentProgress}deg)`;
        if (percentageText)
          percentageText.textContent = `${currentPercentage}%`;
      }
    }, speed);
  });
};

watch(currentPage, () => {
  nextTick(() => {
    animateItems();
    animateCircles();
  });
});

onMounted(() => {
  nextTick(() => {
    animateItems();
    animateCircles();
  });
});
</script>

<style scoped>
@import "/src/assets/css/lists/list_tools/style.css";
</style>
