/**
 * Tier-1 SEO content refresh priority list for featured snippets and internal linking.
 */

export type SeoRefreshPageType = "seo_landing" | "guide" | "free_tool" | "premium_analyzer";

export type SeoRefreshPriority = "tier_1" | "tier_2" | "tier_3";

export type SeoRefreshGoal =
  | "featured_snippet"
  | "internal_linking"
  | "conversion"
  | "faq_expansion"
  | "metadata";

export type SeoRefreshPriorityItem = {
  readonly path: string;
  readonly type: SeoRefreshPageType;
  readonly priority: SeoRefreshPriority;
  readonly targetQuery: string;
  readonly refreshGoal: SeoRefreshGoal;
};

export const SEO_REFRESH_PRIORITY: readonly SeoRefreshPriorityItem[] = [];

export type TierOneSeoMetadataOverride = {
  readonly metaTitle: string;
  readonly metaDescription: string;
};

const TIER_ONE_FREE_TOOL_METADATA: Record<string, TierOneSeoMetadataOverride> = {};

const TIER_ONE_PREMIUM_METADATA: Record<string, TierOneSeoMetadataOverride> = {};

export function getTierOneRefreshItems(): readonly SeoRefreshPriorityItem[] {
  return SEO_REFRESH_PRIORITY.filter((item) => item.priority === "tier_1");
}

export function getTierOneFreeToolMetadata(slug: string): TierOneSeoMetadataOverride | null {
  return TIER_ONE_FREE_TOOL_METADATA[slug] ?? null;
}

export function getTierOnePremiumMetadata(slug: string): TierOneSeoMetadataOverride | null {
  return TIER_ONE_PREMIUM_METADATA[slug] ?? null;
}

export function isTierOneRefreshPath(path: string): boolean {
  return SEO_REFRESH_PRIORITY.some((item) => item.path === path && item.priority === "tier_1");
}
