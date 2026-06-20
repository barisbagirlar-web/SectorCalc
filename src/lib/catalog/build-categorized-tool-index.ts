import {
  assertValidGlobalCategorySlug,
  listGlobalCategories,
  type GlobalToolCategorySlug,
} from "@/lib/catalog/global-tool-category-taxonomy";
import { resolveToolCategory, MANUAL_CATEGORY_OVERRIDES, type ToolCategoryResolutionInput } from "@/lib/catalog/resolve-tool-category";
import type { FreeTrafficCategory } from "@/lib/tools/free-traffic-infer";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getLocalizedRevenueToolTitle } from "@/data/revenue-tools-i18n";
import { resolveFreeToolLocalizedCopy } from "@/lib/i18n/free-tool-i18n";
import {
  CANONICAL_FREE_SLUGS,
  CANONICAL_PREMIUM_SLUGS,
  CANONICAL_TRAFFIC_FREE_SLUGS,
  humanizeCanonicalSlug,
} from "@/lib/tools/canonical-tool-slugs";
import schemaCatalogMetadata from "@/data/schema-catalog-metadata.generated.json";
import { getRevenueToolByFreeSlug } from "@/lib/tools/revenue-tools";
import { getPremium152Tools } from "@/lib/premium/premium-152-seed-reader";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-config";

/** Premium 152 batch 1 — schema-backed routes with verified trust chain. */
const PREMIUM_152_ACTIVE_BATCH_SLUGS: ReadonlySet<string> = new Set([
  "7-israf-muda-avcisi-parasal-karsilik-calculator",
  "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator",
  "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator",
  "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator",
  "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator",
]);

function resolvePremium152BatchRoute(slug: string): string | null {
  if (!PREMIUM_152_ACTIVE_BATCH_SLUGS.has(slug)) {
    return null;
  }
  return `/tools/premium-schema/${slug}`;
}

export type CategorizedToolTier = "free" | "premium" | "premium-schema";

export type CategorizedToolSource = "existing-free" | "existing-premium" | "user-premium-152";

export type CategorizedToolMigrationSource = never;

export type CategorizedToolPublicStatus =
  | "active"
  | "active-after-contract-validation"
  | "blocked";

export type CategorizedToolFormulaStatus = "ready" | "missing" | "not-required";

export type CategorizedToolItem = {
  readonly slug: string;
  readonly title: Record<string, string>;
  readonly description: Record<string, string>;
  readonly tier: CategorizedToolTier;
  readonly categorySlug: GlobalToolCategorySlug;
  readonly source: CategorizedToolSource;
  readonly routePath: string | null;
  readonly formulaContractStatus: CategorizedToolFormulaStatus;
  readonly publicStatus: CategorizedToolPublicStatus;
  readonly seedId?: number;
  readonly migrationSources?: readonly CategorizedToolMigrationSource[];
};

export type CategorizedCategorySummary = {
  readonly slug: GlobalToolCategorySlug;
  readonly premiumToolCount: number;
  readonly relatedFreeToolCount: number;
  readonly totalToolCount: number;
};

function fillLocaleRecord(build: (locale: string) => string): Record<string, string> {
  const record: Record<string, string> = {};
  for (const locale of SUPPORTED_LOCALES) {
    record[locale] = build(locale);
  }
  return record;
}

function resolveFormulaContractStatus(slug: string): CategorizedToolFormulaStatus {
  return getFormulaContractBySlug(slug) ? "ready" : "missing";
}

const SCHEMA_CATALOG_MAP = schemaCatalogMetadata as Readonly<
  Record<string, { readonly categorySlug?: string; readonly catalogCategory?: string }>
>;

function resolveCategorySlugForSlug(
  slug: string,
  title: string,
  description: string,
  tier: "free" | "premium",
  source: CategorizedToolSource,
): GlobalToolCategorySlug {
  // Check manual overrides FIRST — these are expert-reviewed, highest authority
  const manual = MANUAL_CATEGORY_OVERRIDES[slug];
  if (manual) {
    return manual;
  }

  const fromSchema = SCHEMA_CATALOG_MAP[slug]?.categorySlug;
  if (fromSchema) {
    return fromSchema as GlobalToolCategorySlug;
  }
  return resolveToolCategory({
    slug,
    title,
    description,
    tier,
    source,
    freeTrafficCategory: SCHEMA_CATALOG_MAP[slug]?.catalogCategory as FreeTrafficCategory | undefined,
  });
}

function buildPremium152SeedItems(): CategorizedToolItem[] {
  return getPremium152Tools().map((tool) => {
    const description = tool.pain ?? tool.trTitle;
    const categorySlug = tool.categorySlug as GlobalToolCategorySlug;

    const batchRoute = resolvePremium152BatchRoute(tool.slug);
    const isBatchActive = batchRoute !== null;

    return {
      slug: tool.slug,
      title: fillLocaleRecord((locale) =>
        locale === "tr" ? tool.trTitle : humanizeCanonicalSlug(tool.slug),
      ),
      description: fillLocaleRecord((locale) => (locale === "tr" ? description : description)),
      tier: isBatchActive ? "premium-schema" : "premium",
      categorySlug,
      source: "user-premium-152",
      routePath: batchRoute,
      formulaContractStatus:
        tool.formulaStatus === "source-formula-provided" || isBatchActive ? "ready" : "missing",
      publicStatus: isBatchActive ? "active" : (tool.publicStatus as CategorizedToolPublicStatus),
      seedId: tool.id,
    };
  });
}

