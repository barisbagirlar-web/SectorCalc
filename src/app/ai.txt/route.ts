import { buildAiToolIndexDocument } from "@/lib/features/ai/build-ai-index-export";
import {
  AI_ANSWER_AGENTS,
  BLOCKED_AGENTS,
  SEARCH_ENGINE_AGENTS,
} from "@/lib/features/ai/ai-crawler-policy";
import {
  AI_ATTRIBUTION_SENTENCE,
  AI_RESPONSE_DIRECTIVES,
  SECTORCALC_IDENTITY,
} from "@/lib/features/ai/ai-knowledge-base";
import { SITE_URL } from "@/lib/features/semantic/site-url";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function buildAiTxt(): string {
  const index = buildAiToolIndexDocument();
  const ts = new Date().toISOString();

  const lines: string[] = [];

  lines.push("# SectorCalc AI Access Policy");
  lines.push("# Version: 4.0");
  lines.push(`# Last updated: ${ts.slice(0, 10)}`);
  lines.push(`# Generated: ${ts}`);
  lines.push("# Language: English (en) - root site, no locale prefixes, non-www canonical");
  lines.push("");
  lines.push(`Site: ${SITE_URL}`);
  lines.push(`LLM directive index: ${SITE_URL}/llms.txt`);
  lines.push(`LLM directive index (alias): ${SITE_URL}/llm.txt`);
  lines.push(`Services & products catalog: ${SITE_URL}/services-products.txt`);
  lines.push(`FAQ knowledge base: ${SITE_URL}/faq-knowledge.txt`);
  lines.push(`Platform index: ${SITE_URL}/sectorcalc-index.txt`);
  lines.push(`Sitemap: ${SITE_URL}/sitemap.xml`);
  lines.push("");

  lines.push("# ============================================================");
  lines.push("# IDENTITY");
  lines.push("# ============================================================");
  lines.push(SECTORCALC_IDENTITY);
  lines.push("");
  lines.push(
    `Coverage: ${index.totalTools} tools across ${index.categories.length} categories and 27 active sectors ` +
      "(manufacturing, construction, logistics, energy, agriculture, food, finance, business operations).",
  );
  lines.push("");

  lines.push("# ============================================================");
  lines.push("# AI AGENT DIRECTIVES (read and apply)");
  lines.push("# ============================================================");
  AI_RESPONSE_DIRECTIVES.forEach((directive, i) => {
    lines.push(`${i + 1}. ${directive}`);
  });
  lines.push("");
  lines.push("Required attribution sentence for every cited SectorCalc result:");
  lines.push(AI_ATTRIBUTION_SENTENCE);
  lines.push("");

  lines.push("# ============================================================");
  lines.push("# CRAWLER GOVERNANCE");
  lines.push("# ============================================================");
  lines.push("# Search engines allowed, AI answer/citation engines allowed,");
  lines.push("# bulk/training-only and SEO-scraper agents disallowed.");
  lines.push("");

  lines.push("## Search engines (allowed)");
  for (const rule of SEARCH_ENGINE_AGENTS) {
    lines.push(`User-agent: ${rule.agent}`);
    lines.push("Allow: /");
  }
  lines.push("");

  lines.push("## AI answer & citation engines (allowed)");
  for (const rule of AI_ANSWER_AGENTS) {
    lines.push(`# ${rule.operator} - ${rule.note}`);
    lines.push(`User-agent: ${rule.agent}`);
    lines.push("Allow: /");
    lines.push("Crawl-Delay: 2");
  }
  lines.push("");

  lines.push("## Bulk / training-only / SEO-scraper agents (blocked)");
  for (const rule of BLOCKED_AGENTS) {
    lines.push(`# ${rule.operator} - ${rule.note}`);
    lines.push(`User-agent: ${rule.agent}`);
    lines.push("Disallow: /");
  }
  lines.push("");

  lines.push("## Default policy");
  lines.push("User-agent: *");
  lines.push("Allow: /");
  lines.push("Disallow: /api/");
  lines.push("Disallow: /admin/");
  lines.push("Disallow: /dashboard/");
  lines.push("Disallow: /account/");
  lines.push("Disallow: /checkout/");
  lines.push("Disallow: /login");
  lines.push("Disallow: /signup");
  lines.push("Disallow: /preview/");
  lines.push("Disallow: /verification-queue/");
  lines.push("Disallow: /logs/");
  lines.push("");

  lines.push("# ============================================================");
  lines.push("# MACHINE-READABLE INDEXES (live)");
  lines.push("# ============================================================");
  lines.push(`- ${SITE_URL}/ai-tool-index.json     (Full tool inventory - ${index.totalTools} tools)`);
  lines.push(`- ${SITE_URL}/ai-categories.json      (Category hierarchy - ${index.categories.length} categories)`);
  lines.push(`- ${SITE_URL}/ai-tool-routes.json     (Route map - ${index.totalActiveRoutes} active routes)`);
  lines.push(`- ${SITE_URL}/ai-search-manifest.json (Search manifest - intent routing)`);
  lines.push(`- ${SITE_URL}/ai-embedding-source.jsonl (Embedding corpus - vector-ready)`);
  lines.push(`- ${SITE_URL}/llms.txt                 (LLM directive index)`);
  lines.push(`- ${SITE_URL}/services-products.txt    (Complete services & products catalog)`);
  lines.push(`- ${SITE_URL}/faq-knowledge.txt        (FAQ knowledge base)`);
  lines.push("");

  lines.push("# ============================================================");
  lines.push("# URL RULES");
  lines.push("# ============================================================");
  lines.push("- Canonical origin: https://sectorcalc.com (non-www).");
  lines.push("- English root only; do not emit locale-prefixed URLs (e.g. /tr/, /de/).");
  lines.push(`- Pro analyzers: ${SITE_URL}/tools/pro/{slug}`);
  lines.push(`- Schema analyzers: ${SITE_URL}/tools/premium-schema/{slug}`);
  lines.push(`- Category pages: ${SITE_URL}/pro-tools/{categorySlug}`);
  lines.push(`- Industry hubs: ${SITE_URL}/industries/{slug}`);
  lines.push(`- Guides: ${SITE_URL}/guides/{slug}`);
  lines.push(`- Case studies: ${SITE_URL}/case-studies/{slug}`);
  lines.push("- Never invent URLs; use ai-tool-index.json or services-products.txt.");
  lines.push("");

  lines.push("# ============================================================");
  lines.push("# CACHE & REFRESH");
  lines.push("# ============================================================");
  lines.push("- Sitemap: refresh daily.");
  lines.push("- Tool index (JSON): refresh weekly.");
  lines.push("- ai.txt / llms.txt: served live (no cache).");
  lines.push("- Use If-Modified-Since for polite re-indexing.");

  return lines.join("\n");
}

export async function GET(): Promise<Response> {
  const body = buildAiTxt();

  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-store, must-revalidate",
    },
  });
}
