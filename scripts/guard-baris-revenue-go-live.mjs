#!/usr/bin/env node
// SectorCalc PRO V5.3.1 — Baris Revenue Go-Live Guard (Key-Pool Model)
// Validates: product registry, key-pack env, checkout, webhook, entitlement, no secrets
//
// Key-pool model: users purchase key packs via Paddle (single env var).
// No per-product Paddle pricing. 45 products share one key-pack price ID.

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PRODUCTS_FILE = resolve(ROOT, "src/sectorcalc/pro-commerce/baris-pro-products.ts");
const PADDLE_RESOLVER_FILE = resolve(ROOT, "src/sectorcalc/pro-commerce/baris-paddle-price-resolver.ts");
const ENTITLEMENT_GUARD_FILE = resolve(ROOT, "src/sectorcalc/pro-commerce/baris-entitlement-guard.ts");
const PADDLE_CHECKOUT_ROUTE = resolve(ROOT, "src/app/api/checkout/paddle/route.ts");
const EXECUTE_ROUTE = resolve(ROOT, "src/app/api/pro-calculator/execute/route.ts");
const PADDLE_WEBHOOK_FILE = resolve(ROOT, "src/app/api/paddle-webhook/route.ts");
const CUSTOM_DATA_FILE = resolve(ROOT, "src/lib/payments/paddle-custom-data.ts");

let failCount = 0;
function fail(msg) { failCount++; console.error(`  \u274c FAIL: ${msg}`); }
function pass(msg) { console.log(`  \u2705 PASS: ${msg}`); }

console.log("\n\u2550\u2550\u2550 Baris Key-Pool Revenue Go-Live Guard \u2550\u2550\u2550\n");

// ── 1. Product registry ──
const productRaw = readFileSync(PRODUCTS_FILE, "utf-8");

const toolKeys = [...productRaw.matchAll(/toolKey:\s*"([^"]+)"/g)].map((m) => m[1]);
const instantCount = (productRaw.match(/productMode:\s*"INSTANT_PRO_CALCULATOR"/g) || []).length;
const dossierCount = (productRaw.match(/productMode:\s*"ASSISTED_PRO_DOSSIER"/g) || []).length;
const visibleCount = (productRaw.match(/visible:\s*true,/g) || []).length;
const sellableCount = (productRaw.match(/sellable:\s*true,/g) || []).length;
const paymentProviderKeyPool = (productRaw.match(/paymentProvider:\s*"KEY_POOL",/g) || []).length;

if (toolKeys.length === 45) pass(`Products in registry: ${toolKeys.length}`); else fail(`Products: ${toolKeys.length} (expected 45)`);
if (paymentProviderKeyPool === 45) pass(`Payment provider KEY_POOL (key-pack model) on all products`); else fail(`Payment provider KEY_POOL: ${paymentProviderKeyPool}/45`);
if (instantCount === 20) pass(`Instant calculators: ${instantCount}`); else fail(`Instant: ${instantCount} (expected 20)`);
if (dossierCount === 25) pass(`Assisted dossiers: ${dossierCount}`); else fail(`Dossier: ${dossierCount} (expected 25)`);
if (visibleCount >= 45) pass(`Visible products: ${visibleCount}`); else fail(`Visible: ${visibleCount}`);
if (sellableCount >= 45) pass(`Sellable products: ${sellableCount}`); else fail(`Sellable: ${sellableCount}`);

// ── 2. Key-pack price resolver (single env var) ──
const keyPackEnv = process.env["PADDLE_PRICE_BARIS_KEY_PACK"];
if (keyPackEnv && keyPackEnv.startsWith("pri_")) pass(`Key-pack env PADDLE_PRICE_BARIS_KEY_PACK configured`);
else fail("Key-pack env PADDLE_PRICE_BARIS_KEY_PACK missing or invalid");

