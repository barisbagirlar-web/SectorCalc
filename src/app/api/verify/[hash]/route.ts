import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getApprovedReportByHash } from "@/lib/features/trust-trace/approved-report-service";
import { buildPublicReportSummary } from "@/lib/features/trust-trace/public-summary";
import { createCalculationHash } from "@/lib/features/trust-trace/hash";
import { getInspectionVerifyByHash } from "@/lib/inspection/inspection-firestore-service";

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

  // Try approved reports first (existing verification system)
  const report = await getApprovedReportByHash(hash);
  if (report) {
    if (report.status === "revoked") {
      return NextResponse.json({
        verified: false,
        message: "This report has been revoked.",
        hash,
        reportId: report.reportId,
        timestamp: report.issuedAt,
      });
    }

    // Cryptographic integrity check
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

  // Fallback: check inspection_verify collection (engineering diagnostics)
  const inspectionVerify = await getInspectionVerifyByHash(hash);
  if (inspectionVerify) {
    // inspection_verify is inherently verified — stored with hash as document ID
    // Only return minimal non-sensitive fields
    return NextResponse.json({
      verified: true,
      hash,
      reportId: inspectionVerify.report_id,
      source: "engineering_diagnostics",
      timestamp: inspectionVerify.issued_at,
      verify: {
        decision: inspectionVerify.decision,
        risk_score: inspectionVerify.risk_score,
        report_type: inspectionVerify.report_type,
        engine_version: inspectionVerify.engine_version,
        schema_version: inspectionVerify.schema_version,
        methodology_version: inspectionVerify.methodology_version,
      },
    });
  }

  // Not found in either system
  return NextResponse.json({
    verified: false,
    message:
      "Hash format is valid. No matching approved report or inspection record was found.",
    hash,
    timestamp: new Date().toISOString(),
  });
}
