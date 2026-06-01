---
name: doubao-vision
description: 视觉模型调用工具集 — 整合火山引擎豆包 + 阿里云千问
---
## 工具文件

| 文件 | 说明 |
|:----|:----|
| `vision.js` | 🏆 **主力脚本** — 整合豆包+千问，支持智能选模/OCR/深度思考 |
| `doubao_vision.py` | 🐍 备用脚本 — 仅豆包，Python 版 |
| `mcp-vision-server.js` | 🤖 **Claude MCP 服务器** — 供 Claude Desktop/Code 调用 |

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

# 启动 Claude MCP 服务器
node mcp-vision-server.js
```

## Claude 集成

### Claude Desktop

在 `claude_desktop_config.json` 中添加：

```json
{
  "mcpServers": {
    "deepseek-vision": {
      "command": "node",
      "args": ["路径/mcp-vision-server.js"]
    }
  }
}
```

重启 Claude Desktop 后即可使用 `vision_analyze` 和 `vision_list_models` 工具。

### Claude Code

```bash
claude mcp add deepseek-vision -e "node 路径/mcp-vision-server.js"
```

## 前提条件

- Node.js 18+（vision.js）
- Python 3（doubao_vision.py，可选）
- 至少一个 API Key

## API Key 获取

| 平台 | 注册地址 | 免费额度 |
|:----|:--------|:--------|
| 🔥 **火山引擎 ARK（豆包）** | console.volcengine.com/ark | 50万 token（共享） |
| 💎 **阿里云百炼 DashScope（千问）** | bailian.console.aliyun.com | 每模型100万 token（独立） |

## 免费视觉模型

### 豆包（ARK，共享50万token）
- `doubao-seed-1-6-vision-250815` — 最强视觉
- `doubao-seed-1-6-flash-250615` — 快速+推理 ⭐推荐
- `doubao-1-5-vision-pro-32k-250115` — 最省token

### 千问（DashScope，每模型100万token）
- `qwen3-vl-plus` — 日常首选 ⭐
- `qwen-vl-plus` — 极速
- `qwen-vl-max` — 高质量
- `qwen3-vl-32b-thinking` — 深度思考
- `qwen-vl-ocr-latest` — OCR专用
- `qwen3-vl-235b-a22b-thinking` — 最强

## 更多信息

完整文档见仓库 README.md 和 benchmark/RESULTS.md
