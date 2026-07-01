import { getHubSitemapRoutes } from "@/lib/infrastructure/seo/sitemap-manifest";
import { buildSitemapXmlResponse } from "@/lib/infrastructure/seo/sitemap-generator-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = getHubSitemapRoutes().filter((item) => item.path.startsWith("/premium-tools/"));
  return buildSitemapXmlResponse(items);
}
