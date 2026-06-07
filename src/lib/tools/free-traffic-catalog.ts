/**
 * Free Traffic Catalog — 100 active browser-side calculators (Omni-style library).
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

export type FreeTrafficInput = {
  readonly key: string;
  readonly label: string;
  readonly unit: string;
  readonly type: "number" | "select";
  readonly options?: readonly { readonly label: string; readonly value: string }[];
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly defaultValue?: number | string;
  readonly helper: string;
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
  readonly inputs: readonly FreeTrafficInput[];
  readonly resultType: FreeTrafficResultType;
  readonly relatedPremiumSlug?: string;
  readonly relatedIndustrySlug?: string;
  readonly missingFactors: readonly string[];
};

/** @deprecated All catalog tools are active; kept for backward compatibility */
export type FreeTrafficToolInput = FreeTrafficInput;

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
  "area-converter",
  "mortgage-calculator",
  "concrete-volume-calculator",
  "percentage-calculator",
  "machine-time-calculator",
  "fuel-consumption-calculator",
  "kwh-cost-calculator",
  "length-converter",
] as const;

export function getFreeTrafficToolBySlug(slug: string): FreeTrafficTool | undefined {
  return FREE_TRAFFIC_TOOLS.find((tool) => tool.slug === slug);
}

export function listFreeTrafficToolsByCategory(
  category: FreeTrafficCategory,
): readonly FreeTrafficTool[] {
  return FREE_TRAFFIC_TOOLS.filter((tool) => tool.category === category);
}

export function listRelatedTrafficTools(
  tool: FreeTrafficTool,
  limit = 6,
): readonly FreeTrafficTool[] {
  return FREE_TRAFFIC_TOOLS.filter(
    (candidate) => candidate.category === tool.category && candidate.slug !== tool.slug,
  ).slice(0, limit);
}

export function listFreeTrafficSlugs(): string[] {
  return FREE_TRAFFIC_TOOLS.map((t) => t.slug);
}

export function getFreeTrafficCategoryLabelKey(category: FreeTrafficCategory): string {
  return `categories.${category}`;
}
