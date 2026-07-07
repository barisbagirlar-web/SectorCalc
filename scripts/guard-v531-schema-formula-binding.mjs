#!/usr/bin/env node

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, extname, basename } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();

// V5.3.1 approved top-level keys (from SuperV4Schema contract)
// Pro tools are expected to have at least 46 of these; free tools the same.
const V531_REQUIRED_KEYS = [
  "tool_id",
  "tool_key",
  "tool_name",
  "category",
  "scope",
  "primary_operation",
  "decision_context",
  "irreversible_commitment_metric",
  "standards",
  "standards_clause_map",
  "reference_status",
  "risk_level",
  "brand_safety_policy",
  "calculation_basis",
  "unit_system",
  "unit_conversion_contract",
  "inputs",
  "normalized_inputs",
  "reference_value_policy",
  "form_runtime_binding",
  "physical_bounds_policy",
  "validation_contract",
  "derating_contract",
  "precision_policy",
  "formulas",
  "outputs",
  "output_formatting",
  "decision_interpretation_contract",
  "business_impact_contract",
  "engine_rules",
  "uncertainty_model",
  "safety_factor_gauges",
  "proof_pack",
  "audit_trail_contract",
  "export_contract",
  "ui_contract",
  "reference_code",
  "test_plan",
  "red_team_review",
  "metadata",
];

// Formula module files are checked directly — see extractToolKeyFromFormula

// Schema directories to scan
const SCHEMA_DIRS = [
  { path: "src/sectorcalc/schemas/v531", tier: "pro" },
  { path: "src/sectorcalc/schemas/free-v531", tier: "free" },
];

// Formula directories
const FORMULA_DIRS = [
  { path: "src/sectorcalc/formulas/pro-v531", tier: "pro" },
  { path: "src/sectorcalc/formulas/free-v531", tier: "free" },
];

// ── Development schemas whitelist: schemas known to be in development
//    without formula modules yet. They are exempted from formula binding check.
const DEVELOPMENT_SCHEMAS_PATH = join(ROOT, "data/governance/v531-development-schemas.json");
let developmentToolKeys = new Set();
try {
  if (existsSync(DEVELOPMENT_SCHEMAS_PATH)) {
    const raw = readFileSync(DEVELOPMENT_SCHEMAS_PATH, "utf8");
    developmentToolKeys = new Set(JSON.parse(raw));
  }
} catch {
  // file may not exist — proceed with empty set
}

const failures = [];
let totalSchemas = 0;
let schemasWithFormula = 0;

// ── Helper: list schema files from a directory ────────────────────
// Pro schemas use .schema.json extension; free schemas use .json.
function listSchemaFiles(dir) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return [];
  return execFileSync("ls", [abs], { cwd: ROOT, encoding: "utf8" })
    .trim()
    .split("\n")
    .filter((f) => f.endsWith(".schema.json") || f.endsWith(".json"))
    .map((f) => join(dir, f))
    .sort();
}

// ── Helper: list .formula.ts files from a directory ────────────────
function listFormulaFiles(dir) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return [];
  return execFileSync("ls", [abs], { cwd: ROOT, encoding: "utf8" })
    .trim()
    .split("\n")
    .filter((f) => f.endsWith(".formula.ts"))
    .map((f) => f.replace(/\.formula\.ts$/, ""))
    .sort();
}

// ── Helper: read JSON schema ───────────────────────────────────────
function readSchema(file) {
  try {
    return JSON.parse(readFileSync(join(ROOT, file), "utf8"));
  } catch (err) {
    failures.push(`${file}: failed to parse JSON — ${err.message}`);
    return null;
  }
}

// ── Helper: read formula file and extract toolKey ──────────────────
function extractToolKeyFromFormula(toolKey) {
  // Formula is at {dir}/{toolKey}.formula.ts
  for (const fd of FORMULA_DIRS) {
    const formulaPath = join(ROOT, fd.path, `${toolKey}.formula.ts`);
    if (existsSync(formulaPath)) {
      const text = readFileSync(formulaPath, "utf8");
      // Read exported toolKey
      const match = text.match(/export\s+const\s+toolKey\s*=\s*"([^"]+)"/);
      return match ? match[1] : null;
    }
  }
  return null;
}

// ── Check 1: Required top-level keys ───────────────────────────────
function checkRequiredKeys(schema, file) {
  const schemaKeys = Object.keys(schema);
  for (const key of V531_REQUIRED_KEYS) {
    if (!schemaKeys.includes(key)) {
      failures.push(`${file}: missing required top-level key: ${key}`);
    }
  }
}

