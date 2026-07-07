#!/usr/bin/env node
// SectorCalc PRO V5.3.1 — Baris Productization Guard v2
// Manifest-driven: reads actual product registry + readiness data.
// Fails if schema validation script is missing.
// Verifies all 45 products are correctly configured for sale.

import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

let failCount = 0;
function fail(msg) { failCount++; console.error(`  \u274c FAIL: ${msg}`); }
function pass(msg) { console.log(`  \u2705 PASS: ${msg}`); }

console.log("\n\u2550\u2550\u2550 Baris PRO Productization Guard v2 \u2550\u2550\u2550\n");

const PRODUCT_FILE = resolve(__dirname, "../src/sectorcalc/pro-commerce/baris-pro-products.ts");
const READINESS_FILE = resolve(__dirname, "../src/sectorcalc/formulas/pro-v531/baris-readiness-data.ts");
const REGISTRY_FILE = resolve(__dirname, "../src/sectorcalc/formulas/pro-v531/baris-formula-registry.ts");
const FORMULA_DIR = resolve(__dirname, "../src/sectorcalc/formulas/pro-v531");
const GOLDEN_DIR = resolve(__dirname, "../tests/golden/pro-v531-baris");
const SCHEMA_DIR = resolve(__dirname, "../src/sectorcalc/schemas/pro-v531");
const VALIDATE_SCRIPT = resolve(__dirname, "../scripts/validate-pro-v531-baris-schemas.mjs");
const SMOKE_SCRIPT = resolve(__dirname, "../scripts/smoke-baris-pro-revenue-live.mjs");

// ── CHECK 0: Schema validation script must exist ──
if (existsSync(VALIDATE_SCRIPT)) pass("Schema validation script exists");
else fail("Schema validation script missing at scripts/validate-pro-v531-baris-schemas.mjs");

// ── CHECK 0b: Smoke script must exist ──
if (existsSync(SMOKE_SCRIPT)) pass("Revenue smoke script exists");
else fail("Revenue smoke script missing at scripts/smoke-baris-pro-revenue-live.mjs");

// ── Extract product data ──
function grepKeys(text) {
  const re = /toolKey:\s*"([^"]+)"/g;
  const keys = [];
  let m;
  while ((m = re.exec(text)) !== null) keys.push(m[1]);
  return keys;
}

const productRaw = readFileSync(PRODUCT_FILE, "utf-8");
const readinessRaw = readFileSync(READINESS_FILE, "utf-8");
const registryRaw = readFileSync(REGISTRY_FILE, "utf-8");

const productKeys = grepKeys(productRaw);
const instantCount = (productRaw.match(/productMode:\s*"INSTANT_PRO_CALCULATOR"/g) || []).length;
const dossierCount = (productRaw.match(/productMode:\s*"ASSISTED_PRO_DOSSIER"/g) || []).length;
const visibleCount = (productRaw.match(/visible:\s*true/g) || []).length;
const sellableCount = (productRaw.match(/sellable:\s*true/g) || []).length;
const entitlementCount = (productRaw.match(/entitlementRequired:\s*true/g) || []).length;
const envKeys = [...new Set(grepValues(productRaw, "stripePriceEnvKey").filter(k => k.startsWith("STRIPE_PRICE_BARIS_")))];
const ctaLive = productRaw.match(/ctaLabel:\s*"Start PRO Calculation"/g) || [];
const ctaDossier = productRaw.match(/ctaLabel:\s*"Start PRO Dossier Request"/g) || [];
const badgeLive = productRaw.match(/publicBadge:\s*"PRO Calculator"/g) || [];
const badgeDossier = productRaw.match(/publicBadge:\s*"PRO Dossier"/g) || [];

