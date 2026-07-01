import { getCoreSitemapRoutes, getHubSitemapRoutes } from "@/lib/infrastructure/seo/sitemap-manifest";
import { buildSitemapXmlResponse } from "@/lib/infrastructure/seo/sitemap-generator-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const core = getCoreSitemapRoutes();
  const hubs = getHubSitemapRoutes().filter((item) => !item.path.startsWith("/premium-tools/"));
  
  // Include /case-studies hub page here
  const caseStudiesHub = {
    path: "/case-studies",
    type: "hub" as const,
    priority: 0.74,
    changeFrequency: "monthly" as const,
    locales: ["en" as const],
  };

  const allItems = [...core, ...hubs, caseStudiesHub];
  return buildSitemapXmlResponse(allItems);
}
