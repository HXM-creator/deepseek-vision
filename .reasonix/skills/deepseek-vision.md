---
name: deepseek-vision
description: 视觉识别工具 — 双平台(豆包+千问) + 双重验证 + 场景预设 + 智能讲解
---
## 工具文件

| 文件 | 说明 |
|:----|:----|
| `vision.js` | 🏆 **主力脚本** — 31个模型，全部功能 |
| `mcp-vision-server.js` | 🤖 **MCP 服务器** |

## 快速使用

```bash
set ARK_API_KEY=ark-你的key
set DASHSCOPE_API_KEY=sk-你的key

# 🎌 动漫识别（推荐）
node vision.js photo.jpg "这是谁？" --task anime

# 📖 识别+智能讲解
node vision.js photo.jpg "这是什么？" --task explain

# 💬 交互模式
node vision.js photo.jpg "这是谁？" --interactive

# 📊 用量统计
node vision.js --budget
```

## 场景预设

| 场景 | 命令 | 策略 |
|:----|:----|:------|
| 🎌 动漫 | `--task anime` | 豆包（千问在动漫上识别率0%） |
| 🔬 工科 | `--task engineering` | 千问（工科图表更准） |
| 📖 讲解 | `--task explain` | 识别+智能讲解 |
| ⚡ 极省 | `--task tiny` | 最省token模式 |
| 🖼️ 简单 | `--task simple` | 最快模型，不验证 |
| 📝 OCR | `--task ocr` | OCR专用模型 |
| 🌄 场景 | `--task scene` | 千问深度推理 |

## 模型性能总结（实测数据）

### 🚀 日常首选（快+准+省token）
| 模型 | 速度 | Token | 适合 |
|:----|:---:|:----:|:----|
| qwen3-vl-flash | **0.3s** | **120** | 🥇 日常通识 |
| qwen-vl-plus | 0.4s | 121 | 🥇 极速识别 |
| doubao-1-5-vision-pro-32k-250115 | 1.0s | 155-277 | 🥇 豆包最快 |

### 🏆 准确性优先
| 模型 | 速度 | Token | 适合 |
|:----|:---:|:----:|:----|
| doubao-seed-1-6-flash-250828 | 1.3s | 437 | 🎌 动漫识别（唯一正确） |
| doubao-seed-1-6-vision-250815 | 4.8s | 540 | 🎌 动漫最强 |
| qwen3-vl-32b-thinking | 3.0s | 205 | 🧠 深度推理 |
| qwen3-vl-235b-a22b-thinking | 4.6s | 338 | 🧠 最强推理 |

### 自动特性
- 问"这是谁" → 自动开双重验证（豆包优先）
- 图片>800KB → 自动压缩到1024px
- 每次调用 → 自动记录token

## 模型清单（31个）

### 🔥 豆包 ARK（11个）
doubao-1-5-vision-pro-32k-250115, doubao-seed-1-6-flash-250828,
doubao-seed-1-6-251015, doubao-seed-1-6-vision-250815,
doubao-seed-2-0-mini/pro/lite-260428, doubao-seed-2-0-code-preview-260215,
doubao-seed-1-8-251228, doubao-seed-character-251128,
doubao-seed-code-preview-251028

### 💎 千问 DashScope（20个）
qwen3-vl-flash/plus, qwen-vl-plus, qwen-vl-max,
qwen3-vl-8b/30b/32b/235b-thinking,
qwen3.6-flash/plus, qwen3.7-plus,
qwen-vl-ocr-latest/ocr, qwen3-vl-235b/32b/8b-instruct

## API Key 获取

| 平台 | 注册地址 | 免费额度 |
|:----|:--------|:--------|
| 🔥 火山引擎 ARK（豆包） | console.volcengine.com/ark | 50万 token |
| 💎 阿里云百炼 DashScope（千问） | bailian.console.aliyun.com | 每模型100万 token |
