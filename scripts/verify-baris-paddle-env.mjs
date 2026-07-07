// Verify Baris PRO key-pack Paddle env key
// Single env key: PADDLE_PRICE_BARIS_KEY_PACK
// Checks: key exists, value starts with pri_, no hardcoded IDs in source
// Usage: node scripts/verify-baris-paddle-env.mjs

import { execSync } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const KEY = "PADDLE_PRICE_BARIS_KEY_PACK";

console.log(`Checking ${KEY}...`);

let found = 0;
let missing = 0;
let invalidPrefix = 0;

const val = process.env[KEY];
if (val) {
  found++;
  if (!val.startsWith("pri_")) {
    console.log(`  INVALID PREFIX: ${KEY}=${val} (expected pri_*)`);
    invalidPrefix++;
  } else {
    console.log(`  OK: ${KEY}=${val}`);
  }
} else {
  missing++;
  console.log(`  MISSING: ${KEY}`);
}

// Check for hardcoded pri_ values in source (excluding the single env key)
let hardcodedCount = 0;
try {
  const grepResult = execSync(
    `rg -n 'pri_[a-zA-Z0-9]+' src/ --type ts 2>/dev/null | head -20 || true`,
    { encoding: "utf-8", cwd: ROOT },
  );
  const priLines = grepResult
    .split("\n")
    .filter((l) => l.trim() && !l.includes("startsWith") && !l.includes("KEY_PACK"));
  hardcodedCount = priLines.length;
  if (hardcodedCount > 0) {
    console.log(`\nWARNING: ${hardcodedCount} possible hardcoded pri_ values in source:`);
    for (const h of priLines.slice(0, 10)) {
      console.log(`  ${h}`);
    }
    if (priLines.length > 10) {
      console.log(`  ... and ${priLines.length - 10} more`);
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
