// SectorCalc Pro Credit Session Ledger
// Server-side only. All credit/session changes are atomic.
//
// Data model:
// - users/{userId}/credits/summary
// - users/{userId}/tool_usage_sessions/{sessionId}
// - users/{userId}/tool_execution_logs/{executionId}
// - creditTransactions (top-level collection for audit)
//
// Rules:
// - 1 credit creates 1 active Pro session for exactly 1 toolKey
// - 1 session allows 10 executions on the same toolKey
// - session cannot be used for another tool
// - session cannot exceed 10 executions
// - execution decrement must be atomic
// - Free tools never create or consume sessions

import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { createExecutionIdempotencyKey } from "./tool-execution-idempotency.server";

const PRO_SESSION_COST = 1;
const PRO_SESSION_MAX_RUNS = 3;

export type UsageSessionStatus = "ACTIVE" | "EXHAUSTED" | "CANCELLED";

export interface UsageSession {
  sessionId: string;
  userId: string;
  toolKey: string;
  accessTier: "PRO";
  creditCost: number;
  maxRuns: number;
  remainingRuns: number;
  usedRuns: number;
  status: UsageSessionStatus;
  createdAt: string;
  exhaustedAt: string | null;
  createdFromCreditTransactionId: string | null;
}

export interface CreditBalance {
  available: number;
  totalPurchased: number;
  usedThisMonth: number;
}

// ── Session Management ────────────────────────────────────────────

/**
 * Check if a user has sufficient credit balance.
 */
export async function checkUserCreditBalance(userId: string, required: number): Promise<boolean> {
  const db = getAdminFirestore();
  if (!db) return false;

  const balanceRef = db.collection("users").doc(userId).collection("credits").doc("balance");
  const snap = await balanceRef.get();
  const amount = snap.exists && typeof snap.data()?.amount === "number"
    ? Math.floor(snap.data()!.amount)
    : 0;
  return amount >= required;
}

/**
 * Decrement user credit balance by the given amount.
 */
export async function decrementCredits(userId: string, amount: number): Promise<boolean> {
  const db = getAdminFirestore();
  if (!db) return false;

  const balanceRef = db.collection("users").doc(userId).collection("credits").doc("balance");

  // Atomic decrement (Firestore increment)
  await db.runTransaction(async (transaction) => {
    const snap = await transaction.get(balanceRef);
    const current = snap.exists && typeof snap.data()?.amount === "number"
      ? snap.data()!.amount
      : 0;
    if (current < amount) {
      throw new Error("INSUFFICIENT_CREDITS");
    }
    transaction.update(balanceRef, { amount: current - amount });
  });

  return true;
}

/**
 * Create a Pro usage session for a tool.
 * Atomic transaction:
 * 1. Check user credit balance >= 1
 * 2. Decrement credits by 1
 * 3. Create usage session with remainingRuns 10
 * 4. Write credit ledger event
 */
export async function createProSession(
  userId: string,
  toolKey: string,
): Promise<{ ok: true; session: UsageSession } | { ok: false; reason: string }> {
  const db = getAdminFirestore();
  if (!db) {
    return { ok: false, reason: "DATABASE_UNAVAILABLE" };
  }

  try {
    // Check balance
    const hasCredits = await checkUserCreditBalance(userId, PRO_SESSION_COST);
    if (!hasCredits) {
      return { ok: false, reason: "INSUFFICIENT_CREDITS" };
    }

    const sessionId = db.collection("_").doc().id; // Generate unique ID
    const now = new Date().toISOString();
    const creditTxId = db.collection("_").doc().id;

    // Run atomic transaction
    await db.runTransaction(async (transaction) => {
      // Verify balance again inside transaction
      const balanceRef = db.collection("users").doc(userId).collection("credits").doc("balance");
      const balanceSnap = await transaction.get(balanceRef);
      const current = balanceSnap.exists && typeof balanceSnap.data()?.amount === "number"
        ? balanceSnap.data()!.amount
        : 0;

      if (current < PRO_SESSION_COST) {
        throw new Error("INSUFFICIENT_CREDITS");
      }

      // Decrement credits
      transaction.update(balanceRef, {
        amount: current - PRO_SESSION_COST,
        updatedAt: now,
      });

      // Create usage session
      const sessionRef = db
        .collection("users")
        .doc(userId)
        .collection("tool_usage_sessions")
        .doc(sessionId);

      transaction.set(sessionRef, {
        sessionId,
        userId,
        toolKey,
        accessTier: "PRO",
        creditCost: PRO_SESSION_COST,
        maxRuns: PRO_SESSION_MAX_RUNS,
        remainingRuns: PRO_SESSION_MAX_RUNS,
        usedRuns: 0,
        status: "ACTIVE",
        createdAt: now,
        exhaustedAt: null,
        createdFromCreditTransactionId: creditTxId,
      });

      // Write credit ledger event
      const ledgerRef = db.collection("creditTransactions").doc(creditTxId);
      transaction.set(ledgerRef, {
        id: creditTxId,
        userId,
        toolKey,
        credits: PRO_SESSION_COST,
        type: "spend",
        description: `Pro session for ${toolKey}`,
        timestamp: now,
        sessionId,
      });
    });

    const session: UsageSession = {
      sessionId,
      userId,
      toolKey,
      accessTier: "PRO",
      creditCost: PRO_SESSION_COST,
      maxRuns: PRO_SESSION_MAX_RUNS,
      remainingRuns: PRO_SESSION_MAX_RUNS,
      usedRuns: 0,
      status: "ACTIVE",
      createdAt: now,
      exhaustedAt: null,
      createdFromCreditTransactionId: creditTxId,
    };

    return { ok: true, session };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg === "INSUFFICIENT_CREDITS") {
      return { ok: false, reason: "INSUFFICIENT_CREDITS" };
    }
    return { ok: false, reason: `TRANSACTION_FAILED: ${msg}` };
  }
}

