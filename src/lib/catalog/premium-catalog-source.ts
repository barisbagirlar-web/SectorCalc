import { buildCategorizedToolIndex } from "@/lib/catalog/build-categorized-tool-index";
import type { CatalogSearchEntry } from "@/lib/catalog/catalog-search";
import type { GlobalToolCategorySlug } from "@/lib/catalog/global-tool-category-taxonomy";
import { listPremiumCatalogCategories } from "@/lib/premium/premium-category-resolver";

export function normalizeToolSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export type PremiumCatalogToolItem = {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly categoryId: GlobalToolCategorySlug;
  readonly categoryLabel: string;
  readonly routePath: string | null;
  readonly isActive: boolean;
  readonly searchTerms: readonly string[];
  readonly aliases: readonly string[];
  readonly keywords: readonly string[];
};

type PremiumCatalogToolOverride = {
  readonly categoryId?: GlobalToolCategorySlug;
  readonly titles?: Partial<Record<string, string>>;
  readonly descriptions?: Partial<Record<string, string>>;
  readonly searchTerms?: readonly string[];
  readonly aliases?: readonly string[];
  readonly keywords?: readonly string[];
};

const SEVEN_MUDA_SLUG = "7-israf-muda-avcisi-parasal-karsilik-calculator";

const PREMIUM_CATALOG_TOOL_OVERRIDES: Readonly<Record<string, PremiumCatalogToolOverride>> = {
  [SEVEN_MUDA_SLUG]: {
    categoryId: "lean-production",
    titles: {
      en: "7 Muda Waste Cost Calculator",
    },
    descriptions: {
      en: "Calculates the monetary cost of the seven Muda waste types.",
    },
    searchTerms: [
      "7 muda",
      "muda",
      "waste cost",
      "lean waste",
      "seven muda",
      "seven wastes",
    ],
    aliases: ["7 wastes", "seven muda wastes", "lean muda"],
    keywords: ["lean", "waste", "muda"],
  },
};

function resolveLocalizedCopy(
  locale: string,
  override: PremiumCatalogToolOverride | undefined,
  field: "titles" | "descriptions",
  fallback: Record<string, string>,
): string {
  const localized = override?.[field]?.[locale] ?? override?.[field]?.en;
  if (localized) {
    return localized;
  }
  return fallback[locale] ?? fallback.en ?? "";
}

export function buildPremiumCatalogTools(locale: string): readonly PremiumCatalogToolItem[] {
  const categoryLabels = new Map(
    listPremiumCatalogCategories(locale).map((category) => [category.slug, category.title]),
  );

  const premiumItems = buildCategorizedToolIndex().filter(
    (item) => (item.tier === "premium" || item.tier === "premium-schema") && item.publicStatus === "active" && item.routePath !== null,
  );

  const bySlug = new Map<string, PremiumCatalogToolItem>();

  for (const item of premiumItems) {
    if (bySlug.has(item.slug)) {
      continue;
    }

    const override = PREMIUM_CATALOG_TOOL_OVERRIDES[item.slug];
    const categoryId = override?.categoryId ?? item.categorySlug;

    bySlug.set(item.slug, {
      slug: item.slug,
      title: resolveLocalizedCopy(locale, override, "titles", item.title),
      description: resolveLocalizedCopy(locale, override, "descriptions", item.description),
      categoryId,
      categoryLabel: categoryLabels.get(categoryId) ?? categoryId,
      routePath: item.routePath,
      isActive: item.publicStatus === "active" && item.routePath !== null,
      searchTerms: override?.searchTerms ?? [],
      aliases: override?.aliases ?? [],
      keywords: override?.keywords ?? [],
    });
  }

  return [...bySlug.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

export function buildPremiumCatalogSearchHaystack(tool: PremiumCatalogToolItem): string {
  return normalizeToolSearchText(
    [
      tool.title,
      tool.description,
      tool.slug,
      tool.slug.replace(/-/g, " "),
      tool.categoryId,
      tool.categoryLabel,
      ...tool.searchTerms,
      ...tool.aliases,
      ...tool.keywords,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

export function buildSearchablePremiumToolHaystack(tool: {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly categorySlug: string;
  readonly categoryLabel?: string;
  readonly searchTerms?: readonly string[];
  readonly aliases?: readonly string[];
  readonly keywords?: readonly string[];
}): string {
  return normalizeToolSearchText(
    [
      tool.title,
      tool.description,
      tool.slug,
      tool.slug.replace(/-/g, " "),
      tool.categorySlug,
      tool.categoryLabel ?? tool.categorySlug,
      ...(tool.searchTerms ?? []),
      ...(tool.aliases ?? []),
      ...(tool.keywords ?? []),
    ]
      .filter(Boolean)
      .join(" "),
  );
}

/** Typeahead entries for premium discovery — active routable tools only. */
export function buildPremiumCatalogSearchEntries(
  tools: readonly {
    readonly slug: string;
    readonly title: string;
    readonly description: string;
    readonly categorySlug: string;
    readonly categoryLabel?: string;
    readonly routePath: string | null;
    readonly isActive: boolean;
    readonly searchTerms?: readonly string[];
    readonly aliases?: readonly string[];
    readonly keywords?: readonly string[];
  }[],
): readonly CatalogSearchEntry[] {
  return tools
    .filter((tool) => tool.isActive && tool.routePath)
    .map((tool) => ({
      title: tool.title,
      description: tool.description,
      href: tool.routePath!,
      groupLabel: tool.categoryLabel ?? tool.categorySlug,
      slug: tool.slug,
      tier: "premium" as const,
      haystack: buildSearchablePremiumToolHaystack(tool),
    }));
}
