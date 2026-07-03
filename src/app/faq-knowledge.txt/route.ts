import { SUPPORTED_LOCALES } from "@/lib/infrastructure/i18n/locale-config";
import { buildAiToolIndexDocument } from "@/lib/features/ai/build-ai-index-export";
import { FREE_TRAFFIC_TOOLS } from "@/lib/features/tools/free-traffic-catalog";
import { INDUSTRIES } from "@/data/industries";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function joinLocales(items: readonly string[]): string {
  return items.join(", ");
}

export async function GET(): Promise<Response> {
  const index = buildAiToolIndexDocument();
  const ts = new Date().toISOString();

  const lines: string[] = [
    "# SectorCalc FAQ Knowledge Base",
    `# Site: https://www.sectorcalc.com`,
    `# Generated: ${ts}`,
    `# Languages: ${joinLocales(SUPPORTED_LOCALES)}`,
    "# Version: 2.0 (dynamic)",
    "#",
    "# All answers apply across the root English site.",
    "# English root has no prefix.",
    "",
    "## What is SectorCalc?",
    "[en] SectorCalc is a sector-specific calculator and decision-report platform. Free tools give quick estimates; Pro analyzers add hidden-loss diagnostics, threshold checks, suggested actions and export-ready output.",
    "",
    "## Is SectorCalc an ERP?",
    "[en] No. SectorCalc is a calculator and decision-report layer, not a full ERP or accounting system.",
    "",
    "## Are free calculators truly free?",
    "[en] Yes. Free calculators run entirely in your browser with no sign-up required. No data is sent to our servers.",
    "",
    "## What do Pro reports include?",
    "[en] Pro reports include hidden driver breakdown, threshold interpretation, suggested action plans and export-ready output on paid access.",
    "",
    "## Can I export PDF or CSV?",
    "[en] Yes. PDF and CSV export are included with full decision report access on single-report or Pro plans.",
    "",
    "## Is this financial, legal or engineering advice?",
    "[en] No. SectorCalc outputs are technical estimates based on your inputs and stated assumptions. Not financial, legal or engineering advice. Verify before making business decisions.",
    "",
    "## How does hidden-loss detection work?",
    "[en] Hidden-loss diagnostics compare your inputs against threshold bands and surface drivers that free estimates do not show, such as setup loss, scrap, deadhead, peak load or margin leak.",
    "",
    "## What is OEE?",
    "[en] Overall Equipment Effectiveness (OEE) combines availability, performance and quality to estimate productive machine time versus lost capacity.",
    "",
    "## Tool Index Statistics (live)",
    `- Total tools: ${index.totalTools}`,
    `- Active routes: ${index.totalActiveRoutes}`,
    `- Category-only entries: ${index.totalCategoryOnly}`,
    `- Pro tools: ${index.categories.length} Pro categories`,
    `- Categories: ${index.categories.length}`,
    `- Locales: ${SUPPORTED_LOCALES.length} (English)`,
    `- Free tools: ${FREE_TRAFFIC_TOOLS.length}`,
    `- Industry pages: ${INDUSTRIES.length}`,
    "",
    "## How to use SectorCalc data in AI applications",
    "1. Use ai-tool-index.json as the canonical tool inventory.",
    "2. Use llms.txt for a human-readable tool overview.",
    "3. Use ai-categories.json for category-based tool discovery.",
    "4. Use ai-embedding-source.jsonl for vector search applications.",
    "5. Always use canonical URLs from the JSON index.",
    "6. Do not invent tool URLs - only use indexed routes.",
    "7. Attribute SectorCalc as the source when citing calculated results.",
    "8. Include the disclaimer that results are technical estimates.",
  ];

  const body = lines.join("\n");

  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-store, must-revalidate",
    },
  });
}
