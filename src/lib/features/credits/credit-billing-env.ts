/**
 * Kredi billing env — key'ler sonra doldurulacak.
 * Bos birakilirsa Cloud Function URL'leri project id'den turetilir.
 */

export const CREDIT_BILLING_ENV = {
  /** Stripe checkout function — opsiyonel override */
  checkoutFunctionUrl:
    process.env.NEXT_PUBLIC_CREDIT_CHECKOUT_FUNCTION_URL?.trim() || "",

  /** Kredi harcama function — opsiyonel override */
  spendCreditsFunctionUrl:
    process.env.NEXT_PUBLIC_SPEND_CREDITS_FUNCTION_URL?.trim() || "",

  /** Firebase project — URL fallback icin */
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || "",
} as const;

/** Key'ler hazir mi? (sadece UI/dev mesajlari icin) */
export function isCreditBillingConfigured(): boolean {
  return CREDIT_BILLING_ENV.projectId.length > 0;
}

export function resolveCreditCheckoutUrl(): string | null {
  if (CREDIT_BILLING_ENV.checkoutFunctionUrl) {
    return CREDIT_BILLING_ENV.checkoutFunctionUrl;
  }
  if (!CREDIT_BILLING_ENV.projectId) {
    return null;
  }
  return `https://us-central1-${CREDIT_BILLING_ENV.projectId}.cloudfunctions.net/createCreditCheckout`;
}

export function resolveSpendCreditsUrl(): string | null {
  if (CREDIT_BILLING_ENV.spendCreditsFunctionUrl) {
    return CREDIT_BILLING_ENV.spendCreditsFunctionUrl;
  }
  if (!CREDIT_BILLING_ENV.projectId) {
    return null;
  }
  return `https://us-central1-${CREDIT_BILLING_ENV.projectId}.cloudfunctions.net/spendCredits`;
}
