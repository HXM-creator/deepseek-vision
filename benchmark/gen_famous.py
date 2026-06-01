"""生成名人 + 建筑合成测试图"""
from PIL import Image, ImageDraw
import os, math

os.makedirs("benchmark", exist_ok=True)

# ============ 21. 爱因斯坦（白发+胡须+标志性形象） ============
img = Image.new("RGB", (300, 350), (220, 210, 200))
draw = ImageDraw.Draw(img)
# 脸
draw.ellipse([90, 100, 210, 240], fill=(240, 210, 190))
# 标志性白发（蓬松爆炸）
for x in range(70, 231, 8):
    for y in range(40, 100, 6):
        draw.ellipse([x-2, y-2, x+2, y+2], fill=(220, 220, 220))
draw.ellipse([75, 55, 225, 110], fill=(230, 230, 230))
# 眼睛
draw.ellipse([115, 145, 135, 165], fill=(60, 50, 40))
draw.ellipse([165, 145, 185, 165], fill=(60, 50, 40))
draw.ellipse([118, 150, 132, 162], fill=(20, 15, 10))
draw.ellipse([168, 150, 182, 162], fill=(20, 15, 10))
# 眉毛（浓密）
draw.arc([108, 135, 140, 148], 180, 360, fill=(180, 180, 180), width=3)
draw.arc([160, 135, 192, 148], 180, 360, fill=(180, 180, 180), width=3)
# 标志性胡子（大胡子）
draw.arc([100, 200, 200, 235], 0, 180, fill=(200, 200, 200), width=6)
draw.arc([105, 220, 195, 250], 0, 180, fill=(200, 200, 200), width=5)
# 嘴巴（微笑）
draw.arc([128, 200, 172, 215], 0, 180, fill=(150, 80, 60), width=2)
# 舌头（调皮）
draw.ellipse([140, 208, 160, 225], fill=(255, 150, 150))
# 皱纹
draw.arc([105, 165, 140, 180], 180, 360, fill=(180, 150, 130), width=1)
draw.arc([160, 165, 195, 180], 180, 360, fill=(180, 150, 130), width=1)

draw.text((5, 5), "Test 21: Famous Scientist (white messy hair, big mustache, tongue out)", fill="black")
draw.text((5, 320), "Known for: Theory of Relativity, E=mc^2, Nobel Prize", fill="black")
img.save("benchmark/21_einstein.png")
print("✅ 21_einstein.png — 爱因斯坦")

# ============ 22. 马斯克（特斯拉/ SpaceX创始人） ============
img = Image.new("RGB", (300, 350), (210, 210, 220))
draw = ImageDraw.Draw(img)
# 脸
draw.polygon([100, 90, 200, 90, 215, 200, 200, 260, 100, 260, 85, 200], fill=(230, 200, 170))
# 头发（深色偏分）
draw.ellipse([82, 50, 218, 110], fill=(40, 30, 20))
draw.arc([85, 95, 215, 130], 0, 180, fill=(40, 30, 20), width=6)
# 眼睛
draw.ellipse([120, 140, 140, 160], fill="white")
draw.ellipse([160, 140, 180, 160], fill="white")
draw.ellipse([125, 146, 137, 157], fill=(60, 80, 200))
draw.ellipse([163, 146, 175, 157], fill=(60, 80, 200))
# 眉毛
draw.arc([115, 130, 145, 140], 180, 360, fill=(30, 20, 10), width=2)
draw.arc([155, 130, 185, 140], 180, 360, fill=(30, 20, 10), width=2)
# 鼻子
draw.arc([145, 165, 155, 185], 180, 360, fill=(180, 150, 130), width=2)
# 嘴巴（有点歪的笑）
draw.arc([130, 205, 170, 220], 5, 175, fill=(150, 80, 60), width=2)
# 胡茬
for x in range(100, 201, 6):
    draw.point((x, 225), fill=(50, 40, 30))
draw.text((5, 5), "Test 22: Famous Entrepreneur (dark hair, blue eyes, slight stubble)", fill="black")
draw.text((5, 320), "Known for: Tesla, SpaceX, Twitter/X, Mars colonization", fill="black")
img.save("benchmark/22_musk.png")
print("✅ 22_musk.png — 马斯克")

