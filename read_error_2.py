try:
    with open("build_error_2.txt", "r", encoding="utf-16-le") as f:
        content = f.read()
except:
    with open("build_error_2.txt", "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

lines = content.split('\n')
for line in lines:
    if "Error" in line or "failed" in line or "[vite" in line:
        print(line.strip())
