#!/usr/bin/env npx tsx
/**
 * audit:property-tests — fast-check mathematical property test runner
 *
 * Iterates ALL schemas and runs domain-agnostic property tests on each formula.
 *
 * Usage:
 *   npx tsx scripts/audit/audit-property-tests.mjs --quick    # 100 iters (pipeline)
 *   npx tsx scripts/audit/audit-property-tests.mjs --full     # 10000 iters (nightly)
 *   npx tsx scripts/audit/audit-property-tests.mjs --slug=irr-calculator  # single
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { compileFormulaExpression } from "../../src/lib/generated-tools/compile-formula-expression.ts";
import { normalizeRawGeneratedSchema } from "../../src/lib/generated-tools/normalize-schema.ts";
import { toSafeVarName } from "../../src/lib/generated-tools/export-names.ts";
import { testFormulaProperties } from "../../src/lib/mathematical-property-tester.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const SCHEMAS_DIR = join(ROOT, "generated", "schemas");
const REPORT_PATH = join(ROOT, "scripts/.cache/property-test-report.json");

const isQuick = process.argv.includes("--quick");
const isFull = process.argv.includes("--full");
const slugFilter = process.argv.find(a => a.startsWith("--slug="));

const ITERATIONS = isFull ? 10000 : 100;

function resolveUnitType(type) {
  if (type === "percent" || type === "percentage") return "percent";
  if (type === "currency" || type === "money") return "currency";
  if (type === "integer" || type === "int" || type === "count") return "integer";
  return "number";
}

function main() {
  console.log("=".repeat(60));
  console.log("MATHEMATICAL PROPERTY TESTS (fast-check)");
  console.log(`Mode: ${isFull ? "FULL (10000 iters)" : "QUICK (100 iters)"}`);
  console.log("=".repeat(60));

  const files = readdirSync(SCHEMAS_DIR)
    .filter(f => f.endsWith("-schema.json"))
    .sort();

  let targetFiles = files;
  if (slugFilter) {
    const slug = slugFilter.split("=")[1];
    targetFiles = files.filter(f => f.startsWith(slug));
    if (targetFiles.length === 0) {
      console.error(`ERROR: No schema found for slug "${slug}"`);
      process.exit(1);
    }
    console.log(`Filtered to slug: ${slug} (${targetFiles.length} file(s))`);
  }

  console.log(`Total schemas: ${targetFiles.length}`);

  const allResults = [];
  let totalPassed = 0;
  let totalFailed = 0;
  let skippedSchemas = 0;
  let totalTests = 0;

  for (const file of targetFiles) {
    const slug = file.replace(/-schema\.json$/, "");
    const raw = JSON.parse(readFileSync(join(SCHEMAS_DIR, file), "utf8"));
    const schema = normalizeRawGeneratedSchema(raw, slug);
    if (!schema) {
      skippedSchemas++;
      continue;
    }

    const formulaKeys = Object.keys(schema.formulas);
    const inputIds = schema.inputs.map(i => i.id);
    const inputRanges = {};
    for (const input of schema.inputs) {
      const min = typeof input.min === "number" ? input.min : 0;
      const max = typeof input.max === "number" ? input.max : 100000;
      inputRanges[input.id] = {
        min,
        max,
        type: resolveUnitType(input.type),
      };
    }

    if (inputIds.length === 0 || formulaKeys.length === 0) {
      skippedSchemas++;
      continue;
    }

    // Compile each formula (non-primary formulas need previous results)
    const compiledMap = {};
    let compileFailed = false;

    for (const [key, expression] of Object.entries(schema.formulas)) {
      const compiled = compileFormulaExpression(expression, {
        inputIds,
        inputToAccess: (inputId) => `input.${toSafeVarName(inputId)}`,
        formulaKeys,
        selfKey: key,
      });
      if (!compiled || compiled.includes("Math.Math")) {
        compileFailed = true;
        break;
      }
      compiledMap[key] = compiled;
    }

    if (compileFailed || Object.keys(compiledMap).length === 0) {
      skippedSchemas++;
      continue;
    }

    // Test PRIMARY formula (outputs.primary) for property violations
    const primaryKey = schema.outputs?.primary || formulaKeys[0];
    const primaryCompiled = compiledMap[primaryKey];
    if (!primaryCompiled) {
      skippedSchemas++;
      continue;
    }

    const results = testFormulaProperties(primaryCompiled, inputIds, inputRanges, formulaKeys, {
      iterations: ITERATIONS,
      seed: slug.length, // deterministic seed per slug
    });

    const strictFailures = results.filter(r => !r.passed && !r.isWarning);
    const warnings = results.filter(r => !r.passed && r.isWarning);
    const schemaPassed = strictFailures.length === 0;

    if (schemaPassed) totalPassed++;
    else totalFailed++;
    totalTests += results.length;

    allResults.push({
      slug,
      formulaKey: primaryKey,
      passed: schemaPassed,
      properties: results,
    });

    const strictProps = strictFailures.map(r => r.propertyName).join(", ");
    const warnProps = warnings.map(r => r.propertyName).join(", ");
    const parts = [];
    if (strictProps) parts.push(`❌ ${strictProps}`);
    if (warnProps) parts.push(`⚠ ${warnProps}`);
    const label = schemaPassed ? (warnProps ? "PASS (warnings)" : "✓ ALL PASS") : `FAIL`;
    if (parts.length > 0) {
      console.log(`  ${label} ${slug}: ${parts.join(" | ")}`);
    } else {
      console.log(`  ✓ ${slug}: ALL PASS`);
    }
  }

  // Summary
  console.log("\n" + "-".repeat(60));
  console.log(`Schemas: ${totalPassed} PASS, ${totalFailed} FAIL, ${skippedSchemas} SKIP`);
  console.log(`Property tests: ${totalTests} total`);
  console.log(`\n${totalFailed === 0 ? "✅ ALL STRICT PROPERTY TESTS PASSED" : `❌ ${totalFailed} SCHEMAS HAVE STRICT PROPERTY VIOLATIONS`}`);

  const report = {
    timestamp: new Date().toISOString(),
    mode: isFull ? "full" : "quick",
    iterations: ITERATIONS,
    totalSchemas: targetFiles.length,
    passedSchemas: totalPassed,
    failedSchemas: totalFailed,
    skippedSchemas,
    totalTests,
    allPassed: totalFailed === 0,
    results: allResults,
  };

  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf-8");
  console.log(`Report: ${REPORT_PATH}`);

  if (totalFailed > 0) process.exit(1);
}

main();
