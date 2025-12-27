<template>
  <!-- header -->

  <!-- الواجهة الرئيسية للموقع -->
  <section id="home" class="home">
    <div class="container">
      <div class="home-info">
        <div class="left">
          <h3>hello, I'm</h3>
          <h1>Ahmed Kaoud</h1>
          <h4>And I'm a <span id="multiple"></span></h4>
          <p>
            Specialized in web development, graphic design, and digital
            marketing; creator of content, pioneer in business, and Chief
            Executive Officer of Duroobx Educational Academy.
          </p>
          <div class="social">
            <a href="https://www.facebook.com/share/15nQ9gTgBS/">
              <font-awesome-icon
                :icon="['fab', 'facebook-f']"
                size="1x"
                color="#ff4500"
              />
            </a>
            <a
              href="https://www.instagram.com/a7medka3oud?igsh=MWt4ZjdmczA4czh6ag=="
              target="_blank"
              rel="noopener noreferrer"
            >
              <font-awesome-icon :icon="['fab', 'square-instagram']" />
            </a>

            <a
              href="https://x.com/a7medka3oud?t=_A5jmuHr7HmIzL0HLKx5Rg&s=09"
              target="_blank"
              rel="noopener noreferrer"
            >
              <font-awesome-icon :icon="['fab', 'square-twitter']" />
            </a>

            <a href="#" target="_blank" rel="noopener noreferrer">
              <font-awesome-icon :icon="['fab', 'linkedin']" />
            </a>
          </div>
          <div class="btn">
            <button>Download CV</button>
          </div>
        </div>
        <div class="right">
          <div class="profile">
            <img src="/src/assets/images/my_pictures/man.jpg" alt="" />
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- about me -->
  <section id="about" class="about">
    <div class="container">
      <div class="about-wrapper">
        <div class="about-left">
          <div class="about-img">
            <img src="/src/assets/images/my_pictures/man.jpg" alt="" />
          </div>
        </div>
        <div class="about-right">
          <div class="about-info">
            <h2>About <span>Me</span></h2>
            <h3>Front-end Developer</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatem hic doloribus incidunt nostrum aliquid illum distinctio
              pariatur deserunt aspernatur at.
            </p>
            <!-- <button class="button"><router-link to="/about"></router-link>Read More</button> -->
            <router-link to="/about" target="_blank" id="btn">
              <button>Read More</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!--my skills-->
  <section class="skills">
    <h2>my <span>skills</span></h2>
    <div class="skills-content">
      <swiper
        :modules="modules"
        :slides-per-view="1"
        :space-between="30"
        :loop="true"
        :pagination="{ clickable: true, dynamicBullets: true }"
        :navigation="{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }"
        :breakpoints="{
          600: { slidesPerView: 2 },
          968: { slidesPerView: 3 },
        }"
        class="skills-wrapper"
      >
        <swiper-slide
          v-for="(skill, index) in skills"
          :key="index"
          class="skills-box"
        >
          <div class="front">
            <font-awesome-icon :icon="skill.icon" size="4x" color="#ff4500" />
            <div class="center-years">
              <span class="num" :data-val="skill.years">000</span>
              <span class="years">years</span>
            </div>
            <span class="text">{{ skill.name }}</span>
          </div>
          <div class="back">
            <font-awesome-icon :icon="skill.icon" size="2x" />
            <h3>{{ skill.name }}</h3>
            <p>{{ skill.desc }}</p>
          </div>
        </swiper-slide>

        <!-- Navigation Buttons -->
        <div class="swiper-button-next">
          <i class="fa-solid fa-chevron-right"></i>
        </div>
        <div class="swiper-button-prev">
          <i class="fa-solid fa-chevron-left"></i>
        </div>
      </swiper>
    </div>
    <!-- <button>view all</button> -->
    <router-link to="/list-skills" id="btn" active-class="active"
      ><button>Read More</button></router-link
    >
  </section>
  <!-- my services -->
  <section id="services" class="services">
    <h2>Our <span>services</span></h2>
    <div class="card_container">
      <swiper
        :modules="modules"
        :slides-per-view="1"
        :space-between="30"
        :loop="true"
        :pagination="{ clickable: true, dynamicBullets: true }"
        :navigation="{
          nextEl: '.swiper-button-next-services',
          prevEl: '.swiper-button-prev-services',
        }"
        :breakpoints="{
          600: { slidesPerView: 2 },
          968: { slidesPerView: 3 },
        }"
        class="services-wrapper"
      >
        <swiper-slide
          v-for="(service, index) in services"
          :key="index"
          class="box"
        >
          <div class="icon">
            <font-awesome-icon :icon="service.icon" size="1x" color="#ff4500" />
          </div>
          <h3>{{ service.title }}</h3>
          <p>{{ service.desc }}</p>
          <div class="services-btn">
            <router-link :to="`/my-services/${service.title}`">
              <button>Read More</button>
            </router-link>
          </div>
        </swiper-slide>

        <!-- navigation buttons -->
        <div class="swiper-button-prev swiper-button-prev-services">
          <i class="fa-solid fa-chevron-left"></i>
        </div>
        <div class="swiper-button-next swiper-button-next-services">
          <i class="fa-solid fa-chevron-right"></i>
        </div>
        <!-- pagination -->
        <div class="swiper-pagination"></div>
      </swiper>
    </div>
    <router-link to="/list-experiences" target="_blank" id="btn">
      <button>Read More</button>
    </router-link>
  </section>
  <!-- tools -->
  <section class="Tools" id="tools">
    <h2><span>Programs</span> And <span>Tools</span></h2>
    <!-- السلايدر -->
    <swiper
      :modules="modules"
      :slides-per-view="1"
      :space-between="30"
      :loop="true"
      :pagination="{ clickable: true, dynamicBullets: true }"
      :navigation="{
        nextEl: '.swiper-button-next-tools',
        prevEl: '.swiper-button-prev-tools',
      }"
      :breakpoints="{
        600: { slidesPerView: 2 },
        992: { slidesPerView: 3 },
      }"
      class="portfolio-wrapper"
    >
      <!-- العناصر البرامج والادوات -->
      <swiper-slide v-for="(tool, index) in tools" :key="index">
        <div class="progress-circle" :data-percentage="tool.percentage">
          <div class="image-container">
            <img :src="tool.image" :alt="tool.alt" />
          </div>
          <span class="percentage-text">0%</span>
        </div>
      </swiper-slide>

      <!-- Pagination -->
      <div class="swiper-pagination"></div>

      <!-- Navigation buttons -->
      <div class="swiper-button-next swiper-button-next-tools">
        <i class="fa-solid fa-chevron-right"></i>
      </div>
      <div class="swiper-button-prev swiper-button-prev-tools">
        <i class="fa-solid fa-chevron-left"></i>
      </div>
    </swiper>
    <router-link to="/list-tools" target="_blank" id="btn">
      <button>Read More</button>
    </router-link>
  </section>
  <!-- latest project-->
  <section id="portfolio" class="portfolio">
    <h2>latest <span>project</span></h2>
    <div class="container_portfolio">
      <swiper
        :modules="modules"
        :slides-per-view="1"
        :space-between="30"
        :loop="true"
        :pagination="{ clickable: true, dynamicBullets: true }"
        :navigation="{
          nextEl: '.swiper-button-next-portfolio',
          prevEl: '.swiper-button-prev-portfolio',
        }"
        :breakpoints="{
          600: { slidesPerView: 2 },
          968: { slidesPerView: 3 },
        }"
        class="portfolio-wrapper"
      >
        <swiper-slide
          v-for="(project, index) in projects"
          :key="index"
          class="portfolio-box"
        >
          <img :src="project.image" :alt="project.title" />
          <div class="portfolio-info">
            <h4>{{ project.title }}</h4>
            <p>{{ project.desc }}</p>
            <router-link :to="`/my-project/${project.title}`" target="_blank">
              <font-awesome-icon icon="up-right-from-square" />
            </router-link>
          </div>
        </swiper-slide>

        <!-- Navigation buttons -->
        <div class="swiper-button-prev swiper-button-prev-portfolio">
          <i class="fa-solid fa-chevron-left"></i>
        </div>
        <div class="swiper-button-next swiper-button-next-portfolio">
          <i class="fa-solid fa-chevron-right"></i>
        </div>
      </swiper>
    </div>

    <router-link to="/list-work" target="_blank" id="btn">
      <button>Read More</button>
    </router-link>
  </section>
  <!-- clients -->
  <section class="logo-container">
    <div class="logo-ticker ticker-1">
      <div class="logos">
        <img src="/src/assets/images/clients/apple.jpg" alt="Client 1" />
        <img src="/src/assets/images/clients/cocacola.png" alt="Client 2" />
        <img src="/src/assets/images/clients/Coursera.png" alt="Client 3" />
        <img src="/src/assets/images/clients/Edrak.png" alt="Client 4" />
        <img src="/src/assets/images/clients/Google.png" alt="Client 5" />

        <img src="/src/assets/images/clients/apple.jpg" alt="Client 1" />
        <img src="/src/assets/images/clients/cocacola.png" alt="Client 2" />
        <img src="/src/assets/images/clients/Coursera.png" alt="Client 3" />
        <img src="/src/assets/images/clients/Edrak.png" alt="Client 4" />
        <img src="/src/assets/images/clients/Google.png" alt="Client 5" />
      </div>
    </div>

    <div class="logo-ticker ticker-2">
      <div class="logos">
        <img src="/src/assets/images/clients/HsoubAcademy.png" alt="Client 6" />
        <img src="/src/assets/images/clients/infinity.png" alt="Client 7" />
        <img src="/src/assets/images/clients/never.png" alt="Client 8" />
        <img src="/src/assets/images/clients/stanford.png" alt="Client 9" />
        <img src="/src/assets/images/clients/Udemy.png" alt="Client 10" />

        <img src="/src/assets/images/clients/HsoubAcademy.png" alt="Client 6" />
        <img src="/src/assets/images/clients/infinity.png" alt="Client 7" />
        <img src="/src/assets/images/clients/never.png" alt="Client 8" />
        <img src="/src/assets/images/clients/stanford.png" alt="Client 9" />
        <img src="/src/assets/images/clients/Udemy.png" alt="Client 10" />
      </div>
    </div>
  </section>
  <!-- customer reviews -->
  <section id="contact" class="contact">
    <div class="container">
      <h2>Contact <span>Me!</span></h2>
      <!-- فورم ارسال الرسائل -->
      <form id="contactForm" method="POST" action="/send-email">
        <div class="input-box">
          <input type="text" placeholder="Full Name" required name="name" />
          <input
            type="email"
            placeholder="Email Address"
            required
            name="email"
          />
        </div>
        <div class="input-box">
          <input type="tel" placeholder="Mobile Number" name="phone" />
          <input type="text" placeholder="Email Subject" name="subject" />
        </div>
        <textarea name="message" id="" placeholder="Your Message"></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  </section>
  <!-- scroll -->
  <div id="progress">
    <span id="progress-value">
      <i class="fa-solid fa-arrow-up"></i>
    </span>
  </div>
  <!-- footer -->

  <!-- رابط مكتبة السلايدر رابط خارجي -->
