<template>
  <div class="container">
    <section v-if="id == 'Photoshop'">
      <h2>Photoshop</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus quo
        reprehenderit, nam quos tempore ipsa explicabo numquam quasi praesentium
        sapiente voluptates adipisci optio rem beatae, fuga earum aliquam?
        Molestiae, fugit.
      </p>
    </section>
    <section v-if="id == 'Illustrator'">
      <h2>Illustrator</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus quo
        reprehenderit, nam quos tempore ipsa explicabo numquam quasi praesentium
        sapiente voluptates adipisci optio rem beatae, fuga earum aliquam?
        Molestiae, fugit.
      </p>
    </section>
    <section v-if="id == 'Figma'">
      <h2>Figma</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus quo
        reprehenderit, nam quos tempore ipsa explicabo numquam quasi praesentium
        sapiente voluptates adipisci optio rem beatae, fuga earum aliquam?
        Molestiae, fugit.
      </p>
    </section>
    <section v-if="id == 'Git Hub'">
      <h2>Git Hub</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus quo
        reprehenderit, nam quos tempore ipsa explicabo numquam quasi praesentium
        sapiente voluptates adipisci optio rem beatae, fuga earum aliquam?
        Molestiae, fugit.
      </p>
    </section>
    <section v-if="id == 'Notion'">
      <h2>Notion</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus quo
        reprehenderit, nam quos tempore ipsa explicabo numquam quasi praesentium
        sapiente voluptates adipisci optio rem beatae, fuga earum aliquam?
        Molestiae, fugit.
      </p>
    </section>
    <section v-if="id == 'Canva'">
      <h2>Canva</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus quo
        reprehenderit, nam quos tempore ipsa explicabo numquam quasi praesentium
        sapiente voluptates adipisci optio rem beatae, fuga earum aliquam?
        Molestiae, fugit.
      </p>
    </section>
    <section v-if="id == 'ChatGPT'">
      <h2>ChatGPT</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus quo
        reprehenderit, nam quos tempore ipsa explicabo numquam quasi praesentium
        sapiente voluptates adipisci optio rem beatae, fuga earum aliquam?
        Molestiae, fugit.
      </p>
    </section>
    <section v-if="id == 'Git'"></section>
    <section v-if="id == 'Premiere'"></section>
    <section v-if="id == 'Semrush'"></section>
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
