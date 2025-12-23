try:
    with open("build_result_final_3.txt", "r", encoding="utf-16-le") as f:
        content = f.read()
except:
    with open("build_result_final_3.txt", "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

lines = content.split('\n')
for i, line in enumerate(lines):
    if "externalize" in line or "Error" in line:
        context = lines[max(0, i-5):min(len(lines), i+5)]
        for c in context:
            print(c)
        print("-" * 20)