</template>
<script setup>
import { ref, onMounted, nextTick } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const modules = [Navigation, Pagination];

const services = ref([
  {
    icon: ["fas", "comments"],
    title: "Graphic Design",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.",
  },
  {
    icon: ["fas", "comments"],
    title: "Digital Marketing",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.",
  },
  {
    icon: ["fas", "comments"],
    title: "Digital Marketing",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.",
  },
  {
    icon: ["fas", "comments"],
    title: "Digital Marketing",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.",
  },
  {
    icon: ["fas", "comments"],
    title: "Digital Marketing",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.",
  },
  {
    icon: ["fas", "comments"],
    title: "Digital Marketing",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.",
  },
]);

const skills = ref([
  {
    name: "HTML",
    years: "2",
    icon: ["fab", "html5"],
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
  },
  {
    name: "CSS",
    years: "3",
    icon: ["fab", "css3"],
    desc: "مهارة في التواصل الفعال مع الفريق.",
  },
  {
    name: "JavaScript",
    years: "3",
    icon: ["fab", "js"],
    desc: "مهارة في التواصل الفعال مع الفريق.",
  },
  {
    name: "Communication",
    years: "3",
    icon: ["fas", "comments"],
    desc: "مهارة في التواصل الفعال مع الفريق.",
  },
  {
    name: "Research Skill",
    years: "3",
    icon: ["fas", "magnifying-glass"],
    desc: "مهارة في التواصل الفعال مع الفريق.",
  },
  {
    name: "React",
    years: "3",
    icon: ["fab", "react"],
    desc: "مهارة في التواصل الفعال مع الفريق.",
  },
  {
    name: "Meals Delivered",
    years: "3",
    icon: ["fas", "utensils"],
    desc: "مهارة في التواصل الفعال مع الفريق.",
  },
]);

