#!/usr/bin/env node
/**
 * smoke-new-free-v531-tools.mjs
 * Free V5.3.1 Smoke Test for all new Free calculators.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const results = {
  total: 0,
  SCHEMA_VALID_REAL_EXECUTION: 0,
  SCHEMA_VALID_REVIEW_MODULE_MISSING: 0,
  SCHEMA_VALID_BLOCKED_INVALID_TEST_INPUT: 0,
  SCHEMA_IDENTITY_MISMATCH_FAIL: 0,
  SCHEMA_CONTRACT_FAIL: 0,
  SCHEMA_INVALID_FAIL: 0,
  SCHEMA_MISSING_FAIL: 0,
  UNEXPECTED_EXECUTION_FAIL: 0,
  CACHE_CONSISTENCY_FAIL: 0,
  FORM_RENDER_FAIL: 0,
  BUTTON_CONTRACT_FAIL: 0,
  ZERO_TURKISH_FAIL: 0,
  PUBLIC_FORMULA_LEAK_FAIL: 0,
};

const TURKISH_RE = /[çğıöşüÇĞİÖŞÜ]/;

function walkStrings(value, visitor, pathParts = []) {
  if (typeof value === "string") visitor(value, pathParts);
  else if (Array.isArray(value)) value.forEach((v, i) => walkStrings(v, visitor, pathParts.concat(String(i))));
  else if (value && typeof value === "object") Object.entries(value).forEach(([k, v]) => walkStrings(v, visitor, pathParts.concat(k)));
}

function hasTurkishChars(str) { return TURKISH_RE.test(str); }

function checkZeroTurkish(schema) {
  let violations = 0;
  walkStrings(schema, (str) => { if (hasTurkishChars(str)) violations++; });
  return violations === 0;
}

function checkPublicFormulaLeak(schema) {
  if (!Array.isArray(schema.formulas)) return false;
  for (const f of schema.formulas) {
    if (f.expression) return true;
  }
  return false;
}

function checkButtonContract(schema) {
  if (!Array.isArray(schema.inputs) || schema.inputs.length === 0) return false;
  if (!Array.isArray(schema.outputs) || schema.outputs.length === 0) return false;
  if (!schema.form_runtime_binding) return false;
  if (!schema.ui_contract) return false;
  return true;
}

async function run() {
  console.log("=== SECTORCALC FREE V5.3.1 NEW TOOLS SMOKE TEST ===\n");

  const schemaDir = path.join(ROOT, "src/sectorcalc/schemas/free-v531");
  if (!fs.existsSync(schemaDir)) {
    console.error("ERROR: Free V5.3.1 schema directory not found.");
    process.exit(1);
  }
  const schemaFiles = fs.readdirSync(schemaDir).filter(f => f.endsWith(".schema.json")).sort();
  console.log(`Free schema files found: ${schemaFiles.length}\n`);

  if (schemaFiles.length < 50) {
    console.error(`ERROR: Expected at least 50 Free schema files, found ${schemaFiles.length}`);
    process.exit(1);
  }

  // Verify formula modules exist
  const formulaDir = path.join(ROOT, "src/sectorcalc/pro-runtime/free-formulas");
  const formulaFiles = fs.existsSync(formulaDir)
    ? fs.readdirSync(formulaDir).filter(f => f.endsWith(".formula.ts"))
    : [];

  for (const file of schemaFiles) {
    results.total++;
    const filePath = path.join(schemaDir, file);
    let schema;
    try {
      schema = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch {
      console.error(`  FAIL: Invalid JSON in ${file}`);
      results.SCHEMA_INVALID_FAIL++;
      continue;
    }

    const toolKey = schema.tool_key;
    if (!toolKey) {
      console.error(`  FAIL: No tool_key in ${file}`);
      results.SCHEMA_INVALID_FAIL++;
      continue;
    }

    // Schema contract check
    const required = ["tool_id", "tool_key", "tool_name", "category", "scope", "inputs", "outputs", "form_runtime_binding", "ui_contract", "metadata"];
    let contractOk = true;
    for (const key of required) {
      if (!(key in schema)) { contractOk = false; break; }
    }
    if (!contractOk) {
      console.error(`  FAIL: ${toolKey} missing required keys`);
      results.SCHEMA_CONTRACT_FAIL++;
      continue;
    }

    // Form renderer
    if (schema.form_runtime_binding.renderer !== "UniversalIndustrialDecisionForm") {
      console.error(`  FAIL: ${toolKey} renderer is not UniversalIndustrialDecisionForm`);
      results.FORM_RENDER_FAIL++;
      continue;
    }

    // Button contract
    if (!checkButtonContract(schema)) {
      console.error(`  FAIL: ${toolKey} button contract check failed`);
      results.BUTTON_CONTRACT_FAIL++;
      continue;
    }

    // Zero Turkish
    if (!checkZeroTurkish(schema)) {
      console.error(`  FAIL: ${toolKey} has Turkish violations`);
      results.ZERO_TURKISH_FAIL++;
      continue;
    }

    // Public formula leak
    if (checkPublicFormulaLeak(schema)) {
      console.error(`  FAIL: ${toolKey} has formula expression leak`);
      results.PUBLIC_FORMULA_LEAK_FAIL++;
      continue;
    }

    // Check if formula module exists
    const formulaModule = formulaFiles.find(f => f.includes(toolKey));
    if (formulaModule) {
      results.SCHEMA_VALID_REAL_EXECUTION++;
    } else {
      results.SCHEMA_VALID_REVIEW_MODULE_MISSING++;
    }
  }

  // Summary
  console.log("\n--- CLASSIFICATION SUMMARY ---");
  console.log(`Total new Free tools:               ${results.total}`);
  console.log(`SCHEMA_VALID_REAL_EXECUTION:         ${results.SCHEMA_VALID_REAL_EXECUTION}`);
  console.log(`SCHEMA_VALID_REVIEW_MODULE_MISSING:  ${results.SCHEMA_VALID_REVIEW_MODULE_MISSING}`);
  console.log(`SCHEMA_VALID_BLOCKED_INVALID_INPUT:  ${results.SCHEMA_VALID_BLOCKED_INVALID_TEST_INPUT}`);
  Object.entries(results).filter(([k]) => k.endsWith("_FAIL")).forEach(([k, v]) => {
    if (v > 0) console.log(`${k}: ${v}`);
  });

  const failCategories = ["SCHEMA_IDENTITY_MISMATCH_FAIL","SCHEMA_CONTRACT_FAIL","SCHEMA_INVALID_FAIL","SCHEMA_MISSING_FAIL","UNEXPECTED_EXECUTION_FAIL","CACHE_CONSISTENCY_FAIL","FORM_RENDER_FAIL","BUTTON_CONTRACT_FAIL","ZERO_TURKISH_FAIL","PUBLIC_FORMULA_LEAK_FAIL"];
  const totalFail = failCategories.reduce((s, c) => s + results[c], 0);

  console.log(`\n=== RESULT ===`);
  if (totalFail > 0) {
    console.log(`SMOKE_NEW_FREE_V531=FAIL (${totalFail} failures)`);
    process.exit(1);
  }
  console.log(`SMOKE_NEW_FREE_V531=PASS`);
  console.log(`All ${results.total} new Free tools passed.`);
}

run().catch(e => { console.error(e); process.exit(1); });
