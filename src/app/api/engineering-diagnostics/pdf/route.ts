/**
 * POST /api/engineering-diagnostics/pdf
 *
 * Generates a sealed Engineering Diagnostics PDF from the V2 report contract.
 * Persists the report and minimal verify metadata to Firestore.
 *
 * Input: { report: DiagnosticReport }
 * Auth: Bearer <Firebase ID token> (optional — reports saved without auth have no owner)
 * Output: application/pdf binary with Content-Disposition header.
 *
 * STRICT:
 * - PDF reads only from the report contract — never recomputes risk, cost, decision, or measurements
 * - No payment integration
 * - No OpenAI calls
 */

import { NextResponse } from "next/server";
import { DiagnosticReportSchema } from "@/sectorcalc/diagnostics/report/diagnostic-report-schema";
import { buildDiagnosticPdf, buildDiagnosticPdfFileName } from "@/lib/inspection/pdf-builder";
import { registerDiagnosticVerify } from "@/lib/inspection/verify-store";
import {
  saveDiagnosticReport,
  getUidFromRequest,
} from "@/lib/inspection/inspection-firestore-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
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

    /* Register verify metadata (in-memory) */
    const { hash } = registerDiagnosticVerify(report);

    /* Persist to Firestore */
    const ownerUid = await getUidFromRequest(req);
    const persistedHash = await saveDiagnosticReport(report, ownerUid);

    /* Use persisted hash if available, fall back to in-memory */
    const reportHash = persistedHash ?? hash;
    const verifyUrl = `https://sectorcalc.com/verify/${reportHash}`;

    /* Build PDF — reads only from the report contract */
    const pdfBuffer = await buildDiagnosticPdf(report, { verifyUrl });
    const pdfUint8 = new Uint8Array(pdfBuffer);

    const fileName = buildDiagnosticPdfFileName(report.report_id);

    return new NextResponse(pdfUint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "X-Report-Hash": reportHash,
        "X-Verify-Url": verifyUrl,
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
