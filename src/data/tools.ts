import { getToolHref } from "@/lib/tools/paths";
import { REVENUE_TOOL_PRODUCT_SPECS } from "@/lib/tools/revenue-tools";

export type ToolTier = "free" | "premium";

export type ToolSlug =
  | "project-cost-estimator"
  | "cleaning-cost-estimator"
  | "food-cost-calculator"
  | "product-margin-calculator"
  | "machine-hour-estimator"
  | "change-order-impact-analyzer"
  | "office-cleaning-bid-optimizer"
  | "menu-profit-leak-detector"
  | "return-rate-profit-erosion-tool"
  | "cnc-minimum-safe-quote-analyzer";

export interface Tool {
  slug: ToolSlug;
  name: string;
  shortDescription: string;
  description: string;
  tier: ToolTier;
  industrySlug: string;
  href: string;
  comingSoon?: boolean;
}

export const FREE_TOOLS: Tool[] = REVENUE_TOOL_PRODUCT_SPECS.map((spec) => ({
  slug: spec.freeSlug,
  name: spec.freeTitle,
  shortDescription: spec.freeValue,
  description: spec.painStatement,
  tier: "free" as const,
  industrySlug: spec.sector,
  href: getToolHref("free", spec.freeSlug),
}));

export const PREMIUM_TOOLS: Tool[] = REVENUE_TOOL_PRODUCT_SPECS.map((spec) => ({
  slug: spec.paidSlug,
  name: spec.paidTitle,
  shortDescription: spec.paidValue,
  description: spec.paidValue,
  tier: "premium" as const,
  industrySlug: spec.sector,
  href: getToolHref("premium", spec.paidSlug),
}));

export const ALL_TOOLS: Tool[] = [...FREE_TOOLS, ...PREMIUM_TOOLS];

export function getToolBySlug(slug: ToolSlug): Tool | undefined {
  return ALL_TOOLS.find((t) => t.slug === slug);
}

export function getToolsByIndustry(industrySlug: string): Tool[] {
  return ALL_TOOLS.filter((t) => t.industrySlug === industrySlug);
}

export function getFreeToolsByIndustry(industrySlug: string): Tool[] {
  return FREE_TOOLS.filter((t) => t.industrySlug === industrySlug);
}

export function getPremiumToolsByIndustry(industrySlug: string): Tool[] {
  return PREMIUM_TOOLS.filter((t) => t.industrySlug === industrySlug);
}

const FREE_TO_PAID_SLUG = Object.fromEntries(
  REVENUE_TOOL_PRODUCT_SPECS.map((spec) => [spec.freeSlug, spec.paidSlug])
) as Partial<Record<ToolSlug, ToolSlug>>;

export function getMatchingPremiumTool(freeSlug: ToolSlug): Tool | undefined {
  const paidSlug = FREE_TO_PAID_SLUG[freeSlug];
  if (!paidSlug) return undefined;
  return getToolBySlug(paidSlug);
}
