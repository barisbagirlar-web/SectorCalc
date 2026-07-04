#!/usr/bin/env node
/**
 * guard-public-tool-render-contracts.mjs
 *
 * Scans public-facing source files for forbidden visible patterns:
 *   - "Daily Renovation" in scope, category, or any rendered text
 *   - "categories." as raw visible key (must have i18n translation)
 *   - "categories.everyday-life" or similar raw keys
 *   - raw schema scope without sanitization
 *   - raw category key in breadcrumb
 *
 * Fails if any pattern is found in non-comment source lines.
 *
 * Usage: node scripts/guard-public-tool-render-contracts.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();

const SCAN_FILES = [
  "src/sectorcalc/runtime/build-tool-render-contract.ts",
  "src/app/tools/generated/[slug]/page.tsx",
  "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx",
  "src/sectorcalc/pro-form/form-render-helpers.ts",
  "src/sectorcalc/pro-form/generated-tool-to-superv4-adapter.ts",
  "src/sectorcalc/runtime/display-labels.ts",
  "src/lib/i18n/translation-fallback.ts",
  "src/components/tools/FreeTrafficToolPage.tsx",
  "src/components/tools/Breadcrumb.tsx",
];

// These patterns must NEVER appear in source (excluding pure comments)
// Exclude scripts/ and known translation files where keys are defined
const FORBIDDEN_PATTERNS = [
  {
    pattern: /Daily Renovation/,
    description: "\"Daily Renovation\" must never render in any visible text",
    note: "Use safeDisplayScope() or safeDisplayCategory() to replace with safe fallback",
    excludeFiles: ["scripts/"],
  },
  {
    // Raw "categories." without t() or translation context — indicates hardcoded raw key
    pattern: />\s*categories\.</,
    description: "Raw \"categories.\" in JSX — indicates unguarded category key rendering",
    note: "Use t.has() guard before rendering categories.* keys",
    excludeFiles: [],
  },
];

// Additional structural checks
const REQUIRED_DEFENSES = [
  {
    file: "src/sectorcalc/pro-form/form-render-helpers.ts",
    symbols: ["safeDisplayScope"],
    description: "safeDisplayScope helper must exist in form-render-helpers.ts",
  },
  {
    file: "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx",
    symbols: ["safeDisplayScope"],
    description: "safeDisplayScope must be used in UniversalIndustrialDecisionForm.tsx",
  },
];

function readFile(relPath) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) return null;
  return fs.readFileSync(full, "utf8");
}

const failures = [];

// ── 1. Check forbidden patterns in source files ──
for (const relPath of SCAN_FILES) {
  const content = readFile(relPath);
  if (content === null) {
    console.warn(`WARN: File not found, skipping: ${relPath}`);
    continue;
  }

  const lines = content.split("\n");
  for (const { pattern, description, note, excludeFiles = [] } of FORBIDDEN_PATTERNS) {
    // Skip if relPath matches any exclude pattern
    if (excludeFiles.some((e) => relPath.includes(e))) continue;

    const matchingLines = lines.filter((line) => {
      const trimmed = line.trim();
      // Skip comments
      if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) return false;
      return pattern.test(line);
    });

    if (matchingLines.length > 0) {
      const matchText = matchingLines[0].trim().slice(0, 120).replace(/\n/g, " ");
      failures.push(
        `${relPath}: ${description}\n  Match: ${matchText}\n  Fix: ${note}`
      );
    }
  }
}

// ── 2. Check required structural defenses ──
for (const { file, symbols, description } of REQUIRED_DEFENSES) {
  const content = readFile(file);
  if (content === null) {
    failures.push(`FILE MISSING: ${file} — ${description}`);
    continue;
  }

  for (const sym of symbols) {
    if (!content.includes(sym)) {
      failures.push(`${file}: Missing required symbol "${sym}" — ${description}`);
    }
  }
}

// ── 3. Verify no raw scope render without sanitization ──
const formContent = readFile("src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx");
if (formContent) {
  // Check that scope is not rendered directly via props.schema.scope
  if (/props\.schema\.scope\s*}/.test(formContent)) {
    failures.push(
      "UniversalIndustrialDecisionForm.tsx: Raw props.schema.scope render detected — must use safeDisplayScope()"
    );
  }

  // Check that safeDisplayScope is actually called in the JSX path
  if (!formContent.includes("safeDisplayScope")) {
    failures.push(
      "UniversalIndustrialDecisionForm.tsx: Missing safeDisplayScope usage"
    );
  }
}

// ── 4. Verify category fallback in translation file ──
const fallbackContent = readFile("src/lib/i18n/translation-fallback.ts");
if (fallbackContent) {
  const REQUIRED_CATEGORY_KEYS = [
    "freeTrafficCatalog.categories.everyday-life",
    "freeTrafficCatalog.categories.construction-measurement",
    "freeTrafficCatalog.categories.finance-business",
    "freeTrafficCatalog.categories.manufacturing-workshop",
    "freeTrafficCatalog.categories.energy-carbon",
    "freeTrafficCatalog.categories.logistics-travel",
    "freeTrafficCatalog.categories.agriculture-food",
    "freeTrafficCatalog.categories.math-statistics",
    "freeTrafficCatalog.categories.conversion",
    "freeTrafficCatalog.categories.health-body",
  ];
  for (const key of REQUIRED_CATEGORY_KEYS) {
    if (!fallbackContent.includes(key)) {
      failures.push(
        `translation-fallback.ts: Missing fallback for "${key}" — raw key would render`
      );
    }
  }
}

// ── 5. Verify breadcrumb doesn't render raw category key ──
const breadcrumbContent = readFile("src/components/tools/Breadcrumb.tsx");
if (breadcrumbContent) {
  if (breadcrumbContent.includes("categories.")) {
    failures.push(
      "Breadcrumb.tsx: Contains 'categories.' string — raw category key must not appear in breadcrumb"
    );
  }
}

// ── Report ──
if (failures.length > 0) {
  console.error("PUBLIC_TOOL_RENDER_CONTRACTS_GUARD=FAIL");
  console.error(`\nFound ${failures.length} violation(s):\n`);
  for (const f of failures) {
    console.error(`FAIL: ${f}\n`);
  }
  process.exit(1);
}

console.log("PUBLIC_TOOL_RENDER_CONTRACTS_GUARD=PASS");
console.log(`Scanned ${SCAN_FILES.length} files + structural checks — no forbidden public render patterns found.`);
