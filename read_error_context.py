try:
    with open("build_error_2.txt", "r", encoding="utf-16-le") as f:
        lines = f.readlines()
except:
    with open("build_error_2.txt", "r", encoding="utf-8", errors="ignore") as f:
        lines = f.readlines()

for i, line in enumerate(lines):
    if "Error" in line or "failed" in line:
        start = max(0, i-5)
        end = min(len(lines), i+5)
        print("--- MATCH ---")
        for j in range(start, end):
            print(f"{j}: {lines[j].strip()}")
