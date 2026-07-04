#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const FORBIDDEN = [
  "PremiumSchemaToolForm",
  "FreeToolForm",
  "ProToolForm",
  "LegacyCalculatorForm",
  "dynamic-form-v2",
];

const PUBLIC_ROUTE_DIRS = [
  "src/app/tools",
  "src/components/tools",
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) out.push(full);
  }
  return out;
}

let failures = [];

for (const rel of PUBLIC_ROUTE_DIRS) {
  for (const file of walk(path.join(ROOT, rel))) {
    const text = fs.readFileSync(file, "utf8");
    for (const token of FORBIDDEN) {
      if (text.includes(token)) {
        failures.push(`${path.relative(ROOT, file)} contains forbidden renderer: ${token}`);
      }
    }
  }
}

// Check that tool route pages use UniversalIndustrialDecisionForm (directly or via import)
const ROUTE_PATTERN = /tools\/(generated|pro)\/[^/]+\/page\.(tsx|ts)$/;

function walkAll(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkAll(full, out);
    else if (/\.(tsx|ts)$/.test(entry.name)) out.push(full);
  }
  return out;
}

for (const file of walkAll(path.join(ROOT, "src/app/tools"))) {
  const rel = path.relative(ROOT, file);
  if (!ROUTE_PATTERN.test(rel)) continue;

  const text = fs.readFileSync(file, "utf8");
  // Check for component name anywhere in the file (import, JSX, or wrapper)
  if (!text.includes("UniversalIndustrialDecisionForm")) {
    failures.push(`${rel} does not reference UniversalIndustrialDecisionForm`);
  }
}

if (failures.length) {
  console.error("SINGLE_TOOL_FORM_RUNTIME_GUARD=FAIL");
  for (const failure of failures) console.error("-", failure);
  process.exit(1);
}

console.log("SINGLE_TOOL_FORM_RUNTIME_GUARD=PASS");
