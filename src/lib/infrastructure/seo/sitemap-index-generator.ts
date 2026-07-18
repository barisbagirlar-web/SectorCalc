/**
 * Sitemap Index Generator — type-split architecture per SectorCalc mandate.
 *
 * sitemap.xml (index) → tools.xml | guides.xml | datasets.xml | categories.xml | faq.xml
 *
 * Each sub-sitemap URL entry carries hreflang alternates for 4 locales.
 * Lastmod timestamps are git-commit-derived with millisecond precision.
 */

import { SITE_BASE_URL } from "@/lib/infrastructure/seo/global-seo-config";
import {
  type SitemapManifestItem,
  getSitemapManifest,
} from "@/lib/infrastructure/seo/sitemap-manifest";

/** Sub-sitemap type identifiers per mandate spec. */
export type SubSitemapType = "tools" | "guides" | "datasets" | "categories" | "faq";

export interface SubSitemapMeta {
  readonly type: SubSitemapType;
  readonly filename: string;
  readonly label: string;
}

export const SUB_SITEMAPS: readonly SubSitemapMeta[] = [
  { type: "tools", filename: "sitemaps/tools.xml", label: "Calculation Tools" },
  { type: "guides", filename: "sitemaps/guides.xml", label: "Guides" },
  { type: "datasets", filename: "sitemaps/datasets.xml", label: "Datasets" },
  { type: "categories", filename: "sitemaps/categories.xml", label: "Categories" },
  { type: "faq", filename: "sitemaps/faq.xml", label: "FAQ" },
];

/** Map manifest route types to sub-sitemap types. */
const ROUTE_TYPE_TO_SUB_SITEMAP: Record<string, SubSitemapType> = {
  free_tool: "tools",
  premium_analyzer: "tools",
  authority_guide: "guides",
  seo_landing: "categories",
  core: "tools",
  hub: "categories",
  ai_index: "datasets",
};

function mapToSubSitemap(item: SitemapManifestItem): SubSitemapType {
  return ROUTE_TYPE_TO_SUB_SITEMAP[item.type] ?? "tools";
}

/** Filter manifest items for a specific sub-sitemap type. */
export function getSubSitemapItems(type: SubSitemapType): readonly SitemapManifestItem[] {
  const manifest = getSitemapManifest();
  return manifest.filter((item) => mapToSubSitemap(item) === type);
}

/** Hreflang locales per mandate — same as SUPPORTED_HREFLANG_LOCALES in metadata.ts. */
const HREFLANG_LOCALES = ["en", "tr", "de", "ar"] as const;

function buildHreflangXmlLinks(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const basePath = cleanPath === "/" ? "" : cleanPath;

  const links: string[] = [];
  for (const locale of HREFLANG_LOCALES) {
    const href = `${SITE_BASE_URL}/${locale}${basePath}`;
    const extra = locale === "en" ? ' x-default="true"' : "";
    links.push(`    <xhtml:link rel="alternate" hreflang="${locale}" href="${href}"${extra} />`);
  }
  return links.join("\n");
}

/** Build a single sub-sitemap XML string with hreflang alternates. */
export function buildSubSitemapXml(type: SubSitemapType, lastmod: Date): string {
  const items = getSubSitemapItems(type);
  const lastmodISO = lastmod.toISOString();

  const urlEntries: string[] = [];

  for (const item of items) {
    const path = item.path;
    const isRoot = path === "/";
    const loc = isRoot ? SITE_BASE_URL : `${SITE_BASE_URL}${path}`;
    const hreflangLinks = isRoot ? "" : buildHreflangXmlLinks(path);

    const hasHreflang = hreflangLinks.length > 0;
    const changefreq = item.changeFrequency;
    const priority = item.priority.toFixed(2);

    urlEntries.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmodISO}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${
      hasHreflang ? `\n${hreflangLinks}` : ""
    }
  </url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join("\n")}
</urlset>`;
}

/** Build sitemap index XML that references all type-split sub-sitemaps. */
export function buildSitemapIndexXml(lastmod: Date): string {
  const lastmodISO = lastmod.toISOString();

  const sitemapEntries = SUB_SITEMAPS.map((sub) => {
    return `  <sitemap>
    <loc>${SITE_BASE_URL}/${sub.filename}</loc>
    <lastmod>${lastmodISO}</lastmod>
  </sitemap>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join("\n")}
</sitemapindex>`;
}

/** Count total URLs across all sub-sitemaps. */
export function countTotalSitemapUrls(): number {
  return SUB_SITEMAPS.reduce((sum, sub) => sum + getSubSitemapItems(sub.type).length, 0);
}
