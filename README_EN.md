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
  <b>Give Your DeepSeek Eyes</b><br>
  <i>Vision toolkit with Doubao + Qwen dual-platform support</i>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-model-selection-guide">Model Guide</a> •
  <a href="#-getting-api-keys">API Keys</a> •
  <a href="#-benchmark">Benchmark</a> •
  <a href="README.md">🌐 中文</a>
</p>

---

## ✨ Features

| Capability | Description |
|:----------|:------------|
| 🎌 **Anime Character ID** | Doubao significantly outperforms Qwen (verified by benchmarks) |
| 🧑‍🔬 **Celebrity & Landmark** | Both platforms accurately identify common celebrities and landmarks |
| 🗼 **Landmark Recognition** | Doubao more reliable for landmarks like Golden Gate Bridge |
| 🔬 **Engineering Diagrams** | Chip layouts, circuit schematics, Bode plots, PCB layouts |
| 🌄 **Scene Understanding** | Detailed image descriptions, object/color/expression detection |
| 📊 **Chart Extraction** | Bar chart data, curve trends, logic gate analysis |
| ⚡ **Turbo Mode** | Doubao fast averages <2s per image |
| 🔄 **Dual-Platform Failover** | One fails, the other auto-takes over |
| 💰 **Fully Free** | Both platforms offer generous free tiers |

## 📁 Project Structure

```
deepseek-vision/
│
├── 🏆 vision.js                  # Main vision script (Node.js, dual-platform)
├── 🐍 doubao_vision.py           # Backup script (Python, Doubao only)
│
├── 🔑 .env.example               # API key template
├── 📄 LICENSE                    # MIT License
│
├── ⚡ .reasonix/
│   └── skills/
│       └── doubao-vision.md      # Reasonix skill config
│
├── 🧪 benchmark/
│   ├── gen_test.py               # Basic shape test generator
│   ├── gen_eng.py                # Engineering test generator
│   ├── gen_char.py               # Character/portrait test generator
│   ├── gen_famous.py             # Celebrity/landmark test generator
│   └── RESULTS.md                # Full 28-image benchmark report
│
└── 📸 benchmark_real/
    └── README.md                 # Real photo test results
```

## 🎬 Live Demo

> All outputs below are **real results** from actual runs

### 🎌 Demo 1: Anime Character ID (Doubao)

```bash
node vision.js anime.jpg "Who is this?" --provider ark
```

```
🔥 Volcengine ARK | doubao-seed-1-6-flash-250615
📝 Mode: auto→balanced | 488KB
──────────────────────────────────────────────────
📋 Answer:

This is Shido Itsuka from Date A Live.
──────────────────────────────────────────────────
📊 Token: 672  ⏱️  Time: 1.6s
```

> 💡 Cross-validation shows Doubao is more reliable for anime character recognition.

### 📈 Demo 2: Engineering Chart (Qwen)

```bash
node vision.js bode_plot.png "What is this?" --free --mode fast
```

```
💎 Alibaba DashScope | qwen-vl-plus
📝 Mode: fast | 8KB
──────────────────────────────────────────────────
📋 Answer:

This is a Bode plot of a low-pass filter.
Cutoff frequency fc = 10 Hz, roll-off -20 dB/decade...
──────────────────────────────────────────────────
📊 Token: 941  ⏱️  Time: 6.7s
```

### ⚡ Demo 3: Quick Scene Understanding (Doubao Turbo)

```bash
node vision.js scene.png "Describe in one sentence" --provider ark --mode fast
```

```
🔥 Volcengine ARK | doubao-1-5-vision-pro-32k-250115
📝 Mode: fast | 4KB
──────────────────────────────────────────────────
📋 Answer:

A simple cartoon showing a red-roofed brown house, a green tree,
blue sky with white clouds, and a sun over green grass.
──────────────────────────────────────────────────
📊 Token: 268  ⏱️  Time: 1.5s
```

---

## 🚀 Quick Start

### 1️⃣ Prerequisites

```
Node.js 18+   ← for vision.js
Python 3      ← for doubao_vision.py (optional)
```

### 2️⃣ Getting API Keys

<details>
<summary><b>🔥 Volcengine ARK (Doubao) — Expand</b></summary>

