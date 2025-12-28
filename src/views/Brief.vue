<!-- src/pages/BriefPage.vue -->
<template>
  <div id="brief">
    <div class="container">
      <h2 class="page-title">Brand <span>Brief</span> Questionnaire</h2>
      <p class="page-subtitle">
        Please fill out this questionnaire to help us design the brand to fit
        your project
      </p>

      <form
        class="brief-form"
        @submit.prevent="handleSubmit"
        enctype="multipart/form-data"
      >
        <!-- Client Information Card -->
        <div class="form-section-card">
          <h3>Client <span>Information</span></h3>

          <div class="form-group">
            <label>Your Full Name</label>
            <input v-model.trim="form.fullName" type="text" required />
          </div>

          <div class="form-group">
            <label>Website</label>
            <input
              v-model.trim="form.website"
              type="url"
              required
              placeholder="https://example.com"
            />
          </div>

          <div class="form-group">
            <label>Phone Number</label>
            <input
              v-model.trim="form.phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div class="form-group">
            <label>Business Email</label>
            <input
              v-model.trim="form.email"
              type="email"
              required
              placeholder="email@company.com"
            />
          </div>

          <div class="form-group">
            <label>Social Media Accounts</label>
            <input
              v-model.trim="form.social1"
              type="url"
              placeholder="Facebook URL"
              class="mb-2"
            />
            <input
              v-model.trim="form.social2"
              type="url"
              placeholder="Instagram URL"
              class="mb-2"
            />
            <input
              v-model.trim="form.social3"
              type="url"
              placeholder="Twitter/X URL"
            />
          </div>

          <div class="form-group">
            <label>Logo Name</label>
            <input
              v-model.trim="form.logoName"
              type="text"
              required
              placeholder="Name to be written in the logo"
            />
          </div>
        </div>

        <!-- Company Details Card -->
        <div class="form-section-card">
          <h3>Company <span>Details</span></h3>

          <div class="form-group">
            <label>Company Field & Market Offering</label>
            <textarea
              v-model.trim="form.companyField"
              placeholder="Describe your company's field and what it offers to the market"
            ></textarea>
          </div>

          <div class="form-group">
            <label>Project Goals</label>
            <textarea
              v-model.trim="form.goals"
              placeholder="What are the goals you wish to achieve through this project?"
            ></textarea>
          </div>

          <div class="form-group">
            <label>Slogan or Tagline</label>
            <input
              v-model.trim="form.slogan"
              type="text"
              required
              placeholder="Your business slogan or tagline"
            />
          </div>

          <div class="form-group">
            <label>Name Details</label>
            <textarea
              v-model.trim="form.nameDetails"
              placeholder="What are the full details behind this name and why was it chosen?"
            ></textarea>
          </div>

          <div class="form-group">
            <label>
              Main Competitors
              <span class="label-hint"
                >Please mention their website if possible</span
              >
            </label>
            <textarea
              v-model.trim="form.competitors"
              placeholder="List your main competitors and their websites"
            ></textarea>
          </div>

          <div class="form-group">
            <label>
              Design References
              <span class="label-hint"
                >Colors, fonts, logos, or designs you like</span
              >
            </label>
            <textarea
              v-model.trim="form.references"
              placeholder="Give examples of colors, fonts, logos, or designs that you like"
            ></textarea>
          </div>
        </div>

        <!-- Project Details Card -->
        <div class="form-section-card">
          <h3>Project <span>Details</span></h3>

          <div class="form-group">
            <label>Project Name</label>
            <input
              v-model.trim="form.projectName"
              type="text"
              placeholder="Enter your project name"
            />
          </div>

          <div class="form-group">
            <label>Project Type</label>
            <div class="project-type-row">
              <select v-model="projectTypeSelect" id="projectTypeSelect">
                <option value="">Select Project Type</option>
                <option value="Organization">Organization</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Islamic">Islamic</option>
                <option value="Advertising">Advertising</option>
                <option value="Medical">Medical</option>
                <option value="Product">Product</option>
                <option value="Food">Food</option>
                <option value="Other">Other</option>
              </select>

              <input
                v-model.trim="form.projectTypeOther"
                type="text"
                id="projectTypeInput"
                placeholder="Specify if Other"
                :disabled="projectTypeSelect !== 'Other'"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Target Audience</label>
            <div class="styled-checkbox-group">
              <label class="styled-option">
                <input
                  type="checkbox"
                  value="children"
                  v-model="form.audience"
                />
                <span>Children</span>
              </label>
              <label class="styled-option">
                <input type="checkbox" value="young" v-model="form.audience" />
                <span>Young</span>
              </label>
              <label class="styled-option">
                <input type="checkbox" value="men" v-model="form.audience" />
                <span>Men</span>
              </label>
              <label class="styled-option">
                <input type="checkbox" value="women" v-model="form.audience" />
                <span>Women</span>
              </label>
              <label class="styled-option">
                <input
                  type="checkbox"
                  value="everyone"
                  v-model="form.audience"
                />
                <span>Everyone</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>Logo Type</label>
            <div class="styled-radio-group">
              <label class="styled-option">
                <input
                  type="radio"
                  name="logo_type"
                  value="icon"
                  v-model="form.logoType"
                />
                <span>Icon Logo</span>
              </label>
              <label class="styled-option">
                <input
                  type="radio"
                  name="logo_type"
                  value="letter"
                  v-model="form.logoType"
                />
                <span>Letter Logo</span>
              </label>
              <label class="styled-option">
                <input
                  type="radio"
                  name="logo_type"
                  value="calligraphy"
                  v-model="form.logoType"
                />
                <span>Calligraphy Logo</span>
              </label>
              <label class="styled-option">
                <input
                  type="radio"
                  name="logo_type"
                  value="character"
                  v-model="form.logoType"
                />
                <span>Character Logo</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>Favorite Colors</label>
            <input
              v-model.trim="form.favoriteColors"
              placeholder="e.g., Blue, Orange, Green"
            />
          </div>

          <div class="form-group">
            <label>About Project</label>
            <textarea
              v-model.trim="form.aboutProject"
              placeholder="Tell us more about your project"
            ></textarea>
          </div>
        </div>

        <!-- Upload Section Card -->
        <div class="form-section-card">
          <h3>Upload <span>Logos</span></h3>
          <p class="section-description">
            Upload any logo you liked or your old logo (up to 5 files)
          </p>

          <div class="upload-grid">
            <label v-for="i in 5" :key="i" class="upload-box">
              <input type="file" hidden @change="onPickFile($event, i - 1)" />
              <div class="upload-content">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3v12m0-12l4 4m-4-4l-4 4M4 15v4h16v-4" />
                </svg>
                <span>{{ uploadLabels[i - 1] }}</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Applications & Budget Card -->
        <div class="form-section-card split-section">
          <div class="split-left">
            <h4>Logo <span>Applications</span></h4>
            <div class="styled-checkbox-group vertical">
              <label class="styled-option">
                <input
                  type="checkbox"
                  value="business_card"
                  v-model="form.applications"
                />
                <span>Business Card</span>
              </label>
              <label class="styled-option">
                <input
                  type="checkbox"
                  value="letterhead"
                  v-model="form.applications"
                />
                <span>Letterhead</span>
              </label>
              <label class="styled-option">
                <input
                  type="checkbox"
                  value="envelope"
                  v-model="form.applications"
                />
                <span>Envelope</span>
              </label>
              <label class="styled-option">
                <input
                  type="checkbox"
                  value="folder"
                  v-model="form.applications"
                />
                <span>Folder</span>
              </label>
              <label class="styled-option">
                <input
                  type="checkbox"
                  value="rollup"
                  v-model="form.applications"
                />
                <span>Roll Up</span>
              </label>
              <label class="styled-option">
                <input
                  type="checkbox"
                  value="social_media"
                  v-model="form.applications"
                />
                <span>Social Media</span>
              </label>
            </div>
          </div>

          <div class="split-right">
            <h4>Final <span>Information</span></h4>

            <div class="form-group">
              <label>Deadline</label>
              <input v-model="form.deadline" type="date" />
            </div>

            <div class="form-group">
              <label>Budget Range</label>
              <div class="styled-radio-group vertical">
                <label class="styled-option">
                  <input
                    type="radio"
                    name="budget"
                    value="250-500"
                    v-model="form.budget"
                  />
                  <span>$250 – $500</span>
                </label>
                <label class="styled-option">
                  <input
                    type="radio"
                    name="budget"
                    value="500-700"
                    v-model="form.budget"
                  />
                  <span>$500 – $700</span>
                </label>
                <label class="styled-option">
                  <input
                    type="radio"
                    name="budget"
                    value="700-1000"
                    v-model="form.budget"
                  />
                  <span>$700 – $1000</span>
                </label>
                <label class="styled-option">
                  <input
                    type="radio"
                    name="budget"
                    value="1000-1500"
                    v-model="form.budget"
                  />
                  <span>$1000 – $1500</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Success/Error Message -->
        <div
          v-if="submitMessage.text"
          class="submit-message"
          :class="submitMessage.type"
        >
          {{ submitMessage.text }}
        </div>

        <!-- Submit Button -->
        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          {{ isSubmitting ? "Submitting..." : "Submit Brief" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";

const BASE_URL = "https://portfolio-client-server.vercel.app/api";

const form = reactive({
  fullName: "",
  website: "",
  phone: "",
  email: "",
  social1: "",
  social2: "",
  social3: "",
  logoName: "",
  companyField: "",
  goals: "",
  slogan: "",
  nameDetails: "",
  competitors: "",
  references: "",
  projectName: "",
  projectTypeOther: "",
  audience: [],
  logoType: "",
  favoriteColors: "",
  aboutProject: "",
  applications: [],
  deadline: "",
  budget: "",
});

const projectTypeSelect = ref("");

watch(projectTypeSelect, (val) => {
  if (val !== "Other") form.projectTypeOther = "";
});

const projectTypeFinal = computed(() =>
  projectTypeSelect.value === "Other"
    ? form.projectTypeOther
    : projectTypeSelect.value
);

// uploads (5 boxes)
const uploads = ref([null, null, null, null, null]);
const uploadLabels = computed(() =>
  uploads.value.map((f) => (f?.name ? f.name : "UPLOAD"))
);

function onPickFile(e, idx) {
  const file = e.target?.files?.[0] ?? null;
  // Validate file type
  if (file && !file.type.startsWith("image/")) {
    alert("Please select only image files");
    e.target.value = "";
    return;
  }
  uploads.value[idx] = file;
}

// Submission state
const isSubmitting = ref(false);
const submitMessage = ref({ type: "", text: "" });

// Reset form function
function resetForm() {
  // Reset form fields
  Object.keys(form).forEach((key) => {
    if (Array.isArray(form[key])) {
      form[key] = [];
    } else {
      form[key] = "";
    }
  });

  // Reset project type select
  projectTypeSelect.value = "";

  // Reset file uploads
  uploads.value = [null, null, null, null, null];

  // Reset file input elements
  const fileInputs = document.querySelectorAll('input[type="file"]');
  fileInputs.forEach((input) => {
    input.value = "";
  });
}

async function handleSubmit() {
  // Clear previous messages
  submitMessage.value = { type: "", text: "" };

  // Validate required fields
  if (!form.fullName.trim()) {
    submitMessage.value = { type: "error", text: "Full Name is required" };
    return;
  }
  if (!form.website.trim()) {
    submitMessage.value = { type: "error", text: "Website is required" };
    return;
  }
  if (!form.email.trim()) {
    submitMessage.value = { type: "error", text: "Email is required" };
    return;
  }
  if (!form.logoName.trim()) {
    submitMessage.value = { type: "error", text: "Logo Name is required" };
    return;
  }
  if (!form.slogan.trim()) {
    submitMessage.value = { type: "error", text: "Slogan is required" };
    return;
  }

  // Build FormData
  const formData = new FormData();

  // Append all text fields
  formData.append("fullName", form.fullName);
  formData.append("website", form.website);
  formData.append("phone", form.phone || "");
  formData.append("email", form.email);
  formData.append("social1", form.social1 || "");
  formData.append("social2", form.social2 || "");
  formData.append("social3", form.social3 || "");
  formData.append("logoName", form.logoName);
  formData.append("companyField", form.companyField || "");
  formData.append("goals", form.goals || "");
  formData.append("slogan", form.slogan);
  formData.append("nameDetails", form.nameDetails || "");
  formData.append("competitors", form.competitors || "");
  formData.append("references", form.references || "");
  formData.append("projectName", form.projectName || "");
  formData.append("projectType", projectTypeFinal.value || "");
  formData.append("projectTypeOther", form.projectTypeOther || "");

  // Append arrays as JSON strings
  formData.append("audience", JSON.stringify(form.audience));
  formData.append("applications", JSON.stringify(form.applications));

  formData.append("logoType", form.logoType || "");
  formData.append("favoriteColors", form.favoriteColors || "");
  formData.append("aboutProject", form.aboutProject || "");
  formData.append("deadline", form.deadline || "");
  formData.append("budget", form.budget || "");

  // Append logo files
  const logoFiles = uploads.value.filter(Boolean);
  logoFiles.forEach((file) => {
    formData.append("logos", file);
  });

  // Submit to API
  isSubmitting.value = true;

  try {
    const response = await fetch(`${BASE_URL}/briefs`, {
      method: "POST",
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
    });

    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = "Failed to submit brief";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("Brief submitted successfully:", data);

    // Show success message
    submitMessage.value = {
      type: "success",
      text: `Brief submitted successfully! ID: ${data.id || "N/A"}`,
    };

    // Reset form after short delay
    setTimeout(() => {
      resetForm();
      // Clear success message after form reset
      setTimeout(() => {
        submitMessage.value = { type: "", text: "" };
      }, 3000);
    }, 1500);
  } catch (error) {
    console.error("Error submitting brief:", error);
    submitMessage.value = {
      type: "error",
      text: error.message || "Failed to submit brief. Please try again.",
    };
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
@import "/src/assets/css/all.css/all.css";

/* ================= PAGE WRAPPER ================= */
#brief {
  min-height: 100vh;
  padding: 12rem 9% 4rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* ================= PAGE TITLE ================= */
.page-title {
  font-size: 2.8em;
  font-weight: 600;
  text-align: center;
  color: var(--first);
  margin-bottom: 0.5em;
  line-height: 1.2;
}

.page-title span {
  color: var(--color);
}

.page-subtitle {
  text-align: center;
  font-size: 1.1em;
  color: var(--first);
  opacity: 0.8;
  margin-bottom: 3em;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

/* ================= FORM SECTION CARDS ================= */
.form-section-card {
  background: var(--box-bg);
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.3);
  transition: box-shadow 0.3s ease;
}

.form-section-card:hover {
  box-shadow: 0 0 1.5em rgba(255, 69, 0, 0.15);
}

.form-section-card h3 {
  font-size: 1.8em;
  color: var(--first);
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(255, 69, 0, 0.2);
}

.form-section-card h3 span {
  color: var(--color);
}

.form-section-card h4 {
  font-size: 1.4em;
  color: var(--first);
  margin-bottom: 20px;
}

.form-section-card h4 span {
  color: var(--color);
}

.section-description {
  color: var(--first);
  opacity: 0.7;
  margin-bottom: 20px;
  font-size: 0.95em;
}

/* ================= FORM GROUPS ================= */
.form-group {
  margin-bottom: 24px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 15px;
  font-weight: 500;
  color: var(--first);
}

.label-hint {
  display: block;
  font-size: 13px;
  font-weight: 400;
  color: var(--color);
  margin-top: 4px;
  opacity: 0.9;
}

/* ================= FORM INPUTS ================= */
form input,
form textarea,
form select {
  width: 100%;
  background-color: var(--clr-bg);
  border: 2px solid rgba(255, 255, 255, 0.1);
  padding: 14px 16px;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
  color: var(--first);
  transition: all 0.3s ease;
  font-family: inherit;
  line-height: 1.5;
}

form input::placeholder,
form textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

form input:focus,
form textarea:focus,
form select:focus {
  border-color: var(--color);
  box-shadow: 0 0 0 3px rgba(255, 69, 0, 0.1);
}

form textarea {
  min-height: 120px;
  resize: vertical;
}

.mb-2 {
  margin-bottom: 12px;
}

/* ================= PROJECT TYPE ROW ================= */
.project-type-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

#projectTypeSelect,
#projectTypeInput {
  margin: 0;
}

#projectTypeInput:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: rgba(0, 0, 0, 0.2);
}

/* ================= STYLED CHECKBOXES/RADIOS ================= */
.styled-checkbox-group,
.styled-radio-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 14px;
}

.styled-checkbox-group.vertical,
.styled-radio-group.vertical {
  grid-template-columns: 1fr;
}

.styled-option {
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 14px 18px;
  display: flex !important;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  min-height: 48px;
}

.styled-option:hover {
  background: rgba(255, 69, 0, 0.08);
  border-color: rgba(255, 69, 0, 0.6);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(255, 69, 0, 0.25);
}

.styled-option input[type="checkbox"],
.styled-option input[type="radio"] {
  width: 18px;
  height: 18px;
  margin: 0;
  padding: 0 !important;
  background: none !important;
  border: none !important;
  flex-shrink: 0;
  cursor: pointer;
  accent-color: var(--color);
  -webkit-appearance: auto !important;
  appearance: auto !important;
}

/* Enhanced checked state */
.styled-option:has(input:checked) {
  background: rgba(255, 69, 0, 0.12);
  border-color: var(--color);
  border-width: 2px;
  box-shadow: 0 0 16px rgba(255, 69, 0, 0.35),
    inset 0 0 0 1px rgba(255, 69, 0, 0.2);
}

.styled-option:has(input:checked):hover {
  box-shadow: 0 4px 20px rgba(255, 69, 0, 0.4),
    inset 0 0 0 1px rgba(255, 69, 0, 0.3);
}

.styled-option span {
  color: var(--first);
  font-size: 15px;
  font-weight: 500;
  flex: 1;
  user-select: none;
}

/* ================= UPLOAD GRID ================= */
.upload-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.upload-box {
  background: var(--box-bg);
  border: 2px dashed rgba(255, 69, 0, 0.5);
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.2);
}

