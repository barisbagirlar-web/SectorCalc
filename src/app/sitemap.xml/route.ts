import { getActiveSitemapLocales, SITE_BASE_URL } from "@/lib/seo/global-seo-config";
import {
  generateSitemapIndexXml,
  SITEMAP_CACHE_CONTROL,
} from "@/lib/seo/generate-sitemap-xml";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(): Promise<Response> {
  const now = new Date();
  const base = SITE_BASE_URL.replace(/\/$/, "");
  const sitemaps = getActiveSitemapLocales().map((locale) => ({
    url: `${base}/sitemap/${locale}.xml`,
    lastModified: now,
  }));

  const xml = generateSitemapIndexXml(sitemaps);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": SITEMAP_CACHE_CONTROL,
    },
  });
}
