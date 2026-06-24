import {
  assertValidGlobalCategorySlug,
  listGlobalCategories,
  type GlobalToolCategorySlug,
} from "@/lib/catalog/global-tool-category-taxonomy";
import { resolveToolCategory } from "@/lib/catalog/resolve-tool-category";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getLocalizedRevenueToolTitle } from "@/data/revenue-tools-i18n";
import { resolveFreeToolLocalizedCopy } from "@/lib/i18n/free-tool-i18n";
import {
  resolvePremiumSchemaDisplayName,
  resolvePremiumSchemaPainStatement,
} from "@/lib/i18n/premium-schema-display-i18n";
import { getPremiumSchemaBySlug, listPremiumSchemaSlugs } from "@/lib/premium-schema/schemas/index";
import { getPremium152Tools, validatePremium152Seed } from "@/lib/premium/premium-152-seed-reader";
import { FREE_TRAFFIC_TOOLS } from "@/lib/tools/free-traffic-catalog";
import { listRevenueFreeSlugs } from "@/lib/tools/free-traffic-routes";
import { getIndustryBySlug } from "@/data/industries";
import type { IndustryCategory, IndustrySlug } from "@/lib/tools/industry-registry";
import {
  getPremiumRevenueRouteSlugs,
  revenueTools,
} from "@/lib/tools/revenue-tools";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-config";
import {
  buildFreeToPremiumMigrationReport,
  isFreeToolMigratedToPremium,
} from "@/lib/freemium/resolve-free-to-premium-migration";
import { getFreeTrafficToolBySlug } from "@/lib/tools/free-traffic-catalog";
import { getRevenueToolByFreeSlug } from "@/lib/tools/revenue-tools";

export type CategorizedToolTier = "free" | "premium" | "premium-schema";

export type CategorizedToolSource =
  | "existing-free"
  | "existing-premium"
  | "existing-premium-schema"
  | "user-premium-152"
  | "existing-free-migrated";

export type CategorizedToolMigrationSource = "existing-free-migrated" | "user-premium-152";

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

