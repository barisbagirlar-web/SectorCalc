import type { CatalogGroup } from "@/lib/catalog/catalog-types";
import {
  buildFreeTrafficCatalogGroups,
  buildIndustryCatalogGroups,
  buildSectorToolCatalogGroups,
  DEFAULT_FREE_TRAFFIC_CATEGORY,
} from "@/lib/catalog/build-catalog-groups";
import { listPublicFreeTrafficTools } from "@/lib/freemium/resolve-free-to-premium-migration";
import { FREE_TOOLS } from "@/data/tools";
import type { FreeTrafficCategoryMeta } from "@/lib/tools/free-traffic-categories";
import {
  buildCategoryPageCatalogGroups,
  buildPremiumSchemaCatalogGroups,
} from "@/lib/premium-schema/premium-schema-catalog";

const industryCache = new Map<string, readonly CatalogGroup[]>();
const premiumCache = new Map<string, readonly CatalogGroup[]>();
const categoryPageCache = new Map<string, readonly CatalogGroup[]>();
const freeTrafficCache = new Map<string, readonly CatalogGroup[]>();

export { DEFAULT_FREE_TRAFFIC_CATEGORY };

/** Module-level cache — catalog data changes only on deploy. */
export function getCachedIndustryCatalogGroups(locale = "en"): readonly CatalogGroup[] {
  const key = locale.toLowerCase();
  const hit = industryCache.get(key);
  if (hit) {
    return hit;
  }
  const groups = buildIndustryCatalogGroups(locale);
  industryCache.set(key, groups);
  return groups;
}

export function getCachedPremiumSchemaCatalogGroups(locale = "en"): readonly CatalogGroup[] {
  const key = locale.toLowerCase();
  const hit = premiumCache.get(key);
  if (hit) {
    return hit;
  }
  const groups = buildPremiumSchemaCatalogGroups(locale);
  premiumCache.set(key, groups);
  return groups;
}

export function getCachedCategoryPageCatalogGroups(locale = "en"): readonly CatalogGroup[] {
  const key = locale.toLowerCase();
  const hit = categoryPageCache.get(key);
  if (hit) {
    return hit;
  }
  const groups = buildCategoryPageCatalogGroups(buildSectorToolCatalogGroups(FREE_TOOLS), locale);
  categoryPageCache.set(key, groups);
  return groups;
}

export function getCachedFreeTrafficCatalogGroups(
  locale: string,
  resolveCategoryCopy: (meta: FreeTrafficCategoryMeta) => { label: string; description: string },
  premiumNote: string,
  openCalculatorLabel: string
): readonly CatalogGroup[] {
  const key = locale.toLowerCase();
  const hit = freeTrafficCache.get(key);
  if (hit) {
    return hit;
  }
  const groups = buildFreeTrafficCatalogGroups(
    listPublicFreeTrafficTools(),
    locale,
    resolveCategoryCopy,
    premiumNote,
    openCalculatorLabel
  );
  freeTrafficCache.set(key, groups);
  return groups;
}
