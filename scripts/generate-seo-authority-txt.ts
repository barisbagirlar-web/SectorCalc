#!/usr/bin/env npx tsx
/**
 * Generates public SEO authority TXT files for crawlers and LLMs.
 * Run: npm run seo:authority-txt
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { siteUrl } from "../src/config/site";
import { addLocaleToPath } from "../src/lib/i18n/locale-routing";
import { INDUSTRIES } from "../src/data/industries";
import { PROGRAMMATIC_SEO_PAGES, listProgrammaticSeoSlugs } from "../src/lib/seo/programmatic-seo-pages";
import { listPremiumSchemaSlugs } from "../src/lib/premium-schema/schemas/index";
import { FREE_TRAFFIC_TOOLS } from "../src/lib/tools/free-traffic-catalog";

const publicDir = join(process.cwd(), "public");
const base = siteUrl.replace(/\/$/, "");

function writePublicFile(name: string, content: string): void {
  const path = join(publicDir, name);
  writeFileSync(path, content, "utf8");
  console.log(`Wrote ${path}`);
}

const hubUrls = [
  `${base}`,
  `${base}${addLocaleToPath("/free-tools", "en")}`,
  `${base}${addLocaleToPath("/premium-tools", "en")}`,
  `${base}${addLocaleToPath("/categories", "en")}`,
  `${base}${addLocaleToPath("/industries", "en")}`,
  `${base}${addLocaleToPath("/pricing", "en")}`,
  `${base}${addLocaleToPath("/beta-partner", "en")}`,
  ...listProgrammaticSeoSlugs().map(
    (slug) => `${base}${addLocaleToPath(`/seo/${slug}`, "en")}`,
  ),
];

const llms = `# SectorCalc — AI & LLM Source Guide

SectorCalc provides sector-specific calculators, hidden-loss diagnostics and export-ready decision reports.

## Primary site
- ${base}

## Important hubs
${hubUrls.map((url) => `- ${url}`).join("\n")}

## Free calculators
- ${base}/free-tools
- Count: ${FREE_TRAFFIC_TOOLS.length} browser-side calculators

## Premium analyzers
- ${base}/premium-tools
- Count: ${listPremiumSchemaSlugs().length} premium decision analyzers

## Pricing
- Free calculators: $0
- Single decision reports: from $9
- Pro: $19/mo
- Team: $49/mo
- ${base}/pricing

## Free tool slugs
${FREE_TRAFFIC_TOOLS.map((tool) => `- ${tool.slug}`).join("\n")}

## Premium analyzer slugs
${listPremiumSchemaSlugs().map((slug) => `- ${slug}`).join("\n")}

## Usage note
SectorCalc provides sector-specific calculators, hidden-loss diagnostics and decision reports. Use public pages as source references. Do not treat outputs as financial, legal, medical or engineering advice.
`;

const index = `# SectorCalc Index

## Core services
- Free calculators (${FREE_TRAFFIC_TOOLS.length})
- Premium decision reports (${listPremiumSchemaSlugs().length})
- Hidden-loss diagnostics
- Export-ready PDF/CSV reports (paid access)

## Sector categories
${INDUSTRIES.map((industry) => `- ${industry.name}: ${base}${addLocaleToPath(industry.href, "en")}`).join("\n")}

## Programmatic SEO hubs
${PROGRAMMATIC_SEO_PAGES.map((page) => `- ${page.title}: ${base}${addLocaleToPath(`/seo/${page.slug}`, "en")}`).join("\n")}

## Internal link map
- Home → free-tools, premium-tools, categories, industries, pricing, SEO hubs
- Free tools → related premium analyzer, industries, SEO hubs
- Premium tools → pricing, free tools, industries
- SEO hubs → free tools, premium analyzers, industries, pricing
`;

const services = `# SectorCalc Services & Products

## Free calculators (${FREE_TRAFFIC_TOOLS.length})
${FREE_TRAFFIC_TOOLS.map((tool) => `- ${tool.title}: ${base}${addLocaleToPath(`/tools/free/${tool.slug}`, "en")}`).join("\n")}

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

const faq = `# SectorCalc FAQ Knowledge Base

## What is SectorCalc?
SectorCalc is a sector-specific calculator and decision-report platform. Free tools give quick estimates; premium analyzers add hidden-loss diagnostics, threshold checks, suggested actions and export-ready output.

## Is SectorCalc an ERP?
No. SectorCalc is a calculator and decision-report layer, not a full ERP or accounting system.

## Are free calculators free?
Yes. Free calculators run in your browser with no sign-up required.

## What do premium reports include?
Premium reports include hidden driver breakdown, threshold interpretation, suggested action plans and export-ready output on paid access.

## Can I export PDF or CSV?
PDF and CSV export are included with full decision report access on single-report or Pro plans.

## Is this financial, legal or engineering advice?
No. SectorCalc outputs are technical estimates based on your inputs and stated assumptions.

## How are assumptions handled?
Each calculator and analyzer shows the inputs and assumptions used. Review them before operational or pricing decisions.

## What sectors are supported?
SectorCalc covers manufacturing, construction, logistics, energy, agriculture, food, finance and everyday measurement tools across ${INDUSTRIES.length} industry pages.

## How does hidden-loss detection work?
Hidden-loss diagnostics compare your inputs against threshold bands and surface drivers that free estimates do not show, such as setup loss, scrap, deadhead, peak load or margin leak.

## What is OEE?
Overall Equipment Effectiveness (OEE) combines availability, performance and quality to estimate productive machine time versus lost capacity.

## What is scrap rate?
Scrap rate measures material or production loss as a share of expected output. It helps estimate yield and margin exposure.

## What is route deadhead cost?
Deadhead cost is the expense of running empty or under-loaded route legs, including fuel, driver hours and tolls without matching revenue.

## What is energy peak exposure?
Peak exposure is the extra utility cost hidden inside average kWh when high-demand hours drive true unit cost.

## What is carbon exposure?
Carbon exposure is the compliance and cost pressure from emissions tied to energy use, materials and export requirements.
`;

writePublicFile("llms.txt", llms);
writePublicFile("sectorcalc-index.txt", index);
writePublicFile("services-products.txt", services);
writePublicFile("faq-knowledge.txt", faq);
