/**
 * Premium Tool → Category Mapping.
 *
 * Maps every slug from premium-slugs.json to one of the 20 premium categories
 * based on the tool's engineering domain, loss family, and business function.
 *
 * ECMI / ISO 9001 - Every assignment is reviewed against the tool's formula
 * purpose, not just its name. Tools that bridge multiple categories are placed
 * in the primary loss family.
 *
 * This is the single source of truth for the category assignment.
 */

import type { PremiumCategorySlug } from "@/data/premium-categories";

/**
 * Maps a premium tool slug to its category slug.
 */
const PREMIUM_TOOL_CATEGORY_MAP: Record<string, PremiumCategorySlug> = {
  // ── Lean Production & Line Efficiency ──────────────────────────
  "smed-changeover-optimizer": "lean-production",
  "changeover-matrix-optimizer": "lean-production",
  "vsm-financial-converter": "lean-production",
  "kaizen-savings-tracker": "lean-production",
  "muda-waste-cost-calculator": "lean-production",
  "poka-yoke-roi-calculator": "lean-production",
  "takt-time-flexibility-cost": "lean-production",
  "product-complexity-hidden-cost": "lean-production",
  "learning-curve-time-estimator": "lean-production",
  "time-study-analyzer": "lean-production",
  "bottleneck-investment-prioritizer": "lean-production",
  "flexible-manufacturing-roi": "lean-production",
  "factory-layout-distance-optimizer": "lean-production",
  "scrap-rate-optimizer": "lean-production",
  "oee-downtime-calculator": "lean-production",
  "downtime-cost-calculator": "lean-production",
  "machine-economic-life-calculator": "lean-production",
  "shop-hourly-rate-calculator": "lean-production",

  // ── Quality, SPC & Six Sigma ───────────────────────────────────
  "cpk-ppm-converter": "quality-six-sigma",
  "msa-gage-rr-cost": "quality-six-sigma",
  "spc-limit-calculator": "quality-six-sigma",
  "spc-signal-delay-cost": "quality-six-sigma",
  "taguchi-quality-loss-function": "quality-six-sigma",
  "aql-sampling-risk-cost": "quality-six-sigma",
  "sample-size-calculator": "quality-six-sigma",
  "calibration-drift-risk": "quality-six-sigma",
  "six-sigma-project-prioritizer": "quality-six-sigma",
  "quality-cost-paf-calculator": "quality-six-sigma",
  "rca-recurring-cost-calculator": "quality-six-sigma",

  // ── Process, Chemical & Fluids ─────────────────────────────────
  // (No direct matches in current premium-slugs.json;
  //  these will be added as schema-based tools land.)

  // ── CNC, 3D Printing & Advanced Manufacturing ──────────────────
  "cnc-machining-cost-calculator": "cnc-additive-manufacturing",
  "tool-wear-cost-calculator": "cnc-additive-manufacturing",
  "cnc-cycle-time-calculator": "cnc-additive-manufacturing",
  "lightweight-cost-savings-calculator": "cnc-additive-manufacturing",
  "chatter-surface-quality-loss": "cnc-additive-manufacturing",
  "machining-strategy-time-optimizer": "cnc-additive-manufacturing",
  "cutting-parameters-tool-life": "cnc-additive-manufacturing",
  "filament-recycling-cost-comparator": "cnc-additive-manufacturing",

  // ── Sheet Metal, Casting, Plastics & Forming ───────────────────
  // (No direct matches in current premium-slugs.json.)

  // ── Project, Site & Construction Management ────────────────────
  "project-cost-estimator": "project-construction-management",
  "contract-incentive-calculator": "project-construction-management",
  "project-overrun-risk": "project-construction-management",
  "evm-cost-forecast": "project-construction-management",
  "cpm-delay-penalty-optimizer": "project-construction-management",
  "scaffolding-rental-optimizer": "project-construction-management",
  "roof-area-calculator": "project-construction-management",
  "renovation-budget-optimizer": "project-construction-management",
  "cut-fill-balance-optimizer": "project-construction-management",
  "concrete-volume-calculator": "project-construction-management",
  "beam-weight-calculator": "project-construction-management",
  "bolt-torque-calculator": "project-construction-management",
  "pressure-vessel-thickness": "project-construction-management",
  "wps-preheat-temperature": "project-construction-management",

  // ── Digital Factory & Automation ───────────────────────────────
  "cobot-vs-manual-labor-comparator": "digital-factory-automation",
  "digital-twin-cost-comparator": "digital-factory-automation",

  // ── Maintenance & Reliability ──────────────────────────────────
  "mtbf-mttr-financial-calculator": "maintenance-reliability",

  // ── HSE, Ergonomics & Risk Cost ────────────────────────────────
  "noise-vibration-cost": "hse-ergonomics",

  // ── Procurement, Supply Chain & Logistics ──────────────────────
  "total-cost-of-ownership": "procurement-supply-chain",
  "supplier-performance-tco": "procurement-supply-chain",
  "eoq-inventory-calculator": "procurement-supply-chain",
  "inventory-turnover-risk": "procurement-supply-chain",
  "demand-forecast-inventory-cost": "procurement-supply-chain",
  "moq-inventory-balance-calculator": "procurement-supply-chain",
  "logistics-route-loss-calculator": "procurement-supply-chain",
  "transport-mode-cost-risk": "procurement-supply-chain",
  "supplier-currency-risk-calculator": "procurement-supply-chain",
  "warehouse-layout-optimizer": "procurement-supply-chain",
  "pallet-rack-optimizer": "procurement-supply-chain",
  "route-cost-calculator": "procurement-supply-chain",
  "fuel-route-drift-calculator": "procurement-supply-chain",
  "freight-cost-calculator": "procurement-supply-chain",
  "volumetric-weight-calculator": "procurement-supply-chain",
  "container-load-calculator": "procurement-supply-chain",
  "delivery-cost-calculator": "procurement-supply-chain",
  "route-optimization-analyzer": "procurement-supply-chain",

  // ── Workforce, Shift & HR Cost ────────────────────────────────
  "absenteeism-cost-calculator": "workforce-hr",
  "overtime-vs-hiring-breakeven": "workforce-hr",
  "total-employee-cost-calculator": "workforce-hr",
  "hourly-rate-calculator": "workforce-hr",
  "turnover-cost-calculator": "workforce-hr",
  "shift-cost-efficiency-calculator": "workforce-hr",

  // ── Finance, Sales & Working Capital ──────────────────────────
  "payment-term-optimizer": "finance-sales-working-capital",
  "currency-risk-calculator": "finance-sales-working-capital",
  "quote-risk-analyzer": "finance-sales-working-capital",
  "price-elasticity-simulator": "finance-sales-working-capital",
  "break-even-safety-margin": "finance-sales-working-capital",
  "subcontractor-margin-leak-detector": "finance-sales-working-capital",
  "roi-npv-calculator": "finance-sales-working-capital",
  "irr-calculator": "finance-sales-working-capital",
  "cash-flow-gap-calculator": "finance-sales-working-capital",
  "lease-vs-buy-comparator": "finance-sales-working-capital",
  "inflation-escalation-calculator": "finance-sales-working-capital",
  "clv-cac-calculator": "finance-sales-working-capital",
  "interest-rate-risk-calculator": "finance-sales-working-capital",
  "vehicle-depreciation-calculator": "finance-sales-working-capital",
  "material-replacement-cost-comparator": "finance-sales-working-capital",
  "cleaning-bid-optimizer": "finance-sales-working-capital",
  "signage-safe-price-tool": "finance-sales-working-capital",

  // ── Sustainability, Resources & ESG ───────────────────────────
  "energy-consumption-cost-report": "sustainability-resource-esg",
  "kwh-cost-calculator": "sustainability-resource-esg",
  "carbon-footprint-check": "sustainability-resource-esg",
  "cbam-exposure-check": "sustainability-resource-esg",
  "cbam-compliance-verdict": "sustainability-resource-esg",
  "product-carbon-footprint": "sustainability-resource-esg",
  "iso-50001-energy-baseline": "sustainability-resource-esg",
  "wind-turbine-roi-calculator": "sustainability-resource-esg",
  "renewable-energy-roi-calculator": "sustainability-resource-esg",
  "water-usage-optimizer": "sustainability-resource-esg",
  "environmental-waste-cost": "sustainability-resource-esg",
  "irrigation-cost-check": "sustainability-resource-esg",

  // ── Food, Cold Chain & Hygiene ────────────────────────────────
  "food-waste-margin-loss": "food-cold-chain-hygiene",
  "restaurant-menu-margin-leak": "food-cold-chain-hygiene",
  "portion-cost-calculator": "food-cold-chain-hygiene",
  "recipe-cost-check": "food-cold-chain-hygiene",
  "fertilizer-dosage-calculator": "food-cold-chain-hygiene",
  "seed-rate-calculator": "food-cold-chain-hygiene",
  "crop-yield-loss-analyzer": "food-cold-chain-hygiene",
  "feed-cost-estimator": "food-cold-chain-hygiene",
  "dairy-profit-detector": "food-cold-chain-hygiene",
  "haccp-deviation-cost": "food-cold-chain-hygiene",

  // ── Textile, Printing & Laboratory ────────────────────────────
  "fabric-cutting-optimizer": "textile-print-lab",
  "textile-waste-risk": "textile-print-lab",
  "dye-recipe-cost-optimizer": "textile-print-lab",
  "sewing-line-balancer": "textile-print-lab",

  // ── Electrical, Panel & Power Systems ─────────────────────────

  // ── Mechanical, HVAC & Energy Loss ────────────────────────────
  "welding-cost-calculator": "mechanical-hvac-energy-loss",
  "weld-volume-cost-calculator": "mechanical-hvac-energy-loss",
  "hydraulic-system-energy-loss": "mechanical-hvac-energy-loss",
  "compressor-leak-cost-calculator": "mechanical-hvac-energy-loss",
  "vacuum-leak-energy-loss-calculator": "mechanical-hvac-energy-loss",
  "hvac-capacity-optimizer": "mechanical-hvac-energy-loss",
  "compressor-energy-cost-calculator": "mechanical-hvac-energy-loss",
  "steam-trap-energy-loss": "mechanical-hvac-energy-loss",
  "heat-exchanger-fouling-loss": "mechanical-hvac-energy-loss",
  "compressor-tank-sizing-calculator": "mechanical-hvac-energy-loss",
  "fire-hydrant-flow-calculator": "mechanical-hvac-energy-loss",
  "weld-strength-calculator": "mechanical-hvac-energy-loss",

  // ── Packaging & Local Business Tools ──────────────────────────
  "office-supplies-cost-calculator": "packaging-local-business",
  "auto-repair-quote-consistency": "packaging-local-business",
  "auto-repair-comeback-cost": "packaging-local-business",
  "auto-repair-parts-labor-quote": "packaging-local-business",
  "auto-shop-margin-leak": "packaging-local-business",

  // ── Global Compliance, Trade & Tax ────────────────────────────
  "transfer-pricing-optimizer": "global-compliance-trade",
  "supply-chain-disruption-risk": "global-compliance-trade",

  // ── Technology, AI, Cloud & Cyber Risk ────────────────────────
  "cloud-api-overrun-cost": "technology-ai-cloud-cyber",
  "cloud-waste-elimination": "technology-ai-cloud-cyber",
  "saas-shelfware-cost": "technology-ai-cloud-cyber",
  "ai-compute-token-cost": "technology-ai-cloud-cyber",
};