// ── Check 2–4: form_runtime_binding contract ───────────────────────
function checkFormRuntimeBinding(schema, file) {
  const binding = schema.form_runtime_binding;
  if (!binding) return;

  if (binding.renderer !== "UniversalIndustrialDecisionForm") {
    failures.push(`${file}: form_runtime_binding.renderer must be "UniversalIndustrialDecisionForm", got: ${binding.renderer}`);
  }

  if (binding.client_formula_execution !== "FORBIDDEN") {
    failures.push(`${file}: form_runtime_binding.client_formula_execution must be "FORBIDDEN", got: ${binding.client_formula_execution}`);
  }

  if (binding.server_execution_required !== true) {
    failures.push(`${file}: form_runtime_binding.server_execution_required must be true, got: ${binding.server_execution_required}`);
  }
}

// ── Check 5: normalized_id integrity ──────────────────────────────
function checkNormalizedIds(schema, file) {
  const normalizedInputs = schema.normalized_inputs || [];
  const normalizedIds = new Set(normalizedInputs.map((n) => n.id));
  const inputs = schema.inputs || [];

  for (const input of inputs) {
    if (input.normalized_id != null && input.normalized_id !== "" && !normalizedIds.has(input.normalized_id)) {
      failures.push(`${file}: input "${input.id}" references non-existent normalized_id "${input.normalized_id}"`);
    }
  }
}

// ── Check 6: ui_contract.input_groups[].fields[] integrity ─────────
function checkUiGroupFields(schema, file) {
  const uiContract = schema.ui_contract;
  if (!uiContract) return;

  const inputGroups = uiContract.input_groups || [];
  const inputIds = new Set((schema.inputs || []).map((i) => i.id));

  for (const group of inputGroups) {
    const fields = group.fields || [];
    for (const fieldId of fields) {
      if (!inputIds.has(fieldId)) {
        failures.push(`${file}: ui_contract.input_groups[${group.id}].fields references non-existent input "${fieldId}"`);
      }
    }
  }
}

// ── Check 7: output_formatting keys reference existing outputs ─────
function checkOutputFormatting(schema, file) {
  const outputFormatting = schema.output_formatting;
  if (!outputFormatting || typeof outputFormatting !== "object") return;

  const outputIds = new Set((schema.outputs || []).map((o) => o.id));

  for (const [key, value] of Object.entries(outputFormatting)) {
    // Known non-output keys that are standard formatting directives
    const knownFormatKeys = new Set([
      "default_rounding", "show_units", "show_uncertainty",
      "show_decision_use", "show_evidence_level", "format",
      "number_format", "currency_format", "uncertainty_format",
      "percentage_format", "decimal_places", "significant_digits",
      "engineering_notation", "scientific_notation", "compact_notation",
      "separator_style", "prefix", "suffix", "unit_style",
      "output_unit_preference", "negative_format",
      "valuation_format", "cost_format", "margin_format", "ratio_format",
      "decimal_format", "integer_format", "exponential_format",
      "default_format", "short_format", "long_format",
    ]);
    if (knownFormatKeys.has(key)) continue;
    // If the key looks like an output ID, verify it exists
    if (key.endsWith("_format") || key.endsWith("_precision") || key.endsWith("_unit")) {
      const candidateId = key.replace(/_(format|precision|unit)$/, "");
      if (candidateId && !outputIds.has(candidateId)) {
        failures.push(`${file}: output_formatting key "${key}" may reference unknown output "${candidateId}"`);
      }
    }
  }
}

// ── Check 8: tool_key maps to a formula module ─────────────────────
// Pro schemas must have individual .formula.ts files.
// Free schemas embed formulas in their JSON schema (central registry).
// Schemas listed in v531-development-schemas.json are exempted.
function checkFormulaBinding(schema, file, tier) {
  const toolKey = schema.tool_key;
  if (!toolKey) return;

  if (tier === "pro" && developmentToolKeys.has(toolKey)) {
    // Known development schema — skip formula binding check
    return;
  }

  if (tier === "free") {
    // Free schemas embed formulas in JSON; no separate .formula.ts required.
    // Verify the schema has a formulas array with at least one entry.
    const formulas = schema.formulas || [];
    if (formulas.length === 0) {
      failures.push(`${file}: FREE schema "${toolKey}" has no formulas array in schema JSON`);
    } else {
      schemasWithFormula++;
    }
    return;
  }

  // Pro schemas: require individual .formula.ts files
  const formulaToolKey = extractToolKeyFromFormula(toolKey);
  if (!formulaToolKey) {
    failures.push(`${file}: tool_key "${toolKey}" has no corresponding formula module (.formula.ts) in pro-v531/`);
    return;
  }

  if (formulaToolKey !== toolKey) {
    failures.push(`${file}: tool_key "${toolKey}" mismatch with formula module export "${formulaToolKey}"`);
  }

  schemasWithFormula++;
}

