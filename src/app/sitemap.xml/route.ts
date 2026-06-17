import {
  createSitemapXmlResponse,
  generateSitemapIndexXml,
} from "@/lib/seo/generate-sitemap-xml";
import { getSitemapIndexEntries } from "@/lib/seo/locale-sitemap";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET(request: Request): Promise<Response> {
  const sitemaps = await getSitemapIndexEntries();
  const xml = generateSitemapIndexXml(sitemaps);
  return createSitemapXmlResponse(xml, request);
}
