// SectorCalc Central Tool Execution API
// All Free and Pro calculation submissions use this one endpoint.
//
// Execution policy:
// - Free tools: no credit required, no session required, execute server-side
// - Pro tools: require valid usage session, decrement remainingRuns atomically
// - Owner bypass: unlimited access, no credit deduction, skip session validation
// - No client-side formula execution
// - No payment provider called during execution

import { NextRequest, NextResponse } from "next/server";
import { parseBearerToken, verifySignedInUser } from "@/lib/infrastructure/firebase/verify-signed-in-user";
import { getPublicToolBySlug } from "@/sectorcalc/runtime/public-tool-manifest";
import {
  validateProExecution,
  decrementProSessionRuns,
} from "@/lib/credits/tool-usage-session.server";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";
import { getFreeToolSchema } from "@/sectorcalc/runtime/free-schema-loader";
import { isActiveTool } from "@/sectorcalc/runtime/active-tool-allowlist";
import type { SuperV4Schema, ExecuteResponse, CalcStatus, Severity, SourceStatus, ServerOutput } from "@/sectorcalc/pro-form/contract-types";
import { isProBypassEmail } from "@/lib/features/billing/subscription";
import { validateSuperV4Schema } from "@/sectorcalc/pro-form/schema-adapter";
import { createAuditSeal, computeHash } from "@/sectorcalc/pro-runtime/audit-seal-service";
import { freeV531FormulaRegistry } from "@/sectorcalc/formulas/free-v531/index";
import { buildPremiumHook } from "@/sectorcalc/monetization/build-premium-hook";
import { buildUniversalResult } from "@/sectorcalc/result-perspectives/universal-result-adapter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

interface ToolExecuteRequest {
  toolKey: string;
  rawInputs: Record<string, unknown>;
  selectedUnits: Record<string, string>;
  profileMode?: "quick" | "engineering" | "cost" | "audit";
  usageSessionId?: string | null;
  clientSchemaHash?: string;
  displayCurrency?: string | null;
  /** Client-generated UUID for execution idempotency. Prevents double-decrement on retry/double-click. */
  clientRequestId?: string | null;

  /** Snake-case aliases (sent by UniversalIndustrialDecisionForm machine). */
  tool_key?: string;
  raw_inputs?: Record<string, unknown>;
  selected_units?: Record<string, string>;
  user_profile_mode?: string;
  client_schema_hash?: string;
  display_currency?: string | null;
}

function extractField<T>(body: Record<string, unknown>, camel: string, snake: string): T | undefined {
  return (body[camel] ?? body[snake]) as T | undefined;
}

/**
 * Resolve the raw input payload from any of the accepted request body shapes.
 *
 * Accepts (in priority order):
 *   raw_inputs / rawInputs
 *   inputs / input_values / inputValues
 *   values
 *   Flat body fallback: any key not in the reserved set is treated as an input.
 */
function resolveRawInputs(body: Record<string, unknown>): Record<string, unknown> {
  const candidate =
    body.raw_inputs ??
    body.rawInputs ??
    body.inputs ??
    body.input_values ??
    body.inputValues ??
    body.values;

  if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
    return candidate as Record<string, unknown>;
  }

  // Flat body fallback: treat every non-reserved key as an input value.
  const reserved = new Set([
    "tool_key",
    "toolKey",
    "tool_id",
    "toolId",
    "slug",
    "locale",
    "session_id",
    "sessionId",
    "source",
    "metadata",
    "selected_units",
    "selectedUnits",
    "user_profile_mode",
    "profileMode",
    "client_schema_hash",
    "clientSchemaHash",
    "display_currency",
    "displayCurrency",
    "usage_session_id",
    "usageSessionId",
    "client_request_id",
    "clientRequestId",
  ]);

  return Object.fromEntries(
    Object.entries(body).filter(([key]) => !reserved.has(key))
  );
}

/**
 * Build a minimal blocked ExecuteResponse that satisfies the V5.3.1 contract
 * (status, pipeline_state, outputs, warnings, normalized_input_audit,
 *  reference_range_audit, sensitivity, scenario_compare, fmea_summary,
 *  proof_pack_public, decision_interpretation, audit_seal, redaction_status).
 *
 * Every return path from this API must use this helper so the client-side
 * parseExecuteResponse() never sees a contract violation.
 */
