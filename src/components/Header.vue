<template>
  <header :class="{ scrolled: isScrolled }">
    <div class="container">
      <nav class="header-nav">
        <!-- LEFT ZONE: Logo + Search -->
        <div class="header-left">
          <div class="logo">
            <router-link to="/"
              >{{ logoText }}<span>{{ logoAccent }}</span></router-link
            >
          </div>
          <div class="search-container">
            <div class="search-box">
              <font-awesome-icon
                :icon="['fas', 'magnifying-glass']"
                class="search-icon"
              />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search..."
                @focus="showResults = true"
                @blur="handleBlur"
              />
              <transition name="fade">
                <div
                  v-if="showResults && searchResults.length"
                  class="search-results"
                >
                  <div
                    v-for="result in searchResults"
                    :key="result.name"
                    class="result-item"
                    @mousedown="navigateTo(result)"
                  >
                    <font-awesome-icon
                      :icon="result.icon"
                      class="result-icon"
                    />
                    <span>{{ result.name }}</span>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- CENTER ZONE: Navigation Links -->
        <div class="header-center" v-if="isDesktop">
          <ul class="nav-links">
            <li>
              <router-link to="/" exact-active-class="active">Home</router-link>
            </li>
            <li>
              <router-link to="/list-experiences" active-class="active"
                >Services</router-link
              >
            </li>
            <li>
              <router-link to="/list-skills" active-class="active"
                >Skills</router-link
              >
            </li>
            <li>
              <router-link to="/list-work" active-class="active"
                >Portfolio</router-link
              >
            </li>
            <li>
              <router-link to="/blogs" active-class="active">Plogs</router-link>
            </li>
            <li>
              <router-link to="/about" active-class="active">About</router-link>
            </li>
            <li>
              <router-link to="/brief" active-class="active">Brief</router-link>
            </li>
          </ul>
        </div>

        <!-- RIGHT ZONE: Actions & Profile -->
        <div class="header-right">
          <!-- Theme Toggle -->
          <label class="mode">
            <input
              type="checkbox"
              :checked="isLightTheme"
              @change="toggleTheme"
              id="darkModeButton"
            />
            <font-awesome-icon :icon="['fas', 'sun']" class="fa-sun" />
            <font-awesome-icon :icon="['fas', 'moon']" class="fa-moon" />
          </label>

          <!-- Mobile Menu Toggle (Hamburger) -->
          <button
            v-if="!isDesktop"
            class="hamburger"
            :class="{ active: mobileMenuOpen }"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <div class="bar"></div>
          </button>

          <!-- User Dropdown / Login -->
          <div class="user-dropdown-wrapper">
            <template v-if="isAuthenticated">
              <div
                class="user-trigger"
                @click.stop="showUserMenu = !showUserMenu"
              >
                <img
                  :src="user?.image || defaultImg"
                  alt="Profile"
                  class="header-avatar"
                />
                <span v-if="isDesktop" class="username">{{
                  user?.name || "User"
                }}</span>
                <font-awesome-icon
                  :icon="['fas', 'chevron-down']"
                  class="dropdown-chevron"
                  :class="{ rotated: showUserMenu }"
                />
              </div>
              <transition name="slide-up">
                <ul v-if="showUserMenu" class="user-dropdown-menu">
                  <li v-if="isAdmin">
                    <router-link to="/dashboard" @click="showUserMenu = false">
                      <font-awesome-icon :icon="['fas', 'chart-line']" />
                      Dashboard
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/profile" @click="showUserMenu = false">
                      <font-awesome-icon :icon="['fas', 'user']" /> Profile
                    </router-link>
                  </li>
                  <hr />
                  <li>
                    <a href="#" @click.prevent="logout">
                      <font-awesome-icon
                        :icon="['fas', 'right-from-bracket']"
                      />
                      Logout
                    </a>
                  </li>
                </ul>
              </transition>
            </template>
            <router-link v-else to="/login" class="login-btn"
              >Login</router-link
            >
          </div>
        </div>
      </nav>

      <!-- Mobile Navigation Drawer -->
      <transition name="slide-left">
        <ul v-if="!isDesktop && mobileMenuOpen" class="mobile-nav">
          <li>
            <router-link to="/" @click="mobileMenuOpen = false"
              >Home</router-link
            >
          </li>
          <li>
            <router-link to="/list-experiences" @click="mobileMenuOpen = false"
              >Services</router-link
            >
          </li>
          <li>
            <router-link to="/list-skills" @click="mobileMenuOpen = false"
              >Skills</router-link
            >
          </li>
          <li>
            <router-link to="/list-work" @click="mobileMenuOpen = false"
              >Portfolio</router-link
            >
          </li>
          <li>
            <router-link to="/blogs" @click="mobileMenuOpen = false"
              >Plogs</router-link
            >
          </li>
          <li>
            <router-link to="/about" @click="mobileMenuOpen = false"
              >About</router-link
            >
          </li>
          <li>
            <a href="/#contact" @click="mobileMenuOpen = false">Contact</a>
          </li>
        </ul>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { useSiteSettings } from "@/composables/useSiteSettings";

