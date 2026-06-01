"""生成动漫角色 + 真实人物测试图片"""
from PIL import Image, ImageDraw
import os, math

os.makedirs("benchmark", exist_ok=True)

def draw_anime_face(draw, cx, cy, skin_color=(255,220,190), eye_color=(100,150,255), hair_color=(60,60,60), hair_style="long", accessory=None):
    """画一个动漫风格头像"""
    # 脸 (椭圆)
    draw.ellipse([cx-40, cy-50, cx+40, cy+50], fill=skin_color, outline=(200,180,160))
    # 头发
    if hair_style == "long":
        draw.ellipse([cx-50, cy-65, cx+50, cy-10], fill=hair_color)  # 头顶
        draw.arc([cx-50, cy-20, cx-20, cy+70], 180, 270, fill=hair_color, width=8)  # 左侧发
        draw.arc([cx+20, cy-20, cx+50, cy+70], 270, 360, fill=hair_color, width=8)  # 右侧发
    elif hair_style == "short":
        draw.ellipse([cx-48, cy-65, cx+48, cy-5], fill=hair_color)
    elif hair_style == "twintail":
        draw.ellipse([cx-45, cy-65, cx+45, cy-10], fill=hair_color)
        draw.ellipse([cx-60, cy-50, cx-30, cy-5], fill=hair_color)  # 左马尾
        draw.ellipse([cx+30, cy-50, cx+60, cy-5], fill=hair_color)  # 右马尾
    # 眼睛
    draw.ellipse([cx-20, cy-15, cx-5, cy+5], fill="white")
    draw.ellipse([cx+5, cy-15, cx+20, cy+5], fill="white")
    draw.ellipse([cx-18, cy-12, cx-8, cy+2], fill=eye_color)
    draw.ellipse([cx+8, cy-12, cx+18, cy+2], fill=eye_color)
    draw.ellipse([cx-16, cy-10, cx-10, cy-1], fill=(30,30,30))  # 瞳孔
    draw.ellipse([cx+10, cy-10, cx+16, cy-1], fill=(30,30,30))
    # 高光
    draw.ellipse([cx-17, cy-11, cx-14, cy-8], fill="white")
    draw.ellipse([cx+11, cy-11, cx+14, cy-8], fill="white")
    # 嘴巴
    draw.arc([cx-8, cy+15, cx+8, cy+30], 0, 180, fill=(200,100,100), width=2)
    # 眉毛
    draw.arc([cx-25, cy-20, cx-5, cy-10], 180, 360, fill=(80,60,40), width=2)
    draw.arc([cx+5, cy-20, cx+25, cy-10], 180, 360, fill=(80,60,40), width=2)
    # 腮红
    draw.ellipse([cx-30, cy+5, cx-15, cy+15], fill=(255,180,180,100))
    draw.ellipse([cx+15, cy+5, cx+30, cy+15], fill=(255,180,180,100))
    # 配饰
    if accessory == "ribbon":
        draw.polygon([cx-5, cy-55, cx+5, cy-55, cx, cy-45], fill=(255,50,50))
    elif accessory == "glasses":
        draw.ellipse([cx-25, cy-18, cx-2, cy+5], fill=None, outline=(50,50,50), width=2)
        draw.ellipse([cx+2, cy-18, cx+25, cy+5], fill=None, outline=(50,50,50), width=2)
        draw.line([cx-2, cy-10, cx+2, cy-10], fill=(50,50,50), width=2)
    elif accessory == "star_earring":
        draw.polygon([cx-48, cy+15, cx-44, cy+10, cx-40, cy+15, cx-44, cy+12], fill=(255,200,50))

# ============ 13. 红发蓝眼双马尾少女（动漫风） ============
img = Image.new("RGB", (300, 350), (200, 220, 255))
draw = ImageDraw.Draw(img)
draw_anime_face(draw, 150, 170, hair_color=(220, 50, 50), eye_color=(80, 150, 255), hair_style="twintail", accessory="ribbon")
draw.text((10, 5), "Test 13: Anime Girl A (red twintail, blue eyes, ribbon, pink blush)", fill="black")
draw.text((10, 320), "Features: red hair, blue eyes, ribbon, twintail, blushing", fill="black")
img.save("benchmark/13_anime_a.png")
print("✅ 13_anime_a.png — 红发蓝眼双马尾少女")

# ============ 14. 金发碧眼长发少女（动漫风） ============
img = Image.new("RGB", (300, 350), (220, 240, 220))
draw = ImageDraw.Draw(img)
draw_anime_face(draw, 150, 170, hair_color=(255, 220, 50), eye_color=(80, 200, 120), hair_style="long", accessory="star_earring")
draw.text((10, 5), "Test 14: Anime Girl B (blonde long hair, green eyes, star earring)", fill="black")
draw.text((10, 320), "Features: blonde, green eyes, long hair, star earring", fill="black")
img.save("benchmark/14_anime_b.png")
print("✅ 14_anime_b.png — 金发绿眼长发少女")

