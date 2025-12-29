<template>
  <section id="about" class="about">
    <div class="container">
      <div class="about-wrapper">
        <div class="about-left">
          <div class="about-img">
            <img
              src="/images/my_pictures/man.jpg"
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
    <div class="border-animation" style="overflow: hidden;">
      <p>HTML, CSS, JavaScript</p>
      <p>UI/UX Design</p>
      <p>Copywriting & Content Creation</p>
      <p>Digital Marketing & Media Buying</p>
      <p>Leadership & Teamwork</p>
    </div>
  </section>
  <section class="experience">
    <h2 class="fade-slide-up">My <span>Experiences</span></h2>
    <div class="border-animation" style="overflow: hidden;">
      <p>Front-End Developer</p>
      <p>Digital Marketer & Account Manager</p>
      <p>Graphic Designer</p>
      <p>AI Tools Expert</p>
      <p>WordPress & Shopify Developer</p>
    </div>
  </section>
  <section class="interests">
    <h2 class="fade-slide-up">My <span>Interests</span></h2>
    <div class="border-animation" style="overflow: hidden;">
      <p>Traveling & Exploration</p>
      <p>Education & Learning</p>
      <p>Business Management</p>
      <p>Investing & Entrepreneurship</p>
      <p>Conducting Educational Seminars</p>
    </div>
  </section>
  <!-- My Certificates -->

  <section class="certificates fade-slide-up" data-delay="1200">
    <h2>My <span>Certificates</span></h2>
    <div class="certificates-content">
      <swiper
        :modules="modules"
        :slides-per-view="1"
        :space-between="30"
        :loop="false"
        :pagination="{ clickable: true, dynamicBullets: true }"
        :navigation="{
          nextEl: '.swiper-button-next-certificates',
          prevEl: '.swiper-button-prev-certificates',
        }"
        :breakpoints="{
          600: { slidesPerView: 2 },
          968: { slidesPerView: 3 },
        }"
        class="certificates-wrapper"
      >
        <swiper-slide
          v-for="(certificate, index) in certificates.slice(0, 6)"
          :key="index"
          class="certificate-slide"
        >
          <div class="certificate-box">
            <router-link :to="`/certificates/${certificate.id}`">
              <img :src="certificate.src" :alt="certificate.alt" />
            </router-link>
          </div>
        </swiper-slide>

        <!-- Navigation Buttons -->
        <div class="swiper-button-next swiper-button-next-certificates">
          <i class="fa-solid fa-chevron-right"></i>
        </div>
        <div class="swiper-button-prev swiper-button-prev-certificates">
          <i class="fa-solid fa-chevron-left"></i>
        </div>
      </swiper>
    </div>
    <a href="#" @click.prevent="navigateToCertificates" id="btn">
      <button>Read More</button>
    </a>
  </section>

  <!-- My Books -->
  <section class="books fade-slide-up" data-delay="1300">
    <h2>Books I've <span>Read</span></h2>
    <div class="books-content">
      <swiper
        :modules="modules"
        :slides-per-view="1"
        :space-between="30"
        :loop="false"
        :pagination="{ clickable: true, dynamicBullets: true }"
        :navigation="{
          nextEl: '.swiper-button-next-books',
          prevEl: '.swiper-button-prev-books',
        }"
        :breakpoints="{
          600: { slidesPerView: 2 },
          968: { slidesPerView: 3 },
        }"
        class="books-wrapper"
      >
        <swiper-slide
          v-for="(book, index) in books.slice(0, 6)"
          :key="index"
          class="book-slide"
        >
          <div class="book-card">
            <img :src="book.coverSrc" :alt="book.title" />
            <h3>{{ book.title }}</h3>
            <p>{{ book.description }}</p>
            <router-link :to="`/my-books/${book.title}`" id="btn">
              <button class="details-btn">View Details</button>
            </router-link>
          </div>
        </swiper-slide>

        <!-- Navigation Buttons -->
        <div class="swiper-button-next swiper-button-next-books">
          <i class="fa-solid fa-chevron-right"></i>
        </div>
        <div class="swiper-button-prev swiper-button-prev-books">
          <i class="fa-solid fa-chevron-left"></i>
        </div>
      </swiper>
    </div>
    <a href="#" @click.prevent="navigateToBooks" id="btn">
      <button>See More</button>
    </a>
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
import { useRouter } from "vue-router";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "/src/assets/js/all.js/all.js";

const modules = [Navigation, Pagination];
const router = useRouter();

const typedText = ref("");
const fullText =
  "I am a web developer and UI designer, passionate about creating unique user experiences.";
let typingInterval = null;

const heroImg = ref(null);
const heroH2 = ref(null);
const heroH3 = ref(null);
const heroBorder = ref(null);
const typingEl = ref(null);

// Certificates data
const certificates = ref([
  {
    id: 1,
    src: "/images/about/yyy.jpeg",
    alt: "Google Digital Marketing Certificate",
  },
  {
    id: 2,
    src: "/images/about/yyy.jpeg",
    alt: "Google Digital Marketing Certificate",
  },
  {
    id: 3,
    src: "/images/about/yyy.jpeg",
    alt: "Google Digital Marketing Certificate",
  },
  {
    id: 4,
    src: "/images/about/yyy.jpeg",
    alt: "Google Digital Marketing Certificate",
  },
  {
    id: 5,
    src: "/images/about/yyy.jpeg",
    alt: "Google Digital Marketing Certificate",
  },
  {
    id: 6,
    src: "/images/about/yyy.jpeg",
    alt: "Google Digital Marketing Certificate",
  },
  {
    id: 7,
    src: "/images/about/yyy.jpeg",
    alt: "Google Digital Marketing Certificate",
  },
  {
    id: 8,
    src: "/images/about/yyy.jpeg",
    alt: "Google Digital Marketing Certificate",
  },
]);

