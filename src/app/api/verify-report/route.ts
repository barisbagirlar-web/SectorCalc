/**
 * GET /api/verify-report?reportId=...&hash=...
 * Public report verification endpoint — returns limited public data only.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getApprovedReportForVerify } from "@/lib/trust-trace/approved-report-service";
import { verifyCalculationHash } from "@/lib/trust-trace/hash";
import { buildPublicReportSummary } from "@/lib/trust-trace/public-summary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reportId = searchParams.get("reportId");
  const hash = searchParams.get("hash");

  if (!reportId) {
    return NextResponse.json(
      { ok: false, error: "missing_params", message: "reportId is required" },
      { status: 400 }
    );
  }

  // Validate reportId format (SC-YYYYMMDD-TOOLSHORT-ID)
  if (!/^SC-\d{8}-[A-Z0-9]+-[A-Z0-9]+$/.test(reportId)) {
    return NextResponse.json(
      { ok: false, error: "invalid_params", message: "Invalid reportId format" },
      { status: 400 }
    );
  }

  let report: Awaited<ReturnType<typeof getApprovedReportForVerify>>;
  try {
    report = await getApprovedReportForVerify(reportId);
  } catch {
    return NextResponse.json(
      { ok: false, error: "lookup_failed" },
      { status: 500 }
    );
  }

  if (!report) {
    return NextResponse.json(
      {
        ok: true,
        status: "not_found",
        reportId,
        hashMatches: false,
      },
      { status: 200 }
    );
  }

  if (report.status === "revoked") {
    return NextResponse.json(
      {
        ok: true,
        status: "revoked",
        reportId,
        toolSlug: report.toolSlug,
        formulaVersion: report.formulaVersion,
        issuedAt: report.issuedAt,
        validationStampId: report.validationStampId,
        hashMatches: false,
        publicSummary: buildPublicReportSummary(report),
      },
      { status: 200 }
    );
  }

  // Hash verification
  let hashMatches = false;
  if (hash && typeof hash === "string" && hash.length === 64) {
    const hashPayload = {
      reportId: report.reportId,
      toolSlug: report.toolSlug,
      formulaVersion: report.formulaVersion,
      formulaContractId: report.formulaContractId ?? null,
      inputSnapshot: report.inputSnapshot,
      resultSnapshot: report.resultSnapshot,
    };
    try {
      hashMatches = await verifyCalculationHash(hashPayload, hash);
    } catch {
      hashMatches = false;
    }
  }

  const verifyStatus = hash
    ? hashMatches
      ? "verified"
      : "hash_mismatch"
    : "verified"; // No hash provided = identity-only check

  return NextResponse.json(
    {
      ok: true,
      status: verifyStatus,
      reportId: report.reportId,
      toolSlug: report.toolSlug,
      formulaVersion: report.formulaVersion,
      issuedAt: report.issuedAt,
      validationStampId: report.validationStampId,
      hashMatches,
      publicSummary: buildPublicReportSummary(report),
      // Never return: inputSnapshot, resultSnapshot, userEmail, userId, auditTrail
    },
    { status: 200 }
  );
}