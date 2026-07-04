#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const MANIFEST_PATH = "free-tools-v531-control-plane/free-tools-master-manifest.json";

export const STATUS_ORDER = [
  "NOT_STARTED",
  "AUTHORING_READY",
  "SCHEMA_READY",
  "FORMULA_READY",
  "REGISTRY_READY",
  "GOLDEN_READY",
  "LOCAL_GATES_PASS",
  "DEPLOY_READY",
  "LIVE_VERIFIED",
];

export const ALLOWED_STATUSES = new Set([...STATUS_ORDER, "BLOCKED"]);
export const ALLOWED_ACTIVATION_STATES = new Set(["DISABLED", "READY_FOR_DEPLOY", "ENABLED"]);

export const APPROVED_SCHEMA_TOP_LEVEL_KEYS = [
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

export const FORBIDDEN_RUNTIME_TOKENS = [
  "sonuc",
  "totalWasteCost",
  "yayKatsayisi",
  "deplasman",
  "krediTutari",
  "piyasaDegeri",
  "ozsermaye",
  "borc",
  "gelir",
  "gider",
];

const NON_ENGLISH_VISIBLE_CHAR_RE = /[çğıöşüÇĞİÖŞÜ]/;

export function nowIso() {
  return new Date().toISOString();
}

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function readManifest(rootDir = process.cwd()) {
  const fullPath = path.join(rootDir, MANIFEST_PATH);
  return readJson(fullPath);
}

export function writeManifest(manifest, rootDir = process.cwd()) {
  const fullPath = path.join(rootDir, MANIFEST_PATH);
  writeJson(fullPath, manifest);
}

export function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function statusRank(status) {
  if (status === "BLOCKED") return -1;
  return STATUS_ORDER.indexOf(status);
}

export function fail(label, failures) {
  console.error(`${label}=FAIL`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

export function getArgValue(args, name, fallback = null) {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) return fallback;
  return value;
}

export function getArgValues(args, name) {
  const values = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] !== name) continue;
    const value = args[index + 1];
    if (value && !value.startsWith("--")) values.push(value);
  }
  return values;
}

export function hasFlag(args, name) {
  return args.includes(name);
}

