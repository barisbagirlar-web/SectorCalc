#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const SCAN_DIRS = [
  "src/app/tools",
  "src/components/tools",
  "src/sectorcalc/runtime",
  "src/sectorcalc/pro-form",
];

const FORBIDDEN_TEXT = [
  "Base previewPending",
  "PHYSICAL BOUNDS0",
  "ENGINEERING RANGE0",
  "REFERENCENo",
  "EVIDENCEAdvisory",
  "daily-renovation",
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(tsx|ts|css|jsx|js)$/.test(entry.name)) out.push(full);
  }
  return out;
}

let failures = [];

for (const rel of SCAN_DIRS) {
  for (const file of walk(path.join(ROOT, rel))) {
    const text = fs.readFileSync(file, "utf8");

    for (const bad of FORBIDDEN_TEXT) {
      if (text.includes(bad)) {
        failures.push(`${path.relative(ROOT, file)} contains forbidden broken UI text: ${bad}`);
      }
    }

    // Also check for bare "categories." as string literal (not JS variable access)
    const bareCategories = text.match(/["'`]categories\.(?!\$\{)/);
    if (bareCategories) {
      failures.push(`${path.relative(ROOT, file)} contains raw categories. reference`);
    }

    if (/console\.warn\(.*Turkish/i.test(text)) {
      failures.push(`${path.relative(ROOT, file)} has warn-only Turkish handling`);
    }

    // Check for sanitizeString used with Turkish-related logic (not just generic use)
    if (/sanitizeString.*[Tt]urk|[Tt]urk.*sanitizeString/.test(text)) {
      failures.push(`${path.relative(ROOT, file)} appears to sanitize Turkish instead of fail-closed`);
    }
  }
}

if (failures.length) {
  console.error("PUBLIC_TOOL_RENDER_CONTRACT_GUARD=FAIL");
  for (const failure of failures) console.error("-", failure);
  process.exit(1);
}

console.log("PUBLIC_TOOL_RENDER_CONTRACT_GUARD=PASS");
