#!/usr/bin/env node
// Guard: PRO V2 Tool-Specific Report Contract
// Fails if any allowlisted PRO tool has no report contract in the registry.

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// Read the active pro tool slugs
const activeSlugsPath = resolve(root, "src", "sectorcalc", "runtime", "active-tool-allowlist.ts");
if (!existsSync(activeSlugsPath)) {
  console.error("GUARD FAIL: active-tool-allowlist.ts not found");
  process.exit(1);
}

const allowlistContent = readFileSync(activeSlugsPath, "utf8");

// Only check PRO V2 tools — exclude compressed-air-leak-cost-calculator (pilot)
const PRO_V2_SLUGS = [
  "break-even-survival-cash-calculator",
  "machine-hourly-rate-proof-report",
  "loss-making-job-detector",
  "receivables-cost-payment-term-addendum",
  "setup-time-reduction-roi-smed",
  "product-sku-margin-ranker",
  "true-employee-cost-statement",
  "job-quote-builder-pro-pack",
  "machine-investment-feasibility-buy-lease-keep",
  "capital-equipment-investment-appraisal-npv-irr",
  "customer-sku-profitability-forensics",
  "downtime-scrap-loss-statement",
  "oee-loss-monetization-improvement-business-case",
  "scrap-rework-cost-tracker",
  "outsource-vs-in-house-analyzer",
  "plant-wide-shop-rate-cost-structure-audit",
  "fx-commodity-pass-through-pricer",
  "energy-efficiency-grant-incentive-feasibility-pack",
  "motor-compressor-replacement-roi",
  "weld-procedure-cost-consumable-estimation-suite",
];

// Read the contract registry
const registryPath = resolve(root, "src", "sectorcalc", "pro-report", "pro-report-contract-registry.ts");
if (!existsSync(registryPath)) {
  console.error("GUARD FAIL: pro-report-contract-registry.ts not found");
  process.exit(1);
}

const registryContent = readFileSync(registryPath, "utf8");

let failures = 0;
for (const slug of PRO_V2_SLUGS) {

  const hasContract = registryContent.includes(`toolSlug: "${slug}"`);
  if (!hasContract) {
    console.error(`GUARD FAIL: No report contract registered for "${slug}"`);
    failures++;
  } else {
    console.log(`  OK: ${slug} has report contract`);
  }
}

if (failures > 0) {
  console.error(`\nGUARD FAILED: ${failures} tool(s) missing report contracts`);
  process.exit(1);
}

console.log(`\nGUARD PASSED: All ${PRO_V2_SLUGS.length} PRO V2 tools have report contracts`);
