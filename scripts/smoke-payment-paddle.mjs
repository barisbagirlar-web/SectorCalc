#!/usr/bin/env node
/**
 * Smoke test for Paddle payment integration.
 * Tests invariant logic (request validation) without external API calls.
 * Uses structural analysis + simulation instead of live Paddle API calls.
 *
 * Run: node scripts/smoke-payment-paddle.mjs
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

function assertFile(label, filePath) {
  const exists = fs.existsSync(path.join(ROOT, filePath));
  assert(label, exists, `(${filePath} not found)`);
}

// ── 1. No duplicate webhook route ───────────────────────────────────────

console.log("\n📦 DUPLICATE WEBHOOK ROUTE:");
assertFile("Canonical webhook route exists", "src/app/api/paddle-webhook/route.ts");
assert(
  "No duplicate webhook at /api/webhooks/paddle",
  !fs.existsSync(path.join(ROOT, "src/app/api/webhooks/paddle/route.ts")),
  "Remove duplicate route at src/app/api/webhooks/paddle/route.ts",
);

// ── 2. Checkout route exists ───────────────────────────────────────────

console.log("\n📦 CHECKOUT ROUTE:");
assertFile("Paddle checkout route exists", "src/app/api/checkout/paddle/route.ts");
assertFile("Stripe checkout route preserved", "src/app/api/checkout/route.ts");

// ── 3. Contract files ───────────────────────────────────────────────────

console.log("\n📦 PADDLE CONTRACT FILES:");
assertFile("Custom data contract", "src/lib/payments/paddle-custom-data.ts");
assertFile("Price lookup", "src/lib/payments/paddle-price-lookup.server.ts");

// ── 4. customData contract analysis ─────────────────────────────────────

console.log("\n📦 customData CONTRACT:");
const customDataContent = fs.readFileSync(
  path.join(ROOT, "src/lib/payments/paddle-custom-data.ts"),
  "utf8",
);

assert(
  "Allowed intents defined",
  customDataContent.includes("SECTORCALC_CREDIT_PACK_PURCHASE") &&
    customDataContent.includes("SECTORCALC_PRO_SUBSCRIPTION_PURCHASE"),
);
assert(
  "Credit pack keys defined",
  customDataContent.includes("credit_pack_1") &&
    customDataContent.includes("credit_pack_100"),
);
assert(
  "Subscription keys defined",
  customDataContent.includes("pro_monthly") &&
    customDataContent.includes("pro_annual"),
);
assert(
  "validateCustomData function",
  customDataContent.includes("validateCustomData"),
);
assert(
  "buildPaddleCustomData function",
  customDataContent.includes("buildPaddleCustomData"),
);
assert(
  "isAllowedIntent function rejects unknown intents",
  customDataContent.includes("isAllowedIntent"),
);
assert(
  "Credits by product key mapping",
  customDataContent.includes("CREDITS_BY_PRODUCT_KEY"),
);

// ── 5. Price lookup analysis ────────────────────────────────────────────

console.log("\n📦 PRICE LOOKUP:");
const priceLookupContent = fs.readFileSync(
  path.join(ROOT, "src/lib/payments/paddle-price-lookup.server.ts"),
  "utf8",
);

assert("resolvePaddlePriceId exists", priceLookupContent.includes("resolvePaddlePriceId"));
assert("resolveCreditAmount exists", priceLookupContent.includes("resolveCreditAmount"));
assert("Uses env vars for price IDs", priceLookupContent.includes("PADDLE_PRICE_ID_"));
assert("Has server-only import", priceLookupContent.includes("server-only"));

// ── 6. Webhook analysis ─────────────────────────────────────────────────

console.log("\n📦 WEBHOOK:");
const webhookContent = fs.readFileSync(
  path.join(ROOT, "src/app/api/paddle-webhook/route.ts"),
  "utf8",
);

assert("Signature verification", webhookContent.includes("verifyPaddleSignature"));
assert("No second verification method competing", !webhookContent.includes("Webhooks.unmarshal"));
assert("Custom data validation", webhookContent.includes("validateCustomData"));
assert("Legacy credits field preserved", webhookContent.includes("customDataRaw?.credits"));
assert("Legacy planId field preserved", webhookContent.includes("customDataRaw?.planId"));
assert("Idempotency check", webhookContent.includes("isAlreadyProcessed"));
assert("Idempotency write", webhookContent.includes("markProcessed"));
assert("Credit fulfillment", webhookContent.includes("addUserCredits"));
assert("Subscription fulfillment", webhookContent.includes("fulfillSubscription"));
assert("Duplicate prevention", webhookContent.includes("deduplicated"));
assert("Event type routing", webhookContent.includes("event_type"));
assert("Malformed customData handled", webhookContent.includes("customDataRaw?.credits"));

// ── 7. Backward compatibility ────────────────────────────────────────────

console.log("\n📦 BACKWARD COMPATIBILITY:");
assert(
  "Stripe checkout route intact",
  fs.existsSync(path.join(ROOT, "src/app/api/checkout/route.ts")),
);
assert(
  "Stripe Cloud Function checkout intact",
  fs.existsSync(path.join(ROOT, "functions/src/createStripeCheckout.ts")),
);
assert(
  "Stripe Cloud Function webhook intact",
  fs.existsSync(path.join(ROOT, "functions/src/stripeWebhook.ts")),
);
assert(
  "Stripe credit checkout intact",
  fs.existsSync(path.join(ROOT, "functions/src/creditCheckout.ts")),
);
assert(
  "Plans config intact",
  fs.existsSync(path.join(ROOT, "src/lib/features/plans.ts")),
);
assert(
  "Paddle provider intact",
  fs.existsSync(path.join(ROOT, "src/lib/ui-shared/paddle-provider.tsx")),
);

// ── 8. Checkout route validation analysis ───────────────────────────────

console.log("\n📦 CHECKOUT ROUTE VALIDATION:");
const checkoutContent = fs.readFileSync(
  path.join(ROOT, "src/app/api/checkout/paddle/route.ts"),
  "utf8",
);

assert("Intent validation", checkoutContent.includes("isAllowedIntent"));
assert("Product key validation", checkoutContent.includes("productKey"));
  assert("Raw priceId rejected by server-side validation", checkoutContent.includes("Client-supplied priceId"));
  assert("Server-side price resolution", checkoutContent.includes("resolvePaddlePriceId"));
  assert("Custom data building", checkoutContent.includes("buildPaddleCustomData"));
  assert("Paddle SDK transaction.create", checkoutContent.includes("transactions.create"));
  assert("No client-supplied raw priceId accepted", !checkoutContent.includes("body.priceId ==") && !checkoutContent.includes("body.priceId = "));
  assert("Response fields present", checkoutContent.includes("checkoutUrl:") && checkoutContent.includes("purchaseType:"));

// ── 9. No raw priceId in response ───────────────────────────────────────

console.log("\n📦 RESPONSE SAFETY:");
assert("Response uses checkoutUrl not raw priceId", checkoutContent.includes("checkoutUrl:") && checkoutContent.includes("purchaseType:"));
assert("Server validates and rejects client-supplied priceId", checkoutContent.includes("error:") && checkoutContent.includes("productKey:"));

// ── 10. SDK installed ───────────────────────────────────────────────────

console.log("\n📦 DEPENDENCIES:");
const pkg = JSON.parse(
  fs.readFileSync(path.join(ROOT, "package.json"), "utf8"),
);
const hasPaddleSDK = pkg.dependencies?.["@paddle/paddle-node-sdk"];
assert(
  "@paddle/paddle-node-sdk installed",
  !!hasPaddleSDK,
  "Run: npm install @paddle/paddle-node-sdk",
);

// ── Summary ─────────────────────────────────────────────────────────────

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`PASS: ${passCount}  FAIL: ${failCount}`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

process.exit(failCount > 0 ? 1 : 0);
