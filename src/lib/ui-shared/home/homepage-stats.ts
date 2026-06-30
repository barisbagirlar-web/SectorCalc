import { buildCategorizedToolIndex } from "@/lib/catalog/build-categorized-tool-index";
import { buildPremiumCatalogTools } from "@/lib/catalog/premium-catalog-source";
import { industryRegistry } from "@/lib/features/tools/industry-registry";

export type HomepageCatalogToolCounts = {
  readonly freeCount: number;
  readonly premiumCount: number;
};

/** Live sector-area count for homepage copy (industry registry). */
export function getHomepageSectorAreaCount(): number {
  return industryRegistry.length;
}

/** Routable free + active premium calculator counts for homepage marketing copy. */
export function getHomepageCatalogToolCounts(): HomepageCatalogToolCounts {
  const freeCount = buildCategorizedToolIndex().filter(
    (item) => item.tier === "free" && item.routePath !== null && item.publicStatus === "active",
  ).length;

  const premiumCount = buildPremiumCatalogTools("en").filter(
    (tool) => tool.isActive && tool.routePath !== null,
  ).length;

  return { freeCount, premiumCount };
}
