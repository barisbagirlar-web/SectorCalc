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
import type { SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";
import type { ExecuteResponse } from "@/sectorcalc/pro-form/contract-types";
import { isProBypassEmail } from "@/lib/features/billing/subscription";
import { validateSuperV4Schema } from "@/sectorcalc/pro-form/schema-adapter";
import { createAuditSeal, computeHash } from "@/sectorcalc/pro-runtime/audit-seal-service";
import type { ExecuteRequest } from "@/sectorcalc/pro-form/contract-types";
import { registerFreePilotFormulas } from "@/sectorcalc/formulas/free-v531/break-even-and-margin-of-safety-analysis.registry";
import { freeV531FormulaRegistry } from "@/sectorcalc/formulas/free-v531/index";
import { buildPremiumHook } from "@/sectorcalc/monetization/build-premium-hook";
import {
  pass2RuntimeExecution,
  pass3PublicControl,
  buildFullBlockedResponse,
} from "@/app/api/pro-calculator/execute/route";

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
      // Free tools: execute entirely in-process — no internal HTTP fetch.
      // This is the critical production fix: Firebase Cloud Functions do not
      // support loopback HTTP within the same function environment.

      // Register Free pilot formulas in the formula registry
      registerFreePilotFormulas(validatedSchema);

      // Build ExecuteRequest matching the pro-calculator contract
      const execBody: ExecuteRequest = {
        tool_id: validatedSchema.tool_id,
        tool_key: body.toolKey,
        schema_version: validatedSchema.metadata?.schema_version || "1.0.0",
        raw_inputs: Object.fromEntries(
          Object.entries(body.rawInputs ?? {}).filter(([, v]) => typeof v === "number" && Number.isFinite(v)),
        ),
        selected_units: body.selectedUnits,
        user_profile_mode: body.profileMode ?? "engineering",
        client_schema_hash: body.clientSchemaHash,
        display_currency: body.displayCurrency ?? null,
      };

      // PASS 2 — Runtime Determinism / Calculation
      const pass2 = await pass2RuntimeExecution(execBody, validatedSchema);
      if (!pass2.ok) {
        const blocked = buildFullBlockedResponse(pass2.pipelineState, pass2.errors.join("; "));
        return NextResponse.json(blocked, { status: 200 });
      }

      // V5.4 Core — Inject Free V5.3.1 formula module computed values
      // when the graph engine produced static defaults. The formula engine
      // stores registry-missing errors in a local variable not exposed in
      // pass2.errors, so we detect Path B by checking if all output values
      // are schema defaults (0 | null).
      const formulaModule = freeV531FormulaRegistry[body.toolKey];
      const allZero = pass2.outputs.every(o => o.value === 0 || o.value === null);
      if (formulaModule && allZero) {
        try {
          const formulaResult = formulaModule.execute(execBody.raw_inputs);
          if (formulaResult && formulaResult.outputs) {
            for (const fo of formulaResult.outputs) {
              const existing = pass2.outputs.find(o => o.id === fo.id);
              if (existing && typeof fo.value === "number" && Number.isFinite(fo.value)) {
                existing.value = fo.value;
                existing.status = "OK";
                (existing as any).public_explanation = fo.publicExplanation;
              }
            }
          }
        } catch {
          // Formula module threw — keep Path B default values
        }
      }

      // PASS 3 — Public Output + Audit / Export Control
      const pass3 = pass3PublicControl(execBody, validatedSchema, pass2);
      if (!pass3.ok) {
        const blocked = buildFullBlockedResponse("REDACTION_FAILED", "Public response redaction failed");
        return NextResponse.json(blocked, { status: 500 });
      }

      // Premium hook — build from normalized inputs and free outputs
      const freeOutputs: Record<string, number> = {};
      for (const output of pass2.outputs) {
        if (typeof output.value === "number") {
          freeOutputs[output.id] = output.value;
        }
      }
      const premiumHook = buildPremiumHook({
        toolKey: body.toolKey,
        normalizedInputs: pass2.normalizedInputs,
        freeOutputs,
        displayCurrency: body.displayCurrency ?? null,
      });

      return NextResponse.json(
        { ...pass3.response, premium_hook: premiumHook ?? null, accessTier },
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

    const executeResult = await internalResponse.json();

    const response: Record<string, unknown> = {
      ...executeResult,
      accessTier,
      redaction_status: (executeResult as Record<string, unknown>)?.redaction_status ?? "PUBLIC_SAFE_REDACTED",
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
