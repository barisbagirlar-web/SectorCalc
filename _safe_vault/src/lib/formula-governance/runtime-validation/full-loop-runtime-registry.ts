/**
 * Slugs with production full-loop runtime enforcement (Mind 2 gate → calc → Mind 1 validation).
 */

import { BATCH_TRAFFIC_CATALOG_CRITICAL_SLUGS } from "@/lib/formula-governance/contracts/batch-traffic-catalog-critical";

export const PREMIUM_FULL_LOOP_RUNTIME_SLUGS = [
  "welding-bid-risk-analyzer",
  "sheet-metal-quote-risk-tool",
  "hvac-project-margin-guard",
  "plumbing-job-margin-verdict",
  "electrical-labor-estimator",
  "print-job-cost-check",
  "lawn-care-cost-check",
  "roofing-contract-margin-guard",
  "painting-job-profit-verdict",
  "cnc-quote-risk-analyzer",
  "change-order-impact-analyzer",
  "office-cleaning-bid-optimizer",
  "menu-profit-leak-detector",
  "return-profit-erosion-tool",
  "panel-shop-margin-verdict",
  "landscaping-contract-profit-tool",
  "signage-bid-safe-price-tool",
  "millwork-bid-risk-analyzer",
  "auto-shop-margin-leak-detector",
  "route-optimization-analyzer",
  "energy-efficiency-report",
  "meal-planning-verdict",
  "trip-budget-optimizer",
  "cbam-compliance-verdict",
  "crop-yield-loss-analyzer",
  "feed-efficiency-analyzer",
  "dairy-profit-detector",
  "water-optimization-verdict",
  "renovation-budget-optimizer",
  "3d-print-job-margin-tool",
] as const;

/** Free / audit tools promoted to full-loop runtime (traffic catalog + aligned revenue free tools). */
export const FREE_FULL_LOOP_RUNTIME_SLUGS = [
  "repair-time-vs-price-check",
  "rent-vs-buy-calculator",
  "loan-payment-calculator",
  "mortgage-calculator",
  "interest-calculator",
  "compound-interest-calculator",
  "profit-margin-calculator",
  "break-even-calculator",
  "salary-cost-calculator",
  "cash-flow-gap-calculator",
  "machine-time-calculator",
  "food-cost-calculator",
  "welding-cost-estimator",
  "sample-size-calculator",
  "hvac-tonnage-rule-check",
  "roofing-square-cost-check",
  "project-cost-calculator",
  "cleaning-cost-calculator",
  "product-margin-calculator",
  "laser-cutting-time-check",
  "kwh-consumption-check",
  "paint-coverage-cost-check",
  "plumbing-fixture-cost-check",
  "home-renovation-m2",
  ...BATCH_TRAFFIC_CATALOG_CRITICAL_SLUGS,
] as const;

export const FULL_LOOP_RUNTIME_SLUGS = [
  ...PREMIUM_FULL_LOOP_RUNTIME_SLUGS,
  ...FREE_FULL_LOOP_RUNTIME_SLUGS,
] as const;

export type PremiumFullLoopRuntimeSlug = (typeof PREMIUM_FULL_LOOP_RUNTIME_SLUGS)[number];
export type FreeFullLoopRuntimeSlug = (typeof FREE_FULL_LOOP_RUNTIME_SLUGS)[number];
export type FullLoopRuntimeSlug = (typeof FULL_LOOP_RUNTIME_SLUGS)[number];

/** Funnel governance slugs mapped to premium FormulaContract + calc paths. */
export const FULL_LOOP_CONTRACT_ALIAS: Readonly<
  Partial<Record<PremiumFullLoopRuntimeSlug, string>>
> = {
  "electrical-labor-estimator": "panel-shop-margin-verdict",
  "print-job-cost-check": "signage-bid-safe-price-tool",
  "lawn-care-cost-check": "landscaping-contract-profit-tool",
};

export function isPremiumFullLoopRuntimeSlug(slug: string): slug is PremiumFullLoopRuntimeSlug {
  return (PREMIUM_FULL_LOOP_RUNTIME_SLUGS as readonly string[]).includes(slug);
}

export function isFreeFullLoopRuntimeSlug(slug: string): slug is FreeFullLoopRuntimeSlug {
  return (FREE_FULL_LOOP_RUNTIME_SLUGS as readonly string[]).includes(slug);
}

export function isFullLoopRuntimeSlug(slug: string): slug is FullLoopRuntimeSlug {
  return isPremiumFullLoopRuntimeSlug(slug) || isFreeFullLoopRuntimeSlug(slug);
}

export function resolveFullLoopContractSlug(slug: string): string {
  if (!isPremiumFullLoopRuntimeSlug(slug)) {
    return slug;
  }
  return FULL_LOOP_CONTRACT_ALIAS[slug] ?? slug;
}
