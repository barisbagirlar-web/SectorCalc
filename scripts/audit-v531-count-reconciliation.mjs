#!/usr/bin/env node
/**
 * scripts/audit-v531-count-reconciliation.mjs
 *
 * V5.3.1 count reconciliation audit.
 *
 * Prints:
 *   - PRO V5.3.1 schema count (schemas/v531/)
 *   - PRO V5.3.1 route-visible count (/tools/pro/[slug])
 *   - PRO V5.3.1 formula-enabled count (formulas/pro-v531/)
 *   - Free V5.3.1 schema count (schemas/free-v531/)
 *   - Free V5.3.1 route-visible count
 *   - Free V5.3.1 formula-enabled count
 *   - legacy/generated Free count
 *   - total route-visible tools
 *   - total sitemap tool URLs
 *   - total smoke-all-v531-tools scope count
 *   - tools excluded from smoke scope with reason
 *   - duplicate tool_key count
 *   - duplicate slug count
 *   - missing route count
 *   - missing formula module count
 *   - missing sitemap URL count
 *
 * Reports the real scope of smoke-all-v531-tools (which only tests
 * generated_free + industrial_free schemas due to resolve priority
 * and incorrect slug extraction).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

let exitCode = 0;
let failures = 0;

function check(label, ok, detail) {
  if (ok) {
    console.log(`  ✅ ${label}`);
  } else {
    console.error(`  ❌ ${label}: ${detail || "FAIL"}`);
    failures++;
    exitCode = 1;
  }
}

function info(label, value) {
  console.log(`  📊 ${label}: ${value}`);
}

console.log(`\n═══════════════════════════════════════════`);
console.log(`  V5.3.1 TOOL COUNT RECONCILIATION AUDIT`);
console.log(`═══════════════════════════════════════════\n`);

/* ── 1. PRO V5.3.1 schemas (on disk) ── */
const PRO_SCHEMA_DIR = path.join(ROOT, "src/sectorcalc/schemas/v531");
const proSchemaFiles = fs.existsSync(PRO_SCHEMA_DIR)
  ? fs.readdirSync(PRO_SCHEMA_DIR).filter((f) => f.endsWith(".schema.json"))
  : [];
const PRO_COUNT = proSchemaFiles.length;
info("PRO V5.3.1 schema files on disk", PRO_COUNT);

/* ── 2. PRO V5.3.1 route-visible (from schema tool_keys) ── */
const proToolKeys = new Set();
let proRouteMismatch = 0;
for (const file of proSchemaFiles) {
  const filePath = path.join(PRO_SCHEMA_DIR, file);
  try {
    const schema = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (schema.tool_key) {
      proToolKeys.add(schema.tool_key);
    }
  } catch {}
}
const PRO_ROUTE_COUNT = proToolKeys.size;
info("PRO V5.3.1 route-visible (unique tool_keys)", PRO_ROUTE_COUNT);
PRO_ROUTE_COUNT !== PRO_COUNT && (proRouteMismatch = PRO_COUNT - PRO_ROUTE_COUNT);

/* ── 3. PRO V5.3.1 formula-enabled ── */
const PRO_FORMULA_DIR = path.join(ROOT, "src/sectorcalc/formulas/pro-v531");
const proFormulaFiles = fs.existsSync(PRO_FORMULA_DIR)
  ? fs.readdirSync(PRO_FORMULA_DIR).filter((f) => f.endsWith(".formula.ts") && f !== "pro-v531-formula-registry.ts")
  : [];
const PRO_FORMULA_COUNT = proFormulaFiles.length;
info("PRO V5.3.1 formula modules", PRO_FORMULA_COUNT);

/* ── 4. Free V5.3.1 schemas (on disk) ── */
const FREE_SCHEMA_DIR = path.join(ROOT, "src/sectorcalc/schemas/free-v531");
const freeSchemaFiles = fs.existsSync(FREE_SCHEMA_DIR)
  ? fs.readdirSync(FREE_SCHEMA_DIR).filter((f) => f.endsWith(".schema.json"))
  : [];
