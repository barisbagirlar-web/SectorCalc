#!/usr/bin/env node
/**
 * P28 CI gate — hardcoded English text in component files.
 *
 * Scans src/components/ only. Excludes admin/, .generated., __tests__/,
 * and legacy pages. Flags only specific known problem patterns.
 *
 * Usage:
 *   node scripts/audit-i18n-hardcoded.mjs            # scan all
 *   node scripts/audit-i18n-hardcoded.mjs --diff     # scan only git-dirty
 *   node scripts/audit-i18n-hardcoded.mjs --verbose  # show line context
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const ROOT = join(import.meta.dirname, "..");
const VERBOSE = process.argv.includes("--verbose");

// ── Exclusion rules ──────────────────────────────────────
const EXCLUDE_PATTERNS = [
  /\/admin\//,
  /\/__tests__\//,
  /\.generated\./,
  /\.d\.ts$/,
  /\/node_modules\//,
  /\/legacy\//,
  /\/archive\//,
];

function shouldExclude(filePath) {
  return EXCLUDE_PATTERNS.some((p) => p.test(filePath));
}

// ── Known English phrases that MUST go through useTranslations ──
const FORBIDDEN_ENGLISH = [
  // Form labels / buttons
  '">Result<"',
  '">Unit: "',
  'placeholder="Enter ',
  'placeholder="Search by tool',
  'placeholder="you@company.com',
  'placeholder="Send my verdict',
  'placeholder="Optional"',
  'placeholder="Timeline, client',
  '"Numeric value required."',
  '"Must be > 0."',
  '"Cannot be negative."',
  '"Enter parameters and run calculation."',

  // Static UI text (not in i18n call)
  "Quick operator vote: calculation result appears correct.",
  "Quick operator vote: calculation result appears incorrect.",

  // Lead modal
  "Tell us what you need",
  "Enter your email to receive checkout",
  "Premium report unlock is being rebuilt",
  "Thanks. We recorded your report request",
  "You may be asked to sign in",

  // Section headers
  '"Lead capture"',
  '"Request access or talk to us"',
  '"Decision report preview"',
  '"Free sector tools"',

  // Terminal
  '"Numeric value required."',
  '"Must be > 0."',
  '"Cannot be negative."',
  '"Enter parameters and run calculation."',

  // Error page
  '"Something went wrong"',
  '"Try again"',
  '"Calculator library"',

  // Success/info messages
  '"Submitting…"',
  '"Redirecting to checkout…"',
];

// ── Check if a file uses useTranslations ──────────────────
function hasTranslations(content) {
  return /\buseTranslations\s*\(/.test(content);
}

// ── Check if text is inside a t() call ────────────────────
function insideTranslationCall(content, index) {
  const before = content.slice(Math.max(0, index - 80), index);
  return /\b(t|a11y|tFree|tPremium|tGroups|tScenario|tMachineRate)\s*\(\s*["']/.test(before);
}

// ── File discovery ────────────────────────────────────────
function getTargetFiles() {
  const dirs = ["src/components"];

  if (process.argv.includes("--diff")) {
    const stdout = execSync("git diff --name-only HEAD", { cwd: ROOT, encoding: "utf8" });
    const dirty = new Set(stdout.trim().split("\n").filter(Boolean));
    const files = [];
    for (const dir of dirs) {
      walkDir(join(ROOT, dir), (f) => {
        if (dirty.has(f)) files.push(join(ROOT, f));
      });
    }
    return files;
  }

  const files = [];
  for (const dir of dirs) {
    walkDir(join(ROOT, dir), (f) => files.push(f));
  }
  return files;
}

function walkDir(dir, cb) {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith(".") && !entry.name.startsWith("node_modules")) {
        walkDir(full, cb);
      } else if (entry.isFile() && /\.tsx?$/.test(entry.name)) {
        cb(full);
      }
    }
  } catch {
    // skip if directory doesn't exist
  }
}

// ── Main scan ────────────────────────────────────────────
const files = getTargetFiles();
console.log(`\naudit:i18n-hardcoded — scanning ${files.length} component file(s)...`);

let totalFailures = 0;
const failureDetails = [];

for (const filePath of files) {
  if (shouldExclude(filePath)) continue;

  const content = readFileSync(filePath, "utf8");
  const usesI18n = hasTranslations(content);
  const relPath = filePath.replace(ROOT, "").replace(/^\//, "");
  const fileIssues = [];

  // 1. Scan for forbidden English strings
  for (const forbidden of FORBIDDEN_ENGLISH) {
    let idx = 0;
    while ((idx = content.indexOf(forbidden, idx)) >= 0) {
      // Skip if it's inside comments
      const lineStart = content.lastIndexOf("\n", idx) + 1;
      const line = content.slice(lineStart, content.indexOf("\n", idx) >= 0 ? content.indexOf("\n", idx) : undefined).trim();
      if (line.trim().startsWith("//") || line.trim().startsWith("/*") || line.trim().startsWith("*")) {
        idx += 1;
        continue;
      }
      // Skip if inside t() call
      if (insideTranslationCall(content, idx)) {
        idx += 1;
        continue;
      }
      fileIssues.push(`  forbidden — ${forbidden}`);
      if (VERBOSE) fileIssues.push(`    → ${line}`);
      break;
    }
  }

  // 2. For files WITHOUT useTranslations, flag known attribute patterns
  if (!usesI18n) {
    // Check aria-labels with hardcoded English
    const labelPatterns = [
      { pattern: /aria-label="Close menu"/, label: "Close menu" },
      { pattern: /aria-label="Open menu"/, label: "Open menu" },
      { pattern: /aria-label="Mobile"/, label: "Mobile" },
      { pattern: /aria-label="Close"/, label: "Close" },
      { pattern: /aria-label="Region and language"/, label: "Region and language" },
      { pattern: /aria-label="Trust and compliance signals"/, label: "Trust and compliance signals" },
      { pattern: /aria-label="Industrial decision panel"/, label: "Industrial decision panel" },
      { pattern: /aria-label="Expert logic breakdown"/, label: "Expert logic breakdown" },
      { pattern: /aria-label="Hidden variables"/, label: "Hidden variables" },
    ];
    for (const { pattern, label } of labelPatterns) {
      if (pattern.test(content)) {
        fileIssues.push(`  aria-label — "${label}" (use a11y("key") instead)`);
      }
    }
  }

  if (fileIssues.length > 0) {
    totalFailures += fileIssues.length;
    console.log(`\x1b[31m✗ ${relPath}\x1b[0m`);
    for (const issue of fileIssues) {
      console.log(issue);
    }
    failureDetails.push({ relPath, issues: fileIssues });
  }
}

console.log(`\naudit:i18n-hardcoded — ${totalFailures} issue(s) across ${failureDetails.length} file(s)`);

if (totalFailures > 0) {
  console.log("\n\x1b[31mFAIL — Hardcoded English text detected in component files.\x1b[0m");
  console.log("  All UI text must use next-intl useTranslations() for 6-locale support.\n");
  process.exit(1);
}

console.log("PASS — All component text is locale-safe.\n");
process.exit(0);
