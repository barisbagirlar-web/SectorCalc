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
import { checkPhysicalBounds, hasBlockingViolation } from "@/sectorcalc/pro-runtime/physical-bounds-guard";
import { applyDerating, validateDeratingContract } from "@/sectorcalc/pro-runtime/derating-engine";
import { analyzeSensitivity } from "@/sectorcalc/pro-runtime/sensitivity-engine";
import { computeDecision } from "@/sectorcalc/pro-runtime/decision-engine";
import { evaluateAllReferenceRanges } from "@/sectorcalc/pro-form/reference-range-evaluator";
import { SchemaRegistry, schemaRegistry } from "@/sectorcalc/pro-form/schema-registry";
import { formulaRegistry } from "@/sectorcalc/pro-runtime/formula-registry";
import { executeFormulaGraph } from "@/sectorcalc/pro-runtime/deterministic-formula-engine";
import { getGeneratedToolSchema } from "@/lib/features/generated-tools/schema-loader";
import { loadGeneratedCalculator } from "@/lib/features/generated-tools/load-generated-calculator";
import { generatedToolSchemaToSuperV4Schema } from "@/sectorcalc/pro-form";
import { isIndustrialFreeToolSlug, buildIndustrialFreeToolSchema } from "@/lib/features/tools/industrial-free-schema-factory";
import { isFreeV531ToolSlug, getFreeV531Schema } from "@/lib/features/tools/free-v531-tool-registry";
import { buildPremiumHook } from "@/sectorcalc/monetization/build-premium-hook";
import { loadFreeFormulaModule } from "@/sectorcalc/formulas/free-v531/free-v531-formula-registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// ── PASS 1: Static Schema / Binding Control (Section 12) ──
interface Pass1Result {
  ok: boolean;
  schema: SuperV4Schema | null;
  errors: string[];
}

function pass1StaticControl(body: ExecuteRequest, schema: unknown): Pass1Result {
  if (!body.tool_key || !body.tool_id) {
    return { ok: false, schema: null, errors: ["Missing tool_key or tool_id"] };
  }
  if (!schema) {
    return { ok: false, schema: null, errors: [`Schema not found for tool_key: ${body.tool_key}`] };
  }

  const validation = validateSuperV4Schema(schema);
  if (!validation.ok) {
    return { ok: false, schema: null, errors: [`Schema validation failed: ${validation.errors.join("; ")}`] };
  }

  return { ok: true, schema: validation.schema, errors: [] };
}

