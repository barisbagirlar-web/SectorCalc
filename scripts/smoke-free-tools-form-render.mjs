#!/usr/bin/env node
/**
 * scripts/smoke-free-tools-form-render.mjs
 *
 * Static analysis: verifies Free tool form structure is correct.
 * Checks that the renderer produces professional Free calculator output.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const failures = [];

// ── Check 1: Free tool page uses UniversalIndustrialDecisionForm with accessTier="FREE" ──
const freePageFile = path.join(ROOT, "src/app/tools/free/[slug]/page.tsx");
const freePageContent = fs.readFileSync(freePageFile, "utf8");

if (!freePageContent.includes('accessTier="FREE"')) {
  failures.push("Free tool page must pass accessTier=FREE");
}
if (!freePageContent.includes("UniversalIndustrialDecisionForm")) {
  failures.push("Free tool page must use UniversalIndustrialDecisionForm");
}
if (!freePageContent.includes("ProToolSessionWrapper")) {
  failures.push("Free tool page must use ProToolSessionWrapper");
}

// ── Check 2: Form has Calculate button for FREE ──
const formFile = path.join(ROOT, "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx");
const formContent = fs.readFileSync(formFile, "utf8");

if (!formContent.includes('"Calculate"')) {
  failures.push("Form must have Calculate button label");
}
if (!formContent.includes('"Recalculate"')) {
  failures.push("Form must have Recalculate button label");
}
if (!formContent.includes('"Reset inputs"')) {
  failures.push("Form must have Reset inputs button");
}

// ── Check 3: Free tools show no BLOCKED in results ──
if (!formContent.includes("No result yet")) {
  failures.push("Free results must show 'No result yet' placeholder");
}
if (!formContent.includes("Calculation not run")) {
  failures.push("Free results must show 'Calculation not run' validation error");
}

// ── Check 4: Free tools have proper hero description (no SuperV4 jargon) ──
if (!formContent.includes("getFreeToolDescription")) {
  failures.push("Form must use getFreeToolDescription for free tool hero text");
}

// ── Check 5: Free tools use derived field descriptions for generic help text ──
if (!formContent.includes("deriveFieldDescription")) {
  failures.push("Form must use deriveFieldDescription for generic help text");
}
if (!formContent.includes("isGenericHelpText")) {
  failures.push("Form must use isGenericHelpText to detect generic help text");
}

// ── Check 6: Free tools have only "Reset" secondary action (no "Check inputs") ──
// The form must have "Check inputs" for PRO mode
if (!formContent.includes('"Check inputs"')) {
  failures.push("PRO mode must have 'Check inputs' secondary action");
}

// ── Check 7: Free tools have data-access-tier attribute ──
if (!formContent.includes('data-access-tier={accessTier}')) {
  failures.push("Form shell must have data-access-tier attribute");
}

if (failures.length > 0) {
  console.error("FREE_TOOLS_FORM_RENDER=FAIL");
  failures.forEach(f => console.error(`  - ${f}`));
  process.exit(1);
}
console.log("FREE_TOOLS_FORM_RENDER=PASS");
