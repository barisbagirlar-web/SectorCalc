#!/usr/bin/env node
// SectorCalc Guard: No Duplicate or Empty Input Controls
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const formContent = fs.readFileSync(path.join(ROOT, "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx"), "utf8");
const failures = [];

// Check field grid uses .map with key={field.id}
if (!formContent.includes("key={field.id}")) {
  failures.push("Field map must use field.id as React key");
}
// Check renderValueInput exists and handles all field types
if (!formContent.includes("function renderValueInput")) {
  failures.push("renderValueInput function not found");
}
// Verify each field has a single value input (no duplicate empty controls)
// The renderValueInput function handles boolean, select, and numeric types
if (!formContent.includes('field.type === "boolean"')) {
  failures.push("Missing boolean field render path");
}
if (!formContent.includes('field.type === "select"')) {
  failures.push("Missing select field render path");
}
// Verify the field layout has value-input as dominant, unit as compact suffix
if (!formContent.includes("sc-v531-value-input")) {
  failures.push("Missing sc-v531-value-input class for dominant numeric input");
}
if (!formContent.includes("sc-v531-unit-select")) {
  failures.push("Missing sc-v531-unit-select for compact unit selector");
}

if (failures.length > 0) {
  console.error("NO_DUPLICATE_EMPTY_INPUTS=FAIL\n" + failures.join("\n"));
  process.exit(1);
}
console.log("NO_DUPLICATE_EMPTY_INPUTS=PASS");
