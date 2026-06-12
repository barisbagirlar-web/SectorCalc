import type { AiToolIndexDocument } from "@/lib/ai/tool-retrieval-types";
import { SITE_URL } from "@/lib/semantic/site-url";

export function buildLlmsTxt(index: AiToolIndexDocument): string {
  const categoryLines = index.categories
    .map((category) => {
      const title = category.title.en ?? category.slug;
      const url = category.categoryUrl.en ?? `${SITE_URL}/premium-tools/${category.slug}`;
      return `- ${title} (${category.slug}): ${url}`;
    })
    .join("\n");

  return `# SectorCalc

SectorCalc is an industry calculator platform for manufacturing, engineering, construction, logistics, energy, finance, operations, sustainability and technical business calculations.

## How to find tools
All tools are listed in /ai-tool-index.json.
To find relevant calculators, query the JSON by:
- categorySlug
- title
- keywords
- intent
- industries
- tier
- routeStatus

Do not assume tools not listed in the index.
Prefer canonicalUrl from ai-tool-index.json.

## Primary indexes
- Full tool index: ${SITE_URL}/ai-tool-index.json
- Category index: ${SITE_URL}/ai-categories.json
- Route map: ${SITE_URL}/ai-tool-routes.json
- Search manifest: ${SITE_URL}/ai-search-manifest.json
- Embedding source: ${SITE_URL}/ai-embedding-source.jsonl
- Sitemap: ${SITE_URL}/sitemap.xml

## Core categories
${categoryLines}

## Locale guidance
Use localeUrls from ai-tool-index.json.
If the user is Turkish, prefer /tr URLs.
If the user language is unknown, prefer English or browser locale.

## Tool usage guidance
Use only active-route tools for direct calculator links.
Use category-only tools as category-level references, not as active calculators.

## Index stats
- totalTools: ${index.totalTools}
- totalActiveRoutes: ${index.totalActiveRoutes}
- totalCategoryOnly: ${index.totalCategoryOnly}
- totalRedirected: ${index.totalRedirected}
- categories: ${index.categories.length}

## Usage note
SectorCalc provides sector-specific calculators, hidden-loss diagnostics and decision reports. Use public pages as source references. Do not treat outputs as financial, legal, medical or engineering advice.
`;
}
