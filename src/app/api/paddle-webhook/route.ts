/**
 * SectorCalc Paddle Webhook — canonical handler.
 * Route: POST /api/paddle-webhook
 *
 * Verification: manual HMAC (no SDK dependency for critical path).
 * Fulfillment: credit packs via Firestore + idempotency-by-event-ID.
 * Legacy customData fields (credits, planId) preserved.
 * New customData contract (intent, productKey) supported.
 *
 * No duplicate webhook route exists at /api/webhooks/paddle.
 * Stripe webhook in Cloud Functions is unaffected.
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import {
  validateCustomData,
  type PaddleCustomData,
} from "@/lib/payments/paddle-custom-data";
import { resolveCreditAmount } from "@/lib/payments/paddle-price-lookup.server";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET ?? "";
const USERS_COLLECTION = "users";
const IDEMPOTENCY_COLLECTION = "webhook_idempotency";

// ── Verification ────────────────────────────────────────────────────────

function verifyPaddleSignature(
  rawBody: string,
  signatureHeader: string,
  secret: string,
): boolean {
  try {
    const parts = Object.fromEntries(
      signatureHeader.split(";").map((p) => p.split("=")),
    );
    const ts = parts["ts"];
    const h1 = parts["h1"];
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

// ── Idempotency ─────────────────────────────────────────────────────────

async function isAlreadyProcessed(eventId: string): Promise<boolean> {
  try {
    const db = getAdminFirestore();
    if (!db) return false; // No DB — proceed but log
    const ref = db.collection(IDEMPOTENCY_COLLECTION).doc(eventId);
    const snap = await ref.get();
    return snap.exists;
  } catch {
    return false;
  }
}

async function markProcessed(
  eventId: string,
  metadata: Record<string, string>,
): Promise<void> {
  try {
    const db = getAdminFirestore();
    if (!db) return;
    await db
      .collection(IDEMPOTENCY_COLLECTION)
      .doc(eventId)
      .set(
        {
          processedAt: new Date().toISOString(),
          ...metadata,
        },
        { merge: true },
      );
  } catch (err) {
    console.error("[paddle-webhook] Failed to write idempotency record:", err);
  }
}

// ── Credit Fulfillment ──────────────────────────────────────────────────

async function addUserCredits(
  userId: string,
  credits: number,
  metadata: { transactionId: string; eventId: string },
): Promise<void> {
  const db = getAdminFirestore();
  if (!db) {
    console.log(
      `[paddle-webhook] ❌ No Firestore — cannot fulfill ${credits} credits for user ${userId}`,
    );
    return;
  }

  // Use atomic increment on user document
  const userRef = db.collection(USERS_COLLECTION).doc(userId);
  await userRef.set(
    {
      credits: adminIncrement(credits),
      paddleTransactionId: metadata.transactionId,
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );

  // Write purchase record
  await userRef
    .collection("purchases")
    .doc(metadata.transactionId)
    .set(
      {
        source: "paddle",
        eventId: metadata.eventId,
        transactionId: metadata.transactionId,
        credits,
        createdAt: new Date().toISOString(),
      },
      { merge: true },
    );

  console.log(
    `[paddle-webhook] ✅ ${credits} credits → user ${userId} (tx: ${metadata.transactionId})`,
  );
}

function adminIncrement(n: number) {
  return FieldValue.increment(n);
}

// ── Subscription / Plan Fulfillment ─────────────────────────────────────

async function fulfillSubscription(
  userId: string,
  planId: string,
  metadata: { transactionId: string },
): Promise<void> {
  const db = getAdminFirestore();
  if (!db) {
    console.log(
      `[paddle-webhook] ❌ No Firestore — cannot fulfill subscription for user ${userId}`,
    );
    return;
  }

  const userRef = db.collection(USERS_COLLECTION).doc(userId);
  await userRef.set(
    {
      paddleSubscription: {
        planId,
        transactionId: metadata.transactionId,
        status: "active",
        updatedAt: new Date().toISOString(),
      },
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );

  console.log(
    `[paddle-webhook] ✅ Subscription ${planId} activated for user ${userId} (tx: ${metadata.transactionId})`,
  );
}

// ── Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signatureHeader = req.headers.get("paddle-signature") ?? "";

  if (
    !verifyPaddleSignature(rawBody, signatureHeader, PADDLE_WEBHOOK_SECRET)
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

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
    // Acknowledge unknown events safely without processing
    return NextResponse.json({ received: true, event: eventType });
  }

  if (!txn) {
    console.error("[paddle-webhook] Missing transaction data in event", eventId);
    return NextResponse.json({ error: "Missing transaction data" }, { status: 400 });
  }

  const transactionId = String(txn.id ?? "");
  const status = String(txn.status ?? "");
  const customDataRaw = txn.custom_data as Record<string, unknown> | undefined;

  // Only fulfill completed/paid transactions
  if (status !== "completed" && status !== "paid") {
    return NextResponse.json({ received: true, event: eventType, status });
  }

  // ── Idempotency check ────────────────────────────────────────────────
  if (await isAlreadyProcessed(eventId)) {
    console.log(
      `[paddle-webhook] ⏭ Duplicate event ${eventId} — skipping fulfillment`,
    );
    return NextResponse.json({ received: true, deduplicated: true });
  }

  try {
    // ── Parse customData ──────────────────────────────────────────────
    // Try new contract first, fall back to legacy fields

    let customData: PaddleCustomData | null = null;
    let credits = 0;
    let planId = "";
    let userId = "";

    try {
      if (customDataRaw && customDataRaw.intent) {
        customData = validateCustomData(customDataRaw);
        credits = customData.credits ?? resolveCreditAmount(customData.productKey);
        planId = customData.planId ?? "";
        userId = customData.userId ?? "";
      }
    } catch {
      // Not a valid new-format customData — try legacy
    }

    if (!customData) {
      // Legacy customData format (from CreditWall / old CheckoutButton)
      credits = Number(customDataRaw?.credits ?? 0);
      planId = String(customDataRaw?.planId ?? "");
      userId = String(customDataRaw?.userId ?? "");
    }

    // Also attempt to extract userId from Paddle customer if not in customData
    if (!userId) {
      const customer = txn.customer as Record<string, unknown> | undefined;
      if (customer?.id) {
        userId = String(customer.id);
      }
    }

    // ── Fulfillment branching ──────────────────────────────────────────

    if (credits > 0 && userId) {
      // Credit pack fulfillment
      await addUserCredits(userId, credits, {
        transactionId,
        eventId,
      });
    } else if (planId && userId) {
      // Plan / subscription fulfillment
      await fulfillSubscription(userId, planId, {
        transactionId,
      });
    } else if (!userId) {
      console.warn(
        `[paddle-webhook] ⚠ No userId found for event ${eventId}`,
      );
    }

    // ── Record idempotency ─────────────────────────────────────────────
    await markProcessed(eventId, {
      transactionId,
      eventType,
      credits: String(credits),
      planId,
      userId,
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[paddle-webhook] Fulfillment failed:", err);
    return NextResponse.json(
      { error: "Fulfillment failed" },
      { status: 500 },
    );
  }
}