1. Sign up at [Volcengine ARK Console](https://console.volcengine.com/ark)
2. "ARK Inference" → Create API Key (starts with `ark-`)
3. "Model Inference" → "Enable Models" → search & enable:
   - `doubao-seed-1-6-vision-250815` ⭐
   - `doubao-seed-1-6-flash-250615`
   - `doubao-1-5-vision-pro-32k-250115`
4. 💰 Free tier: **50K shared tokens** across all models
</details>

<details>
<summary><b>💎 Alibaba DashScope (Qwen) — Expand</b></summary>

1. Sign up at [Alibaba Cloud Bailian](https://bailian.console.aliyun.com/)
2. "Model Plaza" → "API Key Management" → Create API key
3. "Model Activation" → search & enable:
   - `qwen3-vl-plus` ⭐ Daily driver
   - `qwen-vl-max` High quality
   - `qwen-vl-ocr-latest` OCR specialist
   - `qwen3-vl-32b-thinking` Deep reasoning
   - `qwen3-vl-235b-a22b-thinking` Best quality
4. 💰 Free tier: **1M tokens per model** (individually counted)
</details>

### 3️⃣ Set Environment Variables

```bash
# Windows CMD
set ARK_API_KEY=ark-your-key-here
set DASHSCOPE_API_KEY=sk-your-key-here

# Mac / Linux
export ARK_API_KEY=ark-your-key-here
export DASHSCOPE_API_KEY=sk-your-key-here
```

### 4️⃣ One-Click Deploy (for AI assistants)

Give the URL + your API key to any AI, it can deploy in seconds:

```bash
git clone https://github.com/HXM-creator/deepseek-vision.git
cd deepseek-vision
export ARK_API_KEY=ark-your-key-here
export DASHSCOPE_API_KEY=sk-your-key-here
node vision.js image.jpg "What is this?"
```

### 5️⃣ Start Using

```bash
# 🎌 Anime character ID → Doubao (recommended!)
node vision.js anime.jpg "Who is this?" --provider ark

# 🌄 Detailed scene description → Qwen
node vision.js scene.jpg "Describe in detail" --free

# ⚡ Quick general ID → Doubao turbo
node vision.js photo.jpg "What is this?" --provider ark --mode fast

# 📋 List all available models
node vision.js --list

# 🔍 Cross-platform verification (recommended for precise naming)
node vision.js photo.jpg "Who is this?" --provider ark --verify
```

## 🔍 Verification Mode `--verify`

Use `--verify` when you need precise naming (character names, people, landmarks, values). It automatically calls the opposite platform to cross-check results and flags discrepancies.

### Cost

| Mode | API Calls | Extra Time | Extra Tokens | Best For |
|:----|:---------:|:---------:|:-----------:|:--------|
| Normal | 1 | baseline | baseline | Scene description, features, charts |
| `--verify` | 2 (primary+verify) | **+2~6s** | **+200~600** | Anime chars, people, landmarks, values |

### Example

```bash
# Without verify (fast)
node vision.js anime.jpg "Who is this?" --provider ark
→ Doubao: "Shido Itsuka" (1.5s, 680 tok)

# With verify (more reliable)
node vision.js anime.jpg "Who is this?" --provider ark --verify
→ Doubao: "Shido Itsuka" (1.5s, 680 tok)
→ Qwen verify: "Common anime girl, can't identify" ⚠️ Discrepancy
→ Conclusion: Doubao is correct (confirmed by user)
```

JSON mode outputs a `verification` field:
```json
{
  "verification": {
    "status": "confirmed" | "discrepancy",
    "agreement_ratio": 0.0~1.0,
    "secondary_model": "qwen-vl-plus",
    "primary_only_entities": ["..."],
    "secondary_only_entities": ["..."]
  }
}
```

## 🏆 Model Selection Guide

Based on **28 synthetic images + 10 real photos** cross-validation:

| Scenario | 🥇 Recommendation | Accuracy | Speed |
|:---------|:-----------------|:-------:|:----:|
| 🎌 **Anime Character ID** | `--provider ark` | ✅ **100%** | ⚡ 1.7s |
| 🧑‍🔬 **Celebrity** | Any (Doubao 10x faster) | 🟢 100% | ⚡ 1.3s |
| 🗼 **Landmarks** | `--provider ark` | 🟢 100% | ⚡ 2~5s |
| 🎨 **Feature Description** | Any | 🟢 ~100% | 🟡 5~11s |
| 🔬 **Chip/PCB/Bode** | Any | 🟢 100% | 🟡 5~7s |
| ⚡ **Circuit Schematics** | `--free` | 🟢 100% | 🟡 7s |
| 🌄 **Detailed Description** | `--free` (Qwen thinking) | 🟢 100% | 🐢 ~30s |
| ⚡ **Quick General** | `--provider ark --mode fast` | 🟢 General | ⚡ **<2s** |
| 🔣 **Logic Gates/Simulink** | ⚠️ Needs human review | 🟡 | — |

## 📊 Benchmark Summary

| Metric | Qwen (DashScope) | Doubao (ARK) |
|:-------|:--------------:|:-----------:|
| ⏱ Avg latency | 1.3~29.6s | **0.9~7.7s** ⚡ |
| 📝 Avg tokens | 238~1473 | **208~476** 🏆 |
| 🎌 Anime ID | ❌ 0% | ✅ **100%** |
| 🎨 Feature description | 🟢 ~100% | 🟢 ~100% |
| 🔬 Engineering diagrams | 🟢 ~83% | 🟡 ~67% |
| 🧑‍🔬 Celebrity/Landmark | 🟢 100% | 🟢 **100%** |

> Full report → [`benchmark/RESULTS.md`](benchmark/RESULTS.md)

## 🤖 MCP Protocol Support

This project includes a standard MCP server for any MCP-compatible client (Claude Desktop, Claude Code, etc.).

### Configuration

Add to your MCP client config:

```json
{
  "mcpServers": {
    "deepseek-vision": {
      "command": "node",
      "args": ["/path/to/mcp-vision-server.js"]
    }
  }
}
```

### Available Tools

| Tool | Description |
|:----|:------------|
| `vision_analyze` | Analyze an image (supports provider/mode selection) |
| `vision_list_models` | List all available vision models |

## 🔧 Reasonix Skill Integration

This repo includes a skill config for direct use in Reasonix Code:

```
/run_skill doubao-vision --arguments "Identify this image"
```

Skill config → `.reasonix/skills/doubao-vision.md`

## 🔑 About API Keys

**All hardcoded API keys have been removed.** Configure via environment variables:

| Variable | Platform |
|:---------|:---------|
| `ARK_API_KEY` | Volcengine Doubao |
| `DASHSCOPE_API_KEY` | Alibaba Qwen |

## 🧪 Run Your Own Benchmarks

```bash
# Generate 28 test images
python benchmark/gen_test.py
python benchmark/gen_eng.py
python benchmark/gen_char.py
python benchmark/gen_famous.py

# Cross-platform testing
node vision.js benchmark/01_counting.png "Describe" --free
node vision.js benchmark/01_counting.png "Describe" --provider ark
```

## 📄 License

MIT

---

<p align="center">
  <b>DeepSeek Vision — Give Your DeepSeek Eyes</b><br>
  <a href="README.md">🌐 中文版本</a>
</p>
