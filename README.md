# Reasonix Vision — DeepSeek + Reasonix 视觉识别方案

将视觉识别能力注入 [Reasonix Code](https://reasonix.ai)（基于 DeepSeek）的完整方案。支持**火山引擎豆包**和**阿里云千问**双平台，自动智能选模，覆盖**动漫角色/名人识别、工科图表、场景理解、OCR**等场景。

## ✨ 特性

- 🎌 **动漫角色识别** — 豆包独家优势，准确识别五河士道等角色
- 🧑‍🔬 **名人/地标识别** — 爱因斯坦、马斯克、埃菲尔铁塔等
- 🔬 **工科图表识别** — 芯片版图、电路原理图、Bode图、PCB等
- 🌄 **场景理解** — 详细描述图片内容
- 📊 **图表数据提取** — 柱状图等数据可视化
- ⚡ **极速模式** — Doubao fast 模式平均 <2s
- 🔄 **双平台自动容错** — 一个失败自动切换另一个

## 📁 文件结构

```
/
├── vision.js                  # 🏆 主力视觉识别脚本（Node.js）
├── doubao_vision.py           # 🐍 备用视觉识别脚本（Python）
├── .env.example               # API Key 配置模板
├── .reasonix/
│   └── skills/
│       └── doubao-vision.md   # Reasonix skill 配置
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

你需要至少一个平台的 API Key：

| 平台 | 获取地址 | 免费额度 |
|:----|:--------|:--------|
| 🔥 火山引擎 ARK（豆包） | [console.volcengine.com/ark](https://console.volcengine.com/ark) | 50万 token |
| 💎 阿里云百炼 DashScope（千问） | [bailian.console.aliyun.com](https://bailian.console.aliyun.com/) | 每模型100万 token |

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

# 🖼️ 所有可用模型列表
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

详细报告见 [`benchmark/RESULTS.md`](benchmark/RESULTS.md)

## 🔧 Reasonix Skill 集成

本仓库包含 Reasonix Code 可直接调用的 skill 配置 (`./.reasonix/skills/doubao-vision.md`)。

在 Reasonix 中可直接使用：
```
/run_skill doubao-vision --arguments "识别这张图片"
```

## 📝 关于 API Key

**本仓库中所有硬编码的 API Key 已全部移除。** 你需要通过环境变量或 `.env` 文件自行配置：

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
