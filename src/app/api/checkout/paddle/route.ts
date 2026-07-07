/**
 * SectorCalc Paddle Checkout — server-side only.
 * Route: POST /api/checkout/paddle
 *
 * Creates a Paddle transaction with validated customData.
 * - Never accepts raw Paddle price IDs from the client.
 * - Only allows intents and product keys from the canonical contract.
 * - Requires authenticated userId or stable customer reference.
 * - Credits amount is server-resolved from product key, never from client.
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
import { getBarisProduct, type BarisProProduct } from "@/sectorcalc/pro-commerce/baris-pro-products";
import { requireBarisPaddleCheckoutPrice } from "@/sectorcalc/pro-commerce/baris-paddle-price-resolver";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Client factory with env guard ────────────────────────────────────────

function getPaddleClient(): Paddle | null {
  const apiKey = process.env.PADDLE_SECRET_KEY;
  if (!apiKey) return null;
  return new Paddle(apiKey);
}

function getPublicAppUrl(): string {
  return (
    process.env.SECTORCALC_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://sectorcalc.com"
  );
}

// ── POST handler ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // ── Parse body ───────────────────────────────────────────────────
    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const rawIntent = String(body.intent ?? "").trim();
    const rawProductKey = String(body.productKey ?? "").trim();
    const rawToolKey = String(body.toolKey ?? "").trim();
    const rawUserId = String(body.userId ?? "").trim();

    // ── Reject client-supplied raw priceId ────────────────────────────
    if (body.priceId) {
      return NextResponse.json(
        { error: "Client-supplied priceId is not accepted" },
        { status: 400 },
      );
    }

    // ── Require intent ────────────────────────────────────────────────
    if (!rawIntent || !isAllowedIntent(rawIntent)) {
      return NextResponse.json(
        { error: `Invalid intent: "${rawIntent}"` },
        { status: 400 },
      );
    }

    // ── BARIS_PRO_PURCHASE: does not need productKey, resolves from Baris registry ──
    if (rawIntent === "BARIS_PRO_PURCHASE") {
      if (!rawToolKey) {
        return NextResponse.json(
          { error: "toolKey is required for BARIS_PRO_PURCHASE" },
          { status: 400 },
        );
      }
      if (!rawUserId) {
        return NextResponse.json(
          {
            error:
              "userId is required. Authenticate before creating a checkout session.",
          },
          { status: 401 },
        );
      }
      const product = getBarisProduct(rawToolKey);
      if (!product) {
        return NextResponse.json(
          { error: `Unknown Baris product: ${rawToolKey}` },
          { status: 400 },
        );
      }
      if (!product.sellable) {
        return NextResponse.json(
          { error: "Product is not sellable" },
          { status: 403 },
        );
      }

      const priceCheck = requireBarisPaddleCheckoutPrice(product.paddlePriceEnvKey);
      if (!priceCheck.ok) {
        return NextResponse.json(
          { error: priceCheck.reason || "PADDLE_PRICE_ID_REQUIRED" },
          { status: 500 },
        );
      }

      const paddle = getPaddleClient();
      if (!paddle) {
        return NextResponse.json(
          { error: "Payment system not configured" },
          { status: 503 },
        );
      }

      const successUrl = `${getPublicAppUrl()}/tools/pro/${encodeURIComponent(rawToolKey)}?transaction_id={transaction.id}`;

      const transaction = await paddle.transactions.create({
        items: [{ priceId: priceCheck.priceId!, quantity: 1 }],
        customData: {
          source: "baris_pro_purchase",
          tool_key: rawToolKey,
          product_mode: product.productMode,
          payment_product_type: product.paymentProductType,
          execution_mode: product.executionMode,
          userId: rawUserId,
        } as Record<string, string>,
        checkout: { url: successUrl },
      });

      return NextResponse.json({
        checkoutUrl: transaction.checkout?.url ?? null,
        provider: "PADDLE",
        paymentProductType: product.paymentProductType,
      });
    }

    // ── Require productKey for non-Baris purchases ────────────────────
    if (!rawProductKey) {
      return NextResponse.json(
        { error: "productKey is required" },
        { status: 400 },
      );
    }

    // ── Require stable user reference for standard purchases ──────────
    if (!rawUserId) {
      return NextResponse.json(
        {
          error:
            "userId is required. Authenticate before creating a checkout session.",
        },
        { status: 401 },
      );
    }

    // ── Resolve Paddle price server-side ──────────────────────────────
    let priceLookup: { priceId: string; credits: number; purchaseType: string };
    try {
      priceLookup = resolvePaddlePriceId(rawProductKey);
    } catch {
      return NextResponse.json(
        { error: `Invalid productKey: "${rawProductKey}"` },
        { status: 400 },
      );
    }

    // ── Verify intent/productKey compatibility ────────────────────────
    if (
      rawIntent === "SECTORCALC_CREDIT_PACK_PURCHASE" &&
      priceLookup.purchaseType !== "credit_pack"
    ) {
      return NextResponse.json(
        { error: "Credit pack intent requires a credit pack product key" },
        { status: 400 },
      );
    }
    if (
      rawIntent === "SECTORCALC_PRO_SUBSCRIPTION_PURCHASE" &&
      priceLookup.purchaseType !== "subscription"
    ) {
      return NextResponse.json(
        {
          error:
            "Subscription intent requires a subscription product key",
        },
        { status: 400 },
      );
    }

    // ── Build customData with canonical contract fields ────────────────
    const customDataFields: PaddleCustomData = {
      intent: rawIntent as PaddlePurchaseIntent,
      productKey: rawProductKey as PaddleCustomData["productKey"],
      purchaseType: priceLookup.purchaseType as PaddleCustomData["purchaseType"],
      credits:
        priceLookup.purchaseType === "credit_pack"
          ? priceLookup.credits
          : undefined,
      planId:
        priceLookup.purchaseType === "subscription" ? rawProductKey : undefined,
      toolKey: rawToolKey || undefined,
      userId: rawUserId,
      source: "checkout_paddle",
      requestId: cryptoRandomId(),
    };
    const customData = buildPaddleCustomData(customDataFields);

    // ── Create Paddle transaction ─────────────────────────────────────
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

    // ── Public-safe response only ─────────────────────────────────────
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

// ── Non-POST rejection ──────────────────────────────────────────────────

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

// ── Helpers ──────────────────────────────────────────────────────────────

function cryptoRandomId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
