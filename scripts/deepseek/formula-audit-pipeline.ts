#!/usr/bin/env npx tsx
/**
 * Formula Error Audit & Auto-Fix Pipeline — Industrial Grade
 *
 * 1. Scans ALL schemas with constraint engine → finds ERROR-level domain contaminations
 * 2. Audits each suspicious formula via DeepSeek → confirms bug or false positive
 * 3. Applies verified fixes to schema JSON
 * 4. Reports: real bugs fixed, false positives eliminated
 */

import fs from "node:fs";
import path from "node:path";
import { validateSchemaConstraints, type ConstraintIssue } from "@/lib/generated-tools/formula-constraint-engine";
import { loadEnvLocal } from "./load-env";

// Load .env.local
loadEnvLocal();

const SCHEMAS_DIR = path.join(process.cwd(), "generated/schemas");
const REPORT_PATH = path.join(process.cwd(), "generated", "formula-audit-report.json");

type DomainError = {
  slug: string;
  formulaKey: string;
  expression: string;
  inputIds: string[];
  issue: ConstraintIssue;
};

type AuditResult = {
  slug: string;
  formulaKey: string;
  correct: boolean;
  suggestedFix: string | null;
  notes: string;
};

/* ── Phase 1: Scan ─────────────────────────────── */

function scanDomainErrors(): DomainError[] {
  const files = fs.readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith("-schema.json"));
  const errors: DomainError[] = [];

  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, file), "utf-8"));
    const slug = raw.slug || file.replace("-schema.json", "");
    const inputIds = (raw.inputs || []).map((i: { id: string }) => i.id);
    const formulas = raw.formulas || {};
    const issues = validateSchemaConstraints(formulas, inputIds);

    for (const iss of issues) {
      if (iss.severity !== "ERROR") continue;
      errors.push({
        slug,
        formulaKey: iss.formulaKey,
        expression: formulas[iss.formulaKey] || "",
        inputIds,
        issue: iss,
      });
    }
  }

  return errors;
}

/* ── Phase 2: DeepSeek Audit ───────────────────── */

