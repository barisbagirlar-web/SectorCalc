/**
 * Kredi Stripe key'leri — sonra doldurulacak.
 * Boş price ID → checkout price_data ile devam eder (key zorunlu değil).
 */

import { defineString } from "firebase-functions/params";
import {
  STRIPE_PRICE_CREDITS_1_PARAM,
  STRIPE_PRICE_CREDITS_5_PARAM,
  STRIPE_PRICE_CREDITS_15_PARAM,
  STRIPE_PRICE_CREDITS_30_PARAM,
  STRIPE_PRICE_CREDITS_100_PARAM,
} from "./constants";

const priceParams = {
  "1": defineString(STRIPE_PRICE_CREDITS_1_PARAM, { default: "" }),
  "5": defineString(STRIPE_PRICE_CREDITS_5_PARAM, { default: "" }),
  "15": defineString(STRIPE_PRICE_CREDITS_15_PARAM, { default: "" }),
  "30": defineString(STRIPE_PRICE_CREDITS_30_PARAM, { default: "" }),
  "100": defineString(STRIPE_PRICE_CREDITS_100_PARAM, { default: "" }),
} as const;

export type CreditPackageId = keyof typeof priceParams;

/** Stripe Dashboard'dan gelen price_xxx — yoksa null (fallback var) */
export function resolveCreditPriceId(packageId: string): string | null {
  const param = priceParams[packageId as CreditPackageId];
  if (!param) {
    return null;
  }
  const value = param.value().trim();
  if (!value || value.startsWith("price_sonra") || value === "price_xxx") {
    return null;
  }
  return value;
}

/** Env şablonu — script key yokken basar */
export const CREDIT_STRIPE_ENV_TEMPLATE = `
# --- Kredi paketleri (sonra doldur) ---
STRIPE_SECRET_KEY=sk_test_sonra_doldur
STRIPE_WEBHOOK_SECRET=whsec_sonra_doldur
STRIPE_PRICE_CREDITS_1=price_xxx
STRIPE_PRICE_CREDITS_5=price_xxx
STRIPE_PRICE_CREDITS_15=price_xxx
STRIPE_PRICE_CREDITS_30=price_xxx
STRIPE_PRICE_CREDITS_100=price_xxx
`.trim();
