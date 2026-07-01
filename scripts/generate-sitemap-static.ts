/**
 * Build-time sitemap shards + index — served from public/ on CDN.
 * This guarantees sitemaps are served as fast static files by Firebase Hosting.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
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
import {
  buildSitemapXmlString,
  getLatestLastMod,
} from "@/lib/infrastructure/seo/sitemap-generator-helpers";
import type { SitemapManifestItem } from "@/lib/infrastructure/seo/sitemap-manifest";

async function main(): Promise<void> {
  const outDir = join(process.cwd(), "public");
  mkdirSync(outDir, { recursive: true });

  let totalUrls = 0;

  console.log(`generate:sitemap-static — Generating static sitemap shards...`);

  // 1. Pages Shard
  const core = getCoreSitemapRoutes();
  const hubs = getHubSitemapRoutes().filter((item) => !item.path.startsWith("/premium-tools/"));
  const caseStudiesHub: SitemapManifestItem = {
    path: "/case-studies",
    type: "hub",
    priority: 0.74,
    changeFrequency: "monthly",
    locales: ["en"],
  };
  const pagesItems = [...core, ...hubs, caseStudiesHub];
  const pagesLastMod = await getLatestLastMod(pagesItems);
  const pagesXml = await buildSitemapXmlString(pagesItems);
  writeFileSync(join(outDir, "sitemap-pages.xml"), pagesXml, "utf8");
  totalUrls += pagesItems.length;
  console.log(`  sitemap-pages.xml — ${pagesItems.length} URLs`);

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
  const toolsXml = await buildSitemapXmlString(toolsItems);
  writeFileSync(join(outDir, "sitemap-tools.xml"), toolsXml, "utf8");
  totalUrls += toolsItems.length;
  console.log(`  sitemap-tools.xml — ${toolsItems.length} URLs`);

  // 3. Guides Shard
  const guidesItems = getAuthorityGuideSitemapRoutes();
  const guidesLastMod = await getLatestLastMod(guidesItems);
  const guidesXml = await buildSitemapXmlString(guidesItems);
  writeFileSync(join(outDir, "sitemap-guides.xml"), guidesXml, "utf8");
  totalUrls += guidesItems.length;
  console.log(`  sitemap-guides.xml — ${guidesItems.length} URLs`);

  // 4. Case Studies Shard
  const caseStudiesItems = getCaseStudySitemapRoutes().filter((item) => item.path.startsWith("/case-studies/"));
  const caseStudiesLastMod = await getLatestLastMod(caseStudiesItems);
  const caseStudiesXml = await buildSitemapXmlString(caseStudiesItems);
  writeFileSync(join(outDir, "sitemap-case-studies.xml"), caseStudiesXml, "utf8");
  totalUrls += caseStudiesItems.length;
  console.log(`  sitemap-case-studies.xml — ${caseStudiesItems.length} URLs`);

  // 5. Categories Shard
  const categoriesItems = getHubSitemapRoutes().filter((item) => item.path.startsWith("/premium-tools/"));
  const categoriesLastMod = await getLatestLastMod(categoriesItems);
  const categoriesXml = await buildSitemapXmlString(categoriesItems);
  writeFileSync(join(outDir, "sitemap-categories.xml"), categoriesXml, "utf8");
  totalUrls += categoriesItems.length;
  console.log(`  sitemap-categories.xml — ${categoriesItems.length} URLs`);

  // Helper for optional lastmod in index
  const lmTag = (d: string) => (d ? `\n    <lastmod>${d}</lastmod>` : "");

  // 6. Index Sitemap
  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_BASE_URL}/sitemap-pages.xml</loc>${lmTag(pagesLastMod)}
  </sitemap>
  <sitemap>
    <loc>${SITE_BASE_URL}/sitemap-tools.xml</loc>${lmTag(toolsLastMod)}
  </sitemap>
  <sitemap>
    <loc>${SITE_BASE_URL}/sitemap-guides.xml</loc>${lmTag(guidesLastMod)}
  </sitemap>
  <sitemap>
    <loc>${SITE_BASE_URL}/sitemap-case-studies.xml</loc>${lmTag(caseStudiesLastMod)}
  </sitemap>
  <sitemap>
    <loc>${SITE_BASE_URL}/sitemap-categories.xml</loc>${lmTag(categoriesLastMod)}
  </sitemap>
</sitemapindex>`;
  writeFileSync(join(outDir, "sitemap.xml"), indexXml, "utf8");
  console.log(`  sitemap.xml (index) — 5 shards`);

  console.log(
    `generate:sitemap-static — DONE base=${SITE_BASE_URL} totalUrls=${totalUrls} (static XMLs written to public/)`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
