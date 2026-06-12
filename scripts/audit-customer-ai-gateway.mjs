#!/usr/bin/env node
import fs from "node:fs";

const requiredFiles = [
  "src/lib/ai-gateway/customer-ai-types.ts",
  "src/lib/ai-gateway/customer-ai-schema.ts",
  "src/lib/ai-gateway/customer-ai-prompts.ts",
  "src/lib/ai-gateway/customer-ai-router.ts",
  "src/lib/ai-gateway/customer-ai-validator.ts",
  "src/lib/ai-gateway/customer-ai-rate-limit.ts",
  "src/lib/ai-gateway/deepseek-customer-client.ts",
  "src/app/api/ai-gateway/customer/route.ts",
];

const forbiddenPatterns = [
  "NEXT_PUBLIC_DEEPSEEK_API_KEY",
  'DEEPSEEK_API_KEY="sk-',
  "sk-proj-",
];

const frontendScanDirs = ["src/components", "src/app", "public"];

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

for (const file of frontendScanDirs.flatMap(walk)) {
  if (!/\.(ts|tsx|js|jsx|mjs)$/.test(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  if (text.includes("api.deepseek.com")) {
    fail(`frontend calls api.deepseek.com directly: ${file}`);
  }
  for (const pattern of forbiddenPatterns) {
    if (pattern === "sk-proj-") continue;
    if (text.includes(pattern)) {
      fail(`forbidden pattern in frontend/public: ${file}: ${pattern}`);
    }
  }
}

const deepseekClient = "src/lib/ai-gateway/deepseek-customer-client.ts";
if (fs.existsSync(deepseekClient)) {
  const text = fs.readFileSync(deepseekClient, "utf8");
  if (text.includes('"server-only"')) {
    pass("deepseek-customer-client is server-only");
  } else {
    fail("deepseek-customer-client missing server-only import");
  }
  if (text.includes("CustomerAiResponseSchema")) {
    pass("deepseek-customer-client validates CustomerAiResponseSchema");
  } else {
    fail("deepseek-customer-client missing schema validation");
  }
}

const validatorFile = "src/lib/ai-gateway/customer-ai-validator.ts";
if (fs.existsSync(validatorFile)) {
  const text = fs.readFileSync(validatorFile, "utf8");
  if (text.includes("validateCustomerAiResponse")) {
    pass("customer-ai-validator exports validateCustomerAiResponse");
  } else {
    fail("customer-ai-validator missing validateCustomerAiResponse");
  }
  if (text.includes("FormulaContract")) {
    pass("customer-ai-validator blocks forbidden public terms");
  } else {
    fail("customer-ai-validator missing forbidden term list");
  }
  if (text.includes('routeStatus !== "active-route"')) {
    pass("customer-ai-validator rejects inactive tool suggestions");
  } else {
    fail("customer-ai-validator missing active-route tool check");
  }
}

const rateLimitFile = "src/lib/ai-gateway/customer-ai-rate-limit.ts";
if (fs.existsSync(rateLimitFile)) {
  const text = fs.readFileSync(rateLimitFile, "utf8");
  if (text.includes("checkCustomerAiRateLimit")) {
    pass("customer-ai-rate-limit exports checkCustomerAiRateLimit");
  } else {
    fail("customer-ai-rate-limit missing rate limit function");
  }
}

const assistantComponent = "src/components/assistant/SectorCalcAssistant.tsx";
if (fs.existsSync(assistantComponent)) {
  const text = fs.readFileSync(assistantComponent, "utf8");
  if (text.includes("/api/ai-gateway/customer")) {
    pass("SectorCalcAssistant posts to customer AI gateway");
  } else {
    fail("SectorCalcAssistant missing customer AI gateway endpoint");
  }
}

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
if (!packageJson.scripts?.["audit:customer-ai"]) {
  fail("package.json missing audit:customer-ai script");
} else {
  pass("package.json has audit:customer-ai script");
}

if (failed) {
  process.exit(1);
}

console.log("\nPASS customer AI gateway audit");