# ============ 23. 马云（阿里巴巴创始人） ============
img = Image.new("RGB", (300, 350), (220, 215, 200))
draw = ImageDraw.Draw(img)
# 脸（较瘦长）
draw.polygon([100, 85, 200, 85, 215, 180, 210, 255, 90, 255, 85, 180], fill=(235, 205, 175))
# 头发（黑色短发）
draw.ellipse([88, 50, 212, 100], fill=(30, 25, 20))
# 眼睛（小，笑起来眯成缝）
draw.arc([115, 138, 140, 155], 0, 180, fill=(40, 30, 20), width=3)
draw.arc([160, 138, 185, 155], 0, 180, fill=(40, 30, 20), width=3)
# 眉毛
draw.arc([112, 130, 143, 140], 180, 360, fill=(30, 20, 10), width=2)
draw.arc([157, 130, 188, 140], 180, 360, fill=(30, 20, 10), width=2)
# 嘴巴（经典微笑）
draw.arc([125, 200, 175, 220], 0, 180, fill=(150, 70, 60), width=2)
# 下巴
draw.arc([135, 245, 165, 258], 0, 180, fill=(200, 170, 145), width=1)
draw.text((5, 5), "Test 23: Famous Chinese Entrepreneur (short dark hair, squinty smile)", fill="black")
draw.text((5, 320), "Known for: Alibaba, Taobao, Alipay, Jack Ma", fill="black")
img.save("benchmark/23_jackma.png")
print("✅ 23_jackma.png — 马云")

# ============ 24. 埃菲尔铁塔 ============
img = Image.new("RGB", (250, 400), (140, 180, 220))  # 淡蓝天空
draw = ImageDraw.Draw(img)
# 铁塔主体（三层结构）
# 底部
draw.polygon([25, 360, 125, 360, 225, 360, 175, 280, 75, 280], fill=(80, 80, 90), outline=(60, 60, 70))
# 中间
draw.polygon([75, 280, 175, 280, 145, 180, 105, 180], fill=(80, 80, 90), outline=(60, 60, 70))
# 顶部
draw.polygon([105, 180, 145, 180, 135, 100, 115, 100], fill=(80, 80, 90), outline=(60, 60, 70))
# 尖顶
draw.polygon([115, 100, 135, 100, 125, 50], fill=(80, 80, 90), outline=(60, 60, 70))
# 横梁装饰
draw.line([30, 330, 220, 330], fill=(100, 100, 110), width=3)
draw.line([75, 230, 175, 230], fill=(100, 100, 110), width=3)
draw.line([105, 140, 145, 140], fill=(100, 100, 110), width=3)
# 底部拱门
draw.arc([45, 340, 105, 370], 180, 360, fill=(60, 60, 70), width=3)
draw.arc([145, 340, 205, 370], 180, 360, fill=(60, 60, 70), width=3)
draw.arc([95, 340, 155, 370], 180, 360, fill=(60, 60, 70), width=3)
# 地面
draw.rectangle([0, 360, 250, 400], fill=(80, 160, 60))
draw.text((5, 5), "Test 24: Famous Landmark (iron tower, 3 levels, pointed top, Paris)", fill="black")
draw.text((5, 385), "Known for: Paris, France, 324m tall, built 1889", fill="black")
img.save("benchmark/24_eiffel.png")
print("✅ 24_eiffel.png — 埃菲尔铁塔")

# ============ 25. 金门大桥 ============
img = Image.new("RGB", (500, 300), (130, 170, 200))  # 灰蓝天空
draw = ImageDraw.Draw(img)
# 桥塔
draw.rectangle([100, 60, 120, 260], fill=(180, 80, 40))  # 左塔
draw.rectangle([380, 60, 400, 260], fill=(180, 80, 40))  # 右塔
# 塔顶
draw.rectangle([95, 55, 125, 70], fill=(180, 80, 40))
draw.rectangle([375, 55, 405, 70], fill=(180, 80, 40))
# 主缆（弧形）
for offset in range(-3, 4):
    draw.arc([85, 30, 415, 130], 180, 360, fill=(160, 70, 30), width=2+abs(offset))
# 桥面
draw.rectangle([20, 200, 480, 210], fill=(180, 80, 40))
# 桥面支柱
for x in range(50, 451, 30):
    draw.line([x, 210, x, 260], fill=(160, 70, 30), width=2)
# 海水
draw.rectangle([0, 260, 500, 300], fill=(40, 100, 140))
# 吊索
for x in range(110, 390, 15):
    draw.line([x, 70, x, 200], fill=(160, 70, 30), width=1)
# 左侧桥引
draw.rectangle([0, 210, 100, 220], fill=(180, 80, 40))
draw.rectangle([400, 210, 500, 220], fill=(180, 80, 40))
draw.text((5, 5), "Test 25: Famous Bridge (red/orange suspension, 2 towers, bay, San Francisco)", fill="black")
draw.text((5, 285), "Known for: San Francisco, California, iconic red color", fill="black")
img.save("benchmark/25_golden_gate.png")
print("✅ 25_golden_gate.png — 金门大桥")

