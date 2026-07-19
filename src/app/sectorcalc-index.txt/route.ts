import { buildAiToolIndexDocument } from "@/lib/features/ai/build-ai-index-export";
import { SITE_URL } from "@/lib/features/semantic/site-url";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function buildIndexTxt(): string {
  const index = buildAiToolIndexDocument();
  const lines: string[] = [];

  lines.push("# SectorCalc - Platform Index & Link Map");
  lines.push(`# Site: ${SITE_URL}`);
  lines.push(`# Generated: ${new Date().toISOString()}`);
  lines.push("");

  lines.push("## Inventory");
  lines.push(`- Total tools: ${index.totalTools}`);
  lines.push(`- Active-route tools (direct link): ${index.totalActiveRoutes}`);
  lines.push(`- Category-only tools: ${index.totalCategoryOnly}`);
  lines.push(`- Categories: ${index.categories.length}`);
  lines.push("- Active sectors/industries: 27");
  lines.push("");

  lines.push("## Core hubs");
  lines.push(`- Home: ${SITE_URL}/`);
  lines.push(`- Free calculators: ${SITE_URL}/free-tools`);
  lines.push(`- Pro analyzers: ${SITE_URL}/pro-tools`);
  lines.push(`- Categories: ${SITE_URL}/categories`);
  lines.push(`- Industries: ${SITE_URL}/industries`);
  lines.push(`- Engineering diagnostics: ${SITE_URL}/engineering-diagnostics`);
  lines.push(`- Document intelligence: ${SITE_URL}/document-intelligence`);
  lines.push(`- Guides: ${SITE_URL}/guides`);
  lines.push(`- Case studies: ${SITE_URL}/case-studies`);
  lines.push(`- Pricing: ${SITE_URL}/pricing`);
  lines.push("");

  lines.push("## AI & machine-readable surfaces");
  lines.push(`- LLM directive index: ${SITE_URL}/llms.txt (alias ${SITE_URL}/llm.txt)`);
  lines.push(`- Services & products catalog: ${SITE_URL}/services-products.txt`);
  lines.push(`- FAQ knowledge base: ${SITE_URL}/faq-knowledge.txt`);
  lines.push(`- AI access policy: ${SITE_URL}/ai.txt`);
  lines.push(`- Full tool index (JSON): ${SITE_URL}/ai-tool-index.json`);
  lines.push(`- Sitemap: ${SITE_URL}/sitemap.xml`);
  lines.push("");

  lines.push("## Category link map");
  for (const category of index.categories) {
    const url = category.categoryUrl.en ?? `${SITE_URL}/pro-tools/${category.slug}`;
    lines.push(`- ${category.title.en ?? category.slug} (${category.toolCount}): ${url}`);
  }

  return lines.join("\n");
}

export async function GET(): Promise<Response> {
  const body = buildIndexTxt();

  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-store, must-revalidate",
    },
  });
}