// ── Execution Management ──────────────────────────────────────────

/**
 * Get the active usage session for a user + tool.
 * Returns the most recent ACTIVE session.
 */
export async function getActiveProSession(
  userId: string,
  toolKey: string,
): Promise<UsageSession | null> {
  const db = getAdminFirestore();
  if (!db) return null;

  const sessionsSnap = await db
    .collection("users")
    .doc(userId)
    .collection("tool_usage_sessions")
    .where("userId", "==", userId)
    .where("toolKey", "==", toolKey)
    .where("status", "==", "ACTIVE")
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();

  if (sessionsSnap.empty) return null;

  const data = sessionsSnap.docs[0].data() as UsageSession;
  return data;
}

/**
 * Validate a Pro execution request.
 * Returns the session if valid, or an error reason.
 */
export async function validateProExecution(
  userId: string,
  toolKey: string,
  usageSessionId: string | null,
): Promise<
  | { ok: true; session: UsageSession }
  | { ok: false; reason: string }
> {
  if (!usageSessionId) {
    return { ok: false, reason: "NO_SESSION_ID" };
  }

  const db = getAdminFirestore();
  if (!db) {
    return { ok: false, reason: "DATABASE_UNAVAILABLE" };
  }

  // Fetch session
  const sessionRef = db
    .collection("users")
    .doc(userId)
    .collection("tool_usage_sessions")
    .doc(usageSessionId);

  const sessionSnap = await sessionRef.get();

  if (!sessionSnap.exists) {
    return { ok: false, reason: "SESSION_NOT_FOUND" };
  }

  const session = sessionSnap.data() as UsageSession;

  // Validate ownership
  if (session.userId !== userId) {
    return { ok: false, reason: "SESSION_USER_MISMATCH" };
  }

  // Validate toolKey
  if (session.toolKey !== toolKey) {
    return { ok: false, reason: "SESSION_TOOL_MISMATCH" };
  }

  // Validate status
  if (session.status !== "ACTIVE") {
    return { ok: false, reason: "SESSION_NOT_ACTIVE" };
  }

  // Validate remaining runs
  if (session.remainingRuns <= 0) {
    return { ok: false, reason: "SESSION_EXHAUSTED" };
  }

  return { ok: true, session };
}

export type DecrementProSessionRunsInput = {
  userId: string;
  toolKey: string;
  usageSessionId: string;
  clientRequestId?: string | null;
  rawInputs: unknown;
  selectedUnits: unknown;
};

export type DecrementProSessionRunsResult = {
  remainingRuns: number;
  usedRuns: number;
  status: "ACTIVE" | "EXHAUSTED";
  deduplicated: boolean;
};

/**
 * Decrement remainingRuns for a Pro session (atomic + idempotent).
 * Uses tool_execution_idempotency collection to prevent double-decrement
 * on duplicate requests (e.g. double-click, retry).
 */
