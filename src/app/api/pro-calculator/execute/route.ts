// SectorCalc SuperV4 V5.3 — Pro Calculator Execute API Route
// Full 23-step server execution pipeline + Three-Pass Control
// Server-side only. NO client-side formula execution. NO LLM.

import { NextRequest, NextResponse } from "next/server";
import type {
  ExecuteRequest,
  ExecuteResponse,
  AuditSeal,
  DecisionInterpretation,
  ServerOutput,
  ServerWarning,
  PublicProofPack,
  NormalizedInputAudit,
  SensitivityItem,
  ReferenceRangeAudit,
  FmeaSummary,
  SuperV4Schema,
  SuperV4Input,
  Severity,
  CalcStatus,
} from "@/sectorcalc/pro-form/contract-types";
import { validateSuperV4Schema } from "@/sectorcalc/pro-form/schema-adapter";
import { normalizeInputs } from "@/sectorcalc/pro-form/unit-normalizer";
import { createAuditSeal, computeHash } from "@/sectorcalc/pro-runtime/audit-seal-service";
import { redactPublicResponse } from "@/sectorcalc/pro-form/public-response-redactor";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";
import { getFreeToolSchema } from "@/sectorcalc/runtime/free-schema-loader";
import { checkPhysicalBounds, hasBlockingViolation } from "@/sectorcalc/pro-runtime/physical-bounds-guard";
import { applyDerating, validateDeratingContract } from "@/sectorcalc/pro-runtime/derating-engine";
import { analyzeSensitivity } from "@/sectorcalc/pro-runtime/sensitivity-engine";
import { computeDecision } from "@/sectorcalc/pro-runtime/decision-engine";
import { evaluateAllReferenceRanges } from "@/sectorcalc/pro-form/reference-range-evaluator";
import { SchemaRegistry, schemaRegistry } from "@/sectorcalc/pro-form/schema-registry";
import { formulaRegistry } from "@/sectorcalc/pro-runtime/formula-registry";
import { executeFormulaGraph } from "@/sectorcalc/pro-runtime/deterministic-formula-engine";
import { buildPremiumHook } from "@/sectorcalc/monetization/build-premium-hook";
import { buildUniversalResult } from "@/sectorcalc/result-perspectives/universal-result-adapter";
import type { UniversalCalculationResult } from "@/sectorcalc/pro-form/contract-types";
import { registerFreePilotFormulas } from "@/sectorcalc/formulas/free-v531/break-even-and-margin-of-safety-analysis.registry";
import { registerProPilotFormulas, postProcessProOutputs } from "@/sectorcalc/formulas/pro-v531/compressed-air-leak-cost-calculator.registry";
import { initBarisFormulaRegistry, LIVE_BATCH_KEYS } from "@/sectorcalc/formulas/pro-v531/baris-formula-registry";
import { resolveFormulaModule, hasFormulaModule } from "@/sectorcalc/formulas/pro-v531/resolve-formula-module";
import type { ProFormulaModule } from "@/sectorcalc/formulas/pro-v531/pro-formula-contract";
// Initialize formula registry — explicit call with result used to prevent Webpack tree-shaking
if (initBarisFormulaRegistry() < (LIVE_BATCH_KEYS?.size ?? 0)) {
  throw new Error("Baris PRO formula registry initialization failed — schema resolution will be unavailable");
}
import { getBarisExecutionBlockReason, checkBarisExecutionEntitlement } from "@/sectorcalc/pro-commerce/baris-entitlement-guard";
import { getAdminFirestore, getAdminAuth } from "@/lib/infrastructure/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import {
  checkProductUsage,
  grantProductUsesFromCredits,
  decrementProductUse,
  PRODUCT_KEYS,
} from "@/lib/credits/product-usage-policy";

// All 135 Pro formula modules are auto-generated generic templates with
// identical placeholder outputs. V5.4 Core — the compressed air leak cost
// Pro pilot is the first genuine domain-specific Pro formula module.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// ── Tool key resolver (API compatibility: accept multiple field names) ──

function resolveToolKey(body: Record<string, unknown>): string | null {
  return (
    (body.tool_key as string | undefined) ??
    (body.toolKey as string | undefined) ??
    (body.tool_id as string | undefined) ??
    (body.toolId as string | undefined) ??
    (body.slug as string | undefined) ??
    ((body.schema as Record<string, unknown> | undefined)?.tool_key as string | undefined) ??
    ((body.schema as Record<string, unknown> | undefined)?.toolKey as string | undefined) ??
    null
  );
}

// ── PASS 1: Static Schema / Binding Control (Section 12) ──

interface Pass1Result {
  ok: boolean;
  schema: SuperV4Schema | null;
  errors: string[];
}

function pass1StaticControl(toolKey: string, schema: unknown): Pass1Result {
  if (!toolKey) {
    return { ok: false, schema: null, errors: ["Missing tool_key or tool_id"] };
  }
  if (!schema) {
    return { ok: false, schema: null, errors: [`Schema not found for tool_key: ${toolKey}`] };
  }

  const validation = validateSuperV4Schema(schema);
  if (!validation.ok) {
    return { ok: false, schema: null, errors: [`Schema validation failed: ${validation.errors.join("; ")}`] };
  }

  return { ok: true, schema: validation.schema, errors: [] };
}

// ── PASS 2: Runtime Determinism / Calculation (Section 12) ──
export interface Pass2Result {
  ok: boolean;
  pipelineState: string;
  normalizedInputs: Record<string, number>;
  normalizedAudit: NormalizedInputAudit[];
  referenceRangeAudit: ReferenceRangeAudit[];
  outputs: ServerOutput[];
  warnings: ServerWarning[];
  sensitivity: SensitivityItem[];
  fmeaSummary: FmeaSummary | null;
  decisionInterpretation: DecisionInterpretation;
  outputHash: string;
  errors: string[];
}

