#!/usr/bin/env node
/**
 * Cursor DeepSeek kurulum yardımcısı.
 * API key doğrular, Cursor Models adımlarını basar.
 *
 *   npm run setup:cursor-deepseek
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ENV_PATH = path.join(ROOT, ".env.local");
const BASE_URL = "https://api.deepseek.com";
const MODEL_CANDIDATES = ["deepseek-coder", "deepseek-chat"];

function loadEnvLocal() {
  if (!fs.existsSync(ENV_PATH)) {
    return;
  }
  const content = fs.readFileSync(ENV_PATH, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function probeModel(apiKey, model) {
  const response = await fetch(`${BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: "ping" }],
      max_tokens: 5,
    }),
  });
  return response.ok;
}

function printCursorSteps(model) {
  console.log("");
  console.log("Cursor Models (tek seferlik):");
  console.log("  1. Cursor Settings → Models");
  console.log(`  2. Override OpenAI Base URL: ${BASE_URL}`);
  console.log("  3. OpenAI API Key: .env.local içindeki DEEPSEEK_API_KEY değeri");
  console.log(`  4. + Add Custom Model → ${model} → Verify`);
  console.log(`  5. Restart → sağ alttan ${model} seç`);
  console.log("");
  console.log("Subagent: @deepseek-bulk (model önceden Settings'te eklenmiş olmalı)");
}

async function main() {
  loadEnvLocal();

  if (!fs.existsSync(ENV_PATH)) {
    console.error("❌ .env.local yok.");
    console.error("   cp .env.example .env.local");
    console.error("   DEEPSEEK_API_KEY=... satırını doldur");
    process.exit(1);
  }

  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    console.error("❌ DEEPSEEK_API_KEY tanımlı değil (.env.local).");
    console.error("   DEEPSEEK_API_KEY=...");
    process.exit(1);
  }

  let workingModel = null;
  for (const model of MODEL_CANDIDATES) {
    if (await probeModel(apiKey, model)) {
      workingModel = model;
      break;
    }
  }

  if (!workingModel) {
    console.error("❌ DeepSeek API yanıt vermedi (deepseek-coder / deepseek-chat).");
    process.exit(1);
  }

  console.log(`✅ DeepSeek API OK — model: ${workingModel}`);
  printCursorSteps(workingModel);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
