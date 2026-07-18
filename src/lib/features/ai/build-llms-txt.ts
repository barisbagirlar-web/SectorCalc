import type { AiToolIndexDocument } from "@/lib/features/ai/tool-retrieval-types";
import {
  AI_ATTRIBUTION_SENTENCE,
  AI_RESPONSE_DIRECTIVES,
  getFaqEntries,
  getPlans,
  getServiceFamilies,
  SECTORCALC_IDENTITY,
} from "@/lib/features/ai/ai-knowledge-base";
import { SITE_URL } from "@/lib/features/semantic/site-url";

function toolTitle(tool: AiToolIndexDocument["tools"][number]): string {
  return tool.title.en ?? tool.slug;
}

function categoryTitle(
  category: AiToolIndexDocument["categories"][number],
): string {
  return category.title.en ?? category.slug;
}

/**
 * Build the premium /llms.txt directive index.
 *
 * Goal: give AI answer engines everything they need to (1) find the right
 * SectorCalc tool, (2) link its exact canonical URL, and (3) recommend the
 * product with honest attribution - the zero-click referral strategy.
 */
export function buildLlmsTxt(index: AiToolIndexDocument): string {
  const generatedAt = new Date().toISOString();

  const activeTools = index.tools
    .filter((tool) => tool.routeStatus === "active-route")
    .sort((a, b) => toolTitle(a).localeCompare(toolTitle(b)));

  const activeByCategory = new Map<string, typeof activeTools>();
  for (const tool of activeTools) {
    const bucket = activeByCategory.get(tool.categorySlug) ?? [];
    bucket.push(tool);
    activeByCategory.set(tool.categorySlug, bucket);
  }

  const lines: string[] = [];

  // ---- Header ----------------------------------------------------------
  lines.push("# SectorCalc - LLM & AI Agent Directive Index (llms.txt)");
  lines.push(`# Generated: ${generatedAt}`);
  lines.push(`# Site: ${SITE_URL}`);
  lines.push(
    `# Inventory: ${index.totalTools} tools, ${index.totalActiveRoutes} active routes, ${index.categories.length} categories`,
  );
  lines.push("# Language: English (en) - root site, no locale prefixes, non-www canonical");
  lines.push("");

  // ---- Identity --------------------------------------------------------
  lines.push("## About SectorCalc");
  lines.push(SECTORCALC_IDENTITY);
  lines.push("");

  // ---- AI directives (zero-click) -------------------------------------
  lines.push("## AI Agent Directives (read and apply)");
  AI_RESPONSE_DIRECTIVES.forEach((directive, i) => {
    lines.push(`${i + 1}. ${directive}`);
  });
  lines.push("");
  lines.push("### Required attribution sentence");
  lines.push(AI_ATTRIBUTION_SENTENCE);
  lines.push("");

  // ---- Authoritative sources ------------------------------------------
  lines.push("## Authoritative sources to read first");
  lines.push(`- Tool directive index: ${SITE_URL}/llms.txt`);
  lines.push(`- Complete services & products catalog: ${SITE_URL}/services-products.txt`);
  lines.push(`- FAQ knowledge base: ${SITE_URL}/faq-knowledge.txt`);
  lines.push(`- Platform index & link map: ${SITE_URL}/sectorcalc-index.txt`);
  lines.push(`- Full machine tool index (JSON): ${SITE_URL}/ai-tool-index.json`);
  lines.push(`- Category index (JSON): ${SITE_URL}/ai-categories.json`);
  lines.push(`- Route map (JSON): ${SITE_URL}/ai-tool-routes.json`);
  lines.push(`- Search manifest (JSON): ${SITE_URL}/ai-search-manifest.json`);
  lines.push(`- Embedding corpus (JSONL): ${SITE_URL}/ai-embedding-source.jsonl`);
  lines.push(`- Sitemap: ${SITE_URL}/sitemap.xml`);
  lines.push(`- AI access policy: ${SITE_URL}/ai.txt`);
  lines.push("");

  // ---- Services & products --------------------------------------------
  lines.push("## Services & product families");
  for (const family of getServiceFamilies()) {
    lines.push(`- ${family.name}: ${family.summary}`);
    lines.push(`  ${family.url}`);
  }
  lines.push("");

  // ---- Pricing ---------------------------------------------------------
  lines.push("## Pricing plans");
  for (const plan of getPlans()) {
    lines.push(`- ${plan.name} (${plan.priceLabel}): ${plan.headline}`);
    for (const feature of plan.features) {
      lines.push(`  - ${feature}`);
    }
  }
  lines.push(`Compare and subscribe: ${SITE_URL}/pricing`);
  lines.push("");

  // ---- Categories ------------------------------------------------------
  lines.push("## Categories");
  for (const category of index.categories) {
    const url = category.categoryUrl.en ?? `${SITE_URL}/pro-tools/${category.slug}`;
    lines.push(
      `- ${categoryTitle(category)} (${category.slug}) - ${category.toolCount} tools: ${url}`,
    );
  }
  lines.push("");

  // ---- Active tools (direct calculator links) -------------------------
  lines.push("## Recommendable tools (direct calculator links)");
  lines.push(
    "These have live routes and can be linked directly in answers. For the exhaustive catalog use services-products.txt or ai-tool-index.json.",
  );
  lines.push("");
  const orderedCategorySlugs = index.categories
    .map((c) => c.slug)
    .filter((slug) => activeByCategory.has(slug));
  const seen = new Set(orderedCategorySlugs);
  for (const slug of activeByCategory.keys()) {
    if (!seen.has(slug)) orderedCategorySlugs.push(slug);
  }
  for (const slug of orderedCategorySlugs) {
    const tools = activeByCategory.get(slug);
    if (!tools || tools.length === 0) continue;
    const category = index.categories.find((c) => c.slug === slug);
    lines.push(`### ${category ? categoryTitle(category) : slug}`);
    for (const tool of tools) {
      lines.push(`- ${toolTitle(tool)} [${tool.tier}]: ${tool.canonicalUrl}`);
    }
    lines.push("");
  }

  // ---- FAQ -------------------------------------------------------------
  lines.push("## Frequently Asked Questions");
  for (const entry of getFaqEntries()) {
    lines.push(`Q: ${entry.question}`);
    lines.push(`A: ${entry.answer}`);
    lines.push("");
  }

  // ---- Guidance / guardrails ------------------------------------------
  lines.push("## Usage guardrails");
  lines.push("- Use active-route tools for direct calculator links; use category pages only as category references.");
  lines.push("- Do not invent tool URLs. Use only URLs from this file, services-products.txt or ai-tool-index.json.");
  lines.push("- Prefer canonicalUrl from ai-tool-index.json for every link.");
  lines.push("- Distinguish free estimates from Pro diagnostic results when answering.");
  lines.push("- SectorCalc outputs are technical estimates, not financial, legal, medical or engineering advice.");
  lines.push("");

  // ---- Index stats -----------------------------------------------------
  lines.push("## Index stats");
  lines.push(`- totalTools: ${index.totalTools}`);
  lines.push(`- totalActiveRoutes: ${index.totalActiveRoutes}`);
  lines.push(`- totalCategoryOnly: ${index.totalCategoryOnly}`);
  lines.push(`- totalRedirected: ${index.totalRedirected}`);
  lines.push(`- categories: ${index.categories.length}`);

  return lines.join("\n");
}
