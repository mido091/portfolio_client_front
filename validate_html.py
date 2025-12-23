from html.parser import HTMLParser

class TagStackValidator(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []
        self.current_line = 1

    def handle_starttag(self, tag, attrs):
        if tag not in ['img', 'br', 'hr', 'input', 'meta', 'link']:
            self.stack.append((tag, self.getpos()[0]))

    def handle_endtag(self, tag):
        if tag in ['img', 'br', 'hr', 'input', 'meta', 'link']:
            return
        
        if not self.stack:
            self.errors.append(f"Line {self.getpos()[0]}: Unexpected end tag </{tag}> (stack empty)")
            return

        last_tag, start_line = self.stack[-1]
        if last_tag == tag:
            self.stack.pop()
        else:
            self.errors.append(f"Line {self.getpos()[0]}: Mismatched end tag </{tag}>. Expected closing </{last_tag}> for tag opened at line {start_line}.")

    def validate_file(self, content):
        self.feed(content)
        if self.stack:
            for tag, line in self.stack:
                self.errors.append(f"Line {line}: Unclosed tag <{tag}>")
        return self.errors

with open(r"e:\web dev\mevn\portofile_client\client\src\views\Home.vue", "r", encoding="utf-8") as f:
    content = f.read()

# Extract template content roughly
start = content.find("<template>")
end = content.rfind("</template>")
if start != -1 and end != -1:
    template_content = content[start+10:end]
    validator = TagStackValidator()
    errors = validator.validate_file(template_content)
    if errors:
        for err in errors:
            print(err)
    else:
        print("No errors found.")
else:
    print("No template found.")
