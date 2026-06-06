/**
 * SectorCalc Pro — pricing copy lock (Revenue Flow v1A).
 * Stripe checkout, webhooks and subscription guards are out of scope for this phase.
 */

export const REVENUE_LEGAL_DISCLAIMER =
  "This is a technical simulation and decision-support output. It is not financial, legal or engineering advice. Verify all results before making business decisions.";

export const REVENUE_LEGAL_DISCLAIMER_PAID =
  `${REVENUE_LEGAL_DISCLAIMER} Digital product. No refunds.`;

export const SECTORCALC_PRO_PRICE = 29;
export const SECTORCALC_PRO_PRICE_LABEL = "$29/month";

export const SECTORCALC_PRO = {
  id: "pro" as const,
  planName: "SectorCalc Pro",
  price: SECTORCALC_PRO_PRICE,
  priceLabel: SECTORCALC_PRO_PRICE_LABEL,
  headline: "Unlock sector-specific decision tools.",
  description:
    "Avoid underpriced jobs, margin leaks and bad bids with premium analyzers built for real operating decisions.",
  bullets: [
    "Safe price and bid risk verdicts",
    "Margin leak detection",
    "Sector-specific analyzer tools",
    "Report-style decision summaries",
    "Cancel anytime",
    "Digital product, no refunds",
    "Estimates only; verify before business decisions",
  ],
  legalDisclaimer: REVENUE_LEGAL_DISCLAIMER,
} as const;

/** @deprecated Use SECTORCALC_PRO — kept for pricing-plans migration. */
export const SECTORCALC_PRO_PRICING = {
  id: SECTORCALC_PRO.id,
  name: SECTORCALC_PRO.planName,
  price: SECTORCALC_PRO.price,
  priceLabel: SECTORCALC_PRO.priceLabel,
  tagline: SECTORCALC_PRO.headline,
  description: SECTORCALC_PRO.description,
  features: SECTORCALC_PRO.bullets.slice(0, 5),
  freePlanContrast: [
    "No safe price or accept/reject verdict",
    "No decision summaries",
    "No export",
  ],
  laterRelease: SECTORCALC_PRO.bullets.slice(5),
} as const;

export const FREE_PLAN_PRICING = {
  id: "free" as const,
  name: "Free",
  priceLabel: "$0",
  period: "forever",
  description:
    "Quick sector checks — limited inputs, directional numbers and early risk signals.",
  features: [
    "Five industry quick-check calculators",
    "2–3 inputs per tool",
    "Risk or preview signals",
    "No account required",
  ],
} as const;
