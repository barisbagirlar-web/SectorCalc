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
import {
  resolveSitemapLastModified,
  getCaseStudyLastModMap,
  getSitemapSourceLastModified,
} from "@/lib/infrastructure/seo/resolve-sitemap-lastmod";

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
  lean_tool: "tools",
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

/** Hreflang locales — MUST match metadata.ts buildHreflangLanguages() output.
 *  SectorCalc is "Pure English" global authority. tr/de/ar translations do not
 *  exist yet — not emitted to avoid Google "return URL errors".
 *  en is the canonical locale and also serves as x-default. */
const HREFLANG_LOCALES = ["en"] as const;

function buildHreflangXmlLinks(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const isRoot = cleanPath === "/";
  // Single-locale (en-only): hreflang href = canonical bare path (self-referencing).
  // Google expects the alternate URL to be the actual page URL in that locale.
  // Since all content is English and bare-path = canonical, use bare path.
  const href = isRoot ? SITE_BASE_URL : `${SITE_BASE_URL}${cleanPath}`;

  const links: string[] = [];
  for (const locale of HREFLANG_LOCALES) {
    const extra = locale === "en" ? ' x-default="true"' : "";
    links.push(`    <xhtml:link rel="alternate" hreflang="${locale}" href="${href}"${extra} />`);
  }
  return links.join("\n");
}

/**
 * Per-URL lastmod resolver contract.
 * Accepts the relative route path and returns the ISO 8601 lastmod string
 * resolved from git commit history, Firestore content dates, or source-file mtime.
 */
export type LastmodResolver = (routePath: string) => Date;

/**
 * Factory: create a per-URL lastmod resolver bound to a pre-fetched
 * case-study map for sitemap handlers that do not run inside React components.
 */
export function createSitemapLastmodResolver(
  caseStudyLastMod: ReadonlyMap<string, Date>,
): LastmodResolver {
  const fallback = getSitemapSourceLastModified();
  return (routePath: string) =>
    resolveSitemapLastModified(routePath, fallback, caseStudyLastMod);
}

/**
 * Resolve and cache the case-study lastmod map for all sub-sitemap handlers.
 * Call once per request (React cache deduplicates).
 */
export { getCaseStudyLastModMap };

/** Build a single sub-sitemap XML string with per-URL lastmod + hreflang alternates. */
export function buildSubSitemapXml(
  type: SubSitemapType,
  resolveLastmod: LastmodResolver,
): string {
  const items = getSubSitemapItems(type);

  // FAIL-SAFE: Emit an empty-but-valid XML on zero items rather than crashing,
  // but log a structured warning for observability.
  // A persistent zero-item sub-sitemap indicates registry corruption or
  // an entire content category being accidentally quarantined.
  if (items.length === 0) {
    console.warn(
      `[sitemap] WARNING: Sub-sitemap "${type}" has 0 URLs. ` +
      `This may indicate an accidental content quarantine or registry corruption. ` +
      `The XML will be emitted but empty — verify manifest integrity.`,
    );
  }

  const urlEntries: string[] = [];

  for (const item of items) {
    const path = item.path;
    const isRoot = path === "/";
    const loc = isRoot ? SITE_BASE_URL : `${SITE_BASE_URL}${path}`;
    const hreflangLinks = isRoot ? "" : buildHreflangXmlLinks(path);

    const hasHreflang = hreflangLinks.length > 0;
    const lastmodISO = resolveLastmod(path).toISOString();

    // Priority + changefreq are sourced from the sitemap manifest (single
    // source of truth); rounding to one decimal is a presentation-layer
    // concern only. Element order follows the sitemaps.org XSD:
    // loc, lastmod, changefreq, priority, then hreflang alternates.
    const changefreq = item.changeFrequency;
    const priority = Math.min(1, Math.max(0, item.priority)).toFixed(1);

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
export function buildSitemapIndexXml(lastmod?: Date): string {
  const resolvedLastmod = lastmod ?? getSitemapSourceLastModified();
  const lastmodISO = resolvedLastmod.toISOString();

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
