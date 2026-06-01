# Reasonix Vision — 给你的 DeepSeek 装上眼睛 👁️

将视觉识别能力注入 [Reasonix Code](https://reasonix.ai)（基于 DeepSeek）的完整方案。支持**火山引擎豆包**和**阿里云千问**双平台，自动智能选模，覆盖**动漫角色/名人识别、工科图表、场景理解、OCR**等场景。

> **给你的 AI 装上眼睛。** 把图片丢给它，它告诉你看到了什么——从动漫角色到电路图，从爱因斯坦到埃菲尔铁塔。

## ✨ 特性

- 🎌 **动漫角色识别** — 豆包独家优势（正确识别五河士道，千问全错）
- 🧑‍🔬 **名人/地标识别** — 爱因斯坦、马斯克、马云、埃菲尔铁塔、金门大桥
- 🔬 **工科图表识别** — 芯片版图、电路原理图、Bode图、PCB
- 🌄 **场景理解** — 详细描述图片内容
- 📊 **图表数据提取** — 柱状图等数据可视化
- ⚡ **极速模式** — Doubao fast 模式平均 <2s
- 🔄 **双平台自动容错** — 一个失败自动切换另一个
- 💰 **零成本可选** — 两个平台都有慷慨的免费额度

## 📁 文件结构

```
/
├── vision.js                  # 🏆 主力视觉识别脚本（Node.js，双平台）
├── doubao_vision.py           # 🐍 备用脚本（Python，仅豆包）
├── .env.example               # API Key 配置模板
├── .reasonix/
│   └── skills/
│       └── doubao-vision.md   # Reasonix skill 集成
├── benchmark/
│   ├── gen_test.py            # 基础图形测试图生成
│   ├── gen_eng.py             # 工科测试图生成
│   ├── gen_char.py            # 角色/人物测试图生成
│   ├── gen_famous.py          # 名人/建筑测试图生成
│   └── RESULTS.md             # 🏆 28张合成图完整基准报告
└── benchmark_real/
    └── README.md              # 真实照片测试结果
```

## 🚀 快速开始

### 1. 前提条件

- **Node.js 18+**（vision.js 用）
- **Python 3**（doubao_vision.py 用，可选）

### 2. 获取 API Key

你需要至少一个平台的 API Key（推荐两个都开通，自动容错）。

#### 🔥 火山引擎 ARK（豆包）

1. 注册 [火山引擎](https://console.volcengine.com/ark) 并登录
2. 在「ARK 推理」中创建 API Key，复制以 `ark-` 开头的 key
3. （可选）开通模型：进入「模型推理」→「开通模型」，搜索并开通以下免费视觉模型：
   - `doubao-seed-1-6-vision-250815` ⭐
   - `doubao-seed-1-6-flash-250615`
   - `doubao-1-5-vision-pro-32k-250115`
4. 免费额度：所有模型**共享 50 万 token**

#### 💎 阿里云百炼 DashScope（千问）

1. 注册 [阿里云百炼](https://bailian.console.aliyun.com/) 并登录
2. 进入「模型广场」→「API Key 管理」→ 创建 API Key
3. 在「模型开通」中搜索并开通以下**免费视觉模型**（每个独立 100 万 token）：
   - `qwen3-vl-plus` ⭐ — **日常首选，免费**
   - `qwen-vl-plus` / `qwen-vl-plus-latest` — 极速免费
   - `qwen-vl-max` — 高质量免费
   - `qwen-vl-ocr-latest` — OCR 专用免费
   - `qwen3-vl-32b-thinking` — 深度推理免费
   - `qwen3-vl-235b-a22b-thinking` — 最强免费
4. 免费额度：**每个模型独立 100 万 token**（到 2026/08/25）

> 💡 千问的免费模型更多且额度独立，建议优先开通。

### 3. 配置环境变量

```bash
# Windows CMD
set ARK_API_KEY=ark-你的key
set DASHSCOPE_API_KEY=sk-你的key

# 或者复制 .env.example 并按说明填写
```

### 4. 使用

```bash
# 🎌 动漫角色识别 → 豆包（推荐！）
node vision.js anime.jpg "这是谁？" --provider ark

# 🌄 详细场景描述 → 千问
node vision.js scene.jpg "详细描述" --free

# ⚡ 快速通识 → 豆包极速
node vision.js photo.jpg "这是什么？" --provider ark --mode fast

# 🖼️ 查看所有可用模型
node vision.js --list

# 🐍 Python 版（仅豆包）
python doubao_vision.py photo.jpg "这是什么？"
```

## 🏆 模型选择指南

基于 28 张合成图 + 10 张真实照片的交叉测试结果：

| 场景 | 🥇 推荐 | 原因 |
|:----|:--------|:----|
| 🎌 **动漫角色·身份（他是谁？）** | `--provider ark` | 千问系列全错，仅豆包正确 |
| 🧑‍🔬 **名人识别** | 任意（Doubao 快 10 倍） | 全部 100% 正确 |
| 🗼 **建筑地标（尤其金门大桥）** | `--provider ark` | 豆包唯一正确识别金门大桥 |
| 🎨 **特征描述（发色/眼睛等）** | 任意 | 全部 ~100% |
| 🔬 **芯片/PCB/Bode 图** | 任意 | 全部 100% |
| ⚡ **电路原理图** | `--free`（Qwen） | 参数读取更准确 |
| 🌄 **详细场景描述** | `--free` | Qwen 描述更丰富详细 |
| ⚡ **快速日常通识** | `--provider ark --mode fast` | 最快最省 token |
| 🔣 **逻辑门/Simulink** | 均偏弱（需人工核对） | |

## 📊 基准测试摘要

| 指标 | Qwen（千问） | Doubao（豆包） |
|:----|:----------:|:------------:|
| 平均耗时 | 1.3~29.6s | **0.9~7.7s** ⚡ |
| 平均 token | 238~1473 | **208~476** 🏆 |
| 动漫身份识别 | ❌ 0% | ✅ **100%** |
| 特征描述 | 🟢 ~100% | 🟢 ~100% |
| 工科图表 | 🟢 ~83% | 🟡 ~67% |
| 名人/地标 | 🟢 100% | 🟢 **100%** |

## 🔧 Reasonix Skill 集成

本仓库包含 Reasonix Code 可直接调用的 skill 配置（`./.reasonix/skills/doubao-vision.md`）。

在 Reasonix 中可直接使用：
```
/run_skill doubao-vision --arguments "识别这张图片"
```

## 🔑 关于 API Key

**本仓库中所有硬编码的 API Key 已全部移除。** 你需要通过环境变量自行配置：

- `ARK_API_KEY` — 火山引擎豆包 API Key
- `DASHSCOPE_API_KEY` — 阿里云千问 API Key

## 🧪 自行运行基准测试

```bash
# 生成 28 张合成测试图
python benchmark/gen_test.py
python benchmark/gen_eng.py
python benchmark/gen_char.py
python benchmark/gen_famous.py

# 跑测试
node vision.js benchmark/01_counting.png "描述" --free
node vision.js benchmark/01_counting.png "描述" --provider ark
```

## 📄 许可证

MIT

---

**Reasonix Vision — 让你的 DeepSeek 拥有眼睛。** 👁️
