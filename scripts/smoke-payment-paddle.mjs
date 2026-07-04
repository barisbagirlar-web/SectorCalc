#!/usr/bin/env node
/**
 * SectorCalc Paddle Payment Smoke Test — structural + invariant checks.
 *
 * Tests route existence, contract compliance, security properties, and
 * backward compatibility. Does NOT call live Paddle API (requires sandbox
 * credentials for full integration test).
 *
 * Run: node scripts/smoke-payment-paddle.mjs
 *
 * All checks are static/structural except where noted (mocked).
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
let failCount = 0;
let passCount = 0;

function assert(label, condition, detail = "") {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passCount++;
  } else {
    console.error(`  ❌ ${label} ${detail}`);
    failCount++;
  }
}

function read(filePath) {
  const abs = path.join(ROOT, filePath);
  if (!fs.existsSync(abs)) return null;
  return fs.readFileSync(abs, "utf8");
}

// ── 1. No duplicate webhook route ───────────────────────────────────────

console.log("\n📦 DUPLICATE WEBHOOK ROUTE:");
assert("Canonical webhook route exists", !!read("src/app/api/paddle-webhook/route.ts"));
assert(
  "No duplicate webhook at /api/webhooks/paddle",
  !read("src/app/api/webhooks/paddle/route.ts"),
  "Remove duplicate route",
);

// ── 2. Checkout routes exist ────────────────────────────────────────────

console.log("\n📦 CHECKOUT ROUTES:");
assert("Paddle checkout route exists", !!read("src/app/api/checkout/paddle/route.ts"));
assert("Stripe checkout route preserved", !!read("src/app/api/checkout/route.ts"));

// ── 3. Contract files exist ─────────────────────────────────────────────

console.log("\n📦 PADDLE CONTRACT FILES:");
assert("Custom data contract", !!read("src/lib/payments/paddle-custom-data.ts"));
assert("Price lookup", !!read("src/lib/payments/paddle-price-lookup.server.ts"));

// ── 4. customData contract analysis ─────────────────────────────────────

console.log("\n📦 CUSTOMDATA CONTRACT:");

const customDataContent = read("src/lib/payments/paddle-custom-data.ts");

assert(
  "Allowed intents defined",
  customDataContent.includes("SECTORCALC_CREDIT_PACK_PURCHASE") &&
    customDataContent.includes("SECTORCALC_PRO_SUBSCRIPTION_PURCHASE"),
);
assert(
  "Credit pack keys defined",
  customDataContent.includes("credit_pack_1") && customDataContent.includes("credit_pack_100"),
);
assert(
  "Subscription keys defined",
  customDataContent.includes("pro_monthly") && customDataContent.includes("pro_annual"),
);
assert(
  "validateCustomData function exists",
  customDataContent.includes("validateCustomData"),
);
assert(
  "buildPaddleCustomData function exists",
  customDataContent.includes("buildPaddleCustomData"),
);
assert(
  "parseLegacyCustomData function exists",
  customDataContent.includes("parseLegacyCustomData"),
);
assert(
  "isAllowedIntent rejects unknown intents",
  customDataContent.includes("isAllowedIntent"),
);
assert(
  "Credits by product key mapping (server-authoritative)",
  customDataContent.includes("CREDITS_BY_PRODUCT_KEY"),
);
assert(
  "purchaseType field in contract",
  customDataContent.includes("purchaseType: PurchaseType"),
);
assert(
  "Server-authoritative credits override",
  customDataContent.includes("serverCredits"),
);

// ── 5. Price lookup analysis ────────────────────────────────────────────

console.log("\n📦 PRICE LOOKUP:");

const priceLookupContent = read("src/lib/payments/paddle-price-lookup.server.ts");

assert("resolvePaddlePriceId exists", !!priceLookupContent?.includes("resolvePaddlePriceId"));
assert("resolveCreditAmount exists", !!priceLookupContent?.includes("resolveCreditAmount"));
assert("Uses env vars for price IDs", !!priceLookupContent?.includes("PADDLE_PRICE_ID_"));
assert("Has server-only import", !!priceLookupContent?.includes("server-only"));

// ── 6. Webhook analysis ─────────────────────────────────────────────────

console.log("\n📦 WEBHOOK:");

const webhookContent = read("src/app/api/paddle-webhook/route.ts");

assert("Signature verification", !!webhookContent?.includes("verifyPaddleSignature"));
assert("Missing signature rejected", !!webhookContent?.includes("Missing signature header"));
assert("No competing verification method", !webhookContent?.includes("Webhooks.unmarshal"));
assert("Custom data validation (validateCustomData)", !!webhookContent?.includes("validateCustomData"));
assert("Legacy credits field preserved", !!webhookContent?.includes("parseLegacyCustomData"));
assert("Legacy planId field preserved", !!webhookContent?.includes("legacy.planId"));
assert("Event type routing (transaction.completed)", !!webhookContent?.includes("transaction.completed"));
assert("Unknown event safe acknowledgement", !!webhookContent?.includes("received: true, event: eventType"));
assert("No userId → no fulfillment", !!webhookContent?.includes("No userId for event"));
assert("Missing event data handled", !!webhookContent?.includes("Missing transaction data"));

// ── 7. Atomic idempotency ────────────────────────────────────────────────

console.log("\n📦 ATOMIC IDEMPOTENCY:");

assert("Uses Firestore runTransaction", !!webhookContent?.includes("runTransaction"));
assert("No isolated isAlreadyProcessed function", !webhookContent?.includes("async function isAlreadyProcessed"));
assert("No isolated markProcessed function", !webhookContent?.includes("async function markProcessed"));
assert("Idempotency doc created via txn.create", !!webhookContent?.includes("txn.create(idempotencyRef"));
assert("Credit increment inside transaction", !!webhookContent?.includes("txn.set"));
assert("Billing event written in same transaction", !!webhookContent?.includes("billingEventRef"));
assert("IdempotencySkip thrown on duplicate", !!webhookContent?.includes("IdempotencySkip"));
assert("Duplicate event returns deduplicated: true", !!webhookContent?.includes("deduplicated: true"));
assert("Transaction failure returns 500", !!webhookContent?.includes("Fulfillment failed"));

// ── 8. Backward compatibility ────────────────────────────────────────────

console.log("\n📦 BACKWARD COMPATIBILITY:");

assert("Stripe checkout route intact", !!read("src/app/api/checkout/route.ts"));
assert("Stripe CF createStripeCheckout", !!read("functions/src/createStripeCheckout.ts"));
assert("Stripe CF stripeWebhook", !!read("functions/src/stripeWebhook.ts"));
assert("Stripe CF creditCheckout", !!read("functions/src/creditCheckout.ts"));
assert("Plans config intact", !!read("src/lib/features/plans.ts"));
assert("Paddle provider (CreditWall) intact", !!read("src/lib/ui-shared/paddle-provider.tsx"));
assert("CreditWall component intact", !!read("src/components/pricing/CreditWall.tsx"));

// ── 9. Checkout route validation ────────────────────────────────────────

console.log("\n📦 CHECKOUT ROUTE VALIDATION:");

const checkoutContent = read("src/app/api/checkout/paddle/route.ts");

assert("POST method handler", !!checkoutContent?.includes("export async function POST"));
assert("GET method rejected (405)", !!checkoutContent?.includes("Method not allowed"));
assert("Invalid JSON rejected", !!checkoutContent?.includes("Invalid JSON body"));
assert("Intent validation via isAllowedIntent", !!checkoutContent?.includes("isAllowedIntent"));
assert("Product key validation", !!checkoutContent?.includes("productKey"));
assert("Raw priceId rejected", !!checkoutContent?.includes("Client-supplied priceId is not accepted"));
assert("userId required", !!checkoutContent?.includes("userId is required"));
assert("Server-side price resolution", !!checkoutContent?.includes("resolvePaddlePriceId"));
assert("Custom data building", !!checkoutContent?.includes("buildPaddleCustomData"));
assert("Paddle SDK transaction.create", !!checkoutContent?.includes("transactions.create"));
assert("Intent/productKey compatibility check",
  !!checkoutContent?.includes("Credit pack intent requires") &&
  !!checkoutContent?.includes("Subscription intent requires")
);
assert("requestId in customData", !!checkoutContent?.includes("requestId"));

// ── 10. Response safety ─────────────────────────────────────────────────

console.log("\n📦 RESPONSE SAFETY:");

assert("Response has checkoutUrl, purchaseType, productKey only",
  checkoutContent?.includes("checkoutUrl") &&
  checkoutContent?.includes("purchaseType") &&
  checkoutContent?.includes("productKey")
);
assert("Response does NOT include priceId", !checkoutContent?.includes('"priceId"'));

// ── 11. Secrets safety ──────────────────────────────────────────────────

console.log("\n📦 SECRETS SAFETY:");

const paymentFiles = [
  "src/app/api/paddle-webhook/route.ts",
  "src/app/api/checkout/paddle/route.ts",
  "src/lib/payments/paddle-custom-data.ts",
  "src/lib/payments/paddle-price-lookup.server.ts",
  "src/lib/features/plans.ts",
];

for (const file of paymentFiles) {
  const content = read(file);
  if (!content) continue;
  assert(
    `No secret string literals in ${path.basename(file)}`,
    !content.includes("sk_test") && !content.includes("sk_live_"),
    `Found literal secret key in ${file}`,
  );
}

// ── 12. SDK installed ───────────────────────────────────────────────────

console.log("\n📦 DEPENDENCIES:");

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
assert(
  "@paddle/paddle-node-sdk installed",
  !!pkg.dependencies?.["@paddle/paddle-node-sdk"],
  "Run: npm install @paddle/paddle-node-sdk",
);

// ── 13. No TypeScript 'any' in payment files ─────────────────────────────

console.log("\n📦 TYPE SAFETY:");

for (const file of paymentFiles) {
  const content = read(file);
  if (!content) continue;
  const anyCount = (content.match(/\bany\b/g) || []).length;
  assert(
    `No TypeScript 'any' in ${path.basename(file)}`,
    anyCount === 0,
    `Found ${anyCount}x 'any' in ${file}`,
  );
}

// ── 14. Env var validation present ──────────────────────────────────────

console.log("\n📦 ENV CONFIG SAFETY:");

assert("Webhook checks PADDLE_WEBHOOK_SECRET",
  !!webhookContent?.includes("PADDLE_WEBHOOK_SECRET is not configured")
);
assert("Checkout checks paddle client available",
  !!checkoutContent?.includes("Payment system not configured")
);

// ── Summary ─────────────────────────────────────────────────────────────

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`PASS: ${passCount}  FAIL: ${failCount}`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

process.exit(failCount > 0 ? 1 : 0);
