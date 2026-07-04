/**
 * Server-only Paddle price lookup.
 * Maps allowed product keys to Paddle price IDs.
 * Never accepts raw Paddle price IDs from the client.
 */

import "server-only";

import type { PaddleProductKey } from "./paddle-custom-data";

export type ProductLookupResult = {
  priceId: string;
  credits: number;
  purchaseType: "credit_pack" | "subscription";
};

const CREDIT_PRODUCT_KEYS: Record<string, { credits: number }> = {
  credit_pack_1: { credits: 1 },
  credit_pack_5: { credits: 5 },
  credit_pack_15: { credits: 15 },
  credit_pack_30: { credits: 30 },
  credit_pack_100: { credits: 100 },
};

const SUBSCRIPTION_PRODUCT_KEYS: Record<string, { credits: number }> = {
  pro_monthly: { credits: 0 },
  pro_annual: { credits: 0 },
};

/**
 * Resolve a Paddle price ID from a product key, using server-side env vars.
 * Throws if the product key is unknown or its price is not configured.
 */
export function resolvePaddlePriceId(productKey: string): ProductLookupResult {
  const envKey = `PADDLE_PRICE_ID_${productKey.toUpperCase()}`;
  const priceId = process.env[envKey];
  if (!priceId) {
    throw new Error(
      `Paddle price not configured for product key "${productKey}". Set ${envKey} in environment.`
    );
  }

  if (productKey in CREDIT_PRODUCT_KEYS) {
    return {
      priceId,
      credits: CREDIT_PRODUCT_KEYS[productKey].credits,
      purchaseType: "credit_pack",
    };
  }

  if (productKey in SUBSCRIPTION_PRODUCT_KEYS) {
    return {
      priceId,
      credits: SUBSCRIPTION_PRODUCT_KEYS[productKey].credits,
      purchaseType: "subscription",
    };
  }

  throw new Error(`Unknown product key: ${productKey}`);
}

/**
 * Resolve the number of credits for a known credit pack product key.
 * Returns 0 for subscription products, throws for unknown keys.
 */
export function resolveCreditAmount(productKey: PaddleProductKey): number {
  if (productKey in CREDIT_PRODUCT_KEYS) {
    return CREDIT_PRODUCT_KEYS[productKey].credits;
  }
  if (productKey in SUBSCRIPTION_PRODUCT_KEYS) {
    return 0;
  }
  throw new Error(`Unknown product key: ${productKey}`);
}
