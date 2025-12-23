<template>
  <div class="menu" :class="{ 'mobile-open': isMobileOpen }">
    <!-- Close button for mobile -->
    <button v-if="isMobile" class="mobile-close-btn" @click="$emit('close')">
      <font-awesome-icon :icon="['fas', 'times']" />
    </button>

    <ul>
      <li class="profile">
        <div class="img-box">
          <img
            :src="
              user?.image ||
              'https://res.cloudinary.com/ddqlt5oqu/image/upload/v1764967019/default_pi1ur8.webp'
            "
            alt="image profile"
          />
        </div>
        <h2>{{ user?.name || "User" }}</h2>
      </li>

      <hr />

      <li>
        <router-link
          to="/dashboard"
          exact-active-class="active"
          @click="$emit('close')"
        >
          <font-awesome-icon :icon="['fas', 'house']" />
          <p>dashboard</p>
        </router-link>
      </li>

      <li>
        <router-link to="/" @click="$emit('close')">
          <font-awesome-icon :icon="['fas', 'house']" />
          <p>Home</p>
        </router-link>
      </li>

      <li>
        <router-link
          to="/dashboard/users"
          active-class="active"
          @click="$emit('close')"
        >
          <font-awesome-icon :icon="['fas', 'users']" />
          <p>clients</p>
        </router-link>
      </li>

      <li>
        <a href="#" @click="$emit('close')">
          <font-awesome-icon :icon="['fas', 'table']" />
          <p>products</p>
        </a>
      </li>

      <li>
        <a href="#" @click="$emit('close')">
          <font-awesome-icon :icon="['fas', 'chart-pie']" />
          <p>charts</p>
        </a>
      </li>

      <li>
        <router-link
          to="/dashboard/blogs"
          active-class="active"
          @click="$emit('close')"
        >
          <font-awesome-icon :icon="['fas', 'pen']" />
          <p>posts</p>
        </router-link>
      </li>

      <li>
        <a href="#" @click="$emit('close')">
          <font-awesome-icon :icon="['fas', 'star']" />
          <p>favorite</p>
        </a>
      </li>

      <li>
        <a href="#" @click="$emit('close')">
          <font-awesome-icon :icon="['fas', 'gear']" />
          <p>settings</p>
        </a>
      </li>

      <li class="log-out">
        <a href="#" @click.prevent="handleLogout">
          <font-awesome-icon :icon="['fas', 'right-from-bracket']" />
          <p>log out</p>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAuth } from "@/composables/useAuth";

const props = defineProps({
  isMobileOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const { user, logout } = useAuth();
const isMobile = ref(window.innerWidth < 768);

const handleLogout = () => {
  emit("close");
  logout();
};

const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
  if (!isMobile.value && props.isMobileOpen) {
    emit("close");
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
.menu {
  background-color: #123;
  width: 70px;
  height: 100vh;
  padding: 15px 10px;
  overflow: hidden;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: sticky;
  top: 0;
  flex-shrink: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.menu:hover {
  width: 260px;
}

.profile {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 5px;
  margin-bottom: 10px;
  min-height: 55px;
}

.img-box {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #0481ff;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile h2 {
  font-size: 16px;
  text-transform: capitalize;
  color: white;
  margin: 0;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s;
}

.menu:hover .profile h2 {
  opacity: 1;
}

hr {
  margin: 10px 0;
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
}

ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 0;
  margin: 0;
  gap: 8px;
}

ul li {
  width: 100%;
}

ul li a {
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 12px;
  border-radius: 10px;
  color: #ccc;
  transition: all 0.2s ease;
  white-space: nowrap;
}

/* Icon Container - Fixed size for alignment */
.menu ul li a :deep(svg),
.menu ul li a .fa-icon {
  width: 26px !important;
  font-size: 18px;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}

ul li a p {
  margin: 0 0 0 20px;
  font-size: 14px;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.2s;
}

.menu:hover ul li a p {
  opacity: 1;
}

/* Hover & Active States */
ul li a:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
}

ul li a.active {
  background-color: #0481ff;
  color: white;
  box-shadow: 0 4px 10px rgba(4, 129, 255, 0.3);
}

/* Sticky Logout at Bottom */
.log-out {
  margin-top: auto;
  padding-top: 20px;
}

.log-out a {
  background-color: rgba(220, 53, 69, 0.1) !important;
  color: #ff4444 !important;
  border: 1px solid rgba(220, 53, 69, 0.2);
}

.log-out a:hover {
  background-color: #dc3545 !important;
  color: white !important;
}

/* Mobile close button */
.mobile-close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 1000;
}

.mobile-close-btn:hover {
  background: rgba(255, 68, 68, 0.2);
  transform: rotate(90deg);
}

/* Mobile responsive behavior */
@media (max-width: 768px) {
  .menu {
    position: fixed;
    left: 0;
    top: 0;
    width: 260px;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1001;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
  }

  .menu.mobile-open {
    transform: translateX(0);
  }

  /* Always show content on mobile when open */
  .menu.mobile-open .profile h2,
  .menu.mobile-open ul li a p {
    opacity: 1;
  }

  /* Larger tap targets for mobile */
  .menu ul li a {
    padding: 16px 12px;
    min-height: 48px;
  }

  .profile {
    min-height: 70px;
    padding: 10px 5px;
  }
}
</style>