export async function pass2RuntimeExecution(
  body: ExecuteRequest,
  validatedSchema: SuperV4Schema,
): Promise<Pass2Result> {
  const warnings: ServerWarning[] = [];
  const errors: string[] = [];

  // S1: Extract raw numeric inputs — supports both flat numbers and structured input objects
  const rawNumericInputs: Record<string, number> = {};
  for (const [key, value] of Object.entries(body.raw_inputs)) {
    if (typeof value === "number") {
      if (!Number.isFinite(value)) {
        errors.push(`Non-finite value for input ${key}`);
      } else {
        rawNumericInputs[key] = value;
      }
    } else if (typeof value === "object" && value !== null) {
      // Structured input: { display_value, display_unit, base_unit, base_value }
      const obj = value as Record<string, unknown>;
      const numericVal = typeof obj.display_value === "number" ? obj.display_value
        : typeof obj.base_value === "number" ? obj.base_value
        : undefined;
      if (numericVal !== undefined && Number.isFinite(numericVal)) {
        rawNumericInputs[key] = numericVal;
        // Populate selected_units from structured input's display_unit if available
        if (typeof obj.display_unit === "string" && obj.display_unit) {
          if (!body.selected_units) body.selected_units = {};
          if (!body.selected_units[key]) {
            body.selected_units[key] = obj.display_unit;
          }
        }
      } else {
        errors.push(`Non-finite or missing display_value/base_value for input ${key}`);
      }
    }
  }
  if (errors.length > 0) {
    return failResult("NON_FINITE_INPUT", errors);
  }

  // S2: Validate required inputs — with structured error codes
  const knownInputIds = new Set(validatedSchema.inputs.map(i => i.id));
  const receivedInputIds = new Set(Object.keys(body.raw_inputs));

  // Check for unknown input keys
  const unknownKeys: string[] = [];
  for (const key of receivedInputIds) {
    if (!knownInputIds.has(key)) {
      unknownKeys.push(key);
    }
  }
  if (unknownKeys.length > 0) {
    return failResult("INPUT_KEY_UNKNOWN", [`Unknown input keys: ${unknownKeys.join(", ")}`]);
  }

  // Check for missing required input keys
  const missingRequiredKeys: string[] = [];
  for (const inp of validatedSchema.inputs) {
    if (inp.required) {
      const value = body.raw_inputs[inp.id];
      if (value === undefined || value === null || value === "") {
        missingRequiredKeys.push(inp.id);
      } else if (typeof value === "object" && value !== null) {
        const obj = value as Record<string, unknown>;
        const numericVal = typeof obj.display_value === "number" ? obj.display_value
          : typeof obj.base_value === "number" ? obj.base_value
          : undefined;
        if (numericVal === undefined || !Number.isFinite(numericVal)) {
          missingRequiredKeys.push(inp.id);
        }
      }
    }
  }
  if (missingRequiredKeys.length > 0) {
    return failResult("INPUT_KEY_MISSING", [`Missing required inputs: ${missingRequiredKeys.join(", ")}`]);
  }

  // S3: Validate selected units
  for (const [inputId, unit] of Object.entries(body.selected_units)) {
    const inp = validatedSchema.inputs.find((i) => i.id === inputId);
    if (inp && inp.unit_selectable) {
      // Allow the base unit even if not in allowed_display_units — the normalizer
      // handles displayUnit === baseUnit as an identity conversion.
      if (unit === inp.base_unit) continue;
      if (!inp.allowed_display_units.includes(unit)) {
        errors.push(`Unit "${unit}" is not allowed for input ${inputId}`);
      }
    }
  }
  if (errors.length > 0) {
    return failResult("INVALID_UNIT", errors);
  }

  // S5: Unit normalization (moved before physical bounds check so that
  // raw display-unit values are converted to base-unit values first.
  // Physical bounds are defined in base-unit, so the check must happen
  // after normalization to avoid false BLOCKED (e.g. percent entered as
  // 18 but ratio bound max=0.95).
  const conversionRegistry = validatedSchema.unit_conversion_contract.conversion_registry;
  const { normalized, errors: normErrors } = normalizeInputs(
    rawNumericInputs,
    body.selected_units,
    validatedSchema,
    conversionRegistry,
  );
  if (normErrors.length > 0) {
    return failResult("UNIT_NORMALIZATION_FAILED", normErrors.map((e) => e.reason));
  }

  // Helper: get numeric value from normalized
  const getNum = (id: string): number | null => {
    const n = normalized[id];
    return n && typeof n.baseValue === "number" ? n.baseValue : null;
  };

  // S4 (moved after normalization): Physical bounds check on normalized base values
  // Physical_hard_bounds are defined in base_unit, and normalized values are in base_unit,
  // so the comparison is now dimensionally correct.
  const normalizedForBoundCheck = validatedSchema.inputs.reduce((acc, inp) => {
    const nv = getNum(inp.id);
    if (nv !== null) acc[inp.id] = nv;
    return acc;
  }, {} as Record<string, number>);
  const boundsCheck = checkPhysicalBounds(validatedSchema.inputs, normalizedForBoundCheck);
  if (hasBlockingViolation(boundsCheck)) {
    for (const v of boundsCheck.violations) {
      warnings.push({
        id: `bounds_${v.inputId}`, severity: v.severity,
        message: v.message,
        why_it_matters: "Physically impossible input value detected.",
        suggested_action: "Correct the input value to a physically possible range.",
      });
    }
    return failResult("PHYSICAL_BOUNDS_BLOCKED", warnings.map((w) => w.message));
  }
  for (const v of boundsCheck.violations) {
    warnings.push({
      id: `bounds_warn_${v.inputId}`, severity: v.severity,
      message: v.message,
      why_it_matters: "Input value is outside reference range.",
      suggested_action: "Verify against source documentation.",
    });
  }

  // S6: Build normalized input audit
  const normalizedAudit: NormalizedInputAudit[] = validatedSchema.inputs.map((inp) => {
    const rawVal = rawNumericInputs[inp.id] ?? null;
    const norm = normalized[inp.id];
    return {
      input_id: inp.id,
      normalized_id: inp.normalized_id || inp.id,
      display_value: rawVal,
      display_unit: body.selected_units[inp.id] || undefined,
      base_value: norm ? norm.baseValue : null,
      base_unit: norm ? norm.baseUnit : undefined,
      source_status: inp.source_status ?? "CONTEXT_ONLY",
    };
  });

  // S7: Schema hash verification (advisory)
  if (body.client_schema_hash) {
    const expectedHash = SchemaRegistry.computeSchemaHash(validatedSchema);
    if (body.client_schema_hash !== expectedHash) {
      warnings.push({
        id: "schema_hash_mismatch", severity: "WARNING",
        message: "Client schema hash does not match server schema hash.",
        why_it_matters: "Client may be using an outdated schema version.",
        suggested_action: "Refresh the tool page and re-submit.",
      });
    }
  }

  // S8: Reference range evaluation — use normalized base values so that
  // display units (e.g. percent=18) are compared against ranges defined in
  // base units (e.g. ratio=0.05-0.7), not against raw display values.
  const normalizedForRange: Record<string, number> = {};
  for (const inp of validatedSchema.inputs) {
    const nv = getNum(inp.id);
    if (nv !== null) normalizedForRange[inp.id] = nv;
  }
  const refRangeResult = evaluateAllReferenceRanges(validatedSchema.inputs, normalizedForRange);
  const referenceRangeAudit: ReferenceRangeAudit[] = refRangeResult.audit;
  for (const w of refRangeResult.warnings) {
    warnings.push({
      id: `refrange_${w.inputId}`, severity: w.severity,
      message: w.message,
      why_it_matters: w.severity === "REVIEW"
        ? "Input is significantly outside recommended engineering range."
        : "Input is outside the recommended reference range.",
      suggested_action: "Verify the input value against source material specifications.",
    });
  }

  // S9: Formula registry binding (advisory)
  const schemaHash = SchemaRegistry.computeSchemaHash(validatedSchema);
  const formulaRecord = formulaRegistry.fetchBySchemaHash(schemaHash);
  if (formulaRecord) {
    schemaRegistry.register({
      tool_id: validatedSchema.tool_id,
      tool_key: validatedSchema.tool_key,
      schema_version: validatedSchema.metadata.schema_version,
      schema_hash: schemaHash,
      approval_status: "ACTIVE",
      created_at: new Date().toISOString(),
      approved_at: null,
      approved_by: null,
      public_schema_json: validatedSchema,
    });
  }

  // S10: Derating engine (stub)
  const deratingContract = validatedSchema.derating_contract;
  const rulesField = (deratingContract as any)?.rules;
  const deRatingRules = Array.isArray(rulesField)
    ? rulesField.map((r: any) => ({
        id: r.id || "",
        description: r.description || "",
        trigger_inputs: r.trigger_inputs || [],
        condition: r.condition || "",
        derating_factor: typeof r.derating_factor === "number" ? r.derating_factor : 1,
        affected_output: r.affected_output || "",
      }))
    : undefined;

  const erContract = deRatingRules ? { rules: deRatingRules } : undefined;
  if (erContract) {
    const deratingValidationErrors = validateDeratingContract(erContract);
    for (const e of deratingValidationErrors) {
      warnings.push({
        id: "derating_config", severity: "WARNING",
        message: e,
        why_it_matters: "Derating configuration issue.",
        suggested_action: "Review derating contract.",
      });
    }
  }
  const appDerating = applyDerating(deRatingRules, rawNumericInputs);
  for (const w of appDerating.warnings) {
    warnings.push({
      id: `derate_${w.severity}`, severity: w.severity,
      message: w.message,
      why_it_matters: "Derating rules may affect result validity.",
      suggested_action: "Review derating conditions.",
    });
  }

  // S11: Formula execution — Permanent Governance Engine
  // Path A (PRIMARY): .formula.ts module for all LIVE tools (20 tools)
  // Path B (FALLBACK): typed-op registry engine for compressed-air pilot
  // Path C (RESTRICTED): schema fallback — BLOCKED for paid PRO, allowed only for dev/diagnostic
  let outputs: ServerOutput[];
  let formulaEngineErrors: string[] = [];

  // Build normalized input map for engine from raw numeric inputs
  const engineNormInputs: Record<string, { baseValue: number; baseUnit: string; quantityKind: string }> = {};
  for (const inp of validatedSchema.inputs) {
    const rawVal = getNum(inp.id);
    if (typeof rawVal === "number" && Number.isFinite(rawVal) && inp.normalized_id) {
      engineNormInputs[inp.normalized_id] = {
        baseValue: rawVal,
        baseUnit: inp.base_unit ?? "",
        quantityKind: inp.quantity_kind ?? "DIMENSIONLESS",
      };
    }
  }

  // Build flat normalized numeric dict (normalized_id → baseValue) for .formula.ts modules
  const flatNormInputs: Record<string, number> = {};
  for (const [k, v] of Object.entries(engineNormInputs)) {
    flatNormInputs[k] = v.baseValue;
  }

  // Look up formula registry for this tool
  const schemaMetadata = validatedSchema.metadata;
  const registryRecord = formulaRegistry.fetch(validatedSchema.tool_id, schemaMetadata?.formula_version ?? "1.0.0");
  const isSchemaFallbackForbidden = !(process.env.NODE_ENV === "development" || body.user_profile_mode === "diagnostic");

  // Check if registry nodes are all PASS_THROUGH stubs (empty input_refs = no real calculation)
  const isPassThroughStub = registryRecord
    && registryRecord.nodes.length > 0
    && registryRecord.nodes.every((n) => n.operation === "PASS_THROUGH" && n.input_refs.length === 0);

  // Path A (PRIMARY): formula module execution for all LIVE tools
  const toolKey = validatedSchema.tool_key;
  const formulaModule = toolKey ? resolveFormulaModule(toolKey) : null;

  if (formulaModule?.calculate) {
    // PERMANENT ENGINE GOVERNANCE: Formula module is the only real execution source for LIVE tools
    const moduleResult = formulaModule.calculate(flatNormInputs);
    const moduleOutputs = moduleResult.outputs ?? {};
    const moduleWarnings = moduleResult.warnings ?? [];
    const moduleStatus = moduleResult.status ?? "OK";

    outputs = (validatedSchema.outputs || []).map((o) => {
      const val = moduleOutputs[o.id];
      return {
        id: o.id,
        name: o.name,
        value: typeof val === "number" ? val : (val ?? null),
        status: (moduleStatus === "OK" && typeof val === "number" && Number.isFinite(val)) ? "OK" as CalcStatus : "REVIEW" as CalcStatus,
        public_explanation: o.public_explanation ?? "",
        decision_use: o.decision_use ?? "",
      };
    });

    for (const w of moduleWarnings) {
      warnings.push({
        id: "formula_module", severity: "WARNING",
        message: w,
        why_it_matters: "Formula module reported a warning.",
        suggested_action: "Review input values.",
      });
    }

    formulaEngineErrors = moduleWarnings;
  } else if (registryRecord && registryRecord.nodes.length > 0 && !isPassThroughStub) {
    // Path B (FALLBACK): typed-op registry engine (compressed-air-leak-cost-calculator pilot)
    const engineResult = executeFormulaGraph(registryRecord.nodes, {
      normalizedInputs: engineNormInputs,
      formulaVersion: registryRecord.formula_version,
    });

    formulaEngineErrors = engineResult.errors;

    const engineOutputMap = new Map(engineResult.outputs.map((o) => [o.id, o]));
    outputs = (validatedSchema.outputs || []).map((o) => {
      const engineOut = engineOutputMap.get(o.id);
      const val = engineOut?.value;
      return {
        id: o.id,
        name: o.name,
        value: typeof val === "number" ? val : (val ?? "Calculation pending"),
        status: engineOut?.status === "OK" ? "OK" as CalcStatus : "REVIEW" as CalcStatus,
        public_explanation: o.public_explanation ?? "",
        decision_use: o.decision_use ?? "",
      };
    });

    for (const err of engineResult.errors) {
      warnings.push({
        id: "formula_engine", severity: "WARNING",
        message: err,
        why_it_matters: "Formula engine error may affect result validity.",
        suggested_action: "Review input values and contact support if issue persists.",
      });
    }

    // V5.4 Core — Post-process string enum outputs for the Pro pilot
    const proOutputKeys = ["decision_status", "governing_driver"];
    const schemaOutputDefs = (validatedSchema.outputs || []).filter((o) => proOutputKeys.includes(o.id));
    outputs = postProcessProOutputs(outputs, schemaOutputDefs);
  } else if (!isSchemaFallbackForbidden) {
    // Path C (RESTRICTED): schema fallback — only in dev/diagnostic mode
    formulaEngineErrors.push(`Schema fallback used for tool ${validatedSchema.tool_id} (dev/diagnostic mode only).`);
    outputs = (validatedSchema.outputs || []).map((o) => ({
      id: o.id,
      name: o.name,
      value: o.value ?? 0,
      status: "REVIEW" as CalcStatus,
      public_explanation: o.public_explanation ?? "",
      decision_use: o.decision_use ?? "",
    }));

    warnings.push({
      id: "schema_fallback_dev_mode", severity: "WARNING",
      message: `Schema fallback used (dev/diagnostic): ${validatedSchema.tool_id} has no formula module or real registry.`,
      why_it_matters: "Schema fallback is not a valid execution path — results are not calculated.",
      suggested_action: "Add a formula module or register real formula nodes.",
    });
  } else {
    // BLOCKED: Paid PRO execution with no formula module — forbidden by governance
    const msg = `PAID_PRO_SCHEMA_FALLBACK=FORBIDDEN: Tool ${validatedSchema.tool_id} has no formula module or real registry. Schema fallback is not permitted for paid PRO execution.`;
    formulaEngineErrors.push(msg);
    return failResult("SCHEMA_FALLBACK_FORBIDDEN", [msg]);
  }

  // V5.4 Core — Contribution margin blocker for Free pilot
  const cmOutput = outputs.find((o) => o.id === "contribution_margin_per_unit");
  if (cmOutput && typeof cmOutput.value === "number" && cmOutput.value <= 0) {
    warnings.push({
      id: "contribution_margin_blocked", severity: "CRITICAL",
      message: "Contribution margin must be greater than zero.",
      why_it_matters: "A non-positive contribution margin means the selling price does not cover variable costs. Break-even analysis is invalid in this case.",
      suggested_action: "Increase selling price or reduce variable costs until contribution margin is positive.",
    });
    return failResult("CONTRIBUTION_MARGIN_BLOCKED", ["Contribution margin must be greater than zero."]);
  }

  // S12: Sensitivity analysis
  const sensInputs = validatedSchema.inputs
    .filter((i) => typeof getNum(i.id) === "number")
    .map((i) => ({ id: i.id, name: i.name, value: getNum(i.id) as number }));
  const { items: sensitivityItems, warnings: sensWarnings } = analyzeSensitivity(sensInputs, outputs.map((o) => ({ id: o.id, name: o.name, value: Number(o.value) || 0 })));
  for (const w of sensWarnings) {
    warnings.push({
      id: "sens_warn", severity: "INFO",
      message: w,
      why_it_matters: "Sensitivity analysis could not be fully computed.",
      suggested_action: "Check input values.",
    });
  }

  // S13: Compute decision interpretation
  const decisionResult = computeDecision({
    outputs,
    warnings,
    violations: boundsCheck.violations.map((v) => ({
      inputId: v.inputId, severity: v.severity, message: v.message,
    })),
    riskLevel: boundsCheck.violations.length > 0 ? "MEDIUM" : "LOW",
    moneyAtRisk: null,
    currency: null,
    mainCostDriver: null,
  });

  const decisionInterpretation: DecisionInterpretation = {
    primary_decision: decisionResult.status as CalcStatus,
    primary_reason: decisionResult.primary_reason,
    user_profile_summary: {
      operator: decisionResult.status === "OK" ? "Calculation completed." : `Action needed: ${decisionResult.primary_reason}`,
      engineer: `Status: ${decisionResult.status}. ${decisionResult.primary_reason}`,
      owner_cfo: decisionResult.money_impact.quote_or_decision_impact || "Review recommended.",
      checker_auditor: `Decision: ${decisionResult.status}. Hidden risks: ${decisionResult.hidden_risks.length}`,
    },
    hidden_risk_explanations: decisionResult.hidden_risks,
    money_impact_summary: decisionResult.money_impact,
    what_can_flip_the_decision: decisionResult.what_can_flip,
    next_best_actions: decisionResult.next_actions,
    premium_unlock_reason: "",
  };

  // S14: Compute output hash
  const outputHash = computeHash(
    JSON.stringify(outputs.map((o) => `${o.id}:${String(o.value)}`).sort()),
  );

  return {
    ok: true,
    pipelineState: decisionResult.status,
    normalizedInputs: Object.fromEntries(Object.entries(normalized).map(([k, v]) => [k, v.baseValue])),
    normalizedAudit,
    referenceRangeAudit,
    outputs,
    warnings,
    sensitivity: sensitivityItems,
    fmeaSummary: null,
    decisionInterpretation,
    outputHash,
    errors: [],
  };
}

