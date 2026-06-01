"""生成工科场景测试图片 — 芯片/电路/Simulink等"""
from PIL import Image, ImageDraw, ImageFont
import os, math

os.makedirs("benchmark", exist_ok=True)

def draw_text_centered(draw, xy, text, fill="black"):
    """简易居中文字（不使用字体文件）"""
    draw.text(xy, text, fill=fill)

# ============ 07. 芯片版图 (IC Layout) ============
img = Image.new("RGB", (500, 400), (20, 30, 20))  # 深绿色PCB底色
draw = ImageDraw.Draw(img)

# 芯片核心 (die)
draw.rectangle([100, 60, 400, 340], fill=(40, 50, 40), outline=(100, 200, 100), width=2)

# 内部功能区块
blocks = [
    (120, 80, 220, 160, (60, 100, 220), "CPU Core"),    # 蓝色
    (240, 80, 380, 160, (60, 200, 80), "Cache"),         # 绿色
    (120, 180, 220, 260, (220, 200, 60), "DSP"),         # 黄色
    (240, 180, 380, 260, (200, 60, 60), "ADC"),          # 红色
    (160, 280, 320, 320, (160, 60, 200), "I/O"),         # 紫色
]
for x1, y1, x2, y2, color, label in blocks:
    draw.rectangle([x1, y1, x2, y2], fill=color, outline="white", width=1)
    draw_text_centered(draw, (x1+5, y1+5), label)

# 引脚 (pins) — 四边
for i in range(8):
    x = 60 + i * 50
    draw.rectangle([x, 30, x+20, 60], fill=(180, 180, 100), outline="white")
    draw.rectangle([x, 340, x+20, 370], fill=(180, 180, 100), outline="white")

# 文字标注
draw.text((5, 5), "Test 7: IC Chip Layout (CPU+Cache+DSP+ADC+I/O, 8 pins)", fill="white")
img.save("benchmark/07_chip.png")
print("✅ 07_chip.png — 芯片版图")

# ============ 08. 电路原理图 (Schematic) ============
img = Image.new("RGB", (600, 350), "white")
draw = ImageDraw.Draw(img)

# 电源 VCC
draw.text((10, 10), "VCC (5V)", fill="red")
draw.line([60, 30, 60, 200], fill="black", width=2)

# 电阻 R1
draw.rectangle([40, 60, 80, 100], fill=(200, 150, 100), outline="black")
draw.text((25, 45), "R1", fill="black")
draw.text((30, 105), "10kΩ", fill="black")

# 导线到基极
draw.line([60, 100, 200, 100], fill="black", width=2)

# 晶体管 NPN
draw.polygon([180, 60, 220, 100, 180, 140], fill=(180, 200, 220), outline="black")
draw.line([200, 100, 240, 100], fill="black", width=2)
draw.text((175, 50), "Q1", fill="black")
draw.text((175, 145), "NPN", fill="black")
# 发射极
draw.line([180, 140, 180, 200], fill="black", width=2)
# 发射极电阻 R2
draw.rectangle([160, 200, 200, 240], fill=(200, 150, 100), outline="black")
draw.text((160, 245), "R2 1kΩ", fill="black")
draw.line([180, 240, 180, 280], fill="black", width=2)
draw.line([60, 280, 180, 280], fill="black", width=2)
# GND
draw.text((50, 285), "GND", fill="black")

# 集电极输出
draw.line([220, 100, 300, 100], fill="black", width=2)
draw.text((250, 90), "Vout", fill="blue")

# 电容 C1 (输入端)
draw.ellipse([70, 30, 100, 60], fill=(150, 200, 220), outline="black")
draw.text((80, 10), "C1", fill="black")
draw.text((70, 65), "10μF", fill="black")
draw.line([100, 45, 200, 45], fill="black", width=2)
draw.line([60, 30, 60, 45], fill="black", width=2)

# Vin 输入
draw.text((120, 35), "Vin", fill="blue")

draw.text((5, 310), "Test 8: NPN Transistor Amplifier (R1=10k, R2=1k, C1=10μF, NPN Q1)", fill="black")
img.save("benchmark/08_schematic.png")
print("✅ 08_schematic.png — 电路原理图")

# ============ 09. Simulink 模块图 ============
img = Image.new("RGB", (700, 350), (240, 240, 245))
draw = ImageDraw.Draw(img)

# 输入信号 Sine Wave
draw.rectangle([20, 120, 130, 200], fill=(200, 220, 255), outline="blue", width=2)
draw.text((35, 150), "Sine Wave", fill="blue")
draw.text((35, 170), "f=50Hz", fill="blue")
# 锯齿波
draw.rectangle([20, 40, 130, 110], fill=(200, 255, 220), outline="green", width=2)
draw.text((35, 55), "Sawtooth", fill="green")

# MUX
draw.rectangle([180, 70, 260, 150], fill=(255, 230, 200), outline="orange", width=2)
draw.text((195, 100), "MUX", fill="orange")

# 连线
draw.line([130, 80, 180, 100], fill="black", width=2)
draw.line([130, 160, 180, 120], fill="black", width=2)