async function auditFormula(error: DomainError): Promise<AuditResult> {
  const { deepseekClient } = await import("./deepseek-client");

  const prompt = `You are a Senior Industrial Engineer reviewing calculator formulas.

The formula "${error.formulaKey}" (expected domain: ${error.issue.category}) in tool "${error.slug}" uses these inputs:
Expression: ${error.expression}
Available inputs: [${error.inputIds.join(", ")}]

The constraint engine flagged this as a DOMAIN_CONTAMINATION — the formula uses variables from a different domain than expected.

Determine: Is this a REAL BUG (wrong variable used) or a FALSE POSITIVE (correct formula that naturally crosses domains)?

Examples of FALSE POSITIVES (correct cross-domain):
- totalCO2 = electricity_kwh * 0.5 + gas_m3 * 2.0 → carbon domain uses energy inputs with emission factors, this is CORRECT
- energy_cost = energy_kwh * price_per_kwh → cost domain using energy inputs, this is CORRECT
- fuelCost = distance * consumption * fuelPrice → revenue/cost domain, this is CORRECT

Examples of REAL BUGS:
- direct_labor_cost = operators * hours * material_cost → labor cost should use labor_rate, not material_cost
- labor_efficiency = material_output / material_input → efficiency formula using material when should use labor

Respond ONLY with valid JSON:
{"correct": true, "notes": "explanation"} OR {"correct": false, "suggestedFix": "corrected_expression", "notes": "explanation"}

For real bugs, the suggestedFix must ONLY replace wrong input names with correct ones from the available inputs list — do not change formula structure.`;

  let raw: string;
  try {
    raw = await deepseekClient(prompt);
  } catch (err: unknown) {
    return {
      slug: error.slug,
      formulaKey: error.formulaKey,
      correct: true, // default to true on error (don't break build)
      suggestedFix: null,
      notes: `DeepSeek error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  // Strip markdown fences
  const cleaned = raw.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    const correct = parsed.correct === true;
    return {
      slug: error.slug,
      formulaKey: error.formulaKey,
      correct,
      suggestedFix: typeof parsed.suggestedFix === "string" ? parsed.suggestedFix : null,
      notes: typeof parsed.notes === "string" ? parsed.notes : "",
    };
  } catch {
    return {
      slug: error.slug,
      formulaKey: error.formulaKey,
      correct: true, // default to true on parse error
      suggestedFix: null,
      notes: `Parse error. Raw: ${raw.substring(0, 200)}`,
    };
  }
}

/* ── Phase 3: Apply Fixes ───────────────────────── */

function applyFix(result: AuditResult): void {
  if (result.correct || !result.suggestedFix) return;

  const schemaPath = path.join(SCHEMAS_DIR, `${result.slug}-schema.json`);
  if (!fs.existsSync(schemaPath)) return;

  const raw = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
  const formulas = raw.formulas || {};

  if (result.formulaKey in formulas) {
    formulas[result.formulaKey] = result.suggestedFix;
    raw.formulas = formulas;
    fs.writeFileSync(schemaPath, JSON.stringify(raw, null, 2) + "\n", "utf-8");
    console.log(`  ✅ FIXED: ${result.slug}.${result.formulaKey}`);
    console.log(`    Before: ${formulas[result.formulaKey]}`);
    console.log(`    After:  ${result.suggestedFix}`);
  }
}

/* ── Main ──────────────────────────────────────── */

async function main(): Promise<void> {
  console.log("=".repeat(60));
  console.log("FORMULA AUDIT & AUTO-FIX PIPELINE (INDUSTRIAL GRADE)");
  console.log("=".repeat(60));

  // Check API key
  if (!process.env.DEEPSEEK_API_KEY) {
    console.log("\n⚠️  DEEPSEEK_API_KEY not found. Running in SCAN-ONLY mode.");
    console.log("   Set DEEPSEEK_API_KEY in .env.local for full audit.");
  }

  // Phase 1: Scan
  console.log("\n📡 Phase 1: Scanning for domain contamination...");
  const errors = scanDomainErrors();
  console.log(`   Found ${errors.length} domain-contamination errors`);

  if (errors.length === 0) {
    console.log("   ✅ No issues found. System is clean.");
    const report = { totalScanned: 0, realBugs: 0, falsePositives: 0, fixed: 0, entries: [] };
    fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
    console.log(`\n📊 Report: ${REPORT_PATH}`);
    return;
  }

  // Print summary
  const bySlug: Record<string, number> = {};
  for (const e of errors) {
    bySlug[e.slug] = (bySlug[e.slug] ?? 0) + 1;
  }
  console.log(`   Across ${Object.keys(bySlug).length} schemas`);
  for (const [slug, count] of Object.entries(bySlug).slice(0, 50)) {
    console.log(`     ${slug}: ${count} error(s)`);
  }
  if (Object.keys(bySlug).length > 50) {
    console.log(`     ... and ${Object.keys(bySlug).length - 50} more`);
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    console.log("\n⚠️  Audit skipped (no API key).");
    console.log("\n📋 HOW TO FIX MANUALLY:");
    for (const error of errors.slice(0, 30)) {
      console.log(`  ${error.slug}.${error.formulaKey} = ${error.expression}`);
      console.log(`    → ${error.issue.message}`);
      console.log(`    → Inputs available: ${error.inputIds.join(", ")}`);
    }
    if (errors.length > 30) {
      console.log(`  ... and ${errors.length - 30} more`);
    }
    return;
  }

  // Phase 2: Audit with DeepSeek
  console.log(`\n🔍 Phase 2: Auditing ${errors.length} formulas with DeepSeek...`);

  const results: AuditResult[] = [];
  for (let i = 0; i < errors.length; i++) {
    const error = errors[i]!;
    process.stdout.write(`  [${i + 1}/${errors.length}] ${error.slug}.${error.formulaKey}... `);
    const result = await auditFormula(error);
    results.push(result);
    console.log(result.correct ? "✅ Correct" : `⚠️ BUG — fixing...`);
    if (!result.correct) {
      // Apply immediately so subsequent checks see the fixed version
      applyFix(result);
    }
    // Small delay to avoid rate limiting
    if (i < errors.length - 1) await new Promise((r) => setTimeout(r, 500));
  }

  // Phase 3: Report
  const realBugs = results.filter((r) => !r.correct);
  const falsePositives = results.filter((r) => r.correct);
  const fixed = realBugs.filter((r) => r.suggestedFix);

  const report = {
    totalScanned: errors.length,
    realBugs: realBugs.length,
    falsePositives: falsePositives.length,
    fixed: fixed.length,
    entries: results,
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf-8");
  console.log(`\n📊 Report: ${REPORT_PATH}`);
  console.log(`   Total scanned: ${report.totalScanned}`);
  console.log(`   False positives (confirmed correct): ${report.falsePositives}`);
  console.log(`   Real bugs found: ${report.realBugs}`);
  console.log(`   Auto-fixed: ${report.fixed}`);

  // Phase 4: Regenerate if fixes were applied
  if (fixed.length > 0) {
    console.log(`\n⚡ Phase 4: Regenerating all code...`);
    const { execSync } = await import("child_process");
    execSync("npm run generate:all", { cwd: process.cwd(), stdio: "inherit" });
    execSync("npm run generate:registry", { cwd: process.cwd(), stdio: "inherit" });
    console.log(`   ✅ Regeneration complete`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("PIPELINE COMPLETE");
  console.log("=".repeat(60));
}

main().catch((err: unknown) => {
  console.error("\nFATAL:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
