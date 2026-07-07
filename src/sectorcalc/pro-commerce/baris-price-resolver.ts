// SectorCalc PRO V5.3.1 — Baris Price Resolver
// Server-side only. Resolves Stripe price IDs from process.env.
// Never exposes resolved Stripe price IDs to client components.
import "server-only";

export interface PriceResolution {
  toolKey: string;
  configured: boolean;
  resolvedPriceId: string | null;
  error: string | null;
}

export function resolveBarisStripePriceId(envKey: string): PriceResolution {
  const toolKey = envKey.replace("STRIPE_PRICE_BARIS_", "").toLowerCase();

  if (!envKey || !envKey.startsWith("STRIPE_PRICE_BARIS_")) {
    return {
      toolKey,
      configured: false,
      resolvedPriceId: null,
      error: `Invalid env key format: ${envKey}`,
    };
  }

  try {
    const priceId = process.env[envKey];
    if (!priceId || typeof priceId !== "string" || priceId.trim().length === 0) {
      return {
        toolKey,
        configured: false,
        resolvedPriceId: null,
        error: `Missing env key: ${envKey}`,
      };
    }
    return {
      toolKey,
      configured: true,
      resolvedPriceId: priceId.trim(),
      error: null,
    };
  } catch (err) {
    return {
      toolKey,
      configured: false,
      resolvedPriceId: null,
      error: `Resolution error for ${envKey}: ${err instanceof Error ? err.message : "unknown"}`,
    };
  }
}

export interface CheckoutPriceCheck {
  ok: boolean;
  priceId: string | undefined;
  reason: string | null;
}

export function requireBarisCheckoutPrice(envKey: string): CheckoutPriceCheck {
  const resolved = resolveBarisStripePriceId(envKey);
  if (!resolved.configured || !resolved.resolvedPriceId) {
    return {
      ok: false,
      priceId: undefined,
      reason: resolved.error || "STRIPE_PRICE_ID_REQUIRED",
    };
  }
  return {
    ok: true,
    priceId: resolved.resolvedPriceId,
    reason: null,
  };
}
