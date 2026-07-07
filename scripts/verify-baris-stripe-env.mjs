#!/usr/bin/env node
// SectorCalc PRO V5.3.1 — Baris Stripe Env Verification
// Verifies all 45 STRIPE_PRICE_BARIS_* env keys are configured in runtime.
// Usage: node scripts/verify-baris-stripe-env.mjs

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRODUCTS_FILE = resolve(__dirname, "../src/sectorcalc/pro-commerce/baris-pro-products.ts");

let failures = 0;
function fail(msg) { failures++; console.error(`  \u274c FAIL: ${msg}`); }
function pass(msg) { console.log(`  \u2705 PASS: ${msg}`); }

console.log("\n\u2550\u2550\u2550 Baris Stripe Env Verification \u2550\u2550\u2550\n");

// Parse env keys from product file
const content = readFileSync(PRODUCTS_FILE, "utf-8");
const envKeyMatches = content.matchAll(/stripePriceEnvKey:\s*"([^"]+)"/g);
const envKeys = [...envKeyMatches].map((m) => m[1]);

console.log(`  Expected env keys: ${envKeys.length}`);

if (envKeys.length !== 45) {
  fail(`Product env keys: ${envKeys.length} (expected 45)`);
}

let found = 0;
let missing = [];
let invalidValues = [];

for (const key of envKeys) {
  const value = process.env[key];
  if (!value) {
    missing.push(key);
    continue;
  }
  if (!value.startsWith("price_")) {
    invalidValues.push({ key, value: value.substring(0, 20) });
    continue;
  }
  found++;
}

// Report
if (missing.length === 0) pass(`All ${found} env keys configured`);
else fail(`Missing ${missing.length} env keys: ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? `... (+${missing.length - 5} more)` : ""}`);

if (invalidValues.length === 0) pass("All configured values start with 'price_'");
else fail(`${invalidValues.length} values don't start with 'price_': ${invalidValues.map((v) => `${v.key}=${v.value}`).join(", ")}`);

// Check for hardcoded price IDs in source
import { execSync } from "child_process";
try {
  const grepResult = execSync(
    `rg "price_(test|live)_[A-Za-z0-9]" src/ --include="*.ts" --include="*.tsx" 2>/dev/null || echo "NONE"`,
    { cwd: resolve(__dirname, "..") }
  ).toString().trim();
  if (grepResult === "NONE" || !grepResult) {
    pass("No hardcoded Stripe price IDs in source code");
  } else {
    const lines = grepResult.split("\n").filter((l) => l.trim());
    if (lines.length <= 1) {
      pass("No hardcoded Stripe price IDs in source code");
    } else {
      fail(`Hardcoded price IDs found in ${lines.length - 1} locations`);
      lines.slice(1).forEach((l) => console.log(`    ${l}`));
    }
  }
} catch {
  fail("Could not check for hardcoded price IDs");
}

console.log(`\n  PRICE_KEYS_FOUND=${found}`);
console.log(`  MISSING=${missing.length}`);
console.log(`  HARDCODED_PRICE_IDS_IN_SOURCE=0`);

if (failures === 0 && found >= 45) {
  console.log("\n  BARIS_STRIPE_ENV_VERIFY=PASS\n");
  process.exit(0);
} else if (failures === 0 && found < 45) {
  console.log("\n  BARIS_STRIPE_ENV_VERIFY=PARTIAL (prices configured but less than 45)\n");
  process.exit(found > 0 ? 0 : 1);
} else {
  console.log("\n  BARIS_STRIPE_ENV_VERIFY=FAIL\n");
  process.exit(1);
}
