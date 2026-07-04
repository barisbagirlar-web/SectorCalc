// SectorCalc V5.3.1 — PRO Schema Validator
// Lightweight structural validation for PRO calculator schemas.
// PRO schemas are pre-validated by the package audit — this checks
// essential V5.3.1 contract compliance without the free-tool brand/legal scans.

import type { SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";

const REQUIRED_TOP_LEVEL_KEYS: ReadonlySet<string> = new Set([
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

const VALID_RISK_LEVELS = new Set(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);

const VALID_REDACTION_STATUSES = new Set([
  "PUBLIC_SAFE_REDACTED",
  "INTERNAL_TRACE_RESTRICTED",
  "REDACTION_NOT_REQUIRED",
  "REDACTION_FAILED_BLOCKED",
]);

function isValidRedactionStatus(value: unknown): boolean {
  if (typeof value !== "string") return false;
  // Accept pipe-delimited values where each part is valid
  return value.split("|").every((part) => VALID_REDACTION_STATUSES.has(part.trim()));
}

export interface ProSchemaValidationResult {
  ok: boolean;
  schema: SuperV4Schema | null;
  errors: string[];
}

/**
 * Validate a PRO schema against the V5.3.1 contract.
 * This is lighter than the free-tool validateSuperV4Schema — it skips
 * brand/third-party/legal scans that cause false positives for PRO tools,
 * but enforces all structural and contract-level requirements.
 */
export function validateProV531Schema(raw: unknown): ProSchemaValidationResult {
  const errors: string[] = [];

  if (!raw || typeof raw !== "object") {
    return { ok: false, schema: null, errors: ["Schema must be a non-null object"] };
  }

  const s = raw as Record<string, unknown>;

  // 1. Required top-level keys
  for (const key of REQUIRED_TOP_LEVEL_KEYS) {
    if (!(key in s)) {
      errors.push(`Missing required top-level key: ${key}`);
    }
  }
  if (errors.length > 0) {
    return { ok: false, schema: null, errors };
  }

  // 2. tool_id / tool_key / tool_name
  if (!s.tool_id || typeof s.tool_id !== "string") errors.push("tool_id must be a non-empty string");
  if (!s.tool_key || typeof s.tool_key !== "string") errors.push("tool_key must be a non-empty string");
  if (!s.tool_name || typeof s.tool_name !== "string") errors.push("tool_name must be a non-empty string");

  // 3. risk_level
  if (!VALID_RISK_LEVELS.has(s.risk_level as string)) {
    errors.push(`Invalid risk_level: ${s.risk_level}. Must be one of: ${[...VALID_RISK_LEVELS].join(", ")}`);
  }

  // 4. form_runtime_binding
  const frb = s.form_runtime_binding as Record<string, unknown> | undefined;
  if (!frb) {
    errors.push("form_runtime_binding is required");
  } else {
    if (frb.renderer !== "UniversalIndustrialDecisionForm") {
      errors.push(`renderer must be UniversalIndustrialDecisionForm, got: ${frb.renderer}`);
    }
    if (frb.client_formula_execution !== "FORBIDDEN") {
      errors.push("client_formula_execution must be FORBIDDEN");
    }
    if (frb.llm_runtime_usage !== "FORBIDDEN") {
      errors.push("llm_runtime_usage must be FORBIDDEN");
    }
    const execResp = frb.execute_response_contract as Record<string, unknown> | undefined;
    if (execResp && execResp.redaction_status) {
      if (!isValidRedactionStatus(execResp.redaction_status)) {
        errors.push(`Invalid execute_response_contract.redaction_status: ${execResp.redaction_status}`);
      }
    }
  }

  // 5. Inputs validation
  const inputs = Array.isArray(s.inputs) ? s.inputs as Array<Record<string, unknown>> : [];
  if (inputs.length === 0) errors.push("At least one input is required");
  for (const inp of inputs) {
    if (!inp.id || typeof inp.id !== "string") errors.push("Input missing id");
    if (!inp.name || typeof inp.name !== "string") errors.push(`Input ${inp.id || "?"} missing name`);
    if (!inp.type || typeof inp.type !== "string") errors.push(`Input ${inp.id || "?"} missing type`);
  }

  // 6. Normalized inputs
  const normalizedInputs = Array.isArray(s.normalized_inputs) ? s.normalized_inputs as Array<Record<string, unknown>> : [];
  for (const ni of normalizedInputs) {
    if (!ni.id || typeof ni.id !== "string") errors.push("Normalized input missing id");
    if (!ni.from_input || typeof ni.from_input !== "string") errors.push("Normalized input missing from_input");
  }

  // 7. Outputs validation
  const outputs = Array.isArray(s.outputs) ? s.outputs as Array<Record<string, unknown>> : [];
  if (outputs.length === 0) errors.push("At least one output is required");
  for (const out of outputs) {
    if (!out.id || typeof out.id !== "string") errors.push("Output missing id");
    if (!out.name || typeof out.name !== "string") errors.push(`Output ${out.id || "?"} missing name`);
  }

  // 8. Formulas validation
  const formulas = Array.isArray(s.formulas) ? s.formulas as Array<Record<string, unknown>> : [];
  for (const f of formulas) {
    if (!f.id || typeof f.id !== "string") errors.push("Formula missing id");
    if (f.expression !== undefined) errors.push(`Formula ${f.id || "?"} must not expose expression field`);
  }

  // 9. engine_rules
  const er = s.engine_rules as Record<string, unknown> | undefined;
  if (er && er.server_side_formula_execution_only !== true) {
    errors.push("engine_rules.server_side_formula_execution_only must be true");
  }

  // 10. audit_trail_contract
  const atc = s.audit_trail_contract as Record<string, unknown> | undefined;
  if (atc) {
    if (Array.isArray(atc.seal_fields) && !atc.seal_fields.includes("redaction_status")) {
      errors.push("audit_trail_contract.seal_fields must include redaction_status");
    }
    if (atc.redaction_status && !isValidRedactionStatus(atc.redaction_status)) {
        errors.push(`Invalid audit_trail_contract.redaction_status: ${atc.redaction_status}`);
      }
  }

  // 11. metadata
  const metadata = s.metadata as Record<string, unknown> | undefined;
  if (metadata) {
    if (!metadata.schema_version) errors.push("metadata.schema_version is required");
    if (!metadata.formula_version) errors.push("metadata.formula_version is required");
  }

  // 12. ui_contract
  const uiContract = s.ui_contract as Record<string, unknown> | undefined;
  if (uiContract && uiContract.target_renderer !== "UniversalIndustrialDecisionForm") {
    errors.push(`ui_contract.target_renderer must be UniversalIndustrialDecisionForm, got: ${uiContract.target_renderer}`);
  }

  // 13. unit_conversion_contract
  const ucc = s.unit_conversion_contract as Record<string, unknown> | undefined;
  if (ucc) {
    const convReg = ucc.conversion_registry as Record<string, unknown> | undefined;
    if (convReg && Object.keys(convReg).length > 0) {
      for (const [family, entry] of Object.entries(convReg)) {
        const typedEntry = entry as Record<string, unknown>;
        const units = typedEntry.units as Array<Record<string, unknown>> | undefined;
        if (Array.isArray(units)) {
          for (let i = 0; i < units.length; i++) {
            const u = units[i];
            const factor = u.factor as number | undefined;
            if (typeof factor !== "number" || !Number.isFinite(factor) || factor <= 0) {
              errors.push(`Conversion registry ${family} unit[${i}] has invalid factor`);
            }
          }
        }
      }
    }
  }

  if (errors.length > 0) {
    return { ok: false, schema: null, errors };
  }

  // Deep clone to prevent mutation
  const schema = JSON.parse(JSON.stringify(raw)) as SuperV4Schema;

  return { ok: true, schema, errors: [] };
}
