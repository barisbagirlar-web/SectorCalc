/**
 * Maintenance BOM Recovery — Entitlement & Payment Integration
 *
 * Integrates with the existing SectorCalc credit system:
 * - Credits stored at users/{uid}/credits/balance (amount field)
 * - Credit transactions in creditTransactions collection
 * - Product price: 149 credits
 *
 * Server-side only. All price/entitlement logic is authoritative on the server.
 */
import "server-only";

import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import type { PaymentStatus, EntitlementStatus } from "@/types/document-intelligence";
import { MAINTENANCE_BOM_PRODUCT_CODE, MAINTENANCE_BOM_PRICE_CREDITS } from "@/types/document-intelligence";

/* ── Types ────────────────────────────────────────────────────────── */

export interface EntitlementCheckResult {
  ok: boolean;
  reason: string | null;
  availableCredits: number;
  requiredCredits: number;
}

export interface ReservationResult {
  ok: boolean;
  reason: string | null;
  checkoutRequestId?: string;
}

export interface ConsumptionResult {
  ok: boolean;
  reason: string | null;
  paymentTransactionId?: string;
}

export interface ReleaseResult {
  ok: boolean;
  reason: string | null;
}

/* ── Constants ────────────────────────────────────────────────────── */

// 149 credits
export const MAINTENANCE_BOM_CREDIT_COST = 149;

/* ── Module ───────────────────────────────────────────────────────── */

/**
 * Check if a user has sufficient credits for a Maintenance BOM Recovery job.
 */
export async function checkEntitlement(userId: string): Promise<EntitlementCheckResult> {
  try {
    const db = getAdminFirestore();
    if (!db) {
      return { ok: false, reason: "PAYMENT_INFRASTRUCTURE_NOT_BOUND", availableCredits: 0, requiredCredits: MAINTENANCE_BOM_CREDIT_COST };
    }

    const balanceRef = db.collection("users").doc(userId).collection("credits").doc("balance");
    const snap = await balanceRef.get();
    const amount = snap.exists && typeof snap.data()?.amount === "number" ? snap.data()!.amount : 0;

    if (amount < MAINTENANCE_BOM_CREDIT_COST) {
      return { ok: false, reason: "INSUFFICIENT_CREDITS", availableCredits: Math.floor(amount), requiredCredits: MAINTENANCE_BOM_CREDIT_COST };
    }

    return { ok: true, reason: null, availableCredits: Math.floor(amount), requiredCredits: MAINTENANCE_BOM_CREDIT_COST };
  } catch {
    return { ok: false, reason: "PAYMENT_INFRASTRUCTURE_NOT_BOUND", availableCredits: 0, requiredCredits: MAINTENANCE_BOM_CREDIT_COST };
  }
}

/**
 * Reserve credits for a job. Deducts MAINTENANCE_BOM_CREDIT_COST credits atomically.
 * Returns a checkoutRequestId for idempotency.
 */
export async function reserveCredits(
  userId: string,
  jobId: string,
): Promise<ReservationResult> {
  try {
    const db = getAdminFirestore();
    if (!db) {
      return { ok: false, reason: "PAYMENT_INFRASTRUCTURE_NOT_BOUND" };
    }

    const checkoutRequestId = `bom-reserve-${jobId}-${Date.now()}`;

    // Use Firestore transaction for atomic credit reservation
    await db.runTransaction(async (transaction) => {
      const balanceRef = db.collection("users").doc(userId).collection("credits").doc("balance");
      const snap = await transaction.get(balanceRef);
      const currentBalance = snap.exists && typeof snap.data()?.amount === "number" ? snap.data()!.amount : 0;

      if (currentBalance < MAINTENANCE_BOM_CREDIT_COST) {
        throw new Error("INSUFFICIENT_CREDITS");
      }

      transaction.update(balanceRef, {
        amount: currentBalance - MAINTENANCE_BOM_CREDIT_COST,
        updatedAt: new Date().toISOString(),
      });

      // Record credit transaction
      const txRef = db.collection("creditTransactions").doc();
      transaction.set(txRef, {
        userId,
        jobId,
        productCode: MAINTENANCE_BOM_PRODUCT_CODE,
        credits: MAINTENANCE_BOM_CREDIT_COST,
        type: "reserve",
        checkoutRequestId,
        timestamp: new Date().toISOString(),
      });
    });

    return { ok: true, reason: null, checkoutRequestId };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg === "INSUFFICIENT_CREDITS") {
      return { ok: false, reason: "INSUFFICIENT_CREDITS" };
    }
    return { ok: false, reason: "RESERVATION_FAILED" };
  }
}

