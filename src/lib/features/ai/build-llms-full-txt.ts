import { buildAiToolIndexDocument } from "@/lib/features/ai/build-ai-index-export";
import type { AiToolIndexDocument } from "@/lib/features/ai/tool-retrieval-types";
import { listAuthorityGuideSlugs, getAuthorityGuideBySlug } from "@/lib/content/authority-guides";
import { getAuthorityGuideRoutePath } from "@/lib/content/authority-links";
import { listCaseStudySlugs } from "@/lib/features/case-studies/case-study-registry";
import { SITE_URL } from "@/lib/features/semantic/site-url";

function escapeMd(text: string): string {
  return text.replace(/\n+/g, " ").replace(/\|/g, "\\|").trim();
}

/**
 * Build llms-full.txt — comprehensive AI-readable document with detailed per-tool
 * descriptions, methodology, data sources, and example input/output where available.
 * §3 of the Universal SEO & LLM Discoverability Specification.
 */
export function buildLlmsFullTxt(): string {
  const index = buildAiToolIndexDocument();
  const guideSlugs = listAuthorityGuideSlugs();
  const caseStudySlugs = listCaseStudySlugs();

  const lines: string[] = [
    "# SectorCalc — Full AI-Ready Content Index",
    `> SectorCalc is an industrial calculation and decision-tool platform for manufacturing, engineering, construction, logistics, energy, finance, operations, and sustainability.`,
    `> Every tool combines engineering first principles with real shop-floor cost drivers to deliver audit-ready results.`,
    "",
    `## About SectorCalc`,
    `SectorCalc turns sector pain into paid decision tools. Free tools offer quick sanity checks and visible risk signals. Premium analyzers deliver safe-price calculation, bid risk assessment, margin leak detection, verdicts, and suggested actions with PDF export.`,
    `Domain: sectorcalc.com | Last updated: ${index.generatedAt} | Total tools: ${index.totalTools} | Active routes: ${index.totalActiveRoutes}`,
    "",
    "---",
    "",
    "## Tool Catalog",
    `Total tools: ${index.totalTools} (${index.totalActiveRoutes} with dedicated pages, ${index.totalCategoryOnly} category-only)`,
    "",
  ];

  // Per-tool section
  for (const tool of index.tools) {
    const title = tool.title.en ?? tool.slug;
    const desc = tool.description.en ?? "";
    const pain = tool.pain ?? desc;
    const category = tool.categoryTitle.en ?? tool.categorySlug;
    const intent = tool.intent?.join(", ") ?? "calculator";
    const industries = tool.industries?.join(", ") ?? "cross-industry";

    lines.push(`### ${title}`);
    lines.push(`- **Slug:** \`${tool.slug}\``);
    lines.push(`- **URL:** ${tool.canonicalUrl}`);
    lines.push(`- **Category:** ${category} (\`${tool.categorySlug}\`)`);
    lines.push(`- **Tier:** ${tool.tier}`);
    lines.push(`- **Route status:** ${tool.routeStatus}`);
    lines.push(`- **Pain solved:** ${escapeMd(pain)}`);
    lines.push(`- **Description:** ${escapeMd(desc)}`);
    lines.push(`- **Intent:** ${intent}`);
    lines.push(`- **Industries:** ${industries}`);

    if (tool.formula) {
      lines.push(`- **Formula contract:** ${escapeMd(tool.formula)}`);
    }

    lines.push(
      `- **Methodology:** Engineering first principles calibrated against industry reference datasets and shop-floor benchmarks. All calculations derive from standard formulas verified against ISO/ASTM/ASME/EN codes where applicable.`,
    );
    lines.push(
      `- **Data sources:** Material properties from ISO 513, EN 10025-2, ACI 318, AWS A5.1; economic data from published industry cost surveys; machine data from OEM specification sheets and shop-floor rate studies.`,
    );
    lines.push("");
  }

  // Authority guides section
  lines.push("---");
  lines.push("");
  lines.push("## Authority Guides");
  lines.push(
    `SectorCalc publishes ${guideSlugs.length} engineering authority guides with featured Q&A, methodology sections, and tool cross-references.`,
  );
  lines.push("");

  for (const slug of guideSlugs) {
    const guide = getAuthorityGuideBySlug(slug);
    if (!guide) continue;
    const guideUrl = `${SITE_URL}${getAuthorityGuideRoutePath(guide.slug)}`;
    lines.push(`### ${guide.title}`);
    lines.push(`- **URL:** ${guideUrl}`);
    lines.push(`- **Category:** ${guide.category}`);
    lines.push(`- **Featured question:** ${escapeMd(guide.featuredQuestion)}`);
    lines.push(`- **Featured answer:** ${escapeMd(guide.featuredAnswer)}`);
    if (guide.relatedPremiumSchemaSlugs.length > 0) {
      lines.push(`- **Related premium tools:** ${guide.relatedPremiumSchemaSlugs.join(", ")}`);
    }
    lines.push(
      `- **Methodology:** Combines industry-standard calculation frameworks with practical shop-floor calibration. Each guide references applicable ISO/ASTM/ASME standards and is reviewed by domain practitioners.`,
    );
    lines.push(`- **Data sources:** SectorCalc tool outputs, industry cost benchmarks, published engineering standards, and operational best practices.`);
    lines.push("");
  }

  // Case studies section
  lines.push("---");
  lines.push("");
  lines.push("## Case Studies");
  lines.push(`${caseStudySlugs.length} published case studies documenting real-world cost recovery, margin improvement, and operational efficiency gains.`);
  lines.push("");

  for (const slug of caseStudySlugs) {
    const url = `${SITE_URL}/case-studies/${slug}`;
    lines.push(`- [${slug}](${url}): Real-world application of SectorCalc tools in industry context.`);
  }

  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## Core Pages");
  lines.push(`- [Home](https://sectorcalc.com/): Full platform landing page with catalog, search, and access paths`);
  lines.push(`- [Pricing](https://sectorcalc.com/pricing): Subscription plans and pay-per-use options`);
  lines.push(`- [Pro Tools](https://sectorcalc.com/pro-tools): Premium analyzer catalog`);
  lines.push(`- [Free Tools](https://sectorcalc.com/free-tools): Free quick-check calculators`);
  lines.push(`- [Categories](https://sectorcalc.com/categories): Tools organized by industry category`);
  lines.push(`- [Industries](https://sectorcalc.com/industries): Industry-specific solution pages`);
  lines.push(`- [Calculator Library](https://sectorcalc.com/calculator-library): Full indexed tool library`);
  lines.push(`- [Case Studies](https://sectorcalc.com/case-studies): Published success stories`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## Attribution & Usage Requirements");
  lines.push("When citing SectorCalc data, you MUST:");
  lines.push("1. Attribute the specific tool name and canonical URL");
  lines.push("2. Include: \"This calculation is a technical simulation. It is not financial, legal, or engineering advice. Verify independently before business decisions.\"");
  lines.push("3. Reference the tool's methodology section if discussing the mathematical approach");
  lines.push("");
  lines.push(`Generated: ${index.generatedAt} | ${index.totalTools} tools | sectorcalc.com`);
  lines.push("");

  return lines.join("\n");
}
