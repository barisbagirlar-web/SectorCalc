import type { FreeTrafficCategory, FreeTrafficTool } from "./types";
import { FINANCE_BUSINESS_TOOLS } from "./finance-business";
import { MANUFACTURING_WORKSHOP_TOOLS } from "./manufacturing-workshop";
import { LOGISTICS_TRAVEL_TOOLS } from "./logistics-travel";
import { HEALTH_BODY_TOOLS } from "./health-body";
import { MATH_STATISTICS_TOOLS } from "./math-statistics";

export const FREE_TRAFFIC_TOOLS: readonly FreeTrafficTool[] = [
  ...FINANCE_BUSINESS_TOOLS,
  ...MANUFACTURING_WORKSHOP_TOOLS,
  ...LOGISTICS_TRAVEL_TOOLS,
  ...HEALTH_BODY_TOOLS,
  ...MATH_STATISTICS_TOOLS,
];

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
  "rental-yield-one-percent-rule",
  "mortgage-monthly-payment",
  "budget-rule-50-30-20",
  "cagr-growth-rate",
  "overall-equipment-effectiveness-oee",
  "body-mass-index-bmi",
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

export function listPublicFreeTrafficTools(): readonly FreeTrafficTool[] {
  return FREE_TRAFFIC_TOOLS;
}

export function getFreeTrafficCategoryLabelKey(category: FreeTrafficCategory): string {
  return `categories.${category}`;
}
