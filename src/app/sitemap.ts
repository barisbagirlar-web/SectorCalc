import type { MetadataRoute } from "next";
import { buildSitemapEntries } from "@/lib/infrastructure/seo/build-sitemap";
import { shouldServeSitemap } from "@/lib/infrastructure/seo/seo-indexing-control";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!shouldServeSitemap()) {
    return [];
  }
  return buildSitemapEntries();
}
