#!/usr/bin/env node
/**
 * DeepSeek Vision — 统一视觉识别工具
 *
 * 整合火山引擎 ARK（豆包）和阿里云百炼 DashScope（千问）
 * 智能选择最优模型，在准确性和 token 消耗之间自动平衡
 *
 * 基于 28 张合成图 + 10 张真实照片的交叉测试优化:
 *   - 新增 16 个免费千问视觉模型（含 7 个 OCR 专用模型）
 *   - OCR 模式改用专用模型 qwen-vl-ocr-latest
 *   - quality 模式加入 qwen-vl-max
 *   - balanced 模式改用 qwen3-vl-plus
 *   - 新增 --free 参数，优先使用免费额度模型
 *   - 智能选择策略优化，识别更精准
 *
 * 用法:
 *   node vision.js <图片路径/URL>               # auto 模式（默认，推荐）
 *   node vision.js <图片> --mode fast            # 极速模式
 *   node vision.js <图片> "这是什么？"            # 直接传问题做 prompt
 *
 * 选项:
 *   --mode <mode>      auto|fast|balanced|quality|thinking|ocr (默认: auto)
 *   --prompt <text>    自定义提示词
 *   --provider <p>     ark|dashscope|auto
 *   --model <name>     指定具体模型名
 *   --list             列出所有可用模型
 *   --json             输出 JSON 格式
 *   --budget           显示剩余 token 预算
 *   --max-tokens <n>   最大生成长度
 *   --free             优先使用免费额度模型
 *   --verify           事实核查：视觉识别后自动用文本模型核对事实
 *   --no-verify        跳过自动验证（默认问"这是谁"时自动开启）
 *
 * 示例:
 *   node vision.js photo.jpg                    # auto 模式，智能选择
 *   node vision.js photo.jpg "这是什么动物"      # 直接提问
 *   node vision.js photo.jpg --mode quality     # 强制高质量
 *   node vision.js photo.jpg --mode ocr         # 文字提取（新版用专用OCR模型）
 *   node vision.js photo.jpg --free             # 优先使用免费额度
 *   node vision.js photo.jpg --verify           # 识别 + 文本事实核查
 *   node vision.js photo.jpg --no-verify        # 跳过自动验证
 *   node vision.js --list                        # 查看所有模型
 *   node vision.js --budget                      # 查看剩余预算
 */

const fs = require("fs");
const path = require("path");

// ===================== 配置 =====================
const CONFIG = {
  ark: {
    key: process.env.ARK_API_KEY || "",
    baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
    budget: 500_000,
    name: "火山引擎 ARK",
    icon: "🔥",
  },
  dashscope: {
    key: process.env.DASHSCOPE_API_KEY || "",
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode",
    budget: 1_000_000,
    name: "阿里云百炼",
    icon: "💎",
  },
};

