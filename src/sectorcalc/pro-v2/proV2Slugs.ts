// SectorCalc PRO V2 — Slug Allowlist
// Only slugs in this set render via ProExecutionFormV2.
// All other PRO slugs continue using the existing UniversalIndustrialDecisionForm.
//
// Wave activation:
//   Wave 0 (gold): weld-procedure-cost-consumable-estimation-suite
//   Wave 1 (cost+quotation): NOT YET ACTIVATED — machine-hourly-rate-proof-report is in testing

export const PRO_V2_SLUGS = new Set<string>([
  // Wave 0 — Golden PRO tool (live-verified)
  "weld-procedure-cost-consumable-estimation-suite",
  // Wave 1 — Cost and quotation (live-verified)
  "machine-hourly-rate-proof-report",
  "job-quote-builder-pro-pack",
  "loss-making-job-detector",
]);

export function isProV2Slug(slug: string): boolean {
  return PRO_V2_SLUGS.has(slug);
}
