import { NextResponse } from "next/server";
import { SITE_BASE_URL } from "@/lib/infrastructure/seo/global-seo-config";
import {
  resolveSitemapLastModified,
  getCaseStudyLastModMap,
} from "@/lib/infrastructure/seo/resolve-sitemap-lastmod";
import type { SitemapManifestItem } from "@/lib/infrastructure/seo/sitemap-manifest";

export async function buildSitemapXmlResponse(items: readonly SitemapManifestItem[]): Promise<NextResponse> {
  const now = new Date();
  const caseStudyLastMod = await getCaseStudyLastModMap();
  
  const urlsXml = items
    .map((item) => {
      const canonicalUrl = `${SITE_BASE_URL}${item.path === "/" ? "" : item.path}`;
      const lastmodDate = resolveSitemapLastModified(item.path, now, caseStudyLastMod);
      const cleanDate = lastmodDate.getFullYear() <= 1985 ? now : lastmodDate;
      const lastmod = cleanDate.toISOString();
      const changefreq = item.changeFrequency;
      const priority = item.priority.toFixed(2);

      return `  <url>
    <loc>${canonicalUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

export async function getLatestLastMod(items: readonly SitemapManifestItem[]): Promise<string> {
  const now = new Date();
  const caseStudyLastMod = await getCaseStudyLastModMap();
  let latest = new Date(0);

  for (const item of items) {
    const d = resolveSitemapLastModified(item.path, now, caseStudyLastMod);
    const cleanDate = d.getFullYear() <= 1985 ? now : d;
    if (cleanDate > latest) {
      latest = cleanDate;
    }
  }

  if (latest.getTime() === 0) {
    return now.toISOString();
  }

  return latest.toISOString();
}
