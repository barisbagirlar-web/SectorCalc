import type { MetadataRoute } from "next";
import { SITE_BASE_URL } from "@/lib/infrastructure/seo/global-seo-config";
import {
  buildAlternates,
  buildLocalizedUrl,
  countAuthorityGuideSitemapEntries,
  countExpectedSitemapMinimum,
  getPremiumSchemaRoutePath,
  getProgrammaticSeoRoutePath,
  getSitemapManifest,
  SITEMAP_STATIC_ROUTES,
} from "@/lib/infrastructure/seo/sitemap-manifest";

export {
  countAuthorityGuideSitemapEntries,
  countExpectedSitemapMinimum,
  getPremiumSchemaRoutePath,
  getProgrammaticSeoRoutePath,
  SITEMAP_STATIC_ROUTES,
};

export function buildSitemapEntries(buildTime?: Date): MetadataRoute.Sitemap {
  const now = buildTime ?? new Date();
  const manifest = getSitemapManifest();
  const entries: MetadataRoute.Sitemap = [];

  for (const item of manifest) {
    for (const locale of item.locales) {
      entries.push({
        url: buildLocalizedUrl(item.path, locale, SITE_BASE_URL),
        lastModified: item.updatedAt ?? now,
        changeFrequency: item.changeFrequency,
        priority: item.priority,
        alternates: buildAlternates(item.path, item.locales, SITE_BASE_URL),
      });
    }
  }

  return entries;
}
