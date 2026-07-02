#!/usr/bin/env node
/**
 * SectorCalc — Schema Translation Validation Guard
 *
 * Validates that all JSON schemas are English-only at the file level.
 * Turkish strings found at this stage will be auto-translated at runtime,
 * but they represent gaps in the TURKISH_TO_ENGLISH dictionary.
 *
 * Phase 1: Prebuild — warn about untranslated strings (non-blocking)
 * Phase 2: CI/Strict — block on any Turkish residue
 *
 * Usage:
 *   node scripts/validate-schema-translations.mjs           # warn (default)
 *   STRICT=1 node scripts/validate-schema-translations.mjs  # fail on Turkish
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TURKISH_PATTERN = /[çğıöşüÇĞİÖŞÜ]/;

// All directories containing tool schemas
const SCHEMA_DIRS = [
  "generated/schemas",
  "data/pro-tools",
  "data/pro-tools-universal",
  "data/free-tools",
  "data/premium-schema",
];

// Fields to scan for Turkish content
const TEXT_FIELDS = [
  "toolName", "title", "description", "label", "helper", "hint",
  "placeholder", "businessContext", "sector", "categoryName",
  "subCategory", "categoryLabel", "longDescription", "metaDescription",
  "unitLabel", "group", "eyebrow", "unit", "resultLabel",
  "painStatement", "promise", "priceHint",
];

const isStrict = process.env.STRICT === "1";

/**
 * Recursively find all JSON files in a directory tree (flat + subdirectories).
 */
function collectJsonFiles(dirPath) {
  const absPath = path.join(ROOT, dirPath);
  if (!fs.existsSync(absPath)) return [];

  const results = [];

  function walk(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".json")) {
        results.push(fullPath);
      }
    }
  }

  walk(absPath);
  return results;
}

/**
 * Recursively walk an object and collect all Turkish strings.
 */
function findTurkishStrings(obj, filePath, fieldPath = "") {
  if (!obj || typeof obj !== "object") return [];

  let results = [];

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      results = results.concat(
        findTurkishStrings(obj[i], filePath, `${fieldPath}[${i}]`),
      );
    }
    return results;
  }

  const record = obj;

  // Check known text fields
  for (const field of TEXT_FIELDS) {
    if (typeof record[field] === "string") {
      const val = record[field];
      if (TURKISH_PATTERN.test(val)) {
        results.push({
          file: filePath,
          field: `${fieldPath}.${field}`,
          text: val.substring(0, 120),
        });
      }
    }
  }

  // Recurse into known nested structures
  for (const key of ["inputs", "outputs", "options", "formulas", "examples", "faq", "aboutContents"]) {
    if (Array.isArray(record[key])) {
      for (let i = 0; i < record[key].length; i++) {
        results = results.concat(
          findTurkishStrings(record[key][i], filePath, `${fieldPath}.${key}[${i}]`),
        );
      }
    }
  }

  return results;
}

// ── Main ──

console.log("\n=== Schema Translation Validation =================================");
console.log(`Mode: ${isStrict ? "STRICT (blocking)" : "WARN (non-blocking)"}\n`);

const allFiles = [];
for (const dir of SCHEMA_DIRS) {
  const files = collectJsonFiles(dir);
  allFiles.push(...files);
  console.log(`  ${dir}: ${files.length} files`);
}
console.log(`\nTotal: ${allFiles.length} JSON files\n`);

const allIssues = [];

for (const filePath of allFiles) {
  try {
    const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const relativePath = path.relative(ROOT, filePath);
    const issues = findTurkishStrings(content, relativePath);
    allIssues.push(...issues);
  } catch (e) {
    console.warn(`  ⚠ Parse error: ${filePath}: ${e.message}`);
  }
}

// Group by file
const grouped = {};
for (const issue of allIssues) {
  if (!grouped[issue.file]) grouped[issue.file] = [];
  grouped[issue.file].push(issue);
}

const fileCount = Object.keys(grouped).length;

if (allIssues.length > 0) {
  console.log(`⚠️  UNTRANSLATED TURKISH TEXT FOUND`);
  console.log(`   ${allIssues.length} strings across ${fileCount} files\n`);

  // Show top 10 files with most issues
  const sortedFiles = Object.entries(grouped).sort(
    ([, a], [, b]) => b.length - a.length,
  );

  for (const [file, issues] of sortedFiles.slice(0, 15)) {
    console.log(`  📄 ${file} (${issues.length} issues):`);
    for (const issue of issues.slice(0, 5)) {
      console.log(`      · [${issue.field}] "${issue.text}"`);
    }
    if (issues.length > 5) {
      console.log(`      · ... and ${issues.length - 5} more`);
    }
    console.log();
  }

  // Collect unique untranslated strings for dictionary expansion
  const uniqueTexts = [...new Set(allIssues.map((i) => i.text))].sort();
  console.log("--- Dictionary Gap: Unique untranslated strings ---");
  for (const text of uniqueTexts.slice(0, 50)) {
    console.log(`  "${text}": "${text}", // TODO: translate`);
  }
  if (uniqueTexts.length > 50) {
    console.log(`  ... and ${uniqueTexts.length - 50} more unique strings`);
  }

  if (isStrict) {
    console.error("\n❌ [STRICT MODE] Turkish text detected in schemas. Build blocked.");
    process.exit(1);
  } else {
    console.log("\n⚠️  [WARN MODE] Turkish text will be auto-translated at runtime.");
    console.log("   Run with STRICT=1 to block build on Turkish text.");
  }
} else {
  console.log("✅ All schemas are English-only. No Turkish text detected.");
}

console.log("================================================================\n");
