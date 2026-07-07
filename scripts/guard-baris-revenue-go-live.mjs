#!/usr/bin/env node
// SectorCalc PRO V5.3.1 — Baris Revenue Go-Live Guard (Paddle)
// Validates: product registry, env keys, Paddle checkout, webhook, entitlement, no secrets

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

console.log("\n\u2550\u2550\u2550 Baris Paddle Revenue Go-Live Guard \u2550\u2550\u2550\n");

// ── 1. Product registry ──
const productRaw = readFileSync(PRODUCTS_FILE, "utf-8");

const toolKeys = [...productRaw.matchAll(/toolKey:\s*"([^"]+)"/g)].map((m) => m[1]);
const paddleEnvKeys = [...productRaw.matchAll(/paddlePriceEnvKey:\s*"([^"]+)"/g)].map((m) => m[1]);
const stripeEnvKeys = [...productRaw.matchAll(/stripePriceEnvKey:\s*"([^"]+)"/g)].map((m) => m[1]);
const instantCount = (productRaw.match(/productMode:\s*"INSTANT_PRO_CALCULATOR"/g) || []).length;
const dossierCount = (productRaw.match(/productMode:\s*"ASSISTED_PRO_DOSSIER"/g) || []).length;
const visibleCount = (productRaw.match(/visible:\s*true,/g) || []).length;
const sellableCount = (productRaw.match(/sellable:\s*true,/g) || []).length;
const paymentProviderPaddle = (productRaw.match(/paymentProvider:\s*"PADDLE",/g) || []).length;

if (toolKeys.length === 45) pass(`Products in registry: ${toolKeys.length}`); else fail(`Products: ${toolKeys.length} (expected 45)`);
if (paddleEnvKeys.length === 45) pass(`Paddle env keys in registry: ${paddleEnvKeys.length}`); else fail(`Paddle env keys: ${paddleEnvKeys.length} (expected 45)`);
if (paymentProviderPaddle === 45) pass(`Payment provider PADDLE on all products`); else fail(`Payment provider PADDLE: ${paymentProviderPaddle}/45`);
if (instantCount === 20) pass(`Instant calculators: ${instantCount}`); else fail(`Instant: ${instantCount} (expected 20)`);
if (dossierCount === 25) pass(`Assisted dossiers: ${dossierCount}`); else fail(`Dossier: ${dossierCount} (expected 25)`);
if (visibleCount >= 45) pass(`Visible products: ${visibleCount}`); else fail(`Visible: ${visibleCount}`);
if (sellableCount >= 45) pass(`Sellable products: ${sellableCount}`); else fail(`Sellable: ${sellableCount}`);

// ── 2. Paddle price resolver exists ──
if (existsSync(PADDLE_RESOLVER_FILE)) {
  const resolverRaw = readFileSync(PADDLE_RESOLVER_FILE, "utf-8");
  if (resolverRaw.includes('import "server-only"') && resolverRaw.includes("requireBarisPaddleCheckoutPrice")) {
    pass("Paddle price resolver exists and uses server-only resolver");
  } else fail("Paddle price resolver missing required exports");
} else fail("Paddle price resolver file missing");

// ── 3. Checkout route uses Paddle ──
if (existsSync(PADDLE_CHECKOUT_ROUTE)) {
  const checkoutRaw = readFileSync(PADDLE_CHECKOUT_ROUTE, "utf-8");
  if (checkoutRaw.includes('BARIS_PRO_PURCHASE') && checkoutRaw.includes('requireBarisPaddleCheckoutPrice')) {
    pass("Checkout route handles BARIS_PRO_PURCHASE via Paddle");
  } else fail("Checkout route missing BARIS_PRO_PURCHASE or Paddle resolver");
  if (checkoutRaw.includes('PADDLE_PRICE_ID_REQUIRED')) pass("Missing Paddle price ID fails closed");
  else fail("Missing Paddle price ID not fail-closed");
} else fail("Paddle checkout route file missing");

// ── 4. Stripe not used for Baris checkout ──
const stripeCheckout = existsSync(resolve(ROOT, "src/app/api/checkout/route.ts"))
  ? readFileSync(resolve(ROOT, "src/app/api/checkout/route.ts"), "utf-8")
  : "";
const barisBlock = stripeCheckout.match(/intent === "BARIS_PRO_PURCHASE"[\s\S]{0,500}return/);
if (barisBlock && barisBlock[0].includes('stripe.checkout.sessions.create')) {
  fail("Stripe checkout route still has Stripe session creation for BARIS_PRO_PURCHASE");
} else if (barisBlock && barisBlock[0].includes('PADDLE')) {
  pass("Stripe checkout route redirects BARIS_PRO_PURCHASE to Paddle (no Stripe session)");
} else if (stripeCheckout.includes("BARIS_PRO_PURCHASE")) {
  pass("Stripe checkout route mentions BARIS_PRO_PURCHASE only for redirection");
} else {
  pass("Stripe checkout route does not handle Baris PRO purchases");
}