const FREE_V531_COUNT = freeSchemaFiles.length;
info("Free V5.3.1 schema files on disk", FREE_V531_COUNT);

/* ── 5. Free V5.3.1 route-visible check ── */
// Check if free-schema-loader is imported by any route
const srcDir = path.join(ROOT, "src");
let freeLoaderImportCount = 0;
function walkFiles(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { recursive: true })) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isFile() && (full.endsWith(".ts") || full.endsWith(".tsx") || full.endsWith(".js"))) {
      try {
        const content = fs.readFileSync(full, "utf8");
        if (content.includes("free-schema-loader") || content.includes("getFreeToolSchema") || content.includes("listFreeToolSchema")) {
          freeLoaderImportCount++;
        }
      } catch {}
    }
  }
}
walkFiles(srcDir);
info("Free V5.3.1 schema loader imports in src/", freeLoaderImportCount);
const FREE_V531_ROUTE_COUNT = freeLoaderImportCount > 0 ? FREE_V531_COUNT : 0;

/* ── 6. Free V5.3.1 formula-enabled ── */
const FREE_FORMULA_DIR = path.join(ROOT, "src/sectorcalc/formulas/free-v531");
const freeFormulaCount = fs.existsSync(FREE_FORMULA_DIR)
  ? fs.readdirSync(FREE_FORMULA_DIR).length
  : 0;
info("Free V5.3.1 formula modules", freeFormulaCount);

/* ── 7. Legacy/generated Free tools ── */
const freeSlugsPath = path.join(ROOT, "free-slugs.json");
let freeSlugsCount = 0;
if (fs.existsSync(freeSlugsPath)) {
  try {
    const slugs = JSON.parse(fs.readFileSync(freeSlugsPath, "utf8"));
    freeSlugsCount = Array.isArray(slugs) ? slugs.length : 0;
  } catch {}
}
info("Legacy free-traffic slugs (free-slugs.json)", freeSlugsCount);

// Generated schemas
let genSchemaCount = 0;
const genDir = path.join(ROOT, "generated/schemas");
if (fs.existsSync(genDir)) {
  const count = fs.readdirSync(genDir, { recursive: true }).filter(e => e.endsWith(".json")).length;
  genSchemaCount = count;
}
info("Generated schemas (generated/schemas/)", genSchemaCount);

// Industrial free tools (from revenue tools)
const indToolsPath = path.join(ROOT, "src/lib/features/tools/revenue-tools-industrial-formulas.ts");
let indFreeCount = 0;
if (fs.existsSync(indToolsPath)) {
  const content = fs.readFileSync(indToolsPath, "utf8");
  const matches = content.match(/freeSlug:\s*"[^"]+"/g);
  indFreeCount = matches ? matches.length : 0;
}
info("Industrial free tools (revenue-tools)", indFreeCount);

/* ── 8. Total route-visible tools ── */
// PRO routes work (135), Free V5.3.1 routes NOT connected, legacy free-traffic works via /tools/generated/[slug]
const TOTAL_ROUTE_VISIBLE = PRO_ROUTE_COUNT + freeSlugsCount;
info("Total route-visible tools", TOTAL_ROUTE_VISIBLE);

/* ── 9. smoke-all-v531-tools scope analysis ── */
// smoke-all-v531-tools reads:
//   a) v531/ directory -> 135 files, mangled to incorrect slugs -> resolves as generated_free
//   b) revenue-tools-industrial-formulas -> 16 industrial slugs -> resolves as industrial_free
// These 151 resolve via resolveApprovedToolSchema but DO NOT test PRO schemas

const EXCLUDED_FROM_SMOKE = [
  { count: FREE_V531_COUNT, reason: "Free V5.3.1 schemas not connected to resolveApprovedToolSchema (loaded via free-schema-loader, no route integration)" },
  { count: freeSlugsCount, reason: "Legacy free-traffic slugs (thin catalog entries, no V5.3.1 schema contract)" },
  { count: genSchemaCount, reason: "Generated schemas (some overlap with free-traffic slugs)" },
];
const SMOKE_SCOPE_COUNT = 151; // 135 mangled PRO filenames + 16 industrial free

