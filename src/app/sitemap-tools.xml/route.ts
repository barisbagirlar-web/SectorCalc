import {
  getFreeToolSitemapRoutes,
  getMigratedPremiumToolSitemapRoutes,
  getActiveCategorizedToolSitemapRoutes,
  getPremiumRevenueToolSitemapRoutes,
  getPremiumAnalyzerSitemapRoutes,
} from "@/lib/infrastructure/seo/sitemap-manifest";
import { buildSitemapXmlResponse } from "@/lib/infrastructure/seo/sitemap-generator-helpers";
import type { SitemapManifestItem } from "@/lib/infrastructure/seo/sitemap-manifest";

export const dynamic = "force-dynamic";

export async function GET() {
  const rawItems = [
    ...getFreeToolSitemapRoutes(),
    ...getMigratedPremiumToolSitemapRoutes(),
    ...getActiveCategorizedToolSitemapRoutes(),
    ...getPremiumRevenueToolSitemapRoutes(),
    ...getPremiumAnalyzerSitemapRoutes(),
  ];

  const seen = new Set<string>();
  const items: SitemapManifestItem[] = [];

  for (const item of rawItems) {
    if (!seen.has(item.path)) {
      seen.add(item.path);
      items.push(item);
    }
  }

  return buildSitemapXmlResponse(items);
}