// ── Check 9: Formula leak scan ─────────────────────────────────────
function checkFormulaLeaks(schema, file) {
  // Check for eval/new Function in raw text (these are always dangerous)
  const rawText = readFileSync(join(ROOT, file), "utf8");
  const lines = rawText.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/\beval\s*\(/.test(line)) {
      failures.push(`${file}:${i + 1}: eval() detected in schema — forbidden: ${line.trim().substring(0, 120)}`);
    }
    if (/new\s+Function\s*\(/.test(line)) {
      failures.push(`${file}:${i + 1}: new Function() detected in schema — forbidden: ${line.trim().substring(0, 120)}`);
    }
  }

  // Check parsed formulas for expression leaks
  const formulas = schema.formulas || [];
  for (const formula of formulas) {
    if (formula.expression && formula.expression !== "INTERNAL_SERVER_ONLY_EXPRESSION_NOT_FOR_PUBLIC_UI" && formula.expression !== "") {
      failures.push(`${file}: formula "${formula.id}" has expression that is not the safe sentinel value`);
    }
    if (formula.public_formula_expression && formula.public_formula_expression !== "FORBIDDEN") {
      failures.push(`${file}: formula "${formula.id}" has public_formula_expression set to a non-FORBIDDEN value`);
    }
  }

  // Check raw text for executable JS patterns in non-expression positions
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip the expression field itself (it's a valid schema field)
    if (line.includes('"expression"') || line.includes("'expression'")) continue;
    // Check for => function arrow patterns — these are suspicious in schemas
    if (/=>\s*\{/.test(line) || /=>\s*\(/.test(line)) {
      failures.push(`${file}:${i + 1}: arrow function pattern detected in schema (possible formula leak): ${line.trim().substring(0, 120)}`);
    }
  }
}

// ── Main ───────────────────────────────────────────────────────────
console.log("═══════════════════════════════════════════════════════");
console.log("  V5.3.1 Schema ↔ Formula ↔ Execute ↔ Form Binding Guard");
console.log("═══════════════════════════════════════════════════════\n");

for (const sd of SCHEMA_DIRS) {
  const schemaFiles = listSchemaFiles(sd.path);
  console.log(`  Scanning ${schemaFiles.length} ${sd.tier.toUpperCase()} schemas in ${sd.path}/`);

  for (const schemaFile of schemaFiles) {
    totalSchemas++;
    const schema = readSchema(schemaFile);
    if (!schema) continue;

    checkRequiredKeys(schema, schemaFile);
    checkFormRuntimeBinding(schema, schemaFile);
    checkNormalizedIds(schema, schemaFile);
    checkUiGroupFields(schema, schemaFile);
    checkOutputFormatting(schema, schemaFile);
    checkFormulaBinding(schema, schemaFile, sd.tier);
    checkFormulaLeaks(schema, schemaFile);
  }
}

// ── Summary ────────────────────────────────────────────────────────
console.log(`\n  Total schemas scanned:     ${totalSchemas}`);
console.log(`  Schemas with formula:      ${schemasWithFormula}`);

// FAIL if FREE schemas directory exists but no FREE schemas were scanned
const freeDir = join(ROOT, "src/sectorcalc/schemas/free-v531");
if (existsSync(freeDir)) {
  const freeCount = readdirSync(freeDir).filter((f) => f.endsWith(".json")).length;
  let freeScanned = 0;
  for (const sd of SCHEMA_DIRS) {
    if (sd.tier === "free") {
      freeScanned += listSchemaFiles(sd.path).length;
    }
  }
  if (freeCount > 0 && freeScanned === 0) {
    console.error(`\n  ❌ V531_SCHEMA_FORMULA_BINDING=FAIL`);
    console.error(`  FREE schema dir has ${freeCount} files but zero were scanned (wrong extension filter?)`);
    process.exit(1);
  }
}

if (failures.length > 0) {
  console.error(`\n  ❌ V531_SCHEMA_FORMULA_BINDING=FAIL`);
  console.error(`  failure_count=${failures.length}`);
  console.error(`\n  Failed checks:`);
  for (const failure of failures) {
    console.error(`    - ${failure}`);
  }
  process.exit(1);
}

console.log(`  ✅ V531_SCHEMA_FORMULA_BINDING=PASS`);
console.log("═══════════════════════════════════════════════════════\n");
