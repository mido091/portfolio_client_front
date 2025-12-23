import os
import re

# Define the source and destination directories
source_dir = r"e:\web dev\mevn\portofile_client\client_test"
dest_dir = r"e:\web dev\mevn\portofile_client\client\src\views"

# Mapping of HTML files to Vue component names
html_to_vue_mapping = {
    "index.html": "Home.vue",
    "about.html": "About.vue",
    "blogs.html": "Blogs.vue",
    "blog-details.html": "BlogDetails.vue",
    "brief.html": "Brief.vue",
    "login.html": "Login.vue",
    "profile.html": "Profile.vue",
    "dashboard.html": "Dashboard.vue",
    "dashboard_plogs.html": "DashboardBlogs.vue",
    "dashboard_users.html": "DashboardUsers.vue",
    "list_experiences.html": "ListExperiences.vue",
    "list_skills.html": "ListSkills.vue",
    "list_tools.html": "ListTools.vue",
    "list_work.html": "ListWork.vue"
}

def extract_body_content(html_content):
    """Extract content between <body> and </body> tags, excluding header and footer"""
    # Find body content
    body_match = re.search(r'<body>(.*?)</body>', html_content, re.DOTALL)
    if not body_match:
        return ""
    
    body_content = body_match.group(1)
    
    # Remove header section (from <header> to </header>)
    body_content = re.sub(r'<header>.*?</header>', '', body_content, flags=re.DOTALL)
    
    # Remove footer section (from <footer to </footer>)
    body_content = re.sub(r'<footer.*?</footer>', '', body_content, flags=re.DOTALL)
    
    # Remove scroll progress div
    body_content = re.sub(r'<div id="progress">.*?</div>\s*</div>', '', body_content, flags=re.DOTALL)
    
    return body_content.strip()

def extract_scripts(html_content):
    """Extract all script tags from HTML"""
    scripts = re.findall(r'<script.*?>(.*?)</script>', html_content, re.DOTALL)
    return '\n'.join(scripts)

def extract_css_links(html_content):
    """Extract CSS file links from HTML head"""
    css_links = []
    link_matches = re.findall(r'<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>', html_content)
    for link in link_matches:
        if link.startswith('assets/'):
            # Convert to relative path for Vue
            css_links.append(link)
    return css_links

def convert_html_links_to_router(content):
    """Convert HTML links to router-links"""
    # Convert .html links to router-link
    content = re.sub(r'href="index\.html"', 'to="/"', content)
    content = re.sub(r'href="about\.html"', 'to="/about"', content)
    content = re.sub(r'href="blogs\.html"', 'to="/blogs"', content)
    content = re.sub(r'href="blog-details\.html"', 'to="/blog-details"', content)
    content = re.sub(r'href="brief\.html"', 'to="/brief"', content)
    content = re.sub(r'href="login\.html"', 'to="/login"', content)
    content = re.sub(r'href="profile\.html"', 'to="/profile"', content)
    content = re.sub(r'href="dashboard\.html"', 'to="/dashboard"', content)
    content = re.sub(r'href="list_experiences\.html"', 'to="/list-experiences"', content)
    content = re.sub(r'href="list_skills\.html"', 'to="/list-skills"', content)
    content = re.sub(r'href="list_tools\.html"', 'to="/list-tools"', content)
    content = re.sub(r'href="list_work\.html"', 'to="/list-work"', content)
    
    # Convert <a href to <router-link to for internal links (but not # links or external links)
    content = re.sub(r'<a\s+([^>]*)href="(/[^"#]*)"', r'<router-link \1to="\2"', content)
    content = re.sub(r'</a>', '</router-link>', content)
    
    return content

def fix_asset_paths(content):
    """Fix asset paths to work with Vite"""
    # Fix image paths
    content = re.sub(r'src="assets/', 'src="/src/assets/', content)
    content = re.sub(r'src="\.\./assets/', 'src="/src/assets/', content)
    
    return content

def create_vue_component(html_file, vue_file):
    """Convert HTML file to Vue component"""
    with open(html_file, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Extract necessary parts
    body_content = extract_body_content(html_content)
    scripts = extract_scripts(html_content)
    css_links = extract_css_links(html_content)
    
    # Convert links to router-links
    body_content = convert_html_links_to_router(body_content)
    
    # Fix asset paths
    body_content = fix_asset_paths(body_content)
    
    # Create Vue component
    vue_content = f"""<template>
{body_content}
</template>

<script setup>
import {{ onMounted }} from 'vue'

onMounted(() => {{
{scripts}
}})
</script>

<style scoped>
"""
    
    # Add CSS imports
    for css_link in css_links:
        vue_content += f"@import '/src/{css_link}';\n"
    
    vue_content += "</style>\n"
    
    # Write Vue component
    with open(vue_file, 'w', encoding='utf-8') as f:
        f.write(vue_content)
    
    print(f"Created {vue_file}")

# Create destination directory if it doesn't exist
os.makedirs(dest_dir, exist_ok=True)

# Convert all HTML files
for html_file, vue_file in html_to_vue_mapping.items():
    html_path = os.path.join(source_dir, html_file)
    vue_path = os.path.join(dest_dir, vue_file)
    
    if os.path.exists(html_path):
        create_vue_component(html_path, vue_path)
    else:
        print(f"Warning: {html_path} not found")

print("\nConversion complete!")
