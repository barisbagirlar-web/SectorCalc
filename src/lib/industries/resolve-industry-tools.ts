import type { CalculatorCardAccent } from "@/components/catalog/CalculatorCard";
import { resolveFreeToolLocalizedCopy } from "@/lib/i18n/free-tool-i18n";
import { resolvePremiumCatalogGroupLabel } from "@/lib/i18n/catalog-labels-i18n";
import { resolveCalculatorCardAccent } from "@/lib/catalog/card-accent";
import { buildIndustryToolKeywords } from "@/lib/industries/industry-tool-keywords";
import {
  getPremiumSchemasForIndustrySlug,
  type PremiumSchemaCatalogGroupId,
} from "@/lib/premium-schema/premium-schema-catalog";
import type { FormulaFamilyId } from "@/lib/premium-schema/formula-families";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import { PREMIUM_MIGRATION_MAP } from "@/lib/premium-schema/premium-migration-map";
import type { IndustrySlug } from "@/lib/tools/industry-registry";
import { getIndustryRegistryEntry } from "@/lib/tools/industry-registry";
import {
  FREE_TRAFFIC_TOOLS,
  type FreeTrafficCategory,
  type FreeTrafficTool,
} from "@/lib/tools/free-traffic-catalog";
import { getAllRevenueToolSpecs } from "@/lib/tools/revenue-tools";
import { getFreeToolHref, getPremiumSchemaToolHref, resolvePremiumToolHref } from "@/lib/tools/tool-links";
import { getLocalizedRevenueToolTitle } from "@/data/revenue-tools-i18n";
import enMessages from "../../../messages/en.json";
import trMessages from "../../../messages/tr.json";
import deMessages from "../../../messages/de.json";
import frMessages from "../../../messages/fr.json";
import esMessages from "../../../messages/es.json";
import arMessages from "../../../messages/ar.json";

const MAX_TOOLS_PER_TIER = 12;

const SCHEMA_CATEGORY_TO_GROUP: Record<FormulaFamilyId, PremiumSchemaCatalogGroupId> = {
  measurement: "measurement_calibration",
  calibration: "measurement_calibration",
  scrap: "scrap_waste",
  oee: "oee_productivity",
  time: "time_delay",
  route: "route_logistics",
  cost: "cost_margin",
  energy: "energy_carbon",
  carbon: "energy_carbon",
  benchmark: "benchmark_health",
};

const LOCALE_MESSAGES: Record<string, Record<string, unknown>> = {
  en: enMessages as Record<string, unknown>,
  tr: trMessages as Record<string, unknown>,
  de: deMessages as Record<string, unknown>,
  fr: frMessages as Record<string, unknown>,
  es: esMessages as Record<string, unknown>,
  ar: arMessages as Record<string, unknown>,
};

const INDUSTRY_CATEGORY_FREE_CATEGORIES: Partial<Record<string, readonly FreeTrafficCategory[]>> = {
  "heavy-industry": ["manufacturing-workshop", "energy-carbon", "finance-business"],
  "building-trades": ["construction-measurement", "finance-business"],
  "field-services": ["logistics-travel", "finance-business"],
  "food-retail": ["agriculture-food", "finance-business"],
  "custom-manufacturing": ["manufacturing-workshop", "construction-measurement"],
  "logistics-transport": ["logistics-travel", "energy-carbon"],
  "agriculture-livestock": ["agriculture-food"],
  "energy-environment": ["energy-carbon"],
  "daily-life": ["everyday-life", "finance-business"],
};

export type ResolvedIndustryTool = {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly categoryLabel: string;
  readonly tier: "free" | "premium";
  readonly inputCount?: number;
  readonly accent?: CalculatorCardAccent;
};

export type ResolvedIndustryTools = {
  readonly free: readonly ResolvedIndustryTool[];
  readonly premium: readonly ResolvedIndustryTool[];
  readonly hasTools: boolean;
};

