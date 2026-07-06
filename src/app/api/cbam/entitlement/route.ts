// GET /api/cbam/entitlement — returns current user's CBAM package entitlement
// and current account credit balance.
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

  const [entitlement, accountCredits] = await Promise.all([
    getCbamEntitlement(user.uid),
    getAccountCreditBalance(user.uid),
  ]);

  return NextResponse.json({
    email: user.email ?? null,
    remainingUses: entitlement?.remainingUses ?? 0,
    totalPurchasedUses: entitlement?.totalPurchasedUses ?? 0,
    lastUnlockedAt: entitlement?.lastUnlockedAt ?? null,
    entitlementKey: entitlement?.entitlementKey ?? null,
    accountCredits,
    packageCredits: CBAM_PACKAGE_CREDITS,
    includedUses: CBAM_PACKAGE_INCLUDED_USES,
  });
}
