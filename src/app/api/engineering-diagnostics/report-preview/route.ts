import { NextResponse } from "next/server";
import { AnalyzeRequestSchema, runDiagnostic } from "@/sectorcalc/diagnostics/diagnostic-service";
import { buildDiagnosticReport } from "@/sectorcalc/diagnostics/report/diagnostic-report-builder";
import { createDiagnosticReportHash } from "@/sectorcalc/diagnostics/report/diagnostic-report-canonicalize";
import { redactUserText } from "@/sectorcalc/diagnostics/report/diagnostic-report-redaction";

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

    const report = buildDiagnosticReport(result, parsed.data.privacy_mode);

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
