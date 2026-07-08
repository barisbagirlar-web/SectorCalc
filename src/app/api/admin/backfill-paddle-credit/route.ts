/**
 * SectorCalc — Admin Paddle Credit Backfill Endpoint
 * POST /api/admin/backfill-paddle-credit
 *
 * One-shot credit migration for Paddle transactions that were processed by
 * the old buggy webhook (which wrote credits to users/{uid}.credits field
 * instead of users/{uid}/credits/balance.amount subcollection).
 *
 * Auth: Firebase ID token with admin claim or barisbagirlar@gmail.com email.
 * Idempotent: uses credit_ledger (repair- prefixed) to prevent double-grant.
 *
 * Usage:
 *   curl -X POST https://sectorcalc.com/api/admin/backfill-paddle-credit \
 *     -H "Authorization: Bearer <FIREBASE_ID_TOKEN>" \
 *     -H "Content-Type: application/json" \
 *     -d '{
 *       "email": "teb232@gmail.com",
 *       "transactionId": "txn_xxx",
 *       "priceId": "pri_xxx",
 *       "credits": 100,
 *       "environment": "sandbox"
 *     }'
 */

import { type NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getAdminFirestore, getFirebaseAdminApp } from "@/lib/infrastructure/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Admin auth guard ─────────────────────────────────────────────────────

async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1]?.trim();
  if (!token) return null;
  const app = getFirebaseAdminApp();
  if (!app) return null;
  try {
    const decoded = await getAuth(app).verifyIdToken(token);
    if (decoded.email === "barisbagirlar@gmail.com" || decoded.admin === true) {
      return decoded;
    }
    return null;
  } catch {
    return null;
  }
}

// ── POST — Backfill credits ──────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const adminUser = await verifyAdmin(request);
  if (!adminUser) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const db = getAdminFirestore();
  if (!db) {
    return NextResponse.json({ ok: false, error: "firestore_unavailable" }, { status: 500 });
  }

  // ── Parse body ──────────────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const transactionId = String(body.transactionId ?? "").trim();
  const priceId = String(body.priceId ?? "").trim();
  const creditsRaw = Number(body.credits ?? 0);
  const environment = String(body.environment ?? "sandbox").trim();
  const dryRun = body.dryRun === true;

  if (!email) {
    return NextResponse.json({ ok: false, error: "email is required" }, { status: 400 });
  }
  if (!Number.isFinite(creditsRaw) || creditsRaw <= 0) {
    return NextResponse.json({ ok: false, error: "credits must be a positive number" }, { status: 400 });
  }

  // ── Resolve user by email ───────────────────────────────────────────────
  const usersQuery = await db
    .collection("users")
    .where("email", "==", email)
    .limit(2)
    .get();

  if (usersQuery.empty) {
    return NextResponse.json({ ok: false, error: `No user found with email: ${email}` }, { status: 404 });
  }
  if (usersQuery.docs.length > 1) {
    return NextResponse.json({ ok: false, error: `Multiple users (${usersQuery.docs.length}) found: ${email}` }, { status: 409 });
  }

  const userDoc = usersQuery.docs[0];
  const userId = userDoc.id;

  // ── Read current state ──────────────────────────────────────────────────
  const userData = userDoc.data();
  const oldPathCredits = typeof userData.credits === "number" ? userData.credits : 0;

  const balanceRef = db.collection("users").doc(userId).collection("credits").doc("balance");
  const balanceSnap = await balanceRef.get();
  const newPathCredits = balanceSnap.exists && typeof balanceSnap.data()?.amount === "number"
    ? balanceSnap.data()!.amount
    : 0;

  // ── Check idempotency ───────────────────────────────────────────────────
  const idempotencyKey = `repair-${transactionId || "manual-${Date.now()}"}`;
  const idempotencyRef = db.collection("credit_ledger").doc(idempotencyKey);
  const idempotencySnap = await idempotencyRef.get();
  const alreadyProcessed = idempotencySnap.exists;

  // ── Prepare response data ───────────────────────────────────────────────
  const diagnosis = {
    email,
    userId,
    oldPathCredits,
    newPathCredits,
    creditsToAdd: creditsRaw,
    newBalanceAfter: newPathCredits + creditsRaw,
    idempotencyKey,
    alreadyProcessed,
    environment,
    dryRun,
  };

  if (dryRun || alreadyProcessed) {
    return NextResponse.json({
      ok: true,
      message: alreadyProcessed
        ? "Idempotency key already exists — credits already migrated"
        : "Dry run — no changes written. Re-submit without dryRun to execute.",
      diagnosis,
    });
  }

  // ── Execute migration inside Firestore transaction ──────────────────────
  try {
    await db.runTransaction(async (tx) => {
      // 1. Verify idempotency inside transaction
      const txnIdempotencySnap = await tx.get(idempotencyRef);
      if (txnIdempotencySnap.exists) {
        throw new Error("idempotency_conflict");
      }

      // 2. Update credits balance (correct path)
      tx.set(
        balanceRef,
        {
          amount: FieldValue.increment(creditsRaw),
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );

      // 3. Write credit_ledger entry (repair-specific key)
      tx.set(idempotencyRef, {
        transactionId: transactionId || idempotencyKey,
        eventId: idempotencyKey,
        userId,
        credits: creditsRaw,
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
        credits: creditsRaw,
        paddleTransactionId: transactionId || idempotencyKey,
        paddleEventId: idempotencyKey,
        paddlePriceId: priceId || "",
        timestamp: new Date().toISOString(),
        source: "admin_backfill",
      });

      // 5. Write paddle_processed_events
      const eventRef = db.collection("paddle_processed_events").doc(idempotencyKey);
      tx.set(
        eventRef,
        {
          eventId: idempotencyKey,
          transactionId: transactionId || idempotencyKey,
          intent: "SECTORCALC_CREDIT_PACK_PURCHASE",
          productKey: priceId ? `price_${priceId}` : "repair_migration",
          purchaseType: "credit_pack",
          userId,
          credits: creditsRaw,
          planId: "",
          eventType: "transaction.completed",
          provider: "paddle_repair",
          status: "completed",
          processedAt: new Date().toISOString(),
        },
        { merge: true },
      );
    });

    // ── Verify after migration ─────────────────────────────────────────────
    const verifySnap = await balanceRef.get();
    const finalBalance = verifySnap.exists && typeof verifySnap.data()?.amount === "number"
      ? verifySnap.data()!.amount
      : 0;

    return NextResponse.json({
      ok: true,
      message: "Credits migrated successfully",
      diagnosis: {
        ...diagnosis,
        newBalanceAfter: finalBalance,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Migration failed";
    if (message === "idempotency_conflict") {
      return NextResponse.json({
        ok: true,
        message: "Idempotency conflict inside transaction — credits already migrated",
        diagnosis,
      });
    }
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