/**
 * Get the premium category slug for a given tool slug.
 * @returns The premium category slug, or "lean-production" as default if unmapped.
 */
export function getPremiumCategorySlugForTool(
  toolSlug: string,
): PremiumCategorySlug {
  return PREMIUM_TOOL_CATEGORY_MAP[toolSlug] ?? "lean-production";
}

/**
 * Get all tool slugs assigned to a given premium category.
 */
export function getToolSlugsByPremiumCategory(
  categorySlug: PremiumCategorySlug,
): readonly string[] {
  return Object.entries(PREMIUM_TOOL_CATEGORY_MAP)
    .filter(([, cat]) => cat === categorySlug)
    .map(([slug]) => slug);
}

/**
 * Get a count per category for all mapped tools.
 */
export function getPremiumCategoryCounts(): Record<PremiumCategorySlug, number> {
  const counts: Record<string, number> = {};
  for (const cat of Object.values(PREMIUM_TOOL_CATEGORY_MAP)) {
    counts[cat] = (counts[cat] ?? 0) + 1;
  }
  return counts as Record<PremiumCategorySlug, number>;
}

/**
 * Number of mapped premium tools (for audit purposes).
 */
export const MAPPED_PREMIUM_TOOL_COUNT = Object.keys(PREMIUM_TOOL_CATEGORY_MAP).length;
