// SectorCalc PRO V2 — Slug Allowlist
// Only slugs in this set render via ProExecutionFormV2.
// All other PRO slugs continue using the existing UniversalIndustrialDecisionForm.

export const PRO_V2_SLUGS = new Set<string>([
  "weld-procedure-cost-consumable-estimation-suite",
]);

export function isProV2Slug(slug: string): boolean {
  return PRO_V2_SLUGS.has(slug);
}
