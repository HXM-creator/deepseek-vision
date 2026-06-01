#!/usr/bin/env node
/**
 * DeepSeek Vision MCP Server
 * 
 * MCP (Model Context Protocol) server.
 * Exposes vision analysis as MCP tools for any MCP-compatible client.
 *
 * Usage with MCP clients (Claude Desktop, etc.):
 *   Add to client config:
 *   {
 *     "mcpServers": {
 *       "deepseek-vision": {
 *         "command": "node",
 *         "args": ["path/to/mcp-vision-server.js"]
 *       }
 *     }
 *   }
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ===================== Configuration =====================
const VISION_SCRIPT = path.join(__dirname, "vision.js");
const VALID_MODES = ["auto", "fast", "balanced", "quality", "thinking", "ocr"];
const VALID_PROVIDERS = ["auto", "ark", "dashscope"];

// ===================== MCP Protocol =====================

function sendMessage(msg) {
  process.stdout.write(JSON.stringify(msg) + "\n");
}

function sendError(id, message) {
  sendMessage({
    jsonrpc: "2.0",
    id,
    error: { code: -32000, message }
  });
}

function sendResult(id, result) {
  sendMessage({
    jsonrpc: "2.0",
    id,
    result
  });
}

// ===================== Tool Definitions =====================

const TOOLS = [
  {
    name: "vision_analyze",
    description: "Analyze an image using AI vision models (supports Doubao + Qwen). Use for: anime/game character identification, celebrity recognition, landmark identification, engineering diagrams, scene understanding, OCR, chart reading, general image description.",
    inputSchema: {
      type: "object",
      properties: {
        image_path: {
          type: "string",
          description: "Path to the image file (absolute or relative to workspace)"
        },
        question: {
          type: "string",
          description: "What to ask about the image. e.g. 'Who is this?', 'Describe this scene', 'What does this chart show?'",
          default: "请描述这张图片的内容"
        },
        provider: {
          type: "string",
          enum: VALID_PROVIDERS,
          description: "AI provider: 'ark' (Doubao, best for anime), 'dashscope' (Qwen, best for detailed scenes), 'auto' (automatic)",
          default: "auto"
        },
        mode: {
          type: "string",
          enum: VALID_MODES,
          description: "Analysis mode: 'auto' (smart select), 'fast' (quick), 'balanced', 'quality' (high quality), 'thinking' (deep reasoning), 'ocr' (text extraction)",
          default: "auto"
        },
        verify: {
          type: "boolean",
          description: "Enable text fact-checking after vision analysis (auto-enabled for 'who/what' questions)",
          default: false
        },
        free_first: {
          type: "boolean",
          description: "Prefer free-tier Qwen models when possible",
          default: false
        }
      },
      required: ["image_path"]
    }
  },
  {
    name: "vision_list_models",
    description: "List all available vision models with their quality, speed, and provider info",
    inputSchema: {
      type: "object",
      properties: {}
    }
  }
];

// ===================== Tool Handlers =====================

function handleToolCall(id, name, args) {
  switch (name) {
    case "vision_analyze":
      return handleVisionAnalyze(id, args);
    case "vision_list_models":
      return handleListModels(id);
    default:
      sendError(id, `Unknown tool: ${name}`);
  }
}

async function handleVisionAnalyze(id, args) {
  const { image_path, question, provider, mode, free_first, verify } = args;

  // Validate image path
  const imgPath = path.resolve(image_path);
  if (!fs.existsSync(imgPath)) {
    return sendError(id, `Image not found: ${imgPath}`);
  }

  // Build command
  let cmd = `node "${VISION_SCRIPT}" "${imgPath}"`;
  if (question) cmd += ` "${question.replace(/"/g, '\\"')}"`;
  if (provider && provider !== "auto") cmd += ` --provider ${provider}`;
  if (mode && mode !== "auto") cmd += ` --mode ${mode}`;
  if (free_first) cmd += " --free";
  if (verify) cmd += " --verify";
  cmd += " --json";

  try {
    const output = execSync(cmd, {
      encoding: "utf-8",
      timeout: 60000,
      env: { ...process.env }
    });

    const result = JSON.parse(output);

    sendResult(id, {
      content: [
        {
          type: "text",
          text: result.content || "No analysis produced"
        }
      ],
      model: result.model,
      provider: result.provider,
      mode: result.mode,
      tokens: result.usage?.total || 0,
      timing: result.timing
    });
  } catch (e) {
    // Try to extract partial JSON from error output
    const stderr = e.stderr || "";
    const stdout = e.stdout || "";
    const combined = stdout + stderr;
    
    // Look for JSON in output
    const jsonMatch = combined.match(/\{[\s\S]*"model"[\s\S]*"content"[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const result = JSON.parse(jsonMatch[0]);
        return sendResult(id, {
          content: [{ type: "text", text: result.content || "Partial result" }],
          model: result.model,
          provider: result.provider
        });
      } catch (_) {}
    }

    sendError(id, `Vision analysis failed: ${e.message}\n${combined.slice(-500)}`);
  }
}

function handleListModels(id) {
  try {
    const output = execSync(`node "${VISION_SCRIPT}" --list`, {
      encoding: "utf-8",
      timeout: 10000
    });
    sendResult(id, {
      content: [{ type: "text", text: output }]
    });
  } catch (e) {
    sendError(id, `Failed to list models: ${e.message}`);
  }
}

// ===================== Main Loop =====================

let buffer = "";

process.stdin.on("data", (chunk) => {
  buffer += chunk.toString();
  const lines = buffer.split("\n");
  buffer = lines.pop() || "";

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const msg = JSON.parse(line);
      handleMessage(msg);
    } catch (e) {
      // ignore malformed JSON
    }
  }
});

function handleMessage(msg) {
  if (msg.jsonrpc !== "2.0") return;

  switch (msg.method) {
    case "initialize":
      sendResult(msg.id, {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: "deepseek-vision",
          version: "1.0.0"
        }
      });
      break;

    case "notifications/initialized":
      // Nothing to do
      break;

    case "tools/list":
      sendResult(msg.id, { tools: TOOLS });
      break;

    case "tools/call":
      handleToolCall(msg.id, msg.params.name, msg.params.arguments);
      break;

    default:
      sendError(msg.id, `Method not supported: ${msg.method}`);
  }
}

// Send initial startup message
console.error("🧠 DeepSeek Vision MCP Server ready");
console.error(`📁 Vision script: ${VISION_SCRIPT}`);
console.error("💡 Available tools: vision_analyze, vision_list_models");
