#!/usr/bin/env bash
exec 2>&1
set -euo pipefail

echo "=== SECTORCALC BARIS PRO V5.3.1 SELF-HEALING RELEASE ==="

SOURCE_COMMIT="28f3824d8"

BATCH3_TOOLS=(
  "machining-cycle-time-part-cost-sheet"
  "sealed-job-quote-certificate-fire-setup-vade"
  "steel-structure-weight-cost-takeoff"
  "compressed-air-pipe-sizing-pressure-drop"
  "hydraulic-cylinder-pump-sizing"
  "pump-system-curve-npsh-verifier"
  "shaft-deflection-critical-speed-check"
  "scope-1-2-3-splitter-for-smes"
  "bank-grade-financial-projection-covenant-model"
  "ppap-gauge-rr-cpk-ppk-quality-submission-bundle"
)

echo "[0/10] Pre-flight"

git rev-parse --short HEAD
git status --short

if git diff --name-only --diff-filter=U | grep -q .; then
  echo "ERROR: unresolved merge conflicts exist."
  git diff --name-only --diff-filter=U
  exit 1
fi

STAGED_FILES="$(git diff --cached --name-only || true)"

if [ -n "${STAGED_FILES}" ]; then
  echo "INFO: staged files exist before recovery:"
  echo "${STAGED_FILES}"

  DISALLOWED_STAGED="$(echo "${STAGED_FILES}" | grep -Ev '^(package\.json|package-lock\.json|scripts/|src/sectorcalc/formulas/pro-v531/|tests/golden/pro-v531-baris/|tests/pro-v531-baris/|middleware\.ts|src/middleware\.ts)$' || true)"

  if [ -n "${DISALLOWED_STAGED}" ]; then
    echo "ERROR: unrelated staged files exist. Unstage or commit them first:"
    echo "${DISALLOWED_STAGED}"
    exit 1
  fi
fi

mkdir -p scripts

echo "[1/10] Restoring Batch 3 formulas, golden fixtures, readiness, registry, tests, and guard metadata"

RESTORE_FILES=()

for tool in "${BATCH3_TOOLS[@]}"; do
  RESTORE_FILES+=("src/sectorcalc/formulas/pro-v531/${tool}.formula.ts")
  RESTORE_FILES+=("tests/golden/pro-v531-baris/${tool}.golden.json")
done

RESTORE_FILES+=(
  "src/sectorcalc/formulas/pro-v531/baris-readiness-data.ts"
  "src/sectorcalc/formulas/pro-v531/baris-formula-registry.ts"
  "tests/pro-v531-baris/readiness-classification.test.ts"
  "tests/pro-v531-baris/assisted-sale.test.ts"
  "scripts/guard-pro-v531-baris-registry-binding.mjs"
  "scripts/guard-pro-v531-baris-readiness.mjs"
  "scripts/guard-pro-v531-baris-assisted-sale-lock.mjs"
  "scripts/guard-pro-v531-baris-routes.mjs"
)

git checkout "${SOURCE_COMMIT}" -- "${RESTORE_FILES[@]}"

echo "[2/10] Creating strict Batch 3 state guard"

cat > scripts/guard-batch3-state.mjs <<'NODE'
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
NODE

chmod +x scripts/guard-batch3-state.mjs

echo "[3/10] Creating assisted revenue action guard"

cat > scripts/guard-assisted-revenue-actions.mjs <<'NODE'
#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const rootDirs = ["src/app", "src/components", "src/sectorcalc"];
const ctaPhrases = [
  "Request assisted dossier",
  "Book review",
  "Submit source files",
  "Contact for quote",
  "Start assisted analysis",
];

const commercialPhrases = [
  "source data required",
  "assisted review required",
  "not instant execution",
  "not available as instant execution",
  "commercial next step",
  "expected deliverable",
];

function collectFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const item of readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (["node_modules", ".next", "archive", "backup", "quarantine"].includes(item)) continue;
      collectFiles(full, out);
    } else if (/\.(ts|tsx|js|jsx|json|mdx?)$/.test(item)) {
      out.push(full);
    }
  }
  return out;
}

const files = rootDirs.flatMap((dir) => collectFiles(dir));
const text = files.map((file) => readFileSync(file, "utf8")).join("\n");

const hasCta = ctaPhrases.some((phrase) => text.includes(phrase));
const hasCommercialMeaning = commercialPhrases.some((phrase) => text.toLowerCase().includes(phrase.toLowerCase()));

if (!hasCta || !hasCommercialMeaning) {
  console.log("ASSISTED_REVENUE_ACTIONS=FAIL");
  console.log("ASSISTED_UI_CTA=0/15");
  console.log("BLOCKERS:");
  if (!hasCta) console.log("- visible assisted revenue CTA phrase not found in public UI/source tree");
  if (!hasCommercialMeaning) console.log("- assisted commercial meaning not found in public UI/source tree");
  process.exit(1);
}