.upload-box:hover {
  border-color: var(--color);
  border-style: solid;
  box-shadow: 0 0 1.5em rgba(255, 69, 0, 0.3);
  transform: translateY(-3px);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--first);
  gap: 10px;
  padding: 20px;
  text-align: center;
}

.upload-content svg {
  width: 32px;
  height: 32px;
  stroke: var(--color);
  fill: none;
  stroke-width: 2;
}

.upload-content span {
  font-size: 14px;
  font-weight: 500;
  color: var(--first);
  opacity: 0.8;
}

/* ================= SPLIT SECTION ================= */
.split-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.split-left,
.split-right {
  min-width: 0;
}

/* ================= SUBMIT MESSAGE ================= */
.submit-message {
  padding: 16px 20px;
  border-radius: 12px;
  margin-top: 20px;
  text-align: center;
  font-weight: 500;
  font-size: 15px;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.submit-message.success {
  background: rgba(34, 197, 94, 0.15);
  border: 2px solid rgba(34, 197, 94, 0.5);
  color: #22c55e;
}

.submit-message.error {
  background: rgba(239, 68, 68, 0.15);
  border: 2px solid rgba(239, 68, 68, 0.5);
  color: #ef4444;
}

/* ================= SUBMIT BUTTON ================= */
.submit-btn {
  font-size: 16px;
  font-weight: 600;
  padding: 16px 40px;
  margin-top: 20px;
  border-radius: 30px;
  color: #fff;
  background: var(--color);
  border: 2px solid var(--color);
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  width: 100%;
  max-width: 400px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.submit-btn:hover {
  color: var(--color);
  background: transparent;
  transform: translateY(-5px);
  box-shadow: 0 0 0.7rem var(--color);
}

/* ================= RESPONSIVE BREAKPOINTS ================= */

/* Desktop Small (1200px) */
@media (max-width: 1200px) {
  .upload-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Tablet (992px) */
@media (max-width: 992px) {
  #brief {
    padding: 10rem 6% 3rem;
  }

  .page-title {
    font-size: 2.4em;
  }

  .split-section {
    gap: 30px;
  }
}

/* Tablet Small (768px) */
@media (max-width: 768px) {
  #brief {
    padding: 10rem 5% 3rem;
  }

  .page-title {
    font-size: 2em;
  }

  .page-subtitle {
    font-size: 1em;
  }

  .form-section-card {
    padding: 24px;
  }

  .form-section-card h3 {
    font-size: 1.5em;
  }

  .project-type-row {
    grid-template-columns: 1fr;
  }

  .upload-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .split-section {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .styled-checkbox-group,
  .styled-radio-group {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile (480px) */
@media (max-width: 480px) {
  #brief {
    padding: 9rem 4% 2rem;
  }

  .page-title {
    font-size: 1.6em;
  }

  .page-subtitle {
    font-size: 0.95em;
    margin-bottom: 2em;
  }

  .form-section-card {
    padding: 20px;
    margin-bottom: 20px;
  }

  .form-section-card h3 {
    font-size: 1.3em;
    margin-bottom: 20px;
  }

  .form-section-card h4 {
    font-size: 1.2em;
  }

  .form-group {
    margin-bottom: 20px;
  }

  form input,
  form textarea,
  form select {
    padding: 12px 14px;
    font-size: 14px;
  }

  .upload-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .styled-checkbox-group,
  .styled-radio-group {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .styled-option {
    padding: 10px 14px;
  }

  .submit-btn {
    max-width: 100%;
    padding: 14px 32px;
    font-size: 15px;
  }
}
</style>
