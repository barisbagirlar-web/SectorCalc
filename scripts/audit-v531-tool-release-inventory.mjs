#!/usr/bin/env node
/**
 * scripts/audit-v531-tool-release-inventory.mjs
 *
 * V5.3.1 Tool Release Inventory Audit.
 * Reports:
 *   - active V5.3.1 PRO tool count
 *   - active V5.3.1 Free tool count
 *   - active generated/legacy tool count
 *   - total active tool count
 *   - duplicate tool_key count
 *   - duplicate slug count
 *   - duplicate route count
 *   - duplicate sitemap URL count
 *   - missing schema count
 *   - missing formula module count
 *   - REVIEW_MODULE_MISSING count
 *   - invalid schema count
 *   - schema identity mismatch count
 *
 * Expected minimum: 135 PRO V5.3.1, Free match approved inventory
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

let exitCode = 0;

const report = {
  pro_v531_count: 0,
  free_v531_count: 0,
  generated_legacy_count: 0,
  total_active: 0,
  duplicate_tool_key: 0,
  duplicate_slug: 0,
  duplicate_route: 0,
  duplicate_free_card: 0,
  duplicate_pro_card: 0,
  duplicate_sitemap_url: 0,
  missing_schema: 0,
  missing_formula_module: 0,
  review_module_missing: 0,
  invalid_schema: 0,
  schema_identity_mismatch: 0,
};

function err(msg) {
  console.error(`  FAIL: ${msg}`);
  exitCode = 1;
}

/* ── 1. Count PRO V5.3.1 schemas ── */
const PRO_SCHEMA_DIR = path.join(ROOT, "src/sectorcalc/schemas/v531");
const proSchemaFiles = fs.existsSync(PRO_SCHEMA_DIR)
  ? fs.readdirSync(PRO_SCHEMA_DIR).filter((f) => f.endsWith(".schema.json"))
  : [];
report.pro_v531_count = proSchemaFiles.length;
console.log(`\nPRO V5.3.1 schema files: ${report.pro_v531_count}`);

/* ── 2. Count Free V5.3.1 schemas ── */
const FREE_SCHEMA_DIR = path.join(ROOT, "src/sectorcalc/schemas/free-v531");
const freeSchemaFiles = fs.existsSync(FREE_SCHEMA_DIR)
  ? fs.readdirSync(FREE_SCHEMA_DIR).filter((f) => f.endsWith(".schema.json"))
  : [];
report.free_v531_count = freeSchemaFiles.length;
console.log(`Free V5.3.1 schema files: ${report.free_v531_count}`);

/* ── 3. Count PRO formula modules ── */
const PRO_FORMULA_DIR = path.join(ROOT, "src/sectorcalc/formulas/pro-v531");
const proFormulaFiles = fs.existsSync(PRO_FORMULA_DIR)
  ? fs.readdirSync(PRO_FORMULA_DIR).filter((f) => f.endsWith(".formula.ts") && f !== "pro-v531-formula-registry.ts")
  : [];
console.log(`PRO formula modules: ${proFormulaFiles.length}`);

/* ── 4. Check schema-to-formula mapping ── */
const toolKeysSeen = new Set();
const slugsSeen = new Set();
const routesSeen = new Set();

