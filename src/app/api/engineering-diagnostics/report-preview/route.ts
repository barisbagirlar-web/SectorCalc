/**
 * POST /api/engineering-diagnostics/report-preview
 *
 * Formats an already-gated diagnostic session into the report contract shape
 * for on-screen display. This endpoint is a PURE, deterministic transform:
 * it does not run AI, does not persist, does not seal a document, and does not
 * charge. The commercial entry gate is /analyze (entitlement) and the billable
 * deliverable is /full-diagnostic. This route only adds a sign-in requirement
 * so the preview is never served to anonymous callers.
 *
 * Auth: Bearer <Firebase ID token> (required — matches client behavior).
 */

import { NextResponse } from "next/server";
import { AnalyzeRequestSchema, runDiagnostic } from "@/sectorcalc/diagnostics/diagnostic-service";
import { buildDiagnosticReport } from "@/sectorcalc/diagnostics/report/diagnostic-report-builder";
import { createDiagnosticReportHash } from "@/sectorcalc/diagnostics/report/diagnostic-report-canonicalize";
import { redactUserText } from "@/sectorcalc/diagnostics/report/diagnostic-report-redaction";
import {
  parseBearerToken,
  verifySignedInUser,
} from "@/lib/infrastructure/firebase/verify-signed-in-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    /* ── Auth gate (sign-in required, no charge) ───────────────── */
    const token = parseBearerToken(req);
    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const user = await verifySignedInUser(token);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Invalid or expired authentication token." },
        { status: 401 }
      );
    }

    /* ── Parse + validate ──────────────────────────────────────── */
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const parsed = AnalyzeRequestSchema.safeParse(body);

    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      }));
      return NextResponse.json(
        { ok: false, error: "Schema validation failed", issues },
        { status: 422 }
      );
    }

    const result = runDiagnostic(parsed.data);

    const report = buildDiagnosticReport(result, parsed.data.privacy_mode, {
      costs: parsed.data.costs,
      measurements: parsed.data.measurements,
    });

    report.problem_section.problem_context = redactUserText(
      report.problem_section.problem_context
    );

    const report_hash = createDiagnosticReportHash(report);

    return NextResponse.json(
      { ok: true, report, report_hash },
      { status: 200 }
    );
  } catch {
    // No stack traces or env values exposed to client
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
