/**
 * SEO-P2 - first 50 high-intent tool SEO landing slugs.
 *
 * Selection: premium conversion potential, search intent, business cost pain,
 * global usability, formula governance confidence.
 *
 * Revenue tools use paidSlug; schema-only tools use premium-schema id.
 */

export type SeoP2LandingSource = "revenue" | "schema";

export type SeoP2First50Entry = {
  readonly slug: string;
  readonly source: SeoP2LandingSource;
};

/** Ordered priority list - exactly 50 entries. */
export const SEO_P2_FIRST_50: readonly SeoP2First50Entry[] = [
  // Revenue - sector bid / margin analyzers (27)
  { slug: "cnc-quote-risk-analyzer", source: "revenue" },
  { slug: "change-order-impact-analyzer", source: "revenue" },
  { slug: "hvac-project-margin-guard", source: "revenue" },
  { slug: "panel-shop-margin-verdict", source: "revenue" },
  { slug: "auto-shop-margin-leak-detector", source: "revenue" },
  { slug: "plumbing-job-margin-verdict", source: "revenue" },
  { slug: "roofing-contract-margin-guard", source: "revenue" },
  { slug: "sheet-metal-quote-risk-tool", source: "revenue" },
  { slug: "welding-bid-risk-analyzer", source: "revenue" },
  { slug: "menu-profit-leak-detector", source: "revenue" },
  { slug: "return-profit-erosion-tool", source: "revenue" },
  { slug: "route-optimization-analyzer", source: "revenue" },
  { slug: "energy-efficiency-report", source: "revenue" },
  { slug: "cbam-compliance-verdict", source: "revenue" },
  { slug: "office-cleaning-bid-optimizer", source: "revenue" },
  { slug: "signage-bid-safe-price-tool", source: "revenue" },
  { slug: "millwork-bid-risk-analyzer", source: "revenue" },
  { slug: "painting-job-profit-verdict", source: "revenue" },
  { slug: "landscaping-contract-profit-tool", source: "revenue" },
  { slug: "3d-print-job-margin-tool", source: "revenue" },
  { slug: "crop-yield-loss-analyzer", source: "revenue" },
  { slug: "feed-efficiency-analyzer", source: "revenue" },
  { slug: "dairy-profit-detector", source: "revenue" },
  { slug: "water-optimization-verdict", source: "revenue" },
  { slug: "renovation-budget-optimizer", source: "revenue" },
  { slug: "trip-budget-optimizer", source: "revenue" },
  { slug: "meal-planning-verdict", source: "revenue" },
  // Schema-only - cross-sector cost / margin / compliance (23)
  { slug: "carbon-footprint-compliance-risk", source: "schema" },
  { slug: "cbam-exposure-quick-check", source: "schema" },
  { slug: "cbam-unit-product-carbon-footprint-calculator", source: "schema" },
  { slug: "quote-price-profit-margin-calculator", source: "schema" },
  { slug: "profit-margin-calculator", source: "schema" },
  { slug: "shop-rate-hourly-cost-calculator", source: "schema" },
  { slug: "break-even-safety-margin-calculator", source: "schema" },
  { slug: "employee-total-cost-calculator", source: "schema" },
  { slug: "downtime-minute-cost-calculator", source: "schema" },
  { slug: "investment-payback-npv-calculator", source: "schema" },
  { slug: "inventory-carrying-cost-eoq-calculator", source: "schema" },
  { slug: "product-customer-profitability-calculator", source: "schema" },
  { slug: "oee-equipment-effectiveness-calculator", source: "schema" },
  { slug: "compressor-leak-cost-calculator", source: "schema" },
  { slug: "energy-compressor-leak-cost", source: "schema" },
  { slug: "energy-savings-package-calculator", source: "schema" },
  { slug: "quality-cost-paf-calculator", source: "schema" },
  { slug: "value-stream-map-vsm-calculator", source: "schema" },
  { slug: "material-waste-calculator", source: "schema" },
  { slug: "scrap-rate-calculator", source: "schema" },
  { slug: "auto-repair-parts-labor-quote-calculator", source: "schema" },
  { slug: "heat-loss-calculator", source: "schema" },
  { slug: "annual-leave-severance-notice-calculator", source: "schema" },
] as const;

const SEO_P2_SET = new Set(SEO_P2_FIRST_50.map((entry) => entry.slug));

export function isSeoP2First50Slug(slug: string): boolean {
  return SEO_P2_SET.has(slug);
}

export function getSeoP2First50Entry(slug: string): SeoP2First50Entry | null {
  return SEO_P2_FIRST_50.find((entry) => entry.slug === slug) ?? null;
}

export function listSeoP2First50Slugs(): readonly string[] {
  return SEO_P2_FIRST_50.map((entry) => entry.slug);
}
