/** P8.1 — mirror of src/lib/tools/runtime-revenue-boundary-sync.ts (scripts only). */
export const REVENUE_BOUNDARY_RESTORE_SLUGS = new Set([
  "auto-shop-margin-leak-detector",
  "cnc-quote-risk-analyzer",
  "print-job-cost-check",
]);

export function isRevenueBoundaryRestoreSlug(slug) {
  return REVENUE_BOUNDARY_RESTORE_SLUGS.has(String(slug).trim());
}
