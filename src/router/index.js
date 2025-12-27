import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "../composables/useAuth";

const router = createRouter({
  // ... (existing history and routes)
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/Home.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/About.vue"),
    },
    {
      path: "/certificates",
      name: "certificates",
      component: () => import("../views/CertificatesPage.vue"),
    },
    {
      path: "/books",
      name: "books",
      component: () => import("../views/BooksPage.vue"),
    },
    {
      path: "/blogs",
      name: "blogs",
      component: () => import("../views/Blogs.vue"),
    },
    {
      path: "/blog-details",
      name: "blog-details",
      component: () => import("../views/BlogDetails.vue"),
    },
    {
      path: "/brief",
      name: "brief",
      component: () => import("../views/Brief.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("../views/Profile.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/dashboard",
      component: () => import("../views/layouts/DashboardLayout.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: "",
          name: "dashboard",
          component: () => import("../views/Dashboard.vue"),
        },
        {
          path: "blogs",
          name: "dashboard-blogs",
          component: () => import("../views/DashboardBlogs.vue"),
        },
        {
          path: "users",
          name: "dashboard-users",
          component: () => import("../views/DashboardUsers.vue"),
        },
      ],
    },
    {
      path: "/list-experiences",
      name: "list-experiences",
      component: () => import("../views/ListExperiences.vue"),
    },
    {
      path: "/list-skills",
      name: "list-skills",
      component: () => import("../views/ListSkills.vue"),
    },
    {
      path: "/list-tools",
      name: "list-tools",
      component: () => import("../views/ListTools.vue"),
    },
    {
      path: "/list-work",
      name: "list-work",
      component: () => import("../views/ListWork.vue"),
    },
    {
      path: "/brief",
      name: "brief",
      component: () => import("../views/Brief.vue"),
    },
    {
      path: "/my-services/:id",
      name: "my-services",
      component: () => import("../views/MyServices.vue"),
    },
    {
      path: "/my-tools/:id",
      name: "my-tools",
      component: () => import("../views/MyTool.vue"),
    },
    {
      path: "/my-project/:id",
      name: "my-project",
      component: () => import("../views/MyProject.vue"),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  },
});

// Navigation guard for authentication and roles
router.beforeEach((to, from, next) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next("/login");
  } else if (to.meta.requiresAdmin && !isAdmin.value) {
    next("/");
  } else {
    next();
  }
});

export default router;
