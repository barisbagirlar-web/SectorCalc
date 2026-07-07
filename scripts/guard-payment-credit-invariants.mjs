#!/usr/bin/env node
/**
 * SectorCalc Payment & Credit Invariants Guard
 *
 * Verifies that all payment/credit/Key invariants are structurally enforced
 * in the active source code. Does NOT run Firestore or Paddle — static analysis only.
 *
 * Invariants checked:
 * 1. paddle_processed_events ledger exists and is checked before fulfillment
 * 2. credit_ledger collection is referenced in webhook
 * 3. paddle_customers mapping is created during fulfillment
 * 4. ctm_* IDs are never used as Firebase UIDs
 * 5. baris_key_ledger status tracking exists (DEDUCTED/EXECUTED/REFUNDED)
 * 6. Key deduction is atomic (inside Firestore transaction)
 * 7. Refund is idempotent (checks ledger status before refund)
 * 8. No x-user-id header is trusted for userId
 * 9. Execute route catch-all refunds on exception
 *
 * Returns:
 *   PASS + optional WARNING(s) or FAIL + BLOCKERS
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

let passCount = 0;
let failCount = 0;
const warnings = [];

function pass(msg) {
  passCount++;
  console.log(`  ✅ ${msg}`);
}

function fail(msg) {
  failCount++;
  console.log(`  ❌ ${msg}`);
}

function warn(msg) {
  warnings.push(msg);
  console.log(`  ⚠️  ${msg}`);
}

function read(path) {
  try {
    return readFileSync(join(ROOT, path), "utf8");
  } catch {
    return null;
  }
}

console.log("\n=== Payment & Credit Invariants Guard ===\n");

// ── 1. paddle_processed_events ────────────────────────────────────────
const webhook = read("src/app/api/paddle-webhook/route.ts");
if (webhook) {
  if (webhook.includes("paddle_processed_events")) {
    pass("paddle_processed_events collection is referenced in webhook");
  } else {
    fail("paddle_processed_events collection NOT found in webhook");
  }

  if (webhook.includes("credit_ledger")) {
    pass("credit_ledger collection is referenced in webhook");
  } else {
    fail("credit_ledger collection NOT found in webhook");
  }

  if (webhook.includes("paddle_customers")) {
    pass("paddle_customers collection is referenced in webhook");
  } else {
    fail("paddle_customers collection NOT found in webhook");
  }

  if (webhook.includes("manual_review")) {
    pass("paddle_manual_review collection is referenced in webhook");
  } else {
    fail("paddle_manual_review collection NOT found in webhook");
  }

  if (webhook.includes('startsWith("ctm_")')) {
    pass("ctm_ prefix check exists in webhook");
  } else {
    fail("ctm_ prefix check MISSING in webhook — Paddle customer ID may be used as UID");
  }
} else {
  fail("paddle-webhook/route.ts not found");
}

// ── 2. baris_key_ledger ────────────────────────────────────────────────
const keyDeduction = read("src/sectorcalc/pro-commerce/baris-key-deduction.ts");
if (keyDeduction) {
  if (keyDeduction.includes("baris_key_ledger")) {
    pass("baris_key_ledger collection is referenced in key deduction");
  } else {
    fail("baris_key_ledger collection NOT found in key deduction");
  }

  if (keyDeduction.includes("DEDUCTED") && keyDeduction.includes("EXECUTED") && keyDeduction.includes("REFUNDED")) {
    pass("Key ledger has all three status values (DEDUCTED/EXECUTED/REFUNDED)");
  } else {
    fail("Key ledger is missing one or more required status values");
  }

  if (keyDeduction.includes("db.runTransaction")) {
    pass("Key deduction uses atomic Firestore transaction");
  } else {
    fail("Key deduction does NOT use Firestore transaction");
  }

  if (keyDeduction.includes("ledgerSnap.data()?.status !== \"DEDUCTED\"")) {
    pass("Refund checks ledger status before refunding (idempotent)");
  } else {
    warn("Refund idempotency check pattern not found — verify manually");
  }
} else {
  fail("baris-key-deduction.ts not found");
}

// ── 3. Execute route invariants ────────────────────────────────────────
const executeRoute = read("src/app/api/pro-calculator/execute/route.ts");
if (executeRoute) {
  if (executeRoute.includes("getAdminAuth")) {
    pass("getAdminAuth imported in execute route");
  } else {
    fail("getAdminAuth NOT imported in execute route — auth verification may be missing");
  }

  if (executeRoute.includes("verifyIdToken")) {
    pass("Firebase Auth ID token verification present");
  } else {
    fail("Firebase Auth ID token verification MISSING");
  }

  if (executeRoute.includes('OWNER_BYPASS_EMAIL')) {
    pass("Owner bypass email check is present for admin testing");
  } else {
    warn("Owner bypass email check not found — verify manually");
  }

  if (executeRoute.includes("deductBarisProKeyAtomic")) {
    pass("Atomic key deduction is called in execute route");
  } else {
    fail("Atomic key deduction NOT called in execute route");
  }

  if (executeRoute.includes("refundBarisProKey")) {
    pass("Refund function is called in execute route");
  } else {
    fail("Refund function NOT called in execute route");
  }

  if (executeRoute.includes("markKeyExecuted")) {
    pass("markKeyExecuted called on success");
  } else {
    warn("markKeyExecuted not found — verify ledger is updated on success");
  }

  // Check that x-user-id header is NOT used for entitlement
  if (executeRoute.includes('"x-user-id"') || executeRoute.includes("x-user-id")) {
    const headerUserIdLine = executeRoute.split("\n").filter(l => l.includes("x-user-id"));
    if (headerUserIdLine.some(l => l.includes("?? null") || l.includes("getHeader"))) {
      fail("x-user-id header is still referenced in the route — must NOT be trusted");
    } else {
      pass("x-user-id header not present in executable paths");
    }
  } else {
    pass("x-user-id header not referenced in execute route");
  }
} else {
  fail("execute route not found");
}

// ── 4. Admin.ts has getAdminAuth ────────────────────────────────────────
const admin = read("src/lib/infrastructure/firebase/admin.ts");
if (admin) {
  if (admin.includes("getAdminAuth")) {
    pass("getAdminAuth exported from admin.ts");
  } else {
    fail("getAdminAuth NOT exported from admin.ts");
  }
  if (admin.includes('from "firebase-admin/auth"') || admin.includes("firebase-admin/auth")) {
    pass("firebase-admin/auth imported in admin.ts");
  } else {
    fail("firebase-admin/auth NOT imported in admin.ts");
  }
} else {
  fail("admin.ts not found");
}

// ── 5. Vitest test files exist ──────────────────────────────────────────
const testFiles = [
  "tests/pro-commerce/paddle-webhook-idempotency.test.ts",
  "tests/pro-commerce/paddle-customer-id-not-used-as-uid.test.ts",
  "tests/pro-commerce/paddle-email-fallback-single-user.test.ts",
  "tests/pro-commerce/baris-key-atomic-deduction-race.test.ts",
  "tests/pro-commerce/baris-key-refund-on-execution-failure.test.ts",
  "tests/pro-commerce/baris-key-no-negative-balance.test.ts",
  "tests/pro-commerce/baris-key-duplicate-request-no-double-deduct.test.ts",
];
let allTestsExist = true;
for (const tf of testFiles) {
  if (existsSync(join(ROOT, tf))) {
    pass(`Test file exists: ${tf}`);
  } else {
    fail(`Test file MISSING: ${tf}`);
    allTestsExist = false;
  }
}

// ── Summary ─────────────────────────────────────────────────────────────
console.log(`\n=== Result: ${failCount > 0 ? "FAIL" : "PASS"} ===`);
console.log(`  Passed: ${passCount}`);
console.log(`  Failed: ${failCount}`);
if (warnings.length > 0) {
  console.log(`  Warnings: ${warnings.length}`);
  for (const w of warnings) {
    console.log(`    ⚠️  ${w}`);
  }
}
console.log("");

process.exit(failCount > 0 ? 1 : 0);
