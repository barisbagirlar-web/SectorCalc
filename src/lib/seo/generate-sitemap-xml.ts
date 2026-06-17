import { createHash } from "node:crypto";
import type { SitemapChangeFrequency } from "@/lib/seo/sitemap-manifest";

export type SitemapAlternateLink = {
  readonly hreflang: string;
  readonly href: string;
};

export type SitemapUrlRecord = {
  readonly url: string;
  readonly lastModified: Date;
  readonly changeFrequency: SitemapChangeFrequency;
  readonly priority: number;
  readonly alternates?: readonly SitemapAlternateLink[];
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatLastMod(date: Date): string {
  return date.toISOString();
}

function renderAlternateLinks(alternates: readonly SitemapAlternateLink[] | undefined): string {
  if (!alternates?.length) {
    return "";
  }

  return alternates
    .map(
      (alternate) =>
        `\n    <xhtml:link rel="alternate" hreflang="${escapeXml(alternate.hreflang)}" href="${escapeXml(alternate.href)}" />`,
    )
    .join("");
}

export function generateSitemapUrlsetXml(urls: readonly SitemapUrlRecord[]): string {
  const urlElements = urls
    .map((entry) => {
      const alternateLinks = renderAlternateLinks(entry.alternates);
      return `
  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${formatLastMod(entry.lastModified)}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>${alternateLinks}
  </url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urlElements}
</urlset>`;
}

export function generateSitemapIndexXml(
  sitemaps: readonly { readonly url: string; readonly lastModified: Date }[],
): string {
  const entries = sitemaps
    .map(
      (entry) => `
  <sitemap>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${formatLastMod(entry.lastModified)}</lastmod>
  </sitemap>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}
</sitemapindex>`;
}

export function computeSitemapEtag(body: string): string {
  return `"${createHash("sha256").update(body).digest("hex").slice(0, 16)}"`;
}

export const SITEMAP_CACHE_CONTROL = "public, max-age=3600, stale-while-revalidate=86400";

export function createSitemapXmlResponse(
  body: string,
  request: Request,
): Response {
  const etag = computeSitemapEtag(body);
  const ifNoneMatch = request.headers.get("if-none-match");

  if (ifNoneMatch === etag) {
    return new Response(null, {
      status: 304,
      headers: {
        ETag: etag,
        "Cache-Control": SITEMAP_CACHE_CONTROL,
      },
    });
  }

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": SITEMAP_CACHE_CONTROL,
      ETag: etag,
    },
  });
}