# Gain
draw.rectangle([310, 90, 410, 170], fill=(220, 200, 255), outline="purple", width=2)
draw.text((325, 120), "Gain", fill="purple")
draw.text((330, 140), "K=2.5", fill="purple")
draw.line([260, 110, 310, 110], fill="black", width=2)

# Transfer Fcn
draw.rectangle([460, 90, 560, 170], fill=(255, 220, 220), outline="red", width=2)
draw.text((465, 110), "Transfer", fill="red")
draw.text((470, 130), "Fcn", fill="red")
draw.text((475, 150), "1/(s+1)", fill="red")
draw.line([410, 130, 460, 130], fill="black", width=2)

# Scope
draw.rectangle([610, 100, 680, 180], fill=(200, 200, 200), outline="black", width=2)
draw.text((622, 130), "Scope", fill="black")
draw.line([560, 130, 610, 130], fill="black", width=2)

# Sum 节点 (加法)
draw.ellipse([190, 205, 230, 245], fill=(255, 255, 200), outline="black")
draw.text((205, 220), "+", fill="black")
draw.line([220, 200, 220, 205], fill="black", width=2)
draw.line([220, 155, 220, 205], fill="black", width=2)

# 反馈回路
draw.line([560, 130, 580, 130], fill="black", width=2)
draw.line([580, 130, 580, 225], fill="black", width=2)
draw.line([580, 225, 220, 225], fill="black", width=2)
draw.line([220, 225, 220, 245], fill="black", width=2)

# 反馈中的 Gain2
draw.rectangle([400, 200, 480, 245], fill=(220, 255, 220), outline="green", width=2)
draw.text((410, 215), "Gain2", fill="green")
draw.text((415, 228), "K=0.1", fill="green")

draw.text((5, 5), "Test 9: Simulink Block Diagram (Sine+Saw→MUX→Gain→Transfer Fcn→Scope, feedback loop)", fill="black")
img.save("benchmark/09_simulink.png")
print("✅ 09_simulink.png — Simulink模块图")

# ============ 10. PCB布局图 (Printed Circuit Board) ============
img = Image.new("RGB", (500, 400), (15, 40, 15))  # 深绿PCB
draw = ImageDraw.Draw(img)

# 主芯片 IC1 (中心)
draw.rectangle([180, 140, 320, 260], fill=(30, 30, 30), outline=(180, 180, 180), width=2)
draw.text((215, 190), "IC1", fill=(180, 180, 180))
draw.text((210, 210), "STM32", fill=(180, 180, 180))

# IC 引脚
for x in [190, 210, 230, 250, 270, 290, 310]:
    draw.rectangle([x, 125, x+8, 140], fill=(180, 180, 100))
    draw.rectangle([x, 260, x+8, 275], fill=(180, 180, 100))
for y in [150, 170, 190, 210, 230, 250]:
    draw.rectangle([165, y, 180, y+8], fill=(180, 180, 100))
    draw.rectangle([320, y, 335, y+8], fill=(180, 180, 100))

# 电阻 R1-R4
res_pos = [(60, 90), (60, 290), (420, 120), (420, 270)]
for i, (rx, ry) in enumerate(res_pos):
    draw.rectangle([rx, ry, rx+20, ry+40], fill=(120, 80, 50), outline=(200, 180, 100), width=1)
    draw.text((rx+2, ry+12), f"R{i+1}", fill=(200, 180, 100))

# 电容 C1-C2
cap_pos = [(80, 170), (80, 210), (400, 170), (400, 210)]
for i, (cx, cy) in enumerate(cap_pos):
    draw.ellipse([cx, cy, cx+25, cy+25], fill=(80, 100, 80), outline=(180, 200, 180), width=1)
    draw.text((cx+3, cy+7), f"C{i+1}", fill=(180, 200, 180))

# 连线 (traces)
trace_color = (200, 180, 100)
traces = [
    (80, 110, 190, 140),
    (80, 190, 190, 160),
    (80, 230, 190, 240),
    (310, 160, 420, 110),
    (310, 240, 420, 290),
    (80, 290, 190, 260),
    (310, 200, 420, 200),
]
for x1, y1, x2, y2 in traces:
    draw.line([x1, y1, x2, y2], fill=trace_color, width=2)

# 接插件 J1
draw.rectangle([30, 80, 50, 320], fill=(100, 100, 100), outline="white", width=1)
draw.text((10, 340), "J1", fill="white")
draw.line([50, 100, 60, 100], fill=trace_color, width=2)
draw.line([50, 200, 60, 200], fill=trace_color, width=2)
draw.line([50, 300, 60, 300], fill=trace_color, width=2)

# 接插件 J2
draw.rectangle([450, 80, 470, 320], fill=(100, 100, 100), outline="white", width=1)
draw.text((458, 340), "J2", fill="white")
draw.line([420, 120, 450, 120], fill=trace_color, width=2)
draw.line([420, 200, 450, 200], fill=trace_color, width=2)
draw.line([420, 280, 450, 280], fill=trace_color, width=2)

