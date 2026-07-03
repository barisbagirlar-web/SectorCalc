// SectorCalc V5.3.1 — Checkout Route
// Server-side only. Accepts toolKey, priceLookupKey, intent. Resolves Stripe price ID server-side.

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { B2B_MONETIZATION_REGISTRY } from "@/sectorcalc/monetization/monetization-registry";
import {
  getPublicAppUrl,
  resolveStripePriceId,
} from "@/sectorcalc/monetization/price-lookup.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;
  return new Stripe(secretKey);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;

    const toolKey = typeof body.toolKey === "string" ? body.toolKey : "";
    const priceLookupKey =
      typeof body.priceLookupKey === "string" ? body.priceLookupKey : "";
    const intent = typeof body.intent === "string" ? body.intent : "";

    if (intent !== "FREE_TOOL_PREMIUM_UPSELL") {
      return NextResponse.json({ error: "Invalid checkout intent" }, { status: 400 });
    }

    const config = B2B_MONETIZATION_REGISTRY[toolKey];
    if (!config) {
      return NextResponse.json({ error: "Unknown tool context" }, { status: 400 });
    }

    if (config.priceLookupKey !== priceLookupKey) {
      return NextResponse.json({ error: "Invalid pricing tier" }, { status: 403 });
    }

    const priceId = resolveStripePriceId(priceLookupKey);
    if (!priceId) {
      return NextResponse.json(
        { error: "Pricing is not configured" },
        { status: 500 },
      );
    }

    const appUrl = getPublicAppUrl();
    if (!appUrl) {
      return NextResponse.json(
        { error: "Application URL is not configured" },
        { status: 500 },
      );
    }

    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json(
        { error: "Checkout is not configured" },
        { status: 500 },
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/calculators/${encodeURIComponent(toolKey)}`,
      metadata: {
        intent_tool: toolKey,
        source: "freemium_paywall",
        intent: "FREE_TOOL_PREMIUM_UPSELL",
        premium_unlock_type: config.premiumUnlockType,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Checkout session did not return a URL" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
