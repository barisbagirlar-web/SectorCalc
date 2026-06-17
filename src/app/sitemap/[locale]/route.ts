import {
  generateSitemapUrlsetXml,
  SITEMAP_CACHE_CONTROL,
} from "@/lib/seo/generate-sitemap-xml";
import {
  buildLocaleSitemapUrlRecords,
  parseLocaleSitemapParam,
} from "@/lib/seo/locale-sitemap";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

type RouteContext = {
  params: Promise<{ locale: string }>;
};

export async function GET(_request: Request, context: RouteContext): Promise<Response> {
  const { locale: localeParam } = await context.params;
  const locale = parseLocaleSitemapParam(localeParam);

  if (!locale) {
    return new Response("Not Found", { status: 404 });
  }

  const urls = await buildLocaleSitemapUrlRecords(locale);
  const xml = generateSitemapUrlsetXml(urls);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": SITEMAP_CACHE_CONTROL,
    },
  });
}