export type ResolveIndustryToolsInput = {
  readonly locale: string;
  readonly industrySlug: IndustrySlug;
};

type ScoredTool = ResolvedIndustryTool & { readonly score: number };

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9ğüşıöçâêîôûàáäãåæèéëìíïñòóùúýÿœæß\s-]/gi, " ");
}

function scoreKeywordHits(text: string, keywords: readonly string[]): number {
  const normalized = normalizeText(text);
  let score = 0;
  for (const keyword of keywords) {
    const needle = normalizeText(keyword);
    if (needle.length < 2) {
      continue;
    }
    if (normalized.includes(needle)) {
      score += needle.includes(" ") ? 40 : 25;
    }
  }
  return score;
}

function resolveFreeToolCardDescription(tool: FreeTrafficTool, locale: string): string {
  const localized = resolveFreeToolLocalizedCopy(tool.slug, locale);
  return (
    localized.description?.trim() ||
    localized.seoDescription?.trim() ||
    tool.description?.trim() ||
    tool.seoDescription?.trim() ||
    localized.title?.trim() ||
    tool.title.trim()
  );
}

function readFreeCategoryLabel(category: FreeTrafficCategory, locale: string): string {
  const messages = LOCALE_MESSAGES[locale] ?? LOCALE_MESSAGES.en;
  const catalog = messages.freeTrafficCatalog;
  if (!catalog || typeof catalog !== "object") {
    return category;
  }
  const categories = (catalog as Record<string, unknown>).categories;
  if (!categories || typeof categories !== "object") {
    return category;
  }
  const label = (categories as Record<string, unknown>)[category];
  return typeof label === "string" ? label : category;
}

function resolvePremiumCategoryLabel(schemaSlug: string, locale: string): string {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) {
    return "Premium";
  }
  const groupId = SCHEMA_CATEGORY_TO_GROUP[schema.category];
  return resolvePremiumCatalogGroupLabel(groupId, locale);
}

function pushScored(
  bucket: Map<string, ScoredTool>,
  tool: ResolvedIndustryTool,
  score: number,
): void {
  if (score <= 0 || !tool.href || tool.href === "#") {
    return;
  }
  const existing = bucket.get(tool.href);
  if (!existing || score > existing.score) {
    bucket.set(tool.href, { ...tool, score });
  }
}

function finalize(bucket: Map<string, ScoredTool>): readonly ResolvedIndustryTool[] {
  return Array.from(bucket.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_TOOLS_PER_TIER)
    .map(({ score, ...tool }) => {
      void score;
      return tool;
    });
}

function scoreFreeTrafficTool(
  tool: FreeTrafficTool,
  industrySlug: IndustrySlug,
  keywords: readonly string[],
  locale: string,
  industryCategory: string | undefined,
): number {
  const localized = resolveFreeToolLocalizedCopy(tool.slug, locale);
  const title = localized.title ?? tool.title;
  const description = localized.description ?? tool.description;
  const corpus = [tool.slug, title, description, tool.seoTitle, tool.seoDescription].join(" ");

  let score = scoreKeywordHits(corpus, keywords);

  if (tool.relatedIndustrySlug === industrySlug) {
    score += 250;
  }

  const relatedCategories = industryCategory
    ? INDUSTRY_CATEGORY_FREE_CATEGORIES[industryCategory]
    : undefined;
  if (relatedCategories?.includes(tool.category)) {
    score += 35;
  }

  if (normalizeText(tool.slug).includes(normalizeText(industrySlug))) {
    score += 120;
  }

  return score;
}

