#!/usr/bin/env node
// smoke-public-copy-render.mjs
// Static smoke test verifying all runtime-rendered route surfaces contain
// zero forbidden jargon. Checks source files that produce:
//   - HTML body, <title>, <meta name="description">, Open Graph
//   - JSON-LD structured data
//   - AI index / LLM text
//   - Catalog card copy
//   - Tool detail hero copy
// Scans schema JSON public fields, generated registries, and route metadata.

import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname, relative, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ── Forbidden patterns ───────────────────────────────────────────────────────
const FORBIDDEN_RX = [
  { pattern: /SuperV\d+/i, label: "SuperV4" },
  { pattern: /single-operation decision-support schema/i, label: "single-operation decision-support schema" },
  { pattern: /audit evidence and commercial risk interpretation/i, label: "audit evidence and commercial risk interpretation" },
  { pattern: /Free industrial decision-support calculator/i, label: "Free industrial decision-support calculator" },
  { pattern: /formula-free decision support/i, label: "formula-free decision support" },
];

// Quick Calculator suffix pattern
const QUICK_CALC_RX = /Quick Calculator(?:\s*["'])?$/i;

const RESULTS = [];
function fail(f, p, l, s) { RESULTS.push({ file: f, path: p, forbidden: l, snippet: (s || "").substring(0,120), severity: "FAIL" }); }
function warn(f, p, l, s) { RESULTS.push({ file: f, path: p, forbidden: l, snippet: (s || "").substring(0,120), severity: "WARN" }); }

// ── Helpers ──────────────────────────────────────────────────────────────────
function isStringLiteral(line, phrase) {
  if (line.trimStart().startsWith("import ")) return false;
  const idx = line.toLowerCase().indexOf(phrase.toLowerCase());
  if (idx === -1) return false;
  const before = line.substring(0, idx);
  const after = line.substring(idx + phrase.length);
  return (before.lastIndexOf('"') !== -1 && after.indexOf('"') !== -1)
      || (before.lastIndexOf("'") !== -1 && after.indexOf("'") !== -1)
      || (before.lastIndexOf("`") !== -1 && after.indexOf("`") !== -1);
}

function hasJsxContent(line, phrase) {
  const idx = line.toLowerCase().indexOf(phrase.toLowerCase());
  if (idx === -1) return false;
  const before = line.substring(0, idx);
  const after = line.substring(idx + phrase.length);
  return before.includes(">") && after.includes("<");
}

function checkSourceFile(filePath, label) {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trimStart().startsWith("import ")) continue;
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) continue;
    if (trimmed.includes("FORBIDDEN") || trimmed.includes("forbidden")) continue;

    // Check SuperV4 in string literals
    const sv4Match = /["'`][^"'`]*SuperV\d{1,2}[^"'`]*["'`]/gi.exec(line);
    if (sv4Match) {
      fail(label, `line ${i+1}`, "SuperV4", sv4Match[0]);
    }

    // Check other forbidden phrases
    for (const { pattern, label: termLabel } of FORBIDDEN_RX) {
      if (isStringLiteral(line, termLabel) || hasJsxContent(line, termLabel)) {
        fail(label, `line ${i+1}`, termLabel, trimmed.substring(0,120));
      }
    }

    // Check Quick Calculator suffix
    if (QUICK_CALC_RX.test(trimmed) && isStringLiteral(line, "Quick Calculator")) {
      fail(label, `line ${i+1}`, "Quick Calculator suffix", trimmed.substring(0,120));
    }
  }
}

// ── EXCLUDED path patterns for non-public technical references ───────────────
const EXCLUDED_PATHS = [
  "node_modules", ".next", ".git", "archive", "backup", "quarantine", "coverage",
  "__tests__", ".firebase", "pro_tools_baris_",
  "guard-public-copy-no-schema-jargon.mjs",
  "smoke-public-copy-render.mjs",
  "sanitize-public-schema-copy.mjs",
  "batch-clean-schema-jargon.mjs",
];