function buildBlockedToolResponse(pipelineState: string, message: string): ExecuteResponse {
  const seal = createAuditSeal({
    inputHash: computeHash("empty"),
    outputHash: computeHash("blocked"),
    schemaHash: computeHash("unknown"),
    formulaVersion: "stub",
    schemaVersion: "0.0.0",
    runtimeVersion: "superv4-v5.3-runtime-1.0.0",
  });
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
      id: "warn_blocked",
      severity: "CRITICAL",
      message,
      why_it_matters: "The calculation encountered a blocking condition.",
      suggested_action: "Review input values and re-submit.",
    }],
    normalized_input_audit: [],
    reference_range_audit: [],
    sensitivity: [],
    scenario_compare: null,
    fmea_summary: null,
    proof_pack_public: { enabled: false, redaction_status: "PUBLIC_SAFE_REDACTED", sections: [] },
    decision_interpretation: {
      primary_decision: "BLOCKED",
      primary_reason: `Pipeline state: ${pipelineState}`,
      user_profile_summary: {
        operator: "Calculation blocked.",
        engineer: `Pipeline blocked at: ${pipelineState}`,
        owner_cfo: "No results available.",
        checker_auditor: `Blocked state: ${pipelineState}`,
      },
      hidden_risk_explanations: [],
      money_impact_summary: {
        enabled: false, currency: null, money_at_risk_formatted: null,
        main_cost_driver: null, quote_or_decision_impact: "Calculation failed.",
      },
      what_can_flip_the_decision: [],
      next_best_actions: ["Review input values and re-submit."],
      premium_unlock_reason: "",
    },
    audit_seal: seal,
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const raw: Record<string, unknown> = await request.json();
    const body = raw as unknown as ToolExecuteRequest;

    // Accept camelCase, snake_case, slug, and tool_slug (machine ExecuteRequest / form submissions)
    let toolKey = extractField<string>(raw, "toolKey", "tool_key");
    if (!toolKey || typeof toolKey !== "string") {
      toolKey = extractField<string>(raw, "slug", "tool_slug");
    }
    if (!toolKey || typeof toolKey !== "string") {
      return NextResponse.json(buildBlockedToolResponse("MISSING_TOOL_KEY", "No tool key provided in request."), { status: 400 });
    }
    // Free slugs use hyphens, but callers may send underscores.
    // Normalize underscores to hyphens so Free schemas resolve correctly.
    // Pro slugs (sc_*) are already underscore-canonical — do not normalize those.
    if (!toolKey.startsWith("sc_")) {
      toolKey = toolKey.replace(/_/g, "-");
    }
    body.toolKey = toolKey;
    if (!body.rawInputs) body.rawInputs = resolveRawInputs(raw);
    if (!body.selectedUnits) body.selectedUnits = (extractField<Record<string, string>>(raw, "selectedUnits", "selected_units") ?? {});
    if (!body.profileMode) body.profileMode = extractField<any>(raw, "profileMode", "user_profile_mode");
    if (!body.clientSchemaHash) body.clientSchemaHash = extractField<string>(raw, "clientSchemaHash", "client_schema_hash");
    if (!body.displayCurrency) body.displayCurrency = extractField<string>(raw, "displayCurrency", "display_currency");

    // ── V5.4 Core — Allowlist gate ──────────────────────────────
    if (!isActiveTool(body.toolKey)) {
      return NextResponse.json(buildBlockedToolResponse("DISABLED", "Tool is under V5.4 Core rebuild verification."), { status: 404 });
    }

    // ── Resolve tool from manifest ─────────────────────────────
    const manifestEntry = getPublicToolBySlug(body.toolKey);
    if (!manifestEntry) {
      return NextResponse.json(buildBlockedToolResponse("TOOL_NOT_FOUND", "Tool not found in manifest."), { status: 404 });
    }

    const accessTier = manifestEntry.accessTier;

    // ── Authenticate for Pro tools ──────────────────────────────
    let userId: string | null = null;
    let remainingRuns: number | null = null;
    let sessionExhausted = false;

    if (accessTier === "PRO") {
      const token = parseBearerToken(request);
      if (!token) {
        return NextResponse.json(buildBlockedToolResponse("UNAUTHORIZED", "Authentication token is required."), { status: 401 });
      }
      const user = await verifySignedInUser(token);
      if (!user) {
        return NextResponse.json(buildBlockedToolResponse("UNAUTHORIZED", "Invalid or expired authentication token."), { status: 401 });
      }
      userId = user.uid;

      // ── Owner bypass: skip session validation, unlimited runs ─────
      // We check email from the verified auth token — NOT from body.usageSessionId —
      // because the machine's ExecuteRequest type doesn't carry usageSessionId.
      if (user.email && isProBypassEmail(user.email)) {
        remainingRuns = 999;
        sessionExhausted = false;
      } else {
        // ── Enforce Pro usage session ─────────────────────────────
        const validation = await validateProExecution(
          userId,
          body.toolKey,
          body.usageSessionId ?? null,
        );
        if (!validation.ok) {
          return NextResponse.json(buildBlockedToolResponse("SESSION_REJECTED", validation.reason), { status: 403 });
        }

        // ── Decrement remainingRuns atomically (idempotent) ────────
        const clientRequestId =
          typeof body.clientRequestId === "string" && body.clientRequestId.trim()
            ? body.clientRequestId.trim()
            : null;

        const decrementResult = await decrementProSessionRuns({
          userId,
          toolKey: body.toolKey,
          usageSessionId: body.usageSessionId!,
          clientRequestId,
          rawInputs: body.rawInputs,
          selectedUnits: body.selectedUnits,
        });

        remainingRuns = decrementResult.remainingRuns;
        sessionExhausted = decrementResult.status === "EXHAUSTED";
      }
    }

    // ── Resolve and validate schema ─────────────────────────────
    // Try the canonical resolver first (handles Pro + cached Free).
    let schemaResult = resolveApprovedToolSchema(body.toolKey);

    // If canonical resolver fails for a Free tool, try direct Free schema
    // loading as a robustness measure (handles dev HMR edge cases where
    // the schema loader's module-level cache is in a bad state).
    if ((!schemaResult.ok || !schemaResult.schema) && accessTier === "FREE") {
      const directFree = getFreeToolSchema(body.toolKey);
      if (directFree) {
        const val = validateSuperV4Schema(directFree);
        if (val.ok) {
          schemaResult = { ok: true, schema: val.schema, source: "free_v531" };
        }
      }
    }

    if (!schemaResult.ok || !schemaResult.schema) {
      return NextResponse.json(buildBlockedToolResponse("SCHEMA_NOT_FOUND", `Schema not found for tool: ${body.toolKey}`), { status: 404 });
    }

    const validatedSchema = schemaResult.schema as SuperV4Schema;

    // ── Execute server-side in-process (Free) or internal fetch (Pro) ──
    if (accessTier === "FREE") {
      // Free tools: execute entirely in-process — direct formula module call.
      // This bypasses the PRO pass2RuntimeExecution pipeline which blocks
      // free tools with PAID_PRO_SCHEMA_FALLBACK=FORBIDDEN.

      // Build raw inputs from request body (numeric only, finite)
      const entries = Object.entries(body.rawInputs ?? {}).filter(
        ([, v]) => typeof v === "number" && Number.isFinite(v),
      ) as Array<[string, number]>;
      const rawInputs: Record<string, number> = Object.fromEntries(entries);
      // Also accept string values that parse to finite numbers
      for (const [k, v] of Object.entries(body.rawInputs ?? {})) {
        if (typeof v === "string" && v.trim()) {
          const n = Number(v.trim());
          if (Number.isFinite(n) && !(k in rawInputs)) {
            rawInputs[k] = n;
          }
        }
      }

      // Find the free formula module for this tool
      const formulaModule = freeV531FormulaRegistry[body.toolKey];
      if (!formulaModule || typeof formulaModule.execute !== "function") {
        return NextResponse.json(
          buildBlockedToolResponse("NO_FORMULA_MODULE", `Formula module not found for free tool: ${body.toolKey}`),
          { status: 200 },
        );
      }

      // Execute the formula directly
      let formulaResult;
      try {
        formulaResult = formulaModule.execute(rawInputs);
      } catch (execError) {
        const msg = execError instanceof Error ? execError.message : "Formula execution error";
        return NextResponse.json(buildBlockedToolResponse("FORMULA_EXECUTION_ERROR", msg), { status: 200 });
      }

      if (!formulaResult || !formulaResult.outputs || !Array.isArray(formulaResult.outputs)) {
        return NextResponse.json(
          buildBlockedToolResponse("INVALID_FORMULA_RESULT", "Formula returned no outputs."),
          { status: 200 },
        );
      }

      // Mapping from formula output ID → schema output ID for tools where IDs differ
      const FORMULA_TO_SCHEMA_OUTPUT_MAP: Record<string, Record<string, string>> = {
        "cnc-shop-hourly-rate": { "true_hourly_rate": "hourly_rate" },
        "iso-286-tolerance-fit": { "minimum_clearance_mm": "fit_clearance_range_mm" },
        "surface-roughness-converter": { "roughness_ra_um": "roughness_equivalent" },
        "thread-dimensions-reference": { "pitch_diameter_approx_mm": "thread_reference_dimensions" },
        "knurling-drill-point-depth": { "drill_point_depth_mm": "depth_or_pitch_mm" },
        "weld-metal-weight-consumable": { "deposited_weld_metal_kg": "weld_consumable_mass" },
        "bolt-preload-clamp-force": { "initial_preload_kn": "clamp_force_kn" },
        "steel-weight": { "net_steel_weight_kg": "steel_weight_kg" },
        "takt-time-cycle-time": { "takt_time_seconds": "capacity_gap" },
      };
      const outputMap = FORMULA_TO_SCHEMA_OUTPUT_MAP[body.toolKey] ?? {};

      // Map formula outputs to schema outputs
      const schemaOutputs = validatedSchema.outputs ?? [];
      const mappedOutputs = schemaOutputs.map((so) => {
        const formulaId = Object.entries(outputMap).find(([, sId]) => sId === so.id)?.[0] ?? so.id;
        const fo = formulaResult!.outputs.find((o: any) => o.id === formulaId);
        const value = fo && typeof fo.value === "number" && Number.isFinite(fo.value) ? fo.value : null;
        const formulaUnit = fo && typeof (fo as any).unit === "string" ? (fo as any).unit : null;
        const status: CalcStatus = value !== null ? "OK" : "REVIEW";
        return {
          id: so.id,
          name: so.name ?? so.id,
          value,
          unit: so.unit ?? formulaUnit,
          status,
          formula_source: null,
          public_explanation: so.public_explanation ?? "Result computed server-side.",
          operator_explanation: so.operator_explanation ?? "",
          engineer_explanation: so.engineer_explanation ?? "",
          owner_cfo_explanation: so.owner_cfo_explanation ?? "",
          checker_explanation: so.checker_explanation ?? "",
          decision_use: so.decision_use ?? "Primary decision indicator",
          evidence_level: so.evidence_level ?? ("SCREENING_ONLY" as const),
        };
      });

      // Build normalized input audit
      const normalizedInputAudit = (validatedSchema.inputs ?? []).map((input) => {
        const rawVal = body.rawInputs?.[input.id] as string | number | boolean | null | undefined;
        const userProvided = rawVal !== undefined && rawVal !== null && rawVal !== "";
        return {
          input_id: input.id,
          normalized_id: input.normalized_id ?? `n_${input.id}`,
          display_value: rawVal ?? null,
          display_unit: body.selectedUnits?.[input.id] ?? input.base_unit ?? null,
          base_value: rawVal ?? null,
          base_unit: input.base_unit ?? null,
          source_status: userProvided
            ? ("USER_PROVIDED" as SourceStatus)
            : (input.source_status ?? "NEEDS_SOURCE_VERIFICATION" as SourceStatus),
        };
      });

      // Build audit seal
      const auditSeal = createAuditSeal({
        inputHash: computeHash(JSON.stringify(rawInputs)),
        outputHash: computeHash(JSON.stringify(mappedOutputs)),
        schemaHash: computeHash(validatedSchema.tool_id ?? body.toolKey),
        formulaVersion: validatedSchema.metadata?.formula_version ?? "5.3.1",
        schemaVersion: validatedSchema.metadata?.schema_version ?? "5.3.1",
        runtimeVersion: "superv4-v5.3-runtime-1.0.0",
      });

      // Determine primary decision based on results
      const allOk = mappedOutputs.every((o) => o.status === "OK");
      const primaryDecision = allOk ? ("OK" as const) : ("REVIEW" as const);

      // Build warnings — include a note about screening-level confidence
      const warnings: Array<{ id: string; severity: Severity; message: string; why_it_matters: string; suggested_action: string }> = [];
      if (Object.keys(rawInputs).length === 0) {
        warnings.push({
          id: "warn_no_inputs",
          severity: "WARNING",
          message: "No numeric inputs provided. Calculation ran with empty defaults.",
          why_it_matters: "Results are based on zero or default inputs and do not reflect actual conditions.",
          suggested_action: "Enter valid numeric values and re-calculate.",
        });
      }

      // Premium hook
      const freeOutputs: Record<string, number> = {};
      for (const output of mappedOutputs) {
        if (typeof output.value === "number") {
          freeOutputs[output.id] = output.value;
        }
      }
      const premiumHook = buildPremiumHook({
        toolKey: body.toolKey,
        normalizedInputs: rawInputs,
        freeOutputs,
        displayCurrency: body.displayCurrency ?? null,
      });

      // Build final response matching ExecuteResponse contract
      const universalResult = buildUniversalResult(validatedSchema, rawInputs, mappedOutputs);
      const freeResponse: ExecuteResponse = {
        status: primaryDecision,
        pipeline_state: "COMPLETE",
        outputs: mappedOutputs,
        warnings,
        normalized_input_audit: normalizedInputAudit,
        reference_range_audit: [],
        sensitivity: [],
        scenario_compare: null,
        fmea_summary: null,
        proof_pack_public: {
          enabled: true,
          redaction_status: "PUBLIC_SAFE_REDACTED",
          sections: [
            {
              id: "execution_summary",
              title: "Execution Summary",
              public_content: "Calculation executed server-side. Results are for decision support only.",
            },
          ],
        },
        decision_interpretation: {
          primary_decision: primaryDecision,
          primary_reason: allOk ? "All outputs computed successfully." : "One or more outputs could not be computed.",
          user_profile_summary: {
            operator: allOk ? "All checks passed." : "Some values need review.",
            engineer: `Computed ${mappedOutputs.length} output(s). ${allOk ? "All OK." : "Some outputs in REVIEW state."}`,
            owner_cfo: allOk ? "Calculation completed." : "Calculation completed with review flags.",
            checker_auditor: `Free tool execution via ${body.toolKey}. Status: ${primaryDecision}.`,
          },
          hidden_risk_explanations: [],
          money_impact_summary: {
            enabled: false,
            currency: null,
            money_at_risk_formatted: null,
            main_cost_driver: null,
            quote_or_decision_impact: "Free screening tool.",
          },
          what_can_flip_the_decision: [],
          next_best_actions: ["Review output values.", "Consider upgrading to Pro for full analysis."],
          premium_unlock_reason: "",
        },
        audit_seal: auditSeal,
        redaction_status: "PUBLIC_SAFE_REDACTED",
        universal_result: universalResult ?? undefined,
      };

      return NextResponse.json(
        { ...freeResponse, premium_hook: premiumHook ?? null, accessTier },
        { status: 200 },
      );
    }

    // ── Pro tools: forward to Pro calculator execution (internal fetch) ──
    // Note: internal fetch is retained for Pro tools pending the same
    // in-process refactor. Free tools are the priority hotfix.
    const executeUrl = new URL(request.url);
    executeUrl.pathname = "/api/pro-calculator/execute";

    const executeBody = {
      tool_id: validatedSchema.tool_id,
      tool_key: body.toolKey,
      schema_version: validatedSchema.metadata?.schema_version || "1.0.0",
      raw_inputs: body.rawInputs,
      selected_units: body.selectedUnits,
      user_profile_mode: body.profileMode ?? "engineering",
      client_schema_hash: body.clientSchemaHash,
      display_currency: body.displayCurrency ?? null,
      usageSessionId: body.usageSessionId ?? null,
    };

    const internalResponse = await fetch(executeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(executeBody),
    });

    if (!internalResponse.ok) {
      const errorData = await internalResponse.json().catch(() => ({}));
      const upstreamBlocked = errorData && typeof errorData === "object" && typeof errorData.redaction_status === "string"
        ? (errorData as ExecuteResponse)
        : buildBlockedToolResponse("EXECUTION_FAILED", `Upstream execution failed: ${JSON.stringify(errorData).slice(0, 200)}`);
      return NextResponse.json(upstreamBlocked, { status: 200 });
    }

    const executeResult = await internalResponse.json() as Record<string, unknown>;
    const proOutputs = (executeResult?.outputs ?? []) as ServerOutput[];

    // Enrich with Universal Result Perspectives for Pro tools too
    let universalResult: import("@/sectorcalc/pro-form/contract-types").UniversalCalculationResult | undefined;
    try {
      const enriched = buildUniversalResult(validatedSchema, body.rawInputs ?? {}, proOutputs);
      if (enriched) universalResult = enriched;
    } catch {
      // adapter error — non-blocking; Pro tools still get normal response
    }

    const response: Record<string, unknown> = {
      ...executeResult,
      accessTier,
      redaction_status: (executeResult as Record<string, unknown>)?.redaction_status ?? "PUBLIC_SAFE_REDACTED",
      ...(universalResult ? { universal_result: universalResult } : {}),
    };

    if (accessTier === "PRO" && body.usageSessionId) {
      response.usageSessionId = body.usageSessionId;
      response.remainingRuns = remainingRuns;
      response.sessionExhausted = sessionExhausted;
    }

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json(buildBlockedToolResponse("SERVER_ERROR", message), { status: 500 });
  }
}
