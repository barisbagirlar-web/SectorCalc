/**
 * POST /api/engineering-diagnostics/full-diagnostic
 *
 * Generates a Full Engineering Diagnostic with AI-assisted interpretation.
 * Accepts optional photo evidence for vision-based AI analysis.
 *
 * Requires:
 * - Bearer auth token
 * - Diagnostic package entitlement
 *
 * Flow: auth → package check → validate (JSON + photos) →
 *       deterministic engines → EXIF strip → hash photos →
 *       OpenAI interpretation (with vision if photos provided) →
 *       guardrails → report build → persist → decrement use → return
 *
 * STRICT:
 * - OpenAI NEVER overrides deterministic numeric values
 * - Photos processed server-side only — EXIF stripped before AI call
 * - OpenAI key never exposed to client
 * - If no credits, photos are NOT processed
 */

import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  parseBearerToken,
  verifySignedInUser,
} from "@/lib/infrastructure/firebase/verify-signed-in-user";
import {
  ensureDiagnosticAccess,
  decrementDiagnosticUse,
  DIAGNOSTIC_PACKAGE_USES,
} from "@/sectorcalc/diagnostics/diagnostic-package";
import { AnalyzeRequestSchema, runDiagnostic } from "@/sectorcalc/diagnostics/diagnostic-service";
import { buildDiagnosticReport } from "@/sectorcalc/diagnostics/report/diagnostic-report-builder";
import { DiagnosticReportSchema } from "@/sectorcalc/diagnostics/report/diagnostic-report-schema";
import {
  createShortInputHash,
} from "@/sectorcalc/diagnostics/report/diagnostic-report-canonicalize";
import { redactUserText } from "@/sectorcalc/diagnostics/report/diagnostic-report-redaction";
import { saveDiagnosticReport } from "@/lib/inspection/inspection-firestore-service";
import { registerDiagnosticVerify } from "@/lib/inspection/verify-store";
import { callAiDiagnosticProvider } from "@/sectorcalc/diagnostics/ai/openai-diagnostics-provider";
import { processPhotos } from "@/sectorcalc/diagnostics/photo/photo-validator";
import type { AiReportSection } from "@/sectorcalc/diagnostics/ai/diagnostic-ai-types";
import type { ProcessedPhoto } from "@/sectorcalc/diagnostics/photo/photo-validator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const AI_MODEL = "gpt-4o";
const MAX_PHOTOS = 8;

const FullDiagnosticRequestSchema = AnalyzeRequestSchema.extend({
  photos: z.array(z.string()).max(MAX_PHOTOS).optional(),
});

