import { DEFAULT_FUNCTION_REGION } from "./constants";

/**
 * New revenue functions must use DEFAULT_FUNCTION_REGION.
 * Existing admin functions must not be moved without explicit approval.
 */
export const REVENUE_FUNCTION_REGION = DEFAULT_FUNCTION_REGION;

/** Revenue Flow function exports — all must use REVENUE_FUNCTION_REGION in index.ts. */
export const REVENUE_FUNCTION_NAMES = [
  "createStripeCheckout",
  "createCreditCheckout",
  "stripeWebhook",
  "futureReportExport",
] as const;

export type RevenueFunctionName = (typeof REVENUE_FUNCTION_NAMES)[number];
