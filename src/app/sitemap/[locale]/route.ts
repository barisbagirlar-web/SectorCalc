import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SITEMAP_CACHE_CONTROL } from "@/lib/seo/generate-sitemap-xml";
import { parseLocaleSitemapParam } from "@/lib/seo/locale-sitemap";

export const runtime = "nodejs";
export const dynamic = "force-static";
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

  try {
    const filePath = join(process.cwd(), "public", "sitemap", `${locale}.xml`);
    const xml = readFileSync(filePath, "utf8");

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": SITEMAP_CACHE_CONTROL,
      },
    });
  } catch (error) {
    console.error(`sitemap/${locale}.xml static read failed:`, error);
    return new Response("Not Found", { status: 404 });
  }
}