const tools = ref([
  {
    image: "/src/assets/images/programs_and_tools/photoshop.jpeg",
    alt: "Photoshop",
    percentage: 85,
  },
  {
    image: "/src/assets/images/programs_and_tools/illustrator.jpeg",
    alt: "Illustrator",
    percentage: 82,
  },
  {
    image: "/src/assets/images/programs_and_tools/figma.jpeg",
    alt: "Figma",
    percentage: 75,
  },
  {
    image: "/src/assets/images/programs_and_tools/github.jpeg",
    alt: "Git Hub",
    percentage: 60,
  },
  {
    image: "/src/assets/images/programs_and_tools/premiere.jpeg",
    alt: "Premiere",
    percentage: 90,
  },
  {
    image: "/src/assets/images/programs_and_tools/chatgpt.jpeg",
    alt: "ChatGPT",
    percentage: 50,
  },
  {
    image: "/src/assets/images/programs_and_tools/git.jpeg",
    alt: "Git",
    percentage: 80,
  },
  {
    image: "/src/assets/images/programs_and_tools/canva.jpeg",
    alt: "Canva",
    percentage: 60,
  },
  {
    image: "/src/assets/images/programs_and_tools/notion.jpeg",
    alt: "Notion",
    percentage: 60,
  },
  {
    image: "/src/assets/images/programs_and_tools/semrush.jpeg",
    alt: "Semrush",
    percentage: 30,
  },
]);

