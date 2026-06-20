#!/usr/bin/env npx tsx
/**
 * generate-kav — Interactive KAV entry generator for domain experts
 *
 * Loads a schema, compiles the primary formula, evaluates with default values,
 * and guides the expert to validate and save the result as a known-answer vector.
 *
 * Usage:
 *   npx tsx scripts/steelcore/generate-kav.mjs --slug=irr-calculator
 *   npx tsx scripts/steelcore/generate-kav.mjs --slug=irr-calculator --formula=result
 *   npx tsx scripts/steelcore/generate-kav.mjs --dry-run  # show current KAVs without changes
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { compileFormulaExpression } from "../../src/lib/generated-tools/compile-formula-expression.ts";
import { normalizeRawGeneratedSchema } from "../../src/lib/generated-tools/normalize-schema.ts";
import { toSafeVarName } from "../../src/lib/generated-tools/export-names.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const KAV_PATH = join(ROOT, "generated", "known-answer-vectors.json");
const SCHEMAS_DIR = join(ROOT, "generated", "schemas");

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

function printUsage() {
  console.log(`
Usage:
  npx tsx scripts/steelcore/generate-kav.mjs --slug=<slug>
      Generate a KAV entry for the given schema slug.
      Uses schema default values, compiles the formula, and evaluates.

  npx tsx scripts/steelcore/generate-kav.mjs --slug=<slug> --formula=<key>
      Same, but specify which formula key to test.

  npx tsx scripts/steelcore/generate-kav.mjs --dry-run
      List all current KAV entries without making changes.
`);
}

function log(...args) {
  console.log(`[KAV]`, ...args);
}

function main() {
  const dryRun = process.argv.includes("--dry-run");
  const slugArg = process.argv.find(a => a.startsWith("--slug="));
  const formulaArg = process.argv.find(a => a.startsWith("--formula="));

  if (dryRun) {
    const data = JSON.parse(readFileSync(KAV_PATH, "utf8"));
    log(`KAV registry: ${data.vectors.length} vectors`);
    log(`Last updated: ${data.lastUpdated}`);
    for (const v of data.vectors) {
      log(`  ${v.slug}[${v.formulaKey}]: expected=${v.expectedOutput}, tolerance=${v.tolerance}, source=${v.source}`);
    }
    return;
  }

  if (!slugArg) {
    printUsage();
    process.exit(1);
  }

  const slug = slugArg.split("=")[1];
  const formulaKey = formulaArg ? formulaArg.split("=")[1] : null;

  // Load schema
  const schemaPath = join(SCHEMAS_DIR, `${slug}-schema.json`);
  let raw;
  try {
    raw = JSON.parse(readFileSync(schemaPath, "utf8"));
  } catch {
    log(`ERROR: Schema "${slug}" not found at ${schemaPath}`);
    process.exit(1);
  }

  const schema = normalizeRawGeneratedSchema(raw, slug);
  if (!schema) {
    log(`ERROR: Schema "${slug}" failed to normalize`);
    process.exit(1);
  }

  const inputIds = schema.inputs.map(i => i.id);
  const formulaKeys = Object.keys(schema.formulas);
  const primaryFormulaKey = formulaKey || schema.outputs?.primary || formulaKeys[0];

  if (!formulaKeys.includes(primaryFormulaKey)) {
    log(`ERROR: Formula "${primaryFormulaKey}" not found. Available: ${formulaKeys.join(", ")}`);
    process.exit(1);
  }

  const formulaExpression = schema.formulas[primaryFormulaKey];

  // Build default inputs from schema
  const defaultInputs = {};
  for (const input of schema.inputs) {
    defaultInputs[input.id] = input.default ?? (input.type === "number" ? 0 : "");
  }

  // Compile
  const compiled = compileFormulaExpression(formulaExpression, {
    inputIds,
    inputToAccess: (inputId) => `input.${toSafeVarName(inputId)}`,
    formulaKeys,
    selfKey: primaryFormulaKey,
  });

  if (!compiled || compiled.includes("Math.Math")) {
    log(`ERROR: Formula "${primaryFormulaKey}" failed to compile`);
    process.exit(1);
  }

  // Evaluate
  const evaluated = evaluate(compiled, defaultInputs);

  log(`Schema: ${slug}`);
  log(`Formula: ${primaryFormulaKey} = ${formulaExpression}`);
  log(`Compiled: ${compiled}`);
  log(`Default inputs: ${JSON.stringify(defaultInputs, null, 2)}`);
  log(`Evaluated result: ${Number.isFinite(evaluated) ? evaluated.toFixed(6) : evaluated}`);

  if (!Number.isFinite(evaluated)) {
    log(`WARNING: Formula returned non-finite result with default inputs.`);
    log(`The expert must manually verify and provide correct expected output.`);
  }

  log(`\nTo add this KAV, run:`);
  log(`  # Edit generated/known-answer-vectors.json and add:`);
  log(`${JSON.stringify({
    slug,
    formulaKey: primaryFormulaKey,
    inputs: defaultInputs,
    expectedOutput: Number.isFinite(evaluated) ? Math.round(evaluated * 100) / 100 : null,
    tolerance: 0.01,
    description: `Expert-validated ${slug} vector`,
    source: "[ENTER SOURCE]",
    status: "expert",
  }, null, 2)}`);
}

main();
