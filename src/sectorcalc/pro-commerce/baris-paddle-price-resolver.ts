// SectorCalc PRO V5.3.1 — Baris Paddle Price Resolver
// Server-side only. Resolves Paddle price IDs from environment variables.
// Uses PADDLE_PRICE_BARIS_* env keys. Never hardcodes price IDs.
import "server-only";

export interface PriceResolution {
  toolKey: string;
  configured: boolean;
  resolvedPriceId: string | null;
  error: string | null;
}

export function resolveBarisPaddlePriceId(envKey: string): PriceResolution {
  const toolKey = envKey.replace("PADDLE_PRICE_BARIS_", "").toLowerCase();
  try {
    if (!envKey || !envKey.startsWith("PADDLE_PRICE_BARIS_")) {
      return {
        toolKey,
        configured: false,
        resolvedPriceId: null,
        error: "Invalid env key format",
      };
    }
    const priceId = process.env[envKey];
    if (!priceId) {
      return {
        toolKey,
        configured: false,
        resolvedPriceId: null,
        error: `Missing env key: ${envKey}`,
      };
    }
    if (!priceId.startsWith("pri_")) {
      return {
        toolKey,
        configured: false,
        resolvedPriceId: null,
        error: `Invalid Paddle price ID format for ${envKey}`,
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
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export interface CheckoutPriceCheck {
  ok: boolean;
  priceId: string | undefined;
  reason: string | null;
}

export function requireBarisPaddleCheckoutPrice(envKey: string): CheckoutPriceCheck {
  const resolved = resolveBarisPaddlePriceId(envKey);
  if (!resolved.configured || !resolved.resolvedPriceId) {
    return {
      ok: false,
      priceId: undefined,
      reason: resolved.error || "PADDLE_PRICE_ID_REQUIRED",
    };
  }
  return {
    ok: true,
    priceId: resolved.resolvedPriceId,
    reason: null,
  };
}
