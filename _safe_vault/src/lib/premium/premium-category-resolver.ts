import {
  listCategorizedCategorySummaries,
  listPremiumToolsByCategory,
  listRelatedFreeToolsByCategory,
} from "@/lib/catalog/build-categorized-tool-index";
import {
  getGlobalCategoryBySlug,
  listGlobalCategories,
  resolveGlobalCategoryTitle,
  type GlobalToolCategorySlug,
} from "@/lib/catalog/global-tool-category-taxonomy";

export function listPremiumCatalogCategories(locale: string) {
  const summaries = listCategorizedCategorySummaries();
  return listGlobalCategories().map((category) => {
    const summary = summaries.find((entry) => entry.slug === category.slug);
    return {
      slug: category.slug,
      title: resolveGlobalCategoryTitle(category, locale),
      summary: category.summary,
      iconKey: category.iconKey,
      premiumToolCount: summary?.premiumToolCount ?? 0,
      relatedFreeToolCount: summary?.relatedFreeToolCount ?? 0,
    };
  });
}

export function getPremiumCatalogCategoryDetail(categorySlug: GlobalToolCategorySlug, locale: string) {
  const category = getGlobalCategoryBySlug(categorySlug);
  if (!category) {
    return null;
  }

  return {
    slug: category.slug,
    title: resolveGlobalCategoryTitle(category, locale),
    summary: category.summary,
    iconKey: category.iconKey,
    premiumTools: listPremiumToolsByCategory(categorySlug),
    relatedFreeTools: listRelatedFreeToolsByCategory(categorySlug),
  };
}

export function listPremiumCatalogCategorySlugs(): readonly GlobalToolCategorySlug[] {
  return listGlobalCategories().map((category) => category.slug);
}
