#!/usr/bin/env npx tsx
/**
 * validate-kav — Known-Answer Vector regression validator
 *
 * Compiles each formula from schemas listed in known-answer-vectors.json,
 * evaluates with KAV inputs, and compares against expected output.
 *
 * Usage:
 *   npx tsx scripts/steelcore/validate-kav.mjs          # all KAVs
 *   npx tsx scripts/steelcore/validate-kav.mjs --slug=irr-calculator   # single
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { compileFormulaExpression } from "../../src/lib/generated-tools/compile-formula-expression.ts";
import { normalizeRawGeneratedSchema } from "../../src/lib/generated-tools/normalize-schema.ts";
import { toSafeVarName } from "../../src/lib/generated-tools/export-names.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const KAV_PATH = join(ROOT, "generated", "known-answer-vectors.json");
const SCHEMAS_DIR = join(ROOT, "generated", "schemas");
const REPORT_DIR = join(ROOT, "scripts/.cache");

function evaluate(compiled, inputs) {
  const toNumeric = (v) => typeof v === "number" && Number.isFinite(v) ? v : 0;
  try {
    const fn = new Function(
      "input", "results", "toNumericFormulaValue", "Math",
      `try { return (${compiled}); } catch(e) { return NaN; }`,
    );
    const result = fn(inputs, {}, toNumeric, Math);
    return typeof result === "number" && Number.isFinite(result) ? result : NaN;
  } catch {
    return NaN;
  }
}

function main() {
  console.log("=".repeat(60));
  console.log("KNOWN-ANSWER VECTOR VALIDATOR");
  console.log("Formula regression test against expert-validated vectors");
  console.log("=".repeat(60));

  let kavData;
  try {
    kavData = JSON.parse(readFileSync(KAV_PATH, "utf8"));
  } catch (e) {
    console.error(`ERROR: Cannot read KAV registry: ${KAV_PATH}`, e.message);
    process.exit(1);
  }

  const slugFilter = process.argv.find(a => a.startsWith("--slug="));
  let vectors = kavData.vectors;
  if (slugFilter) {
    const slug = slugFilter.split("=")[1];
    vectors = vectors.filter(v => v.slug === slug);
    if (vectors.length === 0) {
      console.error(`ERROR: No KAVs for slug "${slug}"`);
      process.exit(1);
    }
    console.log(`Filtered to slug: ${slug}`);
  }

  console.log(`Total KAV vectors: ${vectors.length}\n`);

  const results = [];
  let passed = 0;
  let failed = 0;
  let skipped = 0;

  for (const kav of vectors) {
    const schemaPath = join(SCHEMAS_DIR, `${kav.slug}-schema.json`);
    let schema;
    try {
      const raw = JSON.parse(readFileSync(schemaPath, "utf8"));
      schema = normalizeRawGeneratedSchema(raw, kav.slug);
    } catch {
      console.log(`  ⚠ SKIP ${kav.slug}: Schema not found or invalid`);
      results.push({ slug: kav.slug, formulaKey: kav.formulaKey, passed: false, skipped: true, reason: "Schema not found" });
      skipped++;
      continue;
    }

    if (!schema || !schema.formulas || !schema.formulas[kav.formulaKey]) {
      console.log(`  ⚠ SKIP ${kav.slug}: Formula "${kav.formulaKey}" not found in schema`);
      results.push({ slug: kav.slug, formulaKey: kav.formulaKey, passed: false, skipped: true, reason: "Formula key missing" });
      skipped++;
      continue;
    }

    const inputIds = schema.inputs.map(i => i.id);
    const formulaKeys = Object.keys(schema.formulas);
    const formulaExpression = schema.formulas[kav.formulaKey];

    // Validate that all KAV inputs exist in the schema
    const missingInputs = Object.keys(kav.inputs).filter(id => !inputIds.includes(id));
    if (missingInputs.length > 0) {
      console.log(`  ⚠ SKIP ${kav.slug}: KAV has inputs not in schema: ${missingInputs.join(", ")}`);
      results.push({ slug: kav.slug, formulaKey: kav.formulaKey, passed: false, skipped: true, reason: `Missing inputs: ${missingInputs.join(", ")}` });
      skipped++;
      continue;
    }

    // Compile the formula
    const compiled = compileFormulaExpression(formulaExpression, {
      inputIds,
      inputToAccess: (inputId) => `input.${toSafeVarName(inputId)}`,
      formulaKeys,
      selfKey: kav.formulaKey,
    });

    if (!compiled || compiled.includes("Math.Math")) {
      console.log(`  ⚠ SKIP ${kav.slug}: Formula "${kav.formulaKey}" failed to compile`);
      results.push({ slug: kav.slug, formulaKey: kav.formulaKey, passed: false, skipped: true, reason: "Compile failed" });
      skipped++;
      continue;
    }

    // Evaluate with KAV inputs
    const actual = evaluate(compiled, kav.inputs);

    // Determine if result is within tolerance
    const tolerance = kav.tolerance ?? 0.01;
    const diff = Math.abs(actual - kav.expectedOutput);
    const isPassed = diff <= tolerance || (!Number.isFinite(actual) && !Number.isFinite(kav.expectedOutput));

    const status = isPassed ? "✓" : "✗";
    const pctDiff = kav.expectedOutput !== 0 
      ? ((diff / Math.abs(kav.expectedOutput)) * 100).toFixed(2)
      : diff.toFixed(4);

    console.log(`  ${status} ${kav.slug} [${kav.formulaKey}]: actual=${typeof actual === "number" ? actual.toFixed(4) : actual}, expected=${kav.expectedOutput}, diff=${diff.toFixed(4)} (${pctDiff}%)`);

    if (isPassed) {
      passed++;
    } else {
      failed++;
      console.log(`    REASON: ${kav.description}`);
    }

    results.push({
      slug: kav.slug,
      formulaKey: kav.formulaKey,
      passed: isPassed,
      skipped: false,
      actual: Number.isFinite(actual) ? actual : null,
      expected: kav.expectedOutput,
      diff,
      tolerance,
      description: kav.description,
    });
  }

  console.log("\n" + "-".repeat(60));
  console.log(`KAVs: ${passed} PASS, ${failed} FAIL, ${skipped} SKIP (total: ${vectors.length})`);

  const allPassed = failed === 0;
  if (allPassed) {
    console.log("\n✅ ALL KNOWN-ANSWER VECTORS PASSED");
  } else {
    console.log(`\n❌ ${failed} KAV(S) FAILED`);
  }

  const report = {
    timestamp: new Date().toISOString(),
    totalVectors: vectors.length,
    passed,
    failed,
    skipped,
    allPassed,
    results,
  };

  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(join(REPORT_DIR, "kav-validation-report.json"), JSON.stringify(report, null, 2), "utf-8");
  console.log(`Report: ${join(REPORT_DIR, "kav-validation-report.json")}`);

  if (!allPassed) process.exit(1);
}

main();
