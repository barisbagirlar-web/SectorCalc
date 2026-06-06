import { getToolHref } from "@/lib/tools/paths";
import { revenueToolRegistry } from "@/lib/tools/revenue-tools";

export type ToolTier = "free" | "premium";

export type ToolSlug = string;

export interface Tool {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  tier: ToolTier;
  industrySlug: string;
  href: string;
}

export const FREE_TOOLS: Tool[] = revenueToolRegistry.tools.map((tool) => ({
  slug: tool.freeSlug,
  name: tool.freeTitle,
  shortDescription: tool.freeValue,
  description: tool.painStatement,
  tier: "free" as const,
  industrySlug: tool.sector,
  href: getToolHref("free", tool.freeSlug),
}));

export const PREMIUM_TOOLS: Tool[] = revenueToolRegistry.tools.map((tool) => ({
  slug: tool.paidSlug,
  name: tool.paidTitle,
  shortDescription: tool.paidValue,
  description: tool.paidValue,
  tier: "premium" as const,
  industrySlug: tool.sector,
  href: getToolHref("premium", tool.paidSlug),
}));

export const ALL_TOOLS: Tool[] = [...FREE_TOOLS, ...PREMIUM_TOOLS];

export function getToolBySlug(slug: string): Tool | undefined {
  return ALL_TOOLS.find((tool) => tool.slug === slug);
}

export function getToolsByIndustry(industrySlug: string): Tool[] {
  return ALL_TOOLS.filter((tool) => tool.industrySlug === industrySlug);
}

export function getFreeToolsByIndustry(industrySlug: string): Tool[] {
  return FREE_TOOLS.filter((tool) => tool.industrySlug === industrySlug);
}

export function getPremiumToolsByIndustry(industrySlug: string): Tool[] {
  return PREMIUM_TOOLS.filter((tool) => tool.industrySlug === industrySlug);
}

const FREE_TO_PAID_SLUG = Object.fromEntries(
  revenueToolRegistry.tools.map((tool) => [tool.freeSlug, tool.paidSlug])
);

export function getMatchingPremiumTool(freeSlug: string): Tool | undefined {
  const paidSlug = FREE_TO_PAID_SLUG[freeSlug];
  if (!paidSlug) {
    return undefined;
  }
  return getToolBySlug(paidSlug);
}
