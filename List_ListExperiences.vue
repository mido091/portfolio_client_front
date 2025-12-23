<template>
    <!-- Generated Template -->
    <section>
        <div class="services-box">
            
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
    </section>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import '/src/assets/js/all.js/all.js';

const items = ref([{'icon': 'fa-solid fa-code', 'title': 'Web Development', 'desc': 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.'}, {'icon': 'fa-solid fa-pen-fancy', 'title': 'Graphic Design', 'desc': 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.'}, {'icon': 'fa-solid fa-chart-column', 'title': 'Digital Marketing', 'desc': 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.'}, {'icon': 'fa-solid fa-code', 'title': 'Web Development', 'desc': 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.'}, {'icon': 'fa-solid fa-pen-fancy', 'title': 'Graphic Design', 'desc': 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.'}, {'icon': 'fa-solid fa-chart-column', 'title': 'Digital Marketing', 'desc': 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.'}, {'icon': 'fa-solid fa-code', 'title': 'Web Development', 'desc': 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.'}, {'icon': 'fa-solid fa-pen-fancy', 'title': 'Graphic Design', 'desc': 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.'}, {'icon': 'fa-solid fa-chart-column', 'title': 'Digital Marketing', 'desc': 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.'}, {'icon': 'fa-solid fa-code', 'title': 'Web Development', 'desc': 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.'}, {'icon': 'fa-solid fa-pen-fancy', 'title': 'Graphic Design', 'desc': 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.'}, {'icon': 'fa-solid fa-chart-column', 'title': 'Digital Marketing', 'desc': 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.'}, {'icon': 'fa-solid fa-code', 'title': 'Web Development', 'desc': 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.'}, {'icon': 'fa-solid fa-pen-fancy', 'title': 'Graphic Design', 'desc': 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.'}, {'icon': 'fa-solid fa-chart-column', 'title': 'Digital Marketing', 'desc': 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti nihil ratione quidem incidunt iste eligendi odio, fugit laborum dolorum eaque.'}]);

// Pagination
const currentPage = ref(1);
const itemsPerPage = 6;
const itemRefs = ref([]);

const totalPages = computed(() => Math.ceil(items.value.length / itemsPerPage));

const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return items.value.slice(start, start + itemsPerPage);
});

const goToPage = (page) => { currentPage.value = page; };
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };

// Animation
const animateItems = () => {
    if (!itemRefs.value) return;
    itemRefs.value.forEach((el, index) => {
        if(!el) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.display = 'flex'; // Ensure flex/block
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
};

watch(currentPage, () => {
    nextTick(() => {
        animateItems();
    });
});

onMounted(() => {
    nextTick(() => {
        animateItems();
    });
});


</script>

<style scoped>
/* Add imports if needed, otherwise rely on global */
</style>
