/**
 * Engineering Diagnostics Package Model
 *
 * Defines the credit-to-uses mapping and Firestore-backed
 * usage tracking for Full Engineering Diagnostics.
 *
 * PACKAGE RULE:
 *   5 Credits → 3 Full Engineering Diagnostic uses
 *   1 Full Diagnostic use consumed per successful generation
 *
 * Firestore:
 *   users/{uid}/diagnostic_usage/summary
 *     { remainingUses: number, totalUsed: number }
 */

import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import { checkUserCreditBalance } from "@/lib/credits/tool-usage-session.server";

export const DIAGNOSTIC_PACKAGE_CREDITS = 5;
export const DIAGNOSTIC_PACKAGE_USES = 3;
export const FULL_DIAGNOSTIC_USE_COST = 1;

const USAGE_COLLECTION = "diagnostic_usage";
const USAGE_DOC = "summary";

export interface DiagnosticUsage {
  remainingUses: number;
  totalUsed: number;
}

/* ── Read current usage ── */

/**
 * Get remaining diagnostic uses for a user.
 * Returns 0 if no usage document exists.
 */
export async function getRemainingDiagnosticUses(uid: string): Promise<number> {
  const db = getAdminFirestore();
  if (!db) return 0;

  const snap = await db
    .collection("users")
    .doc(uid)
    .collection(USAGE_COLLECTION)
    .doc(USAGE_DOC)
    .get();

  if (!snap.exists) return 0;
  const data = snap.data() as DiagnosticUsage;
  return typeof data.remainingUses === "number" ? Math.floor(data.remainingUses) : 0;
}

/* ── Access gate ── */

/**
 * Ensure the user has diagnostic access.
 *
 * Flow:
 * 1. If remainingUses > 0, return true immediately.
 * 2. If remainingUses == 0, check credit balance >= DIAGNOSTIC_PACKAGE_CREDITS (5).
 * 3. If yes, deduct 5 credits and grant DIAGNOSTIC_PACKAGE_USES (3) uses.
 * 4. Return true (the caller will decrement 1 use after successful generation).
 * 5. If no credits, return false.
 */
export async function ensureDiagnosticAccess(uid: string): Promise<boolean> {
  // Check remaining uses first (fast path)
  const remaining = await getRemainingDiagnosticUses(uid);
  if (remaining > 0) {
    return true;
  }

  // No remaining uses — check if user can buy a package
  const hasCredits = await checkUserCreditBalance(uid, DIAGNOSTIC_PACKAGE_CREDITS);
  if (!hasCredits) {
    return false;
  }

  // Try to purchase the package atomically
  const db = getAdminFirestore();
  if (!db) return false;

  try {
    await db.runTransaction(async (transaction) => {
      const balanceRef = db.collection("users").doc(uid).collection("credits").doc("balance");
      const balanceSnap = await transaction.get(balanceRef);
      const currentBalance = balanceSnap.exists && typeof balanceSnap.data()?.amount === "number"
        ? balanceSnap.data()!.amount
        : 0;

      if (currentBalance < DIAGNOSTIC_PACKAGE_CREDITS) {
        throw new Error("INSUFFICIENT_CREDITS");
      }

      // Deduct 5 credits
      transaction.update(balanceRef, {
        amount: currentBalance - DIAGNOSTIC_PACKAGE_CREDITS,
        updatedAt: new Date().toISOString(),
      });

      // Grant 3 diagnostic uses (merge into existing doc)
      const usageRef = db.collection("users").doc(uid).collection(USAGE_COLLECTION).doc(USAGE_DOC);
      const usageSnap = await transaction.get(usageRef);
      const existingRemaining = usageSnap.exists && typeof usageSnap.data()?.remainingUses === "number"
        ? usageSnap.data()!.remainingUses
        : 0;
      const existingTotalUsed = usageSnap.exists && typeof usageSnap.data()?.totalUsed === "number"
        ? usageSnap.data()!.totalUsed
        : 0;

      transaction.set(usageRef, {
        remainingUses: existingRemaining + DIAGNOSTIC_PACKAGE_USES,
        totalUsed: existingTotalUsed,
        updatedAt: new Date().toISOString(),
      });
    });

    return true;
  } catch (err) {
    const emsg = err instanceof Error ? err.message : String(err);
    if (emsg === "INSUFFICIENT_CREDITS") return false;
    console.error("[diagnostic-package] Transaction failed:", emsg);
    return false;
  }
}

/**
 * Decrement 1 diagnostic use after successful report generation.
 * Must only be called after PDF/report/Firestore writes succeed.
 */
export async function decrementDiagnosticUse(uid: string): Promise<boolean> {
  const db = getAdminFirestore();
  if (!db) return false;

  try {
    const usageRef = db.collection("users").doc(uid).collection(USAGE_COLLECTION).doc(USAGE_DOC);

    await db.runTransaction(async (transaction) => {
      const snap = await transaction.get(usageRef);
      const currentRemaining = snap.exists && typeof snap.data()?.remainingUses === "number"
        ? snap.data()!.remainingUses
        : 0;
      const currentTotalUsed = snap.exists && typeof snap.data()?.totalUsed === "number"
        ? snap.data()!.totalUsed
        : 0;

      if (currentRemaining < FULL_DIAGNOSTIC_USE_COST) {
        throw new Error("NO_REMAINING_USES");
      }

      transaction.set(usageRef, {
        remainingUses: currentRemaining - FULL_DIAGNOSTIC_USE_COST,
        totalUsed: currentTotalUsed + FULL_DIAGNOSTIC_USE_COST,
        updatedAt: new Date().toISOString(),
      });
    });

    return true;
  } catch (err) {
    const dmsg = err instanceof Error ? err.message : String(err);
    if (dmsg === "NO_REMAINING_USES") return false;
    console.error("[diagnostic-package] Decrement failed:", dmsg);
    return false;
  }
}
