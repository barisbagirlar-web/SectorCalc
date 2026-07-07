// GET /api/cbam/entitlement — returns current user's CBAM entitlement
// (legacy model + new credit-to-usage product policy).
import { NextResponse } from "next/server";
import {
  getCbamEntitlement,
  getAccountCreditBalance,
} from "@/lib/cbam/entitlement-service";
import {
  CBAM_PACKAGE_CREDITS,
  CBAM_PACKAGE_INCLUDED_USES,
} from "@/lib/cbam/billing-constants";
import {
  parseBearerToken,
  verifySignedInUser,
} from "@/lib/infrastructure/firebase/verify-signed-in-user";
import {
  getProductUsageDoc,
  PRODUCT_KEYS,
} from "@/lib/credits/product-usage-policy";

export const runtime = "nodejs";

export async function GET(request: Request) {
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

  const [entitlement, accountCredits, productUsage] = await Promise.all([
    getCbamEntitlement(user.uid),
    getAccountCreditBalance(user.uid),
    getProductUsageDoc(user.uid, PRODUCT_KEYS.CBAM),
  ]);

  return NextResponse.json({
    email: user.email ?? null,
    remainingUses: entitlement?.remainingUses ?? 0,
    totalPurchasedUses: entitlement?.totalPurchasedUses ?? 0,
    lastUnlockedAt: entitlement?.lastUnlockedAt ?? null,
    entitlementKey: entitlement?.entitlementKey ?? null,
    accountCredits,
    // Legacy model info
    packageCredits: CBAM_PACKAGE_CREDITS,
    includedUses: CBAM_PACKAGE_INCLUDED_USES,
    // New credit-to-usage model info
    newModel: productUsage
      ? {
          remainingUses: productUsage.remainingUses,
          creditCost: productUsage.creditCost,
          totalUsesGranted: productUsage.totalUsesGranted,
          totalUsesConsumed: productUsage.totalUsesConsumed,
        }
      : null,
  });
}