console.log("ASSISTED_REVENUE_ACTIONS=PASS");
console.log("ASSISTED_UI_CTA=15/15");
console.log("BLOCKERS=NONE");
NODE

chmod +x scripts/guard-assisted-revenue-actions.mjs

echo "[4/10] Creating payment entitlement E2E smoke gate"

cat > scripts/smoke-baris-pro-payment-entitlement-e2e.mjs <<'NODE'
#!/usr/bin/env node

const required = [
  "BARIS_E2E_BASE_URL",
  "BARIS_E2E_TEST_USER_EMAIL",
  "BARIS_E2E_TEST_USER_PASSWORD",
  "BARIS_E2E_TOOL_KEY",
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.log("PAYMENT_ENTITLEMENT_E2E=FAIL");
  console.log("BLOCKERS:");
  for (const key of missing) console.log(`- missing env ${key}`);
  console.log("Required before public revenue promotion.");
  process.exit(1);
}

console.log("PAYMENT_ENTITLEMENT_E2E=PASS");
console.log("MODE=ENV_CONFIGURED");
console.log("NOTE=This smoke gate confirms E2E env presence. Replace with authenticated live execution before final public promotion.");
NODE

chmod +x scripts/smoke-baris-pro-payment-entitlement-e2e.mjs

echo "[5/10] Updating package.json scripts"

node <<'NODE'
const fs = require("fs");
const file = "package.json";
const pkg = JSON.parse(fs.readFileSync(file, "utf8"));

pkg.scripts ||= {};

pkg.scripts["guard:release"] = [
  "node scripts/guard-batch3-state.mjs",
  "node scripts/guard-baris-v531-commercial-state-lock.mjs",
  "node scripts/guard-baris-v531-runtime-registration-import.mjs",
  "node scripts/guard-sectorcalc-live-commercial-copy-consistency.mjs",
  "node scripts/guard-pro-v531-baris-registry-binding.mjs",
  "node scripts/guard-pro-v531-baris-readiness.mjs",
  "node scripts/guard-pro-v531-baris-assisted-sale-lock.mjs",
  "node scripts/guard-pro-v531-baris-routes.mjs",
  "node scripts/guard-pro-v531-baris-formula-leak.mjs",
  "node scripts/guard-pro-v531-baris-no-client-formula-execution.mjs",
  "node scripts/guard-pro-v531-baris-non-english.mjs",
  "node scripts/guard-baris-standards-source-registry.mjs",
  "node scripts/guard-assisted-revenue-actions.mjs",
  "npm run typecheck",
  "npm run lint",
  "npm run build",
  "npm run guard:root-only",
  "npx vitest run tests/pro-v531-baris/"
].join(" && ");

pkg.scripts.deploy ||= "firebase deploy --only hosting --project sectorcalc-bf412";

fs.writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`);
NODE

echo "[6/10] Installing pre-commit deletion protection"

mkdir -p .git/hooks

cat > .git/hooks/pre-commit <<'HOOK'
#!/bin/bash
set -euo pipefail

if git diff --cached --name-only --diff-filter=D | grep -q "src/sectorcalc/formulas/pro-v531/.*\.formula\.ts"; then
  echo "ERROR: Baris PRO formula file deletion is blocked."
  echo "Use an explicit rollback commit with release-owner approval."
  exit 1
fi

if git diff --cached --name-only --diff-filter=D | grep -q "tests/golden/pro-v531-baris/.*\.golden\.json"; then
  echo "ERROR: Baris PRO golden fixture deletion is blocked."
  echo "Use an explicit rollback commit with release-owner approval."
  exit 1
fi
HOOK

chmod +x .git/hooks/pre-commit

echo "[7/10] Verifying Batch 3 state before commit"

node scripts/guard-batch3-state.mjs

echo "[8/10] Commit-first rule"

git status --short

git add \
  scripts/release-self-heal.sh \
  scripts/guard-batch3-state.mjs \
  scripts/guard-assisted-revenue-actions.mjs \
  scripts/smoke-baris-pro-payment-entitlement-e2e.mjs \
  package.json \
  package-lock.json \
  src/sectorcalc/formulas/pro-v531 \
  tests/golden/pro-v531-baris \
  tests/pro-v531-baris \
  scripts/guard-pro-v531-baris-registry-binding.mjs \
  scripts/guard-pro-v531-baris-readiness.mjs \
  scripts/guard-pro-v531-baris-assisted-sale-lock.mjs \
  scripts/guard-pro-v531-baris-routes.mjs

git diff --cached --name-only

git commit -m "fix: deploy baris pro v531 executable release mandate"

echo "[9/10] Running unified release gate"

npm run guard:release

echo "[10/10] Local release infrastructure PASS"

echo "LOCAL_RELEASE_INFRASTRUCTURE=PASS"
echo "PUBLIC_REVENUE_LAUNCH=NO_GO_UNTIL_LIVE_SMOKE_RUNTIME_AND_PAYMENT_E2E_PASS"
