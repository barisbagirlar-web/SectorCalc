/**
 * Engineering Diagnostics — AI Draft Endpoint
 *
 * POST /api/engineering-diagnostics/ai-draft
 *
 * Generates an AI-assisted engineering reasoning draft from:
 *   - Domain context
 *   - Problem description (text, optional image)
 *   - Deterministic analyze result (read-only)
 *   - Report contract summary
 *
 * STRICT:
 * - AI NEVER overrides deterministic numeric values
 * - AI output is always Zod-validated + guardrail-checked + redacted
 * - Falls back to domain templates if OpenAI is unavailable
 * - Requires Bearer auth + diagnostic entitlement
 * - Does NOT generate PDF
 * - Does NOT decrement credit in this endpoint (preview/assist only)
 *
 * @see buildEngineeringAiDraft in sectorcalc/diagnostics/ai
 */

import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  parseBearerToken,
  verifySignedInUser,
} from "@/lib/infrastructure/firebase/verify-signed-in-user";
import {
  getRemainingDiagnosticUses,
} from "@/sectorcalc/diagnostics/diagnostic-package";
import { buildEngineeringAiDraft } from "@/sectorcalc/diagnostics/ai/diagnostic-ai-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ── Request schema ── */

const AiDraftRequestSchema = z.object({
  domain_id: z.string().min(1),
  domain_label: z.string().min(1),
  problem_context: z.string().min(1).max(10000),
  optional_image: z.string().optional(),
  deterministic_result: z.object({
    measurement_count: z.number().nonnegative(),
    worst_case_tolerance_status: z.string().min(1),
    cost_at_risk: z.number().nonnegative(),
    decision: z.string().min(1),
    total_risk_score: z.number().min(0).max(100),
  }),
  report_contract: z.object({
    domain_section: z.object({
      category: z.string().min(1),
      process_description: z.string().min(1),
      common_defect_modes: z.array(z.string()),
    }),
    action_plan: z.object({
      containment_count: z.number().nonnegative(),
      temp_fix_count: z.number().nonnegative(),
      permanent_action_count: z.number().nonnegative(),
      manual_check_count: z.number().nonnegative(),
    }),
  }),
});

/* ── POST handler ── */

export async function POST(req: Request) {
  try {
    /* 1. Auth gate */
    const token = parseBearerToken(req);
    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Authentication required." },
        { status: 401 },
      );
    }

    const user = await verifySignedInUser(token);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Invalid or expired authentication token." },
        { status: 401 },
      );
    }

    /* 2. Diagnostic package gate — check remaining uses without auto-grant */
    const remainingUses = await getRemainingDiagnosticUses(user.uid);
    if (remainingUses <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "INSUFFICIENT_DIAGNOSTIC_CREDITS",
          message: "A diagnostic package is required. Start a Full Diagnostic first.",
          action: "Start Full Diagnostic",
        },
        { status: 402 },
      );
    }
    /* Note: AI Draft is a preview/assist feature that uses remaining diagnostic
       entitlement without decrementing. If you have remaining uses, you can
       use the AI draft as a supplementary assistant at no extra cost.
       The actual use is decremented when you generate the Full Diagnostic report. */

    /* 3. Parse and validate request body */
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    const parsed = AiDraftRequestSchema.safeParse(body);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      }));
      return NextResponse.json(
        { ok: false, error: "Schema validation failed", issues },
        { status: 422 },
      );
    }

    const input = parsed.data;

    /* 4. Build AI draft (source = "openai" or "fallback") */
    const result = await buildEngineeringAiDraft({
      domain_id: input.domain_id,
      domain_label: input.domain_label,
      problem_context: input.problem_context,
      optional_image: input.optional_image,
      deterministic_result: input.deterministic_result,
      report_contract: input.report_contract,
    });

    /* 5. Return validated AI draft */
    return NextResponse.json({
      ok: true,
      source: result.source,
      ai_draft: result.ai_draft,
      message:
        result.source === "fallback"
          ? "AI-assisted engineering reasoning was not available. Template-based draft returned."
          : "AI-assisted engineering reasoning generated successfully.",
    });
  } catch (err) {
    console.error("[ai-draft] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
