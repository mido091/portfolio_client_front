import re
import os

# Define the views directory
views_dir = r"src\views"

def remove_script_tags_from_template(content):
    """Remove all <script> tags from inside <template> section"""
    # Find the template section
    template_match = re.search(r'(<template>.*?</template>)', content, re.DOTALL)
    if not template_match:
        return content, []
    
    template_content = template_match.group(1)
    original_template = template_content
    
    # Extract script src imports before removing
    script_imports = []
    script_src_pattern = r'<script\s+src="([^"]+)"\s*></script>'
    for match in re.finditer(script_src_pattern, template_content):
        script_imports.append(match.group(1))
    
    # Remove all <script> tags (both with src and inline)
    template_content = re.sub(r'<script[^>]*>.*?</script>', '', template_content, flags=re.DOTALL)
    
    # Remove HTML comments about scripts
    template_content = re.sub(r'<!--[^>]*ملف جافا سكريبت[^>]*-->', '', template_content)
    template_content = re.sub(r'<!--[^>]*script[^>]*-->', '', template_content, flags=re.IGNORECASE)
    
    # Clean up extra whitespace
    template_content = re.sub(r'\n\s*\n\s*\n', '\n\n', template_content)
    
    # Replace the template in the original content
    content = content.replace(original_template, template_content)
    
    return content, script_imports

def add_imports_to_script_setup(content, script_imports):
    """Add JavaScript imports to <script setup> block"""
    if not script_imports:
        return content
    
    # Find the <script setup> block
    script_setup_match = re.search(r'(<script setup>)(.*?)(</script>)', content, re.DOTALL)
    if not script_setup_match:
        return content
    
    opening = script_setup_match.group(1)
    script_content = script_setup_match.group(2)
    closing = script_setup_match.group(3)
    
    # Check if imports already exist
    existing_imports = re.findall(r"import\s+['\"]([^'\"]+)['\"]", script_content)
    
    # Add new imports at the top of script setup (after the vue import)
    import_lines = []
    for script_path in script_imports:
        if script_path not in existing_imports:
            import_lines.append(f"import '{script_path}';")
    
    if import_lines:
        # Find the position after vue imports
        vue_import_match = re.search(r"(import\s+{[^}]+}\s+from\s+['\"]vue['\"];?\s*\n)", script_content)
        if vue_import_match:
            insert_pos = vue_import_match.end()
            script_content = script_content[:insert_pos] + '\n' + '\n'.join(import_lines) + '\n' + script_content[insert_pos:]
        else:
            # No vue import, add at the beginning
            script_content = '\n' + '\n'.join(import_lines) + '\n' + script_content
    
    # Reconstruct the script setup block
    new_script_setup = opening + script_content + closing
    content = content.replace(script_setup_match.group(0), new_script_setup)
    
    return content

def process_file(filepath):
    """Process a single Vue file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Remove script tags from template and get imports
        content, script_imports = remove_script_tags_from_template(content)
        
        # Add imports to script setup
        content = add_imports_to_script_setup(content, script_imports)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Fixed: {os.path.basename(filepath)} - Removed {len(script_imports)} script imports")
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