export async function decrementProSessionRuns(
  input: DecrementProSessionRunsInput,
): Promise<DecrementProSessionRunsResult> {
  const db = getAdminFirestore();
  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const idempotencyKey = createExecutionIdempotencyKey({
    userId: input.userId,
    toolKey: input.toolKey,
    usageSessionId: input.usageSessionId,
    clientRequestId: input.clientRequestId,
    rawInputs: input.rawInputs,
    selectedUnits: input.selectedUnits,
  });

  const sessionRef = db
    .collection("users")
    .doc(input.userId)
    .collection("tool_usage_sessions")
    .doc(input.usageSessionId);

  const idempotencyRef = db
    .collection("users")
    .doc(input.userId)
    .collection("tool_execution_idempotency")
    .doc(idempotencyKey);

  return db.runTransaction(async (tx) => {
    // ── Check idempotency ────────────────────────────────────────
    const existingIdempotency = await tx.get(idempotencyRef);

    if (existingIdempotency.exists) {
      const existing = existingIdempotency.data() ?? {};
      return {
        remainingRuns: Number(existing.remainingRunsAfter ?? 0),
        usedRuns: Number(existing.usedRunsAfter ?? 0),
        status: existing.statusAfter === "EXHAUSTED" ? "EXHAUSTED" : "ACTIVE",
        deduplicated: true,
      };
    }

    // ── Validate session ─────────────────────────────────────────
    const sessionSnap = await tx.get(sessionRef);

    if (!sessionSnap.exists) {
      throw new Error("SESSION_NOT_FOUND");
    }

    const session = sessionSnap.data() ?? {};

    if (session.userId !== input.userId) {
      throw new Error("SESSION_USER_MISMATCH");
    }

    if (session.toolKey !== input.toolKey) {
      throw new Error("SESSION_TOOL_MISMATCH");
    }

    if (session.status !== "ACTIVE") {
      throw new Error("SESSION_NOT_ACTIVE");
    }

    const currentRemaining = Number(session.remainingRuns ?? 0);
    const currentUsed = Number(session.usedRuns ?? 0);

    if (!Number.isFinite(currentRemaining) || currentRemaining <= 0) {
      throw new Error("SESSION_EXHAUSTED");
    }

    // ── Decrement ────────────────────────────────────────────────
    const nextRemaining = currentRemaining - 1;
    const nextUsed = currentUsed + 1;
    const nextStatus = nextRemaining === 0 ? "EXHAUSTED" : "ACTIVE";

    tx.update(sessionRef, {
      remainingRuns: nextRemaining,
      usedRuns: nextUsed,
      status: nextStatus,
      exhaustedAt: nextStatus === "EXHAUSTED" ? FieldValue.serverTimestamp() : null,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // ── Write idempotency record ─────────────────────────────────
    tx.set(idempotencyRef, {
      idempotencyKey,
      userId: input.userId,
      toolKey: input.toolKey,
      usageSessionId: input.usageSessionId,
      remainingRunsBefore: currentRemaining,
      remainingRunsAfter: nextRemaining,
      usedRunsBefore: currentUsed,
      usedRunsAfter: nextUsed,
      statusAfter: nextStatus,
      createdAt: FieldValue.serverTimestamp(),
    });

    // ── Write execution log ──────────────────────────────────────
    const executionLogRef = db
      .collection("users")
      .doc(input.userId)
      .collection("tool_execution_logs")
      .doc();

    tx.set(executionLogRef, {
      userId: input.userId,
      toolKey: input.toolKey,
      usageSessionId: input.usageSessionId,
      idempotencyKey,
      provider: "sectorcalc_internal_credit_session",
      remainingRunsAfter: nextRemaining,
      usedRunsAfter: nextUsed,
      createdAt: FieldValue.serverTimestamp(),
    });

    return {
      remainingRuns: nextRemaining,
      usedRuns: nextUsed,
      status: nextStatus,
      deduplicated: false,
    };
  });
}

// ── Credit Balance ────────────────────────────────────────────────

/**
 * Get credit balance for a user.
 */
export async function getCreditBalance(userId: string): Promise<CreditBalance> {
  const db = getAdminFirestore();
  if (!db) {
    return { available: 0, totalPurchased: 0, usedThisMonth: 0 };
  }

  const balanceRef = db.collection("users").doc(userId).collection("credits").doc("balance");
  const balanceSnap = await balanceRef.get();
  const available = balanceSnap.exists && typeof balanceSnap.data()?.amount === "number"
    ? Math.floor(balanceSnap.data()!.amount)
    : 0;

  const transactionsSnap = await db
    .collection("creditTransactions")
    .where("userId", "==", userId)
    .get();

  let totalPurchased = 0;
  let usedThisMonth = 0;
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  for (const doc of transactionsSnap.docs) {
    const data = doc.data();
    const amount = typeof data.credits === "number" ? Math.floor(data.credits) : 0;
    if (data.type === "purchase") {
      totalPurchased += amount;
    } else if (data.type === "spend") {
      if (typeof data.timestamp === "string" && data.timestamp >= monthStart) {
        usedThisMonth += amount;
      }
    }
  }

  return { available, totalPurchased, usedThisMonth };
}

// ── Config exports ────────────────────────────────────────────────

export const PRO_SESSION_CONFIG = {
  creditCost: PRO_SESSION_COST,
  maxRuns: PRO_SESSION_MAX_RUNS,
} as const;
