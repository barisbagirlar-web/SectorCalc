import type { FormulaFamilyId } from "@/lib/premium-schema/formula-families";

export type PremiumMigrationStatus =
  | "legacy"
  | "schema_ready"
  | "schema_pilot"
  | "migrated"
  | "blocked";

export type PremiumMigrationRisk = "low" | "medium" | "high";

export interface PremiumMigrationMapItem {
  readonly legacySlug: string;
  readonly schemaSlug?: string;
  readonly title: string;
  readonly family: FormulaFamilyId;
  readonly sectorSlug: string;
  readonly status: PremiumMigrationStatus;
  readonly risk: PremiumMigrationRisk;
  readonly migrationNote: string;
}

/** Controlled rollout map — legacy paidSlug → schema engine target. */
export const PREMIUM_MIGRATION_MAP: readonly PremiumMigrationMapItem[] = [
  {
    legacySlug: "cnc-quote-risk-analyzer",
    schemaSlug: "cnc-oee-loss",
    title: "CNC Audit Engine",
    family: "oee",
    sectorSlug: "cnc-manufacturing",
    status: "schema_pilot",
    risk: "low",
    migrationNote: "Batch 1 pilot — OEE, setup and scrap stack mapped from quote risk analyzer.",
  },
  {
    legacySlug: "change-order-impact-analyzer",
    schemaSlug: "construction-project-overrun",
    title: "Change Order Impact Analyzer",
    family: "time",
    sectorSlug: "construction",
    status: "schema_pilot",
    risk: "low",
    migrationNote:
      "Batch 1 pilot — legacy change-order slug maps to construction overrun schema (delay + budget drift).",
  },
  {
    legacySlug: "office-cleaning-bid-optimizer",
    title: "Office Cleaning Bid Optimizer",
    family: "cost",
    sectorSlug: "cleaning",
    status: "legacy",
    risk: "medium",
    migrationNote: "Awaiting cost.margin + time.labor_cost schema template.",
  },
  {
    legacySlug: "menu-profit-leak-detector",
    schemaSlug: "restaurant-menu-margin-leak",
    title: "Menu Profit Leak Detector",
    family: "cost",
    sectorSlug: "restaurant",
    status: "schema_pilot",
    risk: "medium",
    migrationNote: "Batch 2 schema pilot.",
  },
  {
    legacySlug: "return-profit-erosion-tool",
    schemaSlug: "cloud-api-cost-overrun",
    title: "Return Profit Erosion Tool",
    family: "cost",
    sectorSlug: "ecommerce",
    status: "schema_pilot",
    risk: "medium",
    migrationNote: "Batch 2 schema pilot.",
  },
  {
    legacySlug: "welding-bid-risk-analyzer",
    title: "Welding Bid Risk Analyzer",
    family: "cost",
    sectorSlug: "welding-fabrication",
    status: "legacy",
    risk: "medium",
    migrationNote: "Similar to CNC quote risk — candidate for scrap + time batch 2.",
  },
  {
    legacySlug: "hvac-project-margin-guard",
    title: "HVAC Project Margin Guard",
    family: "cost",
    sectorSlug: "hvac",
    status: "legacy",
    risk: "medium",
    migrationNote: "Project margin guard — shares construction overrun patterns.",
  },
  {
    legacySlug: "panel-shop-margin-verdict",
    title: "Panel Shop Margin Verdict",
    family: "cost",
    sectorSlug: "electrical-contracting",
    status: "legacy",
    risk: "medium",
    migrationNote: "Electrical panel bidding — cost.minimum_safe_price candidate.",
  },
  {
    legacySlug: "landscaping-contract-profit-tool",
    title: "Landscaping Contract Profit Tool",
    family: "cost",
    sectorSlug: "landscaping-lawn-care",
    status: "legacy",
    risk: "medium",
    migrationNote: "Seasonal labor + material overrun schema needed.",
  },
  {
    legacySlug: "auto-shop-margin-leak-detector",
    title: "Auto Shop Margin Leak Detector",
    family: "cost",
    sectorSlug: "auto-repair-shop",
    status: "legacy",
    risk: "medium",
    migrationNote: "Labor leak + parts margin — time + scrap family.",
  },
  {
    legacySlug: "signage-bid-safe-price-tool",
    title: "Signage Bid Safe Price Tool",
    family: "cost",
    sectorSlug: "printing-signage",
    status: "legacy",
    risk: "medium",
    migrationNote: "Bid safe price — cost.minimum_safe_price pipeline.",
  },
  {
    legacySlug: "plumbing-job-margin-verdict",
    title: "Plumbing Job Margin Verdict",
    family: "cost",
    sectorSlug: "plumbing",
    status: "legacy",
    risk: "medium",
    migrationNote: "Service job margin — time.labor_cost + cost stack.",
  },
  {
    legacySlug: "millwork-bid-risk-analyzer",
    title: "Millwork Bid Risk Analyzer",
    family: "scrap",
    sectorSlug: "carpentry-millwork",
    status: "legacy",
    risk: "medium",
    migrationNote: "Material waste + rework — scrap family extension.",
  },
  {
    legacySlug: "roofing-contract-margin-guard",
    schemaSlug: "construction-subcontractor-margin-leak",
    title: "Roofing Contract Margin Guard",
    family: "cost",
    sectorSlug: "roofing",
    status: "schema_pilot",
    risk: "medium",
    migrationNote: "Batch 2 schema pilot.",
  },
  {
    legacySlug: "painting-job-profit-verdict",
    title: "Painting Job Profit Verdict",
    family: "cost",
    sectorSlug: "painting",
    status: "legacy",
    risk: "medium",
    migrationNote: "Labor hours + material coverage schema pending.",
  },
  {
    legacySlug: "sheet-metal-quote-risk-tool",
    schemaSlug: "sheet-metal-scrap-risk",
    title: "Sheet Metal Quote Risk Tool",
    family: "scrap",
    sectorSlug: "sheet-metal",
    status: "schema_pilot",
    risk: "medium",
    migrationNote: "Batch 2 schema pilot.",
  },
  {
    legacySlug: "3d-print-job-margin-tool",
    title: "3D Print Job Margin Tool",
    family: "cost",
    sectorSlug: "3d-printing-service",
    status: "legacy",
    risk: "medium",
    migrationNote: "Machine time + material waste — oee + scrap hybrid.",
  },
  {
    legacySlug: "route-optimization-analyzer",
    schemaSlug: "logistics-route-loss",
    title: "Route & Freight Loss Analyzer",
    family: "route",
    sectorSlug: "logistics-transport",
    status: "schema_pilot",
    risk: "low",
    migrationNote: "Batch 1 pilot — deadhead and freight cost stack live.",
  },
  {
    legacySlug: "crop-yield-loss-analyzer",
    schemaSlug: "agriculture-irrigation-yield-loss",
    title: "Crop Yield Loss Analyzer",
    family: "benchmark",
    sectorSlug: "agriculture-crops",
    status: "schema_pilot",
    risk: "medium",
    migrationNote: "Batch 2 schema pilot.",
  },
  {
    legacySlug: "water-optimization-verdict",
    title: "Water Efficiency Verdict",
    family: "energy",
    sectorSlug: "agriculture-irrigation",
    status: "legacy",
    risk: "high",
    migrationNote: "Irrigation kWh/water volume — energy family extension.",
  },
  {
    legacySlug: "feed-efficiency-analyzer",
    title: "Feed Efficiency Analyzer",
    family: "scrap",
    sectorSlug: "agriculture-feed",
    status: "legacy",
    risk: "high",
    migrationNote: "Feed conversion ratio — benchmark family candidate.",
  },
  {
    legacySlug: "dairy-profit-detector",
    title: "Dairy Profit Detector",
    family: "cost",
    sectorSlug: "agriculture-dairy",
    status: "legacy",
    risk: "high",
    migrationNote: "Multi-factor dairy margin — blocked until batch 3 agriculture pack.",
  },
  {
    legacySlug: "energy-efficiency-report",
    schemaSlug: "energy-peak-cost",
    title: "Energy Efficiency Report",
    family: "energy",
    sectorSlug: "energy-consumption",
    status: "schema_pilot",
    risk: "low",
    migrationNote: "Batch 1 pilot — peak kWh and excess consumption stack live.",
  },
  {
    legacySlug: "cbam-compliance-verdict",
    schemaSlug: "energy-compressor-leak-cost",
    title: "CBAM Compliance Verdict",
    family: "energy",
    sectorSlug: "energy-carbon",
    status: "schema_pilot",
    risk: "medium",
    migrationNote: "Batch 2 schema pilot.",
  },
  {
    legacySlug: "renovation-budget-optimizer",
    title: "Renovation Budget Optimizer",
    family: "cost",
    sectorSlug: "daily-renovation",
    status: "legacy",
    risk: "medium",
    migrationNote: "Consumer renovation — shares construction overrun patterns at smaller scale.",
  },
  {
    legacySlug: "trip-budget-optimizer",
    schemaSlug: "logistics-fuel-route-drift",
    title: "Trip Budget Optimizer",
    family: "route",
    sectorSlug: "daily-fuel",
    status: "schema_pilot",
    risk: "medium",
    migrationNote: "Batch 2 schema pilot.",
  },
  {
    legacySlug: "meal-planning-verdict",
    schemaSlug: "food-waste-margin-loss",
    title: "Weekly Meal Planning Verdict",
    family: "cost",
    sectorSlug: "daily-meals",
    status: "schema_pilot",
    risk: "medium",
    migrationNote: "Batch 2 schema pilot — food waste schema bridge from meal planning slug.",
  },
];

export function getMigrationMapItem(legacySlug: string): PremiumMigrationMapItem | null {
  return PREMIUM_MIGRATION_MAP.find((entry) => entry.legacySlug === legacySlug) ?? null;
}

export function listMigrationMapLegacySlugs(): readonly string[] {
  return PREMIUM_MIGRATION_MAP.map((entry) => entry.legacySlug);
}
