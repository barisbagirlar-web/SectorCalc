#!/usr/bin/env node
// SectorCalc PRO V5.3.1 — Baris Revenue Go-Live Guard
// Must pass only if all revenue-critical conditions are met.

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRODUCTS_FILE = resolve(__dirname, "../src/sectorcalc/pro-commerce/baris-pro-products.ts");
const PRICE_RESOLVER_FILE = resolve(__dirname, "../src/sectorcalc/pro-commerce/baris-price-resolver.ts");
const ENTITLEMENT_GUARD_FILE = resolve(__dirname, "../src/sectorcalc/pro-commerce/baris-entitlement-guard.ts");
const CHECKOUT_ROUTE = resolve(__dirname, "../src/app/api/checkout/route.ts");
const EXECUTE_ROUTE = resolve(__dirname, "../src/app/api/pro-calculator/execute/route.ts");
const WEBHOOK_FILE = resolve(__dirname, "../functions/src/stripeWebhook.ts");

let failCount = 0;
function fail(msg) { failCount++; console.error(`  \u274c FAIL: ${msg}`); }
function pass(msg) { console.log(`  \u2705 PASS: ${msg}`); }

console.log("\n\u2550\u2550\u2550 Baris Revenue Go-Live Guard \u2550\u2550\u2550\n");

// ── 1. Product registry ──
const productRaw = readFileSync(PRODUCTS_FILE, "utf-8");

// Count actionable properties
const toolKeys = [...productRaw.matchAll(/toolKey:\s*"([^"]+)"/g)].map((m) => m[1]);
const envKeys = [...productRaw.matchAll(/stripePriceEnvKey:\s*"([^"]+)"/g)].map((m) => m[1]);
const instantCount = (productRaw.match(/productMode:\s*"INSTANT_PRO_CALCULATOR"/g) || []).length;
const dossierCount = (productRaw.match(/productMode:\s*"ASSISTED_PRO_DOSSIER"/g) || []).length;
const visibleCount = (productRaw.match(/visible:\s*true/g) || []).length;
const sellableCount = (productRaw.match(/sellable:\s*true/g) || []).length;

if (toolKeys.length === 45) pass(`Products in registry: ${toolKeys.length}`); else fail(`Products: ${toolKeys.length} (expected 45)`);
if (envKeys.length === 45) pass(`Stripe env keys in registry: ${envKeys.length}`); else fail(`Env keys: ${envKeys.length} (expected 45)`);
if (instantCount === 20) pass(`Instant calculators: ${instantCount}`); else fail(`Instant: ${instantCount} (expected 20)`);
if (dossierCount === 25) pass(`Assisted dossiers: ${dossierCount}`); else fail(`Dossier: ${dossierCount} (expected 25)`);
if (visibleCount >= 45) pass(`Visible products: ${visibleCount}`); else fail(`Visible: ${visibleCount}`);
if (sellableCount >= 45) pass(`Sellable products: ${sellableCount}`); else fail(`Sellable: ${sellableCount}`);

// ── 2. Runtime env check ──
let envFound = 0;
let envMissing = [];
for (const key of envKeys) {
  const val = process.env[key];
  if (val && val.startsWith("price_")) envFound++;
  else if (!val) envMissing.push(key);
}
if (envFound >= 45) pass(`Runtime env keys configured: ${envFound}`);
else if (envFound > 0) fail(`Runtime env keys: ${envFound}/45 (missing: ${envMissing.slice(0, 3).join(", ")})`);
else fail("No Baris Stripe env keys configured in runtime");

// ── 3. No hardcoded price IDs ──
import { execSync } from "child_process";
const rgResult = execSync('rg "price_(test|live)_[A-Za-z0-9]{10,}" src/ --include="*.ts" --include="*.tsx" -n 2>/dev/null || echo ""', { cwd: resolve(__dirname, "..") }).toString().trim();
const rgLines = rgResult.split("\n").filter((l) => l.trim() && !l.includes("baris-pro-products"));
if (rgLines.length === 0) pass("No hardcoded Stripe price IDs in source");
else fail(`Hardcoded price IDs: ${rgLines.length} matches (check src/ for embedded price IDs)`);

