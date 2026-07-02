#!/usr/bin/env node
/**
 * guard-i18n-keys.mjs
 *
 * Ensures every i18n key used via the tPage/tDecision/tCommon helper
 * functions has a fallback in FALLBACK_MAP.
 *
 * Prevents literal key text from appearing on the live site when a
 * message catalog lookup fails.
 *
 * Note: This guard only catches tPage/tDecision/tCommon call patterns.
 * Components using useTranslations() directly are resolved at runtime
 * by the i18n-stub and should be verified manually or via snapshot tests.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const FALLBACK_FILE = path.join(ROOT, "src/lib/i18n/translation-fallback.ts");

// 1. Parse FALLBACK_MAP keys from the TS source file.
const fallbackContent = fs.readFileSync(FALLBACK_FILE, "utf8");
const fallbackKeys = new Set();
const keyPattern = /"([^"]+)":\s*"/g;
let match;
while ((match = keyPattern.exec(fallbackContent)) !== null) {
  fallbackKeys.add(match[1]);
}

// 2. Walk src/ for TSX files and extract i18n key lookups.
const tsxFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", ".next", ".git"].includes(entry.name)) continue;
      walk(full);
    } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
      tsxFiles.push(full);
    }
  }
}
walk(path.join(ROOT, "src"));

// Only match tPage("key"), tDecision("key"), tCommon("key")
const i18nCallPattern = /t(?:Page|Decision|Common)\(["']([^"']+)["']\)/g;
const missingKeys = new Set();

for (const file of tsxFiles) {
  const content = fs.readFileSync(file, "utf8");
  let callMatch;
  while ((callMatch = i18nCallPattern.exec(content)) !== null) {
    const key = callMatch[1];
    // Only check fully-qualified keys (containing a dot)
    if (!key.includes(".")) continue;
    if (!fallbackKeys.has(key) && !fallbackKeys.has(`premiumDecisionReport.decisionValue.${key}`)) {
      missingKeys.add(key);
    }
  }
}

if (missingKeys.size > 0) {
  console.error("\n\u274C I18N_KEYS_MISSING_FROM_FALLBACK\n");
  console.error("The following keys have no fallback:\n");
  for (const key of [...missingKeys].sort()) {
    console.error(`  \u2022 "${key}"`);
  }
  console.error("\nAdd these to src/lib/i18n/translation-fallback.ts FALLBACK_MAP.\n");
  process.exit(1);
}

console.log("\u2705 I18N_KEYS_CHECK: PASSED");
