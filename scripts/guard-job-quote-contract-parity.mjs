#!/usr/bin/env node
// Guard: job-quote-builder-pro-pack contract parity
// Verifies: schema inputs = formula inputs, schema outputs = formula outputs
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

let pass = true;

// Read schema
const schemaPath = resolve(ROOT, "src/sectorcalc/schemas/pro-v531/job-quote-builder-pro-pack.schema.json");
const schema = JSON.parse(readFileSync(schemaPath, "utf-8"));

// Read formula
const formulaPath = resolve(ROOT, "src/sectorcalc/formulas/pro-v531/job-quote-builder-pro-pack.formula.ts");
const formulaSrc = readFileSync(formulaPath, "utf-8");

// Extract schema input normalized IDs
const schemaInputIds = schema.inputs.map(i => i.normalized_id).sort();

// Extract schema output IDs
const schemaOutputIds = schema.outputs.map(o => o.id).sort();

// Extract formula inputs from get() calls
const formulaInputMatches = formulaSrc.matchAll(/get\(inputs,\s*"([^"]+)"\)/g);
const formulaInputIds = [...new Set(Array.from(formulaInputMatches, m => m[1]))].sort();

// Extract formula output IDs from assignments (supports outputs.out_xxx or O.out_xxx patterns)
const formulaOutputMatches = formulaSrc.matchAll(/(?:outputs|O)\.(out_\w+)\s*=/g);
const formulaOutputIds = [...new Set(Array.from(formulaOutputMatches, m => m[1]))].sort();

console.log("\n=== JOB QUOTE CONTRACT PARITY ===\n");

console.log(`Schema inputs: ${schemaInputIds.length}`);
console.log(`Formula inputs: ${formulaInputIds.length}`);

const missingInFormula = schemaInputIds.filter(id => !formulaInputIds.includes(id));
const extraInFormula = formulaInputIds.filter(id => !schemaInputIds.includes(id));

if (missingInFormula.length > 0) { console.error(`FAIL: Schema inputs missing from formula: ${missingInFormula.join(", ")}`); pass = false; }
if (extraInFormula.length > 0) { console.error(`FAIL: Extra inputs in formula not in schema: ${extraInFormula.join(", ")}`); pass = false; }

console.log(`Schema outputs: ${schemaOutputIds.length}`);
console.log(`Formula outputs: ${formulaOutputIds.length}`);

const missingInFormulaOut = schemaOutputIds.filter(id => !formulaOutputIds.includes(id));
const extraInFormulaOut = formulaOutputIds.filter(id => !schemaOutputIds.includes(id));

if (missingInFormulaOut.length > 0) { console.error(`FAIL: Schema outputs missing from formula: ${missingInFormulaOut.join(", ")}`); pass = false; }
if (extraInFormulaOut.length > 0) { console.error(`FAIL: Extra outputs in formula not in schema: ${extraInFormulaOut.join(", ")}`); pass = false; }

// Check no source_confidence
if (schemaInputIds.includes("n_source_confidence_ratio")) {
  console.error(`FAIL: n_source_confidence_ratio is still in schema`); pass = false;
}
if (formulaInputIds.includes("n_source_confidence_ratio")) {
  console.error(`FAIL: n_source_confidence_ratio is still in formula`); pass = false;
}

console.log(`\nRESULT: ${pass ? "PASS" : "FAIL"} — Contract parity`);
process.exit(pass ? 0 : 1);
