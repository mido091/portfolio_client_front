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
import { ref, computed, onMounted, nextTick, watch } from "vue";
import "/src/assets/js/all.js/all.js";

// Extracted from original file via script
const items = ref([
  {
    image: "/src/assets/images/liste_tools/Photoshop.jpeg",
    alt: "Photoshop",
    percentage: "85",
    title: "Photoshop",
  },
  {
    image: "/src/assets/images/liste_tools/illustrator.jpeg",
    alt: "illustrator",
    percentage: "82",
    title: "Illustrator",
  },
  {
    image: "/src/assets/images/liste_tools/Figma.jpeg",
    alt: "Figma",
    percentage: "75",
    title: "Figma",
  },
  {
    image: "/src/assets/images/liste_tools/github.jpeg",
    alt: "Git Hub",
    percentage: "60",
    title: "Git Hub",
  },
  {
    image: "/src/assets/images/liste_tools/Notion.jpeg",
    alt: "Notion",
    percentage: "90",
    title: "Notion",
  },
  {
    image: "/src/assets/images/liste_tools/Canva.jpeg",
    alt: "Canva",
    percentage: "50",
    title: "Canva",
  },
  {
    image: "/src/assets/images/liste_tools/ChatGPT.jpeg",
    alt: "ChatGPT",
    percentage: "80",
    title: "ChatGPT",
  },
  {
    image: "/src/assets/images/liste_tools/Git.jpeg",
    alt: "Git",
    percentage: "60",
    title: "Git",
  },
  {
    image: "/src/assets/images/liste_tools/Premiere.jpeg",
    alt: "Premiere",
    percentage: "60",
    title: "Premiere",
  },
  {
    image: "/src/assets/images/liste_tools/Semrush.jpeg",
    alt: "Semrush",
    percentage: "30",
    title: "Semrush",
  },
]);

// Pagination
const currentPage = ref(1);
const itemsPerPage = 6;
const itemRefs = ref([]);

const totalPages = computed(() => Math.ceil(items.value.length / itemsPerPage));

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return items.value.slice(start, start + itemsPerPage);
});

const goToPage = (page) => {
  currentPage.value = page;
};
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

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
