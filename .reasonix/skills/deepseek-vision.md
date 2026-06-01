---
name: deepseek-vision
description: 视觉识别工具 — 双平台(豆包+千问) + 双重验证 + 场景预设 + 智能讲解
---
## 工具文件

| 文件 | 说明 |
|:----|:----|
| `vision.js` | 🏆 **主力脚本** — 全部功能 |
| `mcp-vision-server.js` | 🤖 **MCP 服务器** |

## 快速使用

```bash
# 设置 API Key
set ARK_API_KEY=ark-你的key
set DASHSCOPE_API_KEY=sk-你的key

# 🎌 动漫识别（推荐）
node vision.js photo.jpg "这是谁？" --task anime

# 📖 识别+智能讲解
node vision.js photo.jpg "这是什么？" --task explain

# 💬 交互模式（连续追问）
node vision.js photo.jpg "这是谁？" --interactive

# 📊 用量统计
node vision.js --budget

# 🤖 MCP
node mcp-vision-server.js
```

## 场景预设

| 场景 | 命令 | 效果 |
|:----|:----|:------|
| 🎌 动漫 | `--task anime` | 豆包+验证 |
| 🔬 工科 | `--task engineering` | 千问+验证 |
| 📖 讲解 | `--task explain` | 识别+智能讲解 |
| ⚡ 极省 | `--task tiny` | 最省token |
| 🖼️ 简单 | `--task simple` | 最快不验证 |
| 📝 OCR | `--task ocr` | 文字提取 |
| 🌄 场景 | `--task scene` | 千问深度推理 |

## 自动特性（无需手动加参数）

| 特性 | 说明 |
|:----|:------|
| 🔍 **双重验证** | 问"这是谁"自动开启交叉视觉+文本核查 |
| 🎯 **豆包优先** | 双平台结果不一致时自动采用豆包结论 |
| 📦 **自动压缩** | 图片>800KB自动缩到1024px，省60% token |
| 📊 **用量追踪** | 每次调用自动记录，`--budget`查看 |

## 智能讲解 `--task explain`

根据图片类型自动选择讲解方向：

| 类型 | 讲解内容 |
|:----|:--------|
| 🎌 动漫/影视 | 作品背景 + 角色定位 |
| 🗼 建筑/地标 | 历史 + 特色 |
| 🔬 工科/芯片 | 功能 + 原理 |
| 🍕 食物/动物 | ❌ 跳过 |

## 前提条件

- Node.js 18+
- 至少一个 API Key

## API Key 获取

| 平台 | 注册地址 | 免费额度 |
|:----|:--------|:--------|
| 🔥 **火山引擎 ARK（豆包）** | console.volcengine.com/ark | 50万 token（共享） |
| 💎 **阿里云百炼 DashScope（千问）** | bailian.console.aliyun.com | 每模型100万 token（独立） |
