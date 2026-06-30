/**
 * Canonical paid plan IDs for UI and checkout routing.
 * Stripe price IDs live in Cloud Functions env — never in the frontend.
 */

export type CheckoutPlanId =
 | "pro"
 | "single_verdict"
 | "pro_annual"
 | "team";

export type PlanAvailability = "live" | "waitlist";

export interface PlanCatalogEntry {
 id: CheckoutPlanId | "free";
 name: string;
 priceLabel: string;
 period?: string;
 availability: PlanAvailability;
 stripeCheckout: boolean;
}

export const PLAN_CATALOG: Record<CheckoutPlanId | "free", PlanCatalogEntry> = {
 free: {
 id: "free",
 name: "Free Check",
 priceLabel: "$0",
 period: "forever",
 availability: "live",
 stripeCheckout: false,
 },
 single_verdict: {
 id: "single_verdict",
 name: "Single Decision Report",
 priceLabel: "$19",
 period: "one report",
 availability: "live",
 stripeCheckout: true,
 },
 pro: {
 id: "pro",
 name: "Pro Monthly",
 priceLabel: "$29/month",
 period: "billed monthly",
 availability: "live",
 stripeCheckout: true,
 },
 pro_annual: {
 id: "pro_annual",
 name: "Pro Annual",
 priceLabel: "$149/year",
 period: "billed annually",
 availability: "live",
 stripeCheckout: true,
 },
 team: {
 id: "team",
 name: "Team",
 priceLabel: "$49/month",
 period: "per month",
 availability: "live",
 stripeCheckout: true,
 },
};

export const SINGLE_VERDICT_PRICE = 19;
export const SINGLE_VERDICT_CTA = `Get Full Verdict for $${SINGLE_VERDICT_PRICE}`;

export const MONEY_BACK_GUARANTEE =
 "14-day money-back guarantee on your first Single Verdict purchase.";

export const PRICING_REFUND_POLICY =
 "SectorCalc Pro is a digital subscription billed through Stripe. You can cancel anytime from your account or Stripe customer portal — access continues through the current billing period. Single verdict and annual plans are digital products with no guaranteed refunds; contact support if billing was made in error. Outputs are estimates only — not financial, legal or engineering advice. Stripe Adaptive Pricing may show local currency at checkout.";
