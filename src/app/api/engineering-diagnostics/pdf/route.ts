/**
 * POST /api/engineering-diagnostics/pdf
 *
 * Generates a sealed Engineering Diagnostics PDF from the V2 report contract.
 * Persists the report and minimal verify metadata to Firestore.
 *
 * Auth: Required — Bearer <Firebase ID token>
 * Credit: 1 credit deducted on successful PDF generation.
 *
 * Input: { report: DiagnosticReport }
 * Output: application/pdf binary with Content-Disposition header.
 *
 * STRICT:
 * - PDF reads only from the report contract — never recomputes risk, cost, decision, or measurements
 * - No OpenAI calls
 */

import { NextResponse } from "next/server";
import { DiagnosticReportSchema } from "@/sectorcalc/diagnostics/report/diagnostic-report-schema";
import { buildDiagnosticPdf, buildDiagnosticPdfFileName } from "@/lib/inspection/pdf-builder";
import { registerDiagnosticVerify } from "@/lib/inspection/verify-store";
import {
  saveDiagnosticReport,
} from "@/lib/inspection/inspection-firestore-service";
import {
  parseBearerToken,
  verifySignedInUser,
} from "@/lib/infrastructure/firebase/verify-signed-in-user";
import {
  checkUserCreditBalance,
  decrementCredits,
} from "@/lib/credits/tool-usage-session.server";
import { isProBypassEmail } from "@/lib/features/billing/subscription";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PDF_CREDIT_COST = 1;

export async function POST(req: Request) {
  try {
    /* ── Auth gate ─────────────────────────────────────────────── */
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

    const ownerUid = user.uid;

    /* ── Credit gate ───────────────────────────────────────────── */
    const isOwner = user.email ? isProBypassEmail(user.email) : false;
    if (!isOwner) {
      const hasCredits = await checkUserCreditBalance(ownerUid, PDF_CREDIT_COST);
      if (!hasCredits) {
        return NextResponse.json(
          {
            ok: false,
            error: "INSUFFICIENT_CREDITS",
            message: "1 credit is required to generate a sealed PDF report.",
          },
          { status: 402 }
        );
      }
    }

    /* ── Parse body ────────────────────────────────────────────── */
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const payload = body as Record<string, unknown>;
    const reportRaw = payload.report;

    const parsed = DiagnosticReportSchema.safeParse(reportRaw);

    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      }));
      return NextResponse.json(
        { ok: false, error: "Invalid diagnostic report", issues },
        { status: 422 }
      );
    }

    const report = parsed.data;

    /* ── Detect diagnostic-generated reports ──────────────────── */
    // full_ prefix means the report was generated via the Full Diagnostic package,
    // which already consumed a diagnostic use. Skip additional credit charge.
    const isDiagnosticGenerated = report.report_id.startsWith("full_");

    /* ── Persist to Firestore + register verify ───────────────── */
    const { hash } = registerDiagnosticVerify(report);
    const persistedHash = await saveDiagnosticReport(report, ownerUid);
    const reportHash = persistedHash ?? hash;
    const verifyUrl = `https://sectorcalc.com/verify/${reportHash}`;

    /* ── Build PDF — reads only from the report contract ──────── */
    const pdfBuffer = await buildDiagnosticPdf(report, { verifyUrl });
    const pdfUint8 = new Uint8Array(pdfBuffer);

    /* ── Deduct credit ONLY if not diagnostic-generated ───────── */
    // Diagnostic package users already paid — PDF is included
    // Owner bypass skips deduction entirely
    let creditSpent = 0;
    if (!isOwner && !isDiagnosticGenerated) {
      const deducted = await decrementCredits(ownerUid, PDF_CREDIT_COST);
      if (!deducted) {
        return NextResponse.json(
          { ok: false, error: "INSUFFICIENT_CREDITS", message: "Credit deduction failed." },
          { status: 402 }
        );
      }
      creditSpent = PDF_CREDIT_COST;
    }

    const fileName = buildDiagnosticPdfFileName(report.report_id);

    return new NextResponse(pdfUint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "X-Report-Hash": reportHash,
        "X-Verify-Url": verifyUrl,
        "X-Credit-Spent": String(creditSpent),
      },
    });
  } catch (err) {
    console.error("[engineering-diagnostics/pdf] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