export function slugIsValid(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function pascalFromToolKey(toolKey) {
  return toolKey
    .split("-")
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join("");
}

export function constantPrefixFromToolKey(toolKey) {
  return toolKey.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

export function expectedExportsForToolKey(toolKey) {
  const prefix = constantPrefixFromToolKey(toolKey);
  return {
    tool_key_constant: `${prefix}_TOOL_KEY`,
    formula_version_constant: `${prefix}_FORMULA_VERSION`,
    formula_function: `calculate${pascalFromToolKey(toolKey)}`,
  };
}

export function findTool(manifest, toolKey) {
  return manifest.tools.find((tool) => tool.tool_key === toolKey);
}

export function findBatch(manifest, batchId) {
  return manifest.batches.find((batch) => batch.batch_id === batchId);
}

export function toolsForSelector(manifest, args) {
  const batchId = getArgValue(args, "--batch");
  const toolValues = getArgValues(args, "--tool");
  const csv = getArgValue(args, "--tools");
  const toolKeys = [...toolValues];

  if (csv) {
    for (const part of csv.split(",")) {
      const key = part.trim();
      if (key) toolKeys.push(key);
    }
  }

  if (batchId) {
    const batch = findBatch(manifest, batchId);
    if (!batch) throw new Error(`Unknown batch: ${batchId}`);
    toolKeys.push(...batch.tool_keys);
  }

  const unique = Array.from(new Set(toolKeys));
  if (!unique.length) throw new Error("Provide --batch, --tool, or --tools.");

  return unique.map((toolKey) => {
    const tool = findTool(manifest, toolKey);
    if (!tool) throw new Error(`Unknown tool: ${toolKey}`);
    return tool;
  });
}

export function appendHistory(tool, status, note) {
  if (!Array.isArray(tool.status_history)) tool.status_history = [];
  tool.status_history.push({
    status,
    note: note || "",
    changed_at: nowIso(),
  });
}

function fileExists(rootDir, relPath) {
  return fs.existsSync(path.join(rootDir, relPath));
}

function readOptionalText(rootDir, relPath) {
  const fullPath = path.join(rootDir, relPath);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, "utf8");
}

function checkForbiddenText(relPath, text, failures) {
  if (NON_ENGLISH_VISIBLE_CHAR_RE.test(text)) {
    failures.push(`${relPath}: non-English visible character found.`);
  }

  const lower = text.toLowerCase();
  for (const token of FORBIDDEN_RUNTIME_TOKENS) {
    if (lower.includes(token.toLowerCase())) {
      failures.push(`${relPath}: forbidden legacy token found: ${token}`);
    }
  }
}

function validateProductionSchema(rootDir, relPath, tool, failures) {
  const text = readOptionalText(rootDir, relPath);
  if (text === null) {
    failures.push(`${tool.tool_key}: missing schema file: ${relPath}`);
    return;
  }

  checkForbiddenText(relPath, text, failures);

  let schema;
  try {
    schema = JSON.parse(text);
  } catch (error) {
    failures.push(`${relPath}: invalid JSON: ${error.message}`);
    return;
  }

  const keys = Object.keys(schema);
  const approved = new Set(APPROVED_SCHEMA_TOP_LEVEL_KEYS);
  const unknown = keys.filter((key) => !approved.has(key));
  const missing = APPROVED_SCHEMA_TOP_LEVEL_KEYS.filter((key) => !keys.includes(key));

  if (unknown.length) failures.push(`${relPath}: unknown top-level keys: ${unknown.join(", ")}`);
  if (missing.length) failures.push(`${relPath}: missing top-level keys: ${missing.join(", ")}`);

  if (schema.tool_key !== tool.tool_key) {
    failures.push(`${relPath}: tool_key mismatch. expected=${tool.tool_key} actual=${schema.tool_key}`);
  }

  if (schema.form_runtime_binding?.renderer !== "UniversalIndustrialDecisionForm") {
    failures.push(`${relPath}: form_runtime_binding.renderer must be UniversalIndustrialDecisionForm.`);
  }

  if (schema.form_runtime_binding?.client_formula_execution !== "FORBIDDEN") {
    failures.push(`${relPath}: client_formula_execution must be FORBIDDEN.`);
  }

  if (schema.engine_rules?.server_side_formula_execution_only !== true) {
    failures.push(`${relPath}: engine_rules.server_side_formula_execution_only must be true.`);
  }

  if (schema.engine_rules?.llm_runtime_forbidden !== true) {
    failures.push(`${relPath}: engine_rules.llm_runtime_forbidden must be true.`);
  }

  const serialized = JSON.stringify(schema);
  if (serialized.includes("INTERNAL_SERVER_ONLY_EXPRESSION_NOT_FOR_PUBLIC_UI") === false) {
    failures.push(`${relPath}: protected formula placeholder missing.`);
  }
}

function validateFormulaModule(rootDir, relPath, tool, failures) {
  const text = readOptionalText(rootDir, relPath);
  if (text === null) {
    failures.push(`${tool.tool_key}: missing server formula file: ${relPath}`);
    return;
  }

  checkForbiddenText(relPath, text, failures);

  const expected = tool.expected_exports || expectedExportsForToolKey(tool.tool_key);

  if (!text.includes('import "server-only"') && !text.includes("import 'server-only'")) {
    failures.push(`${relPath}: missing server-only import.`);
  }

  if (!text.includes(expected.tool_key_constant)) {
    failures.push(`${relPath}: missing expected export token: ${expected.tool_key_constant}`);
  }

  if (!text.includes(expected.formula_version_constant)) {
    failures.push(`${relPath}: missing expected export token: ${expected.formula_version_constant}`);
  }

  if (!text.includes(expected.formula_function)) {
    failures.push(`${relPath}: missing expected formula function: ${expected.formula_function}`);
  }

  if (!text.includes(tool.tool_key)) {
    failures.push(`${relPath}: exact tool_key string missing: ${tool.tool_key}`);
  }

  if (/\bany\b/.test(text)) {
    failures.push(`${relPath}: TypeScript any usage is forbidden.`);
  }

  if (text.includes("eval(") || text.includes("new Function")) {
    failures.push(`${relPath}: dynamic formula execution is forbidden.`);
  }
}

function validateRegistry(rootDir, tool, failures) {
  const relPath = tool.required_files.registry;
  const text = readOptionalText(rootDir, relPath);
  if (text === null) {
    failures.push(`${tool.tool_key}: missing registry file: ${relPath}`);
    return;
  }

  const expected = tool.expected_exports || expectedExportsForToolKey(tool.tool_key);

  if (!text.includes(tool.tool_key)) {
    failures.push(`${tool.tool_key}: registry missing exact tool key.`);
  }

  if (!text.includes(expected.formula_function)) {
    failures.push(`${tool.tool_key}: registry missing formula function ${expected.formula_function}.`);
  }

  checkForbiddenText(relPath, text, failures);
}

function validateGolden(rootDir, tool, failures) {
  for (const key of ["golden_fixture", "golden_hash"]) {
    const relPath = tool.required_files[key];
    if (!fileExists(rootDir, relPath)) {
      failures.push(`${tool.tool_key}: missing ${key}: ${relPath}`);
      continue;
    }

    const text = readOptionalText(rootDir, relPath);
    checkForbiddenText(relPath, text, failures);

    try {
      JSON.parse(text);
    } catch (error) {
      failures.push(`${relPath}: invalid JSON: ${error.message}`);
    }
  }
}

export function validateManifestShape(manifest) {
  const failures = [];

  if (manifest.control_plane_name !== "FREE_TOOLS_V531_CONTROL_PLANE") {
    failures.push("manifest.control_plane_name mismatch.");
  }

  if (!Array.isArray(manifest.tools)) failures.push("manifest.tools must be an array.");
  if (!Array.isArray(manifest.batches)) failures.push("manifest.batches must be an array.");

  const seen = new Set();
  const batchIds = new Set((manifest.batches || []).map((batch) => batch.batch_id));

  for (const tool of manifest.tools || []) {
    if (!tool.tool_key || !slugIsValid(tool.tool_key)) failures.push(`invalid tool_key: ${tool.tool_key}`);
    if (seen.has(tool.tool_key)) failures.push(`duplicate tool_key: ${tool.tool_key}`);
    seen.add(tool.tool_key);

    if (!ALLOWED_STATUSES.has(tool.status)) failures.push(`${tool.tool_key}: invalid status ${tool.status}`);
    if (!ALLOWED_ACTIVATION_STATES.has(tool.activation)) failures.push(`${tool.tool_key}: invalid activation ${tool.activation}`);
    if (!batchIds.has(tool.batch_id)) failures.push(`${tool.tool_key}: unknown batch_id ${tool.batch_id}`);

    const expected = expectedExportsForToolKey(tool.tool_key);
    for (const [key, value] of Object.entries(expected)) {
      if (tool.expected_exports?.[key] !== value) {
        failures.push(`${tool.tool_key}: expected_exports.${key} mismatch. expected=${value} actual=${tool.expected_exports?.[key]}`);
      }
    }

    if (tool.status === "BLOCKED") {
      if (!Array.isArray(tool.blockers) || tool.blockers.length === 0) {
        failures.push(`${tool.tool_key}: BLOCKED status requires blockers.`);
      }
      if (tool.activation !== "DISABLED") {
        failures.push(`${tool.tool_key}: BLOCKED status requires DISABLED activation.`);
      }
    }

    if (tool.status === "LIVE_VERIFIED" && tool.activation !== "ENABLED") {
      failures.push(`${tool.tool_key}: LIVE_VERIFIED requires ENABLED activation.`);
    }

    if (tool.status !== "LIVE_VERIFIED" && tool.activation === "ENABLED") {
      failures.push(`${tool.tool_key}: ENABLED activation requires LIVE_VERIFIED status.`);
    }

    if (tool.status === "DEPLOY_READY" && tool.activation !== "READY_FOR_DEPLOY") {
      failures.push(`${tool.tool_key}: DEPLOY_READY requires READY_FOR_DEPLOY activation.`);
    }
  }

  for (const batch of manifest.batches || []) {
    if (!batch.batch_id || !/^BATCH_\d{3}$/.test(batch.batch_id)) {
      failures.push(`invalid batch_id: ${batch.batch_id}`);
    }

    for (const toolKey of batch.tool_keys || []) {
      if (!seen.has(toolKey)) failures.push(`${batch.batch_id}: unknown tool_key ${toolKey}`);
    }
  }

  return failures;
}

export function validateEvidenceByStatus(manifest, rootDir = process.cwd()) {
  const failures = [];

  for (const tool of manifest.tools) {
    if (tool.status === "BLOCKED") continue;

    const rank = statusRank(tool.status);

    if (rank >= statusRank("SCHEMA_READY")) {
      validateProductionSchema(rootDir, tool.required_files.source_schema, tool, failures);
      validateProductionSchema(rootDir, tool.required_files.generated_schema, tool, failures);
    }

    if (rank >= statusRank("FORMULA_READY")) {
      validateFormulaModule(rootDir, tool.required_files.server_formula, tool, failures);
    }

    if (rank >= statusRank("REGISTRY_READY")) {
      validateRegistry(rootDir, tool, failures);
    }

    if (rank >= statusRank("GOLDEN_READY")) {
      validateGolden(rootDir, tool, failures);
    }

    if (rank >= statusRank("LOCAL_GATES_PASS")) {
      if (tool.last_gate_result !== "PASS") {
        failures.push(`${tool.tool_key}: LOCAL_GATES_PASS requires last_gate_result=PASS.`);
      }
    }

    if (rank >= statusRank("DEPLOY_READY")) {
      if (tool.activation !== "READY_FOR_DEPLOY") {
        failures.push(`${tool.tool_key}: DEPLOY_READY requires activation=READY_FOR_DEPLOY.`);
      }
    }

    if (rank >= statusRank("LIVE_VERIFIED")) {
      if (tool.checks?.live_smoke !== "PASS") {
        failures.push(`${tool.tool_key}: LIVE_VERIFIED requires checks.live_smoke=PASS.`);
      }
    }
  }

  return failures;
}

export function countBy(items, key) {
  const counts = new Map();
  for (const item of items) counts.set(item[key], (counts.get(item[key]) || 0) + 1);
  return counts;
}

export function stableManifestHash(manifest) {
  const stable = JSON.parse(JSON.stringify(manifest));
  delete stable.generated_at;
  return sha256Text(JSON.stringify(stable));
}
