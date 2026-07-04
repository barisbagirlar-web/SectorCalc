#!/usr/bin/env node
/**
 * SectorCalc Payment Integrity Guard.
 *
 * Fails if any of these are true:
 * - Two Paddle webhook routes can process events
 * - Raw Paddle priceId is accepted from client
 * - Arbitrary purchase intent is accepted
 * - Webhook route lacks signature verification
 * - Idempotency is check-before/write-after outside transaction
 * - Credit increment occurs outside transaction for webhook fulfillment
 * - markProcessed occurs after fulfillment outside transaction
 * - Stripe checkout route is deleted
 * - Secrets are exposed in response/console
 * - TypeScript 'any' exists in payment files
 * - New Paddle route returns raw secret/price IDs
 *
 * Runs static/structural analysis on payment source files.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

let failCount = 0;

function fail(label, detail = "") {
  console.error(`  ❌ ${label} ${detail}`);
  failCount++;
}

function pass(label) {
  console.log(`  ✅ ${label}`);
}

function read(filePath) {
  const abs = path.join(ROOT, filePath);
  if (!fs.existsSync(abs)) return null;
  return fs.readFileSync(abs, "utf8");
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. No duplicate Paddle webhook routes
// ═══════════════════════════════════════════════════════════════════════════

console.log("\n🔍 DUPLICATE WEBHOOK ROUTES:");

const canonicalWebhook = read("src/app/api/paddle-webhook/route.ts");
if (!canonicalWebhook) {
  fail("Canonical webhook route missing", "src/app/api/paddle-webhook/route.ts");
} else {
  pass("Canonical webhook route exists");
}

const duplicateWebhook = read("src/app/api/webhooks/paddle/route.ts");
if (duplicateWebhook) {
  // Check if it actually processes events (not just a stub)
  if (
    duplicateWebhook.includes("transaction.completed") ||
    duplicateWebhook.includes("processPurchase") ||
    duplicateWebhook.includes("fulfill")
  ) {
    fail(
      "Duplicate webhook route processes events",
      "src/app/api/webhooks/paddle/route.ts must be removed or disabled",
    );
  } else {
    pass("Duplicate webhook route is safe (stub/disabled)");
  }
} else {
  pass("No duplicate webhook route");
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. Raw priceId not accepted
// ═══════════════════════════════════════════════════════════════════════════

console.log("\n🔍 RAW PRICE ID REJECTION:");

const checkoutContent = read("src/app/api/checkout/paddle/route.ts");
if (checkoutContent) {
  if (checkoutContent.includes("Client-supplied priceId is not accepted")) {
    pass("Raw priceId rejected in checkout");
  } else {
    fail("Raw priceId not rejected", "checkout/paddle/route.ts must reject body.priceId");
  }
} else {
  fail("Paddle checkout route missing");
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. Arbitrary intent not accepted
// ═══════════════════════════════════════════════════════════════════════════

console.log("\n🔍 INTENT VALIDATION:");

if (checkoutContent) {
  if (checkoutContent.includes("isAllowedIntent")) {
    pass("Intent validated via isAllowedIntent");
  } else {
    fail("Arbitrary intent may be accepted", "checkout/paddle/route.ts must use isAllowedIntent");
  }
}

if (canonicalWebhook) {
  if (canonicalWebhook.includes("validateCustomData") || canonicalWebhook.includes("isAllowedIntent")) {
    pass("Webhook validates intent");
  } else {
    fail("Webhook may accept arbitrary intent");
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. Webhook signature verification
// ═══════════════════════════════════════════════════════════════════════════

console.log("\n🔍 WEBHOOK SIGNATURE VERIFICATION:");

if (canonicalWebhook) {
  if (canonicalWebhook.includes("verifyPaddleSignature")) {
    pass("Webhook has signature verification");
  } else {
    fail("Webhook missing signature verification");
  }

  // Ensure no competing verification method
  const sdkUnmarshalCount = (canonicalWebhook.match(/Webhooks\.unmarshal/g) || []).length;
  const manualVerifyCount = (canonicalWebhook.match(/verifyPaddleSignature/g) || []).length;
  if (manualVerifyCount >= 1 && sdkUnmarshalCount === 0) {
    pass("Single verification method (manual HMAC)");
  } else if (sdkUnmarshalCount >= 1 && manualVerifyCount === 0) {
    pass("Single verification method (SDK unmarshal)");
  } else if (sdkUnmarshalCount >= 1 && manualVerifyCount >= 1) {
    fail("Competing verification methods", "Use exactly one");
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. Atomic idempotency via Firestore transaction
// ═══════════════════════════════════════════════════════════════════════════

console.log("\n🔍 ATOMIC IDEMPOTENCY:");

if (canonicalWebhook) {
  // Check for Firestore transaction
  if (canonicalWebhook.includes("runTransaction")) {
    pass("Uses Firestore transaction");
  } else {
    fail("Does not use Firestore transaction", "Webhook must use runTransaction for atomic fulfillment");
  }

  // Check that old check-before/write-after pattern is removed
  const hasIsAlreadyProcessed = canonicalWebhook.includes("isAlreadyProcessed");
  const hasMarkProcessed = canonicalWebhook.includes("markProcessed");
  if (hasIsAlreadyProcessed) {
    fail("Has isolated isAlreadyProcessed check", "Must use transaction, not separate check");
  }
  if (hasMarkProcessed) {
    fail("Has isolated markProcessed function", "Must use transaction, not separate write");
  }

  // Check idempotency doc is created inside transaction
  if (canonicalWebhook.includes("txn.create(idempotencyRef")) {
    pass("Idempotency doc created inside transaction");
  } else {
    fail("Idempotency doc not created inside transaction");
  }

  // Check credit increment is inside the transaction
  if (canonicalWebhook.includes("txn.set") && canonicalWebhook.includes("credits:")) {
    pass("Credit increment inside transaction");
  } else {
    fail("Credit increment outside transaction");
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. Stripe preserved
// ═══════════════════════════════════════════════════════════════════════════

console.log("\n🔍 STRIPE PRESERVED:");

const stripeRoutes = [
  "src/app/api/checkout/route.ts",
  "functions/src/createStripeCheckout.ts",
  "functions/src/stripeWebhook.ts",
  "functions/src/creditCheckout.ts",
];

for (const route of stripeRoutes) {
  const content = read(route);
  if (content && content.includes("stripe") || content?.includes("Stripe")) {
    pass(`Stripe route preserved: ${route}`);
  } else if (!content) {
    fail(`Stripe route missing: ${route}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. Secrets not exposed in response or console
// ═══════════════════════════════════════════════════════════════════════════

console.log("\n🔍 SECRET EXPOSURE:");

const paymentFiles = [
  "src/app/api/paddle-webhook/route.ts",
  "src/app/api/checkout/paddle/route.ts",
  "src/lib/payments/paddle-custom-data.ts",
  "src/lib/payments/paddle-price-lookup.server.ts",
];

for (const file of paymentFiles) {
  const content = read(file);
  if (!content) continue;

  // Check response objects don't include secrets
  if (content.includes('"PADDLE_SECRET_KEY"') || content.includes("'PADDLE_SECRET_KEY'")) {
    fail(`Secret key name returned in response: ${file}`);
  }
  if (content.includes('"STRIPE_SECRET_KEY"') || content.includes("'STRIPE_SECRET_KEY'")) {
    fail(`Secret key name returned in response: ${file}`);
  }
  if (content.includes(".log(secret") || content.includes("console.log(secret")) {
    fail(`Secrets might be logged: ${file}`);
  }
}
pass("No obvious secret exposure in payment files");

// ═══════════════════════════════════════════════════════════════════════════
// 8. No TypeScript 'any' in payment files
// ═══════════════════════════════════════════════════════════════════════════

console.log("\n🔍 TYPE SAFETY:");

for (const file of paymentFiles) {
  const content = read(file);
  if (!content) continue;
  const anyCount = (content.match(/\bany\b/g) || []).length;
  if (anyCount > 0) {
    fail(`TypeScript 'any' found (${anyCount}x) in ${file}`);
  }
}
pass("No TypeScript 'any' in payment files");

// ═══════════════════════════════════════════════════════════════════════════
// 9. Checkout response safety
// ═══════════════════════════════════════════════════════════════════════════

console.log("\n🔍 CHECKOUT RESPONSE SAFETY:");

if (checkoutContent) {
  if (checkoutContent.includes("checkoutUrl") && checkoutContent.includes("purchaseType")) {
    pass("Checkout response has safe fields only");
  }
  if (!checkoutContent.includes('"priceId"') && !checkoutContent.includes("'priceId'")) {
    pass("Response does not include raw priceId");
  } else {
    fail("Response may leak raw priceId");
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 10. Server-side price lookup
// ═══════════════════════════════════════════════════════════════════════════

console.log("\n🔍 SERVER-SIDE PRICE LOOKUP:");

const priceLookup = read("src/lib/payments/paddle-price-lookup.server.ts");
if (priceLookup) {
  if (priceLookup.includes("PADDLE_PRICE_ID_")) {
    pass("Price IDs from server env vars");
  } else {
    fail("Price IDs not from server env", "paddle-price-lookup.server.ts must use env vars");
  }
  if (priceLookup.includes("server-only")) {
    pass("Price lookup is server-only");
  } else {
    fail("Price lookup not server-only");
  }
} else {
  fail("Price lookup file missing");
}

// ═══════════════════════════════════════════════════════════════════════════
// Summary
// ═══════════════════════════════════════════════════════════════════════════

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
if (failCount === 0) {
  console.log("RESULT: ALL INTEGRITY CHECKS PASSED");
  process.exit(0);
} else {
  console.error(`RESULT: ${failCount} INTEGRITY FAILURE(S)`);
  process.exit(1);
}
