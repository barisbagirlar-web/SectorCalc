#!/usr/bin/env node

import { readFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();

// Files that must NOT exist — deleted legacy form surfaces
const FORBIDDEN_FILES = [
  "src/components/tools/FreeToolPage.tsx",
  "src/components/tools/FreeToolPremiumCalculator.tsx",
  "src/components/tools/FreeTrafficToolPage.tsx",
  "src/components/tools/MigratedFreePremiumToolSurface.tsx",
  "src/styles/free-tool-form.css",
  "src/styles/free-tool-premium.css",
  "src/components/tools/PremiumSchemaToolForm.tsx",
  "src/components/tools/FreeToolForm.tsx",
  "src/components/tools/ProToolForm.tsx",
  "src/components/tools/LegacyCalculatorForm.tsx",
];

// Tokens that must NOT appear in any public route file
const FORBIDDEN_IMPORT_TOKENS = [
  "Machine recipe or process sheet",
  "generic source",
  "FreeToolPage",
  "FreeToolPremiumCalculator",
  "FreeTrafficToolPage",
  "MigratedFreePremiumToolSurface",
  "PremiumSchemaToolForm",
  "FreeToolForm",
  "LegacyCalculatorForm",
  "sc-universal-dtf-shell",
  "sc-premium-dtf-container",
];

// Public route directories to scan
const PUBLIC_ROUTE_DIRS = [
  "src/app/tools/generated",
  "src/app/tools/pro",
  "src/app/tools/premium",
];

// File extensions to scan in public routes
const SCAN_EXT = new Set([".tsx", ".ts", ".jsx", ".js"]);

const failures = [];

// ── Check 1: Forbidden files must not exist ───────────────────────
for (const file of FORBIDDEN_FILES) {
  if (existsSync(join(ROOT, file))) {
    failures.push(`${file}: forbidden legacy form file still exists on disk`);
  }
}

// ── Check 2: Public route files must not import legacy form tokens ─
function gitFiles() {
  const out = execFileSync("git", ["ls-files"], {
    cwd: ROOT,
    encoding: "utf8",
  }).trim();
  return out ? out.split("\n").filter(Boolean) : [];
}

function isPublicRoute(file) {
  // Only page routes that render a tool form
  if (!file.includes("/[slug]/page.")) return false;
  // Exclude print and embed pages
  if (file.includes("/print/")) return false;
  if (file.includes("/embed/")) return false;
  return PUBLIC_ROUTE_DIRS.some((dir) => file.startsWith(dir)) && SCAN_EXT.has(extname(file));
}

for (const file of gitFiles().filter(isPublicRoute)) {
  const text = readFileSync(join(ROOT, file), "utf8");

  for (const token of FORBIDDEN_IMPORT_TOKENS) {
    if (text.includes(token)) {
      failures.push(`${file}: forbidden legacy form import token "${token}" found in public route`);
    }
  }
}

// ── Check 3: Public tool routes must use canonical renderer ────────
for (const file of gitFiles().filter(isPublicRoute)) {
  const text = readFileSync(join(ROOT, file), "utf8");

  // Only check actual page route files (page.tsx), not components
  if (!file.endsWith("/page.tsx") && !file.endsWith("/page.ts")) continue;

  const usesCanonical =
    text.includes("UniversalIndustrialDecisionForm") ||
    text.includes("ProToolSessionWrapper");

  if (!usesCanonical) {
    failures.push(`${file}: tool route page does not import UniversalIndustrialDecisionForm or ProToolSessionWrapper`);
  }
}

// ── Result ────────────────────────────────────────────────────────
if (failures.length > 0) {
  console.error("FORBIDDEN_FORM_SURFACES_GUARD=FAIL");
  console.error(`failure_count=${failures.length}`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("FORBIDDEN_FORM_SURFACES_GUARD=PASS");
console.log("forbidden_files_on_disk=0");
console.log("forbidden_imports_in_routes=0");
console.log("canonical_renderer_in_routes=PASS");
