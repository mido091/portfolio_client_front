import os
import re

# Mappings
project_root = r"e:\web dev\mevn\portofile_client"
original_dir = os.path.join(project_root, "client_test")
vue_dir = os.path.join(project_root, "client", "src", "views")

mappings = {
    "index.html": "Home.vue",
    "about.html": "About.vue",
    "list_experiences.html": "ListExperiences.vue",
    "list_skills.html": "ListSkills.vue",
    "list_tools.html": "ListTools.vue",
    "list_work.html": "ListWork.vue",
    "login.html": "Login.vue",
    "profile.html": "Profile.vue",
    "blogs.html": "Blogs.vue",
    "blog-details.html": "BlogDetails.vue",
    "dashboard.html": "Dashboard.vue",
    "dashboard_plogs.html": "DashboardBlogs.vue",
    "dashboard_users.html": "DashboardUsers.vue",
    "brief.html": "Brief.vue"
}

def clean_text(text):
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', ' ', text)
    # Remove Vue bindings
    text = re.sub(r'v-\w+="[^"]*"', '', text)
    text = re.sub(r':\w+="[^"]*"', '', text)
    text = re.sub(r'@\w+="[^"]*"', '', text)
    text = re.sub(r'\{\{.*?\}\}', '', text)
    return re.sub(r'\s+', ' ', text).strip()

def get_headings(content):
    return re.findall(r'<h[1-3][^>]*>(.*?)</h[1-3]>', content, re.DOTALL | re.IGNORECASE)

def compare_file(original_file, vue_file):
    orig_path = os.path.join(original_dir, original_file)
    vue_path = os.path.join(vue_dir, vue_file)

    if not os.path.exists(orig_path):
        return f"MISSING ORIG: {original_file}"
    if not os.path.exists(vue_path):
        return f"MISSING VUE: {vue_file}"

    with open(orig_path, 'r', encoding='utf-8', errors='ignore') as f:
        orig_content = f.read()
    
    with open(vue_path, 'r', encoding='utf-8', errors='ignore') as f:
        vue_content = f.read()
    
    # Extract headings
    orig_h = [re.sub(r'<[^>]+>', '', h).strip() for h in get_headings(orig_content)]
    vue_h = [re.sub(r'<[^>]+>', '', h).strip() for h in get_headings(vue_content)]

    # Compare content length
    orig_text = clean_text(orig_content)
    vue_text = clean_text(vue_content)

    diff_headings = [h for h in orig_h if h not in vue_h]
    
    status = "Match"
    details = []
    
    if diff_headings:
        status = "Mismatch"
        details.append(f"Missing Headings in Vue: {diff_headings[:3]}...")
    
    len_diff = abs(len(orig_text) - len(vue_text))
    if len_diff > len(orig_text) * 0.3: # Allow 30% variance
        status = "Mismatch"
        details.append(f"Content length differs: Orig {len(orig_text)} vs Vue {len(vue_text)}")

    # Specific check for router-link vs a href
    if '<a href="' in vue_content and '<router-link' not in vue_content:
         # Rough check, might be false positive if external links exist
         pass

    return f"{original_file} -> {vue_file}: {status} {', '.join(details)}"

print("Comparing files...")
for orig, vue in mappings.items():
    print(compare_file(orig, vue))
