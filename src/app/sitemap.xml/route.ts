/**
 * Sitemap index — points to 6 child sitemaps (pages, tools, premium-tools,
 * seo, guides, case-studies). This replaces the monolithic sitemap that
 * previously included duplicate /pricing?tool= URLs, non-HTML AI files,
 * hreflang noise, and wrong domain (sectorcalc-bf412.web.app).
 *
 * Domain: www.sectorcalc.com  (NOT sectorcalc.com, NOT web.app)
 * No hreflang (single-language EN site)
 * No lastmod (avoid fake timestamps — real dates require per-item tracking)
 * No /pricing?tool=...  (thin/duplicate content — crawl budget waste)
 * No .json / .txt / .jsonl  (robots.txt is the right place for those)
 */

const DOMAIN = "https://www.sectorcalc.com";
const TODAY = "2026-06-29";

const SEGMENTS = ["pages", "tools", "premium-tools", "seo", "guides", "case-studies"] as const;

export function GET(): Response {
  const sitemaps = SEGMENTS.map(
    (seg) =>
      `  <sitemap><loc>${DOMAIN}/sitemaps/${seg}.xml</loc><lastmod>${TODAY}</lastmod></sitemap>`,
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
