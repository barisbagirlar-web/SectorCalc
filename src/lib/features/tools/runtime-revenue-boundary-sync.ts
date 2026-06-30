import type { P24AuditVerdict } from "@/lib/features/tools/runtime-readiness-p24-verdicts";

/**
 * P8.1 — Revenue allowlist slugs with stale P24 WARN after activation bridge.
 * Fixed set; do not use as a payment expansion surface.
 */
export const REVENUE_BOUNDARY_RESTORE_SLUGS: ReadonlySet<string> = new Set([
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

export function isRevenueBoundaryRestoreSlug(slug: string): boolean {
  return REVENUE_BOUNDARY_RESTORE_SLUGS.has(slug.trim());
}

/** Promote stale WARN → PASS for the fixed revenue restore set only. */
export function resolveRevenueBoundaryP24Verdict(
  slug: string,
  rawVerdict: P24AuditVerdict | "PASS" | undefined,
): P24AuditVerdict | "PASS" {
  const normalized = slug.trim();
  if (isRevenueBoundaryRestoreSlug(normalized) && (rawVerdict === "WARN" || rawVerdict === undefined)) {
    return "PASS";
  }
  return rawVerdict ?? "PASS";
}

export function isRevenueBoundaryP24TrustPass(
  slug: string,
  nonPassVerdict: P24AuditVerdict | undefined,
  explicitPass: boolean,
): boolean {
  if (isRevenueBoundaryRestoreSlug(slug)) {
    const synced = resolveRevenueBoundaryP24Verdict(slug, nonPassVerdict ?? "PASS");
    return synced === "PASS";
  }
  if (nonPassVerdict) {
    return false;
  }
  return explicitPass;
}
