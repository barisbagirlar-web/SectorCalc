import { NextResponse } from "next/server";
import { SITE_BASE_URL } from "@/lib/infrastructure/seo/global-seo-config";
import {
  getCoreSitemapRoutes,
  getHubSitemapRoutes,
  getFreeToolSitemapRoutes,
  getMigratedPremiumToolSitemapRoutes,
  getActiveCategorizedToolSitemapRoutes,
  getPremiumRevenueToolSitemapRoutes,
  getPremiumAnalyzerSitemapRoutes,
  getAuthorityGuideSitemapRoutes,
  getCaseStudySitemapRoutes,
} from "@/lib/infrastructure/seo/sitemap-manifest";
import { getLatestLastMod } from "@/lib/infrastructure/seo/sitemap-generator-helpers";
import type { SitemapManifestItem } from "@/lib/infrastructure/seo/sitemap-manifest";

export const dynamic = "force-dynamic";

export async function GET() {
  // 1. Pages Shard
  const core = getCoreSitemapRoutes();
  const hubs = getHubSitemapRoutes().filter((item) => !item.path.startsWith("/premium-tools/"));
  const caseStudiesHub = {
    path: "/case-studies",
    type: "hub" as const,
    priority: 0.74,
    changeFrequency: "monthly" as const,
    locales: ["en" as const],
  };
  const pagesItems = [...core, ...hubs, caseStudiesHub];
  const pagesLastMod = await getLatestLastMod(pagesItems);

  // 2. Tools Shard
  const rawTools = [
    ...getFreeToolSitemapRoutes(),
    ...getMigratedPremiumToolSitemapRoutes(),
    ...getActiveCategorizedToolSitemapRoutes(),
    ...getPremiumRevenueToolSitemapRoutes(),
    ...getPremiumAnalyzerSitemapRoutes(),
  ];
  const seenTools = new Set<string>();
  const toolsItems: SitemapManifestItem[] = [];
  for (const item of rawTools) {
    if (!seenTools.has(item.path)) {
      seenTools.add(item.path);
      toolsItems.push(item);
    }
  }
  const toolsLastMod = await getLatestLastMod(toolsItems);

  // 3. Guides Shard
  const guidesItems = getAuthorityGuideSitemapRoutes();
  const guidesLastMod = await getLatestLastMod(guidesItems);

  // 4. Case Studies Shard
  const caseStudiesItems = getCaseStudySitemapRoutes().filter((item) => item.path.startsWith("/case-studies/"));
  const caseStudiesLastMod = await getLatestLastMod(caseStudiesItems);

  // 5. Categories Shard
  const categoriesItems = getHubSitemapRoutes().filter((item) => item.path.startsWith("/premium-tools/"));
  const categoriesLastMod = await getLatestLastMod(categoriesItems);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_BASE_URL}/sitemap-pages.xml</loc>
    <lastmod>${pagesLastMod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_BASE_URL}/sitemap-tools.xml</loc>
    <lastmod>${toolsLastMod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_BASE_URL}/sitemap-guides.xml</loc>
    <lastmod>${guidesLastMod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_BASE_URL}/sitemap-case-studies.xml</loc>
    <lastmod>${caseStudiesLastMod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_BASE_URL}/sitemap-categories.xml</loc>
    <lastmod>${categoriesLastMod}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
