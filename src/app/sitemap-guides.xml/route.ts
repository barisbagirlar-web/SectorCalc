import { getAuthorityGuideSitemapRoutes } from "@/lib/infrastructure/seo/sitemap-manifest";
import { buildSitemapXmlResponse } from "@/lib/infrastructure/seo/sitemap-generator-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = getAuthorityGuideSitemapRoutes();
  return buildSitemapXmlResponse(items);
}
