import type { FormulaFamilyId } from "@/lib/features/premium-schema/formula-families";

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

/** Controlled rollout map - legacy paidSlug → schema engine target. */
export const PREMIUM_MIGRATION_MAP: readonly PremiumMigrationMapItem[] = [
  {
    legacySlug: "cnc-quote-risk-analyzer",
    schemaSlug: "cnc-oee-loss",
    title: "CNC Audit Engine",
    family: "oee",
    sectorSlug: "cnc-manufacturing",
    status: "schema_pilot",
    risk: "low",
    migrationNote: "Batch 1 pilot - OEE, setup and scrap stack mapped from quote risk analyzer.",
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
      "Batch 1 pilot - legacy change-order slug maps to construction overrun schema (delay + budget drift).",
  },
  {
    legacySlug: "office-cleaning-bid-optimizer",
    schemaSlug: "warehouse-space-cost-leak",
    title: "Office Cleaning Bid Optimizer",
    family: "cost",
    sectorSlug: "cleaning",
    status: "schema_pilot",
    risk: "medium",
    migrationNote: "Batch 3 schema pilot.",
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
    schemaSlug: "cnc-tool-wear-cost",
    title: "Welding Bid Risk Analyzer",
    family: "cost",
    sectorSlug: "welding-fabrication",
    status: "schema_pilot",
    risk: "medium",
    migrationNote: "Batch 3 schema pilot.",
  },
  {
    legacySlug: "hvac-project-margin-guard",
    schemaSlug: "hvac-callback-margin-risk",
    title: "HVAC Project Margin Guard",
    family: "cost",
    sectorSlug: "hvac",
    status: "schema_pilot",
    risk: "medium",
    migrationNote: "Batch 3 schema pilot.",
  },
  {
    legacySlug: "panel-shop-margin-verdict",
    schemaSlug: "electrical-panel-rework-cost",
    title: "Panel Shop Margin Verdict",
    family: "cost",
    sectorSlug: "electrical-contracting",
    status: "schema_pilot",
    risk: "medium",
    migrationNote: "Batch 3 schema pilot.",
  },
  {
    legacySlug: "landscaping-contract-profit-tool",
    schemaSlug: "roofing-weather-delay-risk",
    title: "Landscaping Contract Profit Tool",
    family: "cost",
    sectorSlug: "landscaping-lawn-care",
    status: "schema_pilot",
    risk: "medium",
    migrationNote: "Batch 3 schema pilot.",
  },
  {
    legacySlug: "auto-shop-margin-leak-detector",
    schemaSlug: "auto-repair-comeback-cost",
    title: "Auto Shop Margin Leak Detector",
    family: "cost",
    sectorSlug: "auto-repair-shop",
    status: "schema_pilot",
    risk: "medium",
    migrationNote: "Batch 3 schema pilot.",
  },
  {
    legacySlug: "signage-bid-safe-price-tool",
    schemaSlug: "printing-reprint-margin-leak",
    title: "Signage Bid Safe Price Tool",
    family: "cost",
    sectorSlug: "printing-signage",
    status: "schema_pilot",
    risk: "medium",
    migrationNote: "Batch 3 schema pilot.",
  },
  {
    legacySlug: "plumbing-job-margin-verdict",
    schemaSlug: "plumbing-leak-callback-cost",
    title: "Plumbing Job Margin Verdict",
    family: "cost",
    sectorSlug: "plumbing",
    status: "schema_pilot",
    risk: "medium",
    migrationNote: "Batch 3 schema pilot.",
  },
  {
    legacySlug: "millwork-bid-risk-analyzer",
    schemaSlug: "textile-fabric-waste-risk",
    title: "Millwork Bid Risk Analyzer",
    family: "scrap",
    sectorSlug: "carpentry-millwork",
    status: "schema_pilot",
    risk: "medium",
    migrationNote: "Batch 3 schema pilot.",
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
    schemaSlug: "painting-rework-coverage-risk",
    title: "Painting Job Profit Verdict",
    family: "cost",
    sectorSlug: "painting",
    status: "schema_pilot",
    risk: "medium",
    migrationNote: "Batch 3 schema pilot.",
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
    schemaSlug: "calibration-drift-risk",
    title: "3D Print Job Margin Tool",
    family: "cost",
    sectorSlug: "3d-printing-service",
    status: "schema_pilot",
    risk: "medium",
    migrationNote: "Batch 3 schema pilot.",
  },
  {
    legacySlug: "route-optimization-analyzer",
    schemaSlug: "logistics-route-loss",
    title: "Route & Freight Loss Analyzer",
    family: "route",
    sectorSlug: "logistics-transport",
    status: "schema_pilot",
    risk: "low",
    migrationNote: "Batch 1 pilot - deadhead and freight cost stack live.",
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
    schemaSlug: "retail-inventory-turnover-risk",
    title: "Water Efficiency Verdict",
    family: "energy",
    sectorSlug: "agriculture-irrigation",
    status: "schema_pilot",
    risk: "high",
    migrationNote: "Batch 3 schema pilot.",
  },
  {
    legacySlug: "feed-efficiency-analyzer",
    schemaSlug: "dairy-feed-efficiency-loss",
    title: "Feed Efficiency Analyzer",
    family: "scrap",
    sectorSlug: "agriculture-feed",
    status: "schema_pilot",
    risk: "high",
    migrationNote: "Batch 3 schema pilot.",
  },
  {
    legacySlug: "dairy-profit-detector",
    schemaSlug: "dairy-feed-efficiency-loss",
    title: "Dairy Profit Detector",
    family: "cost",
    sectorSlug: "agriculture-dairy",
    status: "schema_pilot",
    risk: "high",
    migrationNote: "Batch 3 schema pilot.",
  },
  {
    legacySlug: "energy-efficiency-report",
    schemaSlug: "energy-peak-cost",
    title: "Energy Efficiency Report",
    family: "energy",
    sectorSlug: "energy-consumption",
    status: "schema_pilot",
    risk: "low",
    migrationNote: "Batch 1 pilot - peak kWh and excess consumption stack live.",
  },
  {
    legacySlug: "cbam-compliance-verdict",
    schemaSlug: "carbon-footprint-compliance-risk",
    title: "CBAM Compliance Verdict",
    family: "energy",
    sectorSlug: "energy-carbon",
    status: "schema_pilot",
    risk: "medium",
    migrationNote: "Batch 3 schema pilot.",
  },
  {
    legacySlug: "renovation-budget-optimizer",
    schemaSlug: "legal-interest-fee-calculator-pro",
    title: "Renovation Budget Optimizer",
    family: "cost",
    sectorSlug: "daily-renovation",
    status: "schema_pilot",
    risk: "medium",
    migrationNote: "Batch 3 schema pilot.",
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
    migrationNote: "Batch 2 schema pilot - food waste schema bridge from meal planning slug.",
  },
];

export function getMigrationMapItem(legacySlug: string): PremiumMigrationMapItem | null {
  return PREMIUM_MIGRATION_MAP.find((entry) => entry.legacySlug === legacySlug) ?? null;
}

export function listMigrationMapLegacySlugs(): readonly string[] {
  return PREMIUM_MIGRATION_MAP.map((entry) => entry.legacySlug);
}
