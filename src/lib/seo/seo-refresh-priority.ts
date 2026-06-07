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

export const SEO_REFRESH_PRIORITY: readonly SeoRefreshPriorityItem[] = [
  {
    path: "/seo/manufacturing-cost-calculators",
    type: "seo_landing",
    priority: "tier_1",
    targetQuery: "manufacturing cost calculator",
    refreshGoal: "featured_snippet",
  },
  {
    path: "/seo/construction-cost-calculators",
    type: "seo_landing",
    priority: "tier_1",
    targetQuery: "construction cost calculator",
    refreshGoal: "featured_snippet",
  },
  {
    path: "/seo/logistics-route-calculators",
    type: "seo_landing",
    priority: "tier_1",
    targetQuery: "route cost calculator",
    refreshGoal: "featured_snippet",
  },
  {
    path: "/seo/energy-carbon-calculators",
    type: "seo_landing",
    priority: "tier_1",
    targetQuery: "energy cost calculator",
    refreshGoal: "featured_snippet",
  },
  {
    path: "/guides/what-is-oee-and-how-to-calculate-it",
    type: "guide",
    priority: "tier_1",
    targetQuery: "what is OEE and how to calculate it",
    refreshGoal: "featured_snippet",
  },
  {
    path: "/guides/how-to-calculate-scrap-rate",
    type: "guide",
    priority: "tier_1",
    targetQuery: "how to calculate scrap rate",
    refreshGoal: "featured_snippet",
  },
  {
    path: "/guides/how-to-use-area-converter",
    type: "guide",
    priority: "tier_1",
    targetQuery: "area converter m2 to ft2",
    refreshGoal: "featured_snippet",
  },
  {
    path: "/tools/free/area-converter",
    type: "free_tool",
    priority: "tier_1",
    targetQuery: "area converter",
    refreshGoal: "metadata",
  },
  {
    path: "/tools/free/oee-calculator",
    type: "free_tool",
    priority: "tier_1",
    targetQuery: "OEE calculator",
    refreshGoal: "featured_snippet",
  },
  {
    path: "/tools/free/concrete-volume-calculator",
    type: "free_tool",
    priority: "tier_1",
    targetQuery: "concrete volume calculator",
    refreshGoal: "metadata",
  },
  {
    path: "/tools/premium-schema/cnc-oee-loss",
    type: "premium_analyzer",
    priority: "tier_1",
    targetQuery: "CNC OEE loss analyzer",
    refreshGoal: "conversion",
  },
  {
    path: "/tools/premium-schema/carbon-footprint-compliance-risk",
    type: "premium_analyzer",
    priority: "tier_1",
    targetQuery: "carbon footprint compliance risk",
    refreshGoal: "conversion",
  },
] as const;

export type TierOneSeoMetadataOverride = {
  readonly metaTitle: string;
  readonly metaDescription: string;
};

const TIER_ONE_FREE_TOOL_METADATA: Record<string, TierOneSeoMetadataOverride> = {
  "area-converter": {
    metaTitle: "Area Converter — m² to ft² and Hectares to Acres | SectorCalc",
    metaDescription:
      "Convert area units between m², ft², hectares and acres. Free browser calculator for floor plans, land quotes and material coverage checks.",
  },
  "oee-calculator": {
    metaTitle: "OEE Calculator and OEE Loss Guide | SectorCalc",
    metaDescription:
      "Calculate OEE from availability, performance and quality. Understand production effectiveness and find related premium analyzers for hidden capacity loss.",
  },
  "concrete-volume-calculator": {
    metaTitle: "Concrete Volume Calculator — Slab m³ Estimate | SectorCalc",
    metaDescription:
      "Calculate concrete volume for slabs and footings from length, width and depth. Free browser estimator for construction takeoffs and pour planning.",
  },
};

const TIER_ONE_PREMIUM_METADATA: Record<string, TierOneSeoMetadataOverride> = {
  "cnc-oee-loss": {
    metaTitle: "CNC OEE Loss Analyzer — Capacity Exposure Report | SectorCalc",
    metaDescription:
      "Analyze CNC OEE loss drivers, threshold pressure and hidden capacity exposure. Premium decision report with export-ready output.",
  },
  "carbon-footprint-compliance-risk": {
    metaTitle: "Carbon Compliance Risk Analyzer | SectorCalc",
    metaDescription:
      "Estimate carbon compliance exposure from energy use and emission factors. Premium analyzer with threshold checks and export-ready decision output.",
  },
};

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
