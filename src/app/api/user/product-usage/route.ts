/**
 * SectorCalc Unified Product Usage API
 *
 * Single API endpoint for checking and consuming product usage rights.
 * Supports Pro Tools, Engineering Diagnostics and all credit-based products.
 *
 * GET  /api/user/product-usage?productKey=PRO_TOOLS
 *   → { ok, remainingUses, totalUsesGranted, creditBalance, productKey }
 *
 * POST /api/user/product-usage
 *   { action: "consume", productKey: "PRO_TOOLS" }
 *   → { ok, remainingUses, useConsumed, creditBalance }
 *
 * Auth: Bearer <Firebase ID token> (required)
 *
 * Single-source-of-truth: product-usage-policy.ts
 */

import { NextResponse } from "next/server";
import {
  parseBearerToken,
  verifySignedInUser,
} from "@/lib/infrastructure/firebase/verify-signed-in-user";
import {
  checkProductUsage,
  grantProductUsesFromCredits,
  decrementProductUse,
  getProductUsageDoc,
  getProductUsagePolicy,
  getRemainingProductUses,
  isFreeProduct,
  PRODUCT_KEYS,
  type ProductKey,
} from "@/lib/credits/product-usage-policy";
import { getAccountCreditBalance } from "@/lib/cbam/entitlement-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ── Valid product keys that consumers can use ── */

const CONSUMABLE_PRODUCTS: ProductKey[] = [
  PRODUCT_KEYS.PRO_TOOLS,
  PRODUCT_KEYS.ENGINEERING_DIAGNOSTICS,
  PRODUCT_KEYS.AI_PHOTO_DIAGNOSIS,
  PRODUCT_KEYS.CBAM,
];

function validateProductKey(raw: string | null): ProductKey | null {
  if (!raw) return null;
  const upper = raw.toUpperCase().trim() as ProductKey;
  if ((CONSUMABLE_PRODUCTS as string[]).includes(upper)) {
    return upper;
  }
  return null;
}

/* ── GET: check product usage ── */

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const token = parseBearerToken(request);
    if (!token) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const user = await verifySignedInUser(token);
    if (!user) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const url = new URL(request.url);
    const rawProductKey = url.searchParams.get("productKey");
    const productKey = validateProductKey(rawProductKey);

    if (!productKey) {
      return NextResponse.json(
        { ok: false, error: "VALID_PRODUCT_KEY_REQUIRED", validKeys: CONSUMABLE_PRODUCTS },
        { status: 400 },
      );
    }

    const policy = getProductUsagePolicy(productKey);
    const remainingUses = await getRemainingProductUses(user.uid, productKey);
    const usageDoc = await getProductUsageDoc(user.uid, productKey);
    const creditBalance = await getAccountCreditBalance(user.uid);

    return NextResponse.json({
      ok: true,
      productKey,
      remainingUses,
      totalUsesGranted: usageDoc?.totalUsesGranted ?? 0,
      totalUsesConsumed: usageDoc?.totalUsesConsumed ?? 0,
      creditBalance,
      hasCredits: creditBalance >= policy.creditCost,
      canConsume: remainingUses > 0 || creditBalance >= policy.creditCost,
      policy: {
        creditCost: policy.creditCost,
        usageGrant: policy.usageGrant,
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}

/* ── POST: consume 1 product use ── */

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const token = parseBearerToken(request);
    if (!token) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const user = await verifySignedInUser(token);
    if (!user) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    let body: { action?: string; productKey?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 });
    }

    const productKey = validateProductKey(body.productKey ?? null);
    if (!productKey) {
      return NextResponse.json(
        { ok: false, error: "VALID_PRODUCT_KEY_REQUIRED", validKeys: CONSUMABLE_PRODUCTS },
        { status: 400 },
      );
    }

    if (isFreeProduct(productKey)) {
      // Free products never consume
      return NextResponse.json({ ok: true, remainingUses: Infinity, useConsumed: false, productKey });
    }

    if (body.action === "consume") {
      // Step 1: Check if there are remaining uses; if not, grant from credits
      const hasUsage = await checkProductUsage(user.uid, productKey);
      if (!hasUsage) {
        const grantResult = await grantProductUsesFromCredits(user.uid, productKey);
        if (!grantResult.ok) {
          return NextResponse.json(
            {
              ok: false,
              error: "INSUFFICIENT_CREDITS",
              message: `Insufficient credits. ${getProductUsagePolicy(productKey).creditCost} credits required to unlock ${getProductUsagePolicy(productKey).usageGrant} uses.`,
              productKey,
              creditCost: getProductUsagePolicy(productKey).creditCost,
              usageGrant: getProductUsagePolicy(productKey).usageGrant,
            },
            { status: 402 },
          );
        }
      }

      // Step 2: Decrement 1 use
      const consumed = await decrementProductUse(user.uid, productKey);
      if (!consumed) {
        // This should not happen if check/grant succeeded, but guard anyway
        return NextResponse.json(
          { ok: false, error: "CONSUME_FAILED", message: "Failed to consume product use." },
          { status: 500 },
        );
      }

      const remainingUses = await getRemainingProductUses(user.uid, productKey);
      const creditBalance = await getAccountCreditBalance(user.uid);

      return NextResponse.json({
        ok: true,
        productKey,
        remainingUses,
        useConsumed: true,
        creditBalance,
      });
    }

    return NextResponse.json({ ok: false, error: "UNKNOWN_ACTION" }, { status: 400 });
  } catch {
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
