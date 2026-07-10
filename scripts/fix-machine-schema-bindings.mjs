#!/usr/bin/env node
// Fix machine-hourly-rate-proof-report schema:
// Add formula_bindings to inputs based on formula uses arrays.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SCHEMA_PATH = join(process.cwd(), "src/sectorcalc/schemas/pro-v531/machine-hourly-rate-proof-report.schema.json");

const raw = readFileSync(SCHEMA_PATH, "utf8");
const schema = JSON.parse(raw);

// Step 1: Build a map: input_id → set of formula IDs that use it
const inputToFormulas = new Map();

if (!schema.formulas) {
  console.log("No formulas section found.");
  process.exit(0);
}

for (const formula of schema.formulas) {
  const fid = formula.id;
  for (const inputId of formula.uses || []) {
    if (!inputToFormulas.has(inputId)) {
      inputToFormulas.set(inputId, new Set());
    }
    inputToFormulas.get(inputId).add(fid);
  }
}

// Step 2: Update each input's formula_bindings
let fixCount = 0;
for (const input of schema.inputs || []) {
  const nid = input.normalized_id;
  const formulasForInput = inputToFormulas.get(nid);
  if (formulasForInput && formulasForInput.size > 0) {
    const newBindings = Array.from(formulasForInput).sort();
    if (JSON.stringify(input.formula_bindings) !== JSON.stringify(newBindings)) {
      input.formula_bindings = newBindings;
      fixCount++;
    }
  }
}

// Step 3: Also update output bindings
// Each formula has output_bindings containing output ids
// Find the matching output and set its formula_source
const formulaToOutputs = new Map();
for (const formula of schema.formulas || []) {
  for (const outId of formula.output_bindings || []) {
    if (!formulaToOutputs.has(outId)) {
      formulaToOutputs.set(outId, new Set());
    }
    formulaToOutputs.get(outId).add(formula.id);
  }
}

let outFixCount = 0;
for (const output of schema.outputs || []) {
  const oid = output.normalized_id || output.id;
  const formulasForOutput = formulaToOutputs.get(oid);
  if (formulasForOutput && formulasForOutput.size > 0) {
    const formulaId = Array.from(formulasForOutput)[0];
    if (!output.formula_source) {
      output.formula_source = formulaId;
      outFixCount++;
    }
  }
}

console.log(`Fixed ${fixCount} inputs with formula_bindings.`);
console.log(`Fixed ${outFixCount} outputs with formula_source.`);

writeFileSync(SCHEMA_PATH, JSON.stringify(schema, null, 2) + "\n", "utf8");
console.log("Schema updated successfully.");
