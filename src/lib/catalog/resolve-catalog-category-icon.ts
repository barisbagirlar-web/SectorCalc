import type { LucideIcon } from "lucide-react";
import { Calculator, LayoutGrid } from "lucide-react";
import { getCategoryIcon } from "@/lib/catalog/category-icon-map";
import { getIndustrySlugIcon } from "@/lib/catalog/industry-slug-icon-map";
import { isTaxonomySectorIconSlug, getTaxonomySectorIcon } from "@/lib/catalog/taxonomy-sector-icon-map";
import { LEGACY_CATALOG_ICON_ALIASES } from "@/lib/catalog/legacy-catalog-icon-aliases";
import { SCHEMA_CATALOG_ICON_OVERRIDES } from "@/lib/catalog/schema-catalog-icon-overrides";
import type { GlobalToolCategorySlug } from "@/lib/catalog/global-tool-category-taxonomy";
import { listGlobalCategorySlugs } from "@/lib/catalog/global-tool-category-taxonomy";
import { FREE_TRAFFIC_CATEGORY_TO_GLOBAL } from "@/lib/catalog/resolve-tool-category";
import { getTaxonomyEntryBySlug } from "@/lib/tools/category-taxonomy";
import type { IndustrySlug } from "@/lib/tools/industry-registry";
import { industryRegistry } from "@/lib/tools/industry-registry";
import type { HomepageCoverageId } from "@/lib/home/homepage-positioning-data";
import { HOMEPAGE_COVERAGE_ICON_MAP } from "@/lib/home/homepage-icon-map";
import type { FreeTrafficCategory } from "@/lib/tools/free-traffic-infer";

const GLOBAL_SLUGS = new Set<string>(listGlobalCategorySlugs());
const INDUSTRY_SLUGS = new Set<string>(industryRegistry.map((entry) => entry.slug));

export type CatalogCategoryIconKind = "global" | "industry" | "homepage" | "all" | "legacy" | "fallback";

export function resolveCatalogCategoryIcon(slug: string, depth = 0): LucideIcon {
  if (depth > 4) {
    return Calculator;
  }

  if (slug === "all") {
    return LayoutGrid;
  }

  if (isTaxonomySectorIconSlug(slug)) {
    return getTaxonomySectorIcon(slug);
  }

  const schemaOverride = SCHEMA_CATALOG_ICON_OVERRIDES[slug];
  if (schemaOverride) {
    return schemaOverride;
  }

  const taxonomyEntry = getTaxonomyEntryBySlug(slug);
  if (taxonomyEntry) {
    return resolveCatalogCategoryIcon(taxonomyEntry.globalCategorySlug, depth + 1);
  }

  if (GLOBAL_SLUGS.has(slug)) {
    return getCategoryIcon(slug as GlobalToolCategorySlug);
  }

  if (INDUSTRY_SLUGS.has(slug)) {
    return getIndustrySlugIcon(slug as IndustrySlug);
  }

  if (slug in HOMEPAGE_COVERAGE_ICON_MAP) {
    return HOMEPAGE_COVERAGE_ICON_MAP[slug as HomepageCoverageId];
  }

  const alias = LEGACY_CATALOG_ICON_ALIASES[slug];
  if (alias) {
    return resolveCatalogCategoryIcon(alias, depth + 1);
  }

  const freeTrafficGlobal =
    FREE_TRAFFIC_CATEGORY_TO_GLOBAL[slug as FreeTrafficCategory];
  if (freeTrafficGlobal) {
    return resolveCatalogCategoryIcon(freeTrafficGlobal, depth + 1);
  }

  return Calculator;
}
