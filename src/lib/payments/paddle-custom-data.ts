/**
 * Paddle customData contract — single source of truth for all Paddle checkout metadata shapes.
 * Both CreditWall (client-side Paddle.js) and server-side checkout route use this contract.
 */

import "server-only";

// ── Allowed purchase intents ──────────────────────────────────────────────

export type PaddlePurchaseIntent =
  /** One-time credit pack purchase (1, 5, 15, 30, 100 credits) */
  | "SECTORCALC_CREDIT_PACK_PURCHASE"
  /** Pro subscription purchase (monthly/annual) */
  | "SECTORCALC_PRO_SUBSCRIPTION_PURCHASE"
  /** Premium tool unlock tied to a specific tool slug */
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

export const CREDITS_BY_PRODUCT_KEY: Record<PaddleProductKey, number> = {
  credit_pack_1: 1,
  credit_pack_5: 5,
  credit_pack_15: 15,
  credit_pack_30: 30,
  credit_pack_100: 100,
  pro_monthly: 0, // Subscription — credits not applicable
  pro_annual: 0,
};

// ── customData contract type ─────────────────────────────────────────────

export interface PaddleCustomData {
  /** Purchase intent — must be an allowed intent */
  intent: PaddlePurchaseIntent;
  /** Product key identifying what was purchased */
  productKey: PaddleProductKey;
  /** Number of credits (for credit pack purchases only) */
  credits?: number;
  /** Plan identifier (for subscription/plan unlock) — preserved for backward compat */
  planId?: string;
  /** Tool slug if this purchase is tool-specific */
  toolKey?: string;
  /** User identifier (Firebase UID or customer reference) */
  userId?: string;
  /** Source of checkout — for tracing */
  source?: string;
  /** Unique request identifier to de-duplicate checkout creation */
  requestId?: string;
}

/**
 * Validate and normalize a raw customData object against the contract.
 * Returns the validated PaddleCustomData or throws with a public-safe error message.
 */
export function validateCustomData(raw: Record<string, unknown>): PaddleCustomData {
  const intent = String(raw.intent ?? "");
  if (!isAllowedIntent(intent)) {
    throw new Error(`Invalid purchase intent: ${intent}`);
  }

  const productKey = String(raw.productKey ?? "");
  const isKnownCreditKey = isCreditPackKey(productKey);
  const isKnownSubscriptionKey = isSubscriptionPackKey(productKey);

  if (!isKnownCreditKey && !isKnownSubscriptionKey && productKey !== "") {
    throw new Error(`Unknown product key: ${productKey}`);
  }

  const customData: PaddleCustomData = {
    intent,
    productKey: productKey as PaddleProductKey,
    credits: typeof raw.credits === "number" ? raw.credits : undefined,
    planId: typeof raw.planId === "string" ? raw.planId : undefined,
    toolKey: typeof raw.toolKey === "string" ? raw.toolKey : undefined,
    userId: typeof raw.userId === "string" ? raw.userId : undefined,
    source: typeof raw.source === "string" ? raw.source : undefined,
    requestId: typeof raw.requestId === "string" ? raw.requestId : undefined,
  };

  // Validate credit pack intent has matching product key
  if (intent === "SECTORCALC_CREDIT_PACK_PURCHASE" && !isCreditPackKey(productKey)) {
    throw new Error(`Credit pack purchase requires a valid credit pack product key, got: ${productKey}`);
  }

  // Validate subscription intent
  if (intent === "SECTORCALC_PRO_SUBSCRIPTION_PURCHASE" && !isSubscriptionPackKey(productKey)) {
    throw new Error(`Subscription purchase requires a valid subscription product key, got: ${productKey}`);
  }

  return customData;
}

/**
 * Build customData for a checkout session from validated fields.
 * Converts all values to strings (Paddle SDK requirement).
 */
export function buildPaddleCustomData(fields: PaddleCustomData): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(fields)) {
    result[key] = value !== undefined ? String(value) : "";
  }
  return result;
}