# ============ 26. 悉尼歌剧院 ============
img = Image.new("RGB", (400, 300), (180, 200, 220))
draw = ImageDraw.Draw(img)
# 海水
draw.rectangle([0, 210, 400, 300], fill=(50, 120, 160))
# 歌剧院的"帆"（白色壳片）
shells = [
    [(80, 210), (115, 80), (150, 210)],      # 左1
    [(130, 210), (170, 60), (210, 210)],      # 中1（最高）
    [(190, 210), (225, 80), (260, 210)],      # 右1
    [(250, 210), (280, 110), (310, 210)],     # 右2
    [(40, 210), (70, 130), (100, 210)],       # 左2
]
for pts in shells:
    draw.polygon(pts, fill=(240, 240, 235), outline=(200, 200, 195))
# 基座
draw.rectangle([30, 200, 330, 215], fill=(200, 190, 180))
# 地面连接
draw.rectangle([0, 210, 60, 230], fill=(150, 140, 130))
draw.rectangle([300, 210, 400, 230], fill=(150, 140, 130))
draw.text((5, 5), "Test 26: Famous Opera House (white shell sails, waterfront, Australia)", fill="black")
draw.text((5, 285), "Known for: Sydney, Australia, UNESCO World Heritage", fill="black")
img.save("benchmark/26_opera.png")
print("✅ 26_opera.png — 悉尼歌剧院")

# ============ 27. 长城 ============
img = Image.new("RGB", (500, 300), (170, 190, 210))
draw = ImageDraw.Draw(img)
# 山
draw.arc([-50, 100, 150, 350], 0, 180, fill=(100, 140, 80), width=60)
draw.arc([100, 80, 300, 320], 0, 180, fill=(90, 130, 70), width=55)
draw.arc([250, 100, 500, 330], 0, 180, fill=(100, 140, 80), width=60)
# 城墙（蜿蜒）
wall_points = [(0, 190), (35, 170), (70, 175), (110, 145), (150, 155),
               (190, 120), (230, 130), (270, 105), (310, 115), (350, 95),
               (390, 100), (430, 85), (470, 88), (500, 80)]
for i in range(len(wall_points)-1):
    draw.line([wall_points[i], wall_points[i+1]], fill=(150, 100, 60), width=8)
    draw.line([wall_points[i], wall_points[i+1]], fill=(180, 130, 80), width=4)
# 城楼（每隔一段一个）
towers = [(110, 145), (190, 120), (270, 105), (350, 95), (430, 85)]
for tx, ty in towers:
    draw.rectangle([tx-8, ty-20, tx+8, ty], fill=(150, 100, 60))
    draw.rectangle([tx-12, ty-25, tx+12, ty-20], fill=(180, 130, 80))
    draw.polygon([tx-14, ty-25, tx+14, ty-25, tx, ty-35], fill=(100, 60, 30))
# 天空
draw.ellipse([400, 10, 460, 70], fill=(255, 220, 50))  # 太阳
draw.text((5, 5), "Test 27: Great Wall (winding wall on mountain ridges with watchtowers)", fill="black")
draw.text((5, 280), "Known for: China, UNESCO, 21000km, built over centuries", fill="black")
img.save("benchmark/27_greatwall.png")
print("✅ 27_greatwall.png — 长城")

# ============ 28. B站/抖音风格博主（虚构但特征鲜明） ============
img = Image.new("RGB", (300, 350), (255, 200, 210))
draw = ImageDraw.Draw(img)
# 脸
draw.ellipse([80, 80, 220, 240], fill=(255, 220, 190))
# 头发（粉色挑染短发 - 潮人风格）
draw.ellipse([70, 45, 230, 105], fill=(180, 60, 120))
for x in range(65, 235, 5):
    draw.line([x, 60, x-10, 100], fill=(220, 100, 150), width=3)
# 眼镜（大圆框时尚眼镜）
draw.ellipse([95, 125, 140, 170], fill=None, outline=(50, 50, 50), width=3)
draw.ellipse([160, 125, 205, 170], fill=None, outline=(50, 50, 50), width=3)
draw.line([140, 150, 160, 150], fill=(50, 50, 50), width=2)
# 眼睛（大而有神）
draw.ellipse([105, 135, 130, 160], fill="white")
draw.ellipse([170, 135, 195, 160], fill="white")
draw.ellipse([112, 142, 125, 155], fill=(80, 50, 30))
draw.ellipse([175, 142, 188, 155], fill=(80, 50, 30))
# 微笑（夸张）
draw.arc([115, 190, 185, 215], 0, 180, fill=(200, 70, 70), width=3)
# 耳麦
draw.arc([60, 105, 90, 165], 180, 360, fill=(30, 30, 30), width=4)
draw.arc([210, 105, 240, 165], 270, 450, fill=(30, 30, 30), width=4)
draw.text((5, 5), "Test 28: Online Streamer/Blogger (pink hair, big round glasses, headset)", fill="black")
draw.text((5, 320), "Style: Bilibili/Douyin content creator, gaming/streaming", fill="black")
img.save("benchmark/28_streamer.png")
print("✅ 28_streamer.png — 博主/主播")

print("\n🎯 共生成 8 张新测试图（21~28）")
