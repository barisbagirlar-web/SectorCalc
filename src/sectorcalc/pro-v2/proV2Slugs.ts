// SectorCalc PRO V2 — Slug Allowlist
// Only slugs in this set render via ProExecutionFormV2.
// All other PRO slugs continue using the existing UniversalIndustrialDecisionForm.
//
// Wave activation:
//   Wave 0 (gold): weld-procedure-cost-consumable-estimation-suite
//   Wave 1 (cost+quotation): machine-hourly-rate-proof-report and others
//   Wave 2 (margin/pricing): sku ranker, forensics, etc.
//   Wave 3 (operations/quality): downtime, OEE, scrap, SMED, outsource
//   Wave 4 (capital/energy): NPV/IRR, buy/lease, motor, energy grant

export const PRO_V2_SLUGS = new Set<string>([
  // Wave 0 — Golden PRO tool (live-verified)
  "weld-procedure-cost-consumable-estimation-suite",
  // Wave 1 — Cost and quotation (live-verified)
  "machine-hourly-rate-proof-report",
  "job-quote-builder-pro-pack",
  "loss-making-job-detector",
  // Wave 1.5 — Financial planning (ready)
  "break-even-survival-cash-calculator",
  "true-employee-cost-statement",
  // Wave 2 — Margin & pricing analytics
  "product-sku-margin-ranker",
  "customer-sku-profitability-forensics",
  "receivables-cost-payment-term-addendum",
  "fx-commodity-pass-through-pricer",
  "plant-wide-shop-rate-cost-structure-audit",
  // Wave 3 — Operations & Quality Loss
  "downtime-scrap-loss-statement",
  "oee-loss-monetization-improvement-business-case",
  "scrap-rework-cost-tracker",
  "setup-time-reduction-roi-smed",
  "outsource-vs-in-house-analyzer",
  // Wave 4 — Capital Investment & Energy Efficiency
  "capital-equipment-investment-appraisal-npv-irr",
  "machine-investment-feasibility-buy-lease-keep",
  "motor-compressor-replacement-roi",
  "energy-efficiency-grant-incentive-feasibility-pack",
]);

export function isProV2Slug(slug: string): boolean {
  return PRO_V2_SLUGS.has(slug);
}