// ===================== 模型目录 =====================
const MODELS = {
  "doubao-seed-1-6-vision-250815": { provider: "ark", quality: 10, speed: 3, thinking: true,  desc: "最强豆包视觉，深度推理，token消耗大" },
  "doubao-seed-1-6-250615":         { provider: "ark", quality: 9,  speed: 5, thinking: true,  desc: "Seed 1.6 多模态，高质量带推理" },
  "doubao-seed-1-6-flash-250615":   { provider: "ark", quality: 7,  speed: 8, thinking: true,  desc: "快速版豆包，仍带推理能力【首选均衡】" },
  "doubao-1-5-vision-pro-32k-250115":{ provider: "ark", quality: 6, speed: 9, thinking: false, desc: "最省token的豆包视觉（无推理）" },
  "qwen-vl-plus":         { provider: "dashscope", quality: 7, speed: 10, thinking: false, desc: "千问VL Plus，最快最省token【首选极速】" },
  "qwen3-vl-flash":       { provider: "dashscope", quality: 6, speed: 9,  thinking: false, desc: "千问3 VL Flash" },
  "qwen3-vl-flash-2025-10-15": { provider: "dashscope", quality: 6, speed: 9, thinking: false, desc: "千问3 VL Flash 旧版" },
  "qwen3-vl-8b-thinking": { provider: "dashscope", quality: 7, speed: 6, thinking: true,  desc: "千问3 VL 8B，小模型带思考链" },
  "qwen3-vl-32b-thinking":{ provider: "dashscope", quality: 8, speed: 5, thinking: true,  desc: "千问3 VL 32B，中等规模带推理" },
  "qwen3-vl-235b-a22b-thinking":{ provider: "dashscope", quality: 10, speed: 3, thinking: true, desc: "最强千问视觉，235B带深度思考" },
  "qwen3-vl-30b-a3b-thinking":{ provider: "dashscope", quality: 9, speed: 4, thinking: true,   desc: "千问3 VL 30B MoE架构" },

  // ===== 2026/05 新激活免费模型（100万免费/模型，2026/08/25到期）=====
  "qwen-vl-plus-latest":    { provider: "dashscope", quality: 7, speed: 10, thinking: false, desc: "VL Plus 最新快照，速度最快" },
  "qwen3-vl-plus":          { provider: "dashscope", quality: 8, speed: 9,  thinking: false, desc: "Qwen3 VL Plus，新版通用视觉【均衡首选】" },
  "qwen3-vl-plus-2025-09-23": { provider: "dashscope", quality: 7, speed: 9, thinking: false, desc: "Qwen3 VL Plus 旧版快照" },
  "qwen3-vl-plus-2025-12-19": { provider: "dashscope", quality: 7, speed: 9, thinking: false, desc: "Qwen3 VL Plus 旧版快照" },
  "qwen-vl-max":            { provider: "dashscope", quality: 9, speed: 5,  thinking: false, desc: "千问 Max 大杯视觉【quality首选】" },
  "qwen-vl-ocr-latest":     { provider: "dashscope", quality: 9, speed: 8,  thinking: false, desc: "OCR 最新专用版【OCR首选】" },
  "qwen-vl-ocr":            { provider: "dashscope", quality: 8, speed: 8,  thinking: false, desc: "OCR 基础版" },
  "qwen-vl-ocr-1028":       { provider: "dashscope", quality: 7, speed: 8,  thinking: false, desc: "OCR 旧版 1028" },
  "qwen-vl-ocr-2025-04-13": { provider: "dashscope", quality: 7, speed: 8,  thinking: false, desc: "OCR 旧版 0413" },
  "qwen-vl-ocr-2025-08-28": { provider: "dashscope", quality: 7, speed: 8,  thinking: false, desc: "OCR 旧版 0828" },
  "qwen-vl-ocr-2025-11-20": { provider: "dashscope", quality: 7, speed: 8,  thinking: false, desc: "OCR 旧版 1120" },
  "qwen3-vl-235b-a22b-instruct": { provider: "dashscope", quality: 9, speed: 4, thinking: false, desc: "235B Instruct 无推理，适合直接指令" },
  "qwen3-vl-32b-instruct":  { provider: "dashscope", quality: 7, speed: 6,  thinking: false, desc: "32B Instruct" },
  "qwen3-vl-30b-a3b-instruct": { provider: "dashscope", quality: 8, speed: 5, thinking: false, desc: "30B MoE Instruct" },
  "qwen3-vl-8b-instruct":   { provider: "dashscope", quality: 5, speed: 8,  thinking: false, desc: "8B Instruct 轻量快速" },
  "qwen3-vl-flash-2026-01-22":{ provider: "dashscope", quality: 6, speed: 9, thinking: false, desc: "Flash 2026年1月版" },
};

// ===================== 关键词检测 =====================
// 用于 auto 模式智能判断
const NEEDS_PRECISE_NAMING = /谁|名字|名称|叫什么|哪个|角色|人物|哪部|番剧|动漫|电影|品牌|型号|明星|名人|演员/;
const NEEDS_DETAILED_ANALYSIS = /详细|分析|说明|解释|为什么|如何|原理|结构|组成|对比|区别|关系/;
const IS_OCR = /文字|提取|识别|ocr|OCR|文本|阅读|读图|翻译|文档|表格|代码|截图/;
const IS_TABLE_DOC = /表格|文档|报表|表单|发票|合同|论文|报告|书|页|排版/;
const IS_SIMPLE_QUERY = /什么|这是|有没有|是啥|哪个|吗|有.*吗|是不是/;