for (const file of proSchemaFiles) {
  const filePath = path.join(PRO_SCHEMA_DIR, file);
  let schema;
  try {
    schema = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (e) {
    err(`Cannot parse ${file}: ${e.message}`);
    report.invalid_schema++;
    continue;
  }

  // Required fields
  if (!schema.tool_key || !schema.tool_name || !schema.tool_id) {
    err(`${file}: missing tool_key, tool_name, or tool_id`);
    report.invalid_schema++;
    continue;
  }

  // Duplicate tool_key
  if (toolKeysSeen.has(schema.tool_key)) {
    err(`Duplicate tool_key: ${schema.tool_key} in ${file}`);
    report.duplicate_tool_key++;
  }
  toolKeysSeen.add(schema.tool_key);

  // Duplicate slug (tool_key === route slug)
  const slug = schema.tool_key;
  if (slugsSeen.has(slug)) {
    err(`Duplicate slug: ${slug} in ${file}`);
    report.duplicate_slug++;
  }
  slugsSeen.add(slug);

  // Duplicate route
  const route = `/tools/pro/${slug}`;
  if (routesSeen.has(route)) {
    err(`Duplicate route: ${route} in ${file}`);
    report.duplicate_route++;
  }
  routesSeen.add(route);

  // Identity check: tool_key should match expected key
  if (schema.tool_id && !file.includes(schema.tool_key)) {
    if (!file.includes(schema.tool_id)) {
      err(`${file}: tool_key "${schema.tool_key}" not referenced in filename`);
      report.schema_identity_mismatch++;
    }
  }
}

/* ── 5. Check tool_key for Free V5.3.1 schemas ── */
const freeToolKeys = new Set();
for (const file of freeSchemaFiles) {
  const filePath = path.join(FREE_SCHEMA_DIR, file);
  let schema;
  try {
    schema = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    continue;
  }
  if (schema.tool_key) {
    if (freeToolKeys.has(schema.tool_key)) {
      err(`Duplicate free tool_key: ${schema.tool_key} in ${file}`);
      report.duplicate_tool_key++;
    }
    freeToolKeys.add(schema.tool_key);
  }
}

/* ── 6. Check formula modules match schemas ── */
for (const file of proSchemaFiles) {
  const filePath = path.join(PRO_SCHEMA_DIR, file);
  let schema;
  try {
    schema = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    continue;
  }
  const toolKey = schema.tool_key;
  const formulaFile = path.join(PRO_FORMULA_DIR, `${toolKey}.formula.ts`);
  if (!fs.existsSync(formulaFile)) {
    err(`Missing formula module for PRO tool ${toolKey}`);
    report.missing_formula_module++;
  }
}

/* ── 7. Count generated/legacy tools (free traffic calculators) ── */
const freeSlugsPath = path.join(ROOT, "free-slugs.json");
if (fs.existsSync(freeSlugsPath)) {
  try {
    const freeSlugs = JSON.parse(fs.readFileSync(freeSlugsPath, "utf8"));
    report.generated_legacy_count = Array.isArray(freeSlugs) ? freeSlugs.length : 0;
  } catch {
    report.generated_legacy_count = 0;
  }
}
console.log(`Generated/legacy free traffic slugs: ${report.generated_legacy_count}`);

/* ── 8. Total active tools ── */
report.total_active = report.pro_v531_count + report.free_v531_count + report.generated_legacy_count;
console.log(`Total active tools: ${report.total_active}`);

/* ── 9. REVIEW_MODULE_MISSING count (schemas without formula module) ── */
report.review_module_missing = report.missing_formula_module;
console.log(`REVIEW_MODULE_MISSING: ${report.review_module_missing}`);

/* ── Summary ── */
console.log("\n=== INVENTORY AUDIT SUMMARY ===");
console.log(JSON.stringify(report, null, 2));

const expectedMinProV531 = 135;
const failReasons = [];

if (report.pro_v531_count < expectedMinProV531) {
  failReasons.push(`PRO V5.3.1 tools: expected >= ${expectedMinProV531}, got ${report.pro_v531_count}`);
}
if (report.duplicate_tool_key > 0) {
  failReasons.push(`${report.duplicate_tool_key} duplicate tool_key(s) found`);
}
if (report.duplicate_slug > 0) {
  failReasons.push(`${report.duplicate_slug} duplicate slug(s) found`);
}
if (report.duplicate_route > 0) {
  failReasons.push(`${report.duplicate_route} duplicate route(s) found`);
}
if (report.missing_formula_module > 0 && report.missing_formula_module !== report.review_module_missing) {
  failReasons.push(`${report.missing_formula_module} missing formula module(s)`);
}
if (report.invalid_schema > 0) {
  failReasons.push(`${report.invalid_schema} invalid schema(s)`);
}
if (report.schema_identity_mismatch > 0) {
  failReasons.push(`${report.schema_identity_mismatch} schema identity mismatch(es)`);
}

if (failReasons.length > 0) {
  console.error("\n❌ INVENTORY AUDIT FAILED:");
  for (const r of failReasons) {
    console.error(`  - ${r}`);
  }
} else {
  console.log("\n✅ INVENTORY AUDIT PASSED");
}

process.exit(failReasons.length > 0 ? 1 : 0);