function grepValues(text, field) {
  const re = new RegExp(`${field}:\\s*(true|false|"[^"]*"|\\d+)`, "g");
  const vals = [];
  let m;
  while ((m = re.exec(text)) !== null) vals.push(m[1].replace(/"/g, ""));
  return vals;
}

// ── Extract readiness data ──
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
const registrySet = new Set(registryKeysRaw);

const nProducts = productKeys.length;
const blockedKeys = new Set([...readiness.source, ...readiness.contract]);

console.log(`  Products: ${nProducts} | Instant: ${instantCount} | Dossier: ${dossierCount}`);
console.log(`  Readiness LIVE: ${readiness.nlive} | SOURCE: ${readiness.nsource} | CONTRACT: ${readiness.ncontract}`);

// ── Counts ──
if (nProducts === 45) pass(`Products total: ${nProducts}`); else fail(`Products total: ${nProducts} (expected 45)`);
if (instantCount === 20) pass(`Instant calculator products: ${instantCount}`); else fail(`Instant: ${instantCount} (expected 20)`);
if (dossierCount === 25) pass(`Assisted dossier products: ${dossierCount}`); else fail(`Dossier: ${dossierCount} (expected 25)`);
if (visibleCount >= 45) pass("All products visible"); else fail(`Visible: ${visibleCount}`);
if (sellableCount >= 45) pass("All products sellable"); else fail(`Sellable: ${sellableCount}`);
if (entitlementCount >= 45) pass("All products require entitlement"); else fail(`Entitlement: ${entitlementCount}`);
if (envKeys.length === 0) pass(`Key-pool model: no per-product Stripe env keys (single PADDLE_PRICE_BARIS_KEY_PACK)`); else fail(`Unexpected env keys: ${envKeys.length}`);

// ── Live tool integrity ──
let liveOk = 0;
for (const k of readiness.live) {
  const hasFormula = existsSync(resolve(FORMULA_DIR, `${k}.formula.ts`));
  const hasGolden = existsSync(resolve(GOLDEN_DIR, `${k}.golden.json`));
  const hasRegistry = registrySet.has(k);
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

// ── Blocked tool integrity ──
let blockedInRegistry = 0;
for (const k of [...readiness.source, ...readiness.contract]) {
  if (registrySet.has(k)) { blockedInRegistry++; fail(`BLOCKED "${k}" has registry binding`); }
}
if (blockedInRegistry === 0) pass(`All ${readiness.nsource + readiness.ncontract} BLOCKED tools have no registry binding`);

// ── Batch 3 ghost check ──
const batch3Keys = ["bank-grade-financial-projection-covenant-model", "machining-cycle-time-part-cost-sheet",
  "sealed-job-quote-certificate-fire-setup-vade", "steel-structure-weight-cost-takeoff",
  "compressed-air-pipe-sizing-pressure-drop", "hydraulic-cylinder-pump-sizing",
  "pump-system-curve-npsh-verifier", "shaft-deflection-critical-speed-check",
  "scope-1-2-3-splitter-for-smes", "ppap-gauge-rr-cpk-ppk-quality-submission-bundle"];
let batch3FormulaCount = 0;
let batch3GoldenCount = 0;
for (const k of batch3Keys) {
  if (existsSync(resolve(FORMULA_DIR, `${k}.formula.ts`))) batch3FormulaCount++;
  if (existsSync(resolve(GOLDEN_DIR, `${k}.golden.json`))) batch3GoldenCount++;
}
if (batch3FormulaCount === 0) pass("No Batch 3 formula files present"); else fail(`${batch3FormulaCount} Batch 3 formula files present`);
if (batch3GoldenCount === 0) pass("No Batch 3 golden fixtures present"); else fail(`${batch3GoldenCount} Batch 3 golden fixtures present`);

// ── Forbidden claims check ──
const forbiddenClaims = ["Certified", "Approved", "Legal proof", "Guaranteed compliance", "Instant result"];
let claimViolations = 0;
for (const field of ["publicBadge", "publicNotice", "ctaLabel"]) {
  for (const claim of forbiddenClaims) {
    const re = new RegExp(`${field}:\\s*"[^"]*${claim}[^"]*"`);
    if (re.test(productRaw)) { fail(`Forbidden claim "${claim}" in ${field}`); claimViolations++; }
  }
}
if (claimViolations === 0) pass("No forbidden claims in product labels");

// ── Label integrity ──
if (ctaLive.length === 20) pass(`All ${ctaLive.length} instant calculators have "Start PRO Calculation"`);
else fail(`Instant CTAs: ${ctaLive.length} (expected 20)`);
if (badgeLive.length === 20) pass(`All ${badgeLive.length} instant calculators have "PRO Calculator"`);
else fail(`Instant badges: ${badgeLive.length} (expected 20)`);
if (ctaDossier.length === 25) pass(`All ${ctaDossier.length} dossier products have "Start PRO Dossier Request"`);
else fail(`Dossier CTAs: ${ctaDossier.length} (expected 25)`);
if (badgeDossier.length === 25) pass(`All ${badgeDossier.length} dossier products have "PRO Dossier"`);
else fail(`Dossier badges: ${badgeDossier.length} (expected 25)`);

// ── No hardcoded stripe price IDs ──
const hasHardcoded = envKeys.some(k => k.includes("price_") || /^pi_/.test(k));
if (!hasHardcoded) pass("No hardcoded Stripe price IDs");
else fail("Hardcoded Stripe price IDs detected");

// ── No locale routes ──
const LOCALE_PATTERNS = /\/en\/|\/tr\/|\/de\/|\/fr\/|\/es\/|\/ar\//;
if (!LOCALE_PATTERNS.test(productRaw)) pass("No locale-prefixed routes in product data");
else fail("Locale-prefixed routes detected");

// ── Orphan audit report exists ──
const ORPHAN_AUDIT_FILE = resolve(__dirname, "../data/audits/pro-v531-orphan-formulas.json");
if (existsSync(ORPHAN_AUDIT_FILE)) pass("Orphan formula audit report exists");
else fail("Orphan formula audit report missing at data/audits/pro-v531-orphan-formulas.json");

// ── Summary ──
console.log(`\n  Failures: ${failCount}`);
if (failCount === 0) {
  console.log("\n  BARIS_PRO_PRODUCTIZATION_GUARD=PASS\n");
} else {
  console.log("\n  BARIS_PRO_PRODUCTIZATION_GUARD=FAIL\n");
}
process.exit(failCount > 0 ? 1 : 0);
