import os
import re
import shutil

# Define paths
images_dir = r"src\assets\images"
views_dir = r"src\views"

# Mapping of old filenames to new filenames
file_renames = {
    # list_work directory
    "list_work/- 7 -طريقة تصميم بوستر سوشيال ميديا بالأليستريتور.jpeg": "list_work/social_media_poster_design.jpeg",
    "list_work/1984 by Karolis Strautniekas - Home of the Alternative Movie Poster -AMP-.jpeg": "list_work/1984_movie_poster.jpeg",
    "list_work/Post design social media.jpeg": "list_work/post_design_social_media.jpeg",
    "list_work/Steve Jobs.jpeg": "list_work/steve_jobs.jpeg",
    "list_work/اقتباس.jpeg": "list_work/quote.jpeg",
    "list_work/انفوجرافيك كيف تبني صورتك الذاتية؟.jpeg": "list_work/infographic_self_image.jpeg",
    
    # liste_tools directory  
    "liste_tools/Git Hub.jpeg": "liste_tools/github.jpeg",
    
    # programs and tools directory
    "programs and tools/Photoshop.jpeg": "programs_and_tools/photoshop.jpeg",
    "programs and tools/illustrator.jpeg": "programs_and_tools/illustrator.jpeg",
    "programs and tools/Figma.jpeg": "programs_and_tools/figma.jpeg",
    "programs and tools/Git Hub.jpeg": "programs_and_tools/github.jpeg",
    "programs and tools/Premiere.jpeg": "programs_and_tools/premiere.jpeg",
    "programs and tools/ChatGPT.jpeg": "programs_and_tools/chatgpt.jpeg",
    "programs and tools/Git.jpeg": "programs_and_tools/git.jpeg",
    "programs and tools/Canva.jpeg": "programs_and_tools/canva.jpeg",
    "programs and tools/Notion.jpeg": "programs_and_tools/notion.jpeg",
    "programs and tools/Semrush.jpeg": "programs_and_tools/semrush.jpeg",
    
    # my pictures directory
    "my pictures/man.jpg": "my_pictures/man.jpg",
    
    # my_portfolio directory
    "my_portfolio/Steve Jobs.jpeg": "my_portfolio/steve_jobs.jpeg",
    "my_portfolio/Post design social media.jpeg": "my_portfolio/post_design_social_media.jpeg",
    "my_portfolio/اقتباس.jpeg": "my_portfolio/quote.jpeg",
    "my_portfolio/انفوجرافيك كيف تبني صورتك الذاتية؟.jpeg": "my_portfolio/infographic_self_image.jpeg",
}

def rename_files():
    """Rename image files"""
    renamed_count = 0
    
    # Create new directories if needed
    new_dirs = set()
    for new_path in file_renames.values():
        new_dir = os.path.join(images_dir, os.path.dirname(new_path))
        new_dirs.add(new_dir)
    
    for new_dir in new_dirs:
        os.makedirs(new_dir, exist_ok=True)
        print(f"✓ Created directory: {new_dir}")
    
    # Rename files
    for old_rel_path, new_rel_path in file_renames.items():
        old_path = os.path.join(images_dir, old_rel_path)
        new_path = os.path.join(images_dir, new_rel_path)
        
        if os.path.exists(old_path):
            shutil.move(old_path, new_path)
            print(f"✓ Renamed: {old_rel_path} -> {new_rel_path}")
            renamed_count += 1
        else:
            print(f"  Skip (not found): {old_rel_path}")
    
    return renamed_count

def update_vue_files():
    """Update all Vue file references"""
    updated_files = []
    
    # Create path mappings for Vue files (with /src/assets/images/ prefix)
    path_mappings = {}
    for old_path, new_path in file_renames.items():
        old_vue_path = f"/src/assets/images/{old_path}"
        new_vue_path = f"/src/assets/images/{new_path}"
        path_mappings[old_vue_path] = new_vue_path
    
    # Process all Vue files
    for vue_file in os.listdir(views_dir):
        if not vue_file.endswith('.vue'):
            continue
        
        filepath = os.path.join(views_dir, vue_file)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Replace all old paths with new paths
        for old_path, new_path in path_mappings.items():
            content = content.replace(old_path, new_path)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            updated_files.append(vue_file)
            print(f"✓ Updated: {vue_file}")
    
    return updated_files

# Main execution
print("=" * 60)
print("Image Path Fix Script")
print("=" * 60)

print("\n[1/2] Renaming image files...")
renamed_count = rename_files()

print(f"\n[2/2] Updating Vue file references...")
updated_files = update_vue_files()

print("\n" + "=" * 60)
print(f"✓ Complete!")
print(f"  - Renamed {renamed_count} image files")
print(f"  - Updated {len(updated_files)} Vue files")
print("=" * 60)
