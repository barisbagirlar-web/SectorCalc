#!/usr/bin/env node
/**
 * audit-new-free-v531-package.mjs
 * Audits the sectorcalc_free_new_v531_package against V5.3.1 requirements.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const PACKAGE_DIR = path.join(ROOT, "sectorcalc_free_new_v531_package");
const SCHEMA_DIR = path.join(ROOT, "src/sectorcalc/schemas/free-v531");

const TURKISH_UNICODE_RE = /[çğıöşüÇĞİÖŞÜ]/;

const REQUIRED_TOP_KEYS = [
  "tool_id", "tool_key", "tool_name", "category", "scope",
  "primary_operation", "decision_context", "irreversible_commitment_metric",
  "standards", "standards_clause_map", "reference_status", "risk_level",
  "brand_safety_policy", "calculation_basis", "unit_system",
  "unit_conversion_contract", "inputs", "normalized_inputs",
  "reference_value_policy", "form_runtime_binding", "physical_bounds_policy",
  "validation_contract", "derating_contract", "precision_policy", "formulas",
  "outputs", "output_formatting", "decision_interpretation_contract",
  "business_impact_contract", "engine_rules", "uncertainty_model",
  "safety_factor_gauges", "proof_pack", "audit_trail_contract",
  "export_contract", "ui_contract", "reference_code", "test_plan",
  "red_team_review", "metadata",
];

let failures = 0;
let passed = 0;

function check(condition, message) {
  if (!condition) {
    console.error(`  FAIL: ${message}`);
    failures++;
  } else {
    passed++;
  }
}

// 1. Check source package exists
console.log("=== AUDIT: sectorcalc_free_new_v531_package ===\n");
const pkgExists = fs.existsSync(PACKAGE_DIR);
check(pkgExists, "Package directory exists");

const manifestFile = path.join(PACKAGE_DIR, "manifest.json");
const manifestExists = fs.existsSync(manifestFile);
check(manifestExists, "manifest.json exists");

// 2. Count schemas
const pkgSchemaDir = path.join(PACKAGE_DIR, "schemas");
const pkgSchemaFiles = fs.existsSync(pkgSchemaDir)
  ? fs.readdirSync(pkgSchemaDir).filter(f => f.endsWith(".schema.json"))
  : [];
check(pkgSchemaFiles.length >= 50, `At least 50 Free schemas found: ${pkgSchemaFiles.length}`);

// 3. Count server formula files
const formulaDir = path.join(PACKAGE_DIR, "server-formulas");
const formulaFiles = fs.existsSync(formulaDir)
  ? fs.readdirSync(formulaDir).filter(f => f.endsWith(".formula.ts"))
  : [];
check(formulaFiles.length >= 50, `At least 50 formula files found: ${formulaFiles.length}`);

// 4. Check schemas in our project
const ourSchemaDir = path.join(ROOT, "src/sectorcalc/schemas/free-v531");
const ourSchemaFiles = fs.existsSync(ourSchemaDir)
  ? fs.readdirSync(ourSchemaDir).filter(f => f.endsWith(".schema.json"))
  : [];
check(ourSchemaFiles.length >= 50, `At least 50 schemas in project: ${ourSchemaFiles.length}`);

// 5. Validate each schema
const toolKeys = new Set();
const slugs = new Set();
let invalidJson = 0;
let turkishUnicode = 0;
let formulaLeak = 0;

for (const file of ourSchemaFiles) {
  const filePath = path.join(ourSchemaDir, file);
  let schema;
  try {
    schema = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    invalidJson++;
    continue;
  }

  const toolKey = schema.tool_key;
  const toolId = schema.tool_id;

  // Tool key uniqueness
  if (toolKey) {
    if (toolKeys.has(toolKey)) failures++;
    toolKeys.add(toolKey);
  }

  // Slug uniqueness (tool_key = slug)
  if (toolKey) {
    if (slugs.has(toolKey)) failures++;
    slugs.add(toolKey);
  }

  // Required top-level keys
  for (const key of REQUIRED_TOP_KEYS) {
    if (!(key in schema)) {
      console.error(`  FAIL: ${toolKey || file} missing key: ${key}`);
      failures++;
    }
  }

  // form_runtime_binding
  if (schema.form_runtime_binding) {
    if (schema.form_runtime_binding.renderer !== "UniversalIndustrialDecisionForm") {
      console.error(`  FAIL: ${toolKey} renderer must be UniversalIndustrialDecisionForm`);
      failures++;
    }
  }

  // ui_contract
  if (schema.ui_contract && schema.ui_contract.target_renderer !== "UniversalIndustrialDecisionForm") {
    console.error(`  FAIL: ${toolKey} ui_contract.target_renderer mismatch`);
    failures++;
  }

  // execute_response_contract.redaction_status
  if (schema.form_runtime_binding?.execute_response_contract?.redaction_status) {
    // Accept any valid value
  } else {
    console.error(`  FAIL: ${toolKey} missing execute_response_contract.redaction_status`);
    failures++;
  }

  // audit_trail_contract.seal_fields includes redaction_status
  if (schema.audit_trail_contract) {
    const sealFields = schema.audit_trail_contract.seal_fields;
    if (!Array.isArray(sealFields) || !sealFields.includes("redaction_status")) {
      console.error(`  FAIL: ${toolKey} audit_trail_contract.seal_fields must include redaction_status`);
      failures++;
    }
  }

  // Check for formula expression leak
  if (Array.isArray(schema.formulas)) {
    for (const f of schema.formulas) {
      if (f.expression || f.public_formula_expression) {
        console.error(`  FAIL: ${toolKey} formula ${f.id} has expression field leak`);
        formulaLeak++;
      }
    }
  }

  // Input validation
  if (Array.isArray(schema.inputs)) {
    for (const inp of schema.inputs) {
      if (!inp.id || !inp.name) {
        console.error(`  FAIL: ${toolKey} input missing id or name`);
        failures++;
      }
    }
  }

  // Output validation
  if (Array.isArray(schema.outputs)) {
    for (const out of schema.outputs) {
      if (!out.id || !out.name) {
        console.error(`  FAIL: ${toolKey} output missing id or name`);
        failures++;
      }
    }
  }

  // Metadata
  if (schema.metadata) {
    if (!schema.metadata.schema_version) {
      console.error(`  FAIL: ${toolKey} missing metadata.schema_version`);
      failures++;
    }
    if (!schema.metadata.formula_version) {
      console.error(`  FAIL: ${toolKey} missing metadata.formula_version`);
      failures++;
    }
  }

  // Check for Turkish Unicode characters only
  // ASCII transliterated words are too ambiguous (e.g. "output", "status", "model" are valid English)
  const rawContent = fs.readFileSync(filePath, "utf8");
  if (TURKISH_UNICODE_RE.test(rawContent)) {
    console.error(`  FAIL: ${file} has Turkish Unicode characters`);
    turkishUnicode++;
  }
}

// Print summary
console.log(`\n=== AUDIT RESULTS ===`);
console.log(`Schema files: ${ourSchemaFiles.length}`);
console.log(`Invalid JSON: ${invalidJson}`);
console.log(`Duplicate tool keys: ${toolKeys.size !== ourSchemaFiles.length - invalidJson ? "YES" : "NO"}`);
console.log(`Tool keys: ${toolKeys.size}`);
console.log(`Turkish Unicode violations: ${turkishUnicode}`);
console.log(`Public formula leaks: ${formulaLeak}`);

if (failures > 0 || invalidJson > 0 || turkishUnicode > 0) {
  console.log(`\nPACKAGE_AUDIT=FAIL`);
  process.exit(1);
} else {
  console.log(`\nPACKAGE_AUDIT=PASS`);
}
