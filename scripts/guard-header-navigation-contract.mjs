#!/usr/bin/env node

/**
 * guard-header-navigation-contract.mjs
 *
 * Scans header/nav source files for forbidden navigation patterns.
 * Fails if any forbidden token is found in likely header/nav files.
 *
 * Forbidden patterns:
 *   /en/pro-tools, /tr/pro-tools
 *   href="#"
 *   javascript:void(0)
 *   categories. (raw category key)
 *   Daily Renovation (raw category label)
 *   document.querySelector
 *   getElementById (in header context)
 *   scrollIntoView (in header context)
 *   Node cannot be found
 *
 * Usage: node scripts/guard-header-navigation-contract.mjs
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();

const CANDIDATE_DIRS = [
  "src/components",
  "src/app",
  "src/sectorcalc",
];

const FORBIDDEN = [
  "/en/pro-tools",
  "/tr/pro-tools",
  'href="#"',
  "javascript:void(0)",
  "categories.",
  "Daily Renovation",
  "document.querySelector",
  "Node cannot be found",
];

/**
 * Check for getElementById patterns used for navigation (not layout).
 * Skips known-safe patterns like getElementById("header") for drawer positioning.
 */
function hasNavigationGetElementById(text) {
  const lines = text.split("\n");
  for (const line of lines) {
    if (line.includes("getElementById") &&
        !line.includes('getElementById("header")') &&
        !line.includes('getElementById("tools-list")')) {
      return true;
    }
  }
  return false;
}

/**
 * Check for scrollIntoView used for navigation (not catalog filtering).
 * Skips known-safe patterns in CatalogPageShell etc.
 */
function hasNavigationScrollIntoView(text) {
  const lines = text.split("\n");
  for (const line of lines) {
    if (line.includes("scrollIntoView") &&
        !line.includes("resultsRef") &&
        !line.includes("useRef")) {
      return true;
    }
  }
  return false;
}

function walk(dir, files = []) {
  if (!existsSync(dir)) return files;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(full, files);
      continue;
    }

    if (!/\.(tsx|ts|jsx|js)$/.test(entry.name)) continue;

    const relPath = relative(ROOT, full);
    const lower = relPath.toLowerCase();

    if (
      lower.includes("header") ||
      lower.includes("nav") ||
      lower.includes("menu") ||
      lower.includes("product")
    ) {
      files.push(full);
    }
  }

  return files;
}

console.log("\n\uD83D\uDD0D Header Navigation Contract Guard\n");

const files = CANDIDATE_DIRS.flatMap((dir) => walk(join(ROOT, dir)));
const failures = [];

for (const file of files) {
  const text = readFileSync(file, "utf8");
  const relPath = relative(ROOT, file);

  for (const token of FORBIDDEN) {
    if (text.includes(token)) {
      failures.push(`${relPath}: forbidden header navigation pattern: ${token}`);
    }
  }

  if (hasNavigationGetElementById(text)) {
    failures.push(`${relPath}: forbidden header navigation pattern: getElementById (non-layout)`);
  }

  if (hasNavigationScrollIntoView(text)) {
    failures.push(`${relPath}: forbidden header navigation pattern: scrollIntoView (non-ref)`);
  }
}

if (failures.length > 0) {
  console.error("HEADER_NAVIGATION_CONTRACT_GUARD=FAIL");
  for (const failure of failures) console.error(`  \u274C ${failure}`);
  process.exit(1);
}

console.log("  \u2705 HEADER_NAVIGATION_CONTRACT_GUARD=PASS");
console.log(`  checked_files=${files.length}`);
console.log("");
