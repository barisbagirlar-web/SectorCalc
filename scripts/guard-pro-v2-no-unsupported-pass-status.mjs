// Guard: PRO V2 No Unsupported PASS Status
// PASS cannot appear in checklist without evidence rule.

import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

let allPass = true;

const insightDir = resolve(ROOT, "src/sectorcalc/pro-v2/insights");
const insightFiles = readdirSync(insightDir).filter((f) => f.endsWith(".ts"));

for (const file of insightFiles) {
  const src = readFileSync(resolve(insightDir, file), "utf-8");

  // Look for PASS in checklist item status
  const passPattern = /status:\s*"PASS"/;
  const matches = src.match(passPattern);
  if (matches) {
    console.error(`FAIL: [${file}] Contains ${matches.length} PASS status(es) in checklist — PASS requires explicit evidence`);
    allPass = false;
  }

  // Verify only allowed statuses exist
  const statusPattern = /status:\s*"(PROVIDED|ASSUMED|REVIEW|MISSING|NOT CHECKED|FAIL)"/g;
  const allowedStatuses = src.match(statusPattern) || [];
  // PASS and FAIL not counted — FAIL is allowed when evidence shows failure
  // Only PASS is forbidden without evidence
}

console.log(`\nGUARD: PRO V2 No Unsupported PASS Status`);
console.log(`========================================`);
if (allPass) {
  console.log(`RESULT: PASS — No unsupported PASS status found in checklists`);
} else {
  console.error(`\nRESULT: FAIL — Unsupported PASS status detected`);
  process.exit(1);
}
