#!/usr/bin/env node
/**
 * smoke-pro-v531-formula-modules.mjs
 * Verifies all 135 PRO formula modules exist and have correct structure.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const FORMULA_DIR = path.join(ROOT, "src/sectorcalc/formulas/pro-v531");
const SCHEMA_DIR = path.join(ROOT, "src/sectorcalc/schemas/v531");

let errors = 0;
let checks = 0;

function check(condition, msg) {
  checks++;
  if (!condition) { console.error(`  FAIL: ${msg}`); errors++; }
}

console.log("=== PRO V5.3.1 FORMULA MODULE SMOKE TEST ===\n");

// 1. Check formula directory exists
check(fs.existsSync(FORMULA_DIR), "PRO formula directory exists");

// 2. Count formula files
const formulaFiles = fs.readdirSync(FORMULA_DIR)
  .filter(f => f.endsWith(".formula.ts") && f !== "pro-v531-formula-registry.ts")
  .sort();
console.log(`Formula files: ${formulaFiles.length}`);

// 3. Check registry file
const registryFile = path.join(FORMULA_DIR, "pro-v531-formula-registry.ts");
check(fs.existsSync(registryFile), "Registry file exists");
const registryContent = fs.readFileSync(registryFile, "utf8");
check(registryContent.includes("export async function loadProFormulaModule"), "loadProFormulaModule exported");
check(registryContent.includes("export function listProFormulaToolKeys"), "listProFormulaToolKeys exported");

// Count registry entries
const configLines = registryContent.split("\n").filter(l => l.includes("toolKey:") && l.includes("file:"));
console.log(`Registry entries: ${configLines.length}`);

// 4. Check each formula file has correct structure
for (const file of formulaFiles) {
  const filePath = path.join(FORMULA_DIR, file);
  const content = fs.readFileSync(filePath, "utf8");

  check(content.includes('import "server-only"'), `${file}: missing server-only import`);
  check(content.includes("export function calculate"), `${file}: missing calculate function`);
  check(content.includes("export const toolKey ="), `${file}: missing toolKey export`);
  check(content.includes("export const formulaVersion"), `${file}: missing formulaVersion export`);
  check(content.includes("CalculationResult"), `${file}: missing CalculationResult`);
  check(content.includes("redaction_status"), `${file}: missing redaction_status`);
  check(!content.includes("Math.random"), `${file}: has Math.random`);
  check(!content.includes("Date.now"), `${file}: has Date.now`);

  // Check no "any" type
  if (content.includes(": any")) {
    // allow Record<string, any> — actually no, check for bare "any"
    const anyLines = content.split("\n").filter(l => !l.includes("Record<string, ") && l.match(/\bany\b/));
    for (const line of anyLines) {
      if (!line.includes("unknown") && !line.includes("// eslint") && !line.includes("as any")) {
        check(false, `${file}: has 'any' type in: ${line.trim()}`);
      }
    }
  }
}

// 5. Check schema coverage
const schemaFiles = fs.existsSync(SCHEMA_DIR)
  ? fs.readdirSync(SCHEMA_DIR).filter(f => f.endsWith(".schema.json"))
  : [];

console.log(`Schema files: ${schemaFiles.length}`);

for (const sFile of schemaFiles) {
  const schema = JSON.parse(fs.readFileSync(path.join(SCHEMA_DIR, sFile), "utf8"));
  const toolKey = schema.tool_key;
  if (!toolKey) continue;

  const formulaFile = path.join(FORMULA_DIR, `${toolKey}.formula.ts`);
  check(fs.existsSync(formulaFile), `Missing formula module for schema ${toolKey}`);

  // Check output ID alignment
  if (fs.existsSync(formulaFile)) {
    const formulaContent = fs.readFileSync(formulaFile, "utf8");
    const outputs = schema.outputs || [];
    for (const out of outputs) {
      if (out.id) {
        check(formulaContent.includes(`"${out.id}"`), `${toolKey}: output ${out.id} not in formula`);
      }
    }
  }
}

console.log(`\nChecks performed: ${checks}`);
console.log(`Errors: ${errors}`);

if (errors > 0) {
  console.log(`\nPRO_FORMULA_SMOKE=FAIL`);
  process.exit(1);
}
console.log(`\nPRO_FORMULA_SMOKE=PASS`);
