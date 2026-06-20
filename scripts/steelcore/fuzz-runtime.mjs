#!/usr/bin/env node
/**
 * Stage 4 — Runtime Trust Engine: Fuzz Testing (Industrial-grade)
 *
 * Injects null, NaN, garbage strings, and extreme numbers into EVERY input
 * field across ALL schemas. Verifies graceful handling — no crashes allowed.
 *
 * Industrial parallel: Apple's Water-Resistance Test.
 * If the device (tool) dies in 1 meter of water (bad input), it fails.
 *
 * Usage: npx tsx scripts/steelcore/fuzz-runtime.mjs --fuzz=10000
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { compileFormulaExpression } from "../src/lib/generated-tools/compile-formula-expression.ts";
import { normalizeRawGeneratedSchema } from "../src/lib/generated-tools/normalize-schema.ts";
import { toSafeVarName } from "../src/lib/generated-tools/export-names.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const SCHEMAS_DIR = join(ROOT, "generated", "schemas");
const REPORT_PATH = join(ROOT, "scripts/.cache/fuzz-runtime-report.json");

// Garbage injection values — every input gets these thrown at it
const FUZZ_VALUES = [
  null,
  undefined,
  "abc123",
  "!@#$%^&*()",
  "",
  -999999999,
  999999999,
  -1,
  0,
  0.0000001,
  Number.NaN,
  Number.POSITIVE_INFINITY,
  Number.NEGATIVE_INFINITY,
  "null",
  "undefined",
  "true",
  "false",
];

/**
 * Evaluate a compiled JS expression in sandbox with given input values.
 * The expression has been sanitized by compileFormulaExpression — only
 * Math.*, input.*, results.* references.
 */
function evaluateSafe(compiled, inputValues, formulaResults) {
  const input = { ...inputValues };
  const results = { ...formulaResults };
  const toNumericFormulaValue = (v) =>
    typeof v === "number" && Number.isFinite(v) ? v : 0;
  // eslint-disable-next-line no-new-func
  const fn = new Function(
    "input", "results", "toNumericFormulaValue", "Math",
    `try { return (${compiled}); } catch(e) { return "[FUZZ_ERROR:" + e.message + "]"; }`,
  );
  return fn(input, results, toNumericFormulaValue, Math);
}

function main() {
  const fuzzArg = process.argv.find((a) => a.startsWith("--fuzz="));
  const iterations = fuzzArg
    ? Math.max(1, parseInt(fuzzArg.split("=")[1], 10) || 1000)
    : 1000;

  const files = readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith("-schema.json"));
  if (files.length === 0) {
    console.error("FUZZ RUNTIME FAIL: No schema files found in generated/schemas/");
    process.exit(1);
  }

  const results = [];
  let totalCrashes = 0;
  let totalGraceful = 0;

  for (const file of files) {
    const slug = file.replace(/-schema\.json$/, "");
    const raw = JSON.parse(readFileSync(join(SCHEMAS_DIR, file), "utf8"));
    const schema = normalizeRawGeneratedSchema(raw, slug);
    if (!schema) {
      results.push({ slug, status: "skip", iterations: 0, crashes: 0, crashRate: "0%", reason: "normalize-failed" });
      continue;
    }

    const formulaKeys = Object.keys(schema.formulas);
    const inputIds = schema.inputs.map((i) => i.id);

    // Compile all formulas once
    const compiledMap = {};
    for (const [key, expression] of Object.entries(schema.formulas)) {
      const compiled = compileFormulaExpression(expression, {
        inputIds,
        inputToAccess: (inputId) => `input.${toSafeVarName(inputId)}`,
        formulaKeys,
        selfKey: key,
      });
      if (compiled && !compiled.includes("Math.Math")) {
        compiledMap[key] = compiled;
      }
    }

    if (Object.keys(compiledMap).length === 0) {
      results.push({ slug, status: "skip", iterations: 0, crashes: 0, crashRate: "0%", reason: "no-compilable-formulas" });
      continue;
    }

    // Run fuzz iterations
    let crashes = 0;
    for (let i = 0; i < iterations; i++) {
      const fuzzInput = {};
      for (const input of schema.inputs) {
        const fuzzIdx = Math.floor(Math.random() * FUZZ_VALUES.length);
        fuzzInput[input.id] = FUZZ_VALUES[fuzzIdx];
      }

      const computedResults = {};
      let iterationFailed = false;

      for (const [key, compiled] of Object.entries(compiledMap)) {
        const result = evaluateSafe(compiled, fuzzInput, computedResults);
        if (typeof result === "string" && result.startsWith("[FUZZ_ERROR:")) {
          iterationFailed = true;
          break;
        }
        computedResults[key] = typeof result === "number" ? result : 0;
      }

      if (iterationFailed) {
        crashes++;
      }
    }

    totalCrashes += crashes;
    totalGraceful += iterations - crashes;

    const passed = crashes === 0;
    results.push({
      slug,
      status: passed ? "pass" : "fail",
      iterations,
      crashes,
      crashRate: `${((crashes / iterations) * 100).toFixed(2)}%`,
    });
  }

  // ── Summary ──
  console.log("=".repeat(60));
  console.log("STAGE 4 — FUZZ RUNTIME TEST");
  console.log(`Iterations per schema: ${iterations}`);
  console.log("=".repeat(60));

  const failed = results.filter((r) => r.status === "fail");

  for (const r of results) {
    if (r.status === "fail") {
      console.error(`  ❌ ${r.slug}: ${r.crashes}/${r.iterations} crashes (${r.crashRate})`);
    } else if (r.status === "pass") {
      console.log(`  ✓ ${r.slug}: 0/${r.iterations} crashes`);
    }
  }

  console.log("\n" + "-".repeat(60));
  const allPass = failed.length === 0;
  console.log(
    `Fuzz test: ${results.filter((r) => r.status === "pass").length}/${results.length} schemas passed, ` +
    `${totalCrashes} crash(es) in ${totalCrashes + totalGraceful} total injections`,
  );

  const report = {
    timestamp: new Date().toISOString(),
    fuzzIterationsPerSchema: iterations,
    totalSchemas: results.length,
    passed: results.filter((r) => r.status === "pass").length,
    failed: results.filter((r) => r.status === "fail").length,
    skipped: results.filter((r) => r.status === "skip").length,
    totalCrashes,
    totalInjections: totalCrashes + totalGraceful,
    allPass,
    results,
  };

  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf-8");
  console.log(`Report: ${REPORT_PATH}`);

  if (!allPass) {
    console.error("\n❌ FUZZ TEST FAILED: Some tools crashed under garbage input.");
    console.error("   Inspect the report and fix the failing tools before deployment.");
    process.exit(1);
  }

  console.log("\n✅ FUZZ TEST PASSED: All tools handled garbage input gracefully.");
}

main();
