// SectorCalc — Guard: Free Tool Result Panel Quality
// Verifies the active V5.3.1 FREE execution/render path only.
// Legacy/generated tool components are intentionally excluded because they are not
// mounted by /tools/free/[slug] and must not create false release failures.

import { readFileSync, existsSync, mkdirSync, writeFileSync, readdirSync, statSync } from "fs";
import { resolve, relative, join, extname } from "path";

const ROOT = resolve(import.meta.dirname, "..");
const ARTIFACT_DIR = join(ROOT, "artifacts", "formula-integrity-audit");
mkdirSync(ARTIFACT_DIR, { recursive: true });

let pass = true;
const errors = [];
const diagnostics = [];

function walkSourceFiles(dir) {
  if (!existsSync(dir)) return [];
  const files = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      files.push(...walkSourceFiles(path));
      continue;
    }
    if ([".ts", ".tsx"].includes(extname(path))) files.push(path);
  }
  return files;
}

function activeRendererFiles() {
  const files = [];
  const formPath = resolve(ROOT, "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx");
  if (existsSync(formPath)) files.push(formPath);

  const freeFormDir = resolve(ROOT, "src/sectorcalc/free-form");
  files.push(...walkSourceFiles(freeFormDir));

  return [...new Set(files)].sort();
}

function sourceLocation(file, content, needle) {
  const index = content.indexOf(needle);
  if (index < 0) return null;
  const before = content.slice(0, index);
  const line = before.split("\n").length;
  const lineStart = before.lastIndexOf("\n") + 1;
  const lineEndRaw = content.indexOf("\n", index);
  const lineEnd = lineEndRaw < 0 ? content.length : lineEndRaw;
  return {
    location: `${relative(ROOT, file)}:${line}`,
    sourceLine: content.slice(lineStart, lineEnd).trim(),
  };
}

const rendererFiles = activeRendererFiles();

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
    const match = sourceLocation(file, content, pattern);
    if (match) {
      pass = false;
      const message = `FAIL: Forbidden active FREE result pattern ${JSON.stringify(pattern)} at ${match.location}`;
      errors.push(message);
      diagnostics.push(`${message}\n  ${match.sourceLine}`);
    }
  }
}

if (errors.length === 0) {
  console.log("  PASS: No legacy result patterns in the active FREE renderer.");
}

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

const report = [
  "# Free Result Panel Guard",
  "",
  `Status: ${pass && errors.length === 0 ? "PASS" : "FAIL"}`,
  "",
  ...(diagnostics.length > 0 ? diagnostics : ["No forbidden active-renderer patterns found."]),
  "",
  ...errors.filter((error) => !diagnostics.some((item) => item.startsWith(error))),
].join("\n");
writeFileSync(join(ARTIFACT_DIR, "free-result-panel-guard.md"), report, "utf8");

console.log("\n========================================");
if (pass && errors.length === 0) {
  console.log("RESULT: ALL CHECKS PASSED");
} else {
  console.log(`RESULT: ${errors.length} FAILURE(S)`);
  errors.forEach((error) => console.log(`  ${error}`));
}

process.exit(pass && errors.length === 0 ? 0 : 1);
