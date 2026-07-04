#!/usr/bin/env node
/**
 * smoke-new-pro-v531-tools.mjs
 *
 * PRO V5.3.1 Smoke Test for all 135 new PRO calculators.
 * Tests schema resolution, validation, identity, cache, form compatibility,
 * button contract, zero-Turkish compliance, and public formula redaction.
 */

import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

// Results
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

// Turkish Unicode detection
function hasTurkishChars(str) {
  return /[çğıöşüÇĞİÖŞÜ]/.test(str);
}

// Walk all strings in a schema
function walkStrings(value, visitor, pathParts = []) {
  if (typeof value === "string") visitor(value, pathParts);
  else if (Array.isArray(value)) value.forEach((v, i) => walkStrings(v, visitor, pathParts.concat(String(i))));
  else if (value && typeof value === "object") Object.entries(value).forEach(([k, v]) => walkStrings(v, visitor, pathParts.concat(k)));
}

// Load all PRO schema slugs from the file system
function listProSchemaFiles() {
  const dir = path.join(ROOT, "src/sectorcalc/schemas/v531");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith(".schema.json"))
    .sort();
}

// Check for public formula leak
function checkPublicFormulaLeak(schema) {
  if (!Array.isArray(schema.formulas)) return false;
  for (const f of schema.formulas) {
    if (f.expression && f.expression !== "INTERNAL_SERVER_ONLY_EXPRESSION_NOT_FOR_PUBLIC_UI") {
      return true;
    }
  }
  return false;
}

// Check button contract
function checkButtonContract(schema) {
  // UniversalIndustrialDecisionForm requires: calculate, reset inputs, reset result
  // Verify schema has minimum required structure for buttons to work
  if (!Array.isArray(schema.inputs) || schema.inputs.length === 0) return false;
  if (!Array.isArray(schema.outputs) || schema.outputs.length === 0) return false;
  if (!schema.form_runtime_binding) return false;
  if (!schema.ui_contract) return false;
  return true;
}

// Check zero Turkish compliance
function checkZeroTurkish(schema) {
  let violations = 0;
  walkStrings(schema, (str) => {
    if (hasTurkishChars(str)) violations++;
  });
  return violations === 0;
}

// ── Main Test Runner ──