function failResult(state: string, errs: string[]): Pass2Result {
  return {
    ok: false, pipelineState: state, normalizedInputs: {},
    normalizedAudit: [], referenceRangeAudit: [], outputs: [], warnings: [],
    sensitivity: [], fmeaSummary: null,
    decisionInterpretation: emptyDecision(state),
    outputHash: computeHash("failed"), errors: errs,
  };
}

// ── PASS 3: Public Output + Audit / Export Control (Section 12) ──
export interface Pass3Result {
  ok: boolean;
  response: ExecuteResponse;
  auditSeal: AuditSeal;
}

export function pass3PublicControl(
  body: ExecuteRequest,
  validatedSchema: SuperV4Schema,
  pass2Result: Pass2Result,
): Pass3Result {
  // Build proof pack
  const sections: PublicProofPack["sections"] = [];

  sections.push({
    id: "schema_version",
    title: "Schema Version",
    public_content: `${validatedSchema.tool_key} v${validatedSchema.metadata.schema_version}`,
  });

  if (pass2Result.normalizedAudit.length > 0) {
    sections.push({
      id: "input_summary",
      title: "Normalized Input Audit",
      public_content: JSON.stringify(pass2Result.normalizedAudit.slice(0, 10)),
    });
  }

  if (pass2Result.referenceRangeAudit.length > 0) {
    sections.push({
      id: "reference_ranges",
      title: "Reference Range Audit",
      public_content: JSON.stringify(pass2Result.referenceRangeAudit.slice(0, 10)),
    });
  }

  sections.push({
    id: "output_summary",
    title: "Output Summary",
    public_content: JSON.stringify(pass2Result.outputs.map((o) => ({ id: o.id, name: o.name, value: o.value }))),
  });

  sections.push({
    id: "decision",
    title: "Decision Interpretation",
    public_content: pass2Result.decisionInterpretation.primary_reason,
  });

  const proofPack: PublicProofPack = { enabled: true, redaction_status: "PUBLIC_SAFE_REDACTED", sections };

  // Compute audit seal
  const inputHash = computeHash(JSON.stringify(body.raw_inputs));
  const schemaHash = SchemaRegistry.computeSchemaHash(validatedSchema);

  const auditSeal: AuditSeal = createAuditSeal({
    inputHash,
    outputHash: pass2Result.outputHash,
    schemaHash,
    formulaVersion: "stub",
    schemaVersion: validatedSchema.metadata.schema_version,
    runtimeVersion: "superv4-v5.3-runtime-1.0.0",
  });

  // Build full ExecuteResponse
  const response: ExecuteResponse = {
    status: pass2Result.pipelineState as CalcStatus,
    pipeline_state: pass2Result.pipelineState,
    outputs: pass2Result.outputs,
    warnings: pass2Result.warnings,
    normalized_input_audit: pass2Result.normalizedAudit,
    reference_range_audit: pass2Result.referenceRangeAudit,
    sensitivity: pass2Result.sensitivity,
    scenario_compare: null,
    fmea_summary: pass2Result.fmeaSummary,
    proof_pack_public: proofPack,
    decision_interpretation: pass2Result.decisionInterpretation,
    audit_seal: auditSeal,
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };

  // Apply redaction
  const { response: safeResponse, status: redactionStatus } = redactPublicResponse(response);

  return {
    ok: redactionStatus !== "REDACTION_FAILED_BLOCKED",
    response: safeResponse,
    auditSeal,
  };
}

