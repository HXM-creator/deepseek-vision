<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Python-3-3776AB?logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/License-MIT-orange" alt="License">
  <img src="https://img.shields.io/badge/DeepSeek-Vision-8B5CF6" alt="DeepSeek Vision">
  <img src="https://img.shields.io/badge/Doubao-ARK-FF6B35" alt="Doubao ARK">
  <img src="https://img.shields.io/badge/Qwen-DashScope-00A3FF" alt="Qwen DashScope">
</p>

<h1 align="center">
  👁️ DeepSeek Vision
</h1>

<p align="center">
  <b>给你的 DeepSeek 装上眼睛</b><br>
  <i>双平台视觉识别 + 文本模型事实核查 &mdash; 看图识字，文本纠错</i>
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
| 🎌 **动漫角色识别** | 豆包准确率明显优于千问（实测对比） |
| 🧑‍🔬 **名人/地标识别** | 双平台均能准确识别常见名人和地标 |
| 🗼 **建筑地标** | 金门大桥等建筑地标识别豆包更稳定 |
| 🔬 **工科图表** | 芯片版图、电路原理图、Bode图、PCB布局 |
| 🌄 **场景理解** | 详细描述图片内容，识别物体/颜色/表情 |
| 📊 **图表提取** | 柱状图数据、曲线图趋势、逻辑门分析 |
| 🧠 **文本事实核查** | 视觉识别后自动用文本模型核对事实，纠正人名/地名/参数错误 — 解决AI一本正经胡说八道的问题 |
| 🎯 **场景预设 `--task`** | 动漫/工科/OCR/简单物体/场景，一键切换最佳配置 |
| 👁️ **双重验证 `--verify`** | 交叉视觉+文本核查，自动发现看走眼和记错名 |
| 💬 **交互模式 `--interactive`** | 不退出程序，连续追问同一张图，省token |
| 📊 **用量追踪 `--budget`** | 自动记录每次调用，掌握token消耗 |
| 📝 **Markdown 输出 `--format`** | 结构化输出，方便嵌入文档和笔记 |
| ⚡ **极速模式** | Doubao fast 平均 <2 秒/张 |
| 🌐 **URL 图片** | 直接传网址自动下载分析 |

## 📁 文件结构

```
deepseek-vision/
│
├── 🏆 vision.js                  # 主力视觉脚本（Node.js，双平台）
├── 🐍 doubao_vision.py           # [已弃用] 备用脚本（Python，仅豆包→ 推荐 vision.js）
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

> 💡 同一张图交叉验证，豆包识别结果准确。具体场景建议根据实测选择模型。

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

# Mac / Linux
export ARK_API_KEY=ark-你的key
export DASHSCOPE_API_KEY=sk-你的key
```

### 4️⃣ 一键部署（给 AI 用的）

把你的 API Key 给任何 AI，它就能直接部署：

```bash
git clone https://github.com/HXM-creator/deepseek-vision.git
cd deepseek-vision
export ARK_API_KEY=ark-你的key
export DASHSCOPE_API_KEY=sk-你的key
node vision.js 图片.jpg "这是什么？"
```

### 5️⃣ 开始使用

```bash
# 🎌 动漫角色识别 → 豆包（推荐！）
node vision.js anime.jpg "这是谁？" --provider ark

# 🌄 详细场景描述 → 千问
node vision.js scene.jpg "详细描述" --free

# ⚡ 快速通识 → 豆包 turbo
node vision.js photo.jpg "这是什么？" --provider ark --mode fast

# 📋 查看所有模型
node vision.js --list

# 🎌 场景预设（自动配置最佳参数）
node vision.js anime.jpg "这是谁？" --task anime

# 🔬 工科图表分析
node vision.js circuit.png "分析" --task engineering

# 🖼️ 简单物体识别（最快最省）
node vision.js cat.jpg "这是什么猫？" --task simple

# 📝 文字提取
node vision.js doc.jpg "提取文字" --task ocr

# 🌄 详细场景描述
node vision.js scene.jpg "描述" --task scene

# 🔍 结构化 Markdown 输出
node vision.js photo.jpg "分析" --format markdown

# 💬 交互式追问（不退出，连续提问同一张图）
node vision.js photo.jpg "这是谁？" --interactive

# 📊 查看用量统计
node vision.js --budget
```

