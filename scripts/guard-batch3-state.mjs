#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const liveTools = [
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
  "machining-cycle-time-part-cost-sheet",
  "sealed-job-quote-certificate-fire-setup-vade",
  "steel-structure-weight-cost-takeoff",
  "compressed-air-pipe-sizing-pressure-drop",
  "hydraulic-cylinder-pump-sizing",
  "pump-system-curve-npsh-verifier",
  "shaft-deflection-critical-speed-check",
  "scope-1-2-3-splitter-for-smes",
  "bank-grade-financial-projection-covenant-model",
  "ppap-gauge-rr-cpk-ppk-quality-submission-bundle",
];

const batch3Tools = liveTools.slice(20);

const formulaDir = "src/sectorcalc/formulas/pro-v531";
const goldenDir = "tests/golden/pro-v531-baris";
const readinessPath = `${formulaDir}/baris-readiness-data.ts`;
const registryPath = `${formulaDir}/baris-formula-registry.ts`;

const blockers = [];

function read(file) {
  return existsSync(file) ? readFileSync(file, "utf8") : "";
}

const readiness = read(readinessPath);
const registry = read(registryPath);

if (!readiness) blockers.push(`${readinessPath}: missing or empty`);
if (!registry) blockers.push(`${registryPath}: missing or empty`);

for (const tool of batch3Tools) {
  const formula = `${formulaDir}/${tool}.formula.ts`;
  const golden = `${goldenDir}/${tool}.golden.json`;

  if (!existsSync(formula)) blockers.push(`${formula}: missing Batch 3 formula`);
  if (!existsSync(golden)) blockers.push(`${golden}: missing Batch 3 golden fixture`);

  const formulaText = read(formula);
  if (formulaText && !formulaText.includes('import "server-only";')) {
    blockers.push(`${formula}: missing import "server-only";`);
  }
  if (formulaText && /\beval\s*\(|new\s+Function\s*\(/.test(formulaText)) {
    blockers.push(`${formula}: forbidden dynamic execution`);
  }
}

for (const tool of liveTools) {
  const formula = `${formulaDir}/${tool}.formula.ts`;
  const golden = `${goldenDir}/${tool}.golden.json`;

  if (!existsSync(formula)) blockers.push(`${formula}: missing LIVE formula`);
  if (!existsSync(golden)) blockers.push(`${golden}: missing LIVE golden fixture`);
  if (!readiness.includes(tool)) blockers.push(`readiness: ${tool} missing`);
  if (!registry.includes(tool)) blockers.push(`registry: ${tool} missing`);
}

if (existsSync(goldenDir)) {
  const goldenFiles = readdirSync(goldenDir).filter((file) => file.endsWith(".golden.json"));

  for (const file of goldenFiles) {
    const tool = file.replace(/\.golden\.json$/, "");
    const formula = `${formulaDir}/${tool}.formula.ts`;
    if (!existsSync(formula)) {
      blockers.push(`${path.join(goldenDir, file)}: orphan golden fixture without matching formula`);
    }
  }

  if (goldenFiles.length !== 30) {
    blockers.push(`golden fixture count: expected 30, detected ${goldenFiles.length}`);
  }
} else {
  blockers.push(`${goldenDir}: missing`);
}

const liveFound = liveTools.filter((tool) => readiness.includes(tool)).length;
const registeredFound = liveTools.filter((tool) => registry.includes(tool)).length;

if (liveFound !== 30) blockers.push(`LIVE_ENGINE_READY expected 30, detected ${liveFound}`);
if (registeredFound !== 30) blockers.push(`EXECUTABLE expected 30, detected ${registeredFound}`);

const forbiddenLooseThresholds = [
  ">= 20",
  "nlive > 0",
  "expected >= 20",
  "20 LIVE",
];

for (const guardFile of [
  "scripts/guard-pro-v531-baris-registry-binding.mjs",
  "scripts/guard-pro-v531-baris-readiness.mjs",
  "scripts/guard-pro-v531-baris-assisted-sale-lock.mjs",
]) {
  const text = read(guardFile);
  for (const pattern of forbiddenLooseThresholds) {
    if (text.includes(pattern)) {
      blockers.push(`${guardFile}: stale loose threshold "${pattern}"`);
    }
  }
}

if (blockers.length) {
  console.log("BATCH_3_STATE_GUARD=FAIL");
  console.log("BLOCKERS:");
  for (const blocker of blockers) console.log(`- ${blocker}`);
  process.exit(1);
}

console.log("BATCH_3_STATE_GUARD=PASS");
console.log("BATCH_3_FORMULAS=10");
console.log("BATCH_3_GOLDEN_FIXTURES=10");
console.log("LIVE_ENGINE_READY=30");
console.log("EXECUTABLE=30");
console.log("GOLDEN_FIXTURES=30");
console.log("ORPHAN_GOLDEN_FIXTURES=0");
console.log("BLOCKERS=NONE");
