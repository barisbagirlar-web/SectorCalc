import type { MetadataRoute } from "next";
import { buildSitemapChunk, getSitemapChunkCount } from "@/lib/seo/build-sitemap";

export async function generateSitemaps() {
  const count = getSitemapChunkCount();
  return Array.from({ length: count }, (_, id) => ({ id }));
}

export default function sitemap({
  id,
}: {
  id: number;
}): MetadataRoute.Sitemap {
  return buildSitemapChunk(id);
}
