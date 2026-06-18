#!/usr/bin/env npx tsx
/**
 * Generates public SEO authority TXT files for crawlers and LLMs.
 * llms.txt is owned by export:ai-index — do not overwrite here.
 * sectorcalc-index.txt and faq-knowledge.txt are dynamic SSR routes — not generated here.
 * Run: npm run seo:authority-txt
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { siteUrl } from "../src/config/site";
import { addLocaleToPath } from "../src/lib/i18n/locale-routing";
import { listPremiumSchemaSlugs } from "../src/lib/premium-schema/schemas/index";
import { FREE_TRAFFIC_TOOLS } from "../src/lib/tools/free-traffic-catalog";

const publicDir = join(process.cwd(), "public");
const base = siteUrl.replace(/\/$/, "");

function writePublicFile(name: string, content: string): void {
  const path = join(publicDir, name);
  writeFileSync(path, content, "utf8");
  console.log(`Wrote ${path}`);
}

const services = `# SectorCalc Services & Products

## Free calculators (${FREE_TRAFFIC_TOOLS.length})
${FREE_TRAFFIC_TOOLS.map((tool) => `- ${tool.title}: ${base}${addLocaleToPath(`/tools/generated/${tool.slug}`, "en")}`).join("\n")}

## Premium decision reports (${listPremiumSchemaSlugs().length})
${listPremiumSchemaSlugs().map((slug) => `- ${slug}: ${base}${addLocaleToPath(`/tools/premium-schema/${slug}`, "en")}`).join("\n")}

## Pricing tiers
- Free: $0 — base calculators, sample scenarios, transparent assumptions
- Pro: $19/mo — premium analyzers, hidden-loss diagnostics, threshold checks, PDF/CSV export
- Team: $49/mo — multi-user access, shared report workflow, custom templates, priority support
- Single report: from $9 for one-off analysis

## Beta partner program
- ${base}/beta-partner

## Export capabilities
- PDF and CSV export on full decision report access
- Print route available for entitled users only
`;

writePublicFile("services-products.txt", services);
