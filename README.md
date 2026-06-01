<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Python-3-3776AB?logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/License-MIT-orange" alt="License">
  <img src="https://img.shields.io/badge/DeepSeek-Vision-8B5CF6" alt="DeepSeek Vision">
  <img src="https://img.shields.io/badge/Doubao-ARK-FF6B35" alt="Doubao ARK">
  <img src="https://img.shields.io/badge/Qwen-DashScope-00A3FF" alt="Qwen DashScope">
</p>

<h1 align="center">👁️ DeepSeek Vision</h1>
<p align="center">
  <b>给你的 DeepSeek 装上眼睛</b><br>
  <i>双平台视觉识别 + 事实核查 — 看图识字，文本纠错</i>
</p>

<p align="center">
  <a href="#-快速开始">快速开始</a> •
  <a href="#-场景预设">场景预设</a> •
  <a href="#-双重验证">双重验证</a> •
  <a href="#-高级用法">高级用法</a> •
  <a href="#-基准测试">基准测试</a> •
  <a href="README_EN.md">🌐 English</a>
</p>

---

## ✨ 特性一览

| 能力 | 说明 |
|:----|:------|
| 🎌 **动漫角色识别** | 豆包准确率明显优于千问（实测对比） |
| 🧑‍🔬 **名人/地标识别** | 双平台均能准确识别 |
| 🔬 **工科图表** | 芯片/电路/Bode图/PCB |
| 🌄 **场景理解** | 详细描述图片内容 |
| 📊 **图表提取** | 柱状图数据、逻辑门分析 |
| 👁️ **双重验证** `--verify` | 交叉视觉+文本核查，发现AI幻觉 |
| 🎯 **场景预设** `--task` | 一键切换最佳配置 |
| 💬 **交互模式** `--interactive` | 连续追问同一张图，省token |
| 📊 **用量追踪** `--budget` | 自动记录token消耗 |

---

## 🚀 快速开始

### 1️⃣ 获取 API Key

<details>
<summary><b>🔥 火山引擎 ARK（豆包）— 展开</b></summary>

