"""生成终端演示截图"""
from PIL import Image, ImageDraw, ImageFont
import os

# 终端参数
W, H = 720, 460
BG = (30, 30, 40)       # 深色终端背景
TITLE_BG = (50, 50, 65)  # 标题栏
TEXT_COLOR = (200, 200, 200)
GREEN = (80, 220, 100)
YELLOW = (255, 220, 80)
BLUE = (80, 180, 255)
ORANGE = (255, 160, 60)

# 字体 — 用默认字体
img = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)

# 标题栏
draw.rectangle([0, 0, W, 32], fill=TITLE_BG)
# 红绿灯
for cx, c in [(16, (255,80,80)), (32, (255,200,60)), (48, (80,200,80))]:
    draw.ellipse([cx-5, 16-5, cx+5, 16+5], fill=c)
draw.text((60, 10), "deepseek-vision — node vision.js", fill=(160,160,180))

# 终端内容
def t(text, y, color=TEXT_COLOR, bold=False):
    draw.text((16, y), text, fill=color)

y = 48
t("$ node vision.js anime.jpg \"这是谁？\" --task anime", y, GREEN); y += 28
t("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", y, (80,80,90)); y += 24

t("🔥 火山引擎 ARK | doubao-seed-1-6-flash-250615", y, ORANGE); y += 20
t("📝 模式: balanced | 488KB", y, TEXT_COLOR); y += 20
t("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", y, (80,80,90)); y += 24

t("🧠 推理:", y, YELLOW); y += 20
t("这是《约会大作战》中的五河士道。", y, TEXT_COLOR); y += 20
t("Shido是男主角，拥有女体化能力。", y, TEXT_COLOR); y += 20
t("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", y, (80,80,90)); y += 20

t("📋 回答:", y, BLUE); y += 22
t("这是五河士道（Shido Itsuka），出自《约会大作战》。", y, TEXT_COLOR); y += 24
t("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", y, (80,80,90)); y += 20

# 双重验证
t("🔍 交叉验证 (阿里云百炼 qwen-vl-plus)...", y, BLUE); y += 20
t("⚠️ 存在不一致：", y, YELLOW); y += 18
t("  主模型独有: 五河士道, 约会大作战", y, TEXT_COLOR); y += 18
t("  验证模型独有: 常见动漫少女 (无法确认)", y, TEXT_COLOR); y += 22

t("📖 事实核查 (阿里云百炼 qwen3-vl-plus)...", y, BLUE); y += 20
t("⚠️ \"女体化形态\" 描述不准确，作品中无官方设定", y, YELLOW); y += 24
t("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", y, (80,80,90)); y += 20

# 置信度 + 统计
t("🎯 置信度: ★★★★☆ 较可信", y, GREEN); y += 20
t("📊 672 tok | ⏱️ 1.6s | ✅ 事实核查通过", y, TEXT_COLOR)

# 保存
os.makedirs("benchmark", exist_ok=True)
img.save("benchmark/demo.png")
print(f"✅ benchmark/demo.png ({W}x{H})")
