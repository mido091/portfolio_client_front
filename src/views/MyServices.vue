<template>
  <div class="container">
    <section v-if="id == 'Web Development'">
      <h2>Web Development</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
      </p>
    </section>
    <section v-else-if="id == 'Graphic Design'">
      <h2>Graphic Design</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
      </p>
    </section>
    <section v-else-if="id == 'Digital Marketing'">
      <h2>Digital Marketing</h2>
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
