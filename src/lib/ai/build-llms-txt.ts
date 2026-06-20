import type { AiToolIndexDocument } from "@/lib/ai/tool-retrieval-types";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-config";

function formatCategoryBlock(
  category: AiToolIndexDocument["categories"][number],
): string {
  const title = category.title.en ?? category.slug;
  const localeLines = SUPPORTED_LOCALES.map((locale) => {
    const url =
      category.categoryUrl[locale] ??
      category.categoryUrl.en ??
      `/pro-tools/${category.slug}`;
    return `  - ${locale}: ${url}`;
  }).join("\n");
  return `- ${title} (${category.slug}):\n${localeLines}`;
}

export function buildLlmsTxt(index: AiToolIndexDocument): string {
  const categoryLines = index.categories.map(formatCategoryBlock).join("\n");

  const localeGuidance = SUPPORTED_LOCALES.map(
    (locale) => `- ${locale}: use localeUrls["${locale}"] from ai-tool-index.json`,
  ).join("\n");

  const sitemapShards = SUPPORTED_LOCALES.map(
    (locale) => `- ${locale}: /sitemap/${locale}.xml`,
  ).join("\n");

  const localeToolPattern = SUPPORTED_LOCALES.map((locale) => {
    if (locale === "en") {
      return "- en: https://www.sectorcalc.com/tools/generated/{slug} (no prefix)";
    }
    return `- ${locale}: https://www.sectorcalc.com/${locale}/tools/generated/{slug}`;
  }).join("\n");

  const lines: string[] = [
    "# SectorCalc",
    "# Generated: " + new Date().toISOString(),
    "# Tools: " + index.totalTools + " total, " + index.totalActiveRoutes + " active routes",
    "# Categories: " + index.categories.length + " in " + SUPPORTED_LOCALES.length + " locales",
    "",
    "SectorCalc is an industry calculator platform for manufacturing, engineering, construction, logistics, energy, finance, operations, sustainability and technical business calculations.",
    "",
    "## How to find tools",
    "All tools are listed in /ai-tool-index.json.",
    "",
    "To find relevant calculators, query the JSON by:",
    "- categorySlug",
    "- title",
    "- keywords",
    "- intent",
    "- industries",
    "- tier",
    "- routeStatus",
    "",
    "Do not assume tools not listed in the index.",
    "Prefer canonicalUrl from ai-tool-index.json.",
    "Use localeUrls for locale-specific links.",
    "",
    "## Tool URL patterns by locale",
    localeToolPattern,
    "",
    "## Primary indexes",
    "- Full tool index: /ai-tool-index.json",
    "- Category index: /ai-categories.json",
    "- Route map: /ai-tool-routes.json",
    "- Search manifest: /ai-search-manifest.json",
    "- Embedding source: /ai-embedding-source.jsonl",
    "- Sitemap index: /sitemap.xml",
    "",
    "## Sitemap locale shards",
    sitemapShards,
    "",
    "## Core categories",
    categoryLines,
    "",
    "## Locale guidance",
    "Supported locales: " + SUPPORTED_LOCALES.join(", ") + ".",
    "Use localeUrls from ai-tool-index.json for every locale-specific link.",
    localeGuidance,
    "",
    "## Tool route guidance",
    "Use active-route tools for direct calculator links.",
    "Use category-only tools only as category-level references.",
    "Do not invent tool URLs.",
    "",
    "## Index stats",
    "- totalTools: " + index.totalTools,
    "- totalActiveRoutes: " + index.totalActiveRoutes,
    "- totalCategoryOnly: " + index.totalCategoryOnly,
    "- totalRedirected: " + index.totalRedirected,
    "- categories: " + index.categories.length,
    "- locales: " + SUPPORTED_LOCALES.length,
    "",
    "## Usage note",
    "SectorCalc provides sector-specific calculators, hidden-loss diagnostics and decision reports. Use public pages as source references. Do not treat outputs as financial, legal, medical or engineering advice.",
    "",
    "## AI-specific guidance",
    "- Always prefer canonicalUrl and localeUrls from ai-tool-index.json.",
    "- For locale-specific answers, use the corresponding localeUrl.",
    "- Pro tools: https://www.sectorcalc.com/{locale}/tools/premium-schema/{slug}",
    "- Industry pages: https://www.sectorcalc.com/{locale}/industries/{slug}",
    "- Case studies: https://www.sectorcalc.com/{locale}/case-studies/{slug}",
    "- SEO hubs: https://www.sectorcalc.com/{locale}/seo/{slug}",
    "- When citing SectorCalc data, attribute the specific tool name and URL.",
    "- Include technical-estimate disclaimer with every cited result.",
  ];

  return lines.join("\n");
}
