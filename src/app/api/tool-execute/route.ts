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
import type { SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";
import { isProBypassEmail } from "@/lib/features/billing/subscription";

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

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const raw: Record<string, unknown> = await request.json();
    const body = raw as unknown as ToolExecuteRequest;

    // Accept both camelCase (tool-execute contract) and snake_case (machine ExecuteRequest)
    const toolKey = extractField<string>(raw, "toolKey", "tool_key");
    if (!toolKey || typeof toolKey !== "string") {
      return NextResponse.json({ error: "MISSING_TOOL_KEY" }, { status: 400 });
    }
    body.toolKey = toolKey;
    if (!body.rawInputs) body.rawInputs = (extractField<Record<string, unknown>>(raw, "rawInputs", "raw_inputs") ?? {});
    if (!body.selectedUnits) body.selectedUnits = (extractField<Record<string, string>>(raw, "selectedUnits", "selected_units") ?? {});
    if (!body.profileMode) body.profileMode = extractField<any>(raw, "profileMode", "user_profile_mode");
    if (!body.clientSchemaHash) body.clientSchemaHash = extractField<string>(raw, "clientSchemaHash", "client_schema_hash");
    if (!body.displayCurrency) body.displayCurrency = extractField<string>(raw, "displayCurrency", "display_currency");

    // ── Resolve tool from manifest ─────────────────────────────
    const manifestEntry = getPublicToolBySlug(body.toolKey);
    if (!manifestEntry) {
      return NextResponse.json({ error: "TOOL_NOT_FOUND" }, { status: 404 });
    }

    const accessTier = manifestEntry.accessTier;

    // ── Authenticate for Pro tools ──────────────────────────────
    let userId: string | null = null;
    let remainingRuns: number | null = null;
    let sessionExhausted = false;

    if (accessTier === "PRO") {
      const token = parseBearerToken(request);
      if (!token) {
        return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
      }
      const user = await verifySignedInUser(token);
      if (!user) {
        return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
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
          return NextResponse.json({ error: validation.reason }, { status: 403 });
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
    const schemaResult = resolveApprovedToolSchema(body.toolKey);
    if (!schemaResult.ok || !schemaResult.schema) {
      return NextResponse.json({ error: "SCHEMA_NOT_FOUND" }, { status: 404 });
    }

    const validatedSchema = schemaResult.schema as SuperV4Schema;

    // ── Forward to Pro calculator execution ────────────────────
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
      return NextResponse.json(
        { error: "EXECUTION_FAILED", details: errorData },
        { status: internalResponse.status },
      );
    }

    const executeResult = await internalResponse.json();

    // ── Return result ───────────────────────────────────────────
    const response: Record<string, unknown> = {
      ...executeResult,
      accessTier,
    };

    if (accessTier === "PRO" && body.usageSessionId) {
      response.usageSessionId = body.usageSessionId;
      response.remainingRuns = remainingRuns;
      response.sessionExhausted = sessionExhausted;
    }

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json(
      { status: "BLOCKED", pipeline_state: "SERVER_ERROR", error: message },
      { status: 500 },
    );
  }
}
