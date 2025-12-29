<template>
  <Header v-if="!isDashboard" />
  <router-view />
  <Footer v-if="!isDashboard" />
  <ScrollProgress v-if="!isDashboard" />
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import ScrollProgress from "./components/ScrollProgress.vue";
import { useAuth } from "./composables/useAuth";

// Import global CSS
import "./assets/css/all.css/all.css";
import "./assets/css/logout-modal.css";

const route = useRoute();
const isDashboard = computed(() => route.path.startsWith("/dashboard"));
const { refreshUser } = useAuth();

onMounted(() => {
  // Initialize theme from localStorage
  const theme = localStorage.getItem("theme") || "dark";
  if (theme === "dark") {
    document.body.classList.remove("dark-mode");
  } else {
    document.body.classList.add("dark-mode");
  }

  // Refresh user data from server if logged in
  refreshUser();
});
</script>

<style>
/* Global overflow prevention */
html,
body {
  overflow-x: hidden;
  max-width: 100vw;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Global styles are imported via CSS files */
#progress {
  display: none !important;
}
</style>