## 🔍 双重验证 `--verify`

视觉模型会犯两类错误：**看走眼**（金门大桥看成海湾大桥）和**记错名**（Giselle 叫成金旼炡）。`--verify` 模式用两层验证来捕捉这两类错误：

### 验证流程

```
🖼️ 主视觉 → 输出文本
      ↓
🔍 交叉视觉 → 另一平台再识别一次 → 比对差异 → 发现"看走眼"
      ↓
📖 文本核查 → 检查文本中的事实错误 → 发现"记错名"
      ↓
📋 综合报告
```

### 智能自动触发

`--verify` 会根据你的问题**自动判断是否需要验证**：

| 你说 | 行为 |
|:----|:----|
| "这是谁？""什么角色？" | ✅ 自动触发验证（需要精确命名） |
| "提取文字""读图" | ❌ 跳过（纯 OCR，不需要验证） |
| "这是什么猫？""是狗吗？" | ❌ 跳过（简单物体，一个答案） |
| "描述这个场景" | ❌ 跳过（纯描述，无事实可查） |
| "这是什么芯片？参数多少？" | ✅ 自动触发（参数值容易错） |

想要手动控制：

```bash
# 不需要验证时跳过
node vision.js image.jpg "这是谁？" --provider ark --no-verify

# 简单物体也想验证
node vision.js image.jpg "这是什么猫？" --provider ark --verify
```

### 开销

| 模式 | API 调用 | 额外耗时 | 额外 token | 触发条件 |
|:----|:-------:|:-------:|:---------:|:--------|
| 普通 | 1 次 | 基准 | 基准 | OCR、简单物体、场景描述 |
| `--verify` | 最多 +2 次 | **+3~10s** | **+400~1200** | 问"谁/什么角色/参数"时自动开 |

### 示例效果

```bash
# 不加验证（快速）
node vision.js bridge.jpg "这是什么桥？" --free
→ Qwen: "旧金山-奥克兰海湾大桥"（3s）

# 加验证（双重验证纠错）
node vision.js bridge.jpg "这是什么桥？" --free --verify
→ Qwen: "旧金山-奥克兰海湾大桥"
→ 🔍 豆包交叉: "Golden Gate Bridge" ⚠️ 存在不一致
   ├ 主模型独有: 海湾大桥, Oakland Bay...
   └ 验证模型独有: Golden Gate Bridge ✅
→ 📖 文本核查: 确认无误（输出文本本身无事实错误）
→ 结论：豆包识别正确，这是金门大桥
```

验证结果在 JSON 模式下会输出 `verification` 字段：
```json
{
  "verification": {
    "method": "cross-vision + fact-check",
    "cross_vision": {
      "model": "doubao-seed-1-6-flash-250615",
      "provider": "ark",
      "match": false,
      "discrepancies": {
        "primary_only": ["海湾大桥", "Oakland Bay"],
        "cross_only": ["Golden Gate Bridge"]
      }
    },
    "fact_check": {
      "model": "doubao-seed-1-6-flash-250615",
      "provider": "ark",
      "has_corrections": false,
      "report": "确认无误"
    }
  }
}
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

## 🤖 MCP 协议接入

本项目提供标准 MCP 服务器，可接入任何支持 MCP 协议的客户端（如 Claude Desktop、Claude Code 等）。

### 配置方式

在 MCP 客户端配置中添加：

```json
{
  "mcpServers": {
    "deepseek-vision": {
      "command": "node",
      "args": ["你的路径/mcp-vision-server.js"]
    }
  }
}
```

### 可用工具

| 工具 | 说明 |
|:----|:----|
| `vision_analyze` | 分析图片（支持指定 provider/mode） |
| `vision_list_models` | 查看所有可用模型 |

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
  <b>DeepSeek Vision — 给你的 DeepSeek 装上眼睛</b><br>
  <a href="README_EN.md">🌐 English Version</a>
</p>
