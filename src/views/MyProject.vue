<template>
  <div class="container">
    <section v-if="id == 'Web Design'">
      <h2>Web Design</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
      </p>
    </section>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
const id = route.params.id;
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
p {
  color: white;
}
</style>
