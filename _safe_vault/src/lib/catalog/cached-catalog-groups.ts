import type { CatalogGroup } from "@/lib/catalog/catalog-types";
import {
  buildFreeTrafficCatalogGroups,
  buildIndustryCatalogGroups,
  buildSectorToolCatalogGroups,
  DEFAULT_FREE_TRAFFIC_CATEGORY,
} from "@/lib/catalog/build-catalog-groups";
import { getGeneratedToolSchema } from "@/lib/generated-tools/schema-loader";
import {
  resolveGeneratedToolDescription,
  resolveGeneratedToolTitle,
} from "@/lib/generated-tools/resolve-tool-display";
import { listPublicFreeTrafficTools } from "@/lib/tools/free-traffic-catalog";
import { getLocalizedFreeTools } from "@/data/tools";
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

function extractGeneratedToolSlug(href: string): string | null {
  const match = href.match(/\/tools\/(?:generated|free)\/([^/]+)$/);
  return match?.[1] ?? null;
}

function enrichFreeTrafficCatalogGroups(
  groups: readonly CatalogGroup[],
  locale: string,
): readonly CatalogGroup[] {
  return groups.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      const slug = extractGeneratedToolSlug(item.href);
      if (!slug) {
        return item;
      }
      const schema = getGeneratedToolSchema(slug);
      if (!schema) {
        return item;
      }
      return {
        ...item,
        title: item.title || resolveGeneratedToolTitle(slug, schema, locale),
        description: item.description || resolveGeneratedToolDescription(slug, schema, locale),
        inputCount: schema.inputs.length,
      };
    }),
  }));
}

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
  const freeGroups = enrichFreeTrafficCatalogGroups(
    buildSectorToolCatalogGroups(getLocalizedFreeTools(locale)),
    locale,
  );
  const groups = buildCategoryPageCatalogGroups(freeGroups, locale);
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
  const groups = enrichFreeTrafficCatalogGroups(
    buildFreeTrafficCatalogGroups(
      listPublicFreeTrafficTools(),
      locale,
      resolveCategoryCopy,
      premiumNote,
      openCalculatorLabel,
    ),
    locale,
  );
  freeTrafficCache.set(key, groups);
  return groups;
}