if (existsSync(PADDLE_RESOLVER_FILE)) {
  const resolverRaw = readFileSync(PADDLE_RESOLVER_FILE, "utf-8");
  if (resolverRaw.includes('import "server-only"') && resolverRaw.includes("requireBarisKeyPackPrice")) {
    pass("Key-pack price resolver exists (single env, no per-product pricing)");
  } else fail("Key-pack price resolver missing required exports");
} else fail("Key-pack price resolver file missing");

// ── 3. Checkout route uses key-pack model ──
if (existsSync(PADDLE_CHECKOUT_ROUTE)) {
  const checkoutRaw = readFileSync(PADDLE_CHECKOUT_ROUTE, "utf-8");
  if (checkoutRaw.includes('BARIS_PRO_PURCHASE') && checkoutRaw.includes('requireBarisKeyPackPrice') && checkoutRaw.includes('keysPurchased')) {
    pass("Checkout route handles BARIS_PRO_PURCHASE via key-pack (keysPurchased, not per-tool)");
  } else fail("Checkout route missing key-pack logic or still per-tool");
  if (checkoutRaw.includes('PADDLE_PRICE_ID_REQUIRED')) pass("Missing Paddle price ID fails closed");
  else fail("Missing Paddle price ID not fail-closed");
} else fail("Paddle checkout route file missing");

// ── 4. Stripe not used for Baris checkout ──
const stripeCheckout = existsSync(resolve(ROOT, "src/app/api/checkout/route.ts"))
  ? readFileSync(resolve(ROOT, "src/app/api/checkout/route.ts"), "utf-8")
  : "";
if (stripeCheckout.includes("BARIS_PRO_PURCHASE")) {
  if (stripeCheckout.includes("redirect") || stripeCheckout.includes("/api/checkout/paddle")) {
    pass("Stripe checkout route redirects BARIS_PRO_PURCHASE to Paddle");
  } else fail("Stripe checkout route still handles BARIS_PRO_PURCHASE directly");
} else {
  pass("Stripe checkout route does not handle Baris PRO purchases");
}

// ── 5. Entitlement guard (key-pool: checks barisProKeys from Firestore) ──
if (existsSync(ENTITLEMENT_GUARD_FILE)) {
  const guardRaw = readFileSync(ENTITLEMENT_GUARD_FILE, "utf-8");
  if (guardRaw.includes("barisProKeys") && guardRaw.includes("getAdminFirestore")) {
    pass("Entitlement guard checks barisProKeys from Firestore (key-pool model)");
  } else if (guardRaw.includes("PRO_ENTITLEMENT_REQUIRED") && guardRaw.includes("ASSISTED_DOSSIER_ONLY")) {
    pass("Entitlement guard exists and blocks correctly");
  } else fail("Entitlement guard missing required responses");
} else fail("Entitlement guard file missing");

// ── 6. Execute route deducts keys after calculation ──
if (existsSync(EXECUTE_ROUTE)) {
  const execRaw = readFileSync(EXECUTE_ROUTE, "utf-8");
  if (execRaw.includes('FieldValue.increment(-1)') && execRaw.includes('barisProKeys')) {
    pass("Execute route deducts 1 barisProKey after successful calculation");
  } else if (execRaw.includes('checkBarisExecutionEntitlement')) {
    pass("Execute route has entitlement blocking");
  } else fail("Execute route missing entitlement check");
} else fail("Execute route file missing");

// ── 7. Webhook credits barisProKeys on key-pack purchase ──
if (existsSync(PADDLE_WEBHOOK_FILE)) {
  const webhookRaw = readFileSync(PADDLE_WEBHOOK_FILE, "utf-8");
  if (webhookRaw.includes("baris_pro_purchase") && webhookRaw.includes("barisProKeys")) {
    pass("Paddle webhook credits barisProKeys on key-pack purchase");
  } else fail("Paddle webhook missing barisProKeys credit on purchase");
  if (webhookRaw.includes("verifyPaddleSignature")) pass("Webhook signature verification present");
  else fail("Webhook missing signature verification");
  if (webhookRaw.includes("transaction.completed")) pass("Webhook handles transaction.completed");
  else fail("Webhook missing transaction.completed handler");
} else fail("Paddle webhook file missing");

