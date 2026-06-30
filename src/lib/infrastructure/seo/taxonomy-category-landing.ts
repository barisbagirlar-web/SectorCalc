import { resolveSchemaCatalogCategoryLabel } from "@/lib/infrastructure/i18n/schema-catalog-sidebar-labels";
import { getTaxonomyEntryBySlug, listTaxonomyCategorySlugs } from "@/lib/features/tools/category-taxonomy";
import { getToolsByCategory, type ToolData } from "@/lib/features/tools/all-tools-data";

export type TaxonomyCategoryLanding = {
  readonly slug: string;
  readonly trTitle: string;
  readonly enTitle: string;
  readonly sectorKey: string;
  readonly tools: readonly ToolData[];
};

export { listTaxonomyCategorySlugs };

export function isTaxonomyCategorySlug(slug: string): boolean {
  return listTaxonomyCategorySlugs().includes(slug);
}

export function getTaxonomyCategoryLanding(
  slug: string,
  locale: string,
): TaxonomyCategoryLanding | null {
  const entry = getTaxonomyEntryBySlug(slug);
  if (!entry) {
    return null;
  }

  const tools = getToolsByCategory(entry.slug, locale).sort((left, right) =>
    left.name.localeCompare(right.name, locale),
  );

  return {
    slug: entry.slug,
    trTitle: entry.trTitle,
    enTitle: entry.enTitle,
    sectorKey: entry.sectorKey,
    tools,
  };
}

export function resolveTaxonomyCategoryTitle(
  landing: Pick<TaxonomyCategoryLanding, "trTitle" | "enTitle">,
  locale: string,
  slug?: string,
): string {
  if (slug) {
    return resolveSchemaCatalogCategoryLabel(slug, locale);
  }
  return locale.toLowerCase() === "tr" ? landing.trTitle : landing.enTitle;
}
