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
import { onMounted, onUnmounted } from "vue";
const route = useRoute();
const id = route.params.id;

onMounted(() => {
  document.body.classList.add("certificate-details-footer-fix");
});

onUnmounted(() => {
  document.body.classList.remove("certificate-details-footer-fix");
});
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

<style>
/* Global override for this page only */
body.certificate-details-footer-fix .footer {
  background-color: #1c1c1d !important;
  background: #1c1c1d !important;
}
</style>
