<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Python-3-3776AB?logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/License-MIT-orange" alt="License">
  <img src="https://img.shields.io/badge/DeepSeek-Reasonix-8B5CF6" alt="DeepSeek Reasonix">
  <img src="https://img.shields.io/badge/Doubao-ARK-FF6B35" alt="Doubao ARK">
  <img src="https://img.shields.io/badge/Qwen-DashScope-00A3FF" alt="Qwen DashScope">
</p>

<h1 align="center">
  👁️ Reasonix Vision
</h1>

<p align="center">
  <b>给你的 DeepSeek 装上眼睛</b><br>
  <i>让 Reasonix Code 看得见图片 — 支持豆包 + 千问 双平台</i>
</p>

<p align="center">
  <a href="#-特性">特性</a> •
  <a href="#-快速开始">快速开始</a> •
  <a href="#-模型选择指南">模型指南</a> •
  <a href="#-api-key-获取">API Key</a> •
  <a href="#-基准测试">基准测试</a> •
  <a href="README_EN.md">🌐 English</a>
</p>

---

## ✨ 特性

| 能力 | 说明 |
|:----|:----|
| 🎌 **动漫角色识别** | 豆包独家优势 — 正确识别五河士道，千问全错 |
| 🧑‍🔬 **名人识别** | 爱因斯坦、马斯克、马云 — 全部 100% |
| 🗼 **建筑地标** | 埃菲尔铁塔、金门大桥(仅豆包✅)、长城、歌剧院 |
| 🔬 **工科图表** | 芯片版图、电路原理图、Bode图、PCB布局 |
| 🌄 **场景理解** | 详细描述图片内容，识别物体/颜色/表情 |
| 📊 **图表提取** | 柱状图数据、曲线图趋势、逻辑门分析 |
| ⚡ **极速模式** | Doubao fast 平均 <2 秒/张 |
| 🔄 **双平台容错** | 一个失败自动切换另一个 |
| 💰 **完全免费** | 两大平台均有慷慨免费额度 |

## 📁 文件结构

```
reasonix-vision/
│
├── 🏆 vision.js                  # 主力视觉脚本（Node.js，双平台）
├── 🐍 doubao_vision.py           # 备用脚本（Python，仅豆包）
│
├── 🔑 .env.example               # API Key 配置模板
├── 📄 LICENSE                    # MIT 许可证
│
├── ⚡ .reasonix/
│   └── skills/
│       └── doubao-vision.md      # Reasonix skill 配置
│
├── 🧪 benchmark/
│   ├── gen_test.py               # 基础图形测试生成
│   ├── gen_eng.py                # 工科测试图生成
│   ├── gen_char.py               # 角色/人物测试图生成
│   ├── gen_famous.py             # 名人/建筑测试图生成
│   └── RESULTS.md                # 28图完整基准报告
│
└── 📸 benchmark_real/
    └── README.md                 # 真实照片测试结果
```

## 🎬 实机演示

> 以下输出均为**真实运行结果**，未经修改

### 🎌 场景一：动漫角色识别（豆包）

```bash
node vision.js anime.jpg "这是谁？" --provider ark
```

```
🔥 火山引擎 ARK | doubao-seed-1-6-flash-250615
📝 模式: auto→balanced | 488KB
──────────────────────────────────────────────────
📋 回答:

这是《约会大作战》（Date A Live）中的角色五河士道。
──────────────────────────────────────────────────
📊 Token: 672 tok  ⏱️  耗时: 1.6s
```

> 💡 同一张图，千问三次全部识别错误。**动漫识别只能用豆包。**

### 📈 场景二：工科图表识别（千问）

```bash
node vision.js bode_plot.png "这是什么图？" --free --mode fast
```

```
💎 阿里云百炼 | qwen-vl-plus
📝 模式: fast | 8KB
──────────────────────────────────────────────────
📋 回答:

这张图是一个 Bode 图，具体是一个低通滤波器的增益频率响应图。
截止频率 fc = 10 Hz，滚降率 -20 dB/decade...
──────────────────────────────────────────────────
📊 Token: 941 tok  ⏱️  耗时: 6.7s
```

### ⚡ 场景三：快速通识（豆包极速）

```bash
node vision.js scene.png "一句话描述" --provider ark --mode fast
```

```
🔥 火山引擎 ARK | doubao-1-5-vision-pro-32k-250115
📝 模式: fast | 4KB
──────────────────────────────────────────────────
📋 回答:

一幅简洁的卡通画，呈现了红顶棕房、绿树，以及蓝天白云和太阳下的绿草地景象。
──────────────────────────────────────────────────
📊 Token: 268 tok  ⏱️  耗时: 1.5s
```

---

## 🚀 快速开始

### 1️⃣ 前提条件

```
Node.js 18+   ← vision.js 需要
Python 3      ← doubao_vision.py 需要（可选）
```

### 2️⃣ 获取 API Key

<details>
<summary><b>🔥 火山引擎 ARK（豆包）— 展开</b></summary>

