export const REVENUE_ELIGIBLE_ALLOWLIST = new Set([
  "auto-shop-margin-leak-detector",
  "change-order-impact-analyzer",
  "cnc-quote-risk-analyzer",
  "crop-yield-loss-analyzer",
  "dairy-profit-detector",
  "hvac-project-margin-guard",
  "landscaping-contract-profit-tool",
  "meal-planning-verdict",
  "menu-profit-leak-detector",
  "millwork-bid-risk-analyzer",
  "office-cleaning-bid-optimizer",
  "painting-job-profit-verdict",
  "panel-shop-margin-verdict",
  "plumbing-job-margin-verdict",
  "return-profit-erosion-tool",
  "roofing-contract-margin-guard",
  "sheet-metal-quote-risk-tool",
  "signage-bid-safe-price-tool",
  "water-optimization-verdict",
  "welding-bid-risk-analyzer",
]);

export const EXPECTED_REVENUE_ELIGIBLE_COUNTS = {
  paymentEligible: 20,
  formulaGateEligible: 20,
  freePaymentEligible: 0,
};

export function isRevenueEligibleAllowed(slug) {
  return REVENUE_ELIGIBLE_ALLOWLIST.has(slug);
}
