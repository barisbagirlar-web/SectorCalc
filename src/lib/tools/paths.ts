import type { ToolSlug, ToolTier } from "@/data/tools";

export function getToolHref(tier: ToolTier, slug: ToolSlug): string {
  return `/tools/${tier}/${slug}`;
}

export function parseToolRoute(
  tier: string,
  slug: string
): { tier: ToolTier; slug: ToolSlug } | null {
  if (tier !== "free" && tier !== "premium") return null;
  return { tier, slug: slug as ToolSlug };
}
