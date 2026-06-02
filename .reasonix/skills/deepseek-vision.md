---
name: deepseek-vision
description: 视觉识别工具 — 双平台(豆包+千问) + 双重验证 + 场景预设
---
## 工具文件

| 文件 | 说明 |
|:----|:----|
| `vision.js` | 🏆 **主力脚本** — 28个模型，全部功能 |
| `mcp-vision-server.js` | 🤖 **MCP 服务器** |

## 快速使用

```bash
set ARK_API_KEY=ark-你的key
set DASHSCOPE_API_KEY=sk-你的key

# 🔬 工科分析（芯片/电路/图表）
node vision.js circuit.png "分析" --task engineering

# 🖼️ 日常识物
node vision.js photo.jpg "这是什么？"

# 📖 识别+讲解
node vision.js photo.jpg "这是什么？" --task explain

# 📊 用量统计
node vision.js --budget
```

## 场景预设

| 场景 | 命令 | 策略 |
|:----|:----|:------|
| 🔬 工科 | `--task engineering` | 千问优先，工科图表更准 |
| 🖼️ 日常识物 | `--task simple` | 最快模型 |
| 📝 截图/OCR | `--task ocr` | OCR专用模型 |
| 📖 讲解 | `--task explain` | 识别+背景知识讲解 |
| 🎌 动漫 | `--task anime` | 豆包（附加功能） |

## 模型推荐（按用途）

| 用途 | 推荐模型 | 性能 |
|:----|:--------|:----|
| 🚀 日常最快 | qwen3-vl-flash | **0.3s / 120tok** |
| ⚡ 豆包最快 | doubao-1-5-vision-pro-32k | 1.0s / 155tok |
| 🔬 工科图表 | qwen3-vl-plus | 0.7s / 120tok |
| 🧠 深度分析 | qwen3-vl-32b-thinking | 3.0s / 205tok |
| 🎌 动漫角色 | doubao-seed-1-6-flash | 1.3s / 437tok |
| 📝 文字提取 | qwen-vl-ocr-latest | OCR专用 |

## 自动特性
- 问"这是谁" → 自动双重验证
- 图片>800KB → 自动压缩到1024px
- 每次调用 → 自动记录token

## API Key
| 平台 | 注册地址 |
|:----|:--------|
| 🔥 火山引擎 ARK（豆包） | console.volcengine.com/ark |
| 💎 阿里云百炼 DashScope（千问） | bailian.console.aliyun.com |
