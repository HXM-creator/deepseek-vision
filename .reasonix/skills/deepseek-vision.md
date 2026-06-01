---
name: deepseek-vision
description: 视觉识别工具 — 双平台(豆包+千问) + 双重验证 + 场景预设
---
## 工具文件

| 文件 | 说明 |
|:----|:----|
| `vision.js` | 🏆 **主力脚本** — 整合豆包+千问，全部功能 |
| `mcp-vision-server.js` | 🤖 **MCP 服务器** — 供 Claude 等客户端调用 |

> `doubao_vision.py` 已弃用，功能已全部迁移到 vision.js

## 快速使用

```bash
# 设置 API Key
set ARK_API_KEY=ark-你的key
set DASHSCOPE_API_KEY=sk-你的key

# 🎌 动漫识别（推荐：场景预设）
node vision.js photo.jpg "这是谁？" --task anime

# 🔬 工科分析
node vision.js photo.jpg "分析" --task engineering

# 💬 交互模式（连续追问）
node vision.js photo.jpg "这是谁？" --interactive

# 📊 用量统计
node vision.js --budget

# 🤖 MCP 服务器
node mcp-vision-server.js
```

## 场景预设 `--task`

| 场景 | 命令 | 效果 |
|:----|:----|:------|
| 🎌 动漫 | `--task anime` | 豆包+验证 |
| 🔬 工科 | `--task engineering` | 千问+验证 |
| 🖼️ 简单物体 | `--task simple` | 最快，不验证 |
| 📝 OCR | `--task ocr` | 文字提取 |
| 🌄 场景 | `--task scene` | 千问深度推理 |

## 双重验证

问"这是谁"时自动开启双重验证：
1. 🔍 交叉视觉 — 另一平台再识别，发现"看走眼"
2. 📖 文本核查 — 纠正人名/地名/参数错误

## 前提条件

- Node.js 18+
- 至少一个 API Key

## API Key 获取

| 平台 | 注册地址 | 免费额度 |
|:----|:--------|:--------|
| 🔥 **火山引擎 ARK（豆包）** | console.volcengine.com/ark | 50万 token（共享） |
| 💎 **阿里云百炼 DashScope（千问）** | bailian.console.aliyun.com | 每模型100万 token（独立） |
