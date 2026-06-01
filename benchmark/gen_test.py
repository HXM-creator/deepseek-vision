"""生成合成测试图片 — 已知 ground truth"""
from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs("benchmark", exist_ok=True)

# ============ 1. 几何计数：5个红圆 + 3个蓝方 ============
img = Image.new("RGB", (400, 300), "white")
draw = ImageDraw.Draw(img)
colors = {"red": (220, 50, 50), "blue": (50, 80, 200)}
for i in range(5):  # 5 red circles
    x, y = 40 + i * 70, 80
    draw.ellipse([x, y, x+50, y+50], fill=colors["red"], outline="black")
for i in range(3):  # 3 blue squares
    x, y = 40 + i * 100, 180
    draw.rectangle([x, y, x+50, y+50], fill=colors["blue"], outline="black")
draw.text((10, 10), "Test 1: 5 red circles, 3 blue squares", fill="black")
img.save("benchmark/01_counting.png")
print("✅ 01_counting.png — 5红圆+3蓝方")

# ============ 2. 场景理解：房子+树+太阳+云 ============
img = Image.new("RGB", (500, 350), (135, 206, 235))  # sky blue
draw = ImageDraw.Draw(img)
# Sun
draw.ellipse([380, 20, 460, 100], fill=(255, 200, 50))
# Clouds
draw.ellipse([50, 40, 130, 80], fill="white")
draw.ellipse([80, 30, 160, 70], fill="white")
# House
draw.rectangle([100, 180, 280, 320], fill=(200, 160, 100))  # walls
draw.polygon([80, 180, 190, 100, 300, 180], fill=(180, 50, 50))  # roof
draw.rectangle([150, 220, 200, 270], fill=(100, 150, 200))  # window
draw.rectangle([230, 230, 270, 320], fill=(120, 80, 40))  # door
# Tree
draw.rectangle([330, 250, 350, 320], fill=(100, 60, 20))  # trunk
draw.ellipse([310, 180, 370, 250], fill=(30, 160, 50))  # foliage
# Grass
draw.rectangle([0, 320, 500, 350], fill=(80, 180, 60))
draw.text((10, 5), "Test 2: House + tree + sun + clouds", fill="black")
img.save("benchmark/02_scene.png")
print("✅ 02_scene.png — 场景(房子树太阳云)")

# ============ 3. 颜色识别：3条彩色竖条 ============
img = Image.new("RGB", (300, 250), "white")
draw = ImageDraw.Draw(img)
bar_colors = [(255, 0, 0), (0, 255, 0), (0, 0, 255)]
labels = ["RED", "GREEN", "BLUE"]
for i, (c, l) in enumerate(zip(bar_colors, labels)):
    x = 20 + i * 100
    draw.rectangle([x, 30, x+70, 220], fill=c)
    draw.text((x+15, 225), l, fill="black")
draw.text((5, 5), "Test 3: RGB bars", fill="black")
img.save("benchmark/03_colors.png")
print("✅ 03_colors.png — RGB三色条")

# ============ 4. 形状个数比较 ============
img = Image.new("RGB", (500, 250), "white")
draw = ImageDraw.Draw(img)
# 2 large squares (left)
for i in range(2):
    x, y = 30 + i * 80, 50
    draw.rectangle([x, y, x+60, y+60], fill=(255, 150, 50), outline="black")
draw.text((30+20, 120), "2", fill="black")
# 4 small circles (right)
for i in range(4):
    x, y = 280 + (i % 2) * 70, 50 + (i // 2) * 70
    draw.ellipse([x, y, x+50, y+50], fill=(100, 150, 255), outline="black")
draw.text((280+20, 180), "4", fill="black")
draw.text((5, 5), "Test 4: 2 orange squares vs 4 blue circles", fill="black")
img.save("benchmark/04_compare.png")
print("✅ 04_compare.png — 2方vs4圆比较")

# ============ 5. 图表：简单柱状图 ============
img = Image.new("RGB", (400, 300), "white")
draw = ImageDraw.Draw(img)
values = [80, 150, 60, 200, 120]
labels_c = ["A", "B", "C", "D", "E"]
colors_c = [(200,50,50), (50,150,50), (50,50,200), (200,150,0), (150,0,150)]
# axes
draw.line([50, 250, 350, 250], fill="black")  # x-axis
draw.line([50, 30, 50, 250], fill="black")    # y-axis
for i, (v, l, c) in enumerate(zip(values, labels_c, colors_c)):
    x = 60 + i * 55
    h = v  # 1px per unit
    draw.rectangle([x, 250-h, x+40, 250], fill=c)
    draw.text((x+10, 255), l, fill="black")
    draw.text((x+5, 250-h-15), str(v), fill="black")
draw.text((5, 5), "Test 5: Bar chart A=80 B=150 C=60 D=200 E=120", fill="black")
img.save("benchmark/05_chart.png")
print("✅ 05_chart.png — 柱状图(A=80,B=150,C=60,D=200,E=120)")

print("\n🎯 共生成 5 张测试图片")
