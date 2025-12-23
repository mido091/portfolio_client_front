<template>
  <section id="portfolio" class="portfolio">
    <h2>latest <span>project</span></h2>
    <div class="container_portfolio">
      <div class="portfolio-boxes">
        <div
          v-for="(item, index) in paginatedItems"
          :key="index"
          class="portfolio-box"
          ref="itemRefs"
        >
          <img :src="item.image" :alt="item.alt" />
          <div class="portfolio-info">
            <h4>{{ item.title }}</h4>
            <p>{{ item.desc }}</p>
            <a href="#"><i class="fa-solid fa-up-right-from-square"></i></a>
          </div>
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
  </section>
  <!-- scroll -->
  <div id="progress">
    <span id="progress-value">
      <i class="fa-solid fa-arrow-up"></i>
    </span>
  </div>
  <!--footer-->
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import "/src/assets/js/all.js/all.js";

const items = ref([
  {
    image: "/src/assets/images/list_work/social_media_poster_design.jpeg",
    alt: "",
    title: "Web Design",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem amet quisquam explicabo praesentium corrupti esse quaerat maiores nulla sunt facilis.",
  },
  {
    image: "/src/assets/images/list_work/10629069.jpg",
    alt: "",
    title: "Web Design",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem amet quisquam explicabo praesentium corrupti esse quaerat maiores nulla sunt facilis.",
  },
  {
    image: "/src/assets/images/list_work/1984_movie_poster.jpeg",
    alt: "",
    title: "Web Design",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem amet quisquam explicabo praesentium corrupti esse quaerat maiores nulla sunt facilis.",
  },
  {
    image: "/src/assets/images/list_work/F.jpeg",
    alt: "",
    title: "Web Design",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem amet quisquam explicabo praesentium corrupti esse quaerat maiores nulla sunt facilis.",
  },
  {
    image: "/src/assets/images/list_work/mark.jpeg",
    alt: "",
    title: "Web Design",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem amet quisquam explicabo praesentium corrupti esse quaerat maiores nulla sunt facilis.",
  },
  {
    image: "/src/assets/images/list_work/post_design_social_media.jpeg",
    alt: "",
    title: "Web Design",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem amet quisquam explicabo praesentium corrupti esse quaerat maiores nulla sunt facilis.",
  },
  {
    image: "/src/assets/images/list_work/post.jpeg",
    alt: "",
    title: "Web Design",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem amet quisquam explicabo praesentium corrupti esse quaerat maiores nulla sunt facilis.",
  },
  {
    image: "/src/assets/images/list_work/steve_jobs.jpeg",
    alt: "",
    title: "Web Design",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem amet quisquam explicabo praesentium corrupti esse quaerat maiores nulla sunt facilis.",
  },
  {
    image:
      "/src/assets/images/list_work/woman-holding-disposable-cup-coffee.jpg",
    alt: "",
    title: "Web Design",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem amet quisquam explicabo praesentium corrupti esse quaerat maiores nulla sunt facilis.",
  },
  {
    image: "/src/assets/images/list_work/women.jpeg",
    alt: "",
    title: "Web Design",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem amet quisquam explicabo praesentium corrupti esse quaerat maiores nulla sunt facilis.",
  },
  {
    image: "/src/assets/images/list_work/quote.jpeg",
    alt: "",
    title: "Web Design",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem amet quisquam explicabo praesentium corrupti esse quaerat maiores nulla sunt facilis.",
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
@import "/src/assets/css/lists/list_work/style.css";
</style>