function shouldExclude(relPath) {
  return EXCLUDED_PATHS.some(p => relPath.includes(p));
}

// ════════════════════════════════════════════════════════════════════════════
//  1. ROUTE SURFACES
// ════════════════════════════════════════════════════════════════════════════
console.log("\n  1. Route surfaces (source-level check)...");

const ROUTE_SOURCES = [
  { path: "src/app/[locale]/page.tsx", name: "/" },
  { path: "src/app/page.tsx", name: "/ (root)" },
  { path: "src/app/free-tools/page.tsx", name: "/free-tools" },
  { path: "src/app/pro-tools/page.tsx", name: "/pro-tools" },
  { path: "src/app/tools/free/[slug]/page.tsx", name: "/tools/free/[slug]" },
  { path: "src/app/tools/pro/[slug]/page.tsx", name: "/tools/pro/[slug]" },
  { path: "src/app/layout.tsx", name: "Root Layout" },
  { path: "src/app/not-found.tsx", name: "404" },
];

let routeCount = 0;
for (const route of ROUTE_SOURCES) {
  const fp = resolve(ROOT, route.path);
  if (!existsSync(fp)) continue;
  routeCount++;
  checkSourceFile(fp, route.name);
}
console.log(`     ${routeCount} routes checked`);

// ════════════════════════════════════════════════════════════════════════════
//  2. JSON-LD ADAPTER VERIFICATION
// ════════════════════════════════════════════════════════════════════════════
console.log("\n  2. JSON-LD components...");

const JSONLD_SOURCES = [
  "src/components/seo/JsonLd.tsx",
  "src/lib/infrastructure/seo/schema-mesh.ts",
];
let jsonldFiles = 0;
for (const jf of JSONLD_SOURCES) {
  const fp = resolve(ROOT, jf);
  if (!existsSync(fp)) continue;
  const content = readFileSync(fp, "utf-8");
  jsonldFiles++;

  // Check no raw schema.description in JSON-LD builders
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check for description: schema.description pattern (bad)
    if (/description:\s*schema\.description/i.test(line) && !line.trimStart().startsWith("//")) {
      fail(jf, `line ${i+1}`, "raw schema.description in JSON-LD", line.substring(0,120));
    }
    // Check for description: tool\.(description|seoDescription) without adapter
    if (/description:\s*tool\.(description|seoDescription)/i.test(line) && !line.trimStart().startsWith("//")) {
      // This is in buildCalculatorJsonLd using FreeTrafficTool — verify tool data is clean
      // Not a direct schema bridge, but flag as WARN
      warn(jf, `line ${i+1}`, "potential direct tool.description in JSON-LD", line.substring(0,120));
    }
  }
}
console.log(`     ${jsonldFiles} files checked`);

// ════════════════════════════════════════════════════════════════════════════
//  3. SCHEMA JSON PUBLIC FIELDS
// ════════════════════════════════════════════════════════════════════════════
console.log("\n  3. Schema JSON public fields...");

const SCHEMA_DIRS = [
  "src/sectorcalc/schemas/free-v531",
  "src/sectorcalc/schemas/pro-v531",
  "src/sectorcalc/schemas/v531",
];

const PUBLIC_FIELDS = new Set([
  "scope", "category", "tool_name", "description", "public_explanation",
  "public_note", "check", "system_boundary", "single_operation_scope",
  "decision_after_output", "cost_of_wrong_decision", "failure_mode_if_formula_wrong",
  "change_log_summary", "primary_operation", "formula_version",
]);

