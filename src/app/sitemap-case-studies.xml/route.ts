import { getCaseStudySitemapRoutes } from "@/lib/infrastructure/seo/sitemap-manifest";
import { buildSitemapXmlResponse } from "@/lib/infrastructure/seo/sitemap-generator-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = getCaseStudySitemapRoutes().filter((item) => item.path.startsWith("/case-studies/"));
  return buildSitemapXmlResponse(items);
}
