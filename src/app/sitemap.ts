import type { MetadataRoute } from "next";
import { buildSitemapEntries } from "@/lib/infrastructure/seo/build-sitemap";
import { shouldServeSitemap } from "@/lib/infrastructure/seo/seo-indexing-control";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!shouldServeSitemap()) {
    return [];
  }
  return buildSitemapEntries();
}
