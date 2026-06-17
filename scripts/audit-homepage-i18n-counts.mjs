#!/usr/bin/env node
/**
 * Ensures homepage marketing copy exposes {count} in all supported locales.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

/** @param {unknown} value */
function hasCountPlaceholder(value) {
  return typeof value === "string" && /\{count(?:,|\})/.test(value);
}

let failed = false;

for (const locale of LOCALES) {
  const filePath = join(ROOT, "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(filePath, "utf8"));

  const checks = [
    ["trace.intro.feature1", messages.trace?.intro?.feature1],
    ["trace.intro.feature2", messages.trace?.intro?.feature2],
    ["homepageHybrid.freePremium.freeTitle", messages.homepageHybrid?.freePremium?.freeTitle],
    ["homepageHybrid.freePremium.premiumTitle", messages.homepageHybrid?.freePremium?.premiumTitle],
    ["homepageHybrid.coverage.toolCount", messages.homepageHybrid?.coverage?.toolCount],
  ];

  for (const [key, value] of checks) {
    const ok = hasCountPlaceholder(value);
    console.log(`${locale} ${ok ? "✓" : "✗"} ${key}`);
    if (!ok) {
      failed = true;
    }
  }
}

if (failed) {
  console.error("audit-homepage-i18n-counts: missing {count} in one or more locale keys.");
  process.exit(1);
}

console.log("audit-homepage-i18n-counts: all locales OK.");
