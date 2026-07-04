/**
 * SectorCalc Paddle customData contract — single source of truth.
 *
 * Both client-side Paddle.js (CreditWall, CheckoutButton) and server-side
 * checkout route emit this shape. The webhook validates against it.
 *
 * Legacy customData.credits and customData.planId are still supported
 * for old completed transactions but new checkout emits canonical fields.
 */

import "server-only";

// ── Allowed purchase intents ──────────────────────────────────────────────

export type PaddlePurchaseIntent =
  | "SECTORCALC_CREDIT_PACK_PURCHASE"
  | "SECTORCALC_PRO_SUBSCRIPTION_PURCHASE"
  | "SECTORCALC_PREMIUM_UNLOCK";

export const ALLOWED_INTENTS: readonly PaddlePurchaseIntent[] = [
  "SECTORCALC_CREDIT_PACK_PURCHASE",
  "SECTORCALC_PRO_SUBSCRIPTION_PURCHASE",
  "SECTORCALC_PREMIUM_UNLOCK",
];

export function isAllowedIntent(value: string): value is PaddlePurchaseIntent {
  return ALLOWED_INTENTS.includes(value as PaddlePurchaseIntent);
}

// ── Allowed product keys ─────────────────────────────────────────────────

export type PaddleProductKey =
  | "credit_pack_1"
  | "credit_pack_5"
  | "credit_pack_15"
  | "credit_pack_30"
  | "credit_pack_100"
  | "pro_monthly"
  | "pro_annual";

export const CREDIT_PACK_KEYS: readonly PaddleProductKey[] = [
  "credit_pack_1",
  "credit_pack_5",
  "credit_pack_15",
  "credit_pack_30",
  "credit_pack_100",
];

export const SUBSCRIPTION_PACK_KEYS: readonly PaddleProductKey[] = [
  "pro_monthly",
  "pro_annual",
];

export function isCreditPackKey(key: string): key is PaddleProductKey {
  return CREDIT_PACK_KEYS.includes(key as PaddleProductKey);
}

export function isSubscriptionPackKey(key: string): key is PaddleProductKey {
  return SUBSCRIPTION_PACK_KEYS.includes(key as PaddleProductKey);
}

/** Server-authoritative credit counts per credit-pack product key. */
export const CREDITS_BY_PRODUCT_KEY: Record<PaddleProductKey, number> = {
  credit_pack_1: 1,
  credit_pack_5: 5,
  credit_pack_15: 15,
  credit_pack_30: 30,
  credit_pack_100: 100,
  pro_monthly: 0,
  pro_annual: 0,
};

// ── Purchase types ───────────────────────────────────────────────────────

export type PurchaseType = "credit_pack" | "subscription" | "premium_unlock";

// ── customData contract type ─────────────────────────────────────────────

export interface PaddleCustomData {
  /** Purchase intent — must be an allowed intent */
  intent: PaddlePurchaseIntent;
  /** Product key identifying what was purchased */
  productKey: PaddleProductKey;
  /** Purchase type classification — derived from product */
  purchaseType: PurchaseType;
  /** Number of credits (server-resolved, never from client for new checkouts) */
  credits?: number;
  /** Plan identifier (for subscription/plan unlock) — preserved for backward compat */
  planId?: string;
  /** Tool slug if this purchase is tool-specific */
  toolKey?: string;
  /** User identifier (Firebase UID or customer reference) */
  userId?: string;
  /** Source of checkout for tracing */
  source?: string;
  /** Unique request/checkout-attempt identifier */
  requestId?: string;
}

// ── Validation ───────────────────────────────────────────────────────────

/**
 * Validate a raw customData object against the contract.
 * Throws with a public-safe error message if invalid.
 */
export function validateCustomData(
  raw: Record<string, unknown>,
): PaddleCustomData {
  const intent = String(raw.intent ?? "");
  if (!isAllowedIntent(intent)) {
    throw new Error(`Invalid purchase intent: ${intent}`);
  }

  const productKey = String(raw.productKey ?? "");
  const isCreditKey = isCreditPackKey(productKey);
  const isSubKey = isSubscriptionPackKey(productKey);

  if (!isCreditKey && !isSubKey) {
    throw new Error(`Unknown product key: ${productKey}`);
  }

  // Resolve purchase type server-side
  let purchaseType: PurchaseType;
  if (isCreditKey) {
    purchaseType = "credit_pack";
  } else if (intent === "SECTORCALC_CREDIT_PACK_PURCHASE") {
    // Subscription key with credit-pack intent is a mismatch
    throw new Error(
      `Intent ${intent} is not valid for product key ${productKey}`,
    );
  } else {
    purchaseType = "subscription";
  }

  // Intent/productKey compatibility
  if (intent === "SECTORCALC_CREDIT_PACK_PURCHASE" && !isCreditKey) {
    throw new Error(
      `Credit pack purchase requires a credit pack product key, got: ${productKey}`,
    );
  }
  if (intent === "SECTORCALC_PRO_SUBSCRIPTION_PURCHASE" && !isSubKey) {
    throw new Error(
      `Subscription purchase requires a subscription product key, got: ${productKey}`,
    );
  }
  if (intent === "SECTORCALC_PREMIUM_UNLOCK" && !isSubKey) {
    throw new Error(
      `Premium unlock requires a subscription product key, got: ${productKey}`,
    );
  }

  const credits: number | undefined =
    typeof raw.credits === "number"
      ? raw.credits
      : typeof raw.credits === "string" && raw.credits !== ""
        ? Number(raw.credits)
        : undefined;
  const planId =
    typeof raw.planId === "string" ? raw.planId : undefined;
  const toolKey =
    typeof raw.toolKey === "string" ? raw.toolKey : undefined;
  const userId =
    typeof raw.userId === "string" ? raw.userId : undefined;
  const source =
    typeof raw.source === "string" ? raw.source : undefined;
  const requestId =
    typeof raw.requestId === "string" ? raw.requestId : undefined;

  // Server-authoritative credits override: for credit packs, use our own value
  const serverCredits = isCreditKey
    ? CREDITS_BY_PRODUCT_KEY[productKey as PaddleProductKey]
    : 0;

  // If client supplied credits don't match server definition, trust server
  const resolvedCredits =
    intent === "SECTORCALC_CREDIT_PACK_PURCHASE" ? serverCredits : credits;

  return {
    intent,
    productKey: productKey as PaddleProductKey,
    purchaseType,
    credits: resolvedCredits,
    planId,
    toolKey,
    userId,
    source,
    requestId,
  };
}

/**
 * Build customData for a Paddle checkout session.
 * All values are converted to strings (Paddle.js SDK requirement).
 */
export function buildPaddleCustomData(
  fields: PaddleCustomData,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(fields)) {
    result[key] = value !== undefined ? String(value) : "";
  }
  // Always include purchaseType string
  result.purchaseType = fields.purchaseType;
  return result;
}

/**
 * Safely parse a legacy raw customData that may lack canonical fields.
 * Returns null if no recognizable fields exist.
 * Does NOT throw — logs and returns null on failure for safe fallback.
 */
export function parseLegacyCustomData(
  raw: Record<string, unknown> | undefined | null,
): { credits: number; planId: string; userId: string } | null {
  if (!raw) return null;
  try {
    const credits = Number(raw.credits ?? 0);
    const planId = String(raw.planId ?? "");
    const userId = String(raw.userId ?? "");
    if (!credits && !planId) return null;
    return { credits: Number.isFinite(credits) ? credits : 0, planId, userId };
  } catch {
    return null;
  }
}
