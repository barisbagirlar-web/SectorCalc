#!/usr/bin/env node
/**
 * ERT-0 — DeepSeek repair suggestion skeleton (no auto patch / commit).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const REPORT_PATH = join(ROOT, "scripts/.cache/runtime-trust-engine-report.json");
const OUTPUT_PATH = join(ROOT, "scripts/.cache/deepseek-repair-suggestions.json");

function topRisky(items, limit = 15) {
  return (items ?? [])
    .filter((item) => item.status !== "ready" || !item.formulaGateEligible)
    .slice(0, limit);
}

async function suggestWithDeepSeek(riskyTools) {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    return { available: false, suggestions: [] };
  }

  const prompt = {
    role: "system",
    content:
      "You are SectorCalc offline repair advisor. Return JSON only. Do not patch code. Suggest root cause, files, label fixes, validation gaps, and safe-state actions.",
  };

  const user = {
    role: "user",
    content: JSON.stringify({
      task: "runtime_trust_repair_suggestions",
      tools: riskyTools.map((tool) => ({
        slug: tool.slug,
        route: tool.route,
        findings: tool.findings,
        recommendedAction: tool.recommendedAction,
      })),
      requiredShape: {
        suggestions: [
          {
            slug: "string",
            rootCause: "string",
            suggestedFiles: ["string"],
            labelFixes: ["string"],
            validationNotes: "string",
            safeStateAction: "string",
          },
        ],
      },
    }),
  };

  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.AI_REPAIR_FLASH_MODEL || "deepseek-chat",
      messages: [prompt, user],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    throw new Error(`DeepSeek HTTP ${res.status}`);
  }

  const payload = await res.json();
  const raw = payload.choices?.[0]?.message?.content ?? "{}";
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = { suggestions: [], parseError: true, rawPreview: raw.slice(0, 500) };
  }

  return { available: true, suggestions: parsed.suggestions ?? [], raw: parsed };
}

async function main() {
  if (!existsSync(REPORT_PATH)) {
    console.log("suggest:runtime-repair — no trust report, exit 0");
    process.exit(0);
  }

  const report = JSON.parse(readFileSync(REPORT_PATH, "utf8"));
  const risky = topRisky(report.items);

  let result;
  try {
    result = await suggestWithDeepSeek(risky);
  } catch (error) {
    result = {
      available: false,
      error: error instanceof Error ? error.message : String(error),
      suggestions: [],
    };
  }

  const output = {
    generatedAt: new Date().toISOString(),
    riskyCount: risky.length,
    deepseekAvailable: result.available,
    suggestions: result.suggestions,
    error: result.error ?? null,
    policy: "human_approval_required_no_auto_patch",
  };

  mkdirSync(join(ROOT, "scripts/.cache"), { recursive: true });
  writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf8");

  console.log("=== DeepSeek Repair Suggestions ===");
  console.log(`risky tools: ${risky.length}`);
  console.log(`deepseek: ${result.available ? "available" : "unavailable"}`);
  console.log(`output: ${OUTPUT_PATH}`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(0);
});
