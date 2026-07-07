// POST /api/cbam/unlock — spends 100 account credits and unlocks CBAM uses.
// Primary path: product-usage-policy (100 credits → 3 uses).
// Fallback path: legacy CBAM entitlement (100 credits → 5 uses) for existing users.
// Idempotent by requestId.
import { NextResponse } from "next/server";
import { unlockCbamPackage } from "@/lib/cbam/entitlement-service";
import {
  CBAM_PACKAGE_CREDITS,
  CBAM_PACKAGE_INCLUDED_USES,
} from "@/lib/cbam/billing-constants";
import {
  parseBearerToken,
  verifySignedInUser,
} from "@/lib/infrastructure/firebase/verify-signed-in-user";
import {
  grantProductUsesFromCredits,
  getProductUsageDoc,
  PRODUCT_KEYS,
} from "@/lib/credits/product-usage-policy";

export const runtime = "nodejs";

export async function POST(request: Request) {
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
      { error: "UNAUTHORIZED", message: "Invalid token." },
      { status: 401 }
    );
  }

  // Parse request body for client-generated requestId for idempotency
  let requestId = `unlock_${user.uid}_${Date.now()}`;
  try {
    const body = await request.json();
    if (typeof body.requestId === "string" && body.requestId.trim().length > 0) {
      requestId = body.requestId.trim();
    }
  } catch {
    // No body or invalid JSON — use default requestId
  }

  // ── Primary path: product-usage-policy (100 credits → 3 uses) ──
  const grantResult = await grantProductUsesFromCredits(user.uid, PRODUCT_KEYS.CBAM);

  if (!grantResult.ok) {
    // If DB unavailable, fall back to legacy unlock
    if (grantResult.reason === "DATABASE_UNAVAILABLE") {
      const legacyResult = await unlockCbamPackage(user.uid, requestId);
      if (!legacyResult.ok) {
        if (legacyResult.code === "INSUFFICIENT_ACCOUNT_CREDITS") {
          return NextResponse.json(
            {
              status: "INSUFFICIENT_ACCOUNT_CREDITS",
              requiredCredits: CBAM_PACKAGE_CREDITS,
              message:
                "Add account credits to unlock the CBAM report package.",
            },
            { status: 402 }
          );
        }
        if (legacyResult.code === "REQUEST_ALREADY_PROCESSED") {
          return NextResponse.json(
            {
              status: "REQUEST_ALREADY_PROCESSED",
              remainingUses: legacyResult.data?.remainingUses ?? 0,
              error: legacyResult.error,
            },
            { status: 409 }
          );
        }
        return NextResponse.json(
          { error: legacyResult.error ?? "Failed to unlock CBAM package." },
          { status: 500 }
        );
      }
      return NextResponse.json({
        ok: true,
        remainingUses: legacyResult.data?.remainingUses ?? CBAM_PACKAGE_INCLUDED_USES,
        totalPurchasedUses:
          legacyResult.data?.totalPurchasedUses ?? CBAM_PACKAGE_INCLUDED_USES,
        remainingAccountCredits: legacyResult.remainingAccountCredits ?? 0,
        packageCredits: CBAM_PACKAGE_CREDITS,
        includedUses: CBAM_PACKAGE_INCLUDED_USES,
        model: "legacy",
      });
    }

    if (grantResult.reason === "INSUFFICIENT_CREDITS") {
      return NextResponse.json(
        {
          status: "INSUFFICIENT_ACCOUNT_CREDITS",
          requiredCredits: 100,
          message:
            "100 credits are required to unlock 3 CBAM uses.",
        },
        { status: 402 }
      );
    }

    return NextResponse.json(
      { error: `Failed to unlock CBAM: ${grantResult.reason}` },
      { status: 500 }
    );
  }

  // Product-usage-policy succeeded — fetch updated doc for response
  const productUsage = await getProductUsageDoc(user.uid, PRODUCT_KEYS.CBAM);

  return NextResponse.json({
    ok: true,
    remainingUses: productUsage?.remainingUses ?? grantResult.remainingUses,
    totalPurchasedUses: productUsage?.totalUsesGranted ?? 3,
    remainingAccountCredits: null, // calculated by product-usage-policy internally
    packageCredits: 100,
    includedUses: 3,
    model: "new",
  });
}
