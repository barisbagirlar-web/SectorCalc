// POST /api/cbam/unlock — spends 100 account credits and unlocks 5 CBAM report uses.
// Idempotent by requestId. Does not call Paddle. Uses internal account credit balance.
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

  const result = await unlockCbamPackage(user.uid, requestId);

  if (!result.ok) {
    if (result.code === "INSUFFICIENT_ACCOUNT_CREDITS") {
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
    if (result.code === "REQUEST_ALREADY_PROCESSED") {
      return NextResponse.json(
        {
          status: "REQUEST_ALREADY_PROCESSED",
          remainingUses: result.data?.remainingUses ?? 0,
          error: result.error,
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: result.error ?? "Failed to unlock CBAM package." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    remainingUses: result.data?.remainingUses ?? CBAM_PACKAGE_INCLUDED_USES,
    totalPurchasedUses:
      result.data?.totalPurchasedUses ?? CBAM_PACKAGE_INCLUDED_USES,
    remainingAccountCredits: result.remainingAccountCredits ?? 0,
    packageCredits: CBAM_PACKAGE_CREDITS,
    includedUses: CBAM_PACKAGE_INCLUDED_USES,
  });
}
