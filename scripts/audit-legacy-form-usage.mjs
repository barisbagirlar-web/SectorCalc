#!/usr/bin/env node

import { readFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();

const FORBIDDEN_TOKENS = [
  "PremiumSchemaToolForm",
  "FreeToolForm",
  "ProToolForm",
  "LegacyCalculatorForm",
  "dynamic-form-v2",
  "FreeToolPremiumCalculator",
  "FreeToolPage",
  "calculateFreeToolResult(",
  "areFreeToolInputsValid(",
  "runFreeFullLoopCalculation(",
  "free-tool-form.css",
  "free-tool-premium.css",
  "sc-universal-dtf-shell",
  "sc-premium-dtf-container",
];

const EXPECTED_CANONICAL_FILES = [
  "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx",
  "src/sectorcalc/pro-form/useUniversalIndustrialDecisionFormMachine.ts",
  "src/sectorcalc/pro-form/form-state-machine.ts",
  "src/sectorcalc/pro-form/contract-types.ts",
  "src/sectorcalc/pro-form/universal-industrial-decision-form.css",
  "src/sectorcalc/pro-form/index.ts",
];

const SCAN_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".css", ".json"]);
const SCAN_ROOTS = ["src", "app", "generated", "data"];

function gitFiles() {
  const out = execFileSync("git", ["ls-files"], {
    cwd: ROOT,
    encoding: "utf8",
  }).trim();

  return out ? out.split("\n") : [];
}

function shouldScan(file) {
  if (!SCAN_ROOTS.some((root) => file === root || file.startsWith(`${root}/`))) return false;
  if (file.includes(".next/")) return false;
  if (file.includes("node_modules/")) return false;
  return SCAN_EXT.has(extname(file));
}

function read(file) {
  return readFileSync(join(ROOT, file), "utf8");
}

const failures = [];

for (const file of EXPECTED_CANONICAL_FILES) {
  if (!existsSync(join(ROOT, file))) {
    failures.push(`${file}: canonical V5.3.1 file missing`);
  }
}

for (const file of gitFiles().filter(shouldScan)) {
  const text = read(file);

  for (const token of FORBIDDEN_TOKENS) {
    if (text.includes(token)) {
      failures.push(`${file}: forbidden legacy form token found: ${token}`);
    }
  }
}

if (failures.length > 0) {
  console.error("LEGACY_FORM_USAGE_AUDIT=FAIL");
  console.error(`failure_count=${failures.length}`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("LEGACY_FORM_USAGE_AUDIT=PASS");
console.log("legacy_form_tokens=0");
console.log("canonical_renderer=UniversalIndustrialDecisionForm");
