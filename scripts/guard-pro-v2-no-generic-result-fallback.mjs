#!/usr/bin/env node
// Guard: PRO V2 No Generic Result Fallback
// Fails if any PRO tool code path still uses generic result fallback patterns.

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// Files to scan for forbidden generic patterns
const scanPaths = [
  resolve(root, "src", "sectorcalc", "pro-form", "UniversalIndustrialDecisionForm.tsx"),
];

// These patterns indicate generic fallback is still active
const FORBIDDEN_PATTERNS = [
  "Evidence Completeness Index",
  "Normalized Demand or Exposure",
  "Reference Range Deviation Severity",
  "Derating or Confidence Factor",
  "Demand-Side Technical Metric",
  "Capacity or Allowable-Side Metric",
  "Governing Utilization or Margin",
  "Expanded Uncertainty",
  "Decision Threshold Crossing Risk",
  "Dominant Sensitivity Driver",
  "FMEA Trigger State",
  "Money at Risk",
  "Scenario Delta",
  "Audit Hash Payload Status",
  "Final Decision State",
];

let failures = 0;

for (const filePath of scanPaths) {
  if (!existsSync(filePath)) {
    console.error(`GUARD FAIL: File not found: ${filePath}`);
    failures++;
    continue;
  }

  const content = readFileSync(filePath, "utf8");

  for (const pattern of FORBIDDEN_PATTERNS) {
    if (content.includes(pattern)) {
      // Allow in comments and type definitions, but not in render paths
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(pattern) && !lines[i].trim().startsWith("//") && !lines[i].trim().startsWith("*")) {
          console.error(`GUARD FAIL: Generic pattern "${pattern}" found in ${filePath}:${i + 1}`);
          failures++;
        }
      }
    }
  }
}

if (failures > 0) {
  console.error(`\nGUARD FAILED: ${failures} generic fallback pattern(s) still present`);
  process.exit(1);
}

console.log(`GUARD PASSED: No generic result fallback patterns found`);
