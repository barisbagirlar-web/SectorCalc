#!/usr/bin/env node
import fs from "node:fs";

const requiredFiles = [
  "src/lib/ai/openai-env.ts",
  "src/lib/ai/openai-repair-client.ts",
  "src/lib/ai/deepseek-env.ts",
  "src/lib/ai/deepseek-repair-client.ts",
  "src/lib/ai-repair/repair-schema.ts",
  "src/lib/ai-repair/repair-prompts.ts",
  "src/lib/ai-repair/repair-types.ts",
  "src/lib/ai-repair/repair-fingerprint.ts",
  "src/lib/ai-repair/repair-history-store.ts",
  "src/lib/ai-repair/repair-routing.ts",
  "src/lib/ai-repair/repair-router.ts",
  "src/app/api/ai-repair/analyze/route.ts",
  "scripts/ai-repair/record-repair-outcome.mjs",
];

const forbiddenPatterns = [
  "NEXT_PUBLIC_OPENAI_API_KEY",
  "NEXT_PUBLIC_DEEPSEEK_API_KEY",
  'OPENAI_API_KEY="sk-',
  'DEEPSEEK_API_KEY="sk-',
  "sk-proj-",
];

let failed = false;

function pass(msg) {
  console.log(`PASS: ${msg}`);
}

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failed = true;
}

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    fail(`missing file: ${file}`);
  } else {
    pass(`file exists: ${file}`);
  }
}

const scanDirs = ["src", "app", "components", "public", "messages", "scripts"];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const items = [];

  for (const entry of fs.readdirSync(dir)) {
    const full = `${dir}/${entry}`;
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      items.push(...walk(full));
    } else {
      items.push(full);
    }
  }

  return items;
}

const secretMaskingAllowlist = new Set([
  "src/lib/ai-repair/repair-fingerprint.ts",
  "scripts/ai-repair/record-repair-outcome.mjs",
]);

const SECRET_SCAN_EXCLUDED_FILES = new Set([
  "scripts/audit-ai-repair-layer.mjs",
  "scripts/audit-customer-ai-gateway.mjs",
  "scripts/audit-tool-activation-factory.mjs",
]);

for (const file of scanDirs.flatMap(walk)) {
  if (!/\.(ts|tsx|js|jsx|json|mjs)$/.test(file)) continue;
  if (SECRET_SCAN_EXCLUDED_FILES.has(file)) continue;

  const text = fs.readFileSync(file, "utf8");

  for (const pattern of forbiddenPatterns) {
    if (secretMaskingAllowlist.has(file) && pattern === "sk-proj-") continue;
    if (text.includes(pattern)) {
      fail(`forbidden secret/public key pattern found in ${file}: ${pattern}`);
    }
  }
}

const deepseekClient = "src/lib/ai/deepseek-repair-client.ts";
if (fs.existsSync(deepseekClient)) {
  const text = fs.readFileSync(deepseekClient, "utf8");
  if (text.includes('"server-only"')) {
    pass("DeepSeek client is server-only");
  } else {
    fail("DeepSeek client missing server-only import");
  }
  if (text.includes('baseURL: "https://api.deepseek.com"')) {
    pass("DeepSeek client uses api.deepseek.com baseURL");
  } else {
    fail("DeepSeek client missing baseURL");
  }
}

const repairRouter = "src/lib/ai-repair/repair-router.ts";
if (fs.existsSync(repairRouter)) {
  const text = fs.readFileSync(repairRouter, "utf8");
  if (text.includes("getAiRepairProvider") && text.includes('provider === "deepseek"')) {
    pass("repair-router selects provider via AI_REPAIR_PROVIDER");
  } else {
    fail("repair-router missing provider selection");
  }
  if (text.includes("decideRepairModel") && text.includes('"human-review"')) {
    pass("repair-router supports human-review routing");
  } else {
    fail("repair-router missing human-review routing");
  }
  if (
    text.includes("Repair fingerprint:") &&
    text.includes("Historical flash failures:") &&
    text.includes("Historical pro failures:")
  ) {
    pass("repair-router includes fingerprint/history riskNotes");
  } else {
    fail("repair-router missing fingerprint/history riskNotes");
  }
}

