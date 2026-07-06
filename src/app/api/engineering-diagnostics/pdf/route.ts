/**
 * POST /api/engineering-diagnostics/pdf
 *
 * Generates a sealed Engineering Diagnostics PDF from the V2 report contract.
 *
 * Input: { report: DiagnosticReport }
 * Output: application/pdf binary with Content-Disposition header.
 *
 * STRICT:
 * - PDF reads only from the report contract — never recomputes risk, cost, decision, or measurements
 * - No payment integration
 * - No OpenAI calls
 * - No Firestore writes
 */

import { NextResponse } from "next/server";
import { DiagnosticReportSchema } from "@/sectorcalc/diagnostics/report/diagnostic-report-schema";
import { buildDiagnosticPdf, buildDiagnosticPdfFileName } from "@/lib/inspection/pdf-builder";
import { registerDiagnosticVerify } from "@/lib/inspection/verify-store";

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

    /* Register verify metadata (in-memory, no persistence yet) */
    const { hash } = registerDiagnosticVerify(report);

    const verifyUrl = `https://sectorcalc.com/verify/${hash}`;

    /* Build PDF — reads only from the report contract */
    const pdfBuffer = await buildDiagnosticPdf(report, { verifyUrl });
    const pdfUint8 = new Uint8Array(pdfBuffer);

    const fileName = buildDiagnosticPdfFileName(report.report_id);

    return new NextResponse(pdfUint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "X-Report-Hash": hash,
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
