#!/usr/bin/env npx tsx
/**
 * QUARANTINE — DeepSeek Formula Completion Batch
 *
 * For each QUARANTINE schema where formulas use only a subset of inputs,
 * this script sends the schema to DeepSeek to generate complete formulas
 * that use ALL available inputs correctly.
 */
import fs from "node:fs";
import path from "node:path";
import { evaluateSchemaTrust } from "@/lib/generated-tools/trust-gate";
import { loadEnvLocal } from "../deepseek/load-env";

loadEnvLocal();

const SCHEMAS_DIR = path.join(process.cwd(), "generated/schemas");
const REPORT_PATH = path.join(process.cwd(), "generated", "quarantine-deepseek-fix.json");

type QSchema = { slug: string; file: string; schema: Record<string, unknown> };
type FixResult = { slug: string; before: string; after: string; fixed: boolean; error?: string };

/* ── Phase 1: Collect QUARANTINE schemas ──────── */

function collectQuarantine(): QSchema[] {
  const files = fs.readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith("-schema.json"));
  const result: QSchema[] = [];

  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, file), "utf-8"));
    const slug = raw.slug || file.replace("-schema.json", "");
    const trust = evaluateSchemaTrust(raw, slug);
    if (trust.status === "QUARANTINE" && trust.issues.some((i) => i.includes("incomplete domain model"))) {
      result.push({ slug, file, schema: raw });
    }
  }

  return result;
}

/* ── Phase 2: DeepSeek prompt ──────────────────── */

function buildDeepSeekPrompt(q: QSchema): string {
  const s = q.schema;
  const inputs = (s.inputs ?? []) as Array<Record<string, unknown>>;
  const formulas = (s.formulas ?? {}) as Record<string, string>;
  const outputs = (s.outputs ?? {}) as Record<string, unknown>;
  const name = (s.toolName as string) || q.slug;

  return `You are a Senior Industrial Engineer. Fix the calculator formulas below so they use ALL available inputs correctly.

Tool: "${name}"
Slug: "${q.slug}"

Available inputs (id | label | type):
${inputs.map((i) => `  ${i.id} | ${i.label} | ${i.type ?? "number"}`).join("\n")}

Current formulas (${Object.keys(formulas).length} formula(s)):
${Object.entries(formulas).map(([k, v]) => `  ${k} = ${v}`).join("\n")}

Current primary output: ${(outputs.primary as string) ?? "N/A"}

Rule: Generate a complete set of formulas where EVERY input variable is used in at least one formula. Keep existing formula keys. Use standard math operators (+, -, *, /, **). Use Math.pow, Math.sqrt if needed.

Respond ONLY with JSON:
{
  "formulas": { "existing_key": "expression_using_all_relevant_inputs", ... }
}`;
}

/* ── Phase 3: DeepSeek call ────────────────────── */

async function callDeepSeekForFix(q: QSchema): Promise<Record<string, string> | null> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;

  const prompt = buildDeepSeekPrompt(q);

  try {
    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are a Senior Industrial Engineer. Respond ONLY with valid JSON. No markdown fences." },
          { role: "user", content: prompt },
        ],
        temperature: 0.1,
        max_tokens: 2000,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`  API error ${res.status}: ${text.substring(0, 100)}`);
      return null;
    }

    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = data?.choices?.[0]?.message?.content?.trim();
    if (!content) return null;

    // Strip markdown
    const cleaned = content.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
    const parsed = JSON.parse(cleaned);
    return parsed.formulas as Record<string, string>;
  } catch (err: unknown) {
    console.error(`  Fetch error: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

/* ── Main ──────────────────────────────────────── */

async function main(): Promise<void> {
  console.log("QUARANTINE DEEPSEEK FIX PIPELINE");
  console.log("=".repeat(60));

  const schemas = collectQuarantine();
  console.log(`\n📡 Collected ${schemas.length} QUARANTINE schemas (incomplete domain model)`);

  if (!process.env.DEEPSEEK_API_KEY) {
    console.log("\n⚠️  No DEEPSEEK_API_KEY. Running RULE-BASED fix only.");
  }

  const results: FixResult[] = [];
  let fixedCount = 0;
  let skipCount = 0;

  for (let i = 0; i < schemas.length; i++) {
    const q = schemas[i]!;
    process.stdout.write(`\n[${i + 1}/${schemas.length}] ${q.slug}... `);

    if (!process.env.DEEPSEEK_API_KEY) {
      results.push({ slug: q.slug, before: "QUARANTINE", after: "QUARANTINE", fixed: false, error: "No API key" });
      console.log("⏭️  No API key");
      skipCount++;
      continue;
    }

    // Call DeepSeek
    const newFormulas = await callDeepSeekForFix(q);
    if (!newFormulas) {
      results.push({ slug: q.slug, before: "QUARANTINE", after: "QUARANTINE", fixed: false, error: "DeepSeek returned null" });
      console.log("❌ DeepSeek failed");
      skipCount++;
      continue;
    }

    // Apply formulas
    q.schema.formulas = newFormulas;
    fs.writeFileSync(path.join(SCHEMAS_DIR, q.file), JSON.stringify(q.schema, null, 2) + "\n", "utf-8");

    // Re-validate
    const trust = evaluateSchemaTrust(q.schema, q.slug);
    results.push({
      slug: q.slug,
      before: "QUARANTINE",
      after: trust.status,
      fixed: trust.status !== "QUARANTINE",
    });

    if (trust.status !== "QUARANTINE") {
      fixedCount++;
      console.log(`✅ ${trust.status} (fixed)`);
    } else {
      console.log(`⚠️  Still QUARANTINE: ${trust.issues[0]?.substring(0, 80) ?? "unknown"}`);
    }

    // Rate limit protection
    if (i < schemas.length - 1) await new Promise((r) => setTimeout(r, 1000));
  }

  // Final summary
  console.log("\n" + "=".repeat(60));
  console.log("FIX SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total: ${schemas.length}`);
  console.log(`Fixed (PASS/WARN): ${fixedCount}`);
  console.log(`Skipped/failed: ${skipCount}`);

  const report = { timestamp: new Date().toISOString(), total: schemas.length, fixed: fixedCount, skipped: skipCount, results };
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf-8");
  console.log(`\nReport: ${REPORT_PATH}`);
}

main().catch((err) => {
  console.error("FATAL:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
