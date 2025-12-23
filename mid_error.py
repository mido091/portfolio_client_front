try:
    with open("build_result_final_3.txt", "r", encoding="utf-16-le") as f:
        lines = f.readlines()
except:
    with open("build_result_final_3.txt", "r", encoding="utf-8", errors="ignore") as f:
        lines = f.readlines()

tail = lines[-150:-50]
with open("error_mid.txt", "w", encoding="utf-8") as f:
    f.writelines(tail)
print("Done")