// ===================== 模式预设 =====================
const MODES = {
  auto: {
    label: "🤖 智能模式",
    models: ["qwen3-vl-plus", "doubao-seed-1-6-flash-250615"],
    systemPrompt: "",
  },
  fast: {
    label: "⚡ 极速模式",
    models: ["qwen-vl-plus", "doubao-1-5-vision-pro-32k-250115", "qwen3-vl-8b-instruct"],
    systemPrompt: "你是一个图片识别助手。回答要简洁准确，不超过20字。",
  },
  balanced: {
    label: "⚖️ 均衡模式",
    models: ["qwen3-vl-plus", "doubao-seed-1-6-flash-250615", "qwen-vl-plus"],
    systemPrompt: "你是一个图片识别助手。请简洁描述图片内容，控制在50字以内。",
  },
  quality: {
    label: "🎯 高质量模式",
    models: ["qwen-vl-max", "doubao-seed-1-6-vision-250815", "qwen3-vl-235b-a22b-thinking"],
    systemPrompt: "你是一个专业的图片分析助手。请详细描述图片中的内容，包括主体、颜色、构图、文字等所有细节。",
  },
  thinking: {
    label: "🧠 深度思考模式",
    models: ["qwen3-vl-32b-thinking", "doubao-seed-1-6-flash-250615", "qwen3-vl-8b-thinking"],
    systemPrompt: "你是一个图片分析专家。请一步步推理分析图片内容，展示思考过程。",
  },
  ocr: {
    label: "📝 OCR 文字提取",
    models: ["qwen-vl-ocr-latest", "qwen-vl-ocr", "qwen-vl-plus"],
    systemPrompt: "你是一个专业的OCR文字识别助手。请精确提取图片中的所有文字内容，保留原文格式和排版。如果有表格，请用表格格式输出。如果有代码，保留缩进和换行。",
  },
};

// ===================== 智能选择引擎 =====================
function smartSelectMode(prompt, imageSizeKB) {
  // 根据 prompt 内容和图片大小自动选择最优模式
  // v3: 优先使用免费千问模型，OCR 用专用模型
  const p = prompt || "";

  // OCR 任务 → 用专用 OCR 模型
  if (IS_OCR.test(p)) return { mode: "ocr", reason: "检测到文字提取需求，使用专用OCR模型" };

  // 文档/表格检测 → OCR 模式
  if (IS_TABLE_DOC.test(p)) return { mode: "ocr", reason: "检测到文档/表格，使用专用OCR模型" };

  // 需要精确命名（人名、动漫角色等）→ 带推理的 balanced
  if (NEEDS_PRECISE_NAMING.test(p)) {
    if (IS_SIMPLE_QUERY.test(p) && imageSizeKB < 100) {
      return { mode: "balanced", reason: "需要精确命名，使用带推理的模型避免幻觉" };
    }
    return { mode: "balanced", reason: "需要精确命名识别" };
  }

  // 需要详细分析 → 大图用 quality（qwen-vl-max），小图用 thinking
  if (NEEDS_DETAILED_ANALYSIS.test(p)) {
    if (imageSizeKB > 200) {
      return { mode: "quality", reason: "复杂分析 + 大图片，使用 qwen-vl-max" };
    }
    return { mode: "thinking", reason: "检测到深度分析需求" };
  }

  // 大图片（>200KB）→ balanced 确保准确
  if (imageSizeKB > 200) {
    return { mode: "balanced", reason: "大图片，使用 qwen3-vl-plus 确保准确" };
  }

  // 简单问题 + 小图片 → 极速模式（qwen-vl-plus 免费）
  return { mode: "fast", reason: "简单问题，qwen-vl-plus 极速免费" };
}

