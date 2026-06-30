import {
  buildSearchEntriesFromGroups,
  mergeSearchEntries,
  type CatalogSearchEntry,
} from "@/lib/catalog/catalog-search";
import {
  getCachedFreeTrafficCatalogGroups,
  getCachedIndustryCatalogGroups,
  getCachedPremiumSchemaCatalogGroups,
} from "@/lib/catalog/cached-catalog-groups";
import type { FreeTrafficCategoryMeta } from "@/lib/features/tools/free-traffic-categories";

/** Keep homepage search focused on industry / business calculators — not daily-life catalog tabs. */
export const HOMEPAGE_SEARCH_EXCLUDED_FREE_CATEGORIES = new Set([
  "everyday-life",
  "math-statistics",
  "conversion",
  "health-body",
]);

type HomepageCatalogLabelResolver = (meta: FreeTrafficCategoryMeta) => {
  label: string;
  description: string;
};

export function buildHomepageSearchEntries(
  locale: string,
  resolveFreeGroupLabels: HomepageCatalogLabelResolver,
  openCalculatorLabel: string
): readonly CatalogSearchEntry[] {
  const freeGroups = getCachedFreeTrafficCatalogGroups(
    locale,
    resolveFreeGroupLabels,
    openCalculatorLabel,
    openCalculatorLabel
  );

  const premiumGroups = getCachedPremiumSchemaCatalogGroups(locale);
  const industryGroups = getCachedIndustryCatalogGroups(locale);

  const homepageFreeGroups = freeGroups.filter(
    (group) => !HOMEPAGE_SEARCH_EXCLUDED_FREE_CATEGORIES.has(group.id)
  );

  return mergeSearchEntries(
    buildSearchEntriesFromGroups(homepageFreeGroups, "homepage"),
    buildSearchEntriesFromGroups(premiumGroups, "homepage"),
    buildSearchEntriesFromGroups(industryGroups, "homepage")
  );
}
