<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Python-3-3776AB?logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/License-MIT-orange" alt="License">
  <img src="https://img.shields.io/badge/DeepSeek-Vision-8B5CF6" alt="DeepSeek Vision">
  <img src="https://img.shields.io/badge/Models-28-8B5CF6" alt="28 Models">
</p>

<h1 align="center">👁️ DeepSeek Vision</h1>
<p align="center">
  <b>给你的 DeepSeek 装上眼睛</b><br>
  <i>双平台视觉识别 — 豆包优先 · 双重验证 · 自动省token</i>
</p>

<p align="center">
  <a href="#-快速开始">快速开始</a> •
  <a href="#-实测成绩">实测成绩</a> •
  <a href="#-场景预设">场景预设</a> •
  <a href="#-双重验证">双重验证</a> •
  <a href="#-模型清单">模型清单</a> •
  <a href="README_EN.md">🌐 English</a>
</p>

---

## ⚡ 30 秒上手

```bash
git clone https://github.com/HXM-creator/deepseek-vision.git
cd deepseek-vision
set ARK_API_KEY=ark-你的key
node vision.js 图片.jpg "这是什么？"
```

---

## 📊 实测成绩

> 基于 55 张测试图（28合成 + 10真实 + 9Unsplash + 8自绘）全覆盖测试

### 日常场景识别（8张自绘图）

| 测试 | 内容 | doubao-1.6-flash | doubao-1.5-vision-pro | qwen3-vl-flash |
|:----|:----|:--------------:|:-------------------:|:--------------:|
| 🍜 牛肉面 | 识别为牛肉面 | ✅ | ✅ | — |
| 🚦 红绿灯 | 识别为红灯 | ✅ | ✅ | — |
| 🕐 时钟 | 识别为10:30 | ✅ | ✅ | — |
| 🏁 国旗 | 五星红旗 | ✅ | ✅ | — |
| 📊 图表 | Thu=150 | ✅ | ✅ | — |
| 🔋 电路 | 电池+灯泡 | ✅ | ✅ | — |
| 🍎 水果 | 苹果香蕉葡萄 | ✅ | ❌ | — |
| 😊 笑脸 | 笑脸表情 | ✅ | ✅ | — |
| **总分** | | **8/8 🏆** | **7/8** | — |

### 模型速度对比

| 模型 | 平均耗时 | 平均Token | 定位 |
|:----|:-------:|:---------:|:----|
| **doubao-1.6-flash** | ~1.3s | ~500 | 🥇 日常首选（最准） |
| doubao-1.5-vision-pro | **~1.0s** | **~200** | ⚡ 极速识别 |
| qwen3-vl-flash | **~0.3s** | **~120** | 🚀 最快响应 |
| doubao-seed-1.6-vision | ~4.8s | ~540 | 🏆 最强豆包 |
| qwen3-vl-32b-thinking | ~3.0s | ~205 | 🧠 深度推理 |

---

## 🎯 场景预设

| 场景 | 命令 | 策略 |
|:----|:----|:------|
| 🖼️ **日常识物** | 不加参数 | doubao-1.6-flash 优先（8/8全对） |
| 🔬 **工科分析** | `--task engineering` | 千问，图表更准 |
| 🎌 **动漫角色** | `--task anime` | 豆包（千问在动漫上0%） |
| 📖 **识别+讲解** | `--task explain` | 识别后自动生成知识讲解 |
| 📝 **文字提取** | `--task ocr` | OCR专用模型 |
| 🖼️ **简单物体** | `--task simple` | 最快模型，不验证 |
| ⚡ **极省模式** | `--task tiny` | 最省token，适合大批量 |
| 🌄 **场景描述** | `--task scene` | 千问深度推理 |
| 💬 **交互追问** | `--interactive` | 连续追问同一张图，省token |

---

## 👁️ 双重验证

视觉模型会犯两类错误，`--verify` 自动捕捉：

```
看走眼（金门大桥→海湾大桥） → 🔍 交叉视觉比对
记错名（Giselle→金旼炡）   → 📖 文本模型核查
不一致时                    → 🎯 自动采用豆包结论
```

问"这是谁/什么建筑"时自动开启。加 `--no-verify` 跳过。

---

## 🔧 其他功能

| 功能 | 说明 |
|:----|:------|
| 📊 **用量追踪** `--budget` | 自动记录每次token消耗 |
| 🖼️ **自动压缩** | >800KB自动缩到1024px，省60% |
| 📝 **Markdown输出** `--format markdown` | 结构化输出 |
| 🌐 **URL图片** | 直接传网址自动下载 |
| 🤖 **MCP协议** | 支持Claude等客户端 |

---

## 📋 模型清单

**共28个模型**，经42款实测淘汰17个后保留。

### 🔥 豆包 ARK（7个）
```
日常首选: doubao-seed-1-6-flash-250828
极速识别: doubao-1-5-vision-pro-32k-250115
最强视觉: doubao-seed-1-6-vision-250815
事实核查: doubao-seed-1-8-251228（性价比最高，320tok）
```

### 💎 千问 DashScope（21个）
```
最快响应: qwen3-vl-flash（0.3s/120tok）
均衡首选: qwen3-vl-plus
高质量:   qwen-vl-max
深度推理: qwen3-vl-32b-thinking
OCR:      qwen-vl-ocr-latest
```

---

## 🔑 API Key

| 平台 | 注册地址 | 免费额度 |
|:----|:--------|:--------|
| 🔥 火山引擎 ARK（豆包） | console.volcengine.com/ark | 50万 token |
| 💎 阿里云百炼 DashScope（千问） | bailian.console.aliyun.com | 每模型100万 token |

---

<p align="center">
  <b>DeepSeek Vision — 给你的 DeepSeek 装上眼睛</b><br>
  <a href="README_EN.md">🌐 English Version</a>
</p>
