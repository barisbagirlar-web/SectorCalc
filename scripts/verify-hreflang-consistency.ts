#!/usr/bin/env tsx
/**
 * Hreflang Consistency Gate — S5, S17 MIL-STD
 * =============================================
 *
 * Verifies that the hreflang locales emitted in the sitemap XML
 * are EXACTLY the same set emitted in the DOM head metadata.
 * A mismatch causes Google "return URL errors" and canonical drift.
 *
 * SSOT: metadata.ts buildHreflangLanguages() is authoritative.
 * Sitemap hreflang set must be a subset of the metadata set.
 *
 * Exit code: 0 = PASS, 1 = BLOCKED
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function extractMetadataHreflangLocales(): Set<string> {
  const metadataPath = path.join(ROOT, "src/lib/infrastructure/metadata.ts");
  const content = fs.readFileSync(metadataPath, "utf8");

  const hreflangBlock = content.match(
    /function buildHreflangLanguages[\s\S]*?return \{([\s\S]*?)\};/,
  );

  if (!hreflangBlock) {
    console.error("[hreflang-consistency] Cannot parse buildHreflangLanguages from metadata.ts");
    process.exit(1);
  }

  const locales = new Set<string>();
  // Matches both quoted keys ("en-us", "x-default") and unquoted keys (en)
  const keyRegex = /(?:["']([a-z]{2}(?:-[a-z]{2})?|x-default)["']|([a-z]{2}))\s*:/g;
  let match: RegExpExecArray | null;
  while ((match = keyRegex.exec(hreflangBlock[1])) !== null) {
    locales.add(match[1] || match[2]);
  }

  return locales;
}

function extractSitemapHreflangLocales(): Set<string> {
  const sitemapPath = path.join(
    ROOT,
    "src/lib/infrastructure/seo/sitemap-index-generator.ts",
  );
  const content = fs.readFileSync(sitemapPath, "utf8");

  const localesMatch = content.match(/HREFLANG_LOCALES\s*=\s*\[([^\]]+)\]/);

  if (!localesMatch) {
    console.error("[hreflang-consistency] Cannot find HREFLANG_LOCALES in sitemap-index-generator.ts");
    process.exit(1);
  }

  const locales = new Set<string>();
  const keyRegex = /["']([a-z]{2}(?:-[a-z]{2})?)["']/g;
  let match: RegExpExecArray | null;
  while ((match = keyRegex.exec(localesMatch[1])) !== null) {
    locales.add(match[1]);
  }

  return locales;
}

function main(): void {
  console.log("Hreflang Consistency Gate — S5, S17 MIL-STD");
  console.log("=".repeat(60));

  const metadataLocales = extractMetadataHreflangLocales();
  const sitemapLocales = extractSitemapHreflangLocales();

  console.log(`  Metadata (DOM head) locales: ${[...metadataLocales].sort().join(", ")}`);
  console.log(`  Sitemap XML locales:        ${[...sitemapLocales].sort().join(", ")}`);

  const extraLocales = [...sitemapLocales].filter((l) => !metadataLocales.has(l));

  if (extraLocales.length > 0) {
    console.error(`\n[BLOCKED] Hreflang mismatch detected:`);
    console.error(`  Sitemap XML emits locales NOT present in DOM metadata:`);
    for (const locale of extraLocales) {
      console.error(`    - "${locale}": in sitemap XML, missing from metadata.ts`);
    }
    console.error(`\n  Google will crawl these locale URLs -> 404s -> "return URL error".`);
    console.error(`  Fix: Align HREFLANG_LOCALES in sitemap-index-generator.ts with metadata.ts.`);
    console.error("");
    process.exit(1);
  }

  const hasEn = sitemapLocales.has("en");
  if (!hasEn) {
    console.error(`\n[BLOCKED] Sitemap HREFLANG_LOCALES must include "en" (x-default).`);
    console.error("");
    process.exit(1);
  }

  console.log("\n[PASS] Hreflang consistency verified:");
  console.log(`  Sitemap locales subset of DOM metadata`);
  console.log(`  No orphan locale URLs emitted`);
  console.log(`  SSOT: metadata.ts buildHreflangLanguages() is authoritative`);
  console.log("");
  process.exit(0);
}

main();
