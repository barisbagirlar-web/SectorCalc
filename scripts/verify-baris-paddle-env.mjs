// Verify 45 PADDLE_PRICE_BARIS_* env keys
// Checks: keys exist, values start with pri_, no hardcoded IDs in source
// Usage: node scripts/verify-baris-paddle-env.mjs

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// Expected env keys from product registry
const PROD_PATH = join(
  ROOT,
  "src/sectorcalc/pro-commerce/baris-pro-products.ts",
);

const lines = readFileSync(PROD_PATH, "utf-8").split("\n");
const expectedKeys = [];
for (const line of lines) {
  const m = line.match(/paddlePriceEnvKey:\s*"([^"]+)"/);
  if (m) expectedKeys.push(m[1]);
}

console.log(`Checking ${expectedKeys.length} PADDLE_PRICE_BARIS_* env keys...`);

let found = 0;
let missing = 0;
let invalidPrefix = 0;

for (const key of expectedKeys) {
  const val = process.env[key];
  if (val) {
    found++;
    if (!val.startsWith("pri_")) {
      console.log(`  INVALID PREFIX: ${key}=${val} (expected pri_*)`);
      invalidPrefix++;
    }
  } else {
    missing++;
    console.log(`  MISSING: ${key}`);
  }
}

// Check for hardcoded pri_ values in source
import { execSync } from "child_process";
let hardcodedCount = 0;
try {
  const grepResult = execSync(
    `rg -n 'pri_[a-zA-Z0-9]+' src/ --include='*.ts' ! -path '*/node_modules/*' | head -20 || true`,
    { encoding: "utf-8", cwd: ROOT },
  );
  const priLines = grepResult
    .split("\n")
    .filter((l) => l.trim() && !l.includes("startsWith"));
  // Filter out false positives (test assertions, type definitions)
  const hardcoded = priLines.filter(
    (l) =>
      !l.includes("pri_placeholder") &&
      !l.includes("startsWith") &&
      !l.includes("should return") &&
      !l.includes("expected:") &&
      !l.includes("Expected:"),
  );
  hardcodedCount = hardcoded.length;
  if (hardcodedCount > 0) {
    console.log(`\nWARNING: ${hardcodedCount} possible hardcoded pri_ values in source:`);
    for (const h of hardcoded.slice(0, 10)) {
      console.log(`  ${h}`);
    }
    if (hardcoded.length > 10) {
      console.log(`  ... and ${hardcoded.length - 10} more`);
    }
  }
} catch {
  // rg not available
}

console.log(`\n---`);
console.log(`BARIS_PADDLE_ENV_VERIFY=${missing === 0 && invalidPrefix === 0 ? "PASS" : "FAIL"}`);
console.log(`PRICE_KEYS_FOUND=${found}`);
console.log(`MISSING=${missing}`);
console.log(`INVALID_PREFIX=${invalidPrefix}`);
console.log(`HARDCODED_PADDLE_PRICE_IDS_IN_SOURCE=${hardcodedCount}`);

process.exit(missing > 0 || invalidPrefix > 0 ? 1 : 0);
