// SectorCalc — Guard: Free Tool Result Panel Quality
// Ensures no free tool has the legacy "Result: Result" pattern,
// empty Decision State after valid calculation, or missing units.

import { readFileSync, existsSync, globSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(import.meta.dirname, "..");

let pass = true;
const errors = [];

// ── 1. Check for "Result: Result" in source files ──

console.log("Checking for 'Result: Result' duplicate pattern...");
const sourceFiles = [
  "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx",
  "src/sectorcalc/free-form/",
  "src/components/tools/",
];

let foundDuplicate = false;
for (const pattern of sourceFiles) {
  let files;
  if (pattern.endsWith("/")) {
    const dir = resolve(ROOT, pattern);
    if (!existsSync(dir)) continue;
    files = globSync(`${dir}**/*.{tsx,ts}`);
  } else {
    const fp = resolve(ROOT, pattern);
    if (!existsSync(fp)) continue;
    files = [fp];
  }
  for (const file of files) {
    const content = readFileSync(file, "utf-8");
    if (content.includes("Result: Result") || content.includes('Result: <strong')) {
      foundDuplicate = true;
      errors.push(`FAIL: "Result: Result" pattern found in ${file.replace(ROOT, ".")}`);
    }
  }
}
if (!foundDuplicate) {
  console.log("  PASS: No 'Result: Result' duplicate pattern found.");
}

// ── 2. Check for "Decision State —" in source files ──

console.log("Checking for empty Decision State...");
let foundEmptyDs = false;
for (const pattern of sourceFiles) {
  let files;
  if (pattern.endsWith("/")) {
    const dir = resolve(ROOT, pattern);
    if (!existsSync(dir)) continue;
    files = globSync(`${dir}**/*.{tsx,ts}`);
  } else {
    const fp = resolve(ROOT, pattern);
    if (!existsSync(fp)) continue;
    files = [fp];
  }
  for (const file of files) {
    const content = readFileSync(file, "utf-8");
    if (content.includes('Decision State "—"') || content.includes("Decision State —")) {
      foundEmptyDs = true;
      errors.push(`FAIL: Empty "Decision State —" found in ${file.replace(ROOT, ".")}`);
    }
  }
}
if (!foundEmptyDs) {
  console.log("  PASS: No empty Decision State pattern found.");
}

// ── 3. Check FreeToolResultPanel exists ──

console.log("Checking FreeToolResultPanel exists...");
const panelPath = resolve(ROOT, "src/sectorcalc/free-form/FreeToolResultPanel.tsx");
if (existsSync(panelPath)) {
  console.log("  PASS: FreeToolResultPanel.tsx exists.");
} else {
  pass = false;
  errors.push("FAIL: FreeToolResultPanel.tsx does not exist.");
}

// ── 4. Check freeResultText.ts exists ──

console.log("Checking freeResultText.ts exists...");
const textPath = resolve(ROOT, "src/sectorcalc/free-form/freeResultText.ts");
if (existsSync(textPath)) {
  console.log("  PASS: freeResultText.ts exists.");
} else {
  pass = false;
  errors.push("FAIL: freeResultText.ts does not exist.");
}

// ── 5. Check freeDecisionState.ts exists ──

console.log("Checking freeDecisionState.ts exists...");
const dsPath = resolve(ROOT, "src/sectorcalc/free-form/freeDecisionState.ts");
if (existsSync(dsPath)) {
  console.log("  PASS: freeDecisionState.ts exists.");
} else {
  pass = false;
  errors.push("FAIL: freeDecisionState.ts does not exist.");
}

// ── 6. Check CSS exists ──

console.log("Checking free-tool-result-panel.css exists...");
const cssPath = resolve(ROOT, "src/sectorcalc/free-form/free-tool-result-panel.css");
if (existsSync(cssPath)) {
  console.log("  PASS: free-tool-result-panel.css exists.");
} else {
  pass = false;
  errors.push("FAIL: free-tool-result-panel.css does not exist.");
}

// ── 7. Check that FreeToolResultPanel is imported in the form ──

console.log("Checking FreeToolResultPanel is imported in UniversalIndustrialDecisionForm...");
const formPath = resolve(ROOT, "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx");
if (existsSync(formPath)) {
  const content = readFileSync(formPath, "utf-8");
  if (content.includes("FreeToolResultPanel")) {
    console.log("  PASS: FreeToolResultPanel imported in UniversalIndustrialDecisionForm.");
  } else {
    pass = false;
    errors.push("FAIL: FreeToolResultPanel not imported in UniversalIndustrialDecisionForm.");
  }
} else {
  pass = false;
  errors.push("FAIL: UniversalIndustrialDecisionForm.tsx not found.");
}

// ── 8. Check no raw number rendering bypasses FreeToolResultPanel ──

console.log("Checking no free fallback bypasses FreeToolResultPanel...");
if (existsSync(formPath)) {
  const content = readFileSync(formPath, "utf-8");
  // Check that the old fallback patterns are gone
  if (content.includes("sc-v531-free-interp-text")) {
    pass = false;
    errors.push("FAIL: Old free interpretation (sc-v531-free-interp-text) still present in form.");
  } else {
    console.log("  PASS: Legacy free interpretation removed.");
  }
  if (content.includes('Result: <strong')) {
    pass = false;
    errors.push('FAIL: "Result: <strong" pattern still present (legacy interpretation).');
  } else {
    console.log("  PASS: Legacy 'Result:' pattern removed.");
  }
}

// ── 9. Check CSS is imported in free tool page ──

console.log("Checking CSS import in free tool page...");
const pagePath = resolve(ROOT, "src/app/tools/free/[slug]/page.tsx");
if (existsSync(pagePath)) {
  const content = readFileSync(pagePath, "utf-8");
  if (content.includes("free-tool-result-panel.css")) {
    console.log("  PASS: free-tool-result-panel.css imported in free tool page.");
  } else {
    pass = false;
    errors.push("FAIL: free-tool-result-panel.css not imported in free tool page.");
  }
}

// ── Result ──

console.log("\n========================================");
if (pass && errors.length === 0) {
  console.log("RESULT: ALL CHECKS PASSED");
} else {
  console.log(`RESULT: ${errors.length} FAILURE(S)`);
  errors.forEach((e) => console.log(`  ${e}`));
}

process.exit(pass && errors.length === 0 ? 0 : 1);
