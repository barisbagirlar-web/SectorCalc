/** Premium-schema batch slugs needing FormulaContract + oracle (no Node-only imports). */

export const BATCH_PREMIUM_SCHEMA_CRITICAL_SLUGS = [
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

export type BatchPremiumSchemaCriticalSlug = (typeof BATCH_PREMIUM_SCHEMA_CRITICAL_SLUGS)[number];

export function isBatchPremiumSchemaCriticalSlug(
  slug: string,
): slug is BatchPremiumSchemaCriticalSlug {
  return (BATCH_PREMIUM_SCHEMA_CRITICAL_SLUGS as readonly string[]).includes(slug);
}
