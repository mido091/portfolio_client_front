<template>
  <div class="dashboard-layout">
    <!-- Mobile hamburger button - only show when sidebar is closed -->
    <button
      v-if="isMobile && !sidebarOpen"
      class="mobile-hamburger"
      @click="sidebarOpen = true"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Overlay for mobile -->
    <div
      v-if="isMobile && sidebarOpen"
      class="sidebar-overlay"
      @click="sidebarOpen = false"
    ></div>

    <DashboardSidebar
      :isMobileOpen="sidebarOpen"
      @close="sidebarOpen = false"
    />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar.vue";

const sidebarOpen = ref(false);
const isMobile = ref(window.innerWidth < 768);

const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
  if (!isMobile.value) {
    sidebarOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: rgb(29, 28, 28);
  width: 100%;
  position: relative;
}

.content {
  flex-grow: 1;
  padding: 20px;
  min-width: 0;
}

/* Mobile hamburger button */
.mobile-hamburger {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1002;
  width: 40px;
  height: 40px;
  background: #123;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  padding: 8px;
  transition: all 0.3s;
}

.mobile-hamburger span {
  width: 24px;
  height: 3px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s;
}

.mobile-hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translateY(8px);
}

.mobile-hamburger.active span:nth-child(2) {
  opacity: 0;
}

.mobile-hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translateY(-8px);
}

/* Overlay backdrop */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .content {
    padding: 70px 15px 15px;
  }
}
</style>

<style>
/* Global Dashboard Typography and shared classes */
.title-info {
  background-color: #0481ff;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0 20px 0;
  border-radius: 8px;
  color: white;
}

.title-info p {
  margin: 0;
  font-weight: bold;
  text-transform: uppercase;
}

/* Shared Table Styles */
.dashboard-layout table {
  width: 100%;
  text-align: center;
  border-spacing: 8px;
  border-collapse: separate;
}

.dashboard-layout th,
.dashboard-layout td {
  background-color: rgb(26, 49, 71);
  height: 50px;
  border-radius: 8px;
  color: white;
  padding: 10px;
}

.dashboard-layout th {
  background-color: #0481ff;
  font-weight: 600;
}

.dashboard-layout td:hover {
  background-color: #ffffff33;
}
</style>
