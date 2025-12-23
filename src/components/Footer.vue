<template>
  <!-- footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-wrapper">
        <h2 class="footer-title"><span>follow</span> me on</h2>
        <!-- إضافة قسم أيقونات التواصل الاجتماعي -->
        <div class="social-icons">
          <a href="#" class="social-icon github" target="_blank">
            <font-awesome-icon :icon="['fab', 'github']" />
          </a>

          <a href="#" class="social-icon behance" target="_blank">
            <font-awesome-icon :icon="['fab', 'behance']" />
          </a>

          <a href="#" class="social-icon tiktok" target="_blank">
            <font-awesome-icon :icon="['fab', 'tiktok']" />
          </a>

          <a href="#" class="social-icon youtube" target="_blank">
            <font-awesome-icon :icon="['fab', 'youtube']" />
          </a>

          <a
            href="https://www.instagram.com/a7medka3oud?igsh=MWt4ZjdmczA4czh6ag=="
            class="social-icon instagram"
            target="_blank"
          >
            <font-awesome-icon :icon="['fab', 'instagram']" />
          </a>

          <a
            href="https://www.facebook.com/share/15nQ9gTgBS/"
            class="social-icon facebook"
            target="_blank"
          >
            <font-awesome-icon :icon="['fab', 'facebook-f']" />
          </a>

          <a
            href="https://x.com/a7medka3oud?t=_A5jmuHr7HmIzL0HLKx5Rg&s=09"
            class="social-icon twitter"
            target="_blank"
          >
            <font-awesome-icon :icon="['fab', 'twitter']" />
          </a>

          <a href="#" class="social-icon whatsapp" target="_blank">
            <font-awesome-icon :icon="['fab', 'whatsapp']" />
          </a>

          <a href="#" class="social-icon telegram" target="_blank">
            <font-awesome-icon :icon="['fab', 'telegram']" />
          </a>

          <a href="#" class="social-icon gmail" target="_blank">
            <font-awesome-icon :icon="['fab', 'google']" />
          </a>
        </div>

        <div class="footer-info">
          <p>
            Copyright &copy; 2025 by How To Dev | <span>{{ siteName }}</span
            >.
          </p>
        </div>
        <div class="iconTop">
          <a href="#home">
            <i class="fa-solid fa-arrow-up"></i>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useSiteSettings } from "@/composables/useSiteSettings";

const { siteName } = useSiteSettings();
</script>
