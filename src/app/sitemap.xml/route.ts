import {
  createSitemapXmlResponse,
  generateSitemapIndexXml,
} from "@/lib/seo/generate-sitemap-xml";
import { resolveSitemapBaseUrl } from "@/lib/seo/global-seo-config";
import { getSitemapIndexEntries } from "@/lib/seo/locale-sitemap";
import { getActiveSitemapLocales } from "@/lib/seo/global-seo-config";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET(request: Request): Promise<Response> {
  const baseUrl = resolveSitemapBaseUrl(request);

  try {
    const sitemaps = await getSitemapIndexEntries(new Date(), baseUrl);
    const xml = generateSitemapIndexXml(sitemaps);
    return createSitemapXmlResponse(xml, request);
  } catch (error) {
    console.error("sitemap index SSR failed, returning fallback:", error);
    // Fallback: static shards with current timestamp
    const now = new Date();
    const locales = getActiveSitemapLocales();
    const base = baseUrl.replace(/\/$/, "");
    const fallback = locales.map((locale) => ({
      url: `${base}/sitemap/${locale}.xml`,
      lastModified: now,
    }));
    const xml = generateSitemapIndexXml(fallback);
    return createSitemapXmlResponse(xml, request);
  }
}
