<template>
  <section id="about" class="about">
    <div class="container">
      <div class="about-wrapper">
        <div class="about-left">
          <div class="about-img">
            <img
              src="/src/assets/images/my_pictures/man.jpg"
              alt="My Picture"
              ref="heroImg"
            />
          </div>
        </div>
        <div class="about-right">
          <div class="about-info">
            <h2 ref="heroH2"><span>Welcome</span> to</h2>
            <h3 ref="heroH3">My Personal Website</h3>
            <div class="border-left" ref="heroBorder"></div>
            <p class="typing-text" ref="typingEl">
              {{ typedText }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="about-me fade-slide-up" data-delay="300">
    <h2>About <span>Me</span></h2>
    <div class="content fade-slide-up" data-delay="400">
      <p>
        I'm Ahmed Abdelrahman Kaoud Fadel, a passionate Front-End Developer,
        Digital Marketer, and Content Creator. With expertise in UI/UX Design,
        Copywriting, and AI tools, I strive to create impactful digital
        experiences.
      </p>
      <ul class="fade-slide-up" data-delay="500">
        <li><strong>Age:</strong> 25</li>
        <li><strong>Education:</strong> High School - Science Division</li>
        <li>
          <strong>Languages:</strong> Arabic (Native), English (Proficient)
        </li>
      </ul>
    </div>
  </section>
  <section class="skills">
    <h2 class="fade-slide-up">My <span>Skills</span></h2>
    <div class="border-animation">
      <p>HTML, CSS, JavaScript</p>
      <p>UI/UX Design</p>
      <p>Copywriting & Content Creation</p>
      <p>Digital Marketing & Media Buying</p>
      <p>Leadership & Teamwork</p>
    </div>
  </section>
  <section class="experience">
    <h2 class="fade-slide-up">My <span>Experiences</span></h2>
    <div class="border-animation">
      <p>Front-End Developer</p>
      <p>Digital Marketer & Account Manager</p>
      <p>Graphic Designer</p>
      <p>AI Tools Expert</p>
      <p>WordPress & Shopify Developer</p>
    </div>
  </section>
  <section class="interests">
    <h2 class="fade-slide-up">My <span>Interests</span></h2>
    <div class="border-animation">
      <p>Traveling & Exploration</p>
      <p>Education & Learning</p>
      <p>Business Management</p>
      <p>Investing & Entrepreneurship</p>
      <p>Conducting Educational Seminars</p>
    </div>
  </section>
  <section class="certificates fade-slide-up" data-delay="1200">
    <h2>My <span>Certificates</span></h2>
    <div class="certificate-gallery fade-slide-up" data-delay="1300">
      <img
        src="/src/assets/images/about/yyy.jpeg"
        alt="Google Digital Marketing Certificate"
      />
      <!-- ... (Rest of images) -->
      <img
        src="/src/assets/images/about/yyy.jpeg"
        alt="Google Digital Marketing Certificate"
      />
      <img
        src="/src/assets/images/about/yyy.jpeg"
        alt="Google Digital Marketing Certificate"
      />
      <img
        src="/src/assets/images/about/yyy.jpeg"
        alt="Google Digital Marketing Certificate"
      />
      <img
        src="/src/assets/images/about/yyy.jpeg"
        alt="Google Digital Marketing Certificate"
      />
      <img
        src="/src/assets/images/about/yyy.jpeg"
        alt="Google Digital Marketing Certificate"
      />
      <img
        src="/src/assets/images/about/yyy.jpeg"
        alt="Google Digital Marketing Certificate"
      />
      <img
        src="/src/assets/images/about/yyy.jpeg"
        alt="Google Digital Marketing Certificate"
      />
    </div>
  </section>
  <section class="contact fade-slide-up" data-delay="1400">
    <h2>my<span> cv</span></h2>
    <div class="cv fade-slide-up" data-delay="1500">
      <div>
        <a href="cv.pdf " download id="btn">
          <button>Download My CV</button>
        </a>
      </div>
      <div>
        <a href="index.html#contact" download id="btn">
          <button>contact me</button>
        </a>
      </div>
    </div>
    <p id="p">
      Feel free to reach out for collaborations, inquiries, or opportunities.
    </p>
  </section>
  <!-- scroll -->
  <div id="progress">
    <span id="progress-value">
      <i class="fa-solid fa-arrow-up"></i>
    </span>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import "/src/assets/js/all.js/all.js";

const typedText = ref("");
const fullText =
  "I am a web developer and UI designer, passionate about creating unique user experiences.";
let typingInterval = null;

const heroImg = ref(null);
const heroH2 = ref(null);
const heroH3 = ref(null);
const heroBorder = ref(null);
const typingEl = ref(null);

const startTyping = () => {
  let index = 0;
  typedText.value = "";
  clearInterval(typingInterval);
  typingInterval = setInterval(() => {
    if (index < fullText.length) {
      typedText.value += fullText.charAt(index);
      index++;
    } else {
      clearInterval(typingInterval);
    }
  }, 50);
};

let observers = [];

onMounted(() => {
  // 1. Initial Hero Animations
  setTimeout(() => {
    if (heroImg.value) heroImg.value.classList.add("visible");
    if (heroH2.value) heroH2.value.classList.add("visible");
    if (heroBorder.value) heroBorder.value.classList.add("visible");
    if (heroH3.value) {
      heroH3.value.classList.add("visible");
      heroH3.value.addEventListener(
        "transitionend",
        () => {
          if (typingEl.value) {
            typingEl.value.classList.add("visible");
            startTyping();
          }
        },
        { once: true }
      );
    }
  }, 100);

  // 2. IntersectionObserver for Fade/Slide Up
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay) || 200;
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, delay);
        }
      });
    },
    { threshold: 0.1 }
  );

  document
    .querySelectorAll(".fade-slide-up")
    .forEach((el) => fadeObserver.observe(el));
  observers.push(fadeObserver);

  // 3. IntersectionObserver for Border Animation
  const borderObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const paragraphs = el.querySelectorAll("p");
          el.classList.add("animate-border");

          setTimeout(() => {
            el.style.animation = "none";
            el.style.borderColor = "var(--color)";
            paragraphs.forEach((p, index) => {
              setTimeout(() => {
                p.style.opacity = "1";
                p.style.transform = "translateX(0)";
              }, index * 700);
            });
          }, 2000);
          borderObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document
    .querySelectorAll(".border-animation")
    .forEach((el) => borderObserver.observe(el));
  observers.push(borderObserver);
});

onUnmounted(() => {
  clearInterval(typingInterval);
  observers.forEach((obs) => obs.disconnect());
});
</script>

<style scoped>
@import "/src/assets/css/all.css/all.css";
@import "/src/assets/css/about/about.css";

/* Ensure elements are visible even if JS fails or for initial render robustness */
.fade-slide-up.visible,
.border-animation.animate-border,
.about-img img.visible,
.about-info h2.visible,
.about-info h3.visible,
.border-left.visible {
  opacity: 1 !important;
  transform: translate(0) scale(1) !important;
}
</style>
