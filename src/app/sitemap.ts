import type { MetadataRoute } from "next";
import { buildSitemapEntries } from "@/lib/seo/build-sitemap";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries();
}
