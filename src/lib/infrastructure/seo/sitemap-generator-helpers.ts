import { NextResponse } from "next/server";
import { SITE_BASE_URL } from "@/lib/infrastructure/seo/global-seo-config";
import {
  resolveSitemapLastModified,
  getCaseStudyLastModMap,
} from "@/lib/infrastructure/seo/resolve-sitemap-lastmod";
import type { SitemapManifestItem } from "@/lib/infrastructure/seo/sitemap-manifest";

// V5.3.1 root-only: no locale alternates, no hreflang, single URL per item.

export async function buildSitemapXmlString(items: readonly SitemapManifestItem[]): Promise<string> {
  const caseStudyLastMod = await getCaseStudyLastModMap();
  
  const urls: string[] = [];

  for (const item of items) {
    const lastmodDate = resolveSitemapLastModified(item.path, new Date(0), caseStudyLastMod);
    const hasValidLastMod = lastmodDate.getFullYear() > 1985;
    const lastmodTag = hasValidLastMod ? `\n    <lastmod>${lastmodDate.toISOString()}</lastmod>` : "";
    const changefreq = item.changeFrequency;
    const priority = item.priority.toFixed(2);

    // Root-only: single <url> entry per item, no locale prefix, no hreflang
    urls.push(`  <url>
    <loc>${SITE_BASE_URL}${item.path}</loc>${lastmodTag}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

export async function buildSitemapXmlResponse(items: readonly SitemapManifestItem[]): Promise<NextResponse> {
  const xml = await buildSitemapXmlString(items);
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
    const d = resolveSitemapLastModified(item.path, new Date(0), caseStudyLastMod);
    if (d.getFullYear() > 1985 && d > latest) {
      latest = d;
    }
  }

  // If no valid dates found, do NOT fallback to "now()", fallback to empty or omit.
  // But since getLatestLastMod is used in sitemapindex, sitemapindex <lastmod> is optional.
  // Returning empty string signals caller to omit it.
  if (latest.getTime() === 0) {
    return "";
  }

  return latest.toISOString();
}
