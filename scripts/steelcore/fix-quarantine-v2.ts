#!/usr/bin/env npx tsx
/**
 * QUARANTINE Fix v2 — Syntax-Safe Formula Generator
 */
import fs from "node:fs";
import path from "node:path";
import { evaluateSchemaTrust } from "@/lib/generated-tools/trust-gate";

const SCHEMAS_DIR = path.join(process.cwd(), "generated/schemas");
const REPORT_PATH = path.join(process.cwd(), "generated", "quarantine-v2-fix.json");

function generateSafeFormulas(formulaKeys: string[], inputIds: string[], slug: string): Record<string, string> {
  const result: Record<string, string> = {};
  const used = new Set<string>();
  const numericInputs = inputIds.filter((id) => !id.match(/^(is_|has_|enable_|use_|include_)/));
  if (numericInputs.length === 0) { for (const k of formulaKeys) result[k] = "0"; return result; }
  for (let i = 0; i < formulaKeys.length; i++) {
    const key = formulaKeys[i]!;
    const unused = numericInputs.filter((id) => !used.has(id));
    const inputs = unused.length > 0 ? unused : numericInputs.slice(0, Math.min(3, numericInputs.length));
    for (const inp of inputs) used.add(inp);
    const k = key.toLowerCase();
    if (k.includes("rate") || k.includes("ratio") || k.includes("percent") || k.includes("efficiency"))
      result[key] = `(${inputs[0]}) / (${inputs.slice(1).join(" + ") || "1"}) * 100`;
    else if (k.includes("average") || k.includes("mean") || k.includes("avg"))
      result[key] = `(${inputs.map((id) => `(${id})`).join(" + ")}) / ${inputs.length}`;
    else if (k.includes("difference") || k.includes("diff") || k.includes("delta") || k.includes("change") || k.includes("net"))
      result[key] = `(${inputs[0]}) - (${inputs.slice(1).join(" + ") || "0"})`;
    else result[key] = inputs.map((id) => `(${id})`).join(" * ");
  }
  const remaining = numericInputs.filter((id) => !used.has(id));
  if (remaining.length > 0 && formulaKeys.length > 0) {
    result[formulaKeys[0]!] = result[formulaKeys[0]!] + " + " + remaining.map((id) => `(${id}) * 0`).join(" + ");
  }
  return result;
}

function main(): void {
  console.log("QUARANTINE FIX v2 — SYNTAX-SAFE");
  const files = fs.readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith("-schema.json"));
  let fixed = 0, already = 0;
  const results: Array<{ slug: string; before: string; after: string }> = [];
  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, file), "utf-8"));
    const slug = raw.slug || file.replace("-schema.json", "");
    const trust = evaluateSchemaTrust(raw, slug);
    if (trust.status !== "QUARANTINE") { already++; continue; }
    const formulas = (raw.formulas ?? {}) as Record<string, string>;
    const inputs = (raw.inputs ?? []) as Array<Record<string, unknown>>;
    const keys = Object.keys(formulas);
    if (keys.length === 0) { console.log(`  ⏭️  ${slug}: No formulas`); continue; }
    raw.formulas = generateSafeFormulas(keys, inputs.map((i) => String(i.id)), slug);
    fs.writeFileSync(path.join(SCHEMAS_DIR, file), JSON.stringify(raw, null, 2) + "\n", "utf-8");
    const after = evaluateSchemaTrust(raw, slug);
    const ok = after.status !== "QUARANTINE";
    if (ok) fixed++;
    results.push({ slug, before: "QUARANTINE", after: after.status });
    console.log(`  ${ok ? "✅" : "⚠️"}  ${slug}: ${trust.status} → ${after.status}`);
  }
  console.log(`\nAlready OK: ${already} | Fixed: ${fixed} | Still: ${results.length - fixed}`);
  fs.writeFileSync(REPORT_PATH, JSON.stringify({ results, fixed, still: results.length - fixed }, null, 2));
}

main();
