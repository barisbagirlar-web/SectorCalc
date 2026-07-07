/**
 * SectorCalc Paddle Webhook — canonical handler.
 * Route: POST /api/paddle-webhook
 *
 * Verification:    Manual HMAC (raw-body, no SDK dependency).
 * Fulfillment:     Atomic Firestore transaction — idempotency check, credit
 *                  increment, and purchase record are committed in a single
 *                  transaction, making duplicate concurrent retries safe.
 *
 * Legacy support:
 *   - customData.credits / .planId (from CreditWall client-side Paddle.js)
 *   - customData.userId (from old CheckoutButton)
 *
 * The webhook at /api/webhooks/paddle does NOT exist — no duplicate processing.
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
const IDEMPOTENCY_COLLECTION = "webhook_idempotency";

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
    throw new Error("PADDLE_WEBHOOK_SECRET is not configured");
  }
  return PADDLE_WEBHOOK_SECRET;
}

// ── Atomic fulfillment — single Firestore transaction ─────────────────────

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
}

/**
 * Atomically process a webhook event inside a Firestore transaction.
 *
 * Steps inside the same transaction:
 * 1. Read webhook_idempotency/{eventId}
 * 2. If exists → return { skipped: true } (deduplicate)
 * 3. If not exists → create idempotency doc, update user credits/entitlement,
 *    write purchase/billing event record
 * 4. Commit — all or nothing
 *
 * This eliminates the race between check-before-fulfill and fulfill-mark.
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
  } = params;

  const idempotencyRef = db
    .collection(IDEMPOTENCY_COLLECTION)
    .doc(eventId);
  const userRef = db.collection(USERS_COLLECTION).doc(userId);
  const billingEventRef = userRef
    .collection("billing_events")
    .doc(eventId);

  try {
    await db.runTransaction(async (txn) => {
      // 1. Check idempotency INSIDE the transaction
      const idempotencySnap = await txn.get(idempotencyRef);
      if (idempotencySnap.exists) {
        // Already processed — skip silently (txn will abort harmlessly)
        // We return via exception to abort the transaction
        throw new IdempotencySkip();
      }

      // 2. Create idempotency document
      txn.create(idempotencyRef, {
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

      // 3. Update user credits (FieldValue.increment works in transactions
      //    as a server-side sentinel that resolves on commit)
      if (credits > 0) {
        txn.set(
          userRef,
          {
            credits: adminIncrement(credits),
            lastPaddleTransactionId: transactionId,
            lastPaddleEventId: eventId,
            updatedAt: new Date().toISOString(),
          },
          { merge: true },
        );
      }

      // 4. Update subscription/entitlement if plan unlock
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

      // 4b. Baris PRO key pack purchase — credit keys to user's key pool
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

      // 5. Write billing event record
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

      // If we reach here, the transaction will commit with all writes
    });

    return { fulfilled: true };
  } catch (err) {
    if (err instanceof IdempotencySkip) {
      return { fulfilled: false, reason: "duplicate" };
    }
    // Real error
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

// ── Handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // ── Require POST ────────────────────────────────────────────────────
  // (Next.js App Router already routes POST here, but the guard is explicit)

  // ── Raw body verification ───────────────────────────────────────────
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

  // ── Parse event ─────────────────────────────────────────────────────
  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = String(event.event_type ?? "");
  const eventId = String(event.event_id ?? "");
  const txn = event.data as Record<string, unknown> | undefined;

  // ── Only process completed/paid transaction events ──────────────────
  if (eventType !== "transaction.completed" && eventType !== "transaction.paid") {
    return NextResponse.json({ received: true, event: eventType });
  }

  if (!txn) {
    return NextResponse.json(
      { error: "Missing transaction data" },
      { status: 400 },
    );
  }

  const transactionId = String(txn.id ?? "");
  const status = String(txn.status ?? "");

  if (status !== "completed" && status !== "paid") {
    return NextResponse.json({ received: true, event: eventType, status });
  }

  // ── Extract and validate customData ─────────────────────────────────
  const customDataRaw = txn.custom_data as Record<string, unknown> | undefined;

  let intent = "";
  let productKey = "";
  let purchaseType = "unknown";
  let credits = 0;
  let planId = "";
  let userId = "";
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
      userId = validated.userId ?? "";
    } catch {
      // Falls through to legacy parsing
    }
  }

  // Check for baris_pro_purchase source (key-pack transaction)
  if (
    customDataRaw &&
    String(customDataRaw.source ?? "") === "baris_pro_purchase"
  ) {
    intent = "BARIS_PRO_PURCHASE";
    barisKeyQuantity = Math.max(1, parseInt(String(customDataRaw.quantity ?? "1"), 10) || 1);
    purchaseType = "baris_pro_purchase";
    userId = String(customDataRaw.userId ?? "");
  }

  // Fall back to legacy if canonical parsing failed or missing
  if (!intent) {
    const legacy = parseLegacyCustomData(customDataRaw);
    if (legacy) {
      credits = legacy.credits;
      planId = legacy.planId;
      userId = legacy.userId;
      intent = credits > 0 ? "SECTORCALC_CREDIT_PACK_PURCHASE" : "";
      productKey = credits > 0 ? "credit_pack_15" : ""; // best guess for legacy
      purchaseType = credits > 0 ? "credit_pack" : "subscription";
    }
  }

  // Attempt to extract userId from Paddle customer data as last resort
  if (!userId) {
    const customer = txn.customer as Record<string, unknown> | undefined;
    if (customer?.id) {
      userId = String(customer.id);
    }
  }

  // ── No fulfillment without a user reference ─────────────────────────
  if (!userId) {
    console.warn(
      `[paddle-webhook] ⚠ No userId for event ${eventId} — not fulfilling`,
    );
    return NextResponse.json({ received: true, warning: "no_user" });
  }

  // ── No fulfillment without an actionable intent ─────────────────────
  if (!intent && !credits && !planId) {
    console.warn(
      `[paddle-webhook] ⚠ No actionable intent/credits/planId for event ${eventId} — not fulfilling`,
    );
    return NextResponse.json({ received: true, warning: "no_actionable_data" });
  }

  // Extract Paddle customer ID for entitlement
  const customer = txn.customer as Record<string, unknown> | undefined;
  const paddleCustomerId = customer?.id ? String(customer.id) : "";

  // ── Atomic fulfillment ──────────────────────────────────────────────
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
      `[paddle-webhook] ⏭ Duplicate event ${eventId} — atomic dedup inside transaction`,
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