const projects = ref([
  {
    title: "Web Design",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    image: "/src/assets/images/my_portfolio/steve_jobs.jpeg",
  },
  {
    title: "Web Design",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    image: "/src/assets/images/my_portfolio/mark.jpeg",
  },
  {
    title: "Web Design",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    image: "/src/assets/images/my_portfolio/women.jpeg",
  },
  {
    title: "Web Design",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    image: "/src/assets/images/my_portfolio/infographic_self_image.jpeg",
  },
  {
    title: "Web Design",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    image: "/src/assets/images/my_portfolio/quote.jpeg",
  },
  {
    title: "Web Design",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    image: "/src/assets/images/my_portfolio/post_design_social_media.jpeg",
  },
  {
    title: "Web Design",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    image: "/src/assets/images/my_portfolio/post.jpeg",
  },
]);

onMounted(() => {
  const seeMoreBtn = document.getElementById("seeMoreBtn");
  const seeMoreMenu = document.getElementById("seeMoreMenu");

  // Migrated from home.js: Typing Effect
  const texts = [
    "Programmer",
    "Graphic Designer",
    "Marketer",
    "Video Editor",
    "Content Creator",
    "YouTuber",
  ];
  let currentTextIndex = 0;
  let currentCharIndex = 0;
  const multiple = document.getElementById("multiple");

  function type() {
    if (!multiple) return;
    const currentText = texts[currentTextIndex];
    if (currentCharIndex < currentText.length) {
      multiple.textContent += currentText[currentCharIndex];
      currentCharIndex++;
      setTimeout(type, 100);
    } else {
      setTimeout(deleteText, 1500);
    }
  }
  function deleteText() {
    if (!multiple) return;
    if (currentCharIndex > 0) {
      multiple.textContent = multiple.textContent.slice(0, -1);
      currentCharIndex--;
      setTimeout(deleteText, 100);
    } else {
      multiple.textContent = "";
      currentTextIndex = (currentTextIndex + 1) % texts.length;
      setTimeout(type, 500);
    }
  }
  if (multiple) setTimeout(type, 3000);

  // Migrated from home.js: Intersection Observer for animations
  const elements = document.querySelectorAll(
    ".about-img img, .about-info h2, .about-info h3, .about-info p, .about-info #btn"
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
        } else {
          entry.target.style.animationPlayState = "paused";
        }
      });
    },
    { threshold: 0.2 }
  );

  elements.forEach((element) => {
    element.style.animationPlayState = "paused";
    observer.observe(element);
  });

  // Migrated from home.js: Skills Counter
  const nums = document.querySelectorAll(".num");
  const skillsSection = document.querySelector(".skills");
  const startCounting = (element) => {
    const target = +element.getAttribute("data-val");
    const duration = 2000;
    const startTime = performance.now();
    const updateNumber = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const currentNumber = Math.floor(progress * target);
      element.textContent = currentNumber;
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        element.textContent = target;
        const yearsElement = element.nextElementSibling;
        if (yearsElement && yearsElement.classList.contains("years")) {
          yearsElement.style.display = "inline";
        }
      }
    };
    requestAnimationFrame(updateNumber);
  };

  const skillsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          nums.forEach((num) => startCounting(num));
          skillsObserver.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );
  if (skillsSection) skillsObserver.observe(skillsSection);

  // Migrated from home.js: Swiper
  // Swiper logic is now handled by the <swiper> component in the template
  // Legacy manual initialization removed for the skills section
  nextTick(() => {
    const sliders = document.querySelectorAll(".swiper-container");
    if (window.Swiper) {
      sliders.forEach((slider) => {
        // Skip if this is the Vue component instance (though it shouldn't have swiper-container class if handled correctly)
        if (slider.__vueParentComponent) return;

        new window.Swiper(slider, {
          loop: true,
          spaceBetween: 30,
          grabCursor: true,
          pagination: {
            el: slider.querySelector(".swiper-pagination"),
            clickable: true,
            dynamicBullets: true,
          },
          navigation: {
            nextEl: slider.querySelector(".swiper-button-next"),
            prevEl: slider.querySelector(".swiper-button-prev"),
          },
          breakpoints: {
            600: { slidesPerView: 2 },
            968: { slidesPerView: 3 },
          },
        });
      });
    }
  });

  // Migrated from home.js: Programs and Tools Progress Circles
  nextTick(() => {
    const circles = document.querySelectorAll(".progress-circle");
    const toolsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const circle = entry.target;
            if (circle.dataset.animated === "true") return;
            circle.style.background = `conic-gradient(gray 0deg, gray 360deg)`;
            const percentageText = circle.querySelector(".percentage-text");
            if (percentageText) percentageText.textContent = "0%";
            circle.dataset.animated = "true";
            setTimeout(() => {
              const percentage = parseInt(
                circle.getAttribute("data-percentage"),
                10
              );
              let color = "red";
              if (percentage > 50 && percentage <= 80) color = "orange";
              else if (percentage > 80) color = "green";

              let currentProgress = 0;
              const targetProgress = percentage * 3.6;
              const speed = 20;
              const interval = setInterval(() => {
                if (currentProgress >= targetProgress) {
                  clearInterval(interval);
                  observer.unobserve(circle);
                } else {
                  currentProgress += 3;
                  let currentPercentage = Math.min(
                    Math.round(currentProgress / 3.6),
                    percentage
                  );
                  circle.style.background = `conic-gradient(${color} ${currentProgress}deg, gray ${currentProgress}deg)`;
                  if (percentageText)
                    percentageText.textContent = `${currentPercentage}%`;
                }
              }, speed);
            }, 500);
          }
        });
      },
      { threshold: 0.1 }
    );
    circles.forEach((circle) => {
      circle.style.background = `conic-gradient(gray 0deg, gray 360deg)`;
      const percentageText = circle.querySelector(".percentage-text");
      if (percentageText) percentageText.textContent = "0%";
      toolsObserver.observe(circle);
    });
  });

  // Migrated from home.js: Client Logos Ticker
  document.querySelectorAll(".logos").forEach((logos) => {
    // Check if already cloned to avoid infinite duplication on re-mounts if using keep-alive/dev-server
    if (logos.dataset.cloned) return;
    const clone = logos.cloneNode(true);
    logos.parentElement.appendChild(clone);
    logos.dataset.cloned = "true";
  });
});
</script>

<style scoped>
@import "/src/assets/css/all.css/all.css";
@import "/src/assets/css/lists/list_skills/style.css";
@import "/src/assets/css/home/home.css";
@import "/src/assets/css/all.css/swiper-bundle.min.css";
@import "/src/assets/css/logout-modal.css";

/* Override conflicting flex styles from home.css for Swiper */
.services .services-wrapper {
  display: block;
  gap: 0;
}
</style>
