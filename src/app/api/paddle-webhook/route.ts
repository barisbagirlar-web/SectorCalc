/**
 * SectorCalc Paddle Webhook — canonical handler (v2).
 * Route: POST /api/paddle-webhook
 *
 * Verification:    Manual HMAC (raw-body, no SDK dependency).
 * Fulfillment:     Atomic Firestore transaction with triple-ledger idempotency:
 *   1. paddle_processed_events/{eventId} — event-level dedup
 *   2. credit_ledger/{transactionId} — transaction-level dedup
 *   3. paddle_customers/{paddleCustomerId} — stable UID mapping
 *
 * User ID resolution (strict priority):
 *   1. customData.userId (must be a non-ctm_ value)
 *   2. paddle_customers/{customerId}.uid mapping
 *   3. Email-based Firestore lookup (single match only) + create mapping
 *   4. manual_review queue — NO fulfillment, NO ctm_* as UID
 *
 * Legacy support:
 *   - customData.credits / .planId (from CreditWall client-side Paddle.js)
 *   - customData.userId (from old CheckoutButton)
 *
 * Stripe webhook in Cloud Functions (functions/src/stripeWebhook.ts) is
 * completely separate and unaffected.
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import {
  validateCustomData,
  parseLegacyCustomData,
  CREDITS_BY_PRODUCT_KEY,
  type PaddleCustomData,
  type PaddleProductKey,
} from "@/lib/payments/paddle-custom-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET ?? "";
const USERS_COLLECTION = "users";
const EVENTS_COLLECTION = "paddle_processed_events";
const CREDIT_LEDGER_COLLECTION = "credit_ledger";
const CUSTOMERS_COLLECTION = "paddle_customers";
const MANUAL_REVIEW_COLLECTION = "paddle_manual_review";
const CREDIT_BALANCE_COLLECTION = "credits";
const CREDIT_BALANCE_DOC = "balance";
const CREDIT_TRANSACTIONS_COLLECTION = "creditTransactions";

// ── Verification (manual HMAC) ───────────────────────────────────────────

function verifyPaddleSignature(
  rawBody: string,
  signatureHeader: string,
  secret: string,
): boolean {
  try {
    const parts = Object.fromEntries(
      signatureHeader.split(";").map((part) => {
        const idx = part.indexOf("=");
        return idx === -1 ? [part, ""] : [part.slice(0, idx), part.slice(idx + 1)];
      }),
    );
    const ts = parts["ts"] as string | undefined;
    const h1 = parts["h1"] as string | undefined;
    if (!ts || !h1) return false;
    const signed = `${ts}:${rawBody}`;
    const expected = crypto
      .createHmac("sha256", secret)
      .update(signed)
      .digest("hex");
    return crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(h1, "hex"),
    );
  } catch {
    return false;
  }
}

// ── Env config guard ─────────────────────────────────────────────────────

function requireWebhookSecret(): string {
  if (!PADDLE_WEBHOOK_SECRET) {
    console.error(
      "[paddle-webhook] ❌ PADDLE_WEBHOOK_SECRET is not configured. " +
        "Credits will NOT be granted. Fix: add PADDLE_WEBHOOK_SECRET to .env.production " +
        "or set as Firebase SSR env var (Cloud Functions → ssrsectorcalcbf412 → Edit). " +
        "Get the secret from Paddle Dashboard → Developer Tools → Notifications → Webhook settings."
    );
    throw new Error("PADDLE_WEBHOOK_SECRET is not configured");
  }
  return PADDLE_WEBHOOK_SECRET;
}

// ── Atomic fulfillment — triple-ledger transaction ────────────────────────

interface FulfillmentParams {
  userId: string;
  credits: number;
  planId: string;
  transactionId: string;
  eventId: string;
  eventType: string;
  intent: string;
  productKey: string;
  purchaseType: string;
  barisKeyQuantity?: number;
  paddleCustomerId?: string;
  resolvedEmail?: string;
}

/**
 * Atomically process a webhook event inside a single Firestore transaction.
 *
 * Triple-ledger idempotency:
 *   1. paddle_processed_events/{eventId} — event-level dedup
 *   2. credit_ledger/{transactionId} — transaction-level dedup
 *   3. All writes (user credits + customer mapping + ledgers) commit together
 */
