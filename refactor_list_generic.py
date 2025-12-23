import re
import os

base_path = r"e:\web dev\mevn\portofile_client\client\src\views"

configs = [
    {
        "file": "ListTools.vue",
        # <div class="tool-box">...img src="(...)" alt="(...)">...data-percentage="(...)">...<h3>(...)</h3>
        "pattern": re.compile(r'<div class="tool-box">.*?<img src="(.*?)" alt="(.*?)">.*?data-percentage="(.*?)">.*?<h3>(.*?)</h3>', re.DOTALL),
        "fields": ["image", "alt", "percentage", "title"],
        "template_item": """
            <div 
                v-for="(item, index) in paginatedItems" 
                :key="index"
                class="tool-box"
                ref="itemRefs"
            >
                <div class="progress-circle" :data-percentage="item.percentage">
                    <div class="image-container">
                        <img :src="item.image" :alt="item.alt">
                    </div>
                    <span class="percentage-text">0%</span>
                </div>
                <h3>{{ item.title }}</h3>
                <button class="details-btn">View Details</button>
            </div>
        """,
        "list_class": "tools-container",
        "script_extra": """
// Progress Circle Logic
const animateCircles = () => {
    if (!itemRefs.value) return;
    itemRefs.value.forEach(box => {
        const circle = box.querySelector('.progress-circle');
        if (!circle || circle.dataset.animated) return;
        
        const percentage = parseInt(circle.getAttribute("data-percentage"), 10);
        const percentageText = circle.querySelector(".percentage-text");
        
        circle.dataset.animated = "true";
        let currentProgress = 0;
        const targetProgress = percentage * 3.6;
        const speed = 20;
        
        const interval = setInterval(() => {
            if (currentProgress >= targetProgress) {
                clearInterval(interval);
            } else {
                currentProgress += 3;
                let currentPercentage = Math.min(Math.round(currentProgress / 3.6), percentage);
                circle.style.background = `conic-gradient(var(--main-color) ${currentProgress}deg, #ededed ${currentProgress}deg)`;
                if(percentageText) percentageText.textContent = `${currentPercentage}%`;
            }
        }, speed);
    });
};

watch(currentPage, () => {
    nextTick(() => {
        animateItems();
        animateCircles();
    });
});
        """
    },
    {
        "file": "ListExperiences.vue",
        # <div class="box">...<div class="icon">.*?<i class="(.*?)"></i>...<h3>(.*?)</h3>...<p>(.*?)</p>
        "pattern": re.compile(r'<div class="box">.*?<div class="icon">.*?<i class="(.*?)"></i>.*?<h3>(.*?)</h3>.*?<p>(.*?)</p>', re.DOTALL),
        "fields": ["icon", "title", "desc"],
        "template_item": """
            <div 
                v-for="(item, index) in paginatedItems" 
                :key="index"
                class="box"
                ref="itemRefs"
            >
                <div class="icon">
                    <i :class="item.icon"></i>
                </div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.desc }}</p>
                <div class="services-btn">
                    <button>Read More</button>
                </div>
            </div>
        """,
        "list_class": "services-box",
        "script_extra": ""
    },
    {
        "file": "ListWork.vue",
        # <div class="portfolio-box">...<img src="(.*?)" alt="(.*?)">...<h4>(.*?)</h4>...<p>(.*?)</p>
        "pattern": re.compile(r'<div class="portfolio-box">.*?<img src="(.*?)" alt="(.*?)">.*?<h4>(.*?)</h4>.*?<p>(.*?)</p>', re.DOTALL),
        "fields": ["image", "alt", "title", "desc"],
        "template_item": """
            <div 
                v-for="(item, index) in paginatedItems" 
                :key="index"
                class="portfolio-box"
                ref="itemRefs"
            >
                <img :src="item.image" :alt="item.alt" />
                <div class="portfolio-info">
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.desc }}</p>
                    <a href="#"><i class="fa-solid fa-up-right-from-square"></i></a>
                </div>
            </div>
        """,
        "list_class": "portfolio-boxes",
        "script_extra": ""
    }
]

def process_file(config):
    file_path = os.path.join(base_path, config["file"])
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    items = []
    matches = config["pattern"].findall(content)
    for match in matches:
        item = {}
        for i, field in enumerate(config["fields"]):
            item[field] = match[i].strip() if i < len(match) else ""
        items.append(item)
    
    # Base Vue Template
    vue_template = f"""<template>
    <!-- Generated Template -->
    <section>
        <div class="{config['list_class']}">
            {config['template_item']}
        </div>
        
        <div id="pagination" v-if="totalPages > 1">
            <button id="prev-btn" @click="prevPage" :disabled="currentPage === 1">السابق</button>
            <span id="page-indicators">
                <span 
                    v-for="page in totalPages" 
                    :key="page" 
                    class="page-number" 
                    :class="{{ active: currentPage === page }}"
                    @click="goToPage(page)"
                >{{{{ page }}}}</span>
            </span>
            <button id="next-btn" @click="nextPage" :disabled="currentPage === totalPages">التالي</button>
        </div>
    </section>
</template>

<script setup>
import {{ ref, computed, onMounted, nextTick, watch }} from 'vue';
import '/src/assets/js/all.js/all.js';

const items = ref({items});

// Pagination
const currentPage = ref(1);
const itemsPerPage = 6;
const itemRefs = ref([]);

const totalPages = computed(() => Math.ceil(items.value.length / itemsPerPage));

const paginatedItems = computed(() => {{
    const start = (currentPage.value - 1) * itemsPerPage;
    return items.value.slice(start, start + itemsPerPage);
}});

const goToPage = (page) => {{ currentPage.value = page; }};
const prevPage = () => {{ if (currentPage.value > 1) currentPage.value--; }};
const nextPage = () => {{ if (currentPage.value < totalPages.value) currentPage.value++; }};

// Animation
const animateItems = () => {{
    if (!itemRefs.value) return;
    itemRefs.value.forEach((el, index) => {{
        if(!el) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.display = 'flex'; // Ensure flex/block
        
        setTimeout(() => {{
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }}, index * 100);
    }});
}};

watch(currentPage, () => {{
    nextTick(() => {{
        animateItems();
    }});
}});

onMounted(() => {{
    nextTick(() => {{
        animateItems();
    }});
}});

{config['script_extra']}
</script>

<style scoped>
/* Add imports if needed, otherwise rely on global */
</style>
"""
    
    # Preserve original template wrapper roughly or just key sections?
    # For simplicity, I'm replacing the whole file content structure, but I should probably attempt to keep header/footer if they exist.
    # But these files seem to be just the section + header/footer in comments.
    
    # I'll write to a new file first.
    new_file = f"List_{config['file']}" # e.g. List_ListTools.vue
    with open(new_file, "w", encoding="utf-8") as f:
        f.write(vue_template)
    print(f"Generated {new_file}")

for config in configs:
    process_file(config)
