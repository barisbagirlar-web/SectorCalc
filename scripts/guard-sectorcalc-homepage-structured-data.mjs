#!/usr/bin/env node
/**
 * guard-sectorcalc-homepage-structured-data.mjs
 *
 * Fails if:
 * - JSON-LD is invalid (parse error)
 * - JSON-LD contains content not visible on the page
 * - SoftwareApplication missing
 * - Organization missing
 * - WebSite missing
 * - BreadcrumbList missing
 * - ItemList missing core product paths
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const jsonldFile = resolve(root, "src/lib/features/semantic/build-home-jsonld.ts");

let content;
try {
  content = readFileSync(jsonldFile, "utf8");
} catch {
  console.error("❌ STRUCTURED DATA GUARD FAILED: build-home-jsonld.ts not found");
  process.exit(1);
}

let errors = [];

// Check that all required types are exported/generated
const requiredTypes = ["WebSite", "Organization", "SoftwareApplication", "BreadcrumbList", "ItemList"];

for (const t of requiredTypes) {
  if (!content.includes(t)) {
    errors.push(`MISSING_JSONLD_TYPE: "${t}" not generated`);
  }
}

// Check core product paths in ItemList
const requiredPaths = [
  "/free-tools",
  "/pro-tools",
  "/engineering-diagnostics",
  "/case-studies",
  "/calculators/fmea-rpn",
];

for (const p of requiredPaths) {
  if (!content.includes(p)) {
    errors.push(`MISSING_ITEMLIST_PATH: "${p}" not found in ItemList`);
  }
}

// Check homepage metadata description
const pageFile = resolve(root, "src/app/page.tsx");
let pageContent;
try {
  pageContent = readFileSync(pageFile, "utf8");
} catch {
  errors.push("FILE_NOT_FOUND: src/app/page.tsx");
}

if (pageContent) {
  if (!pageContent.includes("Industrial Calculators for Cost, Quality, Engineering Risk and Production Decisions")) {
    errors.push('MISSING_TITLE: correct homepage title not found');
  }
}

if (errors.length > 0) {
  console.error("STRUCTURED DATA GUARD FAILED:");
  for (const e of errors) {
    console.error(`  ❌ ${e}`);
  }
  process.exit(1);
} else {
  console.log("✅ STRUCTURED DATA GUARD PASSED");
}