const repairRouting = "src/lib/ai-repair/repair-routing.ts";
if (fs.existsSync(repairRouting)) {
  const text = fs.readFileSync(repairRouting, "utf8");
  if (text.includes("deterministicGateRequired: true")) {
    pass("repair-routing enforces deterministicGateRequired");
  } else {
    fail("repair-routing missing deterministicGateRequired");
  }
  if (text.includes('"human-review"')) {
    pass("repair-routing defines human-review tier");
  } else {
    fail("repair-routing missing human-review tier");
  }
  if (text.includes("summarizeRepairHistory")) {
    pass("repair-routing uses repair history summary");
  } else {
    fail("repair-routing missing repair history summary");
  }
  if (text.includes("AI_REPAIR_FLASH_FAILURE_THRESHOLD")) {
    pass("repair-routing reads flash failure threshold");
  } else {
    fail("repair-routing missing flash failure threshold");
  }
}

const deepseekEnv = "src/lib/ai/deepseek-env.ts";
if (fs.existsSync(deepseekEnv)) {
  const text = fs.readFileSync(deepseekEnv, "utf8");
  if (text.includes("deepseek-v4-flash")) {
    pass("deepseek-env defaults flash model to deepseek-v4-flash");
  } else {
    fail("deepseek-env missing deepseek-v4-flash default");
  }
  if (text.includes("deepseek-v4-pro")) {
    pass("deepseek-env defaults pro model to deepseek-v4-pro");
  } else {
    fail("deepseek-env missing deepseek-v4-pro default");
  }
  if (text.includes("AI_REPAIR_ROUTING_MODE")) {
    pass("deepseek-env reads AI_REPAIR_ROUTING_MODE");
  } else {
    fail("deepseek-env missing AI_REPAIR_ROUTING_MODE");
  }
}

const apiRoute = "src/app/api/ai-repair/analyze/route.ts";
if (fs.existsSync(apiRoute)) {
  const text = fs.readFileSync(apiRoute, "utf8");
  if (text.includes("provider: process.env.AI_REPAIR_PROVIDER")) {
    pass("API route returns provider in success response");
  } else {
    fail("API route missing provider field");
  }
  if (text.includes("repairId: result.repairId") && text.includes("fingerprint: result.fingerprint")) {
    pass("API route returns repairId and fingerprint");
  } else {
    fail("API route missing repairId/fingerprint fields");
  }
}

const promptFile = "src/lib/ai-repair/repair-prompts.ts";
if (fs.existsSync(promptFile)) {
  const text = fs.readFileSync(promptFile, "utf8");

  const requiredPromptPhrases = [
    "Final truth is deterministic tests",
    "Never suggest exposing API keys to frontend",
    "Never claim the fix is complete",
  ];

  for (const phrase of requiredPromptPhrases) {
    if (!text.includes(phrase)) {
      fail(`missing repair safety phrase: ${phrase}`);
    }
  }
}

