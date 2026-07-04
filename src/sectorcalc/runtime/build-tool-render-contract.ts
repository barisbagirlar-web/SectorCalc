// SectorCalc V5.3.1 — Server-safe Render Contract Adapter
// Converts every route-visible tool schema into one safe render contract
// before it reaches React Server Components.
// Server-only. No client-side dependency. Fails closed — never throws in render path.

import "server-only";

import type {
  ResolvedToolSource,
  ToolRenderContract,
  BuildRenderContractInput,
  BuildRenderContractResult,
  BuildRenderContractFail,
} from "./resolved-tool-source";
import { getDisplayToolName, getDisplayCategoryLabel, getDisplayOperationLabel } from "@/sectorcalc/pro-form/display-labels";

/**
 * Build a validated ToolRenderContract from a resolved tool schema.
 * Returns ok:false with exact reason if any required field is missing or invalid.
 * Never throws inside React render — always returns a result.
 */
export function buildToolRenderContract(
  input: BuildRenderContractInput,
): BuildRenderContractResult {
  const { source, slug } = input;

  if (!input.schema || typeof input.schema !== "object") {
    return fail("SCHEMA_NULL_OR_NOT_OBJECT", "Schema is null, undefined, or not an object", slug, source);
  }

  const schema = input.schema as Record<string, unknown>;

  // toolKey / tool_id
  const toolKey = readString(schema.tool_key) || readString(schema.tool_id) || slug;
  if (!toolKey) {
    return fail("TOOL_KEY_MISSING", "Neither tool_key nor tool_id found in schema", slug, source);
  }

  // toolName
  const rawToolName = readString(schema.tool_name);
  const toolName = getDisplayToolName(rawToolName, toolKey);
  if (!toolName) {
    return fail("TOOL_NAME_MISSING", "tool_name missing and fallback produced empty string", slug, source);
  }

  // categoryLabel
  const rawCategory = readString(schema.category);
  const categoryLabel = getDisplayCategoryLabel(rawCategory);
  if (isRawKey(categoryLabel)) {
    return fail("CATEGORY_LABEL_RAW_KEY", `Category label is still a raw key: "${categoryLabel}"`, slug, source);
  }

  // operationLabel
  const rawOperation = readString(schema.primary_operation);
  const operationLabel = getDisplayOperationLabel(rawOperation);
  if (isRawKey(operationLabel)) {
    return fail("OPERATION_LABEL_RAW_KEY", `Operation label is still a raw key: "${operationLabel}"`, slug, source);
  }

  // scopeText
  const scopeText = readString(schema.scope) || "";

  // riskLevel
  const riskLevel = normalizeRiskLevel(schema.risk_level);

  // schemaVersion / formulaVersion
  const metadata = (schema.metadata as Record<string, unknown>) || {};
  const schemaVersion = readString(metadata.schema_version) || "1.0.0";
  const formulaVersion = readString(metadata.formula_version) || "1.0.0";

  // inputs
  const inputs = Array.isArray(schema.inputs) ? schema.inputs : [];
  if (inputs.length === 0) {
    return fail("INPUTS_EMPTY", "Schema has no inputs array", slug, source);
  }

  // normalizedInputs
  const normalizedInputs = Array.isArray(schema.normalized_inputs) ? schema.normalized_inputs : [];

  // outputs
  const outputs = Array.isArray(schema.outputs) ? schema.outputs : [];
  if (outputs.length === 0) {
    return fail("OUTPUTS_EMPTY", "Schema has no outputs array", slug, source);
  }

  // formRuntimeBinding / executeResponseContract
  const frb = (schema.form_runtime_binding as Record<string, unknown>) || {};
  const execRespContract = (frb.execute_response_contract as Record<string, unknown>) || {};
  const redactionStatus = readString(execRespContract.redaction_status);
  const execStatus = readString(execRespContract.status) || "OK";
  const pipelineState = readString(execRespContract.pipeline_state) || "init";

  if (!redactionStatus) {
    return fail("REDACTION_STATUS_MISSING", "execute_response_contract.redaction_status is missing or empty", slug, source);
  }

  const contract: ToolRenderContract = {
    toolKey,
    toolName,
    categoryLabel,
    operationLabel,
    scopeText,
    riskLevel,
    schemaVersion,
    formulaVersion,
    inputs,
    normalizedInputs,
    outputs,
    formRuntimeBinding: {
      executeResponseContract: {
        redaction_status: redactionStatus,
        status: execStatus,
        pipeline_state: pipelineState,
      },
    },
    executeResponseContract: {
      redaction_status: redactionStatus,
      status: execStatus,
      pipeline_state: pipelineState,
    },
    redactionStatusContract: redactionStatus,
    source,
    rawSchema: schema,
  };

  return { ok: true, contract };
}

// ── Helpers ──

function readString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return undefined;
}

function normalizeRiskLevel(value: unknown): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
  if (typeof value === "string") {
    const upper = value.toUpperCase().trim();
    if (["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(upper)) {
      return upper as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    }
  }
  return "MEDIUM";
}

function isRawKey(value: string): boolean {
  if (!value) return true;
  if (value.includes(" ")) return false;
  if (!/[-_]/.test(value)) {
    return /^[a-z][a-z0-9]*$/.test(value);
  }
  return true;
}

function fail(
  reason: string,
  detail: string,
  slug: string,
  source: ResolvedToolSource,
): BuildRenderContractFail {
  return { ok: false as const, reason, detail, slug, source };
}