// ── Endpoint ──
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Baris PRO tracking vars — hoisted to function scope for catch access
  let userId: string | null = null;
  let userEmail: string | null = null;
  let keyWasDeducted = false;
  let barisRequestId: string | null = null;
  let toolKey: string | null = null;

  try {
    const rawBody: Record<string, unknown> = await request.json();
    toolKey = resolveToolKey(rawBody);

    // Normalize input fields: accept inputs/values as aliases for raw_inputs
    if (rawBody.raw_inputs === undefined || rawBody.raw_inputs === null) {
      rawBody.raw_inputs = (rawBody.inputs as Record<string, unknown>) ?? (rawBody.values as Record<string, unknown>) ?? {};
    }
    if (rawBody.selected_units === undefined || rawBody.selected_units === null) {
      rawBody.selected_units = {};
    }
    if (!rawBody.user_profile_mode) {
      rawBody.user_profile_mode = "engineering";
    }

    const body = rawBody as unknown as ExecuteRequest;

    // PASS 1 — Static Schema / Binding Control
    // Schema is resolved from the Pro/Free V5.3.1 schema registry via resolveApprovedToolSchema.
    let schemaResult: import("@/sectorcalc/runtime/resolve-approved-tool-schema").ApprovedSchemaResult = toolKey
      ? resolveApprovedToolSchema(toolKey)
      : { ok: false, reason: "SCHEMA_NOT_FOUND", errors: ["Missing tool_key or tool_id"] };

    // Fallback: try direct Free schema loading if resolver fails
    // (handles dev HMR edge cases where the schema loader cache is stale).
    if (!schemaResult.ok && toolKey) {
      const directFree = getFreeToolSchema(toolKey);
      if (directFree) {
        const val = validateSuperV4Schema(directFree);
        if (val.ok) {
          schemaResult = { ok: true, schema: val.schema, source: "free_v531" };
        }
      }
    }

    // Fallback: if schema not found but tool is in formula registry, create minimal schema
    // This handles deployed SSR environments where schema files may not be at the expected path.
    if (!schemaResult.ok && toolKey) {
      const registryRecord = formulaRegistry.fetchByToolKey(toolKey);
      if (registryRecord) {
        // Create a minimal schema from registry record data
        const minimalSchema: Record<string, unknown> = {
          tool_id: registryRecord.tool_id,
          tool_key: registryRecord.tool_key,
          tool_name: toolKey.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          category: "PRO",
          decision_context: {
            system_boundary: "Baris PRO tool — schema derived from formula registry",
            decision_owner: "operator",
          },
          inputs: [],
          outputs: registryRecord.nodes.map((n) => ({
            id: n.output_ref,
            name: n.output_ref,
            type: "string",
          })),
          formulas: [],
          unit_conversion_contract: { conversion_registry: {} },
        };
        const val = validateSuperV4Schema(minimalSchema);
        if (val.ok) {
          schemaResult = { ok: true, schema: val.schema, source: "pro_v531" };
        }
      }
    }

    if (!schemaResult.ok) {
      const errorResponse = buildFullBlockedResponse(
        "SCHEMA_NOT_FOUND",
        schemaResult.errors.join("; "),
      );
      const { response: safeResponse } = redactPublicResponse(errorResponse);
      return NextResponse.json(safeResponse, { status: 400 });
    }
    const schemaSource: SuperV4Schema = schemaResult.schema;

    const pass1 = pass1StaticControl(toolKey ?? "", schemaSource);
    if (!pass1.ok) {
      const errorResponse = buildFullBlockedResponse(
        pass1.errors[0] === "Missing tool_key or tool_id" ? "VALIDATION_FAILED" : "SCHEMA_NOT_FOUND",
        pass1.errors.join("; "),
      );
      const { response: safeResponse } = redactPublicResponse(errorResponse);
      return NextResponse.json(safeResponse, { status: 400 });
    }

    const validatedSchema = pass1.schema!;

    // V5.3.1 — Baris PRO Entitlement & Execution Guard
    // Block assisted dossier tools immediately.
    // Block instant calculators unless entitled.
    const barisBlockReason = getBarisExecutionBlockReason(toolKey ?? "");
    if (barisBlockReason === "ASSISTED_DOSSIER_ONLY") {
      const errorResponse = buildFullBlockedResponse(
        "ASSISTED_DOSSIER_ONLY",
        "This tool is available as an assisted PRO Dossier request only. Instant calculation is not supported.",
      );
      const { response: safeResponse } = redactPublicResponse(errorResponse);
      return NextResponse.json(safeResponse, { status: 403 });
    }

    if (barisBlockReason === null && toolKey) {
      // This is a Baris tool. Check entitlement before execution.
      const product = await import("@/sectorcalc/pro-commerce/baris-pro-products").then(m => m.getBarisProduct(toolKey!));
      if (product) {
        // ── Firebase Auth verification ────────────────────────────────
        // Priority 1: Verify Firebase Auth ID token from Authorization header.
        // Priority 2: Fall back to usageSessionId "bypass-unlimited" for admin bypass.
        // Priority 3: x-user-email for admin testing only.
        let verifiedUserId: string | null = null;
        let verifiedEmail: string | null = null;
        let authMethod: "token" | "bypass" | "none" = "none";

        const authHeader = request.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
          const idToken = authHeader.slice(7);
          try {
            const auth = getAdminAuth();
            if (auth) {
              const decoded = await auth.verifyIdToken(idToken);
              verifiedUserId = decoded.uid;
              verifiedEmail = decoded.email ?? null;
              authMethod = "token";
            }
          } catch {
            // Token verification failed — fall through to bypass check
          }
        }

        // Owner bypass: usageSessionId "bypass-unlimited" or x-user-email header
        if (authMethod === "none") {
          const rawUsageSessionId = (rawBody as Record<string, unknown>).usageSessionId;
          if (rawUsageSessionId === "bypass-unlimited") {
            verifiedEmail = process.env.OWNER_BYPASS_EMAIL ?? "barisbagirlar@gmail.com";
            authMethod = "bypass";
          } else {
            const headerEmail = request.headers.get("x-user-email") ?? null;
            const ownerBypass = process.env.OWNER_BYPASS_EMAIL ?? "barisbagirlar@gmail.com";
            if (headerEmail === ownerBypass || process.env.NODE_ENV === "development") {
              verifiedEmail = headerEmail;
              authMethod = "bypass";
            }
          }
        }

        // Set outer-scope vars for downstream use (key deduction, etc.)
        userId = verifiedUserId;
        userEmail = verifiedEmail;

        // Session-based path: skip entitlement check + key deduction.
        // Session creation already verified Firebase Auth + credit balance.
        // The client now sends Authorization header, but we don't deduct again.
        const rawUsageSessionId2 = (rawBody as Record<string, unknown>).usageSessionId;
        const hasRealSession = rawUsageSessionId2 && rawUsageSessionId2 !== "bypass-unlimited";
        if (hasRealSession) {
          // Still verify token so we have userId for session validation + run decrement
          if (authMethod !== "token" || !verifiedUserId) {
            const errorResponse = buildFullBlockedResponse(
              "UNAUTHORIZED",
              "Authentication required for session-based execution.",
            );
            const { response: safeResponse } = redactPublicResponse(errorResponse);
            return NextResponse.json(safeResponse, { status: 401 });
          }
          // Skip entitlement check (already done in session creation)
          // Skip key deduction (already deducted in session creation)
        } else if (authMethod !== "bypass") {
          // Direct execution (no session): full entitlement check
          const entitlement = await checkBarisExecutionEntitlement({
            toolKey,
            userId,
            userEmail,
          });
          if (!entitlement.ok) {
            const statusCode = entitlement.reason === "PRO_ENTITLEMENT_REQUIRED" ? 402 : 403;
            const errorResponse = buildFullBlockedResponse(
              entitlement.reason,
              entitlement.reason === "PRO_ENTITLEMENT_REQUIRED"
                ? "Paid PRO key is required before execution. Purchase a key pack from your dashboard."
                : entitlement.reason === "BLOCKED_PAYMENT_INFRASTRUCTURE_NOT_BOUND"
                  ? "Payment infrastructure is not configured. Please contact support."
                  : "Execution blocked.",
            );
            const { response: safeResponse } = redactPublicResponse(errorResponse);
            return NextResponse.json(safeResponse, { status: statusCode });
          }
        }
      }
    }

    // ── Product-usage-policy gate (non-Baris, non-free Pro tools) ──
    // Pro tools that are not Baris INSTANT_PRO_CALCULATOR and not Free
    // use the centralized product-usage-policy: 1 credit → 3 uses.
    // Skip when a usageSessionId is present (session already deducted 1 credit).
    let isPaidProTool = false;
    if (!keyWasDeducted && userId && toolKey && !rawBody.usageSessionId) {
      const barisProduct = await import("@/sectorcalc/pro-commerce/baris-pro-products").then(m => m.getBarisProduct(toolKey!));
      const isFreeTool = schemaResult.source === "free_v531";
      if (!barisProduct && !isFreeTool) {
        const hasUsage = await checkProductUsage(userId, PRODUCT_KEYS.PRO_TOOLS);
        if (!hasUsage) {
          const grantResult = await grantProductUsesFromCredits(userId, PRODUCT_KEYS.PRO_TOOLS);
          if (!grantResult.ok) {
            const errorResponse = buildFullBlockedResponse(
              "KEY_DEDUCTION_FAILED",
              "1 credit is required to unlock 3 Pro Tool uses.",
            );
            const { response: safeResponse } = redactPublicResponse(errorResponse);
            return NextResponse.json(safeResponse, { status: 402 });
          }
        }
        isPaidProTool = true;
      }
    }

    // V5.4 Core — Register Free Pilot and Pro Pilot formulas in the formula registry
    registerFreePilotFormulas(validatedSchema);
    registerProPilotFormulas(validatedSchema);

    // ── Key-pool deduction setup (before calculation) ──────────────────
    // Determine if this is a Baris PRO instant calculator.
    // If yes, we generate a requestId and deduct atomically with ledger.
    // Skipped when usageSessionId is present — session already deducted 1 credit.

    if (toolKey && userId && !rawBody.usageSessionId) {
      const tk: string = toolKey;
      const uid: string = userId;
      const barisProduct = await import("@/sectorcalc/pro-commerce/baris-pro-products").then(m => m.getBarisProduct(tk));
      if (barisProduct && barisProduct.productMode === "INSTANT_PRO_CALCULATOR") {
        const { generateKeyRequestId, deductBarisProKeyAtomic } = await import("@/sectorcalc/pro-commerce/baris-key-deduction");
        barisRequestId = generateKeyRequestId(uid, tk);
        const deduction = await deductBarisProKeyAtomic(uid, tk, barisRequestId);

        if (!deduction.ok) {
          const errorResponse = buildFullBlockedResponse(
            "KEY_DEDUCTION_FAILED",
            deduction.reason === "INSUFFICIENT_KEYS"
              ? "Insufficient PRO keys. Purchase a key pack from your dashboard."
              : deduction.reason === "ALREADY_REFUNDED"
                ? "This request was already refunded — cannot execute again."
                : `Key deduction failed: ${deduction.reason}`,
          );
          const { response: safeResponse } = redactPublicResponse(errorResponse);
          const statusCode = deduction.reason === "INSUFFICIENT_KEYS" ? 402 : 500;
          return NextResponse.json(safeResponse, { status: statusCode });
        }

        keyWasDeducted = true;
      }
    }

    // ── PASS 2 — Runtime Calculation ──────────────────────────────────
    const pass2 = await pass2RuntimeExecution(body, validatedSchema);
    if (!pass2.ok) {
      // Refund key if deducted
      if (keyWasDeducted && userId && barisRequestId && toolKey) {
        const { refundBarisProKey } = await import("@/sectorcalc/pro-commerce/baris-key-deduction");
        await refundBarisProKey(userId!, toolKey!, barisRequestId!);
        keyWasDeducted = false;
      }

      // Build diagnostic metadata for validation errors (safe — no values or secrets)
      const validationStates = new Set(["INPUT_KEY_MISSING", "INPUT_KEY_UNKNOWN", "NON_FINITE_INPUT", "INVALID_UNIT", "UNIT_NORMALIZATION_FAILED"]);
      const hasDiagnostics = validationStates.has(pass2.pipelineState) && validatedSchema;
      const diagnosticInfo = hasDiagnostics ? {
        schema_input_ids: validatedSchema.inputs.map((i: any) => i.id),
        received_input_ids: Object.keys(body.raw_inputs || {}),
        missing_input_ids: validatedSchema.inputs.filter((i: any) => i.required && !(i.id in (body.raw_inputs || {}))).map((i: any) => i.id),
        unknown_input_ids: Object.keys(body.raw_inputs || {}).filter((k: string) => !validatedSchema.inputs.some((i: any) => i.id === k)),
      } : undefined;

      const errorResponse = buildFullBlockedResponse(pass2.pipelineState, pass2.errors.join("; "));
      (errorResponse as any).diagnostic = diagnosticInfo;
      const { response: safeResponse } = redactPublicResponse(errorResponse);
      return NextResponse.json(safeResponse, { status: 400 });
    }

    // ── PASS 3 — Public Output + Audit / Export Control ───────────────
    const pass3 = pass3PublicControl(body, validatedSchema, pass2);
    if (!pass3.ok) {
      // Refund key if deducted
      if (keyWasDeducted && userId && barisRequestId && toolKey) {
        const { refundBarisProKey } = await import("@/sectorcalc/pro-commerce/baris-key-deduction");
        await refundBarisProKey(userId!, toolKey!, barisRequestId!);
        keyWasDeducted = false;
      }
      return NextResponse.json(
        buildFullBlockedResponse("REDACTION_FAILED", "Public response redaction failed"),
        { status: 500 },
      );
    }

    // ── Premium hook ──────────────────────────────────────────────────
    const freeOutputs: Record<string, number> = {};
    for (const output of pass2.outputs) {
      if (typeof output.value === "number") {
        freeOutputs[output.id] = output.value;
      }
    }

    const premiumHook = buildPremiumHook({
      toolKey: body.tool_key,
      normalizedInputs: pass2.normalizedInputs,
      freeOutputs,
      displayCurrency: body.display_currency ?? null,
    });

    // ── Mark key as EXECUTED (success) ────────────────────────────────
    if (keyWasDeducted && userId && barisRequestId) {
      const { markKeyExecuted } = await import("@/sectorcalc/pro-commerce/baris-key-deduction");
      await markKeyExecuted(userId!, barisRequestId!);
    }

    // ── Decrement session remainingRuns ──────────────────────────────
    // When usageSessionId is present (session-based auth), decrement the
    // session's remainingRuns atomically with idempotency protection.
    if (rawBody.usageSessionId && rawBody.usageSessionId !== "bypass-unlimited" && userId && toolKey) {
      const { decrementProSessionRuns } = await import("@/lib/credits/tool-usage-session.server");
      try {
        await decrementProSessionRuns({
          userId,
          toolKey,
          usageSessionId: String(rawBody.usageSessionId),
          rawInputs: rawBody.raw_inputs,
          selectedUnits: rawBody.selected_units,
        });
      } catch {
        // Non-blocking — session decrement failure should not block the
        // calculation response. Will be retried on next execution.
      }
    }

    // ── Decrement product use (non-Baris Pro tools) ─────────────────
    if (isPaidProTool && userId) {
      await decrementProductUse(userId, PRODUCT_KEYS.PRO_TOOLS);
    }

    // Enrich with Universal Result Perspectives for Pro tools (V5.4)
    let universalResult: UniversalCalculationResult | undefined;
    try {
      const ur = buildUniversalResult(validatedSchema, body.raw_inputs ?? {}, pass3.response.outputs ?? []);
      if (ur) universalResult = ur;
    } catch {
      // non-blocking — Pro tools still get normal response
    }

    return NextResponse.json(
      { ...pass3.response, premium_hook: premiumHook ?? null, ...(universalResult ? { universal_result: universalResult } : {}) },
      { status: 200 },
    );
  } catch (error) {
    // ── Catch-all: refund key on unhandled exception ──────────────────
    if (keyWasDeducted && userId && barisRequestId && toolKey) {
      try {
        const { refundBarisProKey } = await import("@/sectorcalc/pro-commerce/baris-key-deduction");
        await refundBarisProKey(userId!, toolKey!, barisRequestId!);
      } catch {
        // Best-effort — log already emitted by refundBarisProKey
      }
    }
    const message = error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json(
      { status: "BLOCKED", pipeline_state: "SERVER_ERROR", error: message } as unknown as ExecuteResponse,
      { status: 500 },
    );
  }
}