export async function POST(req: Request) {
  try {
    /* ── 1. Auth gate ── */
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

    const ownerUid = user.uid;

    /* ── 2. Diagnostic package gate ── */
    const hasAccess = await ensureDiagnosticAccess(ownerUid);
    if (!hasAccess) {
      return NextResponse.json(
        {
          ok: false,
          error: "INSUFFICIENT_DIAGNOSTIC_CREDITS",
          message: `A ${DIAGNOSTIC_PACKAGE_USES}-use diagnostic package is required. Engineering Diagnostics is a professional report service.`,
          action: "Get Diagnostic Credits",
        },
        { status: 402 },
      );
    }

    /* ── 3. Parse and validate input ── */
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    const parsed = FullDiagnosticRequestSchema.safeParse(body);
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

    const analyzeInput = parsed.data;
    const rawPhotos = parsed.data.photos;

    /* ── 4. Process photos (server-side only) ── */
    let processedPhotos: ProcessedPhoto[] = [];
    if (rawPhotos && rawPhotos.length > 0) {
      try {
        processedPhotos = processPhotos(rawPhotos);
      } catch (photoErr) {
        const msg = photoErr instanceof Error ? photoErr.message : "Photo validation failed";
        return NextResponse.json(
          { ok: false, error: msg },
          { status: 422 },
        );
      }
    }

    /* ── 5. Run deterministic engines ── */
    const deterministicResult = runDiagnostic(analyzeInput);

    /* ── 6. Build preliminary report ── */
    const preliminaryReport = buildDiagnosticReport(deterministicResult, analyzeInput.privacy_mode);
    preliminaryReport.problem_section.problem_context = redactUserText(
      preliminaryReport.problem_section.problem_context,
    );

    const shortHash = createShortInputHash({
      domain: deterministicResult.domain.id,
      context: deterministicResult.problem_context.slice(0, 40),
      decision: deterministicResult.decision.decision,
    });

    preliminaryReport.report_id = "full_" + shortHash;

    /* ── 7. AI interpretation (with photos if available) ── */
    let aiSection: AiReportSection | null = null;
    try {
      const aiInput = {
        domain_id: analyzeInput.domain_id,
        domain_label: deterministicResult.domain.label,
        problem_context: analyzeInput.problem_context,
        measurements: analyzeInput.measurements.map((m) => ({
          measured_value: m.measured_value,
          nominal_value: m.nominal_value,
          tolerance_plus: m.tolerance_plus,
          tolerance_minus: m.tolerance_minus,
          unit: m.unit,
          measurement_tool: m.measurement_tool,
          calibration_status: m.calibration_status,
          part_condition: m.part_condition,
        })),
        deterministic: {
          measurement_results: deterministicResult.measurement_results.map((mr) => ({
            expanded_uncertainty_k2: mr.expanded_uncertainty_k2,
            confidence_class: mr.confidence_class,
            tolerance_status: mr.tolerance_status,
          })),
          cost_at_risk: deterministicResult.cost_at_risk.total,
          decision: deterministicResult.decision.decision,
          total_risk_score: deterministicResult.decision.total_risk_score,
          action_plan_items:
            deterministicResult.action_plan.containment.length +
            deterministicResult.action_plan.permanent_corrective_action.length +
            deterministicResult.action_plan.temporary_fix.length +
            deterministicResult.action_plan.required_manual_checks.length,
        },
        photos: processedPhotos.length > 0
          ? processedPhotos.map((p) => `data:${p.mime};base64,${p.data}`)
          : undefined,
      };

      const aiOutput = await callAiDiagnosticProvider(aiInput);

      aiSection = {
        visual_observations: aiOutput.visual_observations,
        engineering_interpretation: aiOutput.engineering_interpretation,
        root_cause_hypotheses: aiOutput.root_cause_hypotheses,
        ncr_statement: aiOutput.ncr_statement,
        capa_statement: aiOutput.capa_statement,
        executive_summary: aiOutput.executive_summary,
        action_narrative: aiOutput.action_narrative,
        provider: "openai",
        model: AI_MODEL,
        generated_at: new Date().toISOString(),
      };
    } catch (aiErr) {
      console.error("[full-diagnostic] AI provider error:", aiErr);
    }

    /* ── 8. Merge AI section into report ── */
    const fullReport = {
      ...preliminaryReport,
      ai_section: aiSection ?? undefined,
      report_type: "ENGINEERING_DIAGNOSTIC_PREVIEW" as const,
      evidence_section: {
        ...preliminaryReport.evidence_section,
        photo_count: processedPhotos.length,
        image_hashes: processedPhotos.map((p) => p.hash),
      },
    };

    const schemaValidation = DiagnosticReportSchema.safeParse(fullReport);
    if (!schemaValidation.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Report schema validation failed",
          issues: schemaValidation.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 500 },
      );
    }

    /* ── 9. Persist to Firestore + register verify ── */
    const { hash } = registerDiagnosticVerify(schemaValidation.data);
    const persistedHash = await saveDiagnosticReport(schemaValidation.data, ownerUid);
    const reportHash = persistedHash ?? hash;
    const verifyUrl = `https://sectorcalc.com/verify/${reportHash}`;

    /* ── 10. Decrement diagnostic use ── */
    const useDecremented = await decrementDiagnosticUse(ownerUid);
    if (!useDecremented) {
      console.error("[full-diagnostic] Failed to decrement diagnostic use for user:", ownerUid);
    }

    /* ── 11. Return JSON report ── */
    return NextResponse.json({
      ok: true,
      report_id: fullReport.report_id,
      report_hash: reportHash,
      report: fullReport,
      verify_url: verifyUrl,
      has_ai: aiSection !== null,
      photo_count: processedPhotos.length,
      diagnostic_use_consumed: useDecremented,
    });
  } catch (err) {
    console.error("[full-diagnostic] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
