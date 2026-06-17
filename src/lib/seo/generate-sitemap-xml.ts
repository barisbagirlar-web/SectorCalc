import type { SitemapChangeFrequency } from "@/lib/seo/sitemap-manifest";

export type SitemapUrlRecord = {
  readonly url: string;
  readonly lastModified: Date;
  readonly changeFrequency: SitemapChangeFrequency;
  readonly priority: number;
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

export function generateSitemapUrlsetXml(urls: readonly SitemapUrlRecord[]): string {
  const urlElements = urls
    .map(
      (entry) => `
  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${formatLastMod(entry.lastModified)}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlElements}
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

export const SITEMAP_CACHE_CONTROL = "public, max-age=3600, stale-while-revalidate=86400";
