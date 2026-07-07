#!/usr/bin/env node
/**
 * guard-batch3-state.mjs
 *
 * Verifies that Baris PRO V5.3.1 Batch 3 NEVER shipped.
 * Only Batch 1 (10) + Batch 2 (10) = 20 LIVE_ENGINE_READY tools exist.
 * The 10 tools formerly planned as Batch 3 are correctly classified as
 * BLOCKED_RUNTIME_CONTRACT_MISMATCH and must NOT have formula files,
 * golden fixtures, or registry entries.
 *
 * Guard logic:
 * - 20 LIVE tools must have formula.ts + golden.json + registry entry
 * - 10 BLOCKED_RUNTIME_CONTRACT_MISMATCH tools must NOT have formula/golden
 * - premium-slugs.json must contain exactly 20 active slugs
 * - No BLOCKED/ASSISTED tool may appear in premium-slugs.json
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

// ── The 20 actually LIVE tools (Batch 1 + Batch 2) ──────────────────────
const LIVE_TOOLS = [
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

// ── The 10 tools that SHOULD be BLOCKED (formerly Batch 3) ──────────────
const BLOCKED_RUNTIME_TOOLS = [
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

const formulaDir = "src/sectorcalc/formulas/pro-v531";
const goldenDir = "tests/golden/pro-v531-baris";
const readinessPath = `${formulaDir}/baris-readiness-data.ts`;
const registryPath = `${formulaDir}/baris-formula-registry.ts`;
const premiumSlugsPath = "premium-slugs.json";

const blockers = [];

function read(file) {
  return existsSync(file) ? readFileSync(file, "utf8") : "";
}

const readiness = read(readinessPath);
const registry = read(registryPath);

if (!readiness) blockers.push(`${readinessPath}: missing or empty`);
if (!registry) blockers.push(`${registryPath}: missing or empty`);

// ── VERIFY: Each LIVE tool must have formula.ts + golden.json ──────────
for (const tool of LIVE_TOOLS) {
  const formula = `${formulaDir}/${tool}.formula.ts`;
  const golden = `${goldenDir}/${tool}.golden.json`;

  if (!existsSync(formula)) blockers.push(`${formula}: missing LIVE formula`);
  if (!existsSync(golden))  blockers.push(`${golden}: missing LIVE golden fixture`);

  if (!readiness.includes(tool)) blockers.push(`readiness: ${tool} missing`);
  if (!registry.includes(tool))  blockers.push(`registry: ${tool} missing`);

  const formulaText = read(formula);
  if (formulaText && !formulaText.includes('import "server-only";')) {
    blockers.push(`${formula}: missing import "server-only";`);
  }
  if (formulaText && /\beval\s*\(|new\s+Function\s*\(/.test(formulaText)) {
    blockers.push(`${formula}: forbidden dynamic execution`);
  }
}

// ── VERIFY: Each BLOCKED runtime mismatch tool must NOT have formula ──
for (const tool of BLOCKED_RUNTIME_TOOLS) {
  const formula = `${formulaDir}/${tool}.formula.ts`;
  const golden = `${goldenDir}/${tool}.golden.json`;

  if (existsSync(formula)) blockers.push(`${formula}: BLOCKED tool has a formula (should be deleted)`);
  if (existsSync(golden))  blockers.push(`${golden}: BLOCKED tool has a golden fixture (should be deleted)`);

  // Must be in readiness as BLOCKED_RUNTIME_CONTRACT_MISMATCH
  if (!readiness.includes(`BLOCKED_RUNTIME_CONTRACT_MISMATCH`) || !readiness.includes(tool)) {
    blockers.push(`readiness: ${tool} not classified as BLOCKED_RUNTIME_CONTRACT_MISMATCH`);
  }
  // Must NOT be in registry's LIVE registration (only in BARIS_TOOL_IDS is ok)
  const liveRegistrationRegex = new RegExp(`toolKey:\\s*"${tool}"`, "");
  if (liveRegistrationRegex.test(registry)) blockers.push(`registry: ${tool} must NOT be registered as LIVE (blocked runtime mismatch)`);
}

// ── VERIFY: premium-slugs.json content ─────────────────────────────────
if (existsSync(premiumSlugsPath)) {
  const slugs = JSON.parse(readFileSync(premiumSlugsPath, "utf8"));
  if (!Array.isArray(slugs)) {
    blockers.push(`${premiumSlugsPath}: not a valid array`);
  } else {
    // Must contain exactly 20 LIVE tools
    for (const tool of LIVE_TOOLS) {
      if (!slugs.includes(tool)) blockers.push(`premium-slugs: ${tool} missing`);
    }
    // Must NOT contain any BLOCKED tool
    for (const tool of BLOCKED_RUNTIME_TOOLS) {
      if (slugs.includes(tool)) blockers.push(`premium-slugs: BLOCKED tool ${tool} should NOT be in paid catalog`);
    }
    for (const tool of ["pressure-vessel-wall-thickness-mawp-hydrotest-package", "pressure-relief-valve-sizing-sheet-api-520", "fillet-weld-sizing-verification-sheet-ec3-aws-d11", "structural-connection-verification-dossier-ec3-aisc", "bolted-connection-verifier", "bolt-torque-preload-spec-card-vdi-2230", "lifting-rigging-crane-plan-suite", "gdt-fit-clearance-calculator-iso-286", "tolerance-stack-up-root-cause-report-wc-rss", "measurement-uncertainty-budget-gum-iso-17025", "first-article-inspection-report-builder-as9102-lite", "compressed-air-leak-energy-audit-report-iso-11011", "cbam-definitive-period-compliance-package", "cbam-cost-exposure-hedging-forecaster", "cbam-supplier-emissions-data-sheet"]) {
      if (slugs.includes(tool)) blockers.push(`premium-slugs: BLOCKED_SOURCE_REQUIRED tool ${tool} should NOT be in paid catalog`);
    }
    if (slugs.length !== LIVE_TOOLS.length) {
      blockers.push(`premium-slugs: expected ${LIVE_TOOLS.length} active slugs, got ${slugs.length}`);
    }
  }
} else {
  blockers.push(`${premiumSlugsPath}: not found`);
}

// ── VERIFY: Golden fixture count matches LIVE_TOOLS ────────────────────
if (existsSync(goldenDir)) {
  const goldenFiles = readdirSync(goldenDir).filter((file) => file.endsWith(".golden.json"));

  for (const file of goldenFiles) {
    const tool = file.replace(/\.golden\.json$/, "");
    if (!LIVE_TOOLS.includes(tool)) {
      blockers.push(`${path.join(goldenDir, file)}: orphan golden fixture for non-LIVE tool`);
    }
  }

  if (goldenFiles.length !== LIVE_TOOLS.length) {
    blockers.push(`golden fixture count: expected ${LIVE_TOOLS.length}, detected ${goldenFiles.length}`);
  }
} else {
  blockers.push(`${goldenDir}: missing`);
}

// ── VERIFY: Stale loose threshold patterns ─────────────────────────────
const forbiddenLooseThresholds = [
  ">= 30",
  "nlive > 20",
  "expected >= 30",
  "30 LIVE",
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

const liveFound = LIVE_TOOLS.filter((tool) => readiness.includes(tool)).length;
const registeredFound = LIVE_TOOLS.filter((tool) => registry.includes(tool)).length;

if (liveFound !== LIVE_TOOLS.length) blockers.push(`LIVE_ENGINE_READY expected ${LIVE_TOOLS.length}, detected ${liveFound}`);
if (registeredFound !== LIVE_TOOLS.length) blockers.push(`EXECUTABLE expected ${LIVE_TOOLS.length}, detected ${registeredFound}`);

if (blockers.length) {
  console.log("BATCH_3_STATE_GUARD=FAIL");
  console.log("BLOCKERS:");
  for (const blocker of blockers) console.log(`- ${blocker}`);
  process.exit(1);
}

console.log("BATCH_3_STATE_GUARD=PASS");
console.log(`LIVE_ENGINE_READY=${LIVE_TOOLS.length}`);
console.log(`EXECUTABLE=${LIVE_TOOLS.length}`);
console.log(`GOLDEN_FIXTURES=${LIVE_TOOLS.length}`);
console.log(`BLOCKED_RUNTIME_MISMATCH=${BLOCKED_RUNTIME_TOOLS.length}`);
console.log("BATCH_3_FORMULAS=0 (not implemented — correctly blocked)");
console.log("BLOCKERS=NONE");