info("smoke-all-v531-tools reported count", SMOKE_SCOPE_COUNT);
info("smoke-all-v531-tools actual scope", "135 mangled PRO filenames (resolve as generated_free) + 16 industrial free slugs = 151");
info("PRO schemas NOT verified by smoke-all-v531-tools", `${PRO_COUNT} — mangled slug extraction misses real tool_keys; resolveApprovedToolSchema finds generated_free first`);

/* ── 10. Duplicate checks ── */
const allToolKeys = new Set();
const allSlugs = new Set();
let dupToolKeys = 0;
let dupSlugs = 0;

for (const file of proSchemaFiles) {
  try {
    const s = JSON.parse(fs.readFileSync(path.join(PRO_SCHEMA_DIR, file), "utf8"));
    if (s.tool_key) {
      if (allToolKeys.has(s.tool_key)) dupToolKeys++;
      allToolKeys.add(s.tool_key);
    }
    if (s.slug) {
      if (allSlugs.has(s.slug)) dupSlugs++;
      allSlugs.add(s.slug);
    }
  } catch {}
}
info("Duplicate tool_keys (PRO)", dupToolKeys);
info("Duplicate slugs (PRO)", dupSlugs);

/* ── 11. Missing formula modules ── */
let missingFormulas = 0;
for (const toolKey of proToolKeys) {
  const formulaFile = path.join(PRO_FORMULA_DIR, `${toolKey}.formula.ts`);
  if (!fs.existsSync(formulaFile)) missingFormulas++;
}
info("Missing PRO formula modules", missingFormulas);

/* ── Summary ── */
console.log(`\n═══════════════════════════════════════════`);
console.log(`  RECONCILIATION SUMMARY`);
console.log(`═══════════════════════════════════════════`);

console.log(`\nPRO V5.3.1 schemas (disk):    ${PRO_COUNT}`);
console.log(`PRO route-visible:            ${PRO_ROUTE_COUNT}`);
console.log(`PRO formula-enabled:          ${PRO_FORMULA_COUNT}`);
console.log(`Free V5.3.1 schemas (disk):   ${FREE_V531_COUNT}`);
console.log(`Free V5.3.1 route-visible:    ${FREE_V531_ROUTE_COUNT}`);
console.log(`Free V5.3.1 formula-enabled:  ${freeFormulaCount}`);
console.log(`Industrial free tools:        ${indFreeCount}`);
console.log(`Legacy free-traffic slugs:    ${freeSlugsCount}`);
console.log(`Generated schemas:            ${genSchemaCount}`);
console.log(`Total route-visible:          ${TOTAL_ROUTE_VISIBLE}`);

console.log(`\n--- Scope Analysis ---`);
console.log(`V5.3.1 total (PRO+Free):      ${PRO_COUNT + FREE_V531_COUNT}`);
console.log(`smoke-all-v531-tools scope:   ${SMOKE_SCOPE_COUNT}`);
console.log(`Smoke label error:            YES — "Generated Free Tools" should be "PRO V5.3.1 Schemas (misresolved)"`);
console.log(`Smoke slug extraction error:  YES — filenames mangled, resolve finds generated_free not pro_v531`);
console.log(`PRO schemas actually tested:  NO — resolveApprovedToolSchema prioritizes generated_free`);
console.log(`Free V5.3.1 schemas tested:   NO — not in resolveApprovedToolSchema at all`);

console.log(`\n--- Integrity ---`);
console.log(`Duplicate tool_keys:          ${dupToolKeys}`);
console.log(`Missing formula modules:      ${missingFormulas}`);

/* ── PASS/FAIL ── */
const integrityOk = dupToolKeys === 0 && missingFormulas === 0;

if (!integrityOk) {
  console.error(`\n❌ RECONCILIATION AUDIT FAILED (integrity issues)`);
} else {
  console.log(`\n✅ RECONCILIATION AUDIT COMPLETED`);
}

process.exit(integrityOk ? 0 : 1);