function selectModel(modeName, provider, imageSizeKB, prompt, freeFirst) {
  if (modeName === "auto") {
    const decision = smartSelectMode(prompt, imageSizeKB);
    modeName = decision.mode;
  }

  const mode = MODES[modeName];
  if (!mode) throw new Error(`未知模式: ${modeName}`);

  let candidates = mode.models.map(name => ({ name, info: MODELS[name] })).filter(m => m.info);
  if (provider !== "auto") candidates = candidates.filter(m => m.info.provider === provider);

  // --free 模式：优先选择 dashscope（千问免费额度）的模型
  if (freeFirst) {
    const freeModels = candidates.filter(m => m.info.provider === "dashscope");
    if (freeModels.length > 0) candidates = freeModels;
  }

  if (candidates.length === 0) {
    candidates = Object.entries(MODELS)
      .map(([name, info]) => ({ name, info }))
      .filter(m => provider === "auto" || m.info.provider === provider);
    if (freeFirst) {
      const freeModels = candidates.filter(m => m.info.provider === "dashscope");
      if (freeModels.length > 0) candidates = freeModels;
    }
  }

  return { modelName: candidates[0].name, modelInfo: candidates[0].info, selectedMode: modeName };
}

// ===================== 工具函数 =====================

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    imagePath: null, mode: "auto", prompt: null, provider: "auto",
    model: null, json: false, listModels: false, maxTokens: null, showBudget: false,
    freeFirst: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--mode": opts.mode = args[++i] || "auto"; break;
      case "--prompt": opts.prompt = args[++i]; break;
      case "--provider": opts.provider = args[++i] || "auto"; break;
      case "--model": opts.model = args[++i]; break;
      case "--json": opts.json = true; break;
      case "--max-tokens": opts.maxTokens = parseInt(args[++i]) || null; break;
      case "--list": opts.listModels = true; break;
      case "--budget": opts.showBudget = true; break;
      case "--free": opts.freeFirst = true; break;
      case "--verify": opts.verify = true; break;
      case "--no-verify": opts.noVerify = true; break;
      default:
        if (!args[i].startsWith("--")) {
          if (!opts.imagePath) opts.imagePath = args[i];
          else if (!opts.prompt) opts.prompt = args[i];
        }
    }
  }
  // 自动验证：问"是谁/什么角色"等精确命名问题时自动启用 --verify
  if (!opts.noVerify && !opts.verify && opts.prompt) {
    if (NEEDS_PRECISE_NAMING.test(opts.prompt) || IS_TABLE_DOC.test(opts.prompt)) {
      opts.verify = true;
    }
  }
  return opts;
}