const router = useRouter();
const { isAuthenticated, user, isAdmin, logout } = useAuth();

// Get site settings
const {
  logoText,
  logoAccent,
  isLightTheme: isLightThemeFromSettings,
  toggleTheme: toggleSiteTheme,
} = useSiteSettings();

// UI States
const isScrolled = ref(false);
const mobileMenuOpen = ref(false);
const isDesktop = ref(window.innerWidth >= 1024); // Standard desktop breakpoint
const showUserMenu = ref(false);

const defaultImg =
  "https://res.cloudinary.com/ddqlt5oqu/image/upload/v1764967019/default_pi1ur8.webp";

// Search Logic
const searchQuery = ref("");
const showResults = ref(false);
const searchableItems = [
  { name: "Home", link: "/", icon: ["fas", "house"] },
  { name: "Services", link: "/list-experiences", icon: ["fas", "briefcase"] },
  { name: "Skills", link: "/list-skills", icon: ["fas", "gears"] },
  { name: "Portfolio", link: "/list-work", icon: ["fas", "folder-open"] },
  { name: "Blogs", link: "/blogs", icon: ["fas", "pen-nib"] },
  { name: "About Me", link: "/about", icon: ["fas", "user-tie"] },
  { name: "Contact", link: "/#contact", icon: ["fas", "envelope"] },
];

const searchResults = computed(() => {
  if (!searchQuery.value) return [];
  const query = searchQuery.value.toLowerCase();
  return searchableItems.filter((item) =>
    item.name.toLowerCase().includes(query)
  );
});

const navigateTo = (result) => {
  if (result.link.startsWith("/#")) {
    const elId = result.link.split("#")[1];
    window.location.hash = elId;
  } else {
    router.push(result.link);
  }
  searchQuery.value = "";
  showResults.value = false;
};

const handleBlur = () => {
  setTimeout(() => {
    showResults.value = false;
  }, 200);
};

// Theme Logic - now uses global settings
const isLightTheme = isLightThemeFromSettings;
const toggleTheme = () => {
  toggleSiteTheme();
};

// Lifecycle
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 1024;
};

const closeMenus = () => {
  showUserMenu.value = false;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleResize);
  document.addEventListener("click", closeMenus);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("click", closeMenus);
});
</script>

<style scoped>
header {
  height: 85px;
  background: var(--bg-color);
  transition: all 0.3s ease;
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
}

header.scrolled {
  height: 70px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.header-nav {
  display: flex !important;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

/* ZONE 1: LEFT */
.header-left {
  display: flex;
  align-items: center;
  gap: 30px;
  flex: 1;
}

.logo {
  white-space: nowrap;
}

.logo a {
  text-decoration: none;
  font-size: 26px;
  font-weight: 700;
  color: var(--first);
}

.logo a span {
  color: var(--color);
}

.search-container {
  width: 100%;
  max-width: 300px;
}

.search-box {
  position: relative;
}

.search-box input {
  width: 100%;
  padding: 8px 15px 8px 38px;
  background: var(--box-bg);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: var(--first);
  font-size: 13px;
  transition: 0.3s;
}

.search-box input:focus {
  outline: none;
  border-color: var(--color);
  background: rgba(255, 255, 255, 0.05);
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--place-clr);
  font-size: 13px;
  opacity: 0.6;
}

/* ZONE 2: CENTER */
.header-center {
  flex: 2;
  display: flex;
  justify-content: center;
}

.nav-links {
  display: flex;
  gap: 30px;
  list-style: none;
  padding: 0;
}

.nav-links li a {
  color: var(--first);
  font-weight: 500;
  text-decoration: none;
  font-size: 15px;
  transition: 0.3s;
  white-space: nowrap;
}

.nav-links li a:hover,
.nav-links li a.active {
  color: var(--color);
}

/* ZONE 3: RIGHT */
.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
  justify-content: flex-end;
}