function buildPremiumItems(): CategorizedToolItem[] {
  return CANONICAL_PREMIUM_SLUGS.map((slug) => {
    const revenueTool = getRevenueToolByFreeSlug(slug);
    const title = revenueTool?.freeTitle ?? humanizeCanonicalSlug(slug);
    const description = revenueTool?.paidValue ?? revenueTool?.painStatement ?? "Regeneration pending.";
    const categorySlug = resolveCategorySlugForSlug(
      slug,
      title,
      description,
      "premium",
      "existing-premium",
    );

    return {
      slug,
      title: fillLocaleRecord((locale) =>
        getLocalizedRevenueToolTitle(slug, "paid", locale, title),
      ),
      description: fillLocaleRecord((locale) =>
        getLocalizedRevenueToolTitle(slug, "paid", locale, description),
      ),
      tier: "premium",
      categorySlug,
      source: "existing-premium",
      routePath: `/tools/generated/${slug}`,
      formulaContractStatus: resolveFormulaContractStatus(slug),
      publicStatus: "active",
    };
  });
}

function buildFreeItems(): CategorizedToolItem[] {
  return CANONICAL_TRAFFIC_FREE_SLUGS.map((slug) => {
    const title = humanizeCanonicalSlug(slug);
    const copyEn = resolveFreeToolLocalizedCopy(slug, "en");
    const categorySlug = resolveCategorySlugForSlug(
      slug,
      copyEn.title || title,
      copyEn.description ?? copyEn.title ?? title,
      "free",
      "existing-free",
    );

    return {
      slug,
      title: fillLocaleRecord(
        (locale) => resolveFreeToolLocalizedCopy(slug, locale).title || title,
      ),
      description: fillLocaleRecord((locale) => {
        const copy = resolveFreeToolLocalizedCopy(slug, locale);
        return copy.description ?? copy.title ?? title;
      }),
      tier: "free",
      categorySlug,
      source: "existing-free",
      routePath: `/tools/generated/${slug}`,
      formulaContractStatus: resolveFormulaContractStatus(slug),
      publicStatus: "active",
    };
  });
}

function mergeBySlug(items: readonly CategorizedToolItem[]): readonly CategorizedToolItem[] {
  const bySlug = new Map<string, CategorizedToolItem>();
  const priority: Record<CategorizedToolSource, number> = {
    "existing-premium": 3,
    "user-premium-152": 2,
    "existing-free": 1,
  };

  for (const item of items) {
    const existing = bySlug.get(item.slug);
    if (!existing || priority[item.source] >= priority[existing.source]) {
      bySlug.set(item.slug, item);
    }
  }

  const merged = [...bySlug.values()];
  for (const item of merged) {
    assertValidGlobalCategorySlug(item.categorySlug);
  }
  return merged.sort((a, b) => a.slug.localeCompare(b.slug));
}

let cachedIndex: readonly CategorizedToolItem[] | null = null;

export function buildCategorizedToolIndex(): readonly CategorizedToolItem[] {
  if (cachedIndex) {
    return cachedIndex;
  }

  const merged = mergeBySlug([
    ...buildPremiumItems(),
    ...buildPremium152SeedItems(),
    ...buildFreeItems(),
  ]);

  const uncategorized = merged.filter((item) =>
    ["uncategorized", "misc", "genel"].includes(item.categorySlug),
  );
  if (uncategorized.length > 0) {
    throw new Error(`Uncategorized tools found: ${uncategorized.map((item) => item.slug).join(", ")}`);
  }

  cachedIndex = merged;
  return merged;
}

export function listCategorizedToolsByCategory(
  categorySlug: GlobalToolCategorySlug,
): readonly CategorizedToolItem[] {
  assertValidGlobalCategorySlug(categorySlug);
  return buildCategorizedToolIndex().filter((item) => item.categorySlug === categorySlug);
}

export function listPremiumToolsByCategory(
  categorySlug: GlobalToolCategorySlug,
): readonly CategorizedToolItem[] {
  return listCategorizedToolsByCategory(categorySlug).filter((item) => item.tier === "premium");
}

export function listRelatedFreeToolsByCategory(
  categorySlug: GlobalToolCategorySlug,
): readonly CategorizedToolItem[] {
  return listCategorizedToolsByCategory(categorySlug).filter((item) => item.tier === "free");
}

export function getCategorizedToolBySlug(slug: string): CategorizedToolItem | undefined {
  const normalized = slug.replace(/-premium$/, "");
  return buildCategorizedToolIndex().find(
    (item) => item.slug === slug || item.slug === normalized,
  );
}

export function listCategorizedCategorySummaries(): readonly CategorizedCategorySummary[] {
  const index = buildCategorizedToolIndex();
  return listGlobalCategories().map((category) => {
    const tools = index.filter((item) => item.categorySlug === category.slug);
    const premiumToolCount = tools.filter((item) => item.tier === "premium").length;
    const relatedFreeToolCount = tools.filter((item) => item.tier === "free").length;
    return {
      slug: category.slug,
      premiumToolCount,
      relatedFreeToolCount,
      totalToolCount: tools.length,
    };
  });
}

export function assertAllToolsCategorized(): void {
  buildCategorizedToolIndex();
}

export function getUncategorizedToolCount(): number {
  return buildCategorizedToolIndex().filter((item) =>
    ["uncategorized", "misc", "other", "genel"].includes(item.categorySlug),
  ).length;
}

/** @deprecated Kept for import stability — canonical lists are validated at build time. */
export function listCanonicalFreeSlugs(): readonly string[] {
  return CANONICAL_FREE_SLUGS;
}

export function listCanonicalPremiumSlugs(): readonly string[] {
  return CANONICAL_PREMIUM_SLUGS;
}
