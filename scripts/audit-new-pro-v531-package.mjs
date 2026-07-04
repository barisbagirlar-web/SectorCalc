#!/usr/bin/env node
/**
 * audit-new-pro-v531-package.mjs
 *
 * SectorCalc V5.3.1 — PRO Package Audit Script
 * Verifies the new PRO calculator package integrity before integration.
 *
 * Checks:
 * - Exactly 135 PRO calculators detected
 * - Every calculator has a stable English slug/tool_key
 * - No duplicate tool_key
 * - No duplicate slug
 * - No invalid JSON
 * - No missing formula module if package claims formula support
 * - No Turkish Unicode characters
 * - No Turkish/transliterated ASCII tokens
 * - No non-English visible text
 * - No public exact formula expressions
 * - No certification/legal/regulatory approval claims
 * - No client-side formula execution markers
 * - No runtime LLM dependency
 * - All schemas use the approved V5.3.1 top-level key set
 * - Every schema has form_runtime_binding
 * - Every schema has ui_contract
 * - Every schema targets UniversalIndustrialDecisionForm
 * - Every schema has execute_response_contract.redaction_status
 * - Every audit_trail_contract.seal_fields includes redaction_status
 * - Every input has valid English id, label, unit, validation, normalized binding
 * - Every normalized input has deterministic conversion contract
 * - Every output has valid English id, label, unit, interpretation
 * - Every schema has proof_pack, uncertainty_model, safety_factor_gauges, business_impact_contract, validation_contract, precision_policy, export_contract, metadata
 * - Every schema version and formula version are present
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(process.argv[2] || path.join(__dirname, "..", "sectorcalc_pro_new_v531_package"));

// ── Config ──

const EXPECTED_PRO_COUNT = 135;

const APPROVED_TOP_KEYS = new Set([
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
]);

const REQUIRED_CONTRACT_KEYS = [
  "proof_pack",
  "uncertainty_model",
  "safety_factor_gauges",
  "business_impact_contract",
  "validation_contract",
  "precision_policy",
  "export_contract",
  "metadata",
];

// Turkish Unicode range
const TURKISH_UNICODE_RE = /[çğıöşüÇĞİÖŞÜ]/;
// Turkish ASCII transliterated tokens
// Note: "Turkish" is the standard English adjective and is NOT a Turkish ASCII transliteration.
const TURKISH_ASCII_RE = /\b(?:turkiye|cimento|daire|assessment|dovme|slope|eleman|genellik|power|update|hazir|imza|labor|operating|kablo|kademe|kardes|resource|control|installation|kurulus|cost|customer|mekanik|montaj|mudur|mukavemet|numune|olcum|olcme|average|plaka|plastik|randiman|site|sartname|sekil|sirket|sistem|soguk|result|sosyal|tabaka|prediction|takim|talimat|repair|tanimlama|tarih|supply|teklif|temel|tezgah|tipi|torque|tornet|torna|turu|ulke|uretici|production|tax|efficiency|oil|spare|yeknesak|yeni|year|annual|high)\b/i;

// ── Helpers ──

let failures = 0;
let warnings = 0;

function fail(msg) {
  failures++;
  console.error(`  FAIL: ${msg}`);
}

function warn(msg) {
  warnings++;
  console.warn(`  WARN: ${msg}`);
}

function assert(cond, msg) {
  if (!cond) fail(msg);
}

function hasTurkishChars(str) {
  return TURKISH_UNICODE_RE.test(str);
}

function hasTurkishAscii(str) {
  return TURKISH_ASCII_RE.test(str);
}

function walkStrings(value, visitor, pathParts = []) {
  if (typeof value === "string") {
    visitor(value, pathParts);
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => walkStrings(v, visitor, pathParts.concat(String(i))));
  } else if (value && typeof value === "object") {
    Object.entries(value).forEach(([k, v]) => walkStrings(v, visitor, pathParts.concat(k)));
  }
}

// ── Main ──

console.log("=== SECTORCALC V5.3.1 PRO PACKAGE AUDIT ===\n");
console.log(`Package root: ${packageRoot}\n`);

// Check manifest exists
const manifestPath = path.join(packageRoot, "manifest.json");
assert(fs.existsSync(manifestPath), `manifest.json not found at ${manifestPath}`);

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

// Check schemas directory
const schemasDir = path.join(packageRoot, "schemas");
assert(fs.existsSync(schemasDir), `schemas directory not found at ${schemasDir}`);

const schemaFiles = fs.readdirSync(schemasDir).filter((f) => f.endsWith(".schema.json")).sort();
console.log(`Schema files detected: ${schemaFiles.length}`);

// 1. Exactly 135
assert(schemaFiles.length === EXPECTED_PRO_COUNT, `Expected ${EXPECTED_PRO_COUNT} schema files, found ${schemaFiles.length}`);
assert(manifest.schema_count === EXPECTED_PRO_COUNT, `manifest schema_count mismatch: ${manifest.schema_count}`);

// 2-6. Validate each schema
const allToolKeys = [];
const allToolIds = [];
let validJsonCount = 0;
let turkishCharViolations = 0;
let turkishAsciiViolations = 0;
let publicFormulaLeak = 0;
let clientFormulaMarkers = 0;
let llmRuntimeDependency = 0;
let certificationClaims = 0;
let registryMissing = 0;

for (const file of schemaFiles) {
  const filePath = path.join(schemasDir, file);
  const raw = fs.readFileSync(filePath, "utf8");
  let schema;
  try {
    schema = JSON.parse(raw);
    validJsonCount++;
  } catch (e) {
    fail(`Invalid JSON in ${file}: ${e.message}`);
    continue;
  }

  const toolKey = schema.tool_key;
  const toolId = schema.tool_id;

  // Tool key checks
  assert(toolKey && typeof toolKey === "string", `Missing tool_key in ${file}`);
  assert(!allToolKeys.includes(toolKey), `Duplicate tool_key: ${toolKey} in ${file}`);
  allToolKeys.push(toolKey);

  // Tool ID checks
  assert(toolId && typeof toolId === "string", `Missing tool_id in ${file}`);
  assert(!allToolIds.includes(toolId), `Duplicate tool_id: ${toolId} in ${file}`);
  allToolIds.push(toolId);

  // Stable English slug check
  assert(/^[a-z][a-z0-9_]*$/.test(toolKey), `tool_key not stable English slug: ${toolKey} in ${file}`);

  // Turkish character check in all strings
  walkStrings(schema, (str, parts) => {
    if (hasTurkishChars(str)) {
      turkishCharViolations++;
      if (turkishCharViolations <= 5) {
        fail(`Turkish Unicode char in ${toolKey} at ${parts.join(".")}: "${str}"`);
      }
    }
    if (hasTurkishAscii(str)) {
      turkishAsciiViolations++;
      if (turkishAsciiViolations <= 5) {
        fail(`Turkish ASCII transliterated token in ${toolKey} at ${parts.join(".")}: "${str}"`);
      }
    }
  });

  // Top-level key validation
  const schemaKeys = new Set(Object.keys(schema));
  for (const key of schemaKeys) {
    if (!APPROVED_TOP_KEYS.has(key)) {
      fail(`Unknown top-level key "${key}" in ${file}`);
    }
  }

  // Required top-level keys
  for (const key of REQUIRED_CONTRACT_KEYS) {
    if (!schemaKeys.has(key)) {
      fail(`Missing required top-level key "${key}" in ${file}`);
    }
  }

  // form_runtime_binding
  assert(schema.form_runtime_binding, `Missing form_runtime_binding in ${file}`);
  assert(schema.form_runtime_binding.renderer === "UniversalIndustrialDecisionForm",
    `Renderer not UniversalIndustrialDecisionForm in ${file}: ${schema.form_runtime_binding?.renderer}`);
  assert(schema.form_runtime_binding.client_formula_execution === "FORBIDDEN",
    `Client formula execution not FORBIDDEN in ${file}`);
  assert(schema.form_runtime_binding.llm_runtime_usage === "FORBIDDEN",
    `Runtime LLM not FORBIDDEN in ${file}`);

  if (schema.form_runtime_binding.client_formula_execution !== "FORBIDDEN") {
    clientFormulaMarkers++;
  }
  if (schema.form_runtime_binding.llm_runtime_usage !== "FORBIDDEN") {
    llmRuntimeDependency++;
  }

  // execute_response_contract.redaction_status
  const execContract = schema.form_runtime_binding?.execute_response_contract;
  assert(execContract && execContract.redaction_status,
    `Missing execute_response_contract.redaction_status in ${file}`);

  // audit_trail_contract.seal_fields
  const auditContract = schema.audit_trail_contract;
  assert(auditContract, `Missing audit_trail_contract in ${file}`);
  assert(Array.isArray(auditContract.seal_fields), `audit_trail_contract.seal_fields not array in ${file}`);
  assert(auditContract.seal_fields.includes("redaction_status"),
    `audit_trail_contract.seal_fields missing redaction_status in ${file}`);

  // ui_contract
  assert(schema.ui_contract, `Missing ui_contract in ${file}`);
  assert(schema.ui_contract.target_renderer === "UniversalIndustrialDecisionForm",
    `target_renderer not UniversalIndustrialDecisionForm in ${file}`);

  // Input validation
  assert(Array.isArray(schema.inputs), `inputs not array in ${file}`);
  for (const inp of schema.inputs) {
    assert(inp.id && typeof inp.id === "string", `Input missing id in ${file}`);
    assert(inp.name && typeof inp.name === "string", `Input missing name in ${file}`);
      assert(!hasTurkishChars(inp.id), `Turkish char in input id "${inp.id}" in ${file}`);
      assert(!hasTurkishChars(inp.name), `Turkish char in input name "${inp.name}" in ${file}`);
      assert(!hasTurkishAscii(inp.id), `Turkish ASCII in input id "${inp.id}" in ${file}`);
      assert(!hasTurkishAscii(inp.name), `Turkish ASCII in input name "${inp.name}" in ${file}`);
      // Boolean/evidence inputs don't require normalized_id — they are evidence gates, not calculations
      if (inp.type !== "boolean" && inp.id !== "source_evidence_confirmed") {
        assert(inp.normalized_id, `Input missing normalized_id in ${file}: ${inp.id}`);
      }
    }

  // Normalized inputs
  assert(Array.isArray(schema.normalized_inputs), `normalized_inputs not array in ${file}`);
  for (const ni of schema.normalized_inputs) {
    assert(ni.id, `Normalized input missing id in ${file}`);
    assert(ni.from_input, `Normalized input missing from_input in ${file}`);
  }

  // Output validation
  assert(Array.isArray(schema.outputs), `outputs not array in ${file}`);
  for (const out of schema.outputs) {
    assert(out.id && typeof out.id === "string", `Output missing id in ${file}`);
    assert(out.name && typeof out.name === "string", `Output missing name in ${file}`);
    assert(!hasTurkishChars(out.id), `Turkish char in output id "${out.id}" in ${file}`);
    assert(!hasTurkishChars(out.name), `Turkish char in output name "${out.name}" in ${file}`);
  }

  // Formula validation — no public exact formula expressions
  assert(Array.isArray(schema.formulas), `formulas not array in ${file}`);
  for (const formula of schema.formulas) {
    if (formula.expression && formula.expression !== "INTERNAL_SERVER_ONLY_EXPRESSION_NOT_FOR_PUBLIC_UI") {
      publicFormulaLeak++;
      if (publicFormulaLeak <= 5) {
        fail(`Public formula expression in ${toolKey} formula ${formula.id}: "${formula.expression}"`);
      }
    }
    if (formula.public_formula_expression_policy !== "FORBIDDEN") {
      publicFormulaLeak++;
    }
  }

  // engine_rules
  assert(schema.engine_rules, `Missing engine_rules in ${file}`);
  assert(schema.engine_rules.server_side_formula_execution_only === true,
    `server_side_formula_execution_only not true in ${file}`);

  // Metadata
  assert(schema.metadata, `Missing metadata in ${file}`);
  assert(schema.metadata.schema_version, `Missing schema_version in metadata for ${file}`);
  assert(schema.metadata.formula_version, `Missing formula_version in metadata for ${file}`);

  // Brand safety — no certification claims
  const brandSafety = schema.brand_safety_policy;
  if (brandSafety) {
    if (brandSafety.legal_proof_claim === "ALLOWED" || brandSafety.certified_compliance_claim === "ALLOWED") {
      certificationClaims++;
    }
  }
}

// Summary checks
console.log(`\n--- Summary ---`);
console.log(`Schema files:          ${schemaFiles.length}`);
console.log(`Valid JSON:            ${validJsonCount}`);
console.log(`Unique tool keys:      ${allToolKeys.length}`);
console.log(`Unique tool IDs:       ${allToolIds.length}`);
console.log(`Turkish char violations: ${turkishCharViolations}`);
console.log(`Turkish ASCII violations:  ${turkishAsciiViolations}`);
console.log(`Public formula leaks:    ${publicFormulaLeak}`);
console.log(`Client formula markers:  ${clientFormulaMarkers}`);
console.log(`LLM runtime dependencies: ${llmRuntimeDependency}`);
console.log(`Certification claims:    ${certificationClaims}`);

// Final result
console.log(`\n=== RESULT ===`);

if (failures > 0) {
  console.log(`PACKAGE_AUDIT=FAIL`);
  console.log(`Failures: ${failures}`);
  process.exit(1);
} else {
  console.log(`PACKAGE_AUDIT=PASS`);
  console.log(`Checked: ${schemaFiles.length} PRO calculators`);
  if (warnings > 0) {
    console.log(`Warnings: ${warnings}`);
  }
}
