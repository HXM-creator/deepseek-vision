---
name: doubao-vision
description: 视觉模型调用工具集 — 整合火山引擎豆包 + 阿里云千问，支持 Claude MCP
---
## 工具文件

| 文件 | 说明 |
|:----|:----|
| `vision.js` | 🏆 **主力脚本** — 整合豆包+千问，支持智能选模/OCR/深度思考 |
| `doubao_vision.py` | 🐍 备用脚本 — 仅豆包，Python 版 |
| `mcp-vision-server.js` | 🤖 **Claude MCP 服务器** — 供 Claude Desktop/Code 调用 |

## 快速使用

```bash
# Windows
set ARK_API_KEY=ark-你的key
set DASHSCOPE_API_KEY=sk-你的key

# Mac / Linux
export ARK_API_KEY=ark-你的key
export DASHSCOPE_API_KEY=sk-你的key

# 智能识别（豆包自动选）
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

`claude_desktop_config.json`：
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

### Claude Code
```bash
claude mcp add deepseek-vision -e "node 路径/mcp-vision-server.js"
```

## 前提条件

- Node.js 18+
- Python 3（doubao_vision.py 可选）
- 至少一个 API Key（通过环境变量设置）

## API Key 获取

| 平台 | 注册地址 | 免费额度 |
|:----|:--------|:--------|
| 🔥 **火山引擎 ARK（豆包）** | console.volcengine.com/ark | 50万 token（共享） |
| 💎 **阿里云百炼 DashScope（千问）** | bailian.console.aliyun.com | 每模型100万 token（独立） |
