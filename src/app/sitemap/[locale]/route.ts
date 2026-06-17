import {
  createSitemapXmlResponse,
  generateSitemapUrlsetXml,
} from "@/lib/seo/generate-sitemap-xml";
import { resolveSitemapBaseUrl } from "@/lib/seo/global-seo-config";
import {
  getLocaleSitemapUrlRecords,
  parseLocaleSitemapParam,
} from "@/lib/seo/locale-sitemap";

export const runtime = "nodejs";
export const revalidate = 3600;

type RouteContext = {
  params: Promise<{ locale: string }>;
};

export async function GET(request: Request, context: RouteContext): Promise<Response> {
  const { locale: localeParam } = await context.params;
  const locale = parseLocaleSitemapParam(localeParam);

  if (!locale) {
    return new Response("Not Found", { status: 404 });
  }

  const baseUrl = resolveSitemapBaseUrl(request);
  const urls = await getLocaleSitemapUrlRecords(locale, baseUrl);
  const xml = generateSitemapUrlsetXml(urls);
  return createSitemapXmlResponse(xml, request);
}