1. 注册 [火山引擎](https://console.volcengine.com/ark) 并登录
2. 「ARK 推理」→ 创建 API Key（以 `ark-` 开头）
3. 「模型推理」→「开通模型」→ 搜索开通以下**免费**模型：
   - `doubao-seed-1-6-vision-250815` ⭐
   - `doubao-seed-1-6-flash-250615`
   - `doubao-1-5-vision-pro-32k-250115`
4. 💰 免费额度：所有模型**共享 50 万 token**
</details>

<details>
<summary><b>💎 阿里云百炼 DashScope（千问）— 展开</b></summary>

1. 注册 [阿里云百炼](https://bailian.console.aliyun.com/) 并登录
2. 「模型广场」→「API Key 管理」→ 创建 API Key
3. 「模型开通」→ 搜索开通以下**免费**模型：
   - `qwen3-vl-plus` ⭐ 日常首选
   - `qwen-vl-max` 高质量
   - `qwen-vl-ocr-latest` OCR 专用
   - `qwen3-vl-32b-thinking` 深度推理
   - `qwen3-vl-235b-a22b-thinking` 最强模型
4. 💰 免费额度：**每个模型 100 万 token**（独立计算）
</details>

### 3️⃣ 配置环境变量

```bash
# Windows CMD
set ARK_API_KEY=ark-你的key
set DASHSCOPE_API_KEY=sk-你的key
```

### 4️⃣ 开始使用

```bash
# 🎌 动漫角色识别 → 豆包（推荐！）
node vision.js anime.jpg "这是谁？" --provider ark

# 🌄 详细场景描述 → 千问
node vision.js scene.jpg "详细描述" --free

# ⚡ 快速通识 → 豆包 turbo
node vision.js photo.jpg "这是什么？" --provider ark --mode fast

# 📋 查看所有模型
node vision.js --list
```

## 🏆 模型选择指南

基于 **28 张合成图 + 10 张真实照片** 交叉测试：

| 场景 | 🥇 推荐 | 准确率 | 速度 |
|:----|:--------|:-----:|:---:|
| 🎌 **动漫角色·身份** | `--provider ark` | ✅ **100%** | ⚡ 1.7s |
| 🧑‍🔬 **名人识别** | 任意（Doubao 快 10x） | 🟢 100% | ⚡ 1.3s |
| 🗼 **建筑地标** | `--provider ark` | 🟢 100% | ⚡ 2~5s |
| 🎨 **特征描述** | 任意 | 🟢 ~100% | 🟡 5~11s |
| 🔬 **芯片/PCB/Bode** | 任意 | 🟢 100% | 🟡 5~7s |
| ⚡ **电路原理图** | `--free` | 🟢 100% | 🟡 7s |
| 🌄 **详细描述** | `--free`（Qwen thinking） | 🟢 100% | 🐢 ~30s |
| ⚡ **快速通识** | `--provider ark --mode fast` | 🟢 通用 | ⚡ **<2s** |
| 🔣 **逻辑门/Simulink** | ⚠️ 需人工核对 | 🟡 | — |

## 📊 基准测试摘要

| 指标 | Qwen（千问） | Doubao（豆包） |
|:----|:----------:|:------------:|
| ⏱ 平均耗时 | 1.3~29.6s | **0.9~7.7s** ⚡ |
| 📝 平均 token | 238~1473 | **208~476** 🏆 |
| 🎌 动漫身份识别 | ❌ 0% | ✅ **100%** |
| 🎨 特征描述 | 🟢 ~100% | 🟢 ~100% |
| 🔬 工科图表 | 🟢 ~83% | 🟡 ~67% |
| 🧑‍🔬 名人/地标 | 🟢 100% | 🟢 **100%** |

> 详细报告 → [`benchmark/RESULTS.md`](benchmark/RESULTS.md)

## 🔧 Reasonix Skill 集成

本仓库包含 Reasonix Code 可直接调用的 skill：

```
/run_skill doubao-vision --arguments "识别这张图片"
```

Skill 配置见 → `.reasonix/skills/doubao-vision.md`

## 🔑 关于 API Key

**本仓库中所有硬编码的 API Key 均已移除。** 通过环境变量配置：

| 变量 | 平台 |
|:----|:----|
| `ARK_API_KEY` | 火山引擎豆包 |
| `DASHSCOPE_API_KEY` | 阿里云千问 |

## 🧪 自行运行基准测试

```bash
# 生成 28 张测试图
python benchmark/gen_test.py
python benchmark/gen_eng.py
python benchmark/gen_char.py
python benchmark/gen_famous.py

# 双平台对比测试
node vision.js benchmark/01_counting.png "描述" --free
node vision.js benchmark/01_counting.png "描述" --provider ark
```

## 📄 License

MIT

---

<p align="center">
  <b>Reasonix Vision — 让你的 DeepSeek 拥有眼睛</b><br>
  <a href="README_EN.md">🌐 English Version</a>
</p>