# ============ 15. 黑发眼镜少年（动漫风） ============
img = Image.new("RGB", (300, 350), (230, 230, 250))
draw = ImageDraw.Draw(img)
draw_anime_face(draw, 150, 170, skin_color=(240, 210, 180), hair_color=(40, 30, 20), eye_color=(100, 80, 60), hair_style="short", accessory="glasses")
draw.text((10, 5), "Test 15: Anime Boy (black hair, glasses, brown eyes, short hair)", fill="black")
draw.text((10, 320), "Features: black hair, glasses, brown eyes, short hair, male", fill="black")
img.save("benchmark/15_anime_c.png")
print("✅ 15_anime_c.png — 黑发眼镜少年")

# ============ 16. 真实人物：微笑女性（肖像风格） ============
img = Image.new("RGB", (300, 350), (200, 180, 170))
draw = ImageDraw.Draw(img)
# 脸型稍圆
draw.ellipse([80, 80, 220, 250], fill=(230, 190, 160), outline=(180, 150, 120))
# 头发（棕色长发）
for x in range(70, 231, 3):
    draw.line([x, 60, x-15, 200], fill=(120, 60, 30), width=2)
draw.ellipse([75, 50, 225, 120], fill=(120, 60, 30))
# 眼睛（棕色）
draw.ellipse([115, 140, 140, 165], fill="white")
draw.ellipse([160, 140, 185, 165], fill="white")
draw.ellipse([122, 148, 135, 160], fill=(80, 50, 20))
draw.ellipse([165, 148, 178, 160], fill=(80, 50, 20))
draw.ellipse([125, 152, 132, 158], fill=(30, 20, 10))
draw.ellipse([168, 152, 175, 158], fill=(30, 20, 10))
# 微笑
draw.arc([120, 195, 180, 220], 0, 180, fill=(180, 80, 80), width=2)
# 眉毛
draw.arc([110, 130, 145, 140], 180, 360, fill=(80, 50, 20), width=2)
draw.arc([155, 130, 190, 140], 180, 360, fill=(80, 50, 20), width=2)
# 耳环（小圆）
draw.ellipse([78, 170, 85, 177], fill=(200, 180, 50))
draw.text((10, 5), "Test 16: Real Person A (smiling woman, brown hair, brown eyes, earring)", fill="black")
draw.text((10, 320), "Features: female, brown hair, brown eyes, smiling, earring", fill="black")
img.save("benchmark/16_real_a.png")
print("✅ 16_real_a.png — 微笑棕发女性")

# ============ 17. 真实人物：胡须男性 ============
img = Image.new("RGB", (300, 350), (190, 200, 210))
draw = ImageDraw.Draw(img)
# 脸（方脸）
draw.polygon([90, 70, 210, 70, 230, 200, 210, 260, 90, 260, 70, 200], fill=(220, 180, 140), outline=(160, 130, 100))
# 头发（黑色短卷发）
draw.ellipse([75, 40, 225, 100], fill=(30, 30, 30))
for x in range(70, 231, 5):
    draw.arc([x-15, 70, x+15, 130], 0, 180, fill=(30, 30, 30), width=3)
# 眼睛（蓝色）
draw.ellipse([105, 140, 130, 165], fill="white")
draw.ellipse([170, 140, 195, 165], fill="white")
draw.ellipse([112, 148, 125, 160], fill=(50, 100, 200))
draw.ellipse([175, 148, 188, 160], fill=(50, 100, 200))
# 眉毛（浓）
draw.arc([100, 128, 135, 140], 180, 360, fill=(30, 20, 10), width=3)
draw.arc([165, 128, 200, 140], 180, 360, fill=(30, 20, 10), width=3)
# 胡须
draw.arc([95, 200, 205, 230], 0, 180, fill=(50, 35, 20), width=5)
draw.arc([100, 215, 200, 240], 0, 180, fill=(50, 35, 20), width=4)
# 嘴巴（严肃）
draw.line([120, 210, 180, 210], fill=(150, 80, 60), width=2)
draw.text((10, 5), "Test 17: Real Person B (man with beard, blue eyes, bald/curly short hair)", fill="black")
draw.text((10, 320), "Features: male, blue eyes, beard, mustache, short curly dark hair", fill="black")
img.save("benchmark/17_real_b.png")
print("✅ 17_real_b.png — 胡须蓝眼男性")