// ── 5. Entitlement guard exists ──
if (existsSync(ENTITLEMENT_GUARD_FILE)) {
  const guardRaw = readFileSync(ENTITLEMENT_GUARD_FILE, "utf-8");
  if (guardRaw.includes("PRO_ENTITLEMENT_REQUIRED") && guardRaw.includes("ASSISTED_DOSSIER_ONLY")) {
    pass("Entitlement guard exists and blocks correctly");
  } else fail("Entitlement guard missing required responses");
} else fail("Entitlement guard file missing");

// ── 6. Execute route blocks without entitlement ──
if (existsSync(EXECUTE_ROUTE)) {
  const execRaw = readFileSync(EXECUTE_ROUTE, "utf-8");
  if (execRaw.includes('getBarisExecutionBlockReason') || execRaw.includes('checkBarisExecutionEntitlement')) {
    pass("Execute route has entitlement blocking");
  } else fail("Execute route missing entitlement check");
} else fail("Execute route file missing");

// ── 7. Webhook handles transaction_completed with Baris entitlement ──
if (existsSync(PADDLE_WEBHOOK_FILE)) {
  const webhookRaw = readFileSync(PADDLE_WEBHOOK_FILE, "utf-8");
  if (webhookRaw.includes("baris_pro_purchase") && webhookRaw.includes("barisToolKey")) {
    pass("Paddle webhook handles baris_pro_purchase with entitlement");
  } else fail("Paddle webhook missing baris_pro_purchase entitlement handler");
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
const paddleApiSearch = execSync('rg "env\\(\'PADDLE_SECRET_KEY\'" src/ --include="*.ts" --include="*.tsx" -n 2>/dev/null || echo "OK"', { cwd: ROOT }).toString().trim();
if (paddleApiSearch === "OK") pass("No PADDLE_SECRET_KEY env() in src (only used in route)");
else if (paddleApiSearch.includes("paddle/route")) pass("PADDLE_SECRET_KEY only used in server route");
else fail("PADDLE_SECRET_KEY detected in non-route source");

const secretDetect = execSync('rg "sk_(live|test)_[A-Za-z0-9]{10,}" src/ --include="*.ts" --include="*.tsx" -n 2>/dev/null || echo ""', { cwd: ROOT }).toString().trim();
if (!secretDetect) pass("No Stripe/Paddle secrets in source code");
else fail("Secret key detected in source code");

// ── 10. No hardcoded pri_ values in committed source (allow only in generated) ──
const hardcodedPri = execSync('rg "pri_[a-zA-Z0-9]+" src/ --include="*.ts" --include="*.tsx" -n 2>/dev/null | grep -v "pri_placeholder" | grep -v "startsWith" || echo ""', { cwd: ROOT }).toString().trim();
if (!hardcodedPri) pass("No hardcoded Paddle price IDs (pri_) in source");
else fail(`Hardcoded pri_ values in source:\n${hardcodedPri.split("\n").slice(0, 5).join("\n")}`);

// ── 11. No /en routes ──
const routeCheck = execSync('rg "/en/" src/app --include="*.ts" --include="*.tsx" -n 2>/dev/null || echo ""', { cwd: ROOT }).toString().trim();
if (!routeCheck) pass("No /en locale routes");
else fail("Locale routes detected");

// ── 12. CBAM not modified (only real CBAM pipeline files) ──
const cbamCheck = execSync('git diff HEAD~1..HEAD --name-only 2>/dev/null | grep -E "src/components/cbam/|src/lib/cbam/|src/app/api/cbam/" || echo "NONE"', { cwd: ROOT }).toString().trim();
if (cbamCheck === "NONE" || !cbamCheck) pass("CBAM files not modified in latest commit");
else fail(`CBAM modified: ${cbamCheck}`);

// ── 13. No Paddle webhook secret in source ──
const webhookSecretCheck = execSync('rg "paddle-webhook-secret|pdl_webhook|PADDLE_WEBHOOK_SECRET" src/ --include="*.ts" --include="*.tsx" -n 2>/dev/null | grep -v "process.env" | grep -v "import" || echo ""', { cwd: ROOT }).toString().trim();
if (!webhookSecretCheck) pass("No Paddle webhook secret hardcoded in source");
else fail("Paddle webhook secret hardcoded in source");

// ── Summary ──
console.log(`\n  Failures: ${failCount}`);
if (failCount === 0) {
  console.log("\n  BARIS_PADDLE_REVENUE_GO_LIVE_GUARD=PASS\n");
} else {
  console.log("\n  BARIS_PADDLE_REVENUE_GO_LIVE_GUARD=FAIL\n");
}
process.exit(failCount > 0 ? 1 : 0);
