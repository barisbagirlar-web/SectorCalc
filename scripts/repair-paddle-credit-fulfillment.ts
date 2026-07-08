/**
 * SectorCalc — Paddle Credit Fulfillment Repair Script
 *
 * Diagnostics + migration for the Paddle webhook bug where credits were written
 * to users/{uid}.credits (top-level field) instead of users/{uid}/credits/balance.amount.
 *
 * Usage:
 *   npx tsx scripts/repair-paddle-credit-fulfillment.ts \
 *     --email teb232@gmail.com \
 *     --diagnose-only
 *
 *   npx tsx scripts/repair-paddle-credit-fulfillment.ts \
 *     --email teb232@gmail.com \
 *     --credits 100 \
 *     --transaction-id txn_xxx \
 *     --price-id pri_xxx \
 *     --environment sandbox \
 *     --dry-run
 *
 *   npx tsx scripts/repair-paddle-credit-fulfillment.ts \
 *     --email teb232@gmail.com \
 *     --credits 100 \
 *     --transaction-id txn_xxx \
 *     --price-id pri_xxx \
 *     --environment sandbox \
 *     --confirm
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ── Load .env.local ──────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, "..");

function loadEnvLocal() {
  const envPath = path.join(PROJECT_ROOT, ".env.local");
  if (!fs.existsSync(envPath)) {
    console.warn("⚠  .env.local not found — relying on existing process.env");
    return;
  }
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

// ── Parse CLI arguments ──────────────────────────────────────────────────

function parseArgs(): Record<string, string | boolean> {
  const args: Record<string, string | boolean> = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg === "--diagnose-only") {
      args["diagnose-only"] = true;
    } else if (arg === "--dry-run") {
      args["dry-run"] = true;
    } else if (arg === "--confirm") {
      args["confirm"] = true;
    } else if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const val = process.argv[++i];
      if (val !== undefined && !val.startsWith("--")) {
        args[key] = val;
      } else {
        args[key] = true;
        i--;
      }
    }
  }
  return args;
}

// ── Main ─────────────────────────────────────────────────────────────────

async function main() {
  loadEnvLocal();

  const args = parseArgs();
  const email = String(args["email"] || "").trim().toLowerCase();
  const diagnoseOnly = args["diagnose-only"] === true;
  const dryRun = args["dry-run"] === true;
  const confirm = args["confirm"] === true;

  if (!email) {
    console.error("❌ Usage: --email <user@example.com> [--diagnose-only | --dry-run | --confirm]");
    process.exit(1);
  }

  if (!diagnoseOnly && !dryRun && !confirm) {
    console.error("❌ Specify one of: --diagnose-only, --dry-run, or --confirm");
    process.exit(1);
  }

  if (confirm && dryRun) {
    console.error("❌ Cannot use both --dry-run and --confirm");
    process.exit(1);
  }

  // Optional params for confirmed write
  const creditsOverride = args["credits"] ? Number(args["credits"]) : undefined;
  const transactionId = String(args["transaction-id"] || "").trim();
  const priceId = String(args["price-id"] || "").trim();
  const environment = String(args["environment"] || "sandbox").trim();

  // ── Initialize Firebase Admin ──────────────────────────────────────────

  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!rawServiceAccount) {
    console.error("❌ FIREBASE_SERVICE_ACCOUNT_JSON not found in env");
    process.exit(1);
  }

  let serviceAccount: Record<string, string>;
  try {
    serviceAccount = JSON.parse(rawServiceAccount);
  } catch {
    console.error("❌ FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON");
    process.exit(1);
  }

  const admin = await import("firebase-admin");
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }

  const db = admin.firestore();

  // ── Resolve user by email ──────────────────────────────────────────────

  console.log(`\n🔍 Looking up user by email: ${email}`);
  const usersQuery = await db
    .collection("users")
    .where("email", "==", email)
    .limit(2)
    .get();

  if (usersQuery.empty) {
    console.error(`❌ No user found with email: ${email}`);
    process.exit(1);
  }
  if (usersQuery.docs.length > 1) {
    console.error(`❌ Multiple users (${usersQuery.docs.length}) found with email: ${email}`);
    process.exit(1);
  }

  const userDoc = usersQuery.docs[0];
  const userId = userDoc.id;
  const userData = userDoc.data();
  console.log(`✅ User found: ${userId}`);

  // ── Diagnose current state ─────────────────────────────────────────────

  console.log("\n═══════════════════════════════════════════");
  console.log("  DIAGNOSIS");
  console.log("═══════════════════════════════════════════\n");

  // Old path: users/{uid}.credits (top-level field)
  const oldPathCredits = typeof userData.credits === "number" ? userData.credits : 0;
  console.log(`📌 Old path (user.credits field):          ${oldPathCredits}`);

  // New path: users/{uid}/credits/balance.amount (subcollection)
  const balanceRef = db.collection("users").doc(userId).collection("credits").doc("balance");
  const balanceSnap = await balanceRef.get();
  const newPathCredits = balanceSnap.exists && typeof balanceSnap.data()?.amount === "number"
    ? balanceSnap.data()!.amount
    : 0;
  console.log(`📌 New path (credits/balance.amount):      ${newPathCredits}`);

  // Check paddle_processed_events for this user
  const eventsQuery = await db
    .collection("paddle_processed_events")
    .where("userId", "==", userId)
    .orderBy("processedAt", "desc")
    .limit(10)
    .get();

  const events: Array<{ id: string; data: Record<string, unknown> }> = [];
  eventsQuery.forEach((doc) => events.push({ id: doc.id, data: doc.data() as Record<string, unknown> }));
  console.log(`📌 Paddle events (paddle_processed_events): ${events.length}`);

  // Check credit_ledger
  const ledgerQuery = await db
    .collection("credit_ledger")
    .where("userId", "==", userId)
    .orderBy("processedAt", "desc")
    .limit(10)
    .get();

  const ledgerEntries: Array<{ id: string; data: Record<string, unknown> }> = [];
  ledgerQuery.forEach((doc) => ledgerEntries.push({ id: doc.id, data: doc.data() as Record<string, unknown> }));
  console.log(`📌 Credit ledger entries (credit_ledger):   ${ledgerEntries.length}`);

  // Check creditTransactions
  const txnQuery = await db
    .collection("creditTransactions")
    .where("userId", "==", userId)
    .orderBy("timestamp", "desc")
    .limit(10)
    .get();

  const txnEntries: Array<{ id: string; data: Record<string, unknown> }> = [];
  txnQuery.forEach((doc) => txnEntries.push({ id: doc.id, data: doc.data() as Record<string, unknown> }));
  console.log(`📌 Credit transactions (creditTransactions): ${txnEntries.length}`);

  // Print event details
  for (const ev of events) {
    console.log(`   ─ Event ${ev.id}:`);
    console.log(`     transactionId: ${ev.data.transactionId}`);
    console.log(`     credits: ${ev.data.credits}`);
    console.log(`     intent: ${ev.data.intent}`);
    console.log(`     status: ${ev.data.status}`);
  }

  if (diagnoseOnly) {
    console.log("\n✅ Diagnose complete. No changes made.");
    process.exit(0);
  }

  // ── Determine migration amount ────────────────────────────────────────

  let migrateCredits = 0;
  let migrateEventId = "";
  let migrateTransactionId = "";

  if (creditsOverride !== undefined) {
    // Use manually specified credits
    migrateCredits = creditsOverride;
    migrateTransactionId = transactionId;
    // Find matching event if exists
    if (migrateTransactionId) {
      for (const ev of events) {
        if (String(ev.data.transactionId) === migrateTransactionId) {
          migrateEventId = ev.id;
          break;
        }
      }
    }
  } else if (oldPathCredits > 0 && newPathCredits === 0) {
    // Old path has credits, new path doesn't — migrate
    migrateCredits = oldPathCredits;
    // Use first event if available
    if (events.length > 0) {
      migrateEventId = events[0].id;
      migrateTransactionId = String(events[0].data.transactionId || "");
    } else {
      migrateTransactionId = `repair-${Date.now()}`;
    }
  } else if (oldPathCredits > 0 && newPathCredits > 0) {
    // Both have credits — check if they match
    console.log(`\n⚠  Both paths have credits: old=${oldPathCredits}, new=${newPathCredits}`);
    if (oldPathCredits > newPathCredits) {
      migrateCredits = oldPathCredits - newPathCredits;
      console.log(`   Difference (old - new) = ${migrateCredits} will be added`);
      if (events.length > 0) {
        migrateEventId = events[0].id;
        migrateTransactionId = String(events[0].data.transactionId || "");
      } else {
        migrateTransactionId = `repair-${Date.now()}`;
      }
    } else {
      console.log(`   New path already has >= old path credits. No migration needed.`);
    }
  } else if (oldPathCredits === 0 && newPathCredits === 0 && events.length > 0) {
    // Events exist but no credits anywhere — use event data
    for (const ev of events) {
      const evCredits = Number(ev.data.credits || 0);
      if (evCredits > 0) {
        migrateCredits += evCredits;
        migrateEventId = ev.id;
        migrateTransactionId = String(ev.data.transactionId || "");
        break; // Use first event
      }
    }
    if (migrateCredits === 0 && creditsOverride === undefined) {
      console.log(`\n⚠  Events found but no credit amounts. Use --credits to specify.`);
    }
  } else if (events.length === 0 && oldPathCredits === 0 && newPathCredits === 0) {
    console.log(`\n⚠  No events found, no credits in either path.`);
    console.log(`   This may mean the webhook never fired for this user.`);
    console.log(`   Use --credits <N> --transaction-id <txn> --price-id <pri> to force.`);
  }

  // ── Use override if specified ──────────────────────────────────────────
  if (creditsOverride !== undefined && creditsOverride !== 0) {
    migrateCredits = creditsOverride;
    migrateTransactionId = transactionId;
    // Find event by transactionId
    if (migrateTransactionId) {
      for (const ev of events) {
        if (String(ev.data.transactionId) === migrateTransactionId) {
          migrateEventId = ev.id;
          break;
        }
      }
    }
  }

  if (migrateCredits <= 0) {
    console.log(`\n✅ Nothing to migrate. Credits already in correct location.`);
    process.exit(0);
  }

  // ── Check idempotency against credit_ledger ────────────────────────────
  if (migrateTransactionId) {
    const ledgerCheck = await db.collection("credit_ledger").doc(migrateTransactionId).get();
    if (ledgerCheck.exists) {
      const ledgerData = ledgerCheck.data();
      console.log(`\n⚠  Transaction ${migrateTransactionId} already exists in credit_ledger:`);
      console.log(`   credits: ${ledgerData?.credits}, userId: ${ledgerData?.userId}`);
      if (newPathCredits > 0) {
        console.log(`   Credits already in correct path (${newPathCredits}). No action needed.`);
        process.exit(0);
      }
      console.log(`   Credits in wrong path (${oldPathCredits}). Migration will use repair- prefix.`);
      // Use a repair-specific idempotency key to avoid conflicting with existing ledger entry
      migrateTransactionId = `repair-${migrateTransactionId}`;
    }
  }

  // ── Print planned action ───────────────────────────────────────────────

  console.log("\n═══════════════════════════════════════════");
  console.log("  PLANNED ACTION");
  console.log("═══════════════════════════════════════════\n");
  console.log(`  User:              ${email} (${userId})`);
  console.log(`  Credits to add:    ${migrateCredits}`);
  console.log(`  Transaction ID:    ${migrateTransactionId || "(none)"}`);
  console.log(`  Price ID:          ${priceId || "(not provided)"}`);
  console.log(`  Environment:       ${environment}`);
  console.log(`  Old path balance:  ${oldPathCredits}`);
  console.log(`  New path balance:  ${newPathCredits}`);
  console.log(`  New balance after: ${newPathCredits + migrateCredits}`);
  console.log(`  Write mode:        ${confirm ? "CONFIRMED (will write)" : "DRY RUN (no write)"}`);
  console.log("");

  // ── Event ID for ledger ───────────────────────────────────────────────
  const ledgerEventId = migrateEventId || `repair-${Date.now()}`;

  if (confirm) {
    // ── Execute migration ──────────────────────────────────────────────
    try {
      await db.runTransaction(async (tx) => {
        // 1. Check idempotency key
        const ledgerDocRef = db.collection("credit_ledger").doc(`repair-${migrateTransactionId || ledgerEventId}`);
        const ledgerSnap = await tx.get(ledgerDocRef);
        if (ledgerSnap.exists) {
          console.log(`⏭  Idempotency key already exists — skipping (repair already completed?)`);
          return;
        }

        // 2. Update credits balance (correct path)
        const balRef = db.collection("users").doc(userId).collection("credits").doc("balance");
        tx.set(
          balRef,
          {
            amount: admin.firestore.FieldValue.increment(migrateCredits),
            updatedAt: new Date().toISOString(),
          },
          { merge: true },
        );

        // 3. Write credit_ledger entry (repair-specific key)
        tx.set(ledgerDocRef, {
          transactionId: migrateTransactionId || ledgerEventId,
          eventId: ledgerEventId,
          userId,
          credits: migrateCredits,
          intent: "SECTORCALC_CREDIT_PACK_PURCHASE",
          productKey: priceId ? `price_${priceId}` : "repair_migration",
          purchaseType: "credit_pack",
          provider: "paddle_repair",
          status: "completed",
          environment,
          priceId: priceId || "",
          processedAt: new Date().toISOString(),
        });

        // 4. Write creditTransactions record
        const creditTxnRef = db.collection("creditTransactions").doc();
        tx.create(creditTxnRef, {
          userId,
          type: "purchase",
          credits: migrateCredits,
          paddleTransactionId: migrateTransactionId || ledgerEventId,
          paddleEventId: ledgerEventId,
          paddlePriceId: priceId || "",
          timestamp: new Date().toISOString(),
          source: "repair_script",
        });

        // 5. Write paddle_processed_events entry
        const eventRef = db.collection("paddle_processed_events").doc(ledgerEventId);
        tx.set(eventRef, {
          eventId: ledgerEventId,
          transactionId: migrateTransactionId || ledgerEventId,
          intent: "SECTORCALC_CREDIT_PACK_PURCHASE",
          productKey: priceId ? `price_${priceId}` : "repair_migration",
          purchaseType: "credit_pack",
          userId,
          credits: migrateCredits,
          planId: "",
          eventType: "transaction.completed",
          provider: "paddle_repair",
          status: "completed",
          processedAt: new Date().toISOString(),
        }, { merge: true });
      });

      // ── Verify after migration ─────────────────────────────────────────
      const verifySnap = await balanceRef.get();
      const finalBalance = verifySnap.exists && typeof verifySnap.data()?.amount === "number"
        ? verifySnap.data()!.amount
        : 0;

      console.log("═══════════════════════════════════════════");
      console.log("  ✅ MIGRATION COMPLETE");
      console.log("═══════════════════════════════════════════\n");
      console.log(`  User:              ${email} (${userId})`);
      console.log(`  Credits added:     ${migrateCredits}`);
      console.log(`  New path balance:  ${finalBalance}`);
      console.log(`  Ledger key:        repair-${migrateTransactionId || ledgerEventId}`);
      console.log(`  creditTransactions: written`);
      console.log(`  Environment:       ${environment}`);

    } catch (err) {
      console.error("\n❌ Migration failed:", err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  } else {
    console.log("⚠  DRY RUN — no changes written. Re-run with --confirm to execute.");
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
