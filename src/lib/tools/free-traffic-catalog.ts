/**
 * Free traffic catalog — canonical free-slugs.json only (regeneration baseline).
 */

import {
  CANONICAL_FREE_SLUGS,
  CANONICAL_TRAFFIC_FREE_SLUGS,
  humanizeCanonicalSlug,
} from "@/lib/tools/canonical-tool-slugs";

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

function inferTrafficCategory(slug: string): FreeTrafficCategory {
  if (/mortgage|loan|tax|margin|roi|npv|apy|salary|discount|interest|break-even|compound/.test(slug)) {
    return "finance-business";
  }
  if (/concrete|beam|pipe|reynolds|wind|voltage|thermal|deflection|flow/.test(slug)) {
    return "construction-measurement";
  }
  if (/carbon|kwh|energy|ohms|hp-to|psi-to/.test(slug)) {
    return "energy-carbon";
  }
  if (/mpg|liter|gallon|kg-to|lbs-to|cm-to|mm-to|sqft|celsius|converter/.test(slug)) {
    return "conversion";
  }
  if (/bmi|bmr|tdee|calorie|body-fat|ovulation|pregnancy|sleep|water-intake/.test(slug)) {
    return "health-body";
  }
  if (/percent|fraction|lcm|quadratic|probability|z-score|logarithm|vector|scientific|standard-deviation/.test(slug)) {
    return "math-statistics";
  }
  return "everyday-life";
}

function buildCatalogEntry(slug: string): FreeTrafficTool {
  const title = humanizeCanonicalSlug(slug);
  return {
    slug,
    title,
    category: inferTrafficCategory(slug),
    description: "",
    seoTitle: title,
    seoDescription: "",
    inputs: [],
    resultType: "quantity",
    missingFactors: [],
  };
}

export const FREE_TRAFFIC_TOOLS: readonly FreeTrafficTool[] = CANONICAL_FREE_SLUGS.map(buildCatalogEntry);

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
  "margin-calculator",
  "mortgage-calculator",
  "concrete-volume-calculator",
  "percentage-calculator",
  "compound-interest-calculator",
  "carbon-footprint-calculator",
  "kwh-cost-calculator",
  "cm-to-inches-converter",
].filter((slug) => CANONICAL_FREE_SLUGS.includes(slug));

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

export function listTrafficOnlyFreeSlugs(): readonly string[] {
  return [...CANONICAL_TRAFFIC_FREE_SLUGS];
}

export function listPublicFreeTrafficTools(): readonly FreeTrafficTool[] {
  return FREE_TRAFFIC_TOOLS;
}

export function getFreeTrafficCategoryLabelKey(category: FreeTrafficCategory): string {
  return `categories.${category}`;
}
