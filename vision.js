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
 *   --no-verify        跳过自动验证（OCR/简单物体识别默认跳过，问"这是谁"时自动开启）
 *   --task <name>      场景预设：anime / engineering / simple / ocr / scene / tiny（极省）
 *   --format markdown  结构化输出（Markdown格式）
 *   --interactive      交互式追问模式（不退出程序，连续提问）
 *   --budget           查看用量统计
 *
 * 示例:
 *   node vision.js photo.jpg                    # auto 模式，智能选择
 *   node vision.js photo.jpg "这是什么动物"      # 直接提问
 *   node vision.js photo.jpg --task anime       # 动漫场景预设
 *   node vision.js photo.jpg --task engineering  # 工科场景预设
 *   node vision.js photo.jpg --format markdown   # 结构化 Markdown 输出
 *   node vision.js photo.jpg --interactive       # 交互式追问模式
 *   node vision.js --list                        # 查看所有模型
 *   node vision.js --budget                      # 查看用量统计
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { execSync } = require("child_process");

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

// ===================== 场景预设 =====================
const TASK_PRESETS = {
  anime: { label: "🎌 动漫", provider: "ark", mode: "balanced", verify: true, desc: "动漫角色识别，最佳效果" },
  engineering: { label: "🔬 工科", provider: "auto", mode: "balanced", verify: true, desc: "芯片/电路/图表分析" },
  simple: { label: "🖼️ 简单", provider: "ark", mode: "fast", verify: false, desc: "单一物体识别（猫/狗/花）" },
  ocr: { label: "📝 OCR", provider: "auto", mode: "ocr", verify: false, desc: "文字提取" },
  scene: { label: "🌄 场景", provider: "dashscope", mode: "thinking", verify: false, desc: "详细场景描述" },
  tiny: { label: "⚡ 极省", provider: "ark", mode: "fast", verify: false, desc: "最省token模式，适合手机/大批量" },
  explain: { label: "📖 讲解", provider: "auto", mode: "balanced", verify: true, desc: "识别内容并生成详细讲解（历史/原理/背景）" },
};

// ===================== 预算追踪 =====================
const BUDGET_FILE = path.join(__dirname, ".vision_budget.json");
function loadBudget() {
  try { return JSON.parse(fs.readFileSync(BUDGET_FILE, "utf8")); }
  catch { return { total: 0, sessions: [], day: new Date().toISOString().slice(0,10), dayTotal: 0 }; }
}
function saveBudget(b) {
  fs.writeFileSync(BUDGET_FILE, JSON.stringify(b, null, 2));
}
function trackTokens(tokens, model, provider) {
  const b = loadBudget();
  b.total += tokens;
  b.dayTotal += tokens;
  const today = new Date().toISOString().slice(0,10);
  if (b.day !== today) { b.day = today; b.dayTotal = tokens; }
  b.sessions.push({ time: new Date().toISOString(), tokens, model, provider });
  if (b.sessions.length > 1000) b.sessions = b.sessions.slice(-500);
  saveBudget(b);
}
function showBudget() {
  const b = loadBudget();
  const today = new Date().toISOString().slice(0,10);
  if (b.day !== today) { b.day = today; b.dayTotal = 0; }
  const arkBudget = 500_000;
  const dsBudget = 1_000_000;
  console.log(`\n📊 用量统计`);
  console.log("─".repeat(40));
  console.log(`   本月累计: ${b.total.toLocaleString()} tok`);
  console.log(`   今日累计: ${b.dayTotal.toLocaleString()} tok`);
  console.log(`   会话次数: ${b.sessions.length}`);
  console.log(`\n💰 剩余额度（预估）`);
  console.log(`   🔥 豆包: ${(arkBudget - b.total).toLocaleString()} / ${arkBudget.toLocaleString()} tok`);
  console.log(`   💎 千问: ${(dsBudget - b.total).toLocaleString()} / ${dsBudget.toLocaleString()} tok`);
  if (b.sessions.length > 0) {
    console.log(`\n📋 最近5次调用:`);
    b.sessions.slice(-5).forEach(s => {
      console.log(`   ${s.time.slice(5,16)} | ${(s.tokens+'').padStart(5)} tok | ${s.model.slice(0,25)}`);
    });
  }
}

