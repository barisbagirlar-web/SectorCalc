import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getApprovedReportByHash } from "@/lib/trust-trace/approved-report-service";
import { buildPublicReportSummary } from "@/lib/trust-trace/public-summary";
import { createCalculationHash } from "@/lib/trust-trace/hash";

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

  // ── Cryptographic integrity check ──
  // Recompute hash from stored data to verify it hasn't been tampered with
  const recomputePayload = {
    reportId: report.reportId,
    toolSlug: report.toolSlug,
    formulaVersion: report.formulaVersion,
    formulaContractId: report.formulaContractId ?? null,
    inputSnapshot: report.inputSnapshot,
    resultSnapshot: report.resultSnapshot,
  };
  const computedHash = await createCalculationHash(recomputePayload);

  if (computedHash !== hash) {
    return NextResponse.json({
      verified: false,
      status: "hash_mismatch",
      message:
        "Cryptographic hash does not match stored report data. The report may have been tampered with.",
      hash,
      reportId: report.reportId,
      timestamp: report.issuedAt,
    });
  }

  return NextResponse.json({
    verified: true,
    hash,
    reportId: report.reportId,
    toolSlug: report.toolSlug,
    validationStampId: report.validationStampId,
    timestamp: report.issuedAt,
    publicSummary: buildPublicReportSummary(report),
  });
}