// ── 8. Custom data contract has BARIS_PRO_PURCHASE ──
if (existsSync(CUSTOM_DATA_FILE)) {
  const customRaw = readFileSync(CUSTOM_DATA_FILE, "utf-8");
  if (customRaw.includes("BARIS_PRO_PURCHASE")) pass("Custom data contract includes BARIS_PRO_PURCHASE");
  else fail("Custom data contract missing BARIS_PRO_PURCHASE intent");
} else fail("Custom data file missing");

// ── 9. No Paddle API key in source ──
const paddleApiSearch = execSync('rg "PADDLE_SECRET_KEY" src/ --type ts -n 2>/dev/null | grep -v "paddle/route" || echo "OK"', { cwd: ROOT }).toString().trim();
if (paddleApiSearch === "OK") pass("No PADDLE_SECRET_KEY outside server route");
else fail("PADDLE_SECRET_KEY detected outside server route");

const secretDetect = execSync('rg "sk_(live|test)_[A-Za-z0-9]{10,}" src/ --type ts -n 2>/dev/null || echo ""', { cwd: ROOT }).toString().trim();
if (!secretDetect) pass("No Stripe/Paddle secrets in source code");
else fail("Secret key detected in source code");

// ── 10. No hardcoded pri_ values (only single env var allowed; exclude legacy plans and test placeholders) ──
const hardcodedPri = execSync('rg "pri_[a-zA-Z0-9]+" src/ --type ts -n 2>/dev/null | grep -v "KEY_PACK" | grep -v "startsWith" | grep -v "plans.ts" | grep -v "placeholder" || echo ""', { cwd: ROOT }).toString().trim();
if (!hardcodedPri) pass("No hardcoded Paddle price IDs (pri_) in source");
else fail(`Hardcoded pri_ values:\n${hardcodedPri.split("\n").slice(0, 5).join("\n")}`);

// ── 11. No /en locale route prefixes (exclude external URLs) ──
const routeCheck = execSync('rg "/en/" src/app --type ts -n 2>/dev/null | grep -v "https://" | grep -v "http://" || echo ""', { cwd: ROOT }).toString().trim();
if (!routeCheck) pass("No /en locale routes");
else fail("Locale routes detected");

// ── 12. CBAM not modified ──
const cbamCheck = execSync('git diff HEAD~1..HEAD --name-only 2>/dev/null | grep -E "src/components/cbam/|src/lib/cbam/|src/app/api/cbam/" || echo "NONE"', { cwd: ROOT }).toString().trim();
if (cbamCheck === "NONE" || !cbamCheck) pass("CBAM files not modified");
else fail(`CBAM modified: ${cbamCheck}`);

// ── 13. No Paddle webhook secret in source ──
const webhookSecretCheck = execSync('rg "paddle-webhook-secret|pdl_webhook|PADDLE_WEBHOOK_SECRET" src/ --type ts -n 2>/dev/null | grep -v "process.env" | grep -v "import" | grep -v "paddle-webhook/route" || echo ""', { cwd: ROOT }).toString().trim();
if (!webhookSecretCheck) pass("No Paddle webhook secret hardcoded in source");
else fail("Paddle webhook secret hardcoded in source");

// ── Summary ──
console.log(`\n  Failures: ${failCount}`);
if (failCount === 0) {
  console.log("\n  BARIS_KEY_POOL_REVENUE_GUARD=PASS\n");
} else {
  console.log("\n  BARIS_KEY_POOL_REVENUE_GUARD=FAIL\n");
}
process.exit(failCount > 0 ? 1 : 0);
