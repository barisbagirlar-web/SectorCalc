// @ts-nocheck
import { isFinanceLikeTool } from "@/lib/features/ai/is-finance-like-tool";
import type {
  AiCategoryIndexRecord,
  AiSearchManifestDocument,
  AiToolIndexDocument,
  AiToolIndexRecord,
  AiToolRoutesDocument,
  AiRouteStatus,
} from "@/lib/features/ai/tool-retrieval-types";
import { AI_SEARCH_RANKING_WEIGHTS } from "@/lib/features/ai/rank-tool-results";
import {
  buildCategorizedToolIndex,
  listCategorizedCategorySummaries,
  type CategorizedToolItem,
} from "@/lib/catalog/build-categorized-tool-index";
import {
  listGlobalCategories,
  resolveGlobalCategoryTitle,
} from "@/lib/catalog/global-tool-category-taxonomy";
import { getFormulaContractBySlug } from "@/lib/features/formula-governance/contracts";
import { type SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";
import { absoluteLocalizedUrl, SITE_URL } from "@/lib/features/semantic/site-url";

const CATEGORY_INTENT: Record<string, readonly string[]> = {
  "finance-sales-working-capital": ["finance", "pricing", "cash-flow", "tax", "working-capital"],
  "lean-production": ["production", "oee", "efficiency", "throughput"],
  "quality-six-sigma": ["quality", "spc", "six-sigma", "statistics"],
  "workforce-hr": ["hr", "payroll", "workforce", "labor"],
  "procurement-supply-chain": ["logistics", "procurement", "shipping", "inventory"],
  "sustainability-resource-esg": ["sustainability", "carbon", "energy", "esg"],
  "mechanical-hvac-energy-loss": ["mechanical", "hvac", "energy", "engineering"],
  "electrical-power-systems": ["electrical", "power", "voltage", "cabling"],
  "maintenance-reliability": ["maintenance", "reliability", "asset-life"],
  "hse-ergonomics": ["safety", "hse", "ergonomics", "compliance"],
};

function buildLocaleUrls(path: string): Record<string, string> {
  const urls: Record<string, string> = {};
  for (const locale of ['en']) {
    urls[locale] = absoluteLocalizedUrl(locale, path);
  }
  return urls;
}

function buildCategoryAnchorPath(categorySlug: string, toolSlug: string): string {
  return `/pro-tools/${categorySlug}#tool-${toolSlug}`;
}

function resolveRouteStatus(item: CategorizedToolItem): AiRouteStatus {
  if (item.publicStatus === "active" && item.routePath) {
    return "active-route";
  }
  return "category-only";
}

function resolveCanonicalPath(item: CategorizedToolItem, routeStatus: AiRouteStatus): string {
  if (routeStatus === "active-route" && item.routePath) {
    return item.routePath;
  }
  if (routeStatus === "redirected") {
    return `/tools/premium/${item.slug}`;
  }
  return buildCategoryAnchorPath(item.categorySlug, item.slug);
}

function slugTokens(slug: string): readonly string[] {
  return slug.split("-").filter(Boolean);
}

function buildKeywords(item: CategorizedToolItem): AiToolIndexRecord["keywords"] {
  const keywords: AiToolIndexRecord["keywords"] = {};
  for (const locale of ['en']) {
    const title = item.title[locale] ?? item.title.en ?? item.slug;
    const description = item.description[locale] ?? item.description.en ?? "";
    const tokens = new Set<string>([
      ...slugTokens(item.slug),
      ...title.toLowerCase().split(/\s+/).filter((part) => part.length > 2),
      item.categorySlug,
      item.tier,
    ]);
    for (const part of description.toLowerCase().split(/\s+/).slice(0, 12)) {
      if (part.length > 3) {
        tokens.add(part.replace(/[^\p{L}\p{N}]/gu, ""));
      }
    }
    keywords[locale] = [...tokens].filter(Boolean).slice(0, 24);
  }
  return keywords;
}

function buildToolRecord(item: CategorizedToolItem): AiToolIndexRecord {
  const routeStatus = resolveRouteStatus(item);
  const canonicalPath = resolveCanonicalPath(item, routeStatus);
  const categoryTitle = Object.fromEntries(
    ['en'].map((locale) => [
      locale,
      resolveGlobalCategoryTitle(
        listGlobalCategories().find((entry) => entry.slug === item.categorySlug) ?? {
          slug: item.categorySlug,
          trTitle: item.categorySlug,
          enTitle: item.categorySlug,
        },
        locale,
      ),
    ]),
  );
  const formula = getFormulaContractBySlug(item.slug)?.toolName;
  const pain = item.description.en ?? item.description.tr ?? "";
  const titleEn = item.title.en ?? item.slug;
  const descriptionEn = item.description.en ?? pain;

  return {
    slug: item.slug,
    title: item.title,
    description: item.description,
    localeUrls: buildLocaleUrls(canonicalPath),
    canonicalUrl: absoluteLocalizedUrl("en", canonicalPath),
    categorySlug: item.categorySlug,
    categoryTitle,
    tier: item.tier,
    routeStatus,
    keywords: buildKeywords(item),
    intent: CATEGORY_INTENT[item.categorySlug] ?? ["calculator", "decision-support"],
    industries: item.tier === "premium" ? ["sector-analyzer"] : ["cross-industry"],
    formula,
    pain: pain.slice(0, 240),
    source: item.source,
    isFinanceLike: isFinanceLikeTool({
      slug: item.slug,
      title: titleEn,
      description: descriptionEn,
      categorySlug: item.categorySlug,
    }),
  };
}

export function buildAiCategoryRecords(): readonly AiCategoryIndexRecord[] {
  const summaries = new Map(listCategorizedCategorySummaries().map((entry) => [entry.slug, entry]));
  return listGlobalCategories().map((category) => {
    const summary = summaries.get(category.slug);
    const categoryTitle = Object.fromEntries(
      ['en'].map((locale) => [locale, resolveGlobalCategoryTitle(category, locale)]),
    );
    const summaryText = Object.fromEntries(
      ['en'].map((locale) => [locale, category.summary]),
    );
    return {
      slug: category.slug,
      title: categoryTitle,
      summary: summaryText,
      toolCount: summary?.totalToolCount ?? 0,
      categoryUrl: buildLocaleUrls(`/pro-tools/${category.slug}`),
    };
  });
}

export function buildAiToolIndexDocument(): AiToolIndexDocument {
  const tools = buildCategorizedToolIndex().map(buildToolRecord).sort((a, b) => a.slug.localeCompare(b.slug));
  const categories = buildAiCategoryRecords();
  const totalActiveRoutes = tools.filter((tool) => tool.routeStatus === "active-route").length;
  const totalCategoryOnly = tools.filter((tool) => tool.routeStatus === "category-only").length;
  const totalRedirected = tools.filter((tool) => tool.routeStatus === "redirected").length;

  return {
    site: "SectorCalc",
    baseUrl: SITE_URL as "https://sectorcalc.com",
    generatedAt: new Date().toISOString(),
    totalTools: tools.length,
    totalActiveRoutes,
    totalCategoryOnly,
    totalRedirected,
    
    categories,
    tools,
  };
}

export function buildAiToolRoutesDocument(index: AiToolIndexDocument): AiToolRoutesDocument {
  const categorized = buildCategorizedToolIndex();
  const bySlug = new Map(categorized.map((item) => [item.slug, item]));

  return {
    generatedAt: index.generatedAt,
    activeRoutes: index.tools
      .filter((tool) => tool.routeStatus === "active-route")
      .map((tool) => {
        const item = bySlug.get(tool.slug);
        const routePath = item?.routePath ?? `/tools/premium/${tool.slug}`;
        return {
          slug: tool.slug,
          routePath,
          localeUrls: buildLocaleUrls(routePath),
          tier: tool.tier,
        };
      }),
    categoryOnly: index.tools
      .filter((tool) => tool.routeStatus === "category-only")
      .map((tool) => ({
        slug: tool.slug,
        categorySlug: tool.categorySlug,
        anchorId: `tool-${tool.slug}`,
        canonicalUrl: tool.localeUrls,
      })),
    redirected: index.tools
      .filter((tool) => tool.routeStatus === "redirected")
      .map((tool) => ({
        slug: tool.slug,
        fromPath: `/tools/free/${tool.slug}`,
        toPath: `/tools/premium/${tool.slug}`,
        localeUrls: buildLocaleUrls(`/tools/premium/${tool.slug}`),
      })),
  };
}

export function buildAiSearchManifestDocument(): AiSearchManifestDocument {
  return {
    version: "1.0",
    retrievalMode: "metadata-keyword-rag-lite",
    futureEmbeddingReady: true,
    maxRecommendedResults: 8,
    searchFields: [
      "slug",
      "title",
      "description",
      "keywords",
      "intent",
      "industries",
      "categorySlug",
      "categoryTitle",
      "formula",
      "pain",
    ],
    rankingWeights: { ...AI_SEARCH_RANKING_WEIGHTS },
    embeddingSimilarity: {
      status: "reserved",
      enabled: false,
      note: "Will be enabled when vector or embedding retrieval is added.",
    },
  };
}

export function buildAiCategoriesDocument(index: AiToolIndexDocument) {
  return {
    generatedAt: index.generatedAt,
    totalCategories: index.categories.length,
    categories: index.categories,
  };
}

export function buildAiToolIndexTxt(
  index: AiToolIndexDocument,
  locale: any = "en",
): string {
  const lines = [
    "# SectorCalc AI Tool Index",
    `# Site: ${index.baseUrl}`,
    `# Generated: ${index.generatedAt}`,
    `# Total tools: ${index.totalTools}`,
    `# Active routes: ${index.totalActiveRoutes}`,
    `# Category-only: ${index.totalCategoryOnly}`,
    `# Redirected: ${index.totalRedirected}`,
    "",
  ];

  for (const tool of index.tools) {
    const title = tool.title[locale] ?? tool.title.en ?? tool.slug;
    const description = tool.description[locale] ?? tool.description.en ?? "";
    const categoryTitle = tool.categoryTitle[locale] ?? tool.categoryTitle.en ?? tool.categorySlug;
    lines.push(`## ${tool.slug}`);
    lines.push(`- title: ${title}`);
    lines.push(`- description: ${description}`);
    lines.push(`- canonicalUrl: ${tool.canonicalUrl}`);
    lines.push(`- tier: ${tool.tier}`);
    lines.push(`- category: ${tool.categorySlug} (${categoryTitle})`);
    lines.push(`- routeStatus: ${tool.routeStatus}`);
    if (tool.intent.length > 0) {
      lines.push(`- intent: ${tool.intent.join(", ")}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}
