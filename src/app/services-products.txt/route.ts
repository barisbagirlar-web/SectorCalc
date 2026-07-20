import { buildAiToolIndexDocument } from "@/lib/features/ai/build-ai-index-export";
import { getPlans, getServiceFamilies } from "@/lib/features/ai/ai-knowledge-base";
import { SITE_URL } from "@/lib/features/semantic/site-url";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function buildServicesProductsTxt(): string {
  const index = buildAiToolIndexDocument();
  const generatedAt = new Date().toISOString();

  const lines: string[] = [];
  lines.push("# SectorCalc - Services & Products Catalog");
  lines.push(`# Site: ${SITE_URL}`);
  lines.push(`# Generated: ${generatedAt}`);
  lines.push(
    `# ${index.totalTools} tools | ${index.totalActiveRoutes} active routes | ${index.categories.length} categories`,
  );
  lines.push("");

  lines.push("## Service families");
  for (const family of getServiceFamilies()) {
    lines.push(`- ${family.name}: ${family.summary}`);
    lines.push(`  ${family.url}`);
  }
  lines.push("");

  lines.push("## Pricing plans");
  for (const plan of getPlans()) {
    lines.push(`- ${plan.name} (${plan.priceLabel}): ${plan.headline}`);
    for (const feature of plan.features) {
      lines.push(`  - ${feature}`);
    }
  }
  lines.push(`- Compare and subscribe: ${SITE_URL}/pricing`);
  lines.push("");

  lines.push("## Complete tool catalog (grouped by category)");
  lines.push(
    "# tier: free | premium. status: active-route (direct link) | category-only (see category page).",
  );
  lines.push("");

  for (const category of index.categories) {
    const tools = index.tools
      .filter((tool) => tool.categorySlug === category.slug)
      .sort((a, b) => (a.title.en ?? a.slug).localeCompare(b.title.en ?? b.slug));
    if (tools.length === 0) continue;

    const categoryUrl =
      category.categoryUrl.en ?? `${SITE_URL}/pro-tools/${category.slug}`;
    lines.push(
      `### ${category.title.en ?? category.slug} (${tools.length}) - ${categoryUrl}`,
    );
    for (const tool of tools) {
      const title = tool.title.en ?? tool.slug;
      lines.push(`- ${title} [${tool.tier}, ${tool.routeStatus}]: ${tool.canonicalUrl}`);
    }
    lines.push("");
  }

  lines.push("## Export capabilities");
  lines.push("- PDF decision report export for SectorCalc Pro subscribers.");
  lines.push("- Free tools provide directional estimates only; no export.");
  lines.push("");
  lines.push("## Disclaimer");
  lines.push(
    "SectorCalc outputs are technical estimates based on stated assumptions and are not financial, legal, medical or engineering advice. Verify before business decisions.",
  );

  return lines.join("\n");
}

export async function GET(): Promise<Response> {
  const body = buildServicesProductsTxt();

  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-store, must-revalidate",
    },
  });
}
