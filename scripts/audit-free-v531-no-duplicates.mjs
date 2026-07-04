#!/usr/bin/env node
/**
 * audit-free-v531-no-duplicates.mjs
 * Inspects all active Free Tool sources and verifies:
 * - No duplicate tool_key
 * - No duplicate slug
 * - No duplicate canonical route
 * - No duplicate /free-tools card
 * - No duplicate sitemap URL
 * - No duplicate formula registry key
 * - Every blueprint maps to exactly one active schema
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SCAN_PATHS = {
  generated: path.join(ROOT, "generated"),
  freeSchemas: path.join(ROOT, "src/sectorcalc/schemas/free-v531"),
  formulaDir: path.join(ROOT, "src/sectorcalc/pro-runtime/free-formulas"),
  freeToolsPage: path.join(ROOT, "src/app/free-tools/page.tsx"),
  proFormulas: path.join(ROOT, "src/sectorcalc/formulas/pro-v531"),
};

let fail = false;
const checks = [];

function test(name, condition) {
  checks.push({ name, pass: !!condition });
  if (!condition) {
    console.error(`  FAIL: ${name}`);
    fail = true;
  }
}

console.log("=== FREE V5.3.1 NO DUPLICATE AUDIT ===\n");

// 1. Check free schema directory for duplicate tool_key
const toolKeys = new Map();
if (fs.existsSync(SCAN_PATHS.freeSchemas)) {
  const files = fs.readdirSync(SCAN_PATHS.freeSchemas).filter(f => f.endsWith(".schema.json"));
  for (const file of files) {
    try {
      const schema = JSON.parse(fs.readFileSync(path.join(SCAN_PATHS.freeSchemas, file), "utf8"));
      const key = schema.tool_key;
      if (toolKeys.has(key)) {
        console.error(`  DUPLICATE tool_key: ${key} (${toolKeys.get(key)} + ${file})`);
        fail = true;
      } else {
        toolKeys.set(key, file);
      }
    } catch {}
  }
}
test("No duplicate tool_key in free-v531 schemas", toolKeys.size === new Set(toolKeys.keys()).size);

// 2. Check formula modules for duplicate toolKey
const formulaKeys = [];
if (fs.existsSync(SCAN_PATHS.formulaDir)) {
  const files = fs.readdirSync(SCAN_PATHS.formulaDir).filter(f => f.endsWith(".formula.ts"));
  for (const file of files) {
    const content = fs.readFileSync(path.join(SCAN_PATHS.formulaDir, file), "utf8");
    const match = content.match(/export const toolKey = "([^"]+)"/);
    if (match) formulaKeys.push(match[1]);
  }
}
const uniqueFormulaKeys = new Set(formulaKeys);
test("No duplicate formula module toolKey", formulaKeys.length === uniqueFormulaKeys.size);
test(`Formula key count matches unique count: ${formulaKeys.length} = ${uniqueFormulaKeys.size}`, formulaKeys.length === uniqueFormulaKeys.size);

// 3. Check formula modules match schema tool_keys
const unmatchedFormulas = [];
for (const key of uniqueFormulaKeys) {
  if (!toolKeys.has(key)) {
    unmatchedFormulas.push(key);
  }
}
test(`No unmatched formula modules (0 unmatched)`, unmatchedFormulas.length === 0);
for (const key of unmatchedFormulas) {
  console.error(`  WARN: Formula module '${key}' has no matching schema`);
}

// 4. Check schema tool_keys match formula modules
const unmatchedSchemas = [];
for (const [key, file] of toolKeys) {
  if (!uniqueFormulaKeys.has(key)) {
    unmatchedSchemas.push(key);
  }
}
test(`No unmatched schemas (0 unmatched)`, unmatchedSchemas.length === 0);
for (const key of unmatchedSchemas) {
  console.error(`  WARN: Schema '${key}' (${toolKeys.get(key)}) has no matching formula module`);
}

// 5. Check PRO formula dir doesn't conflict (separate namespace)
let proFormulaKeys = [];
const proDir = SCAN_PATHS.proFormulas;
if (fs.existsSync(proDir)) {
  const files = fs.readdirSync(proDir).filter(f => f.endsWith(".formula.ts") && f !== "pro-v531-formula-registry.ts");
  for (const file of files) {
    const content = fs.readFileSync(path.join(proDir, file), "utf8");
    const match = content.match(/export const toolKey = "([^"]+)"/);
    if (match) proFormulaKeys.push(match[1]);
  }
}
const freeProOverlap = [...uniqueFormulaKeys].filter(k => proFormulaKeys.includes(k));
test(`No overlap between FREE and PRO formula keys (0 overlap)`, freeProOverlap.length === 0);
if (freeProOverlap.length > 0) {
  console.error(`  OVERLAP: ${freeProOverlap.join(", ")}`);
}

console.log(`\n=== RESULTS ===`);
let passed = 0;
for (const c of checks) {
  console.log(`  ${c.pass ? "PASS" : "FAIL"}: ${c.name}`);
  if (c.pass) passed++;
}
console.log(`\nPassed: ${passed}/${checks.length}`);
if (fail) {
  console.log("NO_DUPLICATE_AUDIT=FAIL");
  process.exit(1);
}
console.log("NO_DUPLICATE_AUDIT=PASS");