// Books data
const books = ref([
  {
    coverSrc: "/images/books/book.webp",
    title: "Clean Code",
    description:
      "A Handbook of Agile Software Craftsmanship by Robert C. Martin",
  },
  {
    coverSrc: "/images/books/book.webp",
    title: "The Pragmatic Programmer",
    description: "Your Journey To Mastery by David Thomas and Andrew Hunt",
  },
  {
    coverSrc: "/images/books/book.webp",
    title: "Design Patterns",
    description: "Elements of Reusable Object-Oriented Software",
  },
  {
    coverSrc: "/images/books/book.webp",
    title: "Refactoring",
    description: "Improving the Design of Existing Code by Martin Fowler",
  },
  {
    coverSrc: "/images/books/book.webp",
    title: "You Don't Know JS",
    description: "A deep dive into the core mechanisms of JavaScript",
  },
  {
    coverSrc: "/images/books/book.webp",
    title: "Eloquent JavaScript",
    description: "A Modern Introduction to Programming by Marijn Haverbeke",
  },
  {
    coverSrc: "/images/books/book.webp",
    title: "JavaScript: The Good Parts",
    description: "Unearthing the Excellence in JavaScript by Douglas Crockford",
  },
  {
    coverSrc: "/images/books/book.webp",
    title: "Code Complete",
    description:
      "A Practical Handbook of Software Construction by Steve McConnell",
  },
]);

// Navigate to certificates page
const navigateToCertificates = () => {
  router.push("/certificates");
};

// Navigate to books page
const navigateToBooks = () => {
  router.push("/books");
};

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

/* Certificates Slider Styling */
.certificates {
  text-align: center;
}

.certificates h2 {
  font-size: 2.8em;
  color: var(--first);
  margin-bottom: 1em;
}

.certificates h2 span {
  color: var(--color);
}

.certificates-content {
  padding: 0 2em;
  min-height: auto;
}

.certificates-wrapper {
  margin-bottom: 20px;
  padding-bottom: 50px;
  overflow: hidden !important;
}

.certificate-slide {
  overflow: visible !important;
  height: auto;
}

.certificate-box {
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.certificate-box img {
  width: 100%;
  height: auto;
  max-width: 100%;
  border-radius: 15px;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  object-fit: contain;
}

.certificate-box img:hover {
  transform: scale(1.05);
  box-shadow: 0 0 1.5em var(--color);
}

/* Navigation Buttons */
.certificates .swiper-button-next-certificates,
.certificates .swiper-button-prev-certificates {
  color: var(--color);
  padding: 10px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  z-index: 10;
  pointer-events: auto;
  cursor: pointer;
}

.certificates .swiper-button-next-certificates:hover,
.certificates .swiper-button-prev-certificates:hover {
  color: var(--text-color);
}

.certificates .swiper-button-next-certificates::after,
.certificates .swiper-button-prev-certificates::after {
  content: "";
}

/* Pagination Spacing */
.certificates .swiper-pagination {
  margin-top: 30px !important;
}

/* Read More Button */
.certificates #btn {
  display: inline-block;
  text-align: center;
  margin: 20px auto;
  text-decoration: none;
}

.certificates #btn button {
  font-size: 15px;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 25px;
  color: var(--color);
  background: transparent;
  border: 2px solid var(--color);
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease-in;
}

.certificates #btn button:hover {
  color: #fff;
  background: var(--color);
  transform: translateY(-7px);
  box-shadow: 0 0 0.7rem var(--color);
}

/* Books Slider Styling */
.books {
  text-align: center;
}

.books h2 {
  font-size: 2.8em;
  color: var(--first);
  margin-bottom: 1em;
}

.books h2 span {
  color: var(--color);
}

.books-content {
  padding: 0 2em;
  min-height: auto;
}

.books-wrapper {
  margin-bottom: 20px;
  padding-bottom: 50px;
  overflow: hidden !important;
  padding: 40px 1em;
}

.book-slide {
  overflow: visible !important;
  height: auto;
}

.book-card {
  width: 100%;
  height: auto;
  background: var(--box-bg);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 1.5em var(--color);
}

.book-card img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 15px;
}

.book-card h3 {
  font-size: 1.2em;
  color: var(--first);
  margin-bottom: 10px;
  min-height: 2.4em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-card p {
  font-size: 0.9em;
  color: var(--first);
  opacity: 0.8;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
}

/* Navigation Buttons */
.books .swiper-button-next-books,
.books .swiper-button-prev-books {
  color: var(--color);
  padding: 10px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  z-index: 10;
  pointer-events: auto;
  cursor: pointer;
}

.books .swiper-button-next-books:hover,
.books .swiper-button-prev-books:hover {
  color: var(--text-color);
}

.books .swiper-button-next-books::after,
.books .swiper-button-prev-books::after {
  content: "";
}

/* Pagination Spacing */
.books .swiper-pagination {
  margin-top: 30px !important;
}
</style>
