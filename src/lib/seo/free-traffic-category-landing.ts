import type { Tool } from "@/data/tools";
import { buildGeneratedToolCatalog } from "@/lib/generated-tools/build-generated-catalog";
import {
  FREE_TRAFFIC_CATEGORY_META,
  isFreeTrafficCategorySlug,
  type FreeTrafficCategoryMeta,
} from "@/lib/tools/free-traffic-categories";
import { inferFreeTrafficCategory } from "@/lib/tools/free-traffic-infer";

export type FreeTrafficCategoryLanding = {
  readonly meta: FreeTrafficCategoryMeta;
  readonly tools: readonly Tool[];
};

export { isFreeTrafficCategorySlug, listFreeTrafficCategorySlugs } from "@/lib/tools/free-traffic-categories";

export function getFreeTrafficCategoryLanding(
  category: string,
  locale: string,
): FreeTrafficCategoryLanding | null {
  if (!isFreeTrafficCategorySlug(category)) {
    return null;
  }

  const meta = FREE_TRAFFIC_CATEGORY_META.find((entry) => entry.id === category);
  if (!meta) {
    return null;
  }

  const tools = buildGeneratedToolCatalog(locale)
    .filter((tool) => inferFreeTrafficCategory(tool.slug) === category)
    .sort((a, b) => a.name.localeCompare(b.name));

  return { meta, tools };
}
