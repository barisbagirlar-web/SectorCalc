/**
 * SectorCalc Paddle Checkout — server-side only.
 * Route: POST /api/checkout/paddle
 *
 * Creates a Paddle transaction with validated customData.
 * Never accepts raw Paddle price IDs from the client.
 * Only allows intents and product keys from the canonical contract.
 */

import { NextRequest, NextResponse } from "next/server";
import { Paddle } from "@paddle/paddle-node-sdk";
import {
  isAllowedIntent,
  buildPaddleCustomData,
  type PaddlePurchaseIntent,
  type PaddleCustomData,
} from "@/lib/payments/paddle-custom-data";
import { resolvePaddlePriceId } from "@/lib/payments/paddle-price-lookup.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getPaddleClient(): Paddle | null {
  const apiKey = process.env.PADDLE_SECRET_KEY;
  if (!apiKey) return null;
  return new Paddle(apiKey, {
    // Paddle Node SDK v3 uses environment setting differently
    // Default is production; no explicit env opt needed
  });
}

function getPublicAppUrl(): string {
  return (
    process.env.SECTORCALC_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://sectorcalc.com"
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;

    const rawIntent = String(body.intent ?? "");
    const rawProductKey = String(body.productKey ?? "");
    const rawToolKey = String(body.toolKey ?? "");

    // ── Validate intent ────────────────────────────────────────────────
    if (!rawIntent || !isAllowedIntent(rawIntent)) {
      return NextResponse.json(
        { error: `Invalid intent: ${rawIntent}` },
        { status: 400 },
      );
    }

    // ── Validate product key (no raw priceId accepted) ─────────────────
    if (body.priceId) {
      return NextResponse.json(
        { error: "Client-supplied priceId is not accepted" },
        { status: 400 },
      );
    }

    if (!rawProductKey) {
      return NextResponse.json(
        { error: "productKey is required" },
        { status: 400 },
      );
    }

    // ── Resolve Paddle price server-side ───────────────────────────────
    let priceLookup;
    try {
      priceLookup = resolvePaddlePriceId(rawProductKey);
    } catch {
      return NextResponse.json(
        { error: `Invalid productKey: ${rawProductKey}` },
        { status: 400 },
      );
    }

    // ── Build customData ───────────────────────────────────────────────
    const customDataFields: PaddleCustomData = {
      intent: rawIntent as PaddlePurchaseIntent,
      productKey: rawProductKey as PaddleCustomData["productKey"],
      credits: priceLookup.credits || undefined,
      toolKey: rawToolKey || undefined,
      planId: priceLookup.purchaseType === "subscription" ? rawProductKey : undefined,
      source: "checkout_paddle",
    };
    const customData = buildPaddleCustomData(customDataFields);

    // ── Create Paddle transaction ──────────────────────────────────────
    const paddle = getPaddleClient();
    if (!paddle) {
      return NextResponse.json(
        { error: "Payment system not configured" },
        { status: 503 },
      );
    }

    const successUrl = `${getPublicAppUrl()}/dashboard?transaction_id={transaction.id}`;

    const transaction = await paddle.transactions.create({
      items: [
        {
          priceId: priceLookup.priceId,
          quantity: 1,
        },
      ],
      customData: customData as Record<string, string>,
      checkout: {
        url: successUrl,
      },
    });

    // ── Build public-safe response ─────────────────────────────────────
    return NextResponse.json({
      checkoutUrl: transaction.checkout?.url ?? null,
      purchaseType: priceLookup.purchaseType,
      productKey: rawProductKey,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Paddle checkout failed";
    console.error("[checkout/paddle] Failed:", message);
    return NextResponse.json(
      { error: "Checkout initialization failed" },
      { status: 502 },
    );
  }
}
