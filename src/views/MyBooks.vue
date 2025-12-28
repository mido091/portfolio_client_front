<template>
  <div class="container">
    <section v-if="id == 'Clean Code'">
      <h2>Clean Code</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
      </p>
    </section>
    <section v-if="id == 'The Pragmatic Programmer'">
      <h2>The Pragmatic Programmer</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
      </p>
    </section>
    <section v-if="id == 'Design Patterns'">
      <h2>Design Patterns</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
      </p>
    </section>
    <section v-if="id == 'Refactoring'">
      <h2>Refactoring</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
      </p>
    </section>
    <section v-if="id == 'You Don\'t Know JS'">
      <h2>You Don\'t Know JS</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
      </p>
    </section>
    <section v-if="id == 'Eloquent JavaScript'">
      <h2>Eloquent JavaScript</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
      </p>
    </section>
    <section v-if="id == 'JavaScript: The Good Parts'">
      <h2>JavaScript: The Good Parts</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
      </p>
    </section>
    <section v-if="id == 'Code Complete'">
      <h2>Code Complete</h2>
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
