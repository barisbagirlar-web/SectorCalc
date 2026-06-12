import {
  getPremium152Categories,
  getPremium152CategoryBySlug,
  type Premium152SeedCategory,
} from "@/lib/premium/premium-152-seed-reader";

export type GlobalToolCategorySlug = Premium152SeedCategory["slug"];

export type GlobalToolCategory = {
  readonly slug: GlobalToolCategorySlug;
  readonly trTitle: string;
  readonly enTitle: string;
  readonly iconKey: string;
  readonly summary: string;
  readonly premiumSeedCount: number;
};

const FORBIDDEN_CATEGORY_SLUGS = new Set(["uncategorized", "misc", "other", "genel"]);

export function listGlobalCategorySlugs(): readonly GlobalToolCategorySlug[] {
  return getPremium152Categories().map((category) => category.slug);
}

export function getGlobalCategoryBySlug(slug: string): GlobalToolCategory | undefined {
  if (FORBIDDEN_CATEGORY_SLUGS.has(slug)) {
    return undefined;
  }

  const category = getPremium152CategoryBySlug(slug);
  if (!category) {
    return undefined;
  }

  return {
    slug: category.slug,
    trTitle: category.trTitle,
    enTitle: category.enTitle,
    iconKey: category.iconKey,
    summary: category.summary,
    premiumSeedCount: category.count,
  };
}

export function listGlobalCategories(): readonly GlobalToolCategory[] {
  return getPremium152Categories().map((category) => ({
    slug: category.slug,
    trTitle: category.trTitle,
    enTitle: category.enTitle,
    iconKey: category.iconKey,
    summary: category.summary,
    premiumSeedCount: category.count,
  }));
}

export function resolveGlobalCategoryTitle(
  category: Pick<GlobalToolCategory, "trTitle" | "enTitle">,
  locale: string,
): string {
  if (locale === "tr") {
    return category.trTitle;
  }
  return category.enTitle;
}

export function assertValidGlobalCategorySlug(slug: string): GlobalToolCategorySlug {
  if (FORBIDDEN_CATEGORY_SLUGS.has(slug)) {
    throw new Error(`Forbidden category slug: ${slug}`);
  }
  const category = getGlobalCategoryBySlug(slug);
  if (!category) {
    throw new Error(`Unknown global category slug: ${slug}`);
  }
  return category.slug;
}
