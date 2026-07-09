// Guard: PRO V2 Field ID Consistency
// Verifies every preset key maps to an actual field ID in the weld field contract.
// Run: node scripts/guard-pro-v2-field-id-consistency.mjs

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function loadFile(relativePath) {
  return readFileSync(resolve(ROOT, relativePath), "utf-8");
}

console.log("GUARD: PRO V2 Field ID Consistency");
console.log("===================================");

// ── Load weld field contract ──────────────────────────────────────────
const contractSrc = loadFile("src/sectorcalc/pro-v2/proWeldFieldContract.ts");

// Extract field IDs from the ProFieldContract definitions
// Look for id: "..." patterns
const fieldIdRegex = /id:\s*"([^"]+)"/g;
const fieldIds = [];
let match;
while ((match = fieldIdRegex.exec(contractSrc)) !== null) {
  fieldIds.push(match[1]);
}

console.log(`\nFound ${fieldIds.length} field IDs in contract:`);
console.log(`  ${fieldIds.join(", ")}`);

// ── Load presets ──────────────────────────────────────────────────────
const WELD_PRESETS_START = contractSrc.indexOf("WELD_PRESETS:");
if (WELD_PRESETS_START === -1) {
  console.error("FAIL: Could not find WELD_PRESETS in proWeldFieldContract.ts");
  process.exit(1);
}

const presetSection = contractSrc.slice(WELD_PRESETS_START);

// Extract all value keys from preset objects
const presetValueRegex = /values:\s*\{([^}]+)\}/g;
const presetKeys = [];
let pm;
while ((pm = presetValueRegex.exec(presetSection)) !== null) {
  const block = pm[1];
  const keyRegex = /(\w+):/g;
  let km;
  while ((km = keyRegex.exec(block)) !== null) {
    if (!presetKeys.includes(km[1])) {
      presetKeys.push(km[1]);
    }
  }
}

console.log(`\nFound ${presetKeys.length} unique preset keys:`);
console.log(`  ${presetKeys.join(", ")}`);

// ── Check every preset key exists as a field ID ─────────────────────
let allMatch = true;
for (const key of presetKeys) {
  if (!fieldIds.includes(key)) {
    console.error(`FAIL: Preset key "${key}" does NOT match any field ID`);
    allMatch = false;
  }
}

// Also check inverse: all non-hidden fields should have a preset value
// (optional, for completeness)
const visibleFieldIds = new Set();
const fieldDefs = contractSrc.split("ProFieldContract");
for (const def of fieldDefs) {
  const idMatch = def.match(/id:\s*"([^"]+)"/);
  if (idMatch && !def.includes("hidden: true")) {
    visibleFieldIds.add(idMatch[1]);
  }
}

for (const vid of visibleFieldIds) {
  if (vid === "material" && fieldIds.includes("material")) {
    // material is a select field, not a numeric one; it should be in presets
    if (!presetKeys.includes(vid)) {
      console.warn(`WARN: Visible field "${vid}" has no preset value`);
    }
  }
}

// ── Check unit keys match preset keys ──────────────────────────────────
const unitKeyRegex = /(\w+):\s*"/g;
const unitKeys = [];
let um;
// Find unit keys inside the units block
const unitsStart = contractSrc.indexOf("units:");
if (unitsStart > 0) {
  const unitsSection = contractSrc.slice(unitsStart, contractSrc.indexOf("\n};", unitsStart) + 3);
  while ((um = unitKeyRegex.exec(unitsSection)) !== null) {
    unitKeys.push(um[1]);
  }
  for (const key of presetKeys) {
    if (!unitKeys.includes(key) && key !== "material") {
      console.warn(`WARN: Preset key "${key}" has no matching unit key in WELD_FIELD_CONTRACT.units`);
    }
  }
}

// ── Result ────────────────────────────────────────────────────────────
if (allMatch) {
  console.log("\nRESULT: PASS — All preset keys match valid field IDs");
} else {
  console.error("\nRESULT: FAIL — Some preset keys do not match field IDs");
  process.exit(1);
}
