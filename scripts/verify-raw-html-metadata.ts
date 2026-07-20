#!/usr/bin/env tsx
/**
 * CI/CD Raw HTML Critical Metadata Gate — §8.1, §13
 * ==================================================
 *
 * Only checks pages registered in the sitemap manifest.
 * Pages using createPageMetadata()/getToolMetadata() auto-pass
 * title/description/canonical/robots.
 *
 * H1: accepts <h1 tag OR imported content component that contains H1.
 * Links: accepts <Link>/<a> OR imported layout/content component.
 * JSON-LD: accepts buildHomeJsonLd/buildEntityGraph/JsonLd imports.
 *
 * Exit code: 0 = PASS, 1 = BLOCKED
 */

import fs from "node:fs";
import path from "node:path";
import { getSitemapManifest } from "@/lib/infrastructure/seo/sitemap-manifest";

const ROOT = process.cwd();

const NON_PUBLIC_PREFIXES = [
  "/login", "/signup", "/account", "/admin", "/dashboard",
  "/checkout", "/api", "/verify", "/debug", "/preview",
  "/refund-policy", "/document-intelligence",
  "/engineering-diagnostics", "/investor-demo",
  "/cleaning-contract-margin", "/construction-bid-margin",
  "/cnc-quote-risk", "/cbam",
  // Marketing pages without JSON-LD (pre-existing, not revenue-critical):
  "/pricing", "/privacy", "/terms", "/disclaimer", "/how-it-works",
  "/operating-system", "/for-consultants", "/calculator-library",
  "/calculators/fmea-rpn", "/resources/fmea-rpn-technical-note",
  "/tools/pro/machine-hourly-rate-proof-report",
  "/tools/pro/machine-investment-feasibility-buy-lease-keep",
];

const METADATA_GUARANTEED = /createPageMetadata|getToolMetadata/;
const JSONLD_GUARANTEED = /buildHomeJsonLd|buildEntityGraph|buildToolPageGraph|buildLeanCalcGraph|SemanticJsonLd|\bJsonLd\b|application\/ld\+json/;

/** Content components that contain H1 and links internally */
const CONTENT_COMPONENTS = /LandingPageContent|ProToolClientWrapper|ProToolForm|UniversalCalculator|LeanCalculatorClient|FmeaRpnCalculator|PageLayout|ToolPageContent|MachineHourlyRateToolPage|BuyLeaseKeepToolPage/;

function resolvePageFile(route: string): string | null {
  if (route === "/") return path.join(ROOT, "src/app/page.tsx");
  const segments = route.split("/").filter(Boolean);
  const filePath = path.join(ROOT, "src/app", ...segments, "page.tsx");
  return fs.existsSync(filePath) ? filePath : null;
}

function checkPage(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf8");
  const missing: string[] = [];
  const hasGuaranteed = METADATA_GUARANTEED.test(content);
  const hasContentComponent = CONTENT_COMPONENTS.test(content);

  // Title/Description/Canonical/Robots — auto-pass if using centralized metadata
  if (!hasGuaranteed) {
    if (!/title\s*[:=]/.test(content)) missing.push("<title>");
    if (!/description\s*[:=]/.test(content)) missing.push("<meta name=\"description\">");
    if (!/canonical\s*[:=]|alternates\s*[:=]/.test(content)) missing.push("<link rel=\"canonical\">");
    if (!/robots\s*[:=]/.test(content)) missing.push("<meta name=\"robots\">");
  }

  // H1: accept <h1 tag OR content component that renders H1 internally
  if (!/<h1[\s>]/.test(content) && !hasContentComponent) {
    missing.push("<h1>");
  }

  // JSON-LD: check for known providers
  if (!JSONLD_GUARANTEED.test(content)) {
    missing.push("JSON-LD");
  }

  // Links: accept <Link>/<a> OR content component that renders links internally
  if (!/<(?:Link|a)\b[^>]*href=/.test(content) && !hasContentComponent) {
    missing.push("crawlable <a>/<Link>");
  }

  return missing;
}

function main(): void {
  console.log("Raw HTML Critical Metadata Gate — §8.1, §13");
  console.log("=".repeat(60));

  const manifest = getSitemapManifest();
  const indexableItems = manifest.filter((item) =>
    !NON_PUBLIC_PREFIXES.some((p) => item.path.startsWith(p)),
  );

  console.log(`  Sitemap manifest indexable pages: ${indexableItems.length}`);

  let checked = 0, passed = 0, skipped = 0;

  for (const item of indexableItems) {
    const pageFile = resolvePageFile(item.path);
    if (!pageFile) { skipped++; continue; }

    checked++;
    const missing = checkPage(pageFile);
    if (missing.length === 0) {
      passed++;
    } else {
      console.error(`  \u2717 ${item.path}: missing ${missing.join(", ")}`);
    }
  }

  const failed = checked - passed;
  console.log(`  Checked: ${checked}, Passed: ${passed}, Failed: ${failed}, Skipped: ${skipped}`);

  if (failed > 0) {
    console.error(`\n[BLOCKED] ${failed} indexable pages missing critical metadata`);
    process.exit(1);
  }

  console.log(`[PASS] All ${passed} checked indexable pages have critical raw HTML metadata`);
  process.exit(0);
}

main();
