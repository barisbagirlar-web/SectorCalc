import { siteUrl } from "@/config/site";
import { INDUSTRIES } from "@/data/industries";
import { buildAiToolIndexDocument } from "@/lib/features/ai/build-ai-index-export";
import { addLocaleToPath } from "@/lib/infrastructure/i18n/locale-routing";
import { listPremiumSchemaSlugs } from "@/lib/features/premium-schema/schemas/index";
import { PROGRAMMATIC_SEO_PAGES } from "@/lib/infrastructure/seo/programmatic-seo-pages";
import { FREE_TRAFFIC_TOOLS } from "@/lib/features/tools/free-traffic-catalog";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  const index = buildAiToolIndexDocument();
  const base = siteUrl.replace(/\/$/, "");
  const ts = new Date().toISOString();

  const lines: string[] = [
    "# SectorCalc Index",
    `# Site: ${base}`,
    `# Generated: ${ts}`,
    `# Languages: en, tr, de, fr, es, ar`,
    "",
    "## Core services",
    `- Free generated calculators (${FREE_TRAFFIC_TOOLS.length})`,
    `- Pro decision reports (${listPremiumSchemaSlugs().length})`,
    "- Hidden-loss diagnostics",
    "- Export-ready PDF/CSV reports (paid access)",
    `- ${index.categories.length} categories across ${index.locales.length} languages`,
    "",
    "## Sector categories (all 6 locales)",
  ];

  for (const industry of INDUSTRIES) {
    lines.push(`- ${industry.name}: ${base}${addLocaleToPath(industry.href, "en")}`);
  }

  lines.push(
    "",
    "## Programmatic SEO hubs (all 6 locales)",
  );

  for (const page of PROGRAMMATIC_SEO_PAGES) {
    lines.push(`- ${page.title}: ${base}${addLocaleToPath(`/seo/${page.slug}`, "en")}`);
  }

  lines.push(
    "",
    "## Tool location pattern",
    "- Generated free tools: https://www.sectorcalc.com/tools/generated/{slug}",
    "- Locale-specific: https://www.sectorcalc.com/{locale}/tools/generated/{slug}",
    "- Pro tools: https://www.sectorcalc.com/{locale}/tools/premium-schema/{slug}",
    "- Where {locale} = tr, de, fr, es, ar (en uses no prefix)",
    "",
    "## Internal link map",
    "- Home → free-tools, pro-tools, categories, industries, pricing, SEO hubs",
    "- Free tools → related Pro analyzer, industries, SEO hubs",
    "- Pro tools → pricing, free tools, industries",
    "- SEO hubs → free tools, Pro analyzers, industries, pricing",
    "",
    "## AI indexing priority",
    "- High: ai-tool-index.json, llms.txt, ai.txt, sitemap.xml",
    "- Medium: tool pages, category pages, industry pages",
    "- Standard: case studies, guides, methodology, about pages",
  );

  const body = lines.join("\n");

  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-store, must-revalidate",
    },
  });
}
