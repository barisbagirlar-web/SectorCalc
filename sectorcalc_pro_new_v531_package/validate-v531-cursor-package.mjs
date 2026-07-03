#!/usr/bin/env node
/**
 * SectorCalc V5.3.1 schema package validator.
 * Purpose: validate Cursor-ingested schema JSON files before repository integration.
 * This script does not execute formulas and does not call any LLM.
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = process.argv[2] || __dirname;
const schemasDir = path.join(root, "schemas");
const manifestPath = path.join(root, "manifest.json");

const approvedTopKeys = [
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
  "metadata"
];

const canonicalRedaction = [
  "PUBLIC_SAFE_REDACTED",
  "INTERNAL_TRACE_RESTRICTED",
  "REDACTION_NOT_REQUIRED",
  "REDACTION_FAILED_BLOCKED"
];

function sha256(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function hasNonEnglishChars(value) {
  return /[çğıöşüÇĞİÖŞÜ→]/u.test(value);
}

function walkStrings(value, visitor, pathParts = []) {
  if (typeof value === "string") visitor(value, pathParts);
  else if (Array.isArray(value)) value.forEach((v, i) => walkStrings(v, visitor, pathParts.concat(String(i))));
  else if (value && typeof value === "object") Object.entries(value).forEach(([k, v]) => walkStrings(v, visitor, pathParts.concat(k)));
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
assert(manifest.schema_count === manifest.schemas.length, "manifest.schema_count mismatch");

const files = fs.readdirSync(schemasDir).filter((f) => f.endsWith(".schema.json")).sort();
assert(files.length === manifest.schema_count, `schema file count mismatch: ${files.length} vs ${manifest.schema_count}`);

let checked = 0;
for (const entry of manifest.schemas) {
  const filePath = path.join(root, entry.schema_file);
  assert(fs.existsSync(filePath), `missing schema file: ${entry.schema_file}`);
  const raw = fs.readFileSync(filePath);
  const jsonText = raw.toString("utf8");
  const schema = JSON.parse(jsonText);
  checked += 1;

  assert(sha256(raw) === entry.schema_sha256, `sha256 mismatch: ${entry.schema_file}`);
  assert(JSON.stringify(Object.keys(schema)) === JSON.stringify(approvedTopKeys), `approved top-level key order mismatch: ${entry.schema_file}`);
  assert(schema.tool_name.endsWith("Calculator"), `tool_name does not end with Calculator: ${entry.schema_file}`);
  assert(schema.form_runtime_binding.renderer === "UniversalIndustrialDecisionForm", `renderer mismatch: ${entry.schema_file}`);
  assert(schema.form_runtime_binding.client_formula_execution === "FORBIDDEN", `client formula execution not forbidden: ${entry.schema_file}`);
  assert(schema.form_runtime_binding.llm_runtime_usage === "FORBIDDEN", `runtime LLM not forbidden: ${entry.schema_file}`);
  assert(schema.engine_rules.server_side_formula_execution_only === true, `server-side execution rule missing: ${entry.schema_file}`);
  assert(schema.engine_rules.normalized_base_unit_formula_inputs_only === true, `normalized formula input rule missing: ${entry.schema_file}`);
  assert(Array.isArray(schema.standards_clause_map) && schema.standards_clause_map.length === 0, `standards_clause_map must be empty unless exact user-verified references exist: ${entry.schema_file}`);
  assert(schema.audit_trail_contract.seal_fields.includes("redaction_status"), `audit seal redaction_status missing: ${entry.schema_file}`);
  assert(String(schema.form_runtime_binding.execute_response_contract.redaction_status).split("|").every((v) => canonicalRedaction.includes(v)), `canonical RedactionStatus mismatch: ${entry.schema_file}`);

  for (const formula of schema.formulas) {
    assert(formula.visibility.public_ui === false, `formula public_ui must be false: ${entry.schema_file} ${formula.id}`);
    assert(formula.visibility.public_export === false, `formula public_export must be false: ${entry.schema_file} ${formula.id}`);
    assert(formula.expression === "INTERNAL_SERVER_ONLY_EXPRESSION_NOT_FOR_PUBLIC_UI", `public formula expression leak risk: ${entry.schema_file} ${formula.id}`);
    assert(formula.public_formula_expression_policy === "FORBIDDEN", `formula expression policy missing: ${entry.schema_file} ${formula.id}`);
    for (const rawInput of schema.inputs.map((i) => i.id)) {
      assert(!formula.normalized_input_bindings.includes(rawInput), `raw input used as normalized binding: ${entry.schema_file} ${formula.id}`);
    }
  }

  walkStrings(schema, (s, p) => {
    assert(!hasNonEnglishChars(s), `non-English/Turkish character in ${entry.schema_file} at ${p.join(".")}`);
  });
}

if (process.exitCode) {
  console.error(`V5_3_1_PACKAGE_VALIDATION=FAIL checked=${checked}`);
  process.exit(process.exitCode);
}
console.log(`V5_3_1_PACKAGE_VALIDATION=PASS checked=${checked}`);
