import type { MetadataRoute } from "next";
import { SITE_BASE_URL } from "@/lib/infrastructure/seo/global-seo-config";
import {
  getCaseStudyLastModMap,
  resolveSitemapLastModified,
} from "@/lib/infrastructure/seo/resolve-sitemap-lastmod";
import {
  getSitemapManifest,
  getPremiumSchemaRoutePath,
  getProgrammaticSeoRoutePath,
  countAuthorityGuideSitemapEntries,
  countExpectedSitemapMinimum,
  SITEMAP_STATIC_ROUTES,
} from "@/lib/infrastructure/seo/sitemap-manifest";

export {
  countAuthorityGuideSitemapEntries,
  countExpectedSitemapMinimum,
  getPremiumSchemaRoutePath,
  getProgrammaticSeoRoutePath,
  SITEMAP_STATIC_ROUTES,
};

const EXCLUDED_PATTERNS = [
  /\.(json|jsonl|txt|xml)$/i,
  /^\/(api|admin|tr|de|fr|es|ar)(\/|$)/i,
];

function isPathAllowed(path: string): boolean {
  return !EXCLUDED_PATTERNS.some((pattern) => pattern.test(path));
}

export async function buildSitemapEntries(buildTime?: Date): Promise<MetadataRoute.Sitemap> {
  const now = buildTime ?? new Date();
  const manifest = getSitemapManifest();
  const caseStudyLastMod = await getCaseStudyLastModMap();
  const entries: MetadataRoute.Sitemap = [];

  const manifestPaths = new Set<string>();

  for (const item of manifest) {
    if (!isPathAllowed(item.path)) {
      continue;
    }
    manifestPaths.add(item.path);

    const rawDate = resolveSitemapLastModified(item.path, now, caseStudyLastMod);
    const cleanDate = rawDate.getFullYear() <= 1985 ? now : rawDate;
    const canonicalUrl = `${SITE_BASE_URL}${item.path === "/" ? "" : item.path}`;

    entries.push({
      url: canonicalUrl,
      lastModified: cleanDate,
      alternates: {
        
      },
    });
  }

  // Include Firestore case studies if they aren't already in the manifest
  for (const [slug] of caseStudyLastMod) {
    const path = `/case-studies/${slug}`;
    if (manifestPaths.has(path) || !isPathAllowed(path)) {
      continue;
    }

    const rawDate = caseStudyLastMod.get(slug) ?? now;
    const cleanDate = rawDate.getFullYear() <= 1985 ? now : rawDate;
    const canonicalUrl = `${SITE_BASE_URL}${path}`;

    entries.push({
      url: canonicalUrl,
      lastModified: cleanDate,
      alternates: {},
    });
  }

  // Deduplicate entries by url and sort alphabetically
  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of entries) {
    if (!byUrl.has(entry.url)) {
      byUrl.set(entry.url, entry);
    }
  }

  return [...byUrl.values()].sort((left, right) => left.url.localeCompare(right.url));
}
