import type { MetadataRoute } from "next";
import { buildSitemapEntries } from "@/lib/infrastructure/seo/build-sitemap";

/**
 * Dynamic sitemap — regenerated at every build.
 *
 * Each URL gets a real <lastmod> from:
 *   1. The data source's own updatedAt (tool registry, CMS, etc.)
 *   2. Fallback: build time (dynamic pages are regenerated per build)
 *
 * Domain: www.sectorcalc.com
 * No hreflang (single-language EN site at this stage).
 * No fake/static timestamps.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries();
}