// ===================== 置信度评分 =====================
function computeConfidence(result) {
  const v = result.verification;
  if (!v) return { score: 3, label: "未验证", stars: "★★★☆☆" };
  const cv = v.cross_vision;
  const fc = v.fact_check;

  let score = 3;
  const reasons = [];

  // 交叉视觉
  if (cv?.match === true) { score += 1; reasons.push("双模型一致"); }
  else if (cv?.match === false) { score -= 1; reasons.push("模型有分歧"); }

  // 事实核查
  if (fc?.has_corrections === false) { score += 1; reasons.push("事实核查通过"); }
  else if (fc?.has_corrections === true) { score -= 1; reasons.push("发现事实错误"); }

  // 豆包优先
  if (v?.doubao_preferred === true) { score += 0; reasons.push("豆包结论优先"); }

  score = Math.max(1, Math.min(5, score));
  const stars = "★".repeat(score) + "☆".repeat(5 - score);
  const labels = { 1: "低可信度", 2: "需谨慎", 3: "中等", 4: "较可信", 5: "高可信度" };
  return { score, label: labels[score], stars, reasons };
}

// ===================== 关键词检测 =====================
// 用于 auto 模式智能判断
const NEEDS_PRECISE_NAMING = /谁|名字|名称|叫什么|哪个|角色|人物|哪部|番剧|动漫|电影|品牌|型号|明星|名人|演员/;
const NEEDS_DETAILED_ANALYSIS = /详细|分析|说明|解释|为什么|如何|原理|结构|组成|对比|区别|关系/;
const IS_OCR = /文字|提取|识别|ocr|OCR|文本|阅读|读图|翻译|文档|表格|代码|截图/;
const IS_TABLE_DOC = /表格|文档|报表|表单|发票|合同|论文|报告|书|页|排版/;
const IS_SIMPLE_QUERY = /什么|这是|有没有|是啥|哪个|吗|有.*吗|是不是/;
const IS_SIMPLE_OBJECT = /猫|狗|鸟|花|树|山|水|天空|汽车|房子|人|脸|动物|植物|食物|水果|蔬菜/;
const VERIFY_SKIP = /提取|ocr|OCR|翻译|读图|阅读|文字|识别.*文字|图中.*什么字/;

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
    freeFirst: false, format: null, interactive: false,
  };

  // 列出可用场景预设
  const listTasks = () => {
    console.log("\n📋 可用场景预设:\n");
    for (const [k, v] of Object.entries(TASK_PRESETS)) {
      console.log(`   ${v.label} --task ${k.padEnd(14)} ${v.desc}`);
    }
    console.log(`   🎯 自定义 --task custom        手动指定所有参数`);
    process.exit(0);
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--mode": opts.mode = args[++i] || "auto"; break;
      case "--prompt": opts.prompt = args[++i]; break;
      case "--provider": opts.provider = args[++i] || "auto"; break;
      case "--model": opts.model = args[++i]; break;
      case "--task": {
        const t = args[++i] || "";
        if (t === "list") { listTasks(); }
        const preset = TASK_PRESETS[t];
        if (preset) {
          opts.task = t;
          if (!opts.provider || opts.provider === "auto") opts.provider = preset.provider;
          if (!opts.mode || opts.mode === "auto") opts.mode = preset.mode;
          if (preset.verify) opts.verify = true;
        } else {
          console.error(`❌ 未知场景: ${t}，可用: ${Object.keys(TASK_PRESETS).join(", ")}`);
          process.exit(1);
        }
        break;
      }
      case "--json": opts.json = true; break;
      case "--format": opts.format = args[++i] || null; break;
      case "--interactive": opts.interactive = true; break;
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
  // 自动验证：智能判断是否需要 --verify
  if (!opts.noVerify && !opts.verify && opts.prompt) {
    const p = opts.prompt;

    // 以下情况跳过验证：
    //   - 纯文字提取/OCR
    //   - 简单物体识别（猫/狗/花等只有一个答案）
    //   - 纯描述性请求
    const tooSimple = VERIFY_SKIP.test(p) || IS_OCR.test(p);
    const orJustAnObject = IS_SIMPLE_OBJECT.test(p) && !NEEDS_PRECISE_NAMING.test(p);

    // 以下情况需要验证：
    //   - 问具体是谁/什么角色/什么作品
    //   - 文档/表格（参数值容易出错）
    const needsVerify = NEEDS_PRECISE_NAMING.test(p) || IS_TABLE_DOC.test(p);

    if (needsVerify && !tooSimple && !orJustAnObject) {
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
  // URL 自动下载增强
  if (/^https?:\/\//.test(imagePath)) {
    try {
      const resp = await fetch(imagePath);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const buf = Buffer.from(await resp.arrayBuffer());
      const mime = resp.headers.get("content-type")?.split("/")?.[1] || "png";
      const size = buf.length;
      console.log(`   📥 已下载图片 (${(size/1024).toFixed(0)}KB) 来自 URL`);
      return { url: imagePath, type: "url", size, _buf: buf, _mime: mime };
    } catch (e) {
      throw new Error(`无法下载图片: ${imagePath}\n${e.message}`);
    }
  }
  try {
    let data = fs.readFileSync(imagePath);
    const ext = path.extname(imagePath).toLowerCase().slice(1) || "png";
    const mime = { jpg: "jpeg", jpeg: "jpeg", png: "png", gif: "gif", webp: "webp", bmp: "bmp", svg: "svg+xml" }[ext] || "png";
    let size = data.length;

    // 自动压缩大图（>800KB）
    if (size > 800 * 1024) {
      try {
        const tmpImg = path.join(__dirname, `.tmp_${Date.now()}.${mime}`);
        const tmpPy = path.join(__dirname, `.tmp_py_${Date.now()}.py`);
        const pyScript = `from PIL import Image; import sys
img=Image.open(r"${imagePath.replace(/\\/g,'/')}")
w,h=img.size
if w>1024 or h>1024:
 r=1024/max(w,h)
 img=img.resize((int(w*r),int(h*r)),Image.LANCZOS)
 img.save(r"${tmpImg.replace(/\\/g,'/')}")
 print(f"{w}x{h}->{img.size[0]}x{img.size[1]}")
else:
 print("skip")`;
        fs.writeFileSync(tmpPy, pyScript);
        const out = execSync(`python "${tmpPy}"`, { encoding: "utf8", timeout: 15000 }).trim();
        try { fs.unlinkSync(tmpPy); } catch {}
        if (out.includes("->")) {
          data = fs.readFileSync(tmpImg);
          size = data.length;
          console.log(`   🖼️ 已压缩 ${out} (${(size/1024).toFixed(0)}KB)`);
        }
        try { fs.unlinkSync(tmpImg); } catch {}
      } catch (e) {
        // 压缩失败不阻塞，继续用原图
      }
    }
    return { url: `data:image/${mime};base64,${data.toString("base64")}`, type: "base64", size };
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

/* showBudget moved to budget tracking section */

function printResult(result, opts) {
  // 追踪用量
  if (result.usage?.total) {
    trackTokens(result.usage.total, result.model, result.provider);
  }

  // JSON 模式
  if (opts.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  const config = result.provider === "ark" ? CONFIG.ark : CONFIG.dashscope;

  // 置信度评分
  const conf = computeConfidence(result);

  // 结构化输出 --format
  if (opts.format === "markdown") {
    console.log(`\n## 🤖 识别结果\n`);
    console.log(`${result.content}\n`);
    console.log(`> **模型**: ${config.name} | ${result.model}`);
    console.log(`> **耗时**: ${result.timing} | **Token**: ${result.usage?.total || "?"}`);
    if (conf) console.log(`> **置信度**: ${conf.stars} ${conf.label}`);
    if (result.verification) {
      if (result.verification.cross_vision) {
        console.log(`> **交叉验证**: ${result.verification.cross_vision.match ? "✅ 一致" : "⚠️ 有分歧"}`);
      }
      if (result.verification.fact_check?.has_corrections) {
        console.log(`> **事实核查**: ⚠️ 发现错误`);
      }
    }
    return;
  }

  // 普通模式
  console.log(`\n${config.icon} ${config.name} | ${result.model}`);
  console.log(`📝 模式: ${result.mode || "auto"}`);
  if (conf) console.log(`🎯 置信度: ${conf.stars} ${conf.label}`);
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

  // ===== --verify: 方案C — 双视觉交叉比 + 文本事实核查 =====
  if (opts.verify) {
    const visionText = primaryResult.content || "";
    const crossProv = provider === "ark" ? "dashscope" : "ark";
    const crossConfig = CONFIG[crossProv];

    // 1. 用另一平台的视觉模型再识别一次
    const crossModels = Object.entries(MODELS).filter(([_, i]) => i.provider === crossProv);
    const crossModel = crossModels.find(([n]) => n.includes("flash") || n.includes("plus"))?.[0]
      || crossModels[0]?.[0];

    if (!opts.json) {
      console.log(`\n🔍 交叉验证 (${crossConfig.name} ${crossModel})...`);
    }

    let crossText = "";
    let crossResult = null;
    let doubaoPreferred = false;
    let priorityNote = "";

    try {
      const crossData = await callAPI(crossProv, crossModel, messages, { ...opts, maxTokens: 300 });
      crossText = crossData.choices?.[0]?.message?.content || "";
      crossResult = crossText;

      // 提取实体对比
      const getNames = (t) => [...new Set([
        ...(t.match(/[A-Z][a-z]+(?:\s[A-Z][a-z]+)*/g) || []),
        ...(t.match(/[\u4e00-\u9fff]{2,8}(?:·[\u4e00-\u9fff]{2,8})*/g) || [])
      ])].filter(e => e.length > 1 && e.length < 30);

      const primaryNames = getNames(visionText);
      const crossNames = getNames(crossText);

      const missing = primaryNames.filter(e => !crossNames.some(v => e.includes(v) || v.includes(e)));
      const extra = crossNames.filter(e => !primaryNames.some(v => e.includes(v) || v.includes(e)));
      const visionMatch = missing.length === 0 && extra.length === 0;

      // Doubao 优先策略：当两个平台结果不一致时，优先采纳豆包的结论
      const doubaoInvolved = provider === "ark" || crossProv === "ark";
      doubaoPreferred = !visionMatch && doubaoInvolved;
      priorityNote = "";

      if (doubaoPreferred) {
        const doubaoName = provider === "ark" ? modelName : crossModel;
        priorityNote = `基于基准测试，豆包在命名类识别上更准确，建议优先采纳豆包(${doubaoName})的结果。`;
      }

      if (!opts.json) {
        if (visionMatch) {
          console.log(`   ✅ 双模型结果一致，未发现矛盾`);
        } else {
          console.log(`   ⚠️ 存在不一致：`);
          if (missing.length > 0) console.log(`     主模型独有: ${missing.slice(0,5).join(", ")}`);
          if (extra.length > 0) console.log(`     验证模型独有: ${extra.slice(0,5).join(", ")}`);
          if (priorityNote) console.log(`   💡 ${priorityNote}`);
        }
      }

      // 自动切换：当主模型是千问且豆包验证结果不同时，用豆包完整重识别
      if (doubaoPreferred && provider !== "ark" && crossText.length > 20) {
        if (!opts.json) {
          console.log(`\n🔄 豆包重识别中（原${config.name}识别有偏差）...`);
        }
        try {
          const fullData = await callAPI(crossProv, crossModel, messages, { ...opts, maxTokens: 800 });
          const fullText = fullData.choices?.[0]?.message?.content || crossText;
          const oldContent = primaryResult.content;
          primaryResult.content = `[📌 已自动切换为豆包结论] ${fullText}`;
          primaryResult.model = crossModel;
          primaryResult.provider = crossProv;
          primaryResult._switchedToDoubao = true;
        } catch (e) {
          // 重识别失败，用验证阶段的简短结果
          const oldContent = primaryResult.content;
          primaryResult.content = `[📌 已自动切换为豆包结论] ${crossText}`;
          primaryResult._switchedToDoubao = true;
        }
      }

      // 存储交叉验证结果
      primaryResult._crossCheck = {
        match: visionMatch,
        primaryOnly: missing,
        crossOnly: extra,
        crossSummary: crossText.slice(0, 200)
      };

    } catch (e) {
      if (!opts.json) console.log(`   ⏭️ 交叉验证跳过 (${e.message.slice(0, 50)})`);
    }

    // 2. 文本模型事实核查（仅对主结果）
    const textProv = crossProv; // 用另一家的文本模型
    const textConfig = CONFIG[textProv];
    const TEXT_MODELS = {
      ark: ["doubao-seed-1-6-flash-250615"],
      dashscope: ["qwen3-vl-plus"]
    };
    const textModel = TEXT_MODELS[textProv]?.[0];

    if (textModel && visionText.length > 10) {
      if (!opts.json) {
        console.log(`\n📖 事实核查 (${textConfig.name} ${textModel})...`);
      }

      try {
        const textMessages = [{
          role: "user",
          content: `你是一个事实核查助手。以下是一段图片识别结果描述，请逐条核查其中的事实性错误（人名/作品名/地名/参数值等）。

识别结果："""${visionText}"""

要求：
- 如果全部正确 → 回复"确认无误"
- 如果有错误 → 逐条指出并给出正确答案
- 如果不确定 → 说"无法确认"`
        }];

        const textData = await callAPI(textProv, textModel, textMessages, { ...opts, maxTokens: 512 });
        const textReport = textData.choices?.[0]?.message?.content || "（无返回）";
        const textClean = textReport.replace(/确认无误/g, "").trim();
        const hasIssues = textClean.length > 10 && !textReport.includes("确认无误");

        if (opts.json) {
          const switched = primaryResult._switchedToDoubao || false;
          primaryResult.verification = {
            method: "cross-vision + fact-check",
            doubao_preferred: doubaoPreferred,
            switched_to_doubao: switched,
            priority_note: priorityNote,
            cross_vision: {
              model: crossModel,
              provider: crossProv,
              match: primaryResult._crossCheck?.match ?? "unknown",
              discrepancies: {
                primary_only: primaryResult._crossCheck?.primaryOnly || [],
                cross_only: primaryResult._crossCheck?.crossOnly || []
              }
            },
            fact_check: {
              model: textModel,
              provider: textProv,
              has_corrections: hasIssues,
              report: textReport.slice(0, 500)
            }
          };
        } else {
          if (hasIssues) {
            console.log(`\n⚠️ 事实核查发现可能错误:`);
            console.log(`   ${textReport.slice(0, 300).replace(/\n/g, "\n   ")}`);
          } else {
            console.log(`\n✅ 事实核查通过 — 未发现明显错误`);
          }
        }
      } catch (e) {
        if (!opts.json) console.log(`   ⏭️ 事实核查跳过`);
      }
    }

    // 兜底：如果事实核查未执行但交叉验证有结果，仍然输出验证字段
    if (!primaryResult.verification && primaryResult._crossCheck) {
      const switched = primaryResult._switchedToDoubao || false;
      primaryResult.verification = {
        method: "cross-vision (fact-check skipped)",
        doubao_preferred: doubaoPreferred,
        switched_to_doubao: switched,
        priority_note: priorityNote || "",
        cross_vision: {
          model: crossModel,
          provider: crossProv,
          match: primaryResult._crossCheck?.match ?? "unknown",
          discrepancies: {
            primary_only: primaryResult._crossCheck?.primaryOnly || [],
            cross_only: primaryResult._crossCheck?.crossOnly || []
          }
        }
      };
    }

    // 清理临时字段
    delete primaryResult._crossCheck;
  }

  // ===== --task explain: 智能讲解 =====
  if (opts.task === "explain" && primaryResult.content?.length > 20) {
    const textProv = provider === "ark" ? "dashscope" : "ark";
    const textConfig = CONFIG[textProv];
    const textModel = textProv === "dashscope" ? "qwen3-vl-plus" : "doubao-seed-1-6-flash-250615";
    const visionText = primaryResult.content.slice(0, 600);

    // 判断图片类型，选择讲解方向
    if (!opts.json) {
      console.log(`\n📖 生成讲解中 (${textConfig.name} ${textModel})...`);
    }

    try {
      const explainMessages = [{
        role: "user",
        content: `你是一个知识讲解助手。根据以下图片识别结果，判断这是什么类型的内容，然后做对应的讲解：

识别结果："""${visionText}"""

规则：
1. 如果是**动漫/影视角色** → 简略介绍作品背景、角色定位（100字内）
2. 如果是**建筑/地标** → 介绍历史、特色（100字内）
3. 如果是**工科/电路/芯片** → 介绍功能、原理（100字内）
4. 如果是**动物/植物/食物** → 一句话带过，不需要讲解
5. 如果是**文字/表格/OCR** → 不需要讲解

先一句话判断类型，然后给出讲解。`
      }];

      const explainData = await callAPI(textProv, textModel, explainMessages, { ...opts, maxTokens: 400 });
      const explanation = explainData.choices?.[0]?.message?.content || "";
      const tok = explainData.usage?.total_tokens || 0;
      trackTokens(tok, textModel, textProv);

      const skipTypes = ["不需要讲解", "一句话带过", "食物类型", "动物", "植物", "文字", "OCR", "表格"];
      const shouldSkip = skipTypes.some(s => explanation.includes(s)) && explanation.length < 80;
      if (explanation.length > 20 && !shouldSkip) {
        if (opts.json) {
          primaryResult.explanation = explanation.slice(0, 800);
        } else {
          primaryResult._explanation = explanation;
          primaryResult._explainTokens = tok;
        }
      }
    } catch (e) {
      if (!opts.json) console.log(`   ⏭️ 讲解跳过`);
    }
  }

  printResult(primaryResult, opts);

  // ===== 讲解输出（放在识别结果之后）=====
  if (primaryResult._explanation) {
    console.log(`\n${"─".repeat(50)}`);
    console.log(`📖 知识讲解:`);
    console.log(`${primaryResult._explanation}\n`);
    console.log(`📊 +${primaryResult._explainTokens} tok`);
    delete primaryResult._explanation;
  }

  // ===== --interactive: 交互式追问 =====
  if (opts.interactive && img.url) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    console.log(`\n💬 交互模式已开启（输入 "exit" 退出，输入 "new" 换图）`);

    const ask = () => {
      rl.question("\n你 > ", async (q) => {
        const t = q.trim();
        if (!t || t === "exit") { rl.close(); return; }
        if (t === "new") { console.log("  请重新运行命令加载新图片"); rl.close(); return; }

        const followMessages = [{
          role: "user",
          content: [
            { type: "text", text: t },
            { type: "image_url", image_url: { url: img.url } },
          ],
        }];

        // 根据原提问选择合适的模型
        const followProv = primaryResult.provider || provider;
        const followModel = primaryResult.model || modelName;

        try {
          const start = Date.now();
          const data = await callAPI(followProv, followModel, followMessages, { ...opts, maxTokens: 512 });
          const answer = data.choices?.[0]?.message?.content || "（无回答）";
          const tok = data.usage?.total_tokens || 0;
          trackTokens(tok, followModel, followProv);
          console.log(`\n🤖 ${answer}\n`);
          console.log(`📊 +${tok} tok`);
        } catch (e) {
          console.log(`\n❌ ${e.message.slice(0, 100)}`);
        }

        ask();
      });
    };
    ask();
  }
}

main().catch(e => {
  console.error(`\n❌ 错误: ${e.message}`);
  process.exit(1);
});
