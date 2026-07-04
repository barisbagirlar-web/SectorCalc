#!/usr/bin/env node
/**
 * audit-free-v531-formula-blueprints-package.mjs
 * Audits that all existing Free V5.3.1 formula modules are properly
 * bound to existing active Free Tool schemas without creating duplicates.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const FORMULA_DIR = path.join(ROOT, "src/sectorcalc/pro-runtime/free-formulas");
const SCHEMA_DIR = path.join(ROOT, "src/sectorcalc/schemas/free-v531");
const REGISTRY_FILE = path.join(ROOT, "src/sectorcalc/pro-runtime/free-formula-registry.ts");
const PACKAGE_DIR = path.join(ROOT, "sectorcalc_free_v531_formula_blueprints");

let errors = 0;
let checks = 0;

function check(condition, msg) {
  checks++;
  if (!condition) { console.error(`  FAIL: ${msg}`); errors++; }
}

console.log("=== FREE V5.3.1 FORMULA BLUEPRINTS PACKAGE AUDIT ===\n");

// 1. Check if package exists (optional - we work with existing formulas)
if (fs.existsSync(PACKAGE_DIR)) {
  console.log("Package found at: sectorcalc_free_v531_formula_blueprints");
  const manifestFile = path.join(PACKAGE_DIR, "manifest.json");
  check(fs.existsSync(manifestFile), "Package manifest exists");

  const formulaFiles = fs.readdirSync(PACKAGE_DIR)
    .filter(f => f.endsWith(".formula.ts"));
  console.log(`Package formula files: ${formulaFiles.length}`);
} else {
  console.log("Package NOT FOUND. Using existing src/sectorcalc/pro-runtime/free-formulas/ instead.");
}

// 2. Check existing formula modules
check(fs.existsSync(FORMULA_DIR), "Free formula directory exists");

const formulaFiles = fs.readdirSync(FORMULA_DIR)
  .filter(f => f.endsWith(".formula.ts"))
  .sort();
console.log(`\nExisting formula files: ${formulaFiles.length}`);

// 3. Check each formula module
for (const file of formulaFiles) {
  const filePath = path.join(FORMULA_DIR, file);
  const content = fs.readFileSync(filePath, "utf8");

  check(content.includes('import "server-only"'), `${file}: missing server-only import`);
  check(content.includes("export function calculate"), `${file}: missing calculate function`);
  check(content.includes("export const toolKey ="), `${file}: missing toolKey export`);
  check(content.includes("CalculationResult"), `${file}: missing CalculationResult`);
  check(content.includes("redaction_status"), `${file}: missing redaction_status`);
  check(!content.includes("Math.random"), `${file}: has Math.random`);
  check(!content.includes("Date.now"), `${file}: has Date.now`);
  check(!content.includes("eval("), `${file}: has eval`);
  check(!content.includes("new Function"), `${file}: has new Function`);

  if (content.includes(": any")) {
    const anyLines = content.split("\n")
      .filter(l => !l.includes("Record<string, ") && l.match(/\bany\b/));
    for (const line of anyLines) {
      if (!line.includes("unknown") && !line.includes("// eslint")) {
        check(false, `${file}: has 'any' type: ${line.trim()}`);
      }
    }
  }
}

// 4. Check registry
check(fs.existsSync(REGISTRY_FILE), "Free formula registry exists");
const registryContent = fs.readFileSync(REGISTRY_FILE, "utf8");
check(registryContent.includes("export async function getFreeFormulaModule"), "getFreeFormulaModule exported");
check(registryContent.includes("export function listFreeFormulaKeys") || registryContent.includes("export async function listFreeFormulaKeys"), "listFreeFormulaKeys exported");

// 5. Check schema coverage
const schemaFiles = fs.existsSync(SCHEMA_DIR)
  ? fs.readdirSync(SCHEMA_DIR).filter(f => f.endsWith(".schema.json"))
  : [];

console.log(`\nFree V5.3.1 schema files: ${schemaFiles.length}`);

for (const sFile of schemaFiles) {
  const schema = JSON.parse(fs.readFileSync(path.join(SCHEMA_DIR, sFile), "utf8"));
  const toolKey = schema.tool_key;
  if (!toolKey) {
    check(false, `${sFile}: missing tool_key`);
    continue;
  }

  const matchFormula = formulaFiles.find(f => f.startsWith(toolKey));
  check(matchFormula, `Schema ${toolKey}: has matching formula module`);
  check(!schema.formulas?.some(f => f.expression && f.expression !== "SERVER_ONLY_REDACTED"),
    `${toolKey}: has unredacted formula expression`);
}

console.log(`\nChecks performed: ${checks}`);
console.log(`Errors: ${errors}`);

if (errors > 0) {
  console.log(`\nFREE_V531_BLUEPRINT_AUDIT=FAIL`);
  process.exit(1);
}
console.log(`\nFREE_V531_BLUEPRINT_AUDIT=PASS`);
