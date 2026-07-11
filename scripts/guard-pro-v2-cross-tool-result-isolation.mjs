#!/usr/bin/env node
// Guard: PRO V2 Cross-Tool Result Isolation
// Fails if report state is globally shared without slug/reportId isolation.

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const scanFiles = [
  resolve(root, "src", "sectorcalc", "pro-form", "form-state-machine.ts"),
  resolve(root, "src", "sectorcalc", "pro-form", "UniversalIndustrialDecisionForm.tsx"),
];

// These patterns indicate globally shared report state (bad)
const FORBIDDEN_SHARED_PATTERNS = [
  "globalReportState",
  "sharedReportState",
  "singleReportObject",
];

// These patterns indicate proper isolation (good, required)
const REQUIRED_ISOLATION_PATTERNS = [
  "serverResponseState: { response: null }",
  "INIT_SCHEMA",
  "RESET_RESULT_ONLY",
];

let failures = 0;

// Check for forbidden shared state patterns
for (const filePath of scanFiles) {
  if (!existsSync(filePath)) continue;
  const content = readFileSync(filePath, "utf8");

  for (const pattern of FORBIDDEN_SHARED_PATTERNS) {
    if (content.includes(pattern)) {
      // Check it's not in a comment
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(pattern) && !lines[i].trim().startsWith("//")) {
          console.error(`GUARD FAIL: Shared state pattern "${pattern}" in ${filePath}:${i + 1}`);
          failures++;
        }
      }
    }
  }
}

// Check for REQUIRED isolation patterns in form-state-machine
const stateMachinePath = resolve(root, "src", "sectorcalc", "pro-form", "form-state-machine.ts");
if (existsSync(stateMachinePath)) {
  const smContent = readFileSync(stateMachinePath, "utf8");
  for (const pattern of REQUIRED_ISOLATION_PATTERNS) {
    if (!smContent.includes(pattern)) {
      console.error(`GUARD FAIL: Required isolation pattern "${pattern}" not found in form-state-machine.ts`);
      failures++;
    }
  }
}

if (failures > 0) {
  console.error(`\nGUARD FAILED: ${failures} cross-tool isolation violation(s)`);
  process.exit(1);
}

console.log(`GUARD PASSED: Report state isolation patterns verified`);
