/**
 * Sector registry - single declarative source for Manufacturing OS metrics.
 * Add a sector entry here; engine + UI read from this map (no scattered edits).
 */

import type { IndustrySlug } from "@/lib/features/tools/industry-registry";

export type VarianceType = "linear" | "percentage" | "exponential";

export type MetricUnit =
 | "seconds"
 | "minutes"
 | "hours"
 | "kg"
 | "liters"
 | "kwh"
 | "tco2e"
 | "sqft"
 | "percent"
 | "currency"
 | "unit";

export interface SectorConfig {
 id: string;
 name: string;
 metrics: {
 target: string;
 actual: string;
 unit: MetricUnit;
 };
 formulas: {
 varianceType: VarianceType;
 };
}

const sectorRegistryList: readonly (SectorConfig & { registryKey: IndustrySlug })[] = [
 {
 registryKey: "cnc-manufacturing",
 id: "cnc",
 name: "CNC Manufacturing",
 metrics: { target: "CycleTime", actual: "MeasuredTime", unit: "seconds" },
 formulas: { varianceType: "percentage" },
 },
 {
 registryKey: "construction",
 id: "construction",
 name: "Construction",
 metrics: { target: "PlannedCost", actual: "ActualCost", unit: "currency" },
 formulas: { varianceType: "percentage" },
 },
 {
 registryKey: "cleaning",
 id: "cleaning",
 name: "Cleaning",
 metrics: { target: "PlannedHours", actual: "ActualHours", unit: "hours" },
 formulas: { varianceType: "percentage" },
 },
 {
 registryKey: "restaurant",
 id: "restaurant",
 name: "Restaurant",
 metrics: { target: "TargetFoodCostPct", actual: "ActualFoodCostPct", unit: "percent" },
 formulas: { varianceType: "percentage" },
 },
 {
 registryKey: "ecommerce",
 id: "ecommerce",
 name: "E-commerce",
 metrics: { target: "TargetMarginPct", actual: "ActualMarginPct", unit: "percent" },
 formulas: { varianceType: "percentage" },
 },
 {
 registryKey: "welding-fabrication",
 id: "welding",
 name: "Welding & Fabrication",
 metrics: { target: "EstimatedHours", actual: "ActualHours", unit: "hours" },
 formulas: { varianceType: "percentage" },
 },
 {
 registryKey: "hvac",
 id: "hvac",
 name: "HVAC",
 metrics: { target: "PlannedInstallCost", actual: "ActualInstallCost", unit: "currency" },
 formulas: { varianceType: "percentage" },
 },
 {
 registryKey: "electrical-contracting",
 id: "electrical",
 name: "Electrical Contracting",
 metrics: { target: "BidLaborHours", actual: "ActualLaborHours", unit: "hours" },
 formulas: { varianceType: "percentage" },
 },
 {
 registryKey: "landscaping-lawn-care",
 id: "landscaping",
 name: "Landscaping & Lawn Care",
 metrics: { target: "RouteHours", actual: "ActualRouteHours", unit: "hours" },
 formulas: { varianceType: "percentage" },
 },
 {
 registryKey: "auto-repair-shop",
 id: "auto-repair",
 name: "Auto Repair Shop",
 metrics: { target: "QuotedLaborHours", actual: "ActualLaborHours", unit: "hours" },
 formulas: { varianceType: "percentage" },
 },
 {
 registryKey: "printing-signage",
 id: "printing",
 name: "Printing & Signage",
 metrics: { target: "EstJobCost", actual: "ActualJobCost", unit: "currency" },
 formulas: { varianceType: "percentage" },
 },
 {
 registryKey: "plumbing",
 id: "plumbing",
 name: "Plumbing",
 metrics: { target: "JobEstimate", actual: "JobActual", unit: "currency" },
 formulas: { varianceType: "percentage" },
 },
 {
 registryKey: "carpentry-millwork",
 id: "millwork",
 name: "Carpentry & Millwork",
 metrics: { target: "EstMaterialCost", actual: "ActualMaterialCost", unit: "currency" },
 formulas: { varianceType: "percentage" },
 },
 {
 registryKey: "roofing",
 id: "roofing",
 name: "Roofing",
 metrics: { target: "BidPerSquare", actual: "ActualPerSquare", unit: "currency" },
 formulas: { varianceType: "percentage" },
 },
 {
 registryKey: "painting",
 id: "painting",
 name: "Painting",
 metrics: { target: "CoverageTarget", actual: "CoverageActual", unit: "sqft" },
 formulas: { varianceType: "linear" },
 },
 {
 registryKey: "sheet-metal",
 id: "sheet-metal",
 name: "Sheet Metal",
 metrics: { target: "NestCycleTime", actual: "MeasuredCycleTime", unit: "seconds" },
 formulas: { varianceType: "percentage" },
 },
 {
 registryKey: "3d-printing-service",
 id: "3d-print",
 name: "3D Printing Service",
 metrics: { target: "PrintTime", actual: "ActualPrintTime", unit: "hours" },
 formulas: { varianceType: "percentage" },
 },
 {
 registryKey: "logistics-transport",
 id: "logistics",
 name: "Logistics & Transport",
 metrics: { target: "PlannedFreightCost", actual: "ActualFreightCost", unit: "currency" },
 formulas: { varianceType: "percentage" },
 },
 {
 registryKey: "agriculture-crops",
 id: "ag-crops",
 name: "Crop & Fertilizer",
 metrics: { target: "TargetYield", actual: "ActualYield", unit: "kg" },
 formulas: { varianceType: "percentage" },
 },
 {
 registryKey: "agriculture-irrigation",
 id: "ag-irrigation",
 name: "Irrigation & Water",
 metrics: { target: "PlannedWaterUse", actual: "ActualWaterUse", unit: "liters" },
 formulas: { varianceType: "linear" },
 },
 {
 registryKey: "agriculture-feed",
 id: "ag-feed",
 name: "Livestock Feed",
 metrics: { target: "FeedBudget", actual: "FeedActual", unit: "kg" },
 formulas: { varianceType: "percentage" },
 },
 {
 registryKey: "agriculture-dairy",
 id: "ag-dairy",
 name: "Dairy & Milk Yield",
 metrics: { target: "TargetMilkYield", actual: "ActualMilkYield", unit: "liters" },
 formulas: { varianceType: "percentage" },
 },
 {
 registryKey: "energy-consumption",
 id: "energy",
 name: "Energy Consumption",
 metrics: { target: "TargetKwh", actual: "ActualKwh", unit: "kwh" },
 formulas: { varianceType: "linear" },
 },
 {
 registryKey: "energy-carbon",
 id: "carbon",
 name: "Carbon & CBAM",
 metrics: { target: "TargetEmissions", actual: "ActualEmissions", unit: "tco2e" },
 formulas: { varianceType: "percentage" },
 },
 {
 registryKey: "daily-renovation",
 id: "renovation",
 name: "Home Renovation",
 metrics: { target: "BudgetPerSqm", actual: "ActualPerSqm", unit: "currency" },
 formulas: { varianceType: "percentage" },
 },
 {
 registryKey: "daily-fuel",
 id: "fuel",
 name: "Fuel & Travel",
 metrics: { target: "PlannedConsumption", actual: "ActualConsumption", unit: "liters" },
 formulas: { varianceType: "linear" },
 },
 {
 registryKey: "daily-meals",
 id: "meals",
 name: "Meals & Grocery",
 metrics: { target: "RecipeBudget", actual: "ActualSpend", unit: "currency" },
 formulas: { varianceType: "percentage" },
 },
] as const;

export type SectorRegistryKey = IndustrySlug;

export const SectorRegistry: Record<SectorRegistryKey, SectorConfig> =
 sectorRegistryList.reduce(
 (acc, entry) => {
 const { registryKey, ...config } = entry;
 acc[registryKey] = config;
 return acc;
 },
 {} as Record<SectorRegistryKey, SectorConfig>
 );

export function getSectorConfig(key: SectorRegistryKey): SectorConfig {
 return SectorRegistry[key];
}

export function listSectorRegistryKeys(): SectorRegistryKey[] {
 return sectorRegistryList.map((entry) => entry.registryKey);
}

export function getSectorConfigByShortId(shortId: string): SectorConfig | null {
 const match = sectorRegistryList.find((entry) => entry.id === shortId);
 if (!match) {
 return null;
 }
 const { registryKey: _key, ...config } = match;
 return config;
}

/** Example textile module - enable when industry ships (not in 27-slug launch set). */
export const TEXTILE_WASTE_SECTOR_CONFIG: SectorConfig = {
 id: "textile",
 name: "Textile Efficiency",
 metrics: {
 target: "IdealConsumption",
 actual: "ActualConsumption",
 unit: "kg",
 },
 formulas: { varianceType: "percentage" },
};
