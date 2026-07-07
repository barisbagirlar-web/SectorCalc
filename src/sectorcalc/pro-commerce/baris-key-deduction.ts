// SectorCalc PRO V5.3.1 — Atomic Key Deduction Service
// Server-only. Deducts exactly 1 barisProKey inside a Firestore transaction
// with balance check, preventing race conditions and negative keys.
// Uses baris_key_ledger/{requestId} for idempotent deduct/execute/refund lifecycle.
import "server-only";
import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export type LedgerStatus = "DEDUCTED" | "EXECUTED" | "REFUNDED";

export interface AtomicDeductionResult {
  ok: boolean;
  reason: string | null;
  status?: LedgerStatus;
}

const LEDGER_COLLECTION = "baris_key_ledger";

/**
 * Generate a deterministic requestId for idempotency.
 */
export function generateKeyRequestId(userId: string, toolKey: string): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 10);
  return `key_${userId.slice(0, 8)}_${toolKey.slice(0, 20)}_${ts}_${rand}`;
}

/**
 * Atomically check balance, deduct 1 barisProKey, and record ledger entry
 * with DEDUCTED status — all inside a single Firestore transaction.
 *
 * Idempotent: if baris_key_ledger/{requestId} already exists with DEDUCTED
 * or EXECUTED status, returns ok=true without double-deducting.
 */
export async function deductBarisProKeyAtomic(
  userId: string,
  toolKey: string,
  requestId: string,
): Promise<AtomicDeductionResult> {
  const db = getAdminFirestore();
  if (!db) {
    return { ok: false, reason: "FIRESTORE_UNAVAILABLE" };
  }

  try {
    const result = await db.runTransaction<AtomicDeductionResult>(async (txn) => {
      const ledgerRef = db.collection(LEDGER_COLLECTION).doc(requestId);
      const ledgerSnap = await txn.get(ledgerRef);
      if (ledgerSnap.exists) {
        const existingStatus = ledgerSnap.data()?.status as LedgerStatus | undefined;
        if (existingStatus === "DEDUCTED" || existingStatus === "EXECUTED") {
          return { ok: true, reason: null, status: existingStatus };
        }
        if (existingStatus === "REFUNDED") {
          return { ok: false, reason: "ALREADY_REFUNDED", status: "REFUNDED" };
        }
      }

      const userRef = db.collection("users").doc(userId);
      const userSnap = await txn.get(userRef);
      if (!userSnap.exists) {
        return { ok: false, reason: "USER_NOT_FOUND" };
      }

      const data = userSnap.data();
      const currentKeys = typeof data?.barisProKeys === "number" ? data.barisProKeys : 0;
      if (currentKeys < 1) {
        return { ok: false, reason: "INSUFFICIENT_KEYS" };
      }

      txn.update(userRef, {
        barisProKeys: FieldValue.increment(-1),
        lastKeyDeduction: { toolKey, requestId, deductedAt: new Date().toISOString() },
        updatedAt: new Date().toISOString(),
      });

      txn.set(ledgerRef, {
        requestId,
        userId,
        toolKey,
        status: "DEDUCTED",
        createdAt: new Date().toISOString(),
      });

      return { ok: true, reason: null, status: "DEDUCTED" as LedgerStatus };
    });

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown transaction error";
    console.error(`[key-deduction] Atomic deduct failed for ${toolKey} user ${userId}:`, message);
    return { ok: false, reason: `TRANSACTION_FAILED: ${message}` };
  }
}

/**
 * Mark a ledger entry as EXECUTED after successful calculation.
 * Idempotent: safe to call multiple times.
 */
export async function markKeyExecuted(
  userId: string,
  requestId: string,
): Promise<void> {
  const db = getAdminFirestore();
  if (!db) return;

  try {
    const ledgerRef = db.collection(LEDGER_COLLECTION).doc(requestId);
    await db.runTransaction(async (txn) => {
      const snap = await txn.get(ledgerRef);
      if (!snap.exists || snap.data()?.status === "EXECUTED") return;
      txn.update(ledgerRef, {
        status: "EXECUTED",
        executedAt: new Date().toISOString(),
      });
    });
  } catch (err) {
    console.error(`[key-deduction] Mark EXECUTED failed for ${requestId}:`, err);
  }
}

/**
 * Refund (restore) 1 barisProKey + update ledger to REFUNDED status.
 * Idempotent: only refunds if current status is DEDUCTED (not yet executed).
 */
export async function refundBarisProKey(
  userId: string,
  toolKey: string,
  requestId: string,
): Promise<void> {
  const db = getAdminFirestore();
  if (!db) return;

  try {
    await db.runTransaction(async (txn) => {
      const ledgerRef = db.collection(LEDGER_COLLECTION).doc(requestId);
      const ledgerSnap = await txn.get(ledgerRef);

      if (!ledgerSnap.exists || ledgerSnap.data()?.status !== "DEDUCTED") {
        return;
      }

      const userRef = db.collection("users").doc(userId);
      txn.update(userRef, {
        barisProKeys: FieldValue.increment(1),
        lastKeyRefund: { toolKey, requestId, refundedAt: new Date().toISOString() },
        updatedAt: new Date().toISOString(),
      });

      txn.update(ledgerRef, {
        status: "REFUNDED",
        refundedAt: new Date().toISOString(),
      });
    });
  } catch (err) {
    console.error(
      `[key-deduction] ⚠ REFUND FAILED for ${toolKey} user ${userId} request ${requestId}:`,
      err instanceof Error ? err.message : String(err),
    );
  }
}
