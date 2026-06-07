/**
 * Free Traffic Catalog v1 — high-volume calculator metadata (Omni-style library).
 * Premium formulas live elsewhere; this file is catalog + free-tier input schemas only.
 */

import catalogData from "@/lib/tools/free-traffic-catalog.generated.json";

export type FreeTrafficCategory =
  | "construction-measurement"
  | "finance-business"
  | "manufacturing-workshop"
  | "energy-carbon"
  | "logistics-travel"
  | "agriculture-food"
  | "everyday-life"
  | "math-statistics"
  | "conversion"
  | "health-body";

export type FreeTrafficInputType = "number" | "select";

export type FreeTrafficSelectOption = {
  readonly value: string;
  readonly label: string;
};

export type FreeTrafficToolInput = {
  readonly key: string;
  readonly label: string;
  readonly unit: string;
  readonly type: FreeTrafficInputType;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly defaultValue?: number | string;
  readonly helper: string;
  readonly options?: readonly FreeTrafficSelectOption[];
};

export type FreeTrafficResultType =
  | "quantity"
  | "cost"
  | "ratio"
  | "conversion"
  | "time"
  | "health"
  | "statistics";

export type FreeTrafficTool = {
  readonly slug: string;
  readonly title: string;
  readonly category: FreeTrafficCategory;
  readonly description: string;
  readonly seoTitle: string;
  readonly seoDescription: string;
  readonly inputs: readonly FreeTrafficToolInput[];
  readonly resultType: FreeTrafficResultType;
  readonly relatedPremiumSlug?: string;
  readonly relatedIndustrySlug?: string;
  readonly missingFactors: readonly string[];
};

export const ACTIVE_TRAFFIC_CALCULATOR_SLUGS: ReadonlySet<string> = new Set([
  "square-meter-calculator",
  "square-footage-calculator",
  "concrete-volume-calculator",
  "paint-coverage-calculator",
  "loan-payment-calculator",
  "mortgage-calculator",
  "interest-calculator",
  "vat-calculator",
  "percentage-calculator",
  "profit-margin-calculator",
  "break-even-calculator",
  "machine-time-calculator",
  "welding-cost-estimator",
  "laser-cutting-time-check",
  "3d-print-cost-check",
  "kwh-cost-calculator",
  "fuel-consumption-calculator",
  "desi-calculator",
  "fertilizer-dosage-calculator",
  "recipe-cost-check",
  "bmi-calculator",
  "calorie-calculator",
  "average-calculator",
  "standard-deviation-calculator",
  "unit-price-calculator",
]);

export const FREE_TRAFFIC_TOOLS: readonly FreeTrafficTool[] =
  catalogData as FreeTrafficTool[];

export const FREE_TRAFFIC_CATEGORIES: readonly FreeTrafficCategory[] = [
  "construction-measurement",
  "finance-business",
  "manufacturing-workshop",
  "energy-carbon",
  "logistics-travel",
  "agriculture-food",
  "everyday-life",
  "math-statistics",
  "conversion",
  "health-body",
] as const;

export const FEATURED_TRAFFIC_SLUGS: readonly string[] = [
  "mortgage-calculator",
  "bmi-calculator",
  "calorie-calculator",
  "concrete-volume-calculator",
  "percentage-calculator",
  "machine-time-calculator",
  "fuel-consumption-calculator",
  "kwh-cost-calculator",
] as const;

export function getFreeTrafficToolBySlug(slug: string): FreeTrafficTool | undefined {
  return FREE_TRAFFIC_TOOLS.find((tool) => tool.slug === slug);
}

export function listFreeTrafficToolsByCategory(
  category: FreeTrafficCategory,
): readonly FreeTrafficTool[] {
  return FREE_TRAFFIC_TOOLS.filter((tool) => tool.category === category);
}

export function isActiveTrafficCalculator(slug: string): boolean {
  return ACTIVE_TRAFFIC_CALCULATOR_SLUGS.has(slug);
}

export function listFreeTrafficSlugs(): string[] {
  return FREE_TRAFFIC_TOOLS.map((tool) => tool.slug);
}

export function getFreeTrafficCategoryLabelKey(
  category: FreeTrafficCategory,
): string {
  return `categories.${category}`;
}
