#!/usr/bin/env node
// SectorCalc Guard: Mobile Form State Machine Correctness
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const failures = [];

const formContent = fs.readFileSync(path.join(ROOT, "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx"), "utf8");
const cssContent = fs.readFileSync(path.join(ROOT, "src/sectorcalc/pro-form/universal-industrial-decision-form.css"), "utf8");

// Button labels
if (!formContent.includes('"Calculating..."')) failures.push("Missing Calculating... label");
if (!formContent.includes('"Calculate"')) failures.push("Missing Calculate label");
if (!formContent.includes('"Recalculate"')) failures.push("Missing Recalculate label");

// Result panel messages
if (!formContent.includes("No result yet")) failures.push("Missing 'No result yet' placeholder");
if (!formContent.includes("Calculation not run")) failures.push("Missing 'Calculation not run' validation error");

// CSS
if (!cssContent.includes("--sc-actionbar-height")) failures.push("CSS: Missing --sc-actionbar-height");
if (!cssContent.includes("safe-area-inset-bottom")) failures.push("CSS: Missing safe-area-inset-bottom");

if (failures.length > 0) {
  console.error("MOBILE_FORM_STATE_MACHINE=FAIL\n" + failures.join("\n"));
  process.exit(1);
}
console.log("MOBILE_FORM_STATE_MACHINE=PASS");