async function fulfillAtomically(
  params: FulfillmentParams,
): Promise<{ fulfilled: boolean; reason?: string }> {
  const db = getAdminFirestore();
  if (!db) {
    return { fulfilled: false, reason: "Firestore unavailable" };
  }

  const {
    userId,
    credits,
    planId,
    transactionId,
    eventId,
    eventType,
    intent,
    productKey,
    purchaseType,
    paddleCustomerId,
  } = params;

  const eventRef = db.collection(EVENTS_COLLECTION).doc(eventId);
  const creditLedgerRef = db.collection(CREDIT_LEDGER_COLLECTION).doc(transactionId);
  const userRef = db.collection(USERS_COLLECTION).doc(userId);
  const billingEventRef = userRef.collection("billing_events").doc(eventId);

  try {
    await db.runTransaction(async (txn) => {
      // 1. Check event-level idempotency (paddle_processed_events)
      const eventSnap = await txn.get(eventRef);
      if (eventSnap.exists) {
        throw new IdempotencySkip();
      }

      // 2. Check transaction-level idempotency (credit_ledger)
      //    Same transactionId must not be credited twice even across events
      if (credits > 0 || (params.barisKeyQuantity || 0) > 0) {
        const ledgerSnap = await txn.get(creditLedgerRef);
        if (ledgerSnap.exists) {
          throw new IdempotencySkip();
        }
      }

      // 3. Create event ledger entry
      txn.create(eventRef, {
        eventId,
        transactionId,
        intent,
        productKey,
        purchaseType,
        userId,
        credits,
        planId: planId || "",
        eventType,
        provider: "paddle",
        status: "completed",
        processedAt: new Date().toISOString(),
      });

      // 4. Create credit ledger entry (if credit/baris transaction)
      if (credits > 0 || (params.barisKeyQuantity || 0) > 0) {
        txn.set(creditLedgerRef, {
          transactionId,
          eventId,
          userId,
          credits,
          intent,
          productKey,
          purchaseType,
          provider: "paddle",
          status: "completed",
          processedAt: new Date().toISOString(),
        });
      }

      // 5. Update user credits balance (canonical path: users/{userId}/credits/balance.amount)
      //    Must match the path read by useCredits, credits-manager, CBAM entitlement service,
      //    tool-usage-session, creditPersistence Cloud Function, and GET /api/user/credits.
      if (credits > 0) {
        const creditBalanceRef = userRef.collection(CREDIT_BALANCE_COLLECTION).doc(CREDIT_BALANCE_DOC);
        txn.set(
          creditBalanceRef,
          {
            amount: adminIncrement(credits),
            updatedAt: new Date().toISOString(),
          },
          { merge: true },
        );
        txn.set(
          userRef,
          {
            lastPaddleTransactionId: transactionId,
            lastPaddleEventId: eventId,
            updatedAt: new Date().toISOString(),
          },
          { merge: true },
        );
      }

      // 5b. Record in creditTransactions collection for API audit trail
      //     (read by GET /api/user/credits for totalPurchased/usedThisMonth)
      if (credits > 0) {
        const creditTxnRef = db.collection(CREDIT_TRANSACTIONS_COLLECTION).doc();
        txn.create(creditTxnRef, {
          userId,
          type: "purchase",
          credits,
          paddleTransactionId: transactionId,
          paddleEventId: eventId,
          timestamp: new Date().toISOString(),
        });
      }

      // 6. Update subscription/entitlement if plan unlock
      if (planId && intent !== "SECTORCALC_CREDIT_PACK_PURCHASE") {
        txn.set(
          userRef,
          {
            paddleSubscription: {
              planId,
              transactionId,
              status: "active",
              intent,
              productKey,
              updatedAt: new Date().toISOString(),
            },
            updatedAt: new Date().toISOString(),
          },
          { merge: true },
        );
      }

      // 7. Baris PRO key pack purchase — credit keys
      if (intent === "BARIS_PRO_PURCHASE" && (params.barisKeyQuantity || 0) > 0) {
        txn.set(
          userRef,
          {
            barisProKeys: adminIncrement(params.barisKeyQuantity!),
            lastPaddleTransactionId: transactionId,
            lastPaddleEventId: eventId,
            updatedAt: new Date().toISOString(),
          },
          { merge: true },
        );
      }

      // 8. Create/update paddle_customers mapping (if we have paddleCustomerId)
      if (paddleCustomerId) {
        const customerRef = db.collection(CUSTOMERS_COLLECTION).doc(paddleCustomerId);
        txn.set(
          customerRef,
          {
            uid: userId,
            email: "", // filled by caller if available
            lastSeenAt: new Date().toISOString(),
            lastTransactionId: transactionId,
          },
          { merge: true },
        );
      }

      // 9. Write billing event record
      txn.create(billingEventRef, {
        eventId,
        transactionId,
        eventType,
        intent,
        productKey,
        purchaseType,
        credits: credits || 0,
        planId: planId || "",
        provider: "paddle",
        userId,
        processedAt: new Date().toISOString(),
      });
    });

    return { fulfilled: true };
  } catch (err) {
    if (err instanceof IdempotencySkip) {
      return { fulfilled: false, reason: "duplicate" };
    }
    console.error(
      `[paddle-webhook] Transaction failed:`,
      err instanceof Error ? err.message : String(err),
    );
    return { fulfilled: false, reason: "transaction_failed" };
  }
}

