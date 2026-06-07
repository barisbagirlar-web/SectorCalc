/**
 * Canonical billing plan catalog for checkout routing.
 * Stripe price IDs are read from env at runtime (Cloud Functions) — never hardcoded here.
 */

import type { CheckoutPlan } from "@/lib/billing/create-checkout-session";

export type BillingPlanId = "single_report" | "pro_monthly" | "team_monthly";

export type BillingEntitlementLevel = "single_report" | "pro" | "team";

export type BillingPlan = {
  readonly id: BillingPlanId;
  readonly label: string;
  readonly priceLabel: string;
  readonly mode: "payment" | "subscription";
  readonly entitlementLevel: BillingEntitlementLevel;
  /** Firebase Functions param / server env key for Stripe Price ID */
  readonly stripePriceEnvKey: string;
  /** Legacy Cloud Function checkout plan id (session metadata) */
  readonly legacyCheckoutPlan: CheckoutPlan;
  readonly features: readonly string[];
};

export const BILLING_PLANS: readonly BillingPlan[] = [
  {
    id: "single_report",
    label: "Single decision report",
    priceLabel: "From $9/report",
    mode: "payment",
    entitlementLevel: "single_report",
    stripePriceEnvKey: "STRIPE_PRICE_SINGLE_REPORT",
    legacyCheckoutPlan: "single_report",
    features: [
      "One premium decision report",
      "Full hidden-loss breakdown",
      "Threshold interpretation",
      "PDF / CSV export",
    ],
  },
  {
    id: "pro_monthly",
    label: "Pro",
    priceLabel: "$19/mo",
    mode: "subscription",
    entitlementLevel: "pro",
    stripePriceEnvKey: "STRIPE_PRICE_PRO_MONTHLY",
    legacyCheckoutPlan: "pro",
    features: [
      "Premium analyzers",
      "Hidden-loss diagnostics",
      "Threshold checks",
      "PDF / CSV export",
      "Saved report outputs",
    ],
  },
  {
    id: "team_monthly",
    label: "Team",
    priceLabel: "$49/mo",
    mode: "subscription",
    entitlementLevel: "team",
    stripePriceEnvKey: "STRIPE_PRICE_TEAM_MONTHLY",
    legacyCheckoutPlan: "team",
    features: [
      "Multi-user access",
      "Shared report workflow",
      "Custom templates",
      "Priority support",
    ],
  },
] as const;

/** Maps billing-config env keys to deployed Firebase Function param names. */
export const STRIPE_PRICE_ENV_ALIASES: Record<string, readonly string[]> = {
  STRIPE_PRICE_SINGLE_REPORT: ["STRIPE_PRICE_SINGLE_REPORT", "STRIPE_PRICE_SINGLE_VERDICT"],
  STRIPE_PRICE_PRO_MONTHLY: ["STRIPE_PRICE_PRO_MONTHLY", "STRIPE_PRICE_MONTHLY"],
  STRIPE_PRICE_TEAM_MONTHLY: ["STRIPE_PRICE_TEAM_MONTHLY", "STRIPE_PRICE_TEAM"],
};

export function getBillingPlanById(planId: BillingPlanId): BillingPlan {
  const plan = BILLING_PLANS.find((entry) => entry.id === planId);
  if (!plan) {
    throw new Error(`Unknown billing plan: ${planId}`);
  }
  return plan;
}

export function mapBillingPlanToCheckoutPlan(planId: BillingPlanId): CheckoutPlan {
  return getBillingPlanById(planId).legacyCheckoutPlan;
}

export function isBillingPlanId(value: string): value is BillingPlanId {
  return BILLING_PLANS.some((plan) => plan.id === value);
}

export function mapCheckoutPlanToBillingPlanId(plan: CheckoutPlan): BillingPlanId | null {
  switch (plan) {
    case "single_report":
      return "single_report";
    case "pro":
      return "pro_monthly";
    case "team":
      return "team_monthly";
    default:
      return null;
  }
}

export function resolveSafeReturnPath(returnPath?: string): string {
  const trimmed = returnPath?.trim() ?? "";
  if (
    trimmed.length === 0 ||
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.includes("://")
  ) {
    return "/pricing";
  }
  return trimmed;
}