function listModels() {
  const lines = ["\n📋 可用视觉模型 （共 " + Object.keys(MODELS).length + " 个）\n"];
  lines.push("─".repeat(95));
  lines.push("  模式      │ 模型                              │ 平台    │ 推理 │ 质量 │ 说明");
  lines.push("  ─────────┼───────────────────────────────────┼─────────┼──────┼──────┼─────");

  const modeOrder = ["fast", "balanced", "quality", "thinking", "ocr"];
  for (const mn of modeOrder) {
    const mode = MODES[mn];
    for (let i = 0; i < mode.models.length; i++) {
      const m = mode.models[i];
      const info = MODELS[m];
      if (!info) continue;
      const label = i === 0 ? mn.padEnd(9) : "  ".padEnd(9);
      const star = info.quality >= 9 ? "★★★★" : info.quality >= 7 ? "★★★" : info.quality >= 5 ? "★★" : "★";
      const prov = info.provider === "ark" ? "🔥豆包" : "💎千问";
      lines.push(`  ${label}│ ${m.padEnd(35)}│ ${prov.padEnd(7)}│ ${info.thinking ? "✅" : "  "} │ ${star} │ ${info.desc}`);
    }
    if (mode.models.length > 0) lines.push(`  ${" ".padEnd(9)}│ ${" ".repeat(35)}│ ${" ".repeat(7)}│      │      │`);
  }

  // 单独展示 OCR 模型家族
  lines.push("  ─────────┼───────────────────────────────────┼─────────┼──────┼──────┼─────");
  lines.push("  📝OCR族   │ 以下为 OCR 专用模型（可在 ocr 模式使用）");
  const ocrModels = Object.entries(MODELS).filter(([_, i]) => i.desc.includes("OCR"));
  for (const [name, info] of ocrModels) {
    const star = info.quality >= 9 ? "★★★★" : info.quality >= 7 ? "★★★" : "★";
    lines.push(`  ${" ".padEnd(9)}│ ${name.padEnd(35)}│ 💎千问 │      │ ${star} │ ${info.desc}`);
  }

  lines.push("─".repeat(95));

  // 统计免费模型
  const freeCount = Object.values(MODELS).filter(i => i.provider === "dashscope").length;
  const arkCount = Object.values(MODELS).filter(i => i.provider === "ark").length;

  lines.push(`\n📊 统计：千问 ${freeCount} 个（均享100万免费额度） | 豆包 ${arkCount} 个（共享50万额度）`);
  lines.push("\n💡 推荐用法：");
  lines.push("  node vision.js photo.jpg                    # auto: 自动选择最优模式");
  lines.push("  node vision.js photo.jpg \"这是什么人\"       # 直接提问，auto自动判断");
  lines.push("  node vision.js photo.jpg --mode fast       # 极速（qwen-vl-plus 免费）");
  lines.push("  node vision.js photo.jpg --mode ocr        # OCR文字提取（专用OCR模型）");
  lines.push("  node vision.js photo.jpg --free            # 优先使用免费额度模型");
  lines.push(`\n💰 免费额度：千问每模型 100万 token，到期 2026/08/25 | 豆包 50万 token`);
  lines.push("  省token技巧：小图+简单问题 ≈ 40 tok/次 | 大图+详细分析 ≈ 800 tok/次\n");
  return lines.join("\n");
}

function getDefaultPrompt(mode, userPrompt) {
  if (userPrompt) return userPrompt;
  const prompts = {
    fast: "请用一句话简洁描述这张图片里的内容。",
    balanced: "这张图片里有什么？用中文简洁回答。",
    quality: "请详细描述这张图片的内容，包括主体、颜色、布局、文字等所有细节。",
    thinking: "请仔细分析这张图片，逐步推理看到了什么。",
    ocr: "请精确提取这张图片中的所有文字内容。",
  };
  return prompts[mode] || prompts.balanced;
}

