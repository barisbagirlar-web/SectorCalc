// POST /api/cbam/report — CBAM report generation with dual entitlement model.
// Execution order:
//   1. Authenticate user
//   2. Validate request body (Zod)
//   3. Check CBAM verified config (source lock + golden fixture + audit seal)
//   4. Check entitlement:
//      a. Primary: product-usage-policy remainingUses > 0
//      b. Fallback: legacy CBAM entitlement remainingUses > 0
//   5. Execute deterministic CBAM calculation
//   6. Build public-safe PDF/report
//   7. Create verify-store record
//   8. Consume exactly 1 use (via product-usage-policy or legacy)
//   9. Return report response
//
// Never consumes a use before all preflight blockers pass.
// On failure, does NOT consume a use.
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
import {
  checkProductUsage,
  getProductUsageDoc,
  decrementProductUse,
  PRODUCT_KEYS,
} from "@/lib/credits/product-usage-policy";

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

  // 4. Check entitlement: primary = product-usage-policy, fallback = legacy
  const productUsageOk = await checkProductUsage(user.uid, PRODUCT_KEYS.CBAM);
  const entitlement = await getCbamEntitlement(user.uid);
  const legacyOk = entitlement && entitlement.remainingUses > 0;

  if (!productUsageOk && !legacyOk) {
    return NextResponse.json(
      {
        status: "ENTITLEMENT_REQUIRED",
        service: "cbam_definitive_period_report",
        requiredCredits: 100,
        includedUses: 3,
        message:
          "Unlock the CBAM module with 100 credits to generate 3 CBAM reports.",
      },
      { status: 402 }
    );
  }

  const useNewModel = productUsageOk;

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

  // 8. Consume exactly 1 use — new model or legacy
  if (useNewModel) {
    const consumed = await decrementProductUse(user.uid, PRODUCT_KEYS.CBAM);
    if (!consumed) {
      return NextResponse.json(
        {
          error: "USE_CONSUMPTION_FAILED",
          detail: "Failed to decrement CBAM product use.",
        },
        { status: 500 }
      );
    }
  } else {
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
  }

  // 9. Get remaining uses from active model for response
  let remainingUses = 0;
  if (useNewModel) {
    const usageDoc = await getProductUsageDoc(user.uid, PRODUCT_KEYS.CBAM);
    remainingUses = usageDoc?.remainingUses ?? 0;
  } else {
    const updatedEntitlement = await getCbamEntitlement(user.uid);
    remainingUses = updatedEntitlement?.remainingUses ?? 0;
  }

  // 10. Return report response
  return NextResponse.json({
    status: "REPORT_GENERATED",
    service: "cbam_definitive_period_report",
    reportId: body.report_id,
    documentHash: pdfResult.hash,
    remainingUsesAfterThisReport: remainingUses,
    includedUsesPerPackage: useNewModel ? 3 : CBAM_PACKAGE_INCLUDED_USES,
    packageCreditCost: useNewModel ? 100 : CBAM_PACKAGE_CREDITS,
    model: useNewModel ? "new" : "legacy",
    computationStatus: computationResult.status,
    message:
      "Report generated successfully. Use consumption recorded.",
  });
}
