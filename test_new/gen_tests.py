"""新测试图生成 — 我知道正确答案"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

os.makedirs("test_new", exist_ok=True)

# ===== 1. 红烧牛肉面（真实食物）=====
img = Image.new("RGB", (400, 300), (240, 220, 200))
draw = ImageDraw.Draw(img)
# 碗
draw.ellipse([100, 80, 300, 260], fill=(255, 255, 255), outline=(180, 160, 140), width=3)
draw.arc([80, 60, 320, 280], 0, 180, fill=(180, 160, 140), width=4)
# 汤
draw.ellipse([120, 110, 280, 240], fill=(180, 100, 50))
# 面条
for i in range(20):
    x, y = 150 + i*5, 130 + i*3
    draw.arc([x, y, x+60, y+20], 0, 360, fill=(240, 200, 150), width=3)
# 牛肉
for _ in range(4):
    import random
    bx, by = 170+random.randint(0,50), 140+random.randint(0,40)
    draw.ellipse([bx, by, bx+25, by+15], fill=(120, 60, 30))
# 葱花
for _ in range(8):
    gx, gy = 160+random.randint(0,80), 130+random.randint(0,60)
    draw.ellipse([gx, gy, gx+4, gy+4], fill=(50, 150, 50))
draw.text((10, 5), "Test A: 牛肉面（beef noodle soup）", fill=(0,0,0))
img.save("test_new/A_noodle.png")
print("✅ A_noodle.png")

# ===== 2. 交通信号灯 =====
img = Image.new("RGB", (200, 400), (135, 206, 235))
draw = ImageDraw.Draw(img)
# 灯柱
draw.rectangle([85, 50, 115, 380], fill=(80, 80, 80))
# 灯箱
draw.rectangle([60, 50, 140, 240], fill=(50, 50, 50), outline=(100, 100, 100))
# 红灯（亮）
draw.ellipse([75, 60, 125, 110], fill=(255, 50, 50))
draw.ellipse([80, 65, 120, 105], fill=(255, 150, 150))  # 高光
# 黄灯（灭）
draw.ellipse([75, 125, 125, 175], fill=(80, 80, 50))
# 绿灯（灭）
draw.ellipse([75, 190, 125, 240], fill=(50, 80, 50))
draw.text((5, 290), "Test B: 红灯（red light）", fill=(0,0,0))
img.save("test_new/B_traffic_light.png")
print("✅ B_traffic_light.png")

# ===== 3. 数字时钟 10:30 =====
img = Image.new("RGB", (300, 150), (0, 0, 0))
draw = ImageDraw.Draw(img)
# 数码管风格
draw.text((30, 30), "10:30", fill=(0, 255, 0))
draw.text((30, 80), "Test C: 时钟 10:30", fill=(100, 100, 100))
img.save("test_new/C_clock.png")
print("✅ C_clock.png")

# ===== 4. 国旗（五星红旗）=====
img = Image.new("RGB", (400, 280), (220, 30, 30))
draw = ImageDraw.Draw(img)
# 大五角星
star = [(260,30),(270,55),(300,55),(275,70),(285,95),(260,78),(235,95),(245,70),(220,55),(250,55)]
draw.polygon(star, fill=(255, 235, 50))
# 小星
for cx, cy in [(310, 50), (325, 70), (325, 95), (310, 115)]:
    s = [(cx,cy-8),(cx+3,cy-2),(cx+10,cy-2),(cx+5,cy+3),(cx+7,cy+10),(cx,cy+5),(cx-7,cy+10),(cx-5,cy+3),(cx-10,cy-2),(cx-3,cy-2)]
    draw.polygon(s, fill=(255, 235, 50))
draw.text((5, 250), "Test D: 五星红旗（China flag）", fill=(255,255,200))
img.save("test_new/D_flag.png")
print("✅ D_flag.png")

# ===== 5. 简单条形图 =====
img = Image.new("RGB", (400, 250), (255, 255, 255))
draw = ImageDraw.Draw(img)
bars = [(40,180,80,60),(100,130,140,110),(160,200,200,40),(220,90,260,150),(280,140,320,100)]
for x1, h, x2, y2 in bars:
    draw.rectangle([x1, y2, x2, 230], fill=(70, 130, 200))
    draw.text((x1+5, y2-15), str(230-y2), fill=(0,0,0))
for i, l in enumerate(['Mon','Tue','Wed','Thu','Fri']):
    draw.text((35+i*60, 232), l, fill=(0,0,0))
draw.text((5, 5), "Test E: Mon=60 Tue=110 Wed=40 Thu=150 Fri=100", fill=(0,0,0))
img.save("test_new/E_bar.png")
print("✅ E_bar.png")

# ===== 6. 电路示意图（电池+灯泡）=====
img = Image.new("RGB", (400, 200), (255, 255, 255))
draw = ImageDraw.Draw(img)
# 导线
draw.line([50, 100, 350, 100], fill=(0,0,0), width=2)
draw.line([50, 100, 50, 150], fill=(0,0,0), width=2)
draw.line([350, 100, 350, 150], fill=(0,0,0), width=2)
draw.line([50, 150, 350, 150], fill=(0,0,0), width=2)
# 电池
draw.rectangle([60, 60, 100, 100], fill=(200,200,200), outline=(0,0,0))
draw.line([65, 80, 95, 80], fill=(0,0,0), width=3)  # +
draw.line([70, 90, 90, 90], fill=(0,0,0), width=2)  # -
draw.text((55, 105), "BAT 9V", fill=(0,0,0))
# 灯泡
draw.ellipse([300, 75, 340, 115], fill=(255, 255, 100), outline=(0,0,0))
draw.line([320, 115, 320, 125], fill=(0,0,0), width=2)
draw.text((295, 125), "LAMP", fill=(0,0,0))
draw.text((5, 5), "Test F: 电路(battery+bulb+s witch)", fill=(0,0,0))
img.save("test_new/F_circuit.png")
print("✅ F_circuit.png")

# ===== 7. 三种水果 =====
img = Image.new("RGB", (450, 200), (255, 255, 255))
draw = ImageDraw.Draw(img)
# 苹果
draw.ellipse([20, 30, 100, 110], fill=(220, 50, 50))
draw.line([55, 30, 60, 15], fill=(100, 60, 20), width=2)
draw.text((30, 115), "苹果", fill=(0,0,0))
# 香蕉
draw.arc([130, 40, 200, 110], 180, 360, fill=(255, 220, 50), width=20)
draw.text((135, 115), "香蕉", fill=(0,0,0))
# 葡萄
for gx in [270, 295, 320]:
    for gy in [40, 65, 90]:
        draw.ellipse([gx-8, gy-8, gx+8, gy+8], fill=(130, 50, 150))
draw.text((270, 115), "葡萄", fill=(0,0,0))
draw.text((5, 5), "Test G: 苹果+香蕉+葡萄", fill=(0,0,0))
img.save("test_new/G_fruits.png")
print("✅ G_fruits.png")

# ===== 8. 表情符号（笑脸）=====
img = Image.new("RGB", (200, 200), (255, 255, 200))
draw = ImageDraw.Draw(img)
# 脸
draw.ellipse([20, 20, 180, 180], fill=(255, 220, 100), outline=(200, 150, 50), width=2)
# 眼睛
draw.ellipse([60, 60, 85, 85], fill=(0, 0, 0))
draw.ellipse([115, 60, 140, 85], fill=(0, 0, 0))
# 微笑
draw.arc([60, 80, 140, 145], 0, 180, fill=(150, 50, 50), width=3)
draw.text((5, 5), "Test H: 笑脸( smiley face )", fill=(0,0,0))
img.save("test_new/H_smiley.png")
print("✅ H_smiley.png")

print("\n🎯 共 8 张新测试图")
