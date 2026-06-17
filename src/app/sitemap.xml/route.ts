import {
  createSitemapXmlResponse,
  generateSitemapIndexXml,
} from "@/lib/seo/generate-sitemap-xml";
import { resolveSitemapBaseUrl } from "@/lib/seo/global-seo-config";
import { getSitemapIndexEntries } from "@/lib/seo/locale-sitemap";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET(request: Request): Promise<Response> {
  const baseUrl = resolveSitemapBaseUrl(request);
  const sitemaps = await getSitemapIndexEntries(new Date(), baseUrl);
  const xml = generateSitemapIndexXml(sitemaps);
  return createSitemapXmlResponse(xml, request);
}
