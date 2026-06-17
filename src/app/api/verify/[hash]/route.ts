import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getApprovedReportByHash } from "@/lib/trust-trace/approved-report-service";
import { buildPublicReportSummary } from "@/lib/trust-trace/public-summary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HASH_PATTERN = /^[a-f0-9]{64}$/;

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ hash: string }> },
) {
  const { hash } = await context.params;

  if (!HASH_PATTERN.test(hash)) {
    return NextResponse.json(
      {
        verified: false,
        message: "Invalid verification hash format.",
        hash,
      },
      { status: 400 },
    );
  }

  const report = await getApprovedReportByHash(hash);

  if (!report) {
    return NextResponse.json({
      verified: false,
      message:
        "Hash format is valid. No matching approved report was found in the SectorCalc registry yet.",
      hash,
      timestamp: new Date().toISOString(),
    });
  }

  if (report.status === "revoked") {
    return NextResponse.json({
      verified: false,
      message: "This report has been revoked.",
      hash,
      reportId: report.reportId,
      timestamp: report.issuedAt,
    });
  }

  return NextResponse.json({
    verified: true,
    message: "Bu rapor SectorCalc Trust Trace ile doğrulanmıştır.",
    hash,
    reportId: report.reportId,
    toolSlug: report.toolSlug,
    validationStampId: report.validationStampId,
    timestamp: report.issuedAt,
    publicSummary: buildPublicReportSummary(report),
  });
}