let schemaFileCount = 0;
function walkSchemaFields(obj, path, fileLabel) {
  if (typeof obj === "string") {
    const leaf = (path.split(".").pop() || "").replace(/\[\d+\]/g, "");
    const isPublic = PUBLIC_FIELDS.has(leaf)
      || path.includes("decision_context")
      || (leaf === "description" && (path.includes("input_groups") || path.includes("ui_contract")));
    if (!isPublic) return;

    const clean = obj.trim();
    for (const { pattern, label } of FORBIDDEN_RX) {
      if (pattern.test(clean)) fail(fileLabel, path, label, clean);
    }
    if (QUICK_CALC_RX.test(clean)) fail(fileLabel, path, "Quick Calculator suffix", clean);
    // Check merged labels
    if ((path.endsWith("category") || path.endsWith("tool_name")) && /[a-zA-Z](Free|Pro)\s*$/i.test(clean)) {
      const mergedMatch = clean.match(/([a-zA-Z])(Free|Pro)\s*$/);
      if (mergedMatch && mergedMatch[1] !== " " && mergedMatch[1] !== "·" && mergedMatch[1] !== "\u2014") {
        fail(fileLabel, path, "merged label (missing space before tier)", clean);
      }
    }
    return;
  }
  if (Array.isArray(obj)) obj.forEach((item, i) => walkSchemaFields(item, `${path}[${i}]`, fileLabel));
  else if (obj !== null && typeof obj === "object")
    Object.entries(obj).forEach(([k, v]) => walkSchemaFields(v, path ? `${path}.${k}` : k, fileLabel));
}

for (const dir of SCHEMA_DIRS) {
  const fullDir = resolve(ROOT, dir);
  if (!existsSync(fullDir)) { console.log(`     \u26A0 Not found: ${dir}`); continue; }
  const files = readdirSync(fullDir).filter(f => f.endsWith(".json") && !f.includes("registry.generated"));
  for (const file of files) {
    const fp = join(fullDir, file);
    const relPath = relative(ROOT, fp);
    if (shouldExclude(relPath)) continue;
    let obj;
    try { obj = JSON.parse(readFileSync(fp, "utf-8")); } catch { continue; }
    schemaFileCount++;
    walkSchemaFields(obj, "", relPath);
  }
}
console.log(`     ${schemaFileCount} files scanned`);

// ════════════════════════════════════════════════════════════════════════════
//  4. Generated registry.ts string literals
// ════════════════════════════════════════════════════════════════════════════
console.log("\n  4. Generated registry.ts string literals...");
const registryPath = resolve(ROOT, "src/sectorcalc/schemas/free-v531/registry.generated.ts");
let registryLiterals = 0;
if (existsSync(registryPath)) {
  const content = readFileSync(registryPath, "utf-8");
  const stringLiterals = content.match(/"([^"]+)"/g) || [];
  registryLiterals = stringLiterals.length;
  for (const sl of stringLiterals) {
    for (const { pattern, label } of FORBIDDEN_RX) {
      if (pattern.test(sl)) fail("registry.generated.ts", "string literal", label, sl);
    }
    if (QUICK_CALC_RX.test(sl)) fail("registry.generated.ts", "string literal", "Quick Calculator suffix", sl);
  }
}
console.log(`     ${registryLiterals} string literals checked`);

// ════════════════════════════════════════════════════════════════════════════
//  5. AI index / LLM text files (public/ and generated routes)
// ════════════════════════════════════════════════════════════════════════════
console.log("\n  5. AI index / LLM files...");
const AI_SOURCES = [
  "src/app/llms.txt/route.ts",
  "src/app/sectorcalc-index.txt/route.ts",
  "src/app/ai.txt/route.ts",
  "src/app/faq-knowledge.txt/route.ts",
  "src/lib/features/ai/build-ai-index-export.ts",
  "src/lib/features/ai/build-llms-txt.ts",
];
let aiCount = 0;
for (const aip of AI_SOURCES) {
  const fp = resolve(ROOT, aip);
  if (!existsSync(fp)) continue;
  aiCount++;
  const content = readFileSync(fp, "utf-8");
  for (const { pattern, label } of FORBIDDEN_RX) {
    if (pattern.test(content)) {
      const match = content.match(pattern);
      fail(aip, "(file)", label, match ? match[0] : "");
    }
  }
}
// Also scan public/*.txt and public/*.json AI files
const publicAIScans = [
  "public/ai.txt",
  "public/sectorcalc-index.txt",
  "public/faq-knowledge.txt",
  "public/ai-search-manifest.json",
  "public/services-products.txt",
  "public/routes.json",
];
for (const f of publicAIScans) {
  const fp = resolve(ROOT, f);
  if (!existsSync(fp)) continue;
  aiCount++;
  const content = readFileSync(fp, "utf-8");
  for (const { pattern, label } of FORBIDDEN_RX) {
    if (pattern.test(content)) {
      const match = content.match(pattern);
      fail(f, "(file)", label, match ? match[0] : "");
    }
  }
}
console.log(`     ${aiCount} AI/LLM files checked`);