export function resolveIndustryTools({
  locale,
  industrySlug,
}: ResolveIndustryToolsInput): ResolvedIndustryTools {
  const keywords = buildIndustryToolKeywords(industrySlug);
  const registryEntry = getIndustryRegistryEntry(industrySlug);
  const industryCategory = registryEntry?.category;

  const freeBucket = new Map<string, ScoredTool>();
  const premiumBucket = new Map<string, ScoredTool>();

  for (const tool of FREE_TRAFFIC_TOOLS) {
    const score = scoreFreeTrafficTool(tool, industrySlug, keywords, locale, industryCategory);
    const slugTitleScore = scoreKeywordHits(`${tool.slug} ${tool.title}`, keywords);
  if (score <= 0 || (tool.relatedIndustrySlug !== industrySlug && slugTitleScore < 30)) {
      continue;
    }
    const localized = resolveFreeToolLocalizedCopy(tool.slug, locale);
    pushScored(
      freeBucket,
      {
        title: localized.title ?? tool.title,
        description: resolveFreeToolCardDescription(tool, locale),
        href: `/tools/free/${tool.slug}`,
        categoryLabel: readFreeCategoryLabel(tool.category, locale),
        tier: "free",
        inputCount: tool.inputs.length,
        accent: resolveCalculatorCardAccent(tool.category, "free"),
      },
      score,
    );
  }

  for (const revenueTool of getAllRevenueToolSpecs()) {
    if (revenueTool.sector !== industrySlug) {
      continue;
    }

    const freeTitle = getLocalizedRevenueToolTitle(
      revenueTool.freeSlug,
      "free",
      locale,
      revenueTool.freeTitle,
    );
    const paidTitle = getLocalizedRevenueToolTitle(
      revenueTool.paidSlug,
      "paid",
      locale,
      revenueTool.paidTitle,
    );

    pushScored(
      freeBucket,
      {
        title: freeTitle,
        description: revenueTool.freeValue,
        href: getFreeToolHref(revenueTool),
        categoryLabel: registryEntry?.name ?? industrySlug,
        tier: "free",
        inputCount: revenueTool.freeInputs.length,
        accent: "blue",
      },
      300,
    );

    pushScored(
      premiumBucket,
      {
        title: paidTitle,
        description: revenueTool.paidValue,
        href: resolvePremiumToolHref(revenueTool.paidSlug),
        categoryLabel: registryEntry?.name ?? industrySlug,
        tier: "premium",
        inputCount: revenueTool.paidInputs.length,
        accent: "orange",
      },
      300,
    );
  }

  for (const item of getPremiumSchemasForIndustrySlug(industrySlug, locale, MAX_TOOLS_PER_TIER)) {
    const href = item.href.replace(/^\/[a-z]{2}\//, "/");
    const schema = getPremiumCalculatorSchema(item.slug);
    pushScored(
      premiumBucket,
      {
        title: item.title,
        description: item.painStatement,
        href,
        categoryLabel: resolvePremiumCategoryLabel(item.slug, locale),
        tier: "premium",
        inputCount: schema?.inputs.length,
        accent: resolveCalculatorCardAccent(item.category, "premium"),
      },
      500,
    );
  }

  for (const migration of PREMIUM_MIGRATION_MAP) {
    if (migration.sectorSlug !== industrySlug) {
      continue;
    }

    const schema = migration.schemaSlug
      ? getPremiumCalculatorSchema(migration.schemaSlug)
      : undefined;
    const href = schema
      ? getPremiumSchemaToolHref(schema.id)
      : resolvePremiumToolHref(migration.legacySlug);

    pushScored(
      premiumBucket,
      {
        title: getLocalizedRevenueToolTitle(
          migration.legacySlug,
          "paid",
          locale,
          migration.title,
        ),
        description: migration.migrationNote,
        href,
        categoryLabel: registryEntry?.name ?? industrySlug,
        tier: "premium",
        accent: resolveCalculatorCardAccent(migration.family, "premium"),
      },
      450,
    );
  }

  const free = finalize(freeBucket);
  const premium = finalize(premiumBucket);

  return {
    free,
    premium,
    hasTools: free.length > 0 || premium.length > 0,
  };
}
