import type { MetadataRoute } from "next";
import { SITE_BASE_URL } from "@/lib/seo/global-seo-config";
import {
  buildAlternates,
  buildLocalizedUrl,
  countAuthorityGuideSitemapEntries,
  countExpectedSitemapMinimum,
  getPremiumSchemaRoutePath,
  getProgrammaticSeoRoutePath,
  getSitemapManifest,
  SITEMAP_STATIC_ROUTES,
} from "@/lib/seo/sitemap-manifest";

export {
  countAuthorityGuideSitemapEntries,
  countExpectedSitemapMinimum,
  getPremiumSchemaRoutePath,
  getProgrammaticSeoRoutePath,
  SITEMAP_STATIC_ROUTES,
};

/** Keeps each ISR sitemap shard under Vercel's ~19 MB fallback limit. */
export const SITEMAP_URLS_PER_CHUNK = 2500;

export function buildSitemapEntries(now = new Date()): MetadataRoute.Sitemap {
  const manifest = getSitemapManifest();
  const entries: MetadataRoute.Sitemap = [];

  for (const item of manifest) {
    for (const locale of item.locales) {
      entries.push({
        url: buildLocalizedUrl(item.path, locale, SITE_BASE_URL),
        lastModified: now,
        changeFrequency: item.changeFrequency,
        priority: item.priority,
        alternates: buildAlternates(item.path, item.locales, SITE_BASE_URL),
      });
    }
  }

  return entries;
}

export function getSitemapChunkCount(entries?: MetadataRoute.Sitemap): number {
  const total = entries?.length ?? buildSitemapEntries().length;
  return Math.max(1, Math.ceil(total / SITEMAP_URLS_PER_CHUNK));
}

export function buildSitemapChunk(chunkId: number, now = new Date()): MetadataRoute.Sitemap {
  const start = chunkId * SITEMAP_URLS_PER_CHUNK;
  return buildSitemapEntries(now).slice(start, start + SITEMAP_URLS_PER_CHUNK);
}