// ════════════════════════════════════════════════════════════════════════════
//  6. Catalog page copy (hero description, card titles)
// ════════════════════════════════════════════════════════════════════════════
console.log("\n  6. Catalog page copy (hero + card sources)...");

const CATALOG_SOURCES = [
  "src/app/free-tools/page.tsx",
  "src/app/pro-tools/page.tsx",
  "src/components/catalog/CatalogPageShell.tsx",
  "src/sectorcalc/public/public-tool-copy-adapter.ts",
];
let catalogCount = 0;
for (const cs of CATALOG_SOURCES) {
  const fp = resolve(ROOT, cs);
  if (!existsSync(fp)) continue;
  catalogCount++;
  checkSourceFile(fp, cs);
}
console.log(`     ${catalogCount} catalog files checked`);

// ════════════════════════════════════════════════════════════════════════════
//  7. Public copy adapter integrity
// ════════════════════════════════════════════════════════════════════════════
console.log("\n  7. Public copy adapter integrity...");
const adapterPath = resolve(ROOT, "src/sectorcalc/public/public-tool-copy-adapter.ts");
if (existsSync(adapterPath)) {
  const content = readFileSync(adapterPath, "utf-8");
  const requiredExports = [
    "getPublicToolTitle", "getPublicToolMetaDescription",
    "getPublicProMetaDescription", "getPublicCatalogTitle",
    "deriveFieldHelpText", "isGenericHelpText",
  ];
  for (const re of requiredExports) {
    if (!content.includes(`export function ${re}`) && !content.includes(`export const ${re}`)) {
      fail("public-tool-copy-adapter.ts", "exports", `missing export: ${re}`, "");
    }
  }
  console.log("     adapter exports verified");
}

// ── Report ──────────────────────────────────────────────────────────────────
const fails = RESULTS.filter(r => r.severity === "FAIL");
const warns = RESULTS.filter(r => r.severity === "WARN");

console.log(`\n${"=".repeat(60)}`);
console.log("  SMOKE TEST RESULTS");
console.log("=".repeat(60));
console.log(`  Routes checked: ${routeCount}`);
console.log(`  Schema files: ${schemaFileCount}`);
console.log(`  Registry literals: ${registryLiterals}`);
console.log(`  AI files: ${aiCount}`);
console.log(`  Catalog files: ${catalogCount}`);
console.log(`  Fails: ${fails.length}`);
console.log(`  Warnings: ${warns.length}`);

for (const r of RESULTS) {
  const icon = r.severity === "FAIL" ? "\u274C" : "\u26A0";
  console.log(`  ${icon} [${r.severity}] ${r.file} | ${r.path}: ${r.forbidden}`);
  if (r.snippet && r.snippet.length > 5) console.log(`       "${r.snippet}"`);
}

const verdict = fails.length === 0 ? "PASS" : "FAIL";
console.log(`\nRUNTIME_RENDER_SMOKE=${verdict}`);
console.log(`BLOCKERS=${fails.length > 0 ? fails.length + " issue(s)" : "NONE"}`);

process.exit(fails.length > 0 ? 1 : 0);