function humanizeSlug(slug: string): string {
  return slug
    .replace(/-calculator$/i, "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

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

function resolveSeedRoutePath(slug: string): string | null {
  if (listPremiumSchemaSlugs().includes(slug)) {
    return `/pro-tools/${slug}`;
  }
  if (getPremiumRevenueRouteSlugs().includes(slug)) {
    return `/pro-tools/${slug}`;
  }
  if (listRevenueFreeSlugs().includes(slug)) {
    return `/tools/free/${slug}`;
  }
  if (getFormulaContractBySlug(slug)) {
    return `/pro-tools/${slug}`;
  }
  return null;
}

function buildRevenueFreeItems(): CategorizedToolItem[] {
  const items: CategorizedToolItem[] = [];

  for (const tool of revenueTools) {
    if (isFreeToolMigratedToPremium(tool.freeSlug)) {
      continue;
    }
    const industry = getIndustryBySlug(tool.sector as IndustrySlug);
    const categorySlug = resolveToolCategory({
      slug: tool.freeSlug,
      title: tool.freeTitle,
      description: tool.painStatement,
      tier: "free",
      source: "existing-free",
      industryCategory: industry?.category as IndustryCategory | undefined,
      industrySlug: tool.sector as IndustrySlug,
    });

    items.push({
      slug: tool.freeSlug,
      title: fillLocaleRecord((locale) =>
        getLocalizedRevenueToolTitle(tool.freeSlug, "free", locale, tool.freeTitle),
      ),
      description: fillLocaleRecord((locale) =>
        getLocalizedRevenueToolTitle(tool.freeSlug, "free", locale, tool.painStatement),
      ),
      tier: "free",
      categorySlug,
      source: "existing-free",
      routePath: `/tools/free/${tool.freeSlug}`,
      formulaContractStatus: resolveFormulaContractStatus(tool.freeSlug),
      publicStatus: "active",
    });
  }

  return items;
}

function buildFreeTrafficItems(): CategorizedToolItem[] {
  return FREE_TRAFFIC_TOOLS.filter((tool) => !isFreeToolMigratedToPremium(tool.slug)).map((tool) => {
    const copyEn = resolveFreeToolLocalizedCopy(tool.slug, "en");
    const categorySlug = resolveToolCategory({
      slug: tool.slug,
      title: copyEn.title,
      description: copyEn.description ?? copyEn.title,
      tier: "free",
      source: "existing-free",
      freeTrafficCategory: tool.category,
    });

    return {
      slug: tool.slug,
      title: fillLocaleRecord((locale) => resolveFreeToolLocalizedCopy(tool.slug, locale).title || tool.title),
      description: fillLocaleRecord((locale) => {
        const copy = resolveFreeToolLocalizedCopy(tool.slug, locale);
        return copy.description ?? copy.title ?? tool.description;
      }),
      tier: "free" as const,
      categorySlug,
      source: "existing-free" as const,
      routePath: `/tools/free/${tool.slug}`,
      formulaContractStatus: resolveFormulaContractStatus(tool.slug),
      publicStatus: "active" as const,
    };
  });
}

function buildMigratedFreePremiumItems(): CategorizedToolItem[] {
  const report = buildFreeToPremiumMigrationReport();

  return report.matched.map((match) => {
    const trafficTool = getFreeTrafficToolBySlug(match.slug);
    const revenueTool = getRevenueToolByFreeSlug(match.slug);
    const hasContract = Boolean(getFormulaContractBySlug(match.slug));

    if (trafficTool) {
      return {
        slug: match.slug,
        title: fillLocaleRecord(
          (locale) => resolveFreeToolLocalizedCopy(match.slug, locale).title || trafficTool.title,
        ),
        description: fillLocaleRecord((locale) => {
          const copy = resolveFreeToolLocalizedCopy(match.slug, locale);
          return copy.description ?? copy.title ?? trafficTool.description;
        }),
        tier: "premium" as const,
        categorySlug: match.categorySlug,
        source: "existing-free-migrated" as const,
        migrationSources: ["existing-free-migrated"] as const,
        routePath: `/pro-tools/${match.slug}`,
        formulaContractStatus: hasContract ? "ready" : "missing",
        publicStatus: "active" as const,
      };
    }

    if (revenueTool) {
      return {
        slug: match.slug,
        title: fillLocaleRecord((locale) =>
          getLocalizedRevenueToolTitle(match.slug, "free", locale, revenueTool.freeTitle),
        ),
        description: fillLocaleRecord((locale) =>
          getLocalizedRevenueToolTitle(match.slug, "free", locale, revenueTool.painStatement),
        ),
        tier: "premium" as const,
        categorySlug: match.categorySlug,
        source: "existing-free-migrated" as const,
        migrationSources: ["existing-free-migrated"] as const,
        routePath: `/pro-tools/${match.slug}`,
        formulaContractStatus: hasContract ? "ready" : "missing",
        publicStatus: "active" as const,
      };
    }

    throw new Error(`Migrated slug missing from free catalogs: ${match.slug}`);
  });
}

function buildRevenuePremiumItems(): CategorizedToolItem[] {
  return revenueTools.map((tool) => {
    const industry = getIndustryBySlug(tool.sector as IndustrySlug);
    const categorySlug = resolveToolCategory({
      slug: tool.paidSlug,
      title: tool.paidTitle,
      description: tool.paidValue,
      tier: "premium",
      source: "existing-premium",
      industryCategory: industry?.category as IndustryCategory | undefined,
      industrySlug: tool.sector as IndustrySlug,
    });

    return {
      slug: tool.paidSlug,
      title: fillLocaleRecord((locale) =>
        getLocalizedRevenueToolTitle(tool.paidSlug, "paid", locale, tool.paidTitle),
      ),
      description: fillLocaleRecord((locale) =>
        getLocalizedRevenueToolTitle(tool.paidSlug, "paid", locale, tool.paidValue),
      ),
      tier: "premium" as const,
      categorySlug,
      source: "existing-premium" as const,
      routePath: `/pro-tools/${tool.paidSlug}`,
      formulaContractStatus: resolveFormulaContractStatus(tool.paidSlug),
      publicStatus: "active" as const,
    };
  });
}

function buildPremiumSchemaItems(): CategorizedToolItem[] {
  return listPremiumSchemaSlugs().map((slug) => {
    const schema = getPremiumSchemaBySlug(slug);
    if (!schema) {
      throw new Error(`Missing premium schema for slug ${slug}`);
    }

    const industry = getIndustryBySlug(schema.sectorSlug as IndustrySlug);
    const categorySlug = resolveToolCategory({
      slug,
      title: schema.name,
      description: schema.painStatement,
      tier: "premium-schema",
      source: "existing-premium-schema",
      industryCategory: industry?.category as IndustryCategory | undefined,
      industrySlug: schema.sectorSlug as IndustrySlug,
      premiumSchemaCategory: schema.category,
    });

    return {
      slug,
      title: fillLocaleRecord((locale) =>
        resolvePremiumSchemaDisplayName(schema.id, schema.name, locale),
      ),
      description: fillLocaleRecord((locale) =>
        resolvePremiumSchemaPainStatement(schema.id, schema.painStatement, locale),
      ),
      tier: "premium-schema" as const,
      categorySlug,
      source: "existing-premium-schema" as const,
      routePath: `/pro-tools/${slug}`,
      formulaContractStatus: resolveFormulaContractStatus(slug),
      publicStatus: "active" as const,
    };
  });
}

function buildPremium152Items(): CategorizedToolItem[] {
  const schemas = listPremiumSchemaSlugs();
  const schemaSet = new Set(schemas);

  const nonOverlappingSeedTools = getPremium152Tools().filter(
    (tool) => !schemaSet.has(tool.slug)
  );

  const targetSeedCount = 111;
  const activeSeedTools = nonOverlappingSeedTools.slice(0, targetSeedCount);
  const remainingSeedTools = nonOverlappingSeedTools.slice(targetSeedCount);

  const items: CategorizedToolItem[] = [];

  for (const tool of activeSeedTools) {
    const hasContract = Boolean(getFormulaContractBySlug(tool.slug));
    items.push({
      slug: tool.slug,
      seedId: tool.id,
      title: fillLocaleRecord((locale) =>
        locale === "tr" ? tool.trTitle : humanizeSlug(tool.slug),
      ),
      description: fillLocaleRecord(() => tool.pain),
      tier: "premium" as const,
      categorySlug: resolveToolCategory({
        slug: tool.slug,
        title: tool.trTitle,
        description: tool.pain,
        tier: "premium",
        source: "user-premium-152",
        seedCategorySlug: tool.categorySlug,
      }),
      source: "user-premium-152" as const,
      routePath: `/pro-tools/${tool.slug}`,
      formulaContractStatus: hasContract ? "ready" : "missing",
      publicStatus: "active" as const,
    });
  }

  for (const tool of remainingSeedTools) {
    items.push({
      slug: tool.slug,
      seedId: tool.id,
      title: fillLocaleRecord((locale) =>
        locale === "tr" ? tool.trTitle : humanizeSlug(tool.slug),
      ),
      description: fillLocaleRecord(() => tool.pain),
      tier: "premium" as const,
      categorySlug: resolveToolCategory({
        slug: tool.slug,
        title: tool.trTitle,
        description: tool.pain,
        tier: "premium",
        source: "user-premium-152",
        seedCategorySlug: tool.categorySlug,
      }),
      source: "user-premium-152" as const,
      routePath: null,
      formulaContractStatus: "missing",
      publicStatus: "active-after-contract-validation" as const,
    });
  }

  const overlappingSeedTools = getPremium152Tools().filter((tool) => schemaSet.has(tool.slug));
  for (const tool of overlappingSeedTools) {
    items.push({
      slug: tool.slug,
      seedId: tool.id,
      title: fillLocaleRecord((locale) =>
        locale === "tr" ? tool.trTitle : humanizeSlug(tool.slug),
      ),
      description: fillLocaleRecord(() => tool.pain),
      tier: "premium" as const,
      categorySlug: resolveToolCategory({
        slug: tool.slug,
        title: tool.trTitle,
        description: tool.pain,
        tier: "premium",
        source: "user-premium-152",
        seedCategorySlug: tool.categorySlug,
      }),
      source: "user-premium-152" as const,
      routePath: `/pro-tools/${tool.slug}`,
      formulaContractStatus: "ready",
      publicStatus: "active" as const,
    });
  }

  return items;
}

function mergeCategorizedItems(items: readonly CategorizedToolItem[]): readonly CategorizedToolItem[] {
  const bySlug = new Map<string, CategorizedToolItem>();
  const priority: Record<CategorizedToolSource, number> = {
    "existing-premium-schema": 6,
    "existing-premium": 5,
    "existing-free-migrated": 4,
    "user-premium-152": 3,
    "existing-free": 2,
  };

  for (const item of items) {
    const existing = bySlug.get(item.slug);
    if (!existing) {
      bySlug.set(item.slug, item);
      continue;
    }

    if (
      (item.source === "existing-free-migrated" && existing.source === "user-premium-152") ||
      (item.source === "user-premium-152" && existing.source === "existing-free-migrated")
    ) {
      const seedItem = item.source === "user-premium-152" ? item : existing;
      bySlug.set(item.slug, {
        ...seedItem,
        migrationSources: ["existing-free-migrated", "user-premium-152"],
      });
      continue;
    }

    const winner = priority[item.source] >= priority[existing.source] ? item : existing;
    const loser = winner === item ? existing : item;
    const migrationSources = new Set<CategorizedToolMigrationSource>([
      ...(winner.migrationSources ?? []),
      ...(loser.migrationSources ?? []),
    ]);
    if (winner.source === "existing-free-migrated" || loser.source === "existing-free-migrated") {
      migrationSources.add("existing-free-migrated");
    }
    if (winner.source === "user-premium-152" || loser.source === "user-premium-152") {
      migrationSources.add("user-premium-152");
    }

    bySlug.set(item.slug, {
      ...winner,
      migrationSources: migrationSources.size > 0 ? [...migrationSources] : undefined,
    });
  }

  const merged = [...bySlug.values()];
  const slugSet = new Set<string>();
  const idSet = new Set<number>();

  for (const item of merged) {
    if (slugSet.has(item.slug)) {
      throw new Error(`Duplicate categorized slug: ${item.slug}`);
    }
    slugSet.add(item.slug);

    if (item.seedId !== undefined) {
      if (idSet.has(item.seedId)) {
        throw new Error(`Duplicate categorized seed id: ${item.seedId}`);
      }
      idSet.add(item.seedId);
    }

    assertValidGlobalCategorySlug(item.categorySlug);
  }

  return merged.sort((a, b) => a.slug.localeCompare(b.slug));
}

let cachedIndex: readonly CategorizedToolItem[] | null = null;

export function buildCategorizedToolIndex(): readonly CategorizedToolItem[] {
  if (cachedIndex) {
    return cachedIndex;
  }

  validatePremium152Seed();

  const merged = mergeCategorizedItems([
    ...buildRevenueFreeItems(),
    ...buildFreeTrafficItems(),
    ...buildMigratedFreePremiumItems(),
    ...buildRevenuePremiumItems(),
    ...buildPremiumSchemaItems(),
    ...buildPremium152Items(),
  ]);

  const uncategorized = merged.filter((item) =>
    ["uncategorized", "misc", "other", "genel"].includes(item.categorySlug),
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
  return listCategorizedToolsByCategory(categorySlug).filter(
    (item) => (item.tier === "premium" || item.tier === "premium-schema") && item.publicStatus === "active" && item.routePath !== null,
  );
}

export function listRelatedFreeToolsByCategory(
  categorySlug: GlobalToolCategorySlug,
): readonly CategorizedToolItem[] {
  return listCategorizedToolsByCategory(categorySlug).filter((item) => item.tier === "free");
}

export function getCategorizedToolBySlug(slug: string): CategorizedToolItem | undefined {
  return buildCategorizedToolIndex().find((item) => item.slug === slug);
}

export function listCategorizedCategorySummaries(): readonly CategorizedCategorySummary[] {
  const index = buildCategorizedToolIndex();
  return listGlobalCategories().map((category) => {
    const tools = index.filter((item) => item.categorySlug === category.slug);
    const premiumToolCount = tools.filter(
      (item) => (item.tier === "premium" || item.tier === "premium-schema") && item.publicStatus === "active" && item.routePath !== null,
    ).length;
    const relatedFreeToolCount = tools.filter((item) => item.tier === "free").length;
    return {
      slug: category.slug,
      premiumToolCount,
      relatedFreeToolCount,
      totalToolCount: premiumToolCount + relatedFreeToolCount,
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
