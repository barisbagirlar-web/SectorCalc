/**
 * POST /api/reports/approved
 * Creates an approved report and returns the report ID, hash, stamp, and verify URL.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createApprovedReport } from "@/lib/trust-trace/approved-report-service";
import type { CreateApprovedReportInput } from "@/lib/trust-trace/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "validation_error", message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { ok: false, error: "validation_error", message: "Body must be a JSON object" },
      { status: 400 }
    );
  }

  const b = body as Record<string, unknown>;

  // Required field validation
  if (!b.toolSlug || typeof b.toolSlug !== "string") {
    return NextResponse.json(
      { ok: false, error: "validation_error", message: "toolSlug is required" },
      { status: 400 }
    );
  }
  if (!b.locale || typeof b.locale !== "string") {
    return NextResponse.json(
      { ok: false, error: "validation_error", message: "locale is required" },
      { status: 400 }
    );
  }
  if (!b.routePath || typeof b.routePath !== "string") {
    return NextResponse.json(
      { ok: false, error: "validation_error", message: "routePath is required" },
      { status: 400 }
    );
  }

  const toolType =
    b.toolType === "free" || b.toolType === "premium"
      ? b.toolType
      : "unknown";

  const input: CreateApprovedReportInput = {
    toolSlug: b.toolSlug as string,
    toolType,
    locale: b.locale as string,
    routePath: b.routePath as string,
    formulaVersion:
      typeof b.formulaVersion === "string" ? b.formulaVersion : "1.0.0",
    formulaContractId:
      typeof b.formulaContractId === "string" ? b.formulaContractId : undefined,
    inputSnapshot:
      b.inputSnapshot && typeof b.inputSnapshot === "object" && !Array.isArray(b.inputSnapshot)
        ? (b.inputSnapshot as Record<string, unknown>)
        : {},
    resultSnapshot:
      b.resultSnapshot && typeof b.resultSnapshot === "object" && !Array.isArray(b.resultSnapshot)
        ? (b.resultSnapshot as Record<string, unknown>)
        : {},
    // User identity — not required, not enforced server-side here (client may pass if signed in)
    userId:
      typeof b.userId === "string" ? b.userId : null,
    userEmail:
      typeof b.userEmail === "string" ? b.userEmail : null,
    appVersion:
      typeof b.appVersion === "string" ? b.appVersion : undefined,
  };

  const result = await createApprovedReport(input);

  if (!result.ok) {
    if (result.error === "validation_error") {
      return NextResponse.json(
        { ok: false, error: "validation_error" },
        { status: 400 }
      );
    }
    if (result.error === "auth_required") {
      return NextResponse.json(
        { ok: false, error: "auth_required" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { ok: false, error: "create_failed" },
      { status: 500 }
    );
  }

  const { report } = result;
  return NextResponse.json(
    {
      ok: true,
      reportId: report.reportId,
      calculationHash: report.calculationHash,
      validationStampId: report.validationStampId,
      verifyUrl: report.qrTargetUrl,
      issuedAt: report.issuedAt,
      status: report.status,
    },
    { status: 201 }
  );
}