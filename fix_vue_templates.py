import re
import os

# Define the views directory
views_dir = r"src\views"

def fix_mismatched_tags(content):
    """Fix mismatched <a> opening tags with </router-link> closing tags"""
    # Pattern 1: <a href="...">...</a></router-link> -> <a href="...">...</a>
    content = re.sub(r'(<a\s+[^>]*href=[^>]+>.*?)</a>\s*</router-link>', r'\1</a>', content, flags=re.DOTALL)
    
    # Pattern 2: <a href="...">...</router-link> -> <a href="...">...</a>
    content = re.sub(r'(<a\s+[^>]*href=[^>]+>)(.*?)</router-link>', r'\1\2</a>', content, flags=re.DOTALL)
    
    # Pattern 3: <a to="...">...</router-link> -> <router-link to="...">...</router-link>
    content = re.sub(r'<a\s+to="([^"]+)"([^>]*)>(.*?)</router-link>', r'<router-link to="\1"\2>\3</router-link>', content, flags=re.DOTALL)
    
    return content

def process_file(filepath):
    """Process a single Vue file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        content = fix_mismatched_tags(content)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Fixed: {os.path.basename(filepath)}")
            return True
        else:
            print(f"  No changes: {os.path.basename(filepath)}")
            return False
    except Exception as e:
        print(f"✗ Error processing {filepath}: {e}")
        return False

# Process all Vue files in views directory
if os.path.exists(views_dir):
    vue_files = [f for f in os.listdir(views_dir) if f.endswith('.vue')]
    fixed_count = 0
    
    print(f"Processing {len(vue_files)} Vue files...\n")
    
    for vue_file in vue_files:
        filepath = os.path.join(views_dir, vue_file)
        if process_file(filepath):
            fixed_count += 1
    
    print(f"\n✓ Complete! Fixed {fixed_count} out of {len(vue_files)} files.")
else:
    print(f"Error: Directory {views_dir} not found")
