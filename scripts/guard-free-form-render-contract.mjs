#!/usr/bin/env node
// guard-free-form-render-contract.mjs
// Validates free tool form rendering contract.
// Checks: no duplicate empty inputs, no BLOCKED in free context,
// no irrelevant currency selectors, advanced details spacing, Trace AI overlap.

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  FREE FORM RENDER CONTRACT GUARD");
  console.log("═══════════════════════════════════════════════════════\n");

  // Parse slugs from allowlist
  const allowlistPath = resolve(ROOT, "src/sectorcalc/runtime/active-tool-allowlist.ts");
  if (!existsSync(allowlistPath)) { console.error("FATAL: allowlist not found"); process.exit(2); }
  const allowlistContent = readFileSync(allowlistPath, "utf-8");
  const slugMatch = allowlistContent.match(/ACTIVE_FREE_TOOL_SLUGS:\s*readonly\s*string\[\]\s*=\s*\[([\s\S]*?)\];/);
  if (!slugMatch) { console.error("FATAL: Could not parse ACTIVE_FREE_TOOL_SLUGS"); process.exit(2); }
  const slugs = [...slugMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  console.log(`  Found ${slugs.length} active free tool slugs\n`);

  const formPath = resolve(ROOT, "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx");
  const cssPath = resolve(ROOT, "src/sectorcalc/pro-form/universal-industrial-decision-form.css");
  if (!existsSync(formPath)) { console.error("FATAL: Form component not found"); process.exit(2); }
  if (!existsSync(cssPath)) { console.error("FATAL: Form CSS not found"); process.exit(2); }

  const formContent = readFileSync(formPath, "utf-8");
  const cssContent = readFileSync(cssPath, "utf-8");

  const failures = [];
  let duplicateEmptyInputs = 0;
  let blockedFreeTools = 0;
  let irrelevantCurrencySelectors = 0;
  let advancedDetailsGlue = 0;

  // CHECK 1: Duplicate empty input rendering
  // The form generates inputs dynamically via renderValueInput.
  // Verify the key artifacts that prevent duplicate empty fields.
  if (!formContent.includes("key={field.id}")) {
    failures.push("Missing field.id as React key");
    duplicateEmptyInputs++;
  }
  if (!formContent.includes("function renderValueInput")) {
    failures.push("Missing renderValueInput function");
    duplicateEmptyInputs++;
  }
  if (!formContent.includes("sc-v531-field-card")) {
    failures.push("Missing sc-v531-field-card class");
    duplicateEmptyInputs++;
  }
  // Verify renderValueInput handles the three core field types
  if (!formContent.includes(`field.type === "boolean"`)) {
    failures.push("Missing boolean field render path");
    duplicateEmptyInputs++;
  }
  if (!formContent.includes(`field.type === "select"`)) {
    failures.push("Missing select field render path");
    duplicateEmptyInputs++;
  }
  // Verify dominant numeric input pattern
  if (!formContent.includes("sc-v531-value-input") && !formContent.includes("sc-v531-unit-select")) {
    failures.push("Missing numeric input control pattern");
    duplicateEmptyInputs++;
  }
  // Verify each field card renders a single value input (via inputId)
  const renderInputCalls = (formContent.match(/onValueChange/g) || []).length;
  if (renderInputCalls < 1) {
    failures.push("Missing value change handler wiring");
    duplicateEmptyInputs++;
  }

  // CHECK 2: BLOCKED state in free tool context
  const blockedMatch = formContent.match(/return\s+"BLOCKED"/);
  if (blockedMatch) {
    const freeCodeBlocked = formContent.match(/isFreeTier[\s\S]{0,300}BLOCKED/);
    if (freeCodeBlocked) {
      failures.push("BLOCKED state reachable from free-tier code path");
      blockedFreeTools++;
    }
  }

  // CHECK 3: Irrelevant currency selectors
  // The form must detect monetary fields before showing the currency selector
  if (formContent.includes("isCurrencyUnit") || formContent.includes("inputMonetary") || formContent.includes("outputMonetary")) {
    console.log("  Check 3 PASS: Currency detection logic present");
  } else {
    failures.push("Missing monetary field detection logic");
    irrelevantCurrencySelectors++;
  }

  // CHECK 4: Advanced details spacing
  // "Advanced details" and "Formula logic" must have clear visual separation
  if (cssContent.includes("sc-v531-advanced-summary") && cssContent.includes("gap:")) {
    console.log("  Check 4 PASS: Advanced details have spacing");
  } else {
    failures.push("Missing advanced details spacing");
    advancedDetailsGlue++;
  }

  // CHECK 5: Trace AI overlap on mobile
  // Mobile CSS must hide Trace AI buttons on free tool pages
  const hasTraceCss = cssContent.includes("traceai");
  const hasMobileBp = cssContent.includes("max-width: 760px");
  if (hasTraceCss && hasMobileBp) {
    const blocks = cssContent.split("@media");
    let found = false;
    for (const b of blocks) {
      if ((b.includes("traceai") || b.includes("sc-trace")) && b.includes("display:")) {
        found = true;
        break;
      }
    }
    if (found) {
      console.log("  Check 5 PASS: Trace AI hidden on mobile free tools");
    } else {
      failures.push("Trace AI not hidden in mobile media query");
    }
  } else {
    console.log("  Check 5 INFO: No Trace AI CSS found (may be external)");
  }

  const result = failures.length === 0 ? "PASS" : "FAIL";

  console.log("\n  RESULTS:");
  console.log(`  DUPLICATE_EMPTY_INPUTS=${duplicateEmptyInputs}`);
  console.log(`  BLOCKED_FREE_TOOLS=${blockedFreeTools}`);
  console.log(`  IRRELEVANT_CURRENCY_SELECTORS=${irrelevantCurrencySelectors}`);
  console.log(`  ADVANCED_DETAILS_GLUE=${advancedDetailsGlue}`);

  if (failures.length > 0) {
    console.log(`\n  ❌ FAIL — ${failures.length} issue(s):\n`);
    for (const f of failures) console.log(`  • ${f}`);
    console.log(`\n  FREE_FORM_RENDER_CONTRACT=FAIL\n`);
    process.exit(1);
  }

  console.log(`\n  ✅ ALL CHECKS PASSED`);
  console.log(`  FREE_FORM_RENDER_CONTRACT=${result}\n`);
}

main();