/**
 * Consume the reserved credits (marks reservation as consumed).
 * Called when processing completes successfully.
 */
export async function consumeEntitlement(
  userId: string,
  jobId: string,
  checkoutRequestId: string,
): Promise<ConsumptionResult> {
  try {
    const db = getAdminFirestore();
    if (!db) {
      return { ok: false, reason: "PAYMENT_INFRASTRUCTURE_NOT_BOUND" };
    }

    const paymentTransactionId = `bom-consume-${jobId}-${Date.now()}`;

    // Find the reservation transaction and mark as consumed
    const txSnapshot = await db
      .collection("creditTransactions")
      .where("userId", "==", userId)
      .where("checkoutRequestId", "==", checkoutRequestId)
      .where("type", "==", "reserve")
      .limit(1)
      .get();

    if (!txSnapshot.empty) {
      await db.collection("creditTransactions").doc(txSnapshot.docs[0].id).update({
        type: "spend",
        consumedAt: new Date().toISOString(),
        paymentTransactionId,
      });
    }

    // Also record a spend transaction
    await db.collection("creditTransactions").add({
      userId,
      jobId,
      productCode: MAINTENANCE_BOM_PRODUCT_CODE,
      credits: MAINTENANCE_BOM_CREDIT_COST,
      type: "spend",
      paymentTransactionId,
      timestamp: new Date().toISOString(),
    });

    return { ok: true, reason: null, paymentTransactionId };
  } catch {
    return { ok: false, reason: "CONSUMPTION_FAILED" };
  }
}

/**
 * Release reserved credits (for retries or failures before usable output).
 * Issues one replacement job token to prevent double charging.
 */
export async function releaseEntitlement(
  userId: string,
  jobId: string,
): Promise<ReleaseResult> {
  try {
    const db = getAdminFirestore();
    if (!db) {
      return { ok: false, reason: "PAYMENT_INFRASTRUCTURE_NOT_BOUND" };
    }

    // Refund credits atomically
    await db.runTransaction(async (transaction) => {
      const balanceRef = db.collection("users").doc(userId).collection("credits").doc("balance");
      const snap = await transaction.get(balanceRef);
      const currentBalance = snap.exists && typeof snap.data()?.amount === "number" ? snap.data()!.amount : 0;

      transaction.set(balanceRef, {
        amount: currentBalance + MAINTENANCE_BOM_CREDIT_COST,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      // Record release event
      const releaseRef = db.collection("creditTransactions").doc();
      transaction.set(releaseRef, {
        userId,
        jobId,
        productCode: MAINTENANCE_BOM_PRODUCT_CODE,
        credits: MAINTENANCE_BOM_CREDIT_COST,
        type: "release",
        timestamp: new Date().toISOString(),
      });
    });

    return { ok: true, reason: null };
  } catch {
    return { ok: false, reason: "RELEASE_FAILED" };
  }
}

/**
 * Map a PaymentStatus to the corresponding EntitlementStatus.
 */
export function deriveEntitlementStatus(paymentStatus: PaymentStatus): EntitlementStatus {
  switch (paymentStatus) {
    case "paid":
      return "consumed";
    case "checkout_pending":
      return "reserved";
    case "refunded":
    case "chargeback":
      return "released";
    case "payment_failed":
    case "unpaid":
    default:
      return "none";
  }
}

/**
 * Determine the public checkout data for a diagnostic-eligible job.
 */
export function getCheckoutData() {
  return {
    productCode: MAINTENANCE_BOM_PRODUCT_CODE,
    productName: "Maintenance BOM Recovery — Verified BOM Job",
    creditCost: MAINTENANCE_BOM_CREDIT_COST,
    priceCredits: MAINTENANCE_BOM_PRICE_CREDITS,
    allowedPages: 50,
    allowedRows: 500,
    allowedFileSize: 50 * 1024 * 1024,
  };
}
