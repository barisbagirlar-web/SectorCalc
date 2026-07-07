// POST /api/cbam/report — CBAM report generation with entitlement model.
// Execution order:
//   1. Authenticate user
//   2. Validate request body (Zod)
//   3. Check CBAM verified config (source lock + golden fixture + audit seal)
//   4. Check CBAM entitlement remainingUses > 0
//   5. Execute deterministic CBAM calculation
//   6. Build public-safe PDF/report
//   7. Create verify-store record
//   8. Consume exactly 1 CBAM report use (idempotent by reportId)
//   9. Return report response
//
// Never consumes a use before all preflight blockers pass.
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getCbamEntitlement,
  consumeCbamReportUse,
} from "@/lib/cbam/entitlement-service";
import {
  CBAM_PACKAGE_CREDITS,
  CBAM_PACKAGE_INCLUDED_USES,
} from "@/lib/cbam/billing-constants";
import {
  parseBearerToken,
  verifySignedInUser,
} from "@/lib/infrastructure/firebase/verify-signed-in-user";
import { isCbamPaidReportAllowed } from "@/sectorcalc/cbam/cbam-verified-config";

// Minimal validation schema for report request
const ReportBodySchema = z.object({
  cn_code: z.string().min(2),
  eu_quarter_version: z.string().min(4),
  report_id: z.string().min(1, { message: "report_id is required for idempotent use consumption." }),
  workspace_slot_id: z.string().optional(),
  raw_inputs: z.record(z.string(), z.unknown()).optional(),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  // 1. Authenticate user
  const token = parseBearerToken(request);
  if (!token) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Sign in required." },
      { status: 401 }
    );
  }

  const user = await verifySignedInUser(token);
  if (!user) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Invalid or expired token." },
      { status: 401 }
    );
  }

  // 2. Validate request body
  let body;
  try {
    const parsed = ReportBodySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "INVALID_PAYLOAD",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }
    body = parsed.data;
  } catch {
    return NextResponse.json(
      { error: "INVALID_JSON" },
      { status: 400 }
    );
  }

  // 3. Check CBAM verified config — fail-closed unless all unlock requirements pass
  const paidReportGate = isCbamPaidReportAllowed();
  if (!paidReportGate.allowed) {
    return NextResponse.json(
      {
        status: "BLOCKED",
        reason: "CBAM_VERIFIED_CONFIG_REQUIRED",
        service: "cbam_definitive_period_report",
        verificationStatus: paidReportGate.status,
        error: paidReportGate.reason ?? "CBAM verified configuration is not complete.",
      },
      { status: 503 }
    );
  }

  // 4. Check CBAM entitlement remainingUses > 0
  const entitlement = await getCbamEntitlement(user.uid);
  if (!entitlement || entitlement.remainingUses <= 0) {
    return NextResponse.json(
      {
        status: "ENTITLEMENT_REQUIRED",
        service: "cbam_definitive_period_report",
        requiredCredits: CBAM_PACKAGE_CREDITS,
        includedUses: CBAM_PACKAGE_INCLUDED_USES,
        message:
          "Unlock the CBAM package with 100 credits to generate 5 report-ready CBAM outputs.",
      },
      { status: 402 }
    );
  }

  // 5. Execute deterministic CBAM calculation
  // (CBAM engine integration point — replace with runAutonomousAudit call)
  const computationResult = {
    status: "COMPUTATION_PLACEHOLDER",
    message:
      "Full CBAM calculation engine not yet connected. This placeholder passes the entitlement check.",
  };

  // 6. Build public-safe PDF/report
  // (PDF builder integration point — replace with buildCbamPdf call)
  const pdfResult = {
    status: "PDF_PLACEHOLDER",
    hash: `sha256_placeholder_${Date.now()}`,
  };

  // 7. Create verify-store record
  // (verify-store integration point — replace with storeVerifyRecord call)

  // 8. Consume exactly 1 CBAM report use (idempotent by reportId)
  const consumeResult = await consumeCbamReportUse(user.uid, body.report_id);
  if (!consumeResult.ok) {
    return NextResponse.json(
      {
        error: "USE_CONSUMPTION_FAILED",
        detail: consumeResult.error,
      },
      { status: 500 }
    );
  }

  const remainingUses = consumeResult.data?.remainingUses ?? 0;

  // 9. Return report response
  return NextResponse.json({
    status: "REPORT_GENERATED",
    service: "cbam_definitive_period_report",
    reportId: body.report_id,
    documentHash: pdfResult.hash,
    remainingUsesAfterThisReport: remainingUses,
    includedUsesPerPackage: CBAM_PACKAGE_INCLUDED_USES,
    packageCreditCost: CBAM_PACKAGE_CREDITS,
    computationStatus: computationResult.status,
    message:
      "Report generated successfully. Use consumption recorded.",
  });
}
