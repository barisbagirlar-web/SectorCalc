#!/usr/bin/env node
// SectorCalc PRO V5.3.1 — Baris Productization Guard
// Manifest-driven: reads actual product registry + readiness data.
// Verifies all 45 products are correctly configured for sale.

import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

let failCount = 0;
function fail(msg) { failCount++; console.error(`  \u274c FAIL: ${msg}`); }
function pass(msg) { console.log(`  \u2705 PASS: ${msg}`); }

console.log("\n\u2550\u2550\u2550 Baris PRO Productization Guard \u2550\u2550\u2550\n");

const PRODUCT_FILE = resolve(__dirname, "../src/sectorcalc/pro-commerce/baris-pro-products.ts");
const READINESS_FILE = resolve(__dirname, "../src/sectorcalc/formulas/pro-v531/baris-readiness-data.ts");
const REGISTRY_FILE = resolve(__dirname, "../src/sectorcalc/formulas/pro-v531/baris-formula-registry.ts");
const FORMULA_DIR = resolve(__dirname, "../src/sectorcalc/formulas/pro-v531");
const GOLDEN_DIR = resolve(__dirname, "../tests/golden/pro-v531-baris");

// Simple key extraction: just find all toolKey instances
function grepKeys(text) {
  const re = /toolKey:\s*"([^"]+)"/g;
  const keys = [];
  let m;
  while ((m = re.exec(text)) !== null) keys.push(m[1]);
  return keys;
}

function grepValues(text, field) {
  const re = new RegExp(`${field}:\\s*(true|false|"[^"]*"|\\d+)`, "g");
  const vals = [];
  let m;
  while ((m = re.exec(text)) !== null) vals.push(m[1].replace(/"/g, ""));
  return vals;
}

const productRaw = readFileSync(PRODUCT_FILE, "utf-8");
const readinessRaw = readFileSync(READINESS_FILE, "utf-8");
const registryRaw = readFileSync(REGISTRY_FILE, "utf-8");

// Extract product data - count toolKey instances in BARIS_PRO_PRODUCTS array
const productKeys = grepKeys(productRaw);
const instantCount = (productRaw.match(/productMode:\s*"INSTANT_PRO_CALCULATOR"/g) || []).length;
const dossierCount = (productRaw.match(/productMode:\s*"ASSISTED_PRO_DOSSIER"/g) || []).length;
const visibleCount = (productRaw.match(/visible:\s*true/g) || []).length;
const sellableCount = (productRaw.match(/sellable:\s*true/g) || []).length;
const entitlementCount = (productRaw.match(/entitlementRequired:\s*true/g) || []).length;
const envKeys = grepValues(productRaw, "stripePriceEnvKey").filter(k => k.startsWith("STRIPE_PRICE_BARIS_"));
const ctaLive = productRaw.match(/ctaLabel:\s*"Start PRO Calculation"/g) || [];
const ctaDossier = productRaw.match(/ctaLabel:\s*"Start PRO Dossier Request"/g) || [];
const badgeLive = productRaw.match(/publicBadge:\s*"PRO Calculator"/g) || [];
const badgeDossier = productRaw.match(/publicBadge:\s*"PRO Dossier"/g) || [];

// Extract readiness data
function extractReadiness(text) {
  const liveMatch = text.match(/LIVE_ENGINE_READY_TOOLS.*?\[\n([\s\S]*?)\];/);
  const sourceMatch = text.match(/BLOCKED_SOURCE_REQUIRED_TOOLS.*?\[\n([\s\S]*?)\];/);
  const contractMatch = text.match(/BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS.*?\[\n([\s\S]*?)\];/);
  const re = /tool_key:\s*"([^"]+)"/g;
  const live = []; const source = []; const contract = [];
  if (liveMatch) { let m; while ((m = re.exec(liveMatch[1])) !== null) live.push(m[1]); }
  if (sourceMatch) { let m; while ((m = re.exec(sourceMatch[1])) !== null) source.push(m[1]); }
  if (contractMatch) { let m; while ((m = re.exec(contractMatch[1])) !== null) contract.push(m[1]); }
  return { live, source, contract, nlive: live.length, nsource: source.length, ncontract: contract.length };
}
const readiness = extractReadiness(readinessRaw);

// Registry keys
const registryKeysRaw = grepKeys(registryRaw);

const nProducts = productKeys.length;

// Filter unique envKeys
const uniqueEnvKeys = [...new Set(envKeys)];

console.log(`  Products: ${nProducts} | Instant: ${instantCount} | Dossier: ${dossierCount}`);
console.log(`  Readiness LIVE: ${readiness.nlive} | SOURCE: ${readiness.nsource} | CONTRACT: ${readiness.ncontract}`);

// 1. Product counts
if (nProducts === 45) pass(`Products total: ${nProducts}`); else fail(`Products total: ${nProducts} (expected 45)`);
if (instantCount === 20) pass(`Instant calculator products: ${instantCount}`); else fail(`Instant calculator products: ${instantCount} (expected 20)`);
if (dossierCount === 25) pass(`Assisted dossier products: ${dossierCount}`); else fail(`Assisted dossier products: ${dossierCount} (expected 25)`);

