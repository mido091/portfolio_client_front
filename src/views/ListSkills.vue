<template>
  <!-- skills -->
  <section class="skills">
    <h2>my <span>skills</span></h2>
    <div class="skills-content">
      <div class="skills-wrapper">
        <div
          v-for="(skill, index) in paginatedSkills"
          :key="index"
          class="skills-box"
          ref="skillRefs"
        >
          <div class="front">
            <i :class="skill.icon"></i>
            <div class="center-years">
              <span class="num" :data-val="skill.years">000</span>
              <span class="years">years</span>
            </div>
            <span class="text">{{ skill.name }}</span>
          </div>
          <div class="back">
            <i :class="skill.icon"></i>
            <h3>{{ skill.title }}</h3>
            <p>{{ skill.desc }}</p>
          </div>
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
  <!-- scroll -->
  <div id="progress">
    <span id="progress-value">
      <i class="fa-solid fa-arrow-up"></i>
    </span>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from "vue";
import { usePagination } from "@/composables/usePagination";
import "/src/assets/js/all.js/all.js";

const skills = ref([
  {
    name: "HTML",
    years: "2",
    icon: "fa-brands fa-html5",
    desc: "مهارة في تطوير الهيكل الأساسي للمواقع.",
    title: "HTML",
  },
  {
    name: "CSS",
    years: "3",
    icon: "fa-brands fa-css3",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam perspiciatis reprehenderit, expedita atque accusantium voluptatem! Dolores, repudiandae magni, velit unde accusantium.",
    title: "CSS",
  },
  {
    name: "JavaScript",
    years: "3",
    icon: "fa-brands fa-js",
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti eveniet esse delectus eum distinctio accusantium, optio porro iure libero nihil possimus doloremque animi quod quidem, minima fugit quaerat dolore voluptate.",
    title: "JavaScript",
  },
  {
    name: "communication",
    years: "3",
    icon: "fa-solid fa-comments",
    desc: "مهارة في التواصل الفعال مع الفريق.",
    title: "Communication",
  },
  {
    name: "research skill",
    years: "3",
    icon: "fa-solid fa-magnifying-glass",
    desc: "مهارة في التواصل الفعال مع الفريق.",
    title: "research skill",
  },
  {
    name: "React",
    years: "3",
    icon: "fa-brands fa-react",
    desc: "مهارة في التواصل الفعال مع الفريق.",
    title: "React",
  },
  {
    name: "Meals Deliverd",
    years: "3",
    icon: "fa-solid fa-utensils",
    desc: "مهارة في التواصل الفعال مع الفريق.",
    title: "Meals Deliverd",
  },
  {
    name: "communication",
    years: "3",
    icon: "fa-solid fa-comments",
    desc: "مهارة في التواصل الفعال مع الفريق.",
    title: "Communication",
  },
  {
    name: "communication",
    years: "3",
    icon: "fa-solid fa-comments",
    desc: "مهارة في التواصل الفعال مع الفريق.",
    title: "Communication",
  },
  {
    name: "communication",
    years: "3",
    icon: "fa-solid fa-comments",
    desc: "مهارة في التواصل الفعال مع الفريق.",
    title: "Communication",
  },
]);

// Pagination using composable (9 items per page)
const {
  currentPage,
  totalPages,
  paginatedItems: paginatedSkills,
  setPage: goToPage,
  next: nextPage,
  prev: prevPage,
} = usePagination(skills, 9);

// Counting Logic
const skillRefs = ref([]);

const startCounting = (element) => {
  const numSpan = element.querySelector(".num");
  if (!numSpan) return;

  // Check if refined
  if (numSpan.dataset.counted) return;

  const target = +numSpan.getAttribute("data-val");
  const duration = 2000;
  const startTime = performance.now();

  const updateNumber = (currentTime) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const currentNumber = Math.floor(progress * target);

    numSpan.textContent = currentNumber;

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    } else {
      numSpan.textContent = target;
      numSpan.dataset.counted = "true";
      const yearsElement = element.querySelector(".years");
      if (yearsElement) yearsElement.style.display = "inline";
    }
  };
  requestAnimationFrame(updateNumber);
};

// Re-run counting/animation on page change
watch(currentPage, () => {
  // Reset animations if needed, or just let them show
  nextTick(() => {
    animateItems();
  });
});

const animateItems = () => {
  // Simple fade in effect logic directly in CSS usually, but we can replicate JS logic
  // The original JS did opacity 0 -> 1 with delay
  if (!skillRefs.value) return;

  skillRefs.value.forEach((el, index) => {
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.display = "flex"; // Ensure flex

    setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
      // Trigger counting
      startCounting(el);
    }, index * 100);
  });
};

onMounted(() => {
  nextTick(() => {
    animateItems();
  });
});
</script>

<style scoped>
/* Inherited via global css, but add pagination styles if missing */
@import "/src/assets/css/lists/list_skills/style.css";
</style>
