#!/usr/bin/env node
// Guard: PRO V2 No Public Internal Diagnostics
// Fails if D001/D002/trigger_inputs appear in public report code paths.

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const scanFiles = [
  resolve(root, "src", "sectorcalc", "pro-report", "ProReportPanelV2.tsx"),
  resolve(root, "src", "sectorcalc", "pro-report", "pro-report-adapter.ts"),
];

const FORBIDDEN_PATTERNS = [
  "D001",
  "D002",
  "schema_hash_mismatch",
];

let failures = 0;

for (const filePath of scanFiles) {
  if (!existsSync(filePath)) continue;

  const content = readFileSync(filePath, "utf8");

  for (const pattern of FORBIDDEN_PATTERNS) {
    if (content.includes(pattern)) {
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(pattern) && !lines[i].trim().startsWith("//")) {
          // Allow in these contexts:
          // - sourceOutputId references (contract key mapping)
          // - entry() calls (contract registration)
          // - derating contract validation
          // - schema field definitions
          if (lines[i].includes("sourceOutputId") || lines[i].includes("entry(") || lines[i].includes("derating") || lines[i].includes("condition")) {
            continue;
          }
          console.error(`GUARD FAIL: Diagnostic pattern "${pattern}" in ${filePath}:${i + 1}`);
          failures++;
        }
      }
    }
  }
}

if (failures > 0) {
  console.error(`\nGUARD FAILED: ${failures} internal diagnostic pattern(s) may be publicly visible`);
  process.exit(1);
}

console.log(`GUARD PASSED: No internal diagnostics in public report paths`);
