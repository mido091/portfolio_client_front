<template>
  <div class="container">
    <section v-if="id == '1'">
      <h2>certificate details</h2>
      <p>{{ id }}</p>
    </section>
    <section v-if="id == '2'">
      <h2>certificate details</h2>
      <p>{{ id }}</p>
    </section>
    <section v-if="id == '3'">
      <h2>certificate details</h2>
      <p>{{ id }}</p>
    </section>
    <section v-if="id == '4'">
      <h2>certificate details</h2>
      <p>{{ id }}</p>
    </section>
    <section v-if="id == '5'">
      <h2>certificate details</h2>
      <p>{{ id }}</p>
    </section>
    <section v-if="id == '6'">
      <h2>certificate details</h2>
      <p>{{ id }}</p>
    </section>
    <section v-if="id == '7'">
      <h2>certificate details</h2>
      <p>{{ id }}</p>
    </section>
    <section v-if="id == '8'">
      <h2>certificate details</h2>
      <p>{{ id }}</p>
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
