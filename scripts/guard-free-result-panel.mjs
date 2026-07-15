// SectorCalc — Guard: Free Tool Result Panel Quality
// Verifies the active V5.3.1 FREE execution/render path only.
// Legacy/generated tool components are intentionally excluded because they are not
// mounted by /tools/free/[slug] and must not create false release failures.

import { readFileSync, existsSync, globSync } from "fs";
import { resolve, relative } from "path";

const ROOT = resolve(import.meta.dirname, "..");

let pass = true;
const errors = [];

function activeRendererFiles() {
  const files = [];
  const formPath = resolve(ROOT, "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx");
  if (existsSync(formPath)) files.push(formPath);

  const freeFormDir = resolve(ROOT, "src/sectorcalc/free-form");
  if (existsSync(freeFormDir)) {
    files.push(...globSync(`${freeFormDir}/**/*.{tsx,ts}`));
  }

  return [...new Set(files)];
}

function sourceLocation(file, content, needle) {
  const index = content.indexOf(needle);
  if (index < 0) return null;
  const line = content.slice(0, index).split("\n").length;
  return `${relative(ROOT, file)}:${line}`;
}

const rendererFiles = activeRendererFiles();

// 1. Active FREE renderer must not contain duplicate/legacy result copy.
console.log("Checking active FREE renderer for legacy result patterns...");
const forbiddenPatterns = [
  "Result: Result",
  "Result: <strong",
  "Decision State —",
  'Decision State "—"',
  "sc-v531-free-interp-text",
];

for (const file of rendererFiles) {
  const content = readFileSync(file, "utf-8");
  for (const pattern of forbiddenPatterns) {
    const location = sourceLocation(file, content, pattern);
    if (location) {
      pass = false;
      errors.push(`FAIL: Forbidden active FREE result pattern ${JSON.stringify(pattern)} at ${location}`);
    }
  }
}

if (errors.length === 0) {
  console.log("  PASS: No legacy result patterns in the active FREE renderer.");
}

// 2. Required result-layer modules must exist.
const requiredFiles = [
  "src/sectorcalc/free-form/FreeToolResultPanel.tsx",
  "src/sectorcalc/free-form/freeResultText.ts",
  "src/sectorcalc/free-form/freeDecisionState.ts",
  "src/sectorcalc/free-form/free-tool-result-panel.css",
];

for (const requiredFile of requiredFiles) {
  const fullPath = resolve(ROOT, requiredFile);
  if (!existsSync(fullPath)) {
    pass = false;
    errors.push(`FAIL: Required FREE result-layer file missing: ${requiredFile}`);
  } else {
    console.log(`  PASS: ${requiredFile} exists.`);
  }
}

// 3. The active universal form must import and mount FreeToolResultPanel.
const formPath = resolve(ROOT, "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx");
if (!existsSync(formPath)) {
  pass = false;
  errors.push("FAIL: UniversalIndustrialDecisionForm.tsx not found.");
} else {
  const content = readFileSync(formPath, "utf-8");
  const importPattern = /import\s*\{\s*FreeToolResultPanel\s*\}\s*from\s*["']@\/sectorcalc\/free-form\/FreeToolResultPanel["']/;
  const mountPattern = /<FreeToolResultPanel\b/;

  if (!importPattern.test(content)) {
    pass = false;
    errors.push("FAIL: Active form does not import FreeToolResultPanel from the canonical module.");
  } else {
    console.log("  PASS: Canonical FreeToolResultPanel import exists.");
  }

  if (!mountPattern.test(content)) {
    pass = false;
    errors.push("FAIL: Active form does not mount FreeToolResultPanel.");
  } else {
    console.log("  PASS: FreeToolResultPanel is mounted in the active form.");
  }
}

// 4. The public FREE route must load the canonical result-panel stylesheet.
const pagePath = resolve(ROOT, "src/app/tools/free/[slug]/page.tsx");
if (!existsSync(pagePath)) {
  pass = false;
  errors.push("FAIL: Public FREE tool page not found.");
} else {
  const content = readFileSync(pagePath, "utf-8");
  if (!content.includes("free-tool-result-panel.css")) {
    pass = false;
    errors.push("FAIL: Public FREE tool page does not import free-tool-result-panel.css.");
  } else {
    console.log("  PASS: Public FREE route imports result-panel CSS.");
  }
}

console.log("\n========================================");
if (pass && errors.length === 0) {
  console.log("RESULT: ALL CHECKS PASSED");
} else {
  console.log(`RESULT: ${errors.length} FAILURE(S)`);
  errors.forEach((error) => console.log(`  ${error}`));
}

process.exit(pass && errors.length === 0 ? 0 : 1);
