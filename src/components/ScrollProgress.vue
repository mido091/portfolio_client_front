<template>
  <!-- scroll -->
  <div
    id="progress_1"
    ref="progressCircle"
    @click="scrollToTop"
    :style="progressStyle"
  >
    <span id="progress-value">
      <font-awesome-icon :icon="['fas', 'arrow-up']" />
    </span>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from "vue";

const progressCircle = ref(null);
const scrollValue = ref(0);
const isVisible = ref(false);

const progressStyle = computed(() => ({
  display: isVisible.value ? "grid" : "none",
  background: `conic-gradient(#ff5000 ${scrollValue.value}%, #d7d7d7 ${scrollValue.value}%)`,
}));

const calcScrollValue = () => {
  const pos = document.documentElement.scrollTop;
  const calcHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  scrollValue.value = Math.round((pos * 100) / calcHeight);
  isVisible.value = pos > 100;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  window.addEventListener("scroll", calcScrollValue);
  calcScrollValue(); // Initial run
});

onUnmounted(() => {
  window.removeEventListener("scroll", calcScrollValue);
});
</script>

<style scoped>
#progress_1 {
  position: fixed;
  bottom: 30px;
  right: 30px;
  height: 70px;
  width: 70px;
  place-items: center;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1000; /* High z-index to stay on top */
  cursor: pointer;
}
#progress_1 #progress-value {
  display: block;
  height: calc(100% - 15px);
  width: calc(100% - 15px);
  background-color: var(--box-bg);
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 35px;
  color: var(--first);
}

@media (max-width: 768px) {
  #progress_1 {
    bottom: 20px;
    right: 20px;
    height: 50px;
    width: 50px;
  }
  #progress_1 #progress-value {
    font-size: 25px;
  }
}
</style>
