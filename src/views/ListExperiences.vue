<template>
  <section id="services" class="services">
    <h2>my <span>services</span></h2>
    <div class="services-box">
      <div
        v-for="(item, index) in paginatedItems"
        :key="index"
        class="box"
        ref="itemRefs"
      >
        <div class="icon">
          <font-awesome-icon :icon="['fas', item.icon]" size="1x" />
        </div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.desc }}</p>
        <div class="services-btn">
          <router-link :to="`/my-services/${item.title}`">
            <button>Read More</button>
          </router-link>
        </div>
      </div>
    </div>
  </section>

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
  <!-- scroll -->
  <div id="progress">
    <span id="progress-value">
      <i class="fa-solid fa-arrow-up"></i>
    </span>
  </div>
  <!-- footer -->
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from "vue";
import { usePagination } from "@/composables/usePagination";
import "/src/assets/js/all.js/all.js";

const items = ref([
  {
    icon: "code",
    title: "Web Development",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.",
  },
  {
    icon: "pen-fancy",
    title: "Graphic Design",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.",
  },
  {
    icon: "chart-column",
    title: "Digital Marketing",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.",
  },
  {
    icon: "code",
    title: "Web Development",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.",
  },
  {
    icon: "pen-fancy",
    title: "Graphic Design",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.",
  },
  {
    icon: "chart-column",
    title: "Digital Marketing",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.",
  },
  {
    icon: "code",
    title: "Web Development",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.",
  },
  {
    icon: "pen-fancy",
    title: "Graphic Design",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.",
  },
  {
    icon: "chart-column",
    title: "Digital Marketing",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.",
  },
  {
    icon: "code",
    title: "Web Development",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.",
  },
  {
    icon: "pen-fancy",
    title: "Graphic Design",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.",
  },
  {
    icon: "chart-column",
    title: "Digital Marketing",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.",
  },
  {
    icon: "code",
    title: "Web Development",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.",
  },
  {
    icon: "pen-fancy",
    title: "Graphic Design",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.",
  },
  {
    icon: "chart-column",
    title: "Digital Marketing",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.",
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
    el.style.display = "flex";

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

onMounted(() => {
  nextTick(() => {
    animateItems();
  });
});
</script>

<style scoped>
@import "/src/assets/css/lists/list_experiences/experiences.css";
</style>
