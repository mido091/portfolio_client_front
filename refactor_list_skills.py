import re
import os

file_path = r"e:\web dev\mevn\portofile_client\client\src\views\ListSkills.vue"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract skills
# Pattern: <div class="skills-box">...<i class="(.*?)">...num" data-val="(.*?)">...text">(.*?)</span>...<p>(.*?)</p>
# This regex needs to be robust.
pattern = re.compile(r'<div class="skills-box">.*?<i class="(.*?)">.*?data-val="(.*?)">.*?<span class="text">(.*?)</span>.*?<h3>(.*?)</h3>.*?<p>(.*?)</p>', re.DOTALL)

skills = []
matches = pattern.findall(content)
for icon, years, name, title, desc in matches:
    skills.append({
        "name": name.strip(),
        "years": years.strip(),
        "icon": icon.strip(),
        "desc": desc.strip(),
        "title": title.strip()
    })

# Vue Template
vue_template = """<template>
<!-- skills -->
        <section class="skills">
            <h2>my <span>skills</span></h2>
            <div class="skills-content">
                <div class="skills-wrapper">
                    <div 
                        v-for="(skill, index) in paginatedSkills" 
                        :key="index"
                        class="skills-box"
                        ref="skillRefs"
                    >
                        <div class="front">
                            <i :class="skill.icon"></i>
                            <div class="center-years">
                                <span class="num" :data-val="skill.years">000</span>
                                <span class="years">years</span>
                            </div>
                            <span class="text">{{ skill.name }}</span>
                        </div>
                        <div class="back">
                            <i :class="skill.icon"></i>
                            <h3>{{ skill.title }}</h3>
                            <p>{{ skill.desc }}</p>
                        </div>
                    </div>
                </div>
                <div id="pagination" v-if="totalPages > 1">
                    <button id="prev-btn" @click="prevPage" :disabled="currentPage === 1">السابق</button>
                    <span id="page-indicators">
                        <span 
                            v-for="page in totalPages" 
                            :key="page" 
                            class="page-number" 
                            :class="{ active: currentPage === page }"
                            @click="goToPage(page)"
                        >{{ page }}</span>
                    </span>
                    <button id="next-btn" @click="nextPage" :disabled="currentPage === totalPages">التالي</button>
                </div>
            </div>
        </section>
        <!-- scroll -->
        <div id="progress">
            <span id="progress-value">
                <i class="fa-solid fa-arrow-up"></i>
            </span>
        </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import '/src/assets/js/all.js/all.js';

const skills = ref(%SKILLS_JSON%);

// Pagination Logic
const currentPage = ref(1);
const itemsPerPage = 6;

const totalPages = computed(() => Math.ceil(skills.value.length / itemsPerPage));

const paginatedSkills = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return skills.value.slice(start, start + itemsPerPage);
});

const goToPage = (page) => {
    currentPage.value = page;
};

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
};

// Counting Logic
const skillRefs = ref([]);

const startCounting = (element) => {
    const numSpan = element.querySelector('.num');
    if (!numSpan) return;
    
    // Check if refined
    if (numSpan.dataset.counted) return;

    const target = +numSpan.getAttribute('data-val');
    const duration = 2000;
    const startTime = performance.now();

    const updateNumber = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const currentNumber = Math.floor(progress * target);
        
        numSpan.textContent = currentNumber;

        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            numSpan.textContent = target;
            numSpan.dataset.counted = "true";
            const yearsElement = element.querySelector('.years');
            if (yearsElement) yearsElement.style.display = 'inline';
        }
    };
    requestAnimationFrame(updateNumber);
};

// Re-run counting/animation on page change
watch(currentPage, () => {
    // Reset animations if needed, or just let them show
    nextTick(() => {
        animateItems();
    });
});

const animateItems = () => {
    // Simple fade in effect logic directly in CSS usually, but we can replicate JS logic
    // The original JS did opacity 0 -> 1 with delay
    if (!skillRefs.value) return;
    
    skillRefs.value.forEach((el, index) => {
        if(!el) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.display = 'flex'; // Ensure flex
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            // Trigger counting
            startCounting(el);
        }, index * 100);
    });
};

onMounted(() => {
    nextTick(() => {
        animateItems();
    });
});
</script>

<style scoped>
/* Inherited via global css, but add pagination styles if missing */
@import '/src/assets/css/lists/list_skills/style.css';
</style>
"""

final_code = vue_template.replace("%SKILLS_JSON%", str(skills))
with open("ListSkills_new.vue", "w", encoding="utf-8") as f:
    f.write(final_code)
print("Done")
