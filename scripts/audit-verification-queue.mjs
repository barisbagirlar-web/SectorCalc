#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const failures = [];

const required = [
  "src/lib/feedback/feedback-types.ts",
  "src/lib/feedback/create-verification-item.ts",
  "src/app/api/verification-queue/route.ts",
  "src/components/feedback/CalculationFeedbackButton.tsx",
  "src/components/feedback/CalculationFeedbackModal.tsx",
  "src/app/admin/verification-queue/page.tsx",
  "scripts/report-verification-queue.mjs",
];

for (const rel of required) {
  if (!existsSync(join(ROOT, rel))) failures.push(`missing ${rel}`);
}

const route = readFileSync(join(ROOT, "src/app/api/verification-queue/route.ts"), "utf8");
if (!route.includes("rate_limited") || !route.includes("honeypot")) {
  failures.push("verification-queue route missing rate limit / honeypot handling");
}

const tr = JSON.parse(readFileSync(join(ROOT, "messages/tr.json"), "utf8"));
if (!tr.calculationFeedback?.prompt?.includes("Bu sonuçta hata")) {
  failures.push("tr calculationFeedback.prompt missing required copy");
}

console.log("audit:verification-queue");
if (failures.length) {
  console.error(`FAIL — ${failures.length} issue(s):`);
  for (const line of failures) console.error(`  - ${line}`);
  process.exit(1);
}
console.log("PASS — verification queue flow present");
process.exit(0);