const envExample = ".env.example";
if (fs.existsSync(envExample)) {
  const text = fs.readFileSync(envExample, "utf8");
  for (const key of [
    "OPENAI_API_KEY",
    "OPENAI_REPAIR_MODEL",
    "AI_MAX_INPUT_CHARS",
    "DEEPSEEK_API_KEY",
    "DEEPSEEK_REPAIR_MODEL",
    "DEEPSEEK_REPAIR_PRO_MODEL",
    "AI_REPAIR_PROVIDER",
    "AI_REPAIR_ROUTING_MODE",
    "AI_REPAIR_FLASH_TARGET",
    "AI_REPAIR_PRO_TARGET",
    "AI_REPAIR_HUMAN_REVIEW_TARGET",
    "AI_REPAIR_ESCALATION_ENABLED",
    "AI_REPAIR_HISTORY_ENABLED",
    "AI_REPAIR_FLASH_FAILURE_THRESHOLD",
    "AI_REPAIR_PRO_FAILURE_THRESHOLD",
    "AI_REPAIR_HISTORY_MAX_DAYS",
  ]) {
    if (!text.includes(key)) {
      fail(`.env.example missing ${key}`);
    } else {
      pass(`.env.example documents ${key}`);
    }
  }
}

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
if (!packageJson.scripts?.["audit:ai-repair"]) {
  fail("package.json missing audit:ai-repair script");
} else {
  pass("package.json has audit:ai-repair script");
}
if (!packageJson.scripts?.["ai:repair:record"]) {
  fail("package.json missing ai:repair:record script");
} else {
  pass("package.json has ai:repair:record script");
}

const gitignore = ".gitignore";
if (fs.existsSync(gitignore)) {
  const text = fs.readFileSync(gitignore, "utf8");
  if (text.includes(".sectorcalc/")) {
    pass(".gitignore excludes .sectorcalc/");
  } else {
    fail(".gitignore missing .sectorcalc/");
  }
  if (text.includes("ai-repair-history.jsonl")) {
    pass(".gitignore excludes ai-repair-history.jsonl");
  } else {
    fail(".gitignore missing ai-repair-history.jsonl");
  }
}

const recordScript = "scripts/ai-repair/record-repair-outcome.mjs";
if (fs.existsSync(recordScript)) {
  const text = fs.readFileSync(recordScript, "utf8");
  if (text.includes("sanitizeReason")) {
    pass("record-repair-outcome script sanitizes failureReason");
  } else {
    fail("record-repair-outcome script missing sanitizeReason");
  }
  if (text.includes("appendFileSync") && !text.includes("writeFileSync")) {
    pass("record-repair-outcome script appends JSONL without rewrite");
  } else {
    fail("record-repair-outcome script must append-only JSONL");
  }
}

const fingerprintFile = "src/lib/ai-repair/repair-fingerprint.ts";
if (fs.existsSync(fingerprintFile)) {
  const text = fs.readFileSync(fingerprintFile, "utf8");
  if (text.includes("Repair fingerprint is intentionally NOT a unique request id")) {
    pass("repair-fingerprint documents non-unique fingerprint semantics");
  } else {
    fail("repair-fingerprint missing fingerprint semantics comment");
  }
}

const historyStore = "src/lib/ai-repair/repair-history-store.ts";
if (fs.existsSync(historyStore)) {
  const text = fs.readFileSync(historyStore, "utf8");
  if (text.includes('"server-only"')) {
    pass("repair-history-store is server-only");
  } else {
    fail("repair-history-store missing server-only import");
  }
  if (text.includes("file-based and synchronous")) {
    pass("repair-history-store documents sync JSONL design");
  } else {
    fail("repair-history-store missing sync JSONL design comment");
  }
}

const repairTypes = "src/lib/ai-repair/repair-types.ts";
if (fs.existsSync(repairTypes)) {
  const text = fs.readFileSync(repairTypes, "utf8");
  const entryMatch = text.match(
    /export type RepairHistoryEntry = \{[\s\S]*?\n\};/
  );
  const entryBlock = entryMatch?.[0] ?? "";
  const forbiddenHistoryFields = ["rawOutput", "output", "env", "apiKey", "secret"];
  const hasForbiddenField = forbiddenHistoryFields.some((field) =>
    new RegExp(`\\b${field}\\??:`).test(entryBlock)
  );
  if (entryBlock && !hasForbiddenField) {
    pass("RepairHistoryEntry excludes raw output/env/secret fields");
  } else {
    fail("RepairHistoryEntry must not define rawOutput/output/env/apiKey/secret fields");
  }
}

if (failed) {
  process.exit(1);
}

console.log("\nPASS ai repair layer audit");