/* Theme Toggle */
.mode {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.mode input {
  position: absolute;
  opacity: 0;
}

.fa-sun,
.fa-moon {
  font-size: 20px;
  color: var(--first);
  transition: 0.3s;
}

.fa-moon {
  display: none;
}
input:checked ~ .fa-sun {
  display: none;
}
input:checked ~ .fa-moon {
  display: block;
}

/* User Trigger */
.user-dropdown-wrapper {
  position: relative;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 20px;
  transition: background 0.2s;
}

.user-trigger:hover {
  background: rgba(255, 255, 255, 0.05);
}

.header-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color);
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: var(--first);
}

.dropdown-chevron {
  font-size: 11px;
  color: var(--place-clr);
  transition: transform 0.3s;
}

.dropdown-chevron.rotated {
  transform: rotate(180deg);
}

.user-dropdown-menu {
  position: absolute;
  top: calc(100% + 15px);
  right: 0;
  width: 180px;
  background: var(--mob-color);
  border-radius: 12px;
  padding: 8px 0;
  list-style: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  z-index: 1100;
}

.user-dropdown-menu li a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  color: var(--first);
  text-decoration: none;
  font-size: 13.5px;
  transition: 0.2s;
}

.user-dropdown-menu li a:hover {
  background: var(--color);
  color: #fff;
}

.user-dropdown-menu hr {
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin: 6px 0;
}

/* Search Results dropdown */
.search-results {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  width: 100%;
  background: var(--mob-color);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.result-item {
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: var(--first);
  font-size: 13px;
}

.result-item:hover {
  background: var(--color);
  color: #fff;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active {
  transition: all 0.2s ease-out;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(5px);
}

/* Mobile Menu Button */
.hamburger {
  display: block;
  width: 25px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.hamburger .bar,
.hamburger::after,
.hamburger::before {
  content: "";
  display: block;
  width: 100%;
  height: 2px;
  background: var(--first);
  margin: 5px 0;
  transition: 0.3s;
}

.hamburger.active::before {
  transform: rotate(-45deg) translate(-5px, 4px);
}
.hamburger.active::after {
  transform: rotate(45deg) translate(-5px, -4px);
}
.hamburger.active .bar {
  opacity: 0;
}
.login-btn:hover {
  color: var(--color);
  background: transparent;
  transform: translateY(-7px);
  box-shadow: 0 0 0.7rem var(--color);
}
.login-btn {
  font-size: 12px;
  font-weight: 600;
  padding: 10px 20px;
  margin: 1em;
  border-radius: 25px;
  color: #fff;
  background: var(--color);
  border: 2px solid var(--color);
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease-in;
}
/* Mobile Nav Drawer */
.mobile-nav {
  position: fixed;
  top: 70px;
  left: 0;
  width: 100%;
  background: var(--mob-color);
  list-style: none;
  padding: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  z-index: 999;
}

.mobile-nav li a {
  display: block;
  padding: 12px 0;
  color: var(--first);
  text-decoration: none;
  font-size: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

/* Transition for Mobile Nav */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Desktop sizing adjustments */
@media (max-width: 1024px) {
  .header-left {
    gap: 15px;
  }
  .logo a {
    font-size: 22px;
  }
  .search-container {
    max-width: 180px;
  }
  .header-center {
    display: none;
  }
}

/* Tablet adjustments */
@media (max-width: 768px) {
  .header-left {
    gap: 12px;
  }
  .logo a {
    font-size: 20px;
  }
  .search-container {
    max-width: 150px;
  }
  .search-box input {
    font-size: 12px;
    padding: 7px 12px 7px 35px;
  }
  .search-icon {
    left: 10px;
    font-size: 12px;
  }
  .username {
    display: none;
  }
  .header-avatar {
    width: 28px;
    height: 28px;
  }
}

/* Mobile - hide search completely */
@media (max-width: 640px) {
  .search-container {
    display: none;
  }
  .logo a {
    font-size: 18px;
  }
  .header-right {
    gap: 15px;
  }

  /* Improve mobile navigation touch targets */
  .mobile-nav li a {
    padding: 16px 0;
    min-height: 48px;
    display: flex;
    align-items: center;
  }

  /* Add active state for mobile nav */
  .mobile-nav li a.router-link-active {
    color: var(--color);
    font-weight: 600;
  }
}
</style>