# 过孔 (vias)
for vx, vy in [(60, 100), (60, 200), (60, 300), (440, 120), (440, 200), (440, 280)]:
    draw.ellipse([vx-4, vy-4, vx+4, vy+4], fill=(180, 180, 100))

draw.text((5, 5), "Test 10: PCB Layout (STM32 IC1, R1-R4, C1-C4, J1-J2)", fill=(0, 255, 0))
img.save("benchmark/10_pcb.png")
print("✅ 10_pcb.png — PCB布局图")

# ============ 11. 逻辑门电路 (Logic Gates) ============
img = Image.new("RGB", (650, 250), "white")
draw = ImageDraw.Draw(img)

# AND gate
draw.rectangle([60, 80, 140, 160], fill=(240, 240, 255), outline="black", width=2)
draw.arc([60, 80, 160, 160], -90, 90, fill="black", width=2)
draw.text((65, 145), "&", fill="black")
draw.text((65, 60), "A", fill="black")
draw.text((30, 115), "B", fill="black")
draw.line([30, 95, 60, 95], fill="black", width=2)
draw.line([30, 145, 60, 145], fill="black", width=2)
draw.line([140, 120, 200, 120], fill="black", width=2)

# OR gate
draw.rectangle([250, 80, 330, 160], fill=(255, 240, 240), outline="black", width=2)
draw.arc([250, 80, 350, 160], -90, 90, fill="black", width=2)
draw.text((290, 145), "≥1", fill="black")
draw.text((255, 60), "C", fill="black")
draw.text((220, 115), "D", fill="black")
draw.line([220, 95, 250, 95], fill="black", width=2)
draw.line([220, 145, 250, 145], fill="black", width=2)
draw.line([330, 120, 380, 120], fill="black", width=2)

# NOT gate (triangle + circle)
draw.polygon([420, 80, 480, 120, 420, 160], fill=(240, 255, 240), outline="black")
draw.ellipse([480, 110, 500, 130], fill="white", outline="black")
draw.text((410, 60), "E", fill="black")
draw.line([400, 120, 420, 120], fill="black", width=2)
draw.line([500, 120, 530, 120], fill="black", width=2)
draw.text((525, 85), "F = NOT E", fill="black")

# XOR gate
draw.rectangle([530, 80, 610, 160], fill=(255, 255, 240), outline="black", width=2)
draw.arc([530, 80, 630, 160], -90, 90, fill="black", width=2)
draw.arc([520, 80, 620, 160], -90, 90, fill="black", width=2)
draw.text((535, 145), "=1", fill="black")
draw.text((535, 60), "G", fill="black")
draw.text((500, 115), "H", fill="black")
draw.line([500, 95, 530, 95], fill="black", width=2)
draw.line([500, 145, 530, 145], fill="black", width=2)
draw.line([610, 120, 640, 120], fill="black", width=2)

draw.text((5, 5), "Test 11: Logic Gates (AND: A&B, OR: C|D, NOT: ~E, XOR: G^H)", fill="black")
img.save("benchmark/11_gates.png")
print("✅ 11_gates.png — 逻辑门电路")

# ============ 12. Bode图 (频率响应) ============
img = Image.new("RGB", (550, 350), "white")
draw = ImageDraw.Draw(img)

# 坐标轴
draw.line([50, 280, 520, 280], fill="black", width=2)  # x轴
draw.line([50, 50, 50, 280], fill="black", width=2)    # y轴

# 网格线 (虚线)
for y in range(80, 281, 40):
    for x in range(50, 521, 10):
        draw.point((x, y), fill=(200, 200, 200))

# X轴刻度
for i, label in enumerate(["10⁻¹", "10⁰", "10¹", "10²", "10³"]):
    x = 70 + i * 100
    draw.line([x, 275, x, 285], fill="black", width=1)
    draw.text((x-15, 286), label, fill="black")
draw.text((240, 310), "Freq (Hz)", fill="black")

# Y轴刻度
for y, label in [(280, "0"), (240, "-20"), (200, "-40"), (160, "-60"), (120, "-80")]:
    draw.line([45, y, 55, y], fill="black", width=1)
    draw.text((25, y-8), label, fill="black")
draw.text((10, 20), "Gain (dB)", fill="black")

# Bode曲线 (幅频)
curve = [(70, 270), (120, 260), (170, 220), (220, 150), (270, 100), (320, 80), (370, 70), (420, 65), (470, 63)]
for i in range(len(curve)-1):
    draw.line([curve[i], curve[i+1]], fill="blue", width=3)

# 转折频率标注
draw.line([170, 280, 170, 220], fill="red", width=1)
draw.text((155, 285), "fc=10Hz", fill="red")

# -3dB线
draw.line([50, 232, 470, 232], fill=(255, 100, 100), width=1)
draw.text((475, 228), "-3dB", fill="red")

# 标题
draw.text((5, 5), "Test 12: Bode Plot (Low-pass filter, fc=10Hz, -20dB/dec)", fill="black")
img.save("benchmark/12_bode.png")
print("✅ 12_bode.png — Bode图")

print("\n🎯 共生成 6 张工科测试图片（07~12）")
