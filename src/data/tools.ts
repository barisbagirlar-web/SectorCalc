import { getToolHref } from "@/lib/tools/paths";
import { REVENUE_TOOL_PAIRS } from "@/lib/tools/revenue-tools";

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

export const FREE_TOOLS: Tool[] = REVENUE_TOOL_PAIRS.map((pair) => ({
  slug: pair.freeSlug,
  name: pair.freeTitle,
  shortDescription: pair.freeRiskHint,
  description: pair.painStatement,
  tier: "free" as const,
  industrySlug: pair.sector,
  href: getToolHref("free", pair.freeSlug),
}));

export const PREMIUM_TOOLS: Tool[] = REVENUE_TOOL_PAIRS.map((pair) => ({
  slug: pair.premiumSlug,
  name: pair.premiumTitle,
  shortDescription: pair.paidValueStatement,
  description: pair.paidValueStatement,
  tier: "premium" as const,
  industrySlug: pair.sector,
  href: getToolHref("premium", pair.premiumSlug),
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

const FREE_TO_PREMIUM_SLUG: Partial<Record<ToolSlug, ToolSlug>> = {
  "project-cost-estimator": "change-order-impact-analyzer",
  "cleaning-cost-estimator": "office-cleaning-bid-optimizer",
  "food-cost-calculator": "menu-profit-leak-detector",
  "product-margin-calculator": "return-rate-profit-erosion-tool",
  "machine-hour-estimator": "cnc-minimum-safe-quote-analyzer",
};

export function getMatchingPremiumTool(freeSlug: ToolSlug): Tool | undefined {
  const premiumSlug = FREE_TO_PREMIUM_SLUG[freeSlug];
  if (!premiumSlug) return undefined;
  return getToolBySlug(premiumSlug);
}