注册 [火山引擎](https://console.volcengine.com/ark) → 「ARK 推理」→ 创建 API Key
开通免费模型：`doubao-seed-1-6-vision-250815` / `doubao-seed-1-6-flash-250615`
💰 50 万共享 token
</details>

<details>
<summary><b>💎 阿里云百炼 DashScope（千问）— 展开</b></summary>

注册 [阿里云百炼](https://bailian.console.aliyun.com/) → 「API Key 管理」→ 创建 Key
开通免费模型：`qwen3-vl-plus` / `qwen-vl-max` / `qwen-vl-ocr-latest`
💰 每模型 100 万 token（独立计算）
</details>

### 2️⃣ 设置环境变量

```bash
# Windows
set ARK_API_KEY=ark-你的key
set DASHSCOPE_API_KEY=sk-你的key

# Mac / Linux
export ARK_API_KEY=ark-你的key
export DASHSCOPE_API_KEY=sk-你的key
```

### 3️⃣ 开始使用

```bash
# 最简单的用法 — 直接问
node vision.js 图片.jpg "这是谁？"

# 场景预设（推荐）
node vision.js 图片.jpg "这是谁？" --task anime
```

---

## 🎯 场景预设

不用记参数，直接说场景：

| 场景 | 命令 | 自动配置 |
|:----|:----|:--------|
| 🎌 **动漫角色** | `--task anime` | 豆包 + 验证开启 |
| 🔬 **工科电路** | `--task engineering` | 千问 + 验证开启 |
| 🖼️ **简单物体** | `--task simple` | 最快模型，关闭验证 |
| 📝 **文字提取** | `--task ocr` | OCR 专用模型 |
| 🌄 **详细场景** | `--task scene` | 千问深度推理 |

```bash
# 查看所有预设
node vision.js --task list

# 使用预设
node vision.js cat.jpg "什么品种？" --task simple
node vision.js circuit.png "分析" --task engineering
```

---

## 👁️ 双重验证

视觉模型会犯两类错误。`--verify` 用两层验证捕捉它们：

```
🖼️ 主视觉 → 输出文本
     ↓
🔍 交叉视觉 → 另一平台再识别 → 比对差异 → 发现"看走眼"
     ↓
📖 文本核查 → 检查事实错误 → 发现"记错名"
     ↓
🎯 置信度评分 → ★★★★☆ 较可信
```

问"这是谁？""什么角色？"时**自动开启**，无需手动加参数。想跳过用 `--no-verify`。

### 开销

| 模式 | API 调用 | 额外耗时 | 额外 token |
|:----|:-------:|:-------:|:---------:|
| 普通 | 1 次 | 基准 | 基准 |
| `--verify` | 最多 +2 次 | +3~10s | +400~1200 |

### 示例

```bash
# 自动验证
node vision.js bridge.jpg "这是什么桥？"
→ Qwen: "海湾大桥"
→ 豆包: "金门大桥" ⚠️ 不一致
→ 文本核查: 确认无误
→ 结论: 金门大桥（豆包正确）
```

---

## 💬 交互模式

不退出程序，连续追问同一张图：

```bash
node vision.js 图片.jpg "这是谁？" --interactive

# 输出结果后进入对话
你 > 他有什么特征？
🤖 蓝发、白衬衫、惊讶表情...

你 > 用英文描述
🤖 Blue hair, white shirt...

你 > exit  ← 退出
```

省掉重复传图，速度更快，token 更省。

---

## 🔧 高级用法

| 用法 | 命令 |
|:----|:----|
| 📝 **Markdown 输出** | `--format markdown` |
| 📊 **查看用量** | `node vision.js --budget` |
| 📋 **所有模型** | `node vision.js --list` |
| 🔍 **手动验证** | `--verify` |
| ⏭️ **跳过验证** | `--no-verify` |
| 🌐 **URL 图片** | `node vision.js https://... "分析"` |
| 🤖 **MCP 协议** | `node mcp-vision-server.js` |

```bash
# 结构化输出，适合嵌入文档
node vision.js chart.png "数据是多少？" --format markdown

# 查看用量统计
node vision.js --budget

# 直接传 URL
node vision.js https://example.com/photo.jpg "这是什么？"

# 跳过自动验证
node vision.js photo.jpg "这是谁？" --no-verify
```

---

## 📊 基准测试

基于 **28 张合成图 + 10 张真实照片** 交叉测试：

| 场景 | 最佳模型 | 豆包 | 千问 |
|:----|:-------|:---:|:---:|
| 🎌 动漫身份 | **豆包** | ✅ 唯一正确 | ❌ |
| 🎨 特征描述 | 任意 | 🟢 简洁快 | 🟢 详细 |
| 🧑‍🔬 名人/地标 | **豆包** | 🟢 100% | 🟢 100% |
| 🔬 芯片/PCB | 任意 | 🟢 | 🟢 |
| ⚡ 电路原理图 | **千问** | 🟡 参数偏差 | 🟢 100% |
| 🌉 金门大桥 | **豆包独占** | ✅ | ❌ 认错 |

> 详细报告 → [`benchmark/RESULTS.md`](benchmark/RESULTS.md)

---

## 🤖 MCP 协议接入

支持任何 MCP 兼容客户端（Claude Desktop 等）：

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

## 🔧 Reasonix Skill 集成

```
/run_skill doubao-vision --arguments "识别这张图片"
```

## 🔑 关于 API Key

**所有硬编码 Key 已移除。** 通过环境变量配置：

| 变量 | 平台 |
|:----|:----|
| `ARK_API_KEY` | 火山引擎豆包 |
| `DASHSCOPE_API_KEY` | 阿里云千问 |

---

<p align="center">
  <b>DeepSeek Vision — 给你的 DeepSeek 装上眼睛</b><br>
  <a href="README_EN.md">🌐 English Version</a>
</p>