// ── Helpers ──

function emptyDecision(state: string): DecisionInterpretation {
  return {
    primary_decision: "BLOCKED",
    primary_reason: `Pipeline state: ${state}`,
    user_profile_summary: {
      operator: "Calculation blocked.",
      engineer: `Pipeline blocked at: ${state}`,
      owner_cfo: "No results available.",
      checker_auditor: `Blocked state: ${state}`,
    },
    hidden_risk_explanations: [],
    money_impact_summary: {
      enabled: false, currency: null, money_at_risk_formatted: null,
      main_cost_driver: null, quote_or_decision_impact: "Calculation failed.",
    },
    what_can_flip_the_decision: [],
    next_best_actions: ["Review input values and re-submit."],
    premium_unlock_reason: "",
  };
}

export function buildFullBlockedResponse(pipelineState: string, reason: string): ExecuteResponse {
  return {
    status: "BLOCKED",
    pipeline_state: pipelineState,
    outputs: [{
      id: "calculation_status",
      name: "Calculation Status",
      value: "BLOCKED",
      status: "BLOCKED",
      public_explanation: "This calculation could not be completed.",
      decision_use: "Status indicator",
    }],
    warnings: [{
      id: "warn_blocked", severity: "CRITICAL",
      message: reason,
      why_it_matters: "The calculation encountered a blocking condition.",
      suggested_action: "Review input values and re-submit.",
    }],
    normalized_input_audit: [],
    reference_range_audit: [],
    sensitivity: [],
    scenario_compare: null,
    fmea_summary: null,
    proof_pack_public: { enabled: false, redaction_status: "PUBLIC_SAFE_REDACTED", sections: [] },
    decision_interpretation: emptyDecision(pipelineState),
    audit_seal: createAuditSeal({
      inputHash: computeHash("empty"),
      outputHash: computeHash("blocked"),
      schemaHash: computeHash("unknown"),
      formulaVersion: "stub",
      schemaVersion: "0.0.0",
      runtimeVersion: "superv4-v5.3-runtime-1.0.0",
    }),
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
