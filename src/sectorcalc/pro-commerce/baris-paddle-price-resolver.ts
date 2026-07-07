// SectorCalc PRO V5.3.1 — Baris Key Pack Paddle Price Resolver
// Server-side only. Resolves the single Baris PRO key pack price ID from env.
// No per-tool pricing — key-pool model. Users buy key packs, not individual tools.
import "server-only";

const KEY_PACK_ENV_KEY = "PADDLE_PRICE_BARIS_KEY_PACK";

export interface CheckoutPriceCheck {
  ok: boolean;
  priceId: string | undefined;
  reason: string | null;
}

/**
 * Resolve the single Baris PRO key pack Paddle price ID.
 * Returns { ok: false, reason: "PADDLE_PRICE_ID_REQUIRED" } if not configured.
 */
export function requireBarisKeyPackPrice(): CheckoutPriceCheck {
  const priceId = process.env[KEY_PACK_ENV_KEY];
  if (!priceId) {
    return {
      ok: false,
      priceId: undefined,
      reason: "PADDLE_PRICE_ID_REQUIRED",
    };
  }
  if (!priceId.startsWith("pri_")) {
    return {
      ok: false,
      priceId: undefined,
      reason: "Invalid Paddle price ID format",
    };
  }
  return {
    ok: true,
    priceId: priceId.trim(),
    reason: null,
  };
}