class IdempotencySkip extends Error {
  constructor() {
    super("IdempotencySkip");
    this.name = "IdempotencySkip";
  }
}

function adminIncrement(n: number) {
  return FieldValue.increment(n);
}

// ── Safe userId resolver ─────────────────────────────────────────────────

/** Priority-ordered userId resolution. Never returns a Paddle ctm_* ID. */
async function resolveUserId(
  customDataUserId: string,
  paddleCustomerId: string,
  paddleCustomerEmail: string,
): Promise<string | null> {
  const db = getAdminFirestore();
  if (!db) return null;

  // Priority 1: customData.userId — must be a real UID (not ctm_)
  if (
    customDataUserId &&
    customDataUserId.length >= 12 &&
    !customDataUserId.startsWith("ctm_")
  ) {
    return customDataUserId;
  }

  // Priority 2: paddle_customers/{customerId} mapping
  if (paddleCustomerId && !paddleCustomerId.startsWith("ctm_")) {
    // Only proceed if paddleCustomerId itself looks like a usable ID
    const mappingSnap = await db.collection(CUSTOMERS_COLLECTION).doc(paddleCustomerId).get();
    if (mappingSnap.exists) {
      const uid = mappingSnap.data()?.uid;
      if (typeof uid === "string" && uid.length >= 12) {
        return uid;
      }
    }
  }

  // Priority 3: Email-based lookup from paddle_customers collection
  // (paddleCustomerId is ctm_xxx, use mapping if exists)
  if (paddleCustomerId && paddleCustomerId.startsWith("ctm_")) {
    const mappingSnap = await db.collection(CUSTOMERS_COLLECTION).doc(paddleCustomerId).get();
    if (mappingSnap.exists) {
      const uid = mappingSnap.data()?.uid;
      if (typeof uid === "string" && uid.length >= 12) {
        return uid;
      }
    }
  }

  // Priority 4: Email lookup — only if single exact match
  if (paddleCustomerEmail) {
    const emailNorm = paddleCustomerEmail.trim().toLowerCase();
    const userQuery = await db
      .collection(USERS_COLLECTION)
      .where("email", "==", emailNorm)
      .limit(2)
      .get();

    if (!userQuery.empty && userQuery.docs.length === 1) {
      const uid = userQuery.docs[0].id;

      // Create mapping for future lookups
      if (paddleCustomerId) {
        try {
          await db
            .collection(CUSTOMERS_COLLECTION)
            .doc(paddleCustomerId)
            .set({ uid, email: emailNorm, firstSeenAt: new Date().toISOString() }, { merge: true });
        } catch {
          // Non-critical
        }
      }

      return uid;
    }
  }

  // No safe match found — do NOT use ctm_* as UID
  return null;
}

// ── Handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signatureHeader = req.headers.get("paddle-signature") ?? "";

  let webhookSecret: string;
  try {
    webhookSecret = requireWebhookSecret();
  } catch {
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 503 },
    );
  }

  if (!signatureHeader) {
    return NextResponse.json(
      { error: "Missing signature header" },
      { status: 401 },
    );
  }

  if (!verifyPaddleSignature(rawBody, signatureHeader, webhookSecret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // ── Parse event ────────────────────────────────────────────────────
  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = String(event.event_type ?? "");
  const eventId = String(event.event_id ?? "");
  const txn = event.data as Record<string, unknown> | undefined;

  if (eventType !== "transaction.completed" && eventType !== "transaction.paid") {
    return NextResponse.json({ received: true, event: eventType });
  }

  if (!txn) {
    return NextResponse.json({ error: "Missing transaction data" }, { status: 400 });
  }

  const transactionId = String(txn.id ?? "");
  const status = String(txn.status ?? "");

  if (status !== "completed" && status !== "paid") {
    return NextResponse.json({ received: true, event: eventType, status });
  }

  // ── Extract customData ─────────────────────────────────────────────
  const customDataRaw = txn.custom_data as Record<string, unknown> | undefined;

  let intent = "";
  let productKey = "";
  let purchaseType = "unknown";
  let credits = 0;
  let planId = "";
  let customDataUserId = "";
  let customDataEmail = "";
  let barisKeyQuantity = 0;

  // Try canonical format first
  if (customDataRaw && customDataRaw.intent) {
    try {
      const validated = validateCustomData(customDataRaw);
      intent = validated.intent;
      productKey = validated.productKey;
      purchaseType = validated.purchaseType;
      credits = validated.credits ?? 0;
      planId = validated.planId ?? "";
      customDataUserId = validated.userId ?? "";
      customDataEmail = validated.email ?? "";
    } catch {
      // Falls through to legacy parsing
    }
  }

  // Check for baris_pro_purchase source
  if (
    customDataRaw &&
    String(customDataRaw.source ?? "") === "baris_pro_purchase"
  ) {
    intent = "BARIS_PRO_PURCHASE";
    barisKeyQuantity = Math.max(1, parseInt(String(customDataRaw.quantity ?? "1"), 10) || 1);
    purchaseType = "baris_pro_purchase";
    customDataUserId = String(customDataRaw.userId ?? "");
  }

  // Fall back to legacy
  if (!intent) {
    const legacy = parseLegacyCustomData(customDataRaw);
    if (legacy) {
      credits = legacy.credits;
      planId = legacy.planId;
      customDataUserId = legacy.userId;
      intent = credits > 0 ? "SECTORCALC_CREDIT_PACK_PURCHASE" : "";
      productKey = credits > 0 ? "credit_pack_15" : "";
      purchaseType = credits > 0 ? "credit_pack" : "subscription";
    }
  }

  // Extract Paddle customer info
  const customer = txn.customer as Record<string, unknown> | undefined;
  const paddleCustomerId = customer?.id ? String(customer.id) : "";
  const paddleCustomerEmail =
    typeof customer?.email === "string" ? String(customer.email).trim().toLowerCase() : "";
  // Fallback: if Paddle customer API returned no email, try customData.email (set by PricingPageContent)
  const resolvedEmail = paddleCustomerEmail || customDataEmail;

  // ── Safe userId resolution (NEVER use ctm_* as Firebase UID) ─────
  const userId = await resolveUserId(customDataUserId, paddleCustomerId, resolvedEmail);

  if (!userId) {
    console.warn(
      `[paddle-webhook] ⚠ Cannot resolve userId for event ${eventId} (paddleCustomerId=${paddleCustomerId}) — queueing for manual review`,
    );

    // Write to manual_review queue instead of dropping
    if (paddleCustomerId) {
      try {
        const db = getAdminFirestore();
        if (db) {
          await db.collection(MANUAL_REVIEW_COLLECTION).doc(eventId).set({
            eventId,
            transactionId,
            paddleCustomerId,
            paddleCustomerEmail,
            intent,
            credits,
            planId,
            eventType,
            receivedAt: new Date().toISOString(),
            status: "pending_review",
          });
        }
      } catch {
        // Best-effort
      }
    }

    return NextResponse.json({ received: true, warning: "no_user_resolved" });
  }

  // ── No fulfillment without actionable intent ──────────────────────
  if (!intent && !credits && !planId) {
    console.warn(
      `[paddle-webhook] ⚠ No actionable intent for event ${eventId}`,
    );
    return NextResponse.json({ received: true, warning: "no_actionable_data" });
  }

  // ── Atomic fulfillment (triple-ledger) ────────────────────────────
  const result = await fulfillAtomically({
    userId,
    credits,
    planId,
    transactionId,
    eventId,
    eventType,
    intent,
    productKey,
    purchaseType,
    barisKeyQuantity: barisKeyQuantity || undefined,
    paddleCustomerId: paddleCustomerId || undefined,
  });

  if (!result.fulfilled && result.reason === "duplicate") {
    console.log(
      `[paddle-webhook] ⏭ Duplicate event ${eventId} — triple-ledger dedup`,
    );
    return NextResponse.json({ received: true, deduplicated: true });
  }

  if (!result.fulfilled) {
    console.error(
      `[paddle-webhook] ❌ Fulfillment failed for event ${eventId}: ${result.reason}`,
    );
    return NextResponse.json({ error: "Fulfillment failed" }, { status: 500 });
  }

  console.log(
    `[paddle-webhook] ✅ Processed ${purchaseType} event ${eventId} for user ${userId}`,
  );

  return NextResponse.json({ received: true });
}
