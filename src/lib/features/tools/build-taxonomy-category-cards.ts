/**
 * SectorCalc — Build Category Cards for Taxonomy Grid
 *
 * Groups tools by their resolved category and enriches with
 * FreeToolCategoryEntry metadata (field, domain, social purpose, SVG symbol).
 *
 * ECMI / ISO 9001 — TÜV-certifiable engineering classification.
 */

import { buildCategorizedToolIndex } from "@/lib/catalog/build-categorized-tool-index";
import {
  FREE_TOOL_CATEGORIES,
  type FreeToolCategoryEntry,
  type FreeToolCategorySlug,
} from "@/lib/features/free-tools/free-tool-categories";
import { resolveCategorySvgSymbol } from "@/data/category-svg-symbols";

export type CategoryCard = {
  readonly category: FreeToolCategoryEntry;
  readonly svgSymbol: string;
  readonly count: number;
  readonly countLabel: string;
  readonly premiumCount: number;
  readonly freeCount: number;
};

export type TierFilter = "free" | "premium" | "all";

/**
 * Build flat category cards with tool counts from the categorized index.
 *
 * TYPE-SAFE OVERLOAD: When tierFilter is "free" or "premium", visibleSlugs
 * is REQUIRED to prevent counting unschematized tools.
 * When tierFilter is "all", visibleSlugs is optional (default: count all).
 *
 * When tierFilter is "premium", only premium/premium-schema tools are counted.
 * When tierFilter is "free", only free tools are counted.
 * When "all" (default), all tools are counted.
 *
 * When `visibleSlugs` is provided, only tools whose slug exists in the set
 * are counted. This ensures category card counts match the displayed tool
 * listing (e.g. getFreeTools / getPremiumTools / getAllTools).
 *
 * Only includes categories that have at least one tool mapped.
 * Categories are sorted by their `order` field.
 */
export function buildTaxonomyCategoryCards(
  locale: string,
  tierFilter: "free" | "premium",
  visibleSlugs: ReadonlySet<string>,
): CategoryCard[];
export function buildTaxonomyCategoryCards(
  locale: string,
  tierFilter?: "all",
  visibleSlugs?: ReadonlySet<string>,
): CategoryCard[];
export function buildTaxonomyCategoryCards(
  locale: string,
  tierFilter: TierFilter = "all",
  visibleSlugs?: ReadonlySet<string>,
): CategoryCard[] {
  const index = buildCategorizedToolIndex();

  const categoryCounts = new Map<string, { total: number; premium: number; free: number }>();
  for (const item of index) {
    const matchesFilter =
      tierFilter === "all" ||
      (tierFilter === "premium" && (item.tier === "premium" || item.tier === "premium-schema")) ||
      (tierFilter === "free" && item.tier === "free");
    if (!matchesFilter) continue;

    // When visibleSlugs is provided, only count tools that exist in the display set
    if (visibleSlugs && !visibleSlugs.has(item.slug)) continue;

    const entry = categoryCounts.get(item.categorySlug) ?? { total: 0, premium: 0, free: 0 };
    entry.total++;
    if (item.tier === "premium" || item.tier === "premium-schema") {
      entry.premium++;
    } else {
      entry.free++;
    }
    categoryCounts.set(item.categorySlug, entry);
  }

  const cards: CategoryCard[] = [];

  for (const cat of FREE_TOOL_CATEGORIES) {
    const counts = categoryCounts.get(cat.slug) ?? { total: 0, premium: 0, free: 0 };
    if (counts.total === 0 && cat.slug !== "other") {
      continue;
    }

    cards.push({
      category: cat,
      svgSymbol: resolveCategorySvgSymbol(cat.slug),
      count: counts.total,
      countLabel: `${counts.total}`,
      premiumCount: counts.premium,
      freeCount: counts.free,
    });
  }

  cards.sort((a, b) => a.category.order - b.category.order);

  return cards;
}

/**
 * Build categories with tools grouped under them.
 */
export function buildTaxonomyCategoryGroups(
  locale: string,
): Array<CategoryCard & { tools: readonly { slug: string; name: string; href: string; premiumRequired: boolean }[] }> {
  const index = buildCategorizedToolIndex();
  const cards = buildTaxonomyCategoryCards(locale);

  return cards.map((card) => {
    const tools = index
      .filter((item) => item.categorySlug === card.category.slug)
      .map((item) => ({
        slug: item.slug,
        name: item.title[locale] ?? item.title.en ?? item.slug,
        href: item.routePath ?? `/tools/generated/${item.slug}`,
        premiumRequired: item.tier === "premium" || item.tier === "premium-schema",
      }))
      .sort((a, b) => a.name.localeCompare(b.name, locale));

    return { ...card, tools };
  });
}