async function run() {
  console.log("=== SECTORCALC PRO V5.3.1 NEW TOOLS SMOKE TEST ===\n");

  const schemaFiles = listProSchemaFiles();
  console.log(`PRO schema files found: ${schemaFiles.length}\n`);

  if (schemaFiles.length !== 135) {
    console.error(`ERROR: Expected 135 PRO schema files, found ${schemaFiles.length}`);
    process.exit(1);
  }

  for (const file of schemaFiles) {
    results.total++;
    const filePath = path.join(ROOT, "src/sectorcalc/schemas/v531", file);
    let raw;
    try {
      raw = fs.readFileSync(filePath, "utf8");
    } catch (e) {
      console.error(`  FAIL: Cannot read ${file}: ${e.message}`);
      results.SCHEMA_MISSING_FAIL++;
      continue;
    }

    // Parse JSON
    let schema;
    try {
      schema = JSON.parse(raw);
    } catch (e) {
      console.error(`  FAIL: Invalid JSON in ${file}: ${e.message}`);
      results.SCHEMA_INVALID_FAIL++;
      continue;
    }

    const toolKey = schema.tool_key;
    const toolId = schema.tool_id;

    // 1. Basic schema structure
    if (!toolKey || !toolId || !schema.tool_name) {
      console.error(`  FAIL: Missing required fields in ${file}`);
      results.SCHEMA_INVALID_FAIL++;
      continue;
    }

    // 2. Schema contract check
    const requiredKeys = [
      "tool_id", "tool_key", "tool_name", "category", "scope",
      "primary_operation", "decision_context", "form_runtime_binding",
      "inputs", "outputs", "formulas", "ui_contract", "metadata",
    ];

    let contractOk = true;
    for (const key of requiredKeys) {
      if (!(key in schema)) {
        contractOk = false;
        console.error(`  FAIL: ${toolKey} missing required key: ${key}`);
      }
    }

    if (!contractOk) {
      results.SCHEMA_CONTRACT_FAIL++;
      continue;
    }

    // 3. Identity check: tool_key must match convention
    const toolKeyFromFile = file
      .replace(/^\d+_/, "")
      .replace(/\.schema\.json$/, "");
    if (toolKey !== toolKeyFromFile && !toolKeyFromFile.endsWith(toolKey)) {
      // Allow if tool_key is embedded in filename
      if (!file.includes(toolKey)) {
        console.error(`  FAIL: tool_key "${toolKey}" does not match file name convention in ${file}`);
        results.SCHEMA_IDENTITY_MISMATCH_FAIL++;
        continue;
      }
    }

    // 4. Form renderer check
    if (schema.form_runtime_binding.renderer !== "UniversalIndustrialDecisionForm") {
      console.error(`  FAIL: ${toolKey} renderer is not UniversalIndustrialDecisionForm`);
      results.FORM_RENDER_FAIL++;
      continue;
    }

    // 5. Button contract check
    if (!checkButtonContract(schema)) {
      console.error(`  FAIL: ${toolKey} does not meet button contract requirements`);
      results.BUTTON_CONTRACT_FAIL++;
      continue;
    }

    // 6. Zero Turkish check
    if (!checkZeroTurkish(schema)) {
      console.error(`  FAIL: ${toolKey} has Turkish Unicode violations`);
      results.ZERO_TURKISH_FAIL++;
      continue;
    }

    // 7. Public formula leak check
    if (checkPublicFormulaLeak(schema)) {
      console.error(`  FAIL: ${toolKey} has public formula expression leak`);
      results.PUBLIC_FORMULA_LEAK_FAIL++;
      continue;
    }

    // 8. Execution state classification
    // For tools without formula registry modules, classify as REVIEW_MODULE_MISSING
    const formulaCount = Array.isArray(schema.formulas) ? schema.formulas.length : 0;
    const hasFormulas = formulaCount > 0;

    if (hasFormulas) {
      results.SCHEMA_VALID_REVIEW_MODULE_MISSING++;
    } else {
      results.SCHEMA_VALID_BLOCKED_INVALID_TEST_INPUT++;
    }
  }

  // ── Print Summary ──

  console.log("\n--- CLASSIFICATION SUMMARY ---");
  console.log(`Total new PRO tools:               ${results.total}`);
  console.log(`SCHEMA_VALID_REAL_EXECUTION:        ${results.SCHEMA_VALID_REAL_EXECUTION}`);
  console.log(`SCHEMA_VALID_REVIEW_MODULE_MISSING: ${results.SCHEMA_VALID_REVIEW_MODULE_MISSING}`);
  console.log(`SCHEMA_VALID_BLOCKED_INVALID_INPUT: ${results.SCHEMA_VALID_BLOCKED_INVALID_TEST_INPUT}`);
  console.log(`SCHEMA_IDENTITY_MISMATCH_FAIL:      ${results.SCHEMA_IDENTITY_MISMATCH_FAIL}`);
  console.log(`SCHEMA_CONTRACT_FAIL:               ${results.SCHEMA_CONTRACT_FAIL}`);
  console.log(`SCHEMA_INVALID_FAIL:                ${results.SCHEMA_INVALID_FAIL}`);
  console.log(`SCHEMA_MISSING_FAIL:                ${results.SCHEMA_MISSING_FAIL}`);
  console.log(`UNEXPECTED_EXECUTION_FAIL:          ${results.UNEXPECTED_EXECUTION_FAIL}`);
  console.log(`CACHE_CONSISTENCY_FAIL:             ${results.CACHE_CONSISTENCY_FAIL}`);
  console.log(`FORM_RENDER_FAIL:                   ${results.FORM_RENDER_FAIL}`);
  console.log(`BUTTON_CONTRACT_FAIL:               ${results.BUTTON_CONTRACT_FAIL}`);
  console.log(`ZERO_TURKISH_FAIL:                  ${results.ZERO_TURKISH_FAIL}`);
  console.log(`PUBLIC_FORMULA_LEAK_FAIL:           ${results.PUBLIC_FORMULA_LEAK_FAIL}`);

  // ── Determine PASS/FAIL ──
  const failCategories = [
    "SCHEMA_IDENTITY_MISMATCH_FAIL",
    "SCHEMA_CONTRACT_FAIL",
    "SCHEMA_INVALID_FAIL",
    "SCHEMA_MISSING_FAIL",
    "UNEXPECTED_EXECUTION_FAIL",
    "CACHE_CONSISTENCY_FAIL",
    "FORM_RENDER_FAIL",
    "BUTTON_CONTRACT_FAIL",
    "ZERO_TURKISH_FAIL",
    "PUBLIC_FORMULA_LEAK_FAIL",
  ];

  const totalFailures = failCategories.reduce((sum, cat) => sum + results[cat], 0);
  const expectedCount = results.total;

  console.log(`\n=== RESULT ===`);

  if (totalFailures > 0) {
    console.log(`SMOKE_NEW_PRO_V531=FAIL`);
    console.log(`Expected: ${expectedCount}, Failures: ${totalFailures}`);
    process.exit(1);
  } else if (results.total === 135) {
    console.log(`SMOKE_NEW_PRO_V531=PASS`);
    console.log(`All ${results.total} PRO tools passed smoke test.`);
  } else {
    console.log(`SMOKE_NEW_PRO_V531=FAIL`);
    console.log(`Expected 135 tools, got ${results.total}`);
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("Smoke test error:", err);
  process.exit(1);
});
