<template>
  <section class="blog-details-section">
    <div class="container">
      <div class="details-wrapper">
        <router-link to="/blogs" class="back-btn">
          <i class="fas fa-arrow-left"></i> Back to Blogs
        </router-link>

        <!-- Loading state -->
        <div v-if="loading" class="loading">
          <i class="fas fa-spinner fa-spin"></i> Loading details...
        </div>

        <!-- Error state -->
        <p v-else-if="error" class="error-message">{{ error }}</p>

        <!-- Blog content -->
        <div v-else :class="['blog-content', { 'rtl-post': isArabic }]">
          <h1>{{ blog.title }}</h1>
          <div class="blog-meta">
            <span>{{ formattedDate }}</span>
          </div>

          <div v-if="blog.image" class="blog-image-container">
            <img :src="blog.image" :alt="blog.title" />
          </div>

          <div class="blog-description" v-html="blog.description"></div>

          <div class="blog-author">
            <p>
              Written by: <span>{{ blog.footer || "Unknown Author" }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const blog = ref({});
const loading = ref(true);
const error = ref(null);

const formattedDate = computed(() => {
  if (!blog.value.created_at && !blog.value.updated_at) return "";
  const dateStr = blog.value.updated_at || blog.value.created_at;
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const isArabic = computed(() => {
  const content =
    (blog.value.title || "") +
    (blog.value.description || "") +
    (blog.value.footer || "");
  return /[\u0600-\u06FF]/.test(content);
});

onMounted(async () => {
  const token = localStorage.getItem("token");
  const blogId = route.query.id;

  if (!token) {
    router.push("/login");
    return;
  }

  if (!blogId) {
    error.value = "Blog ID not provided.";
    loading.value = false;
    return;
  }

  try {
    const response = await fetch(
      "https://portfolio-client-server.vercel.app/api/plogs",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch blogs");
    }

    const data = await response.json();
    const blogs = data.plogs || [];
    const foundBlog = blogs.find((b) => b.id == blogId);

    if (!foundBlog) {
      throw new Error("Blog not found");
    }

    blog.value = foundBlog;
  } catch (err) {
    console.error("Error fetching blog details:", err);
    error.value =
      err.message === "Blog not found"
        ? "Blog not found."
        : "Failed to load blog details. Please try again later.";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
@import "/src/assets/css/all.css/all.css";
@import "/src/assets/css/blog-details.css";

.error-message {
  color: #ff4444;
  text-align: center;
  padding: 20px;
  font-size: 1.2rem;
}
</style>
