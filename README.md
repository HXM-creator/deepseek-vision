# Reasonix Vision — Give Your DeepSeek Eyes 👁️

A complete visual recognition toolkit that plugs into [Reasonix Code](https://reasonix.ai) (powered by DeepSeek). Supports **Volcengine Doubao (ARK)** and **Alibaba Qwen (DashScope)** with automatic model selection, covering **anime character recognition, celebrity & landmark identification, engineering diagrams, scene understanding, and OCR**.

> **Think of it as giving your AI eyes.** Point it at an image and it tells you what it sees — from anime waifus to circuit schematics, from Einstein to the Eiffel Tower.

## ✨ Features

- 🎌 **Anime Character Recognition** — Doubao exclusive advantage (correctly identifies characters like Shido Itsuka while Qwen fails)
- 🧑‍🔬 **Celebrity & Landmark Recognition** — Einstein, Elon Musk, Jack Ma, Eiffel Tower, Golden Gate Bridge
- 🔬 **Engineering Diagram Analysis** — Chip layouts, circuit schematics, Bode plots, PCBs
- 🌄 **Scene Understanding** — Detailed image description
- 📊 **Chart Data Extraction** — Bar charts, plots, and data visualization
- ⚡ **Turbo Mode** — Doubao fast mode averages <2s per image
- 🔄 **Dual-Platform Auto-Failover** — One fails, the other takes over
- 💰 **Zero Cost Option** — Both platforms offer generous free tiers

## 📁 Project Structure

```
/
├── vision.js                  # 🏆 Main vision script (Node.js, dual-platform)
├── doubao_vision.py           # 🐍 Backup script (Python, Doubao only)
├── .env.example               # API key configuration template
├── .reasonix/
│   └── skills/
│       └── doubao-vision.md   # Reasonix skill integration
├── benchmark/
│   ├── gen_test.py            # Basic shape test image generator
│   ├── gen_eng.py             # Engineering test image generator
│   ├── gen_char.py            # Character/portrait test image generator
│   ├── gen_famous.py          # Celebrity/landmark test image generator
│   └── RESULTS.md             # 🏆 Full benchmark report (28 synthetic images)
└── benchmark_real/
    └── README.md              # Real photo test results
```

## 🚀 Quick Start

### 1. Prerequisites

- **Node.js 18+** (for `vision.js`)
- **Python 3** (for `doubao_vision.py`, optional)

### 2. Get Your API Keys

You need at least one platform's API key (both recommended for auto-failover).

#### 🔥 Volcengine ARK (Doubao)

1. Sign up at [Volcengine ARK Console](https://console.volcengine.com/ark)
2. Go to "ARK Inference" → Create an API key (starts with `ark-`)
3. (Optional) Enable models: "Model Inference" → "Enable Models" → search and enable:
   - `doubao-seed-1-6-vision-250815` ⭐
   - `doubao-seed-1-6-flash-250615`
   - `doubao-1-5-vision-pro-32k-250115`
4. Free tier: **50K shared tokens** across all models

#### 💎 Alibaba Cloud DashScope (Qwen)

1. Sign up at [Alibaba Cloud Bailian](https://bailian.console.aliyun.com/)
2. Go to "Model Plaza" → "API Key Management" → Create API key
3. Go to "Model Activation" → search and enable these **free vision models**:
   - `qwen3-vl-plus` ⭐ — **Daily driver, free**
   - `qwen-vl-plus` / `qwen-vl-plus-latest` — Fast, free
   - `qwen-vl-max` — High quality, free
   - `qwen-vl-ocr-latest` — OCR specialist, free
   - `qwen3-vl-32b-thinking` — Deep reasoning, free
   - `qwen3-vl-235b-a22b-thinking` — Best quality, free
4. Free tier: **1M tokens per model** (individually counted, expires 2026/08/25)

> 💡 Qwen has more free models with independent quotas — recommended as your primary platform.

### 3. Set Environment Variables

```bash
# Windows CMD
set ARK_API_KEY=ark-your-key-here
set DASHSCOPE_API_KEY=sk-your-key-here

# Or copy .env.example and fill in your keys
```

### 4. Use It

```bash
# 🎌 Anime character ID → Doubao (recommended!)
node vision.js anime.jpg "Who is this?" --provider ark

# 🌄 Detailed scene description → Qwen
node vision.js scene.jpg "Describe this in detail" --free

# ⚡ Quick general ID → Doubao turbo
node vision.js photo.jpg "What is this?" --provider ark --mode fast

# 📋 List all available models
node vision.js --list

# 🐍 Python version (Doubao only)
python doubao_vision.py photo.jpg "What is this?"
```

## 📋 Free Vision Model Reference

### Doubao (ARK, 50K shared tokens)

| Model | Quality | Speed | Notes |
|:----|:------:|:----:|:------|
| `doubao-seed-1-6-vision-250815` | ⭐⭐⭐ | 🐢 | Best quality, deep reasoning |
| `doubao-seed-1-6-flash-250615` | ⭐⭐⭐ | ⚡ | Fast + reasoning, **best balance** |
| `doubao-1-5-vision-pro-32k-250115` | ⭐⭐ | ⚡⚡ | Cheapest tokens, fast |

### Qwen (DashScope, 1M tokens per model, individually counted)

| Model | Quality | Speed | Notes |
|:----|:------:|:----:|:------|
| `qwen3-vl-plus` | ⭐⭐⭐ | ⚡⚡ | **Daily driver**, balanced |
| `qwen-vl-plus` | ⭐⭐ | ⚡⚡⚡ | Fastest, cheapest tokens |
| `qwen-vl-max` | ⭐⭐⭐ | 🐢 | High quality, detailed analysis |
| `qwen3-vl-32b-thinking` | ⭐⭐⭐ | 🐢 | Deep reasoning with thinking chain |
| `qwen3-vl-235b-a22b-thinking` | ⭐⭐⭐⭐ | 🐌 | **Best quality**, extreme analysis |
| `qwen-vl-ocr-latest` | ⭐⭐⭐ | ⚡ | OCR text extraction specialist |
| `qwen3-vl-flash` | ⭐⭐ | ⚡⚡ | Lightweight, fast |

> Full list: `node vision.js --list`

## 🏆 Model Selection Guide

Based on cross-validation tests across **28 synthetic images + 10 real photos**:

| Scenario | 🥇 Recommendation | Why |
|:--------|:----------------|:----|
| 🎌 **Anime Character Name** | `--provider ark` | Qwen failed every time, only Doubao got it right |
| 🧑‍🔬 **Celebrity Recognition** | Any (Doubao 10x faster) | 100% accuracy across the board |
| 🗼 **Landmarks (especially Golden Gate)** | `--provider ark` | Only Doubao correctly identified Golden Gate Bridge |
| 🎨 **Feature Description (hair/eyes/etc)** | Any | ~100% accuracy across the board |
| 🔬 **Chip/PCB/Bode Plots** | Any | 100% accuracy |
| ⚡ **Circuit Schematics** | `--free` (Qwen) | More accurate parameter reading |
| 🌄 **Detailed Scene Description** | `--free` | Qwen gives richer, more detailed descriptions |
| ⚡ **Quick General Purpose** | `--provider ark --mode fast` | Fastest, cheapest tokens |
| 🔣 **Logic Gates / Simulink** | All weak (needs human review) | |

## 📊 Benchmark Summary

| Metric | Qwen (DashScope) | Doubao (ARK) |
|:------|:--------------:|:-----------:|
| Avg latency | 1.3~29.6s | **0.9~7.7s** ⚡ |
| Avg tokens | 238~1473 | **208~476** 🏆 |
| Anime ID accuracy | ❌ 0% | ✅ **100%** |
| Feature description | 🟢 ~100% | 🟢 ~100% |
| Engineering diagrams | 🟢 ~83% | 🟡 ~67% |
| Celebrity/Landmark | 🟢 100% | 🟢 **100%** |

Full report: [`benchmark/RESULTS.md`](benchmark/RESULTS.md)

## 🔧 Reasonix Skill Integration

This repo includes a skill config (`./.reasonix/skills/doubao-vision.md`) for direct use within Reasonix Code.

In Reasonix, just call:
```
/run_skill doubao-vision --arguments "Identify this image"
```

## 🔑 About API Keys

**All hardcoded API keys have been removed from this repository.** You need to configure them via environment variables:

- `ARK_API_KEY` — Volcengine Doubao API key
- `DASHSCOPE_API_KEY` — Alibaba Cloud Qwen API key

## 🧪 Run Your Own Benchmarks

```bash
# Generate 28 synthetic test images
python benchmark/gen_test.py
python benchmark/gen_eng.py
python benchmark/gen_char.py
python benchmark/gen_famous.py

# Run tests
node vision.js benchmark/01_counting.png "Describe" --free
node vision.js benchmark/01_counting.png "Describe" --provider ark
```

## 🗺️ Roadmap

- [ ] More real photo tests (celebrities, influencers, microscopes)
- [ ] Video frame analysis
- [ ] Local vision model support (Ollama)

## 📄 License

MIT

---

**Reasonix Vision — Because your DeepSeek deserves eyes.** 👁️
