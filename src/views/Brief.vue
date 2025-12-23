<template>
<!-- header -->
        
    <div class="container" id="brief">
        <h2>Please fill out this questionnaire to help us design the brand to fit your project</h2>
        <form>

            <label>your full name</label>
            <input type="text" required name="">

            <label for="">your phone Number</label>
            <input type="tel" >

            <label>Your business email</label>
            <input type="email" required name="">

            <label>Social media accounts for your project</label>
            <input type="url" required name="" class="so">
            <input type="url" required name="" class="so" >
            <input type="url" required name="" class="so3">

            <label>What is the name to be written in the logo design?</label>
            <input type="text" required name="">

            <label>What is the field of the company and what it offers to the market?</label>
            <textarea></textarea>

            <label>What is your company’s history in brief, <span>highlighting the most important points in the company’s history?</span></label>
            <textarea></textarea>

            <label>What is a slogan or tagline for your business?</label>
            <input type="text" required name="">

            <label>What are the full details behind this name and why was it chosen?</label>
            <textarea></textarea>

            <label>Who are your main competitors? <span>Please mention their website if possible</span></label>
            <textarea></textarea>
            <button type="submit">Send information </button>
        </form>
    </div>
    <!-- footer -->

</template>

<script setup>
import { onMounted } from 'vue'


import '/src/assets/js/all.js/all.js';
onMounted(() => {

})
</script>

<style scoped>
@import '/src/assets/css/all.css/all.css';
@import '/src/assets/css/brief/brief.css';
</style>