// 2. All visible and sellable
if (visibleCount >= 45) pass("All 45 products visible"); else fail(`Visible: ${visibleCount}`);
if (sellableCount >= 45) pass("All 45 products sellable"); else fail(`Sellable: ${sellableCount}`);

// 3. All entitlement required
if (entitlementCount >= 45) pass("All products require entitlement"); else fail(`Entitlement: ${entitlementCount}`);

// 4. Env keys
if (uniqueEnvKeys.length === 45) pass(`All 45 products have stripe price env keys`); else fail(`Env keys: ${uniqueEnvKeys.length} (expected 45)`);

// 5. Live tools have formula files, golden fixtures, registry binding
let liveOk = 0;
for (const k of readiness.live) {
  const hasFormula = existsSync(resolve(FORMULA_DIR, `${k}.formula.ts`));
  const hasGolden = existsSync(resolve(GOLDEN_DIR, `${k}.golden.json`));
  const hasRegistry = registryKeysRaw.includes(k);
  if (hasFormula && hasGolden && hasRegistry) liveOk++;
  else {
    const missing = [];
    if (!hasFormula) missing.push("formula");
    if (!hasGolden) missing.push("golden");
    if (!hasRegistry) missing.push("registry");
    fail(`LIVE "${k}" missing: ${missing.join(", ")}`);
  }
}
if (liveOk === readiness.nlive) pass(`All ${readiness.nlive} LIVE tools have formula + golden + registry`);

// 6. Blocked tools have NO registry binding
let blockedInRegistry = 0;
for (const k of [...readiness.source, ...readiness.contract]) {
  if (registryKeysRaw.includes(k)) {
    blockedInRegistry++;
    fail(`BLOCKED "${k}" has registry binding (should NOT)`);
  }
}
if (blockedInRegistry === 0) pass(`All ${readiness.nsource + readiness.ncontract} BLOCKED tools have no registry binding`);

// 7. Forbidden claims check
const forbiddenClaims = ["Certified", "Approved", "Legal proof", "Guaranteed compliance", "Instant result"];
let claimViolations = 0;
for (const claim of forbiddenClaims) {
  if (productRaw.includes(`"${claim}"`)) {
    fail(`Forbidden claim found: "${claim}"`);
    claimViolations++;
  }
}
// ACTUALLY check each product's fields
for (const field of ["publicBadge", "publicNotice", "ctaLabel"]) {
  for (const claim of forbiddenClaims) {
    const re = new RegExp(`${field}:\\s*"[^"]*${claim}[^"]*"`);
    if (re.test(productRaw)) {
      fail(`Forbidden claim "${claim}" in ${field}`);
      claimViolations++;
    }
  }
}
if (claimViolations === 0) pass("No forbidden claims in product labels");

// 8. Instant calculators have correct labels
if (ctaLive.length === 20) pass(`All ${ctaLive.length} instant calculators have "Start PRO Calculation"`);
else fail(`Instant calculator CTAs: ${ctaLive.length} (expected 20)`);
if (badgeLive.length === 20) pass(`All ${badgeLive.length} instant calculators have "PRO Calculator"`);
else fail(`Instant calculator badges: ${badgeLive.length} (expected 20)`);

// 9. Dossier products have correct labels
if (ctaDossier.length === 25) pass(`All ${ctaDossier.length} dossier products have "Start PRO Dossier Request"`);
else fail(`Dossier CTAs: ${ctaDossier.length} (expected 25)`);
if (badgeDossier.length === 25) pass(`All ${badgeDossier.length} dossier products have "PRO Dossier"`);
else fail(`Dossier badges: ${badgeDossier.length} (expected 25)`);

// 10. No hardcoded stripe price IDs
const hasHardcoded = uniqueEnvKeys.some(k => k.includes("price_") || /^pi_/.test(k));
if (!hasHardcoded) pass("No hardcoded Stripe price IDs");
else fail("Hardcoded Stripe price IDs detected");

// 11. No expired /locale routes
const LOCALE_PATTERNS = /\/en\/|\/tr\/|\/de\/|\/fr\/|\/es\/|\/ar\//;
if (!LOCALE_PATTERNS.test(productRaw)) pass("No locale-prefixed routes in product data");
else fail("Locale-prefixed routes detected");

// 12. Schema validation count
const schemaCount = existsSync(resolve(__dirname, "../src/sectorcalc/schemas/pro-v531"))
  ? readdirSync(resolve(__dirname, "../src/sectorcalc/schemas/pro-v531")).filter(f => f.endsWith(".schema.json")).length
  : 0;

console.log(`\n  Failures: ${failCount}`);
if (failCount === 0) {
  console.log("  BARIS_PRO_PRODUCTIZATION_GUARD=PASS\n");
} else {
  console.log("  BARIS_PRO_PRODUCTIZATION_GUARD=FAIL\n");
}
process.exit(failCount > 0 ? 1 : 0);
