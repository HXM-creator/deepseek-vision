---
name: doubao-vision
description: 视觉模型调用工具集 — 整合火山引擎豆包 + 阿里云千问
---
## 工具文件

| 文件 | 说明 |
|:----|:----|
| `vision.js` | 🏆 **主力脚本** — 整合豆包+千问，支持智能选模/OCR/深度思考 |
| `doubao_vision.py` | 🐍 备用脚本 — 仅豆包，Python 版 |

## 快速使用

```bash
# 设置 API Key（或写入 .env）
set ARK_API_KEY=ark-你的key
set DASHSCOPE_API_KEY=sk-你的key

# 智能识别
node vision.js photo.jpg "这是谁？"

# 指定豆包（动漫角色识别推荐）
node vision.js photo.jpg "这是谁？" --provider ark

# 指定千问（详细场景描述推荐）
node vision.js photo.jpg "详细描述" --free
```

## 前提条件

- Node.js 18+（vision.js）
- Python 3（doubao_vision.py）
- 至少一个 API Key（豆包或千问）

## 更多信息

完整文档见仓库 README.md 和 benchmark/RESULTS.md