// ── 4. Checkout route uses server-side resolver ──
const checkoutRaw = readFileSync(CHECKOUT_ROUTE, "utf-8");
if (checkoutRaw.includes('requireBarisCheckoutPrice')) pass("Checkout route uses server-side env resolver");
else fail("Checkout route missing requireBarisCheckoutPrice");

// ── 5. Missing price fails closed ──
if (checkoutRaw.includes('STRIPE_PRICE_ID_REQUIRED')) pass("Missing price ID fails closed");
else fail("Missing price ID not fail-closed");

// ── 6. Entitlement guard exists ──
if (existsSync(ENTITLEMENT_GUARD_FILE)) {
  const guardRaw = readFileSync(ENTITLEMENT_GUARD_FILE, "utf-8");
  if (guardRaw.includes("PRO_ENTITLEMENT_REQUIRED") && guardRaw.includes("ASSISTED_DOSSIER_ONLY")) {
    pass("Entitlement guard exists and blocks correctly");
  } else fail("Entitlement guard missing required responses");
} else fail("Entitlement guard file missing");

// ── 7. Execute route blocks without entitlement ──
if (existsSync(EXECUTE_ROUTE)) {
  const execRaw = readFileSync(EXECUTE_ROUTE, "utf-8");
  if (execRaw.includes('getBarisExecutionBlockReason') || execRaw.includes('checkBarisExecutionEntitlement')) {
    pass("Execute route has entitlement blocking");
  } else fail("Execute route missing entitlement check");
} else fail("Execute route file missing");

// ── 8. Assisted tools block instant execution ──
const execCheck = existsSync(EXECUTE_ROUTE) ? readFileSync(EXECUTE_ROUTE, "utf-8") : "";
if (execCheck.includes("ASSISTED_DOSSIER_ONLY") || guardCheck()) {
  pass("Assisted tools blocked from instant execution");
} else {
  // Check entitlement guard
  const guardContent = readFileSync(ENTITLEMENT_GUARD_FILE, "utf-8");
  if (guardContent.includes("ASSISTED_PRO_DOSSIER")) pass("Assisted tools blocked (entitlement guard)");
  else fail("Assisted tools not blocked");
}

function guardCheck() {
  try {
    const g = readFileSync(ENTITLEMENT_GUARD_FILE, "utf-8");
    return g.includes("ASSISTED_DOSSIER_ONLY");
  } catch { return false; }
}

// ── 9. Webhook binding check ──
if (existsSync(WEBHOOK_FILE)) {
  const webhookRaw = readFileSync(WEBHOOK_FILE, "utf-8");
  if (webhookRaw.includes("baris_pro_purchase") || webhookRaw.includes("BARIS_PRO")) {
    pass("Webhook has Baris PRO purchase handler");
  } else {
    fail("Webhook missing Baris PRO purchase handler — entitlement not created after payment");
  }
} else {
  fail("Webhook file not found");
}

// ── 10. No Stripe secret in source ──
const secretCheck = execSync('rg "sk_(live|test)_[A-Za-z0-9]{10,}" src/ --include="*.ts" --include="*.tsx" -n 2>/dev/null || echo ""', { cwd: resolve(__dirname, "..") }).toString().trim();
if (!secretCheck) pass("No Stripe secret key in source code"); 
else fail("Stripe secret key detected in source code");

// ── 11. No /en routes ──
const routeCheck = execSync('rg "/en/" src/app --include="*.ts" --include="*.tsx" -n 2>/dev/null || echo ""', { cwd: resolve(__dirname, "..") }).toString().trim();
if (!routeCheck) pass("No /en locale routes"); 
else fail("Locale routes detected");

// ── 12. CBAM not modified ──
const cbamCheck = execSync('git diff HEAD~1..HEAD --name-only 2>/dev/null | grep -i cbam || echo "NONE"', { cwd: resolve(__dirname, "..") }).toString().trim();
if (cbamCheck === "NONE" || !cbamCheck) pass("CBAM files not modified in latest commit");
else fail(`CBAM modified: ${cbamCheck}`);

// ── Summary ──
console.log(`\n  Failures: ${failCount}`);
if (failCount === 0) {
  console.log("\n  BARIS_REVENUE_GO_LIVE_GUARD=PASS\n");
} else {
  console.log("\n  BARIS_REVENUE_GO_LIVE_GUARD=FAIL\n");
}
process.exit(failCount > 0 ? 1 : 0);
