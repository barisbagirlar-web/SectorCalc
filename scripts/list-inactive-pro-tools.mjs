#!/usr/bin/env node
/**
 * scripts/list-inactive-pro-tools.mjs
 *
 * Generates exact inactive PRO tool list from current repo state.
 * Reads:
 *   - src/sectorcalc/pro-commerce/baris-pro-products.ts  (product registry)
 *   - src/sectorcalc/formulas/pro-v531/*.formula.ts      (actual formula modules)
 *   - src/sectorcalc/formulas/pro-v531/*.registry.ts     (registry binding files)
 *   - src/sectorcalc/runtime/active-tool-allowlist.ts (public allowlist)
 *   - premium-slugs.json (public catalog)
 *
 * Output:
 *   ACTIVE_PRO_TOOLS       – tools with real formulas + LIVE_ENGINE_READY
 *   INACTIVE_PRO_TOOLS     – everything else
 *   STUB_PRO_TOOLS         – formula file exists but returns stub/placeholder
 *
 * Writes:
 *   reports/inactive-pro-tools-to-remove.json
 *   reports/inactive-pro-tools-to-remove.txt
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const REPORTS_DIR = join(ROOT, "reports");
const FORMULA_DIR = join(ROOT, "src/sectorcalc/formulas/pro-v531");
const ALLOWLIST_PATH = join(ROOT, "src/sectorcalc/runtime/active-tool-allowlist.ts");
const PRODUCT_REGISTRY_PATH = join(ROOT, "src/sectorcalc/pro-commerce/baris-pro-products.ts");
const PREMIUM_SLUGS_PATH = join(ROOT, "premium-slugs.json");

// ── Helper: read baris-pro-products.ts to extract toolKey → executionMode map ──

function parseExecutionModes() {
  const text = readFileSync(PRODUCT_REGISTRY_PATH, "utf8");
  const modes = new Map();

  // Match each product block: toolKey and executionMode
  const blockRegex = /toolKey:\s*"([^"]+)"[\s\S]*?executionMode:\s*"([^"]+)"/g;
  let match;
  while ((match = blockRegex.exec(text)) !== null) {
    modes.set(match[1], match[2]);
  }

  return modes;
}

// ── Helper: check if a formula file is a stub ──

const STUB_MARKERS = [
  /STUB|stub/,
  /TODO/,
  /not\s+implemented/,
  /placeholder/,
  /_note:\s*"/,
  /"This is a stub/,
  /"Formula module is a stub/,
  /Fake\s+result/,
  /fake\s+result/,
  /returns empty/,
  /empty result/,
];

function isStubFormula(toolKey) {
  const formulaPath = join(FORMULA_DIR, `${toolKey}.formula.ts`);
  if (!existsSync(formulaPath)) return false; // no file = not a stub, just missing

  const text = readFileSync(formulaPath, "utf8");

  // Check for stub markers
  for (const marker of STUB_MARKERS) {
    if (marker.test(text)) return true;
  }

  // Check if calculate() returns empty/placeholder
  if (/calculate\s*\(\s*\)\s*:\s*\{/.test(text) || /calculate\s*\(\s*\)\s*\{/.test(text)) {
    // Extract calculate body
    const calcMatch = text.match(/calculate\s*\([^)]*\)\s*(:\s*[^{]+)?\{([^}]+)\}/);
    if (calcMatch) {
      const body = calcMatch[2].trim();
      // If body only contains a return of empty object or simple note
      if (/^\s*return\s*\{\s*[_n]/i.test(body) && body.length < 100) {
        return true;
      }
    }
  }

  return false;
}

// ── Helper: get list of actual .formula.ts files ──

function getExistingFormulaKeys() {
  if (!existsSync(FORMULA_DIR)) return new Set();
  const files = readdirSync(FORMULA_DIR).filter(f => f.endsWith(".formula.ts"));
  return new Set(files.map(f => f.replace(/\.formula\.ts$/, "")));
}

// ── Helper: read premium-slugs.json ──

function readPremiumSlugs() {
  try {
    return JSON.parse(readFileSync(PREMIUM_SLUGS_PATH, "utf8"));
  } catch {
    return [];
  }
}

// ── Helper: parse PRO allowlist from active-tool-allowlist.ts ──

function parseAllowlist() {
  const text = readFileSync(ALLOWLIST_PATH, "utf8");
  const slugs = [];
  // Match lines like: "tool-key",
  const slugRegex = /"([^"]+)"\s*(?:\/\/|,)/g;
  let match;
  while ((match = slugRegex.exec(text)) !== null) {
    const slug = match[1];
    // Skip free tool slugs (above the PRO section)
    if (slug.length > 0) slugs.push(slug);
  }
  return slugs;
}

// ── Main ──

function main() {
  const executionModes = parseExecutionModes();
  const existingFormulas = getExistingFormulaKeys();
  const premiumSlugs = readPremiumSlugs();
  const allAllowlistSlugs = parseAllowlist();

  // Filter: PRO allowlist slugs that are in baris-pro-products
  const barisKeys = new Set(executionModes.keys());
  const proSlugs = allAllowlistSlugs.filter(s => barisKeys.has(s) || s === "compressed-air-leak-cost-calculator");

  const active = [];
  const inactive = [];
  const stub = [];
  const forcedInactive = ["compressed-air-leak-cost-calculator"];

  for (const slug of proSlugs) {
    const hasFormula = existingFormulas.has(slug);
    const executionMode = executionModes.get(slug);
    const isLive = executionMode === "LIVE_ENGINE_READY";
    const isDisabled = executionMode === "DISABLED_UNTIL_FORMULA_READY";
    const isForcedInactive = forcedInactive.includes(slug);
    const isStub = hasFormula && isStubFormula(slug);

    if (isForcedInactive) {
      inactive.push(slug);
      if (isStub || hasFormula) stub.push(slug);
      continue;
    }

    if (isLive && hasFormula && !isStub) {
      active.push(slug);
    } else {
      inactive.push(slug);
      if (isStub) stub.push(slug);
    }
  }

  // Sort
  active.sort();
  inactive.sort();
  stub.sort();

  // Report
  const report = {
    generatedAt: new Date().toISOString(),
    ACTIVE_PRO_TOOLS: active,
    INACTIVE_PRO_TOOLS: inactive,
    STUB_PRO_TOOLS: stub,
    COUNT_ACTIVE: active.length,
    COUNT_INACTIVE: inactive.length,
    COUNT_STUB: stub.length,
    premium_slugs_current_count: premiumSlugs.length,
    premium_slugs_should_be: active.length,
    summary: `${active.length} active, ${inactive.length} inactive, ${stub.length} stub`,
  };

  // Ensure reports directory
  if (!existsSync(REPORTS_DIR)) {
    mkdirSync(REPORTS_DIR, { recursive: true });
  }

  // Write JSON
  writeFileSync(
    join(REPORTS_DIR, "inactive-pro-tools-to-remove.json"),
    JSON.stringify(report, null, 2),
    "utf8"
  );

  // Write TXT
  const lines = [
    "=".repeat(60),
    "  INACTIVE PRO TOOLS — REMOVAL LIST",
    "=".repeat(60),
    "",
    `Generated: ${report.generatedAt}`,
    "",
    `ACTIVE PRO TOOLS:    ${report.COUNT_ACTIVE}`,
    `INACTIVE PRO TOOLS:  ${report.COUNT_INACTIVE}`,
    `STUB PRO TOOLS:      ${report.COUNT_STUB}`,
    "",
    "─".repeat(40),
    "ACTIVE PRO TOOLS (keep in public catalog):",
    "─".repeat(40),
    ...active.map(k => `  ✅ ${k}`),
    "",
    "─".repeat(40),
    "INACTIVE PRO TOOLS (remove from public catalog):",
    "─".repeat(40),
    ...inactive.map(k => {
      const reason = [];
      if (k === "compressed-air-leak-cost-calculator") reason.push("FORCED_INACTIVE");
      const mode = executionModes.get(k);
      if (mode === "DISABLED_UNTIL_FORMULA_READY") reason.push(mode);
      if (!existingFormulas.has(k)) reason.push("NO_FORMULA_FILE");
      if (stub.includes(k)) reason.push("STUB");
      return `  ❌ ${k} [${reason.join(", ") || "UNKNOWN"}]`;
    }),
    "",
    "─".repeat(40),
    "STUB PRO TOOLS:",
    "─".repeat(40),
    ...stub.map(k => `  ⚠️  ${k}`),
    "",
    "─".repeat(40),
    "Premium slugs.json",
    "─".repeat(40),
    `  Current: ${premiumSlugs.length} entries`,
    `  Target:  ${active.length} entries (must match ACTIVE count)`,
    "",
    "─".repeat(60),
  ];

  writeFileSync(join(REPORTS_DIR, "inactive-pro-tools-to-remove.txt"), lines.join("\n"), "utf8");

  // Console output
  console.log(lines.join("\n"));

  return report;
}

const result = main();
process.exit(0);
