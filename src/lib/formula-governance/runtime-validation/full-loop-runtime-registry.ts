/**
 * Slugs with production full-loop runtime enforcement (Mind 2 gate → calc → Mind 1 validation).
 */

export const FULL_LOOP_RUNTIME_SLUGS = [
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
] as const;

export type FullLoopRuntimeSlug = (typeof FULL_LOOP_RUNTIME_SLUGS)[number];

/** Funnel governance slugs mapped to premium FormulaContract + calc paths. */
export const FULL_LOOP_CONTRACT_ALIAS: Readonly<Partial<Record<FullLoopRuntimeSlug, string>>> = {
  "electrical-labor-estimator": "panel-shop-margin-verdict",
  "print-job-cost-check": "signage-bid-safe-price-tool",
  "lawn-care-cost-check": "landscaping-contract-profit-tool",
};

export function isFullLoopRuntimeSlug(slug: string): slug is FullLoopRuntimeSlug {
  return (FULL_LOOP_RUNTIME_SLUGS as readonly string[]).includes(slug);
}

export function resolveFullLoopContractSlug(slug: string): string {
  if (!isFullLoopRuntimeSlug(slug)) {
    return slug;
  }
  return FULL_LOOP_CONTRACT_ALIAS[slug] ?? slug;
}