// ── PASS 2: Runtime Determinism / Calculation (Section 12) ──
interface Pass2Result {
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

async function pass2RuntimeExecution(
  body: ExecuteRequest,
  validatedSchema: SuperV4Schema,
): Promise<Pass2Result> {
  const warnings: ServerWarning[] = [];
  const errors: string[] = [];

  // S1: Extract raw numeric inputs
  const rawNumericInputs: Record<string, number> = {};
  for (const [key, value] of Object.entries(body.raw_inputs)) {
    if (typeof value === "number") {
      if (!Number.isFinite(value)) {
        errors.push(`Non-finite value for input ${key}`);
      } else {
        rawNumericInputs[key] = value;
      }
    }
  }
  if (errors.length > 0) {
    return failResult("NON_FINITE_INPUT", errors);
  }

  // S2: Validate required inputs
  for (const inp of validatedSchema.inputs) {
    if (inp.required) {
      const value = body.raw_inputs[inp.id];
      if (value === undefined || value === null || value === "") {
        errors.push(`Missing required input: ${inp.id}`);
      }
    }
  }
  if (errors.length > 0) {
    return failResult("INPUT_VALIDATION_FAILED", errors);
  }

  // S3: Validate selected units
  for (const [inputId, unit] of Object.entries(body.selected_units)) {
    const inp = validatedSchema.inputs.find((i) => i.id === inputId);
    if (inp && inp.unit_selectable) {
      if (!inp.allowed_display_units.includes(unit)) {
        errors.push(`Unit "${unit}" is not allowed for input ${inputId}`);
      }
    }
  }
  if (errors.length > 0) {
    return failResult("INVALID_UNIT", errors);
  }

  // S4: Physical bounds check
  const boundsCheck = checkPhysicalBounds(validatedSchema.inputs, rawNumericInputs);
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

  // S5: Unit normalization
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

  // S8: Reference range evaluation
  const refRangeResult = evaluateAllReferenceRanges(validatedSchema.inputs, rawNumericInputs);
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

  // S11: Formula execution — V5.3.1 deterministic engine or generated calculator fallback
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

  // Look up formula registry for this tool
  const schemaMetadata = validatedSchema.metadata;
  const registryRecord = formulaRegistry.fetch(validatedSchema.tool_id, schemaMetadata?.formula_version ?? "1.0.0");

  if (registryRecord && registryRecord.nodes.length > 0) {
    // Path A: Use V5.3.1 formula registry engine
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
  } else {
    // Path B (fallback): Generated calculator module
    const calculatorModule = await loadGeneratedCalculator(validatedSchema.tool_key);
    if (calculatorModule) {
      try {
        const calcResult = calculatorModule.calculate(body.raw_inputs as Record<string, unknown>);
        const brk = calcResult.breakdown as Readonly<Record<string, number | undefined>> | undefined;
        outputs = validatedSchema.outputs.map((o) => {
          const raw = brk?.[o.id];
          const val = typeof raw === "number" ? raw : null;
          return {
            id: o.id,
            name: o.name,
            value: val,
            status: "OK" as CalcStatus,
            public_explanation: o.public_explanation ?? "",
            decision_use: o.decision_use ?? "",
          };
        });
      } catch (calcErr) {
        formulaEngineErrors.push(`Calculator module error: ${calcErr instanceof Error ? calcErr.message : String(calcErr)}`);
        outputs = (validatedSchema.outputs || []).map((o) => ({
          id: o.id,
          name: o.name,
          value: "Calculation error",
          status: "BLOCKED" as CalcStatus,
          public_explanation: o.public_explanation ?? "",
          decision_use: o.decision_use ?? "",
        }));
      }
    } else {
      // Path B2: Try Free V5.3.1 formula module
      const freeFormulaModule = await loadFreeFormulaModule(validatedSchema.tool_key);
      if (freeFormulaModule) {
        try {
          const calcResult = freeFormulaModule.calculate(body.raw_inputs as Record<string, number>);
          outputs = validatedSchema.outputs.map((o) => {
            const val = calcResult.outputs[o.id];
            return {
              id: o.id,
              name: o.name,
              value: typeof val === "number" ? val : null,
              status: calcResult.status === "OK" ? "OK" as CalcStatus : "REVIEW" as CalcStatus,
              public_explanation: o.public_explanation ?? "",
              decision_use: o.decision_use ?? "",
            };
          });
          for (const w of calcResult.warnings) {
            warnings.push({
              id: "free_formula", severity: "WARNING",
              message: w,
              why_it_matters: "Free formula module warning.",
              suggested_action: "Review input values.",
            });
          }
        } catch (calcErr) {
          formulaEngineErrors.push(`Free formula module error: ${calcErr instanceof Error ? calcErr.message : String(calcErr)}`);
          outputs = (validatedSchema.outputs || []).map((o) => ({
            id: o.id,
            name: o.name,
            value: "Calculation error",
            status: "BLOCKED" as CalcStatus,
            public_explanation: o.public_explanation ?? "",
            decision_use: o.decision_use ?? "",
          }));
        }
      } else {
        // Path C: No registry, no calculator module — use schema defaults
        outputs = (validatedSchema.outputs || []).map((o) => ({
          id: o.id,
          name: o.name,
          value: o.value ?? "No formula registered. Configure registry first.",
          status: "REVIEW" as CalcStatus,
          public_explanation: o.public_explanation ?? "",
          decision_use: o.decision_use ?? "",
        }));

        if (body.tool_key.slice(0, 1) >= "a" && body.tool_key.slice(0, 1) <= "z") {
          warnings.push({
            id: "formula_registry_missing", severity: "WARNING",
            message: `No formula registry or calculator module found for tool ${validatedSchema.tool_id} version ${schemaMetadata?.formula_version ?? "unknown"}. Schema output defaults used.`,
            why_it_matters: "Formula engine requires registered formulas to produce calculated outputs.",
            suggested_action: "Register formula nodes in FormulaRegistry before production use.",
          });
        }
      }  // close else (no free formula module)
    }  // close else (no calculator module)
  }  // close else (no registry record)

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
interface Pass3Result {
  ok: boolean;
  response: ExecuteResponse;
  auditSeal: AuditSeal;
}

function pass3PublicControl(
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
  try {
    const body: ExecuteRequest = await request.json();

    // PASS 1 — Static Schema / Binding Control
    // Load schema from generated schemas or premium-schema registry
    let schemaSource: SuperV4Schema | null = null;

    // Priority order: V5.3.1 native schemas > legacy generated schemas > industrial free schemas
    if (isFreeV531ToolSlug(body.tool_key)) {
      const freeSchema = getFreeV531Schema(body.tool_key);
      if (freeSchema) {
        schemaSource = freeSchema;
      }
    }

    if (!schemaSource) {
      const genSchema = getGeneratedToolSchema(body.tool_key);
      if (genSchema) {
        schemaSource = generatedToolSchemaToSuperV4Schema(genSchema, body.tool_key);
      }
    }

    if (!schemaSource && isIndustrialFreeToolSlug(body.tool_key)) {
      const indSchema = buildIndustrialFreeToolSchema(body.tool_key);
      if (indSchema) {
        schemaSource = generatedToolSchemaToSuperV4Schema(indSchema, body.tool_key);
      }
    }

    const pass1 = pass1StaticControl(body, schemaSource);
    if (!pass1.ok) {
      const errorResponse = buildFullBlockedResponse(
        pass1.errors[0] === "Missing tool_key or tool_id" ? "VALIDATION_FAILED" : "SCHEMA_NOT_FOUND",
        pass1.errors.join("; "),
      );
      const { response: safeResponse } = redactPublicResponse(errorResponse);
      return NextResponse.json(safeResponse, { status: 400 });
    }

    const validatedSchema = pass1.schema!;

    // PASS 2 — Runtime Determinism / Calculation
    const pass2 = await pass2RuntimeExecution(body, validatedSchema);
    if (!pass2.ok) {
      const errorResponse = buildFullBlockedResponse(pass2.pipelineState, pass2.errors.join("; "));
      const { response: safeResponse } = redactPublicResponse(errorResponse);
      return NextResponse.json(safeResponse, { status: 400 });
    }

    // PASS 3 — Public Output + Audit / Export Control
    const pass3 = pass3PublicControl(body, validatedSchema, pass2);
    if (!pass3.ok) {
      return NextResponse.json(
        buildFullBlockedResponse("REDACTION_FAILED", "Public response redaction failed"),
        { status: 500 },
      );
    }

    // Premium hook — build from normalized inputs and free outputs
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

    return NextResponse.json(
      { ...pass3.response, premium_hook: premiumHook ?? null },
      { status: 200 },
    );
  } catch (error) {
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

function buildFullBlockedResponse(pipelineState: string, reason: string): ExecuteResponse {
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