async function encodeImage(imagePath) {
  if (/^https?:\/\//.test(imagePath)) return { url: imagePath, type: "url", size: null };
  try {
    const data = fs.readFileSync(imagePath);
    const ext = path.extname(imagePath).toLowerCase().slice(1) || "png";
    const mime = { jpg: "jpeg", jpeg: "jpeg", png: "png", gif: "gif", webp: "webp", bmp: "bmp", svg: "svg+xml" }[ext] || "png";
    return { url: `data:image/${mime};base64,${data.toString("base64")}`, type: "base64", size: data.length };
  } catch (e) {
    throw new Error(`无法读取图片: ${imagePath}\n${e.message}`);
  }
}

async function callAPI(provider, model, messages, opts) {
  const config = provider === "ark" ? CONFIG.ark : CONFIG.dashscope;
  const url = provider === "ark"
    ? `${config.baseUrl}/chat/completions`
    : `${config.baseUrl}/v1/chat/completions`;

  const body = { model, messages };
  if (opts.maxTokens) body.max_tokens = opts.maxTokens;

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Authorization": `Bearer ${config.key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await resp.json();
  if (data.error) throw new Error(`[${config.name}] ${data.error.message}`);
  return data;
}

function formatResult(data, modelName, provider, timing, selectedMode) {
  const msg = data.choices?.[0]?.message || {};
  const usage = data.usage || {};
  return {
    model: modelName,
    provider,
    mode: selectedMode,
    content: msg.content,
    reasoning: msg.reasoning_content || null,
    usage: {
      prompt: usage.prompt_tokens || 0,
      completion: usage.completion_tokens || 0,
      total: usage.total_tokens || 0,
      reasoning_tokens: usage.completion_tokens_details?.reasoning_tokens || 0,
    },
    timing: `${timing.toFixed(1)}s`,
  };
}

function showBudget() {
  console.log("\n📊 Vision Pro Token 预算\n");
  const freeModels = Object.values(MODELS).filter(i => i.provider === "dashscope").length;
  console.log(`  💎 千问免费模型: ${freeModels} 个，各 100万 token，到期 2026/08/25`);
  console.log(`     👉 全部免费，优先使用！`);
  console.log(`  🔥 豆包预算:     ${CONFIG.ark.budget.toLocaleString()} token（共享池）`);
  console.log(`\n  预估可用总调用次数（每次 ~100 tok）：`);
  console.log(`     💎 千问: 约 ${(freeModels * CONFIG.dashscope.budget / 100).toLocaleString()} 次（免费）`);
  console.log(`     🔥 豆包: 约 ${(CONFIG.ark.budget / 100).toLocaleString()} 次`);
  console.log("\n  省token技巧：");
  console.log("  • 小图片 + 简单问题 ≈ 40 tok/次 → 优先用 qwen-vl-plus");
  console.log("  • 大图片 + 详细分析 ≈ 800 tok/次 → 用 qwen3-vl-plus 或 qwen-vl-max");
  console.log("  • OCR 提取 → 免费专用模型 qwen-vl-ocr-latest");
  console.log("  • 需要精确命名（动漫/人名）时用 doubao-flash");
  console.log("  • 日常 auto 模式自动优先选免费模型\n");
}

function printResult(result, opts) {
  if (opts.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  const config = result.provider === "ark" ? CONFIG.ark : CONFIG.dashscope;

  console.log(`\n${config.icon} ${config.name} | ${result.model}`);
  console.log(`📝 模式: ${result.mode || "auto"}`);
  if (result.reasoning) {
    console.log(`\n🧠 推理:`);
    console.log(result.reasoning);
    console.log(`\n📋 回答:`);
  }
  console.log(`\n${result.content}\n`);
  console.log("─".repeat(50));
  console.log(`📊 Token: ${result.usage.prompt}(P) + ${result.usage.completion}(C) = ${result.usage.total} tok`);
  if (result.usage.reasoning_tokens > 0) {
    console.log(`   🧠 其中推理: ${result.usage.reasoning_tokens} tok`);
  }
  console.log(`⏱️  耗时: ${result.timing}`);
}

// ===================== 主流程 =====================
async function main() {
  const opts = parseArgs();

  if (opts.listModels) { console.log(listModels()); return; }
  if (opts.showBudget) { showBudget(); return; }

  if (!opts.imagePath) {
    console.log("❌ 请提供图片路径或URL\n");
    console.log("用法: node vision.js <图片路径/URL> [选项]");
    console.log("  或: node vision.js <图片路径/URL> \"你的问题\"");
    console.log("  或: node vision.js --list");
    process.exit(1);
  }

  // 1. 读取图片
  const img = await encodeImage(opts.imagePath);
  const imgSizeKB = img.size ? img.size / 1024 : 0;

  // 2. 智能选择模型
  let modelName, modelInfo, selectedMode;
  if (opts.model) {
    if (!MODELS[opts.model]) throw new Error(`未知模型: ${opts.model}\n使用 --list 查看`);
    modelName = opts.model;
    modelInfo = MODELS[opts.model];
    selectedMode = "自定义";
  } else {
    const decision = selectModel(opts.mode, opts.provider, imgSizeKB, opts.prompt, opts.freeFirst);
    modelName = decision.modelName;
    modelInfo = decision.modelInfo;
    selectedMode = opts.mode === "auto" ? `auto→${decision.selectedMode}` : decision.selectedMode;
  }

  const provider = modelInfo.provider;
  const config = provider === "ark" ? CONFIG.ark : CONFIG.dashscope;
  const effectiveMode = selectedMode === "自定义" ? "balanced" : selectedMode.replace("auto→", "");
  const prompt = getDefaultPrompt(effectiveMode, opts.prompt);

  // 3. 构建消息
  const messages = [{
    role: "user",
    content: [
      { type: "text", text: prompt },
      { type: "image_url", image_url: { url: img.url } },
    ],
  }];

  // 4. 打印请求信息
  if (!opts.json) {
    console.log(`\n${config.icon} ${config.name} | ${modelName}`);
    console.log(`📝 模式: ${selectedMode} | ${imgSizeKB > 0 ? `${imgSizeKB.toFixed(0)}KB, ` : ""}提示: "${prompt}"`);
    console.log("─".repeat(50));
  }

  // 5. 调用 API（带自动容错）
  const startTime = Date.now();
  let data;
  try {
    data = await callAPI(provider, modelName, messages, opts);
  } catch (e) {
    console.error(`\n❌ ${e.message}`);
    if (opts.provider === "auto") {
      const fallbackProv = provider === "ark" ? "dashscope" : "ark";
      const fallback = Object.entries(MODELS).find(([_, i]) => i.provider === fallbackProv)?.[0];
      if (fallback) {
        console.log(`🔄 切换到 ${CONFIG[fallbackProv].name} (${fallback})...`);
        data = await callAPI(fallbackProv, fallback, messages, opts);
        const timing = (Date.now() - startTime) / 1000;
        printResult(formatResult(data, fallback, fallbackProv, timing, selectedMode), opts);
        return;
      }
    }
    process.exit(1);
  }

  const timing = (Date.now() - startTime) / 1000;
  const primaryResult = formatResult(data, modelName, provider, timing, selectedMode);

  // ===== --verify: 文本模型事实核查 =====
  if (opts.verify) {
    const visionText = primaryResult.content || "";
    const verifyProv = provider === "ark" ? "dashscope" : "ark";
    const verifyConfig = CONFIG[verifyProv];

    // 可用的文本模型（用于验证，不需要视觉能力）
    const TEXT_MODELS = {
      ark: ["doubao-seed-1-6-flash-250615", "doubao-1-5-vision-pro-32k-250115"],
      dashscope: ["qwen3-vl-plus", "qwen-vl-plus"]
    };
    const verifyModel = TEXT_MODELS[verifyProv]?.[0];

    if (verifyModel && visionText.length > 10) {
      if (!opts.json) {
        console.log(`\n🔍 事实核查中 (${verifyConfig.name} ${verifyModel})...`);
      }

      try {
        // 构建文本验证消息（不带图片）
        const verifyMessages = [{
          role: "user",
          content: `你是一个事实核查助手。以下是一段图片识别结果的描述，请检查其中的事实性错误（人名、作品名、地名、参数值等），如果有错误请逐条指出并给出正确答案，如果没有错误就说"确认无误"。

图片识别结果："""${visionText}"""`
        }];

        const verifyData = await callAPI(verifyProv, verifyModel, verifyMessages, { ...opts, maxTokens: 512 });
        const verification = verifyData.choices?.[0]?.message?.content || "（验证无返回）";
        const hasErrors = !verification.includes("确认无误") && !verification.includes("正确") && verification.length > 20;

        if (opts.json) {
          primaryResult.verification = {
            method: "text-model-factcheck",
            model: verifyModel,
            provider: verifyProv,
            has_corrections: hasErrors,
            report: verification.slice(0, 500)
          };
        } else {
          if (hasErrors) {
            console.log(`\n⚠️ 事实核查发现可能错误:`);
            console.log(`   📋 ${verification.slice(0, 300).replace(/\n/g, "\n   ")}`);
          } else {
            console.log(`\n✅ 事实核查通过 — 未发现明显错误`);
          }
        }
      } catch (e) {
        if (!opts.json) console.log(`   ⏭️ 验证跳过 (${e.message.slice(0, 50)})`);
      }
    }
  }

  printResult(primaryResult, opts);
}

main().catch(e => {
  console.error(`\n❌ 错误: ${e.message}`);
  process.exit(1);
});