# ============ 18. 群体合影：3人 ============
img = Image.new("RGB", (500, 300), (200, 200, 220))
draw = ImageDraw.Draw(img)

# 人物1 - 左 (黑发女性，红围巾)
draw_anime_face(draw, 100, 130, hair_color=(40, 30, 20), eye_color=(80, 80, 200), hair_style="long")
draw.polygon([65, 170, 135, 170, 135, 200, 65, 200], fill=(200, 50, 50))  # 红围巾
draw.text((70, 215), "A: black hair", fill="black")

# 人物2 - 中 (金发男性，蓝衣)
draw_anime_face(draw, 250, 130, skin_color=(230, 200, 170), hair_color=(220, 200, 50), eye_color=(50, 150, 200), hair_style="short")
draw.polygon([215, 170, 285, 170, 285, 200, 215, 200], fill=(50, 100, 200))
draw.text((220, 215), "B: blonde, blue", fill="black")

# 人物3 - 右 (红发女性，绿衣)
draw_anime_face(draw, 400, 130, hair_color=(200, 60, 50), eye_color=(50, 180, 80), hair_style="twintail")
draw.polygon([365, 170, 435, 170, 435, 200, 365, 200], fill=(50, 180, 80))
draw.text((370, 215), "C: red hair, green", fill="black")

draw.text((10, 5), "Test 18: Group of 3 (black-hair A, blonde B, red-hair C - describe each)", fill="black")
draw.text((10, 280), "Left: black hair+red scarf | Center: blonde+blue shirt | Right: red hair+green shirt", fill="black")
img.save("benchmark/18_group.png")
print("✅ 18_group.png — 群体合影(3人)")

# ============ 19. 夸张表情角色 ============
img = Image.new("RGB", (300, 350), (255, 230, 200))
draw = ImageDraw.Draw(img)
# 脸
draw.ellipse([70, 60, 230, 240], fill=(255, 220, 180))
# 头发（紫色爆炸头）
for angle in range(0, 360, 30):
    r = 70
    ex = 150 + int(r * math.cos(angle * math.pi / 180))
    ey = 140 + int(r * math.sin(angle * math.pi / 180))
    draw.ellipse([ex-12, ey-12, ex+12, ey+12], fill=(150, 50, 180))
# 眼睛（瞪大 - 震惊）
draw.ellipse([100, 110, 135, 155], fill="white")
draw.ellipse([165, 110, 200, 155], fill="white")
draw.ellipse([112, 125, 125, 145], fill=(50, 50, 50))
draw.ellipse([175, 125, 188, 145], fill=(50, 50, 50))
# 嘴巴（O形 - 震惊）
draw.ellipse([130, 185, 170, 215], fill=(60, 30, 30))
# 汗滴
draw.ellipse([60, 120, 75, 140], fill=(180, 200, 255))
draw.text((10, 5), "Test 19: Shocked expression (purple messy hair, wide eyes, O-mouth, sweatdrop)", fill="black")
draw.text((10, 320), "Features: purple hair, shocked, wide eyes, O-mouth, sweat", fill="black")
img.save("benchmark/19_shock.png")
print("✅ 19_shock.png — 震惊表情角色")

# ============ 20. 戴帽子的角色 ============
img = Image.new("RGB", (300, 350), (240, 230, 210))
draw = ImageDraw.Draw(img)
# 脸
draw.ellipse([80, 100, 220, 240], fill=(240, 210, 180))
# 帽子（大沿帽）
draw.arc([55, 50, 245, 130], 180, 360, fill=(200, 100, 50), width=20)
draw.ellipse([90, 30, 210, 90], fill=(200, 100, 50))
draw.ellipse([130, 20, 170, 45], fill=(200, 100, 50))  # 帽顶
# 眼睛（绿色）
draw.ellipse([110, 140, 135, 165], fill="white")
draw.ellipse([165, 140, 190, 165], fill="white")
draw.ellipse([117, 148, 130, 160], fill=(50, 180, 80))
draw.ellipse([170, 148, 183, 160], fill=(50, 180, 80))
# 微笑
draw.arc([125, 195, 175, 215], 0, 180, fill=(180, 80, 80), width=2)
# 领带
draw.polygon([140, 225, 160, 225, 155, 270, 150, 280, 145, 270], fill=(50, 50, 150))
draw.text((10, 5), "Test 20: Hat person (brown hat, green eyes, smiling, tie)", fill="black")
draw.text((10, 320), "Features: brown hat, green eyes, tie, smiling", fill="black")
img.save("benchmark/20_hat.png")
print("✅ 20_hat.png — 戴帽角色")

print("\n🎯 共生成 8 张新测试图（13~20）")
