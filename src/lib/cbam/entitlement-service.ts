// Server-only CBAM entitlement service using internal account credit balance.
// No Paddle product/price ID required. Reads and debits account credits directly.
import "server-only";
import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import {
  CBAM_PACKAGE_CREDITS,
  CBAM_PACKAGE_INCLUDED_USES,
  CBAM_REPORT_USE_COST,
  CBAM_SERVICE_KEY,
  CBAM_ENTITLEMENT_KEY,
} from "./billing-constants";

export interface CbamEntitlement {
  remainingUses: number;
  totalPurchasedUses: number;
  consumedReports: string[];
  processedRequestIds: string[];
  lastUnlockedAt: string | null;
  entitlementKey: string;
}

export interface CbamEntitlementResult {
  ok: boolean;
  data?: CbamEntitlement;
  remainingAccountCredits?: number;
  error?: string;
  code?:
    | "INSUFFICIENT_ACCOUNT_CREDITS"
    | "NOT_FOUND"
    | "ALREADY_UNLOCKED"
    | "REQUEST_ALREADY_PROCESSED"
    | "NO_REMAINING_USES"
    | "ERROR";
}

// Firestore doc paths
function creditBalanceRef(userId: string) {
  const db = getAdminFirestore();
  if (!db) return null;
  return db.collection("users").doc(userId).collection("credits").doc("balance");
}

function entitlementDocRef(userId: string) {
  const db = getAdminFirestore();
  if (!db) return null;
  return db
    .collection("users")
    .doc(userId)
    .collection("cbamEntitlements")
    .doc(CBAM_ENTITLEMENT_KEY);
}

export async function getCbamEntitlement(
  userId: string
): Promise<CbamEntitlement | null> {
  const ref = entitlementDocRef(userId);
  if (!ref) return null;
  const snap = await ref.get();
  if (!snap.exists) return null;
  const data = snap.data()!;
  return {
    remainingUses:
      typeof data.remainingUses === "number" ? data.remainingUses : 0,
    totalPurchasedUses:
      typeof data.totalPurchasedUses === "number"
        ? data.totalPurchasedUses
        : 0,
    consumedReports: Array.isArray(data.consumedReports)
      ? data.consumedReports
      : [],
    processedRequestIds: Array.isArray(data.processedRequestIds)
      ? data.processedRequestIds
      : [],
    lastUnlockedAt:
      typeof data.lastUnlockedAt === "string" ? data.lastUnlockedAt : null,
    entitlementKey: CBAM_ENTITLEMENT_KEY,
  };
}

// Returns the user's current account credit balance from Firestore.
export async function getAccountCreditBalance(
  userId: string
): Promise<number> {
  const ref = creditBalanceRef(userId);
  if (!ref) return 0;
  const snap = await ref.get();
  if (!snap.exists) return 0;
  const amount = snap.data()?.amount;
  return typeof amount === "number" && Number.isFinite(amount)
    ? Math.floor(amount)
    : 0;
}

// Unlock CBAM package: debit 100 account credits, grant 5 CBAM uses.
// Idempotent by requestId — same requestId will not debit or grant again.
export async function unlockCbamPackage(
  userId: string,
  requestId: string
): Promise<CbamEntitlementResult> {
  const db = getAdminFirestore();
  if (!db) {
    return { ok: false, code: "ERROR", error: "Firestore not available." };
  }

  const creditRef = creditBalanceRef(userId);
  const entitleRef = entitlementDocRef(userId);
  if (!creditRef || !entitleRef) {
    return { ok: false, code: "ERROR", error: "Firestore not available." };
  }

  try {
    const result = await db.runTransaction(async (tx) => {
      // Check idempotency: has this requestId already been processed?
      const entitleSnap = await tx.get(entitleRef);
      if (entitleSnap.exists) {
        const existingData = entitleSnap.data()!;
        const processedIds: string[] = Array.isArray(
          existingData.processedRequestIds
        )
          ? existingData.processedRequestIds
          : [];
        if (processedIds.includes(requestId)) {
          // Idempotent: already processed this request — return current state
          const currentRemainingUses =
            typeof existingData.remainingUses === "number"
              ? existingData.remainingUses
              : 0;
          // Also return current account credit balance
          const creditSnap = await tx.get(creditRef);
          const currentCredits =
            creditSnap.exists &&
            typeof creditSnap.data()?.amount === "number"
              ? Math.floor(creditSnap.data()!.amount)
              : 0;
          return {
            ok: true as const,
            remainingUses: currentRemainingUses,
            remainingCredits: currentCredits,
          };
        }
      }

      // Check account credit balance >= 100
      const creditSnap = await tx.get(creditRef);
      const currentCredits =
        creditSnap.exists && typeof creditSnap.data()?.amount === "number"
          ? creditSnap.data()!.amount
          : 0;

      if (currentCredits < CBAM_PACKAGE_CREDITS) {
        return {
          ok: false as const,
          code: "INSUFFICIENT_ACCOUNT_CREDITS" as const,
          remainingCredits: Math.floor(currentCredits),
        };
      }

      // Atomically debit 100 account credits
      tx.set(
        creditRef,
        {
          amount: currentCredits - CBAM_PACKAGE_CREDITS,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      // Atomically add 5 CBAM uses
      const existingData = entitleSnap.exists ? entitleSnap.data()! : {};
      const currentRemainingUses =
        typeof existingData.remainingUses === "number"
          ? existingData.remainingUses
          : 0;
      const currentTotalPurchased =
        typeof existingData.totalPurchasedUses === "number"
          ? existingData.totalPurchasedUses
          : 0;
      const processedIds: string[] = Array.isArray(
        existingData.processedRequestIds
      )
        ? existingData.processedRequestIds
        : [];
      const consumedReports: string[] = Array.isArray(
        existingData.consumedReports
      )
        ? existingData.consumedReports
        : [];

      const newRemainingUses =
        currentRemainingUses + CBAM_PACKAGE_INCLUDED_USES;
      const newTotalPurchased =
        currentTotalPurchased + CBAM_PACKAGE_INCLUDED_USES;
      processedIds.push(requestId);

      const now = new Date().toISOString();
      tx.set(
        entitleRef,
        {
          remainingUses: newRemainingUses,
          totalPurchasedUses: newTotalPurchased,
          consumedReports,
          processedRequestIds: processedIds,
          lastUnlockedAt: now,
          serviceKey: CBAM_SERVICE_KEY,
          entitlementKey: CBAM_ENTITLEMENT_KEY,
          updatedAt: now,
        },
        { merge: true }
      );

      return {
        ok: true as const,
        remainingUses: newRemainingUses,
        remainingCredits: currentCredits - CBAM_PACKAGE_CREDITS,
      };
    });

    if (result.ok) {
      // Record ledger entry outside transaction
      try {
        const now = new Date().toISOString();
        await db.collection("creditTransactions").add({
          userId,
          type: "CBAM_PACKAGE_UNLOCK",
          credits: CBAM_PACKAGE_CREDITS,
          toolSlug: CBAM_SERVICE_KEY,
          usesGranted: CBAM_PACKAGE_INCLUDED_USES,
          entitlementKey: CBAM_ENTITLEMENT_KEY,
          requestId,
          timestamp: now,
        });
      } catch {
        // Ledger recording is informational; unlock already succeeded
      }

      const updated = await getCbamEntitlement(userId);
      return {
        ok: true,
        data: updated ?? undefined,
        remainingAccountCredits: result.remainingCredits,
      };
    }

    return {
      ok: false,
      code: result.code,
      remainingAccountCredits: result.remainingCredits,
      error:
        result.code === "INSUFFICIENT_ACCOUNT_CREDITS"
          ? `Insufficient account credits. Required: ${CBAM_PACKAGE_CREDITS}, available: ${result.remainingCredits}.`
          : "Unknown error.",
    };
  } catch (err) {
    return {
      ok: false,
      code: "ERROR",
      error:
        err instanceof Error
          ? err.message
          : "Failed to unlock CBAM package.",
    };
  }
}

// Consume 1 CBAM report use. Idempotent by reportId.
// Must only be called after successful PDF generation and verify record creation.
export async function consumeCbamReportUse(
  userId: string,
  reportId: string
): Promise<CbamEntitlementResult> {
  const db = getAdminFirestore();
  if (!db) {
    return { ok: false, code: "ERROR", error: "Firestore not available." };
  }

  const ref = entitlementDocRef(userId);
  if (!ref) {
    return { ok: false, code: "ERROR", error: "Firestore not available." };
  }

  try {
    const result = await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) {
        return {
          ok: false as const,
          code: "NOT_FOUND" as const,
          error: "No CBAM entitlement found. Unlock a package first.",
        };
      }

      const data = snap.data()!;
      const consumedReports: string[] = Array.isArray(data.consumedReports)
        ? data.consumedReports
        : [];

      // Idempotency check: if this reportId was already consumed, return current state
      if (consumedReports.includes(reportId)) {
        return {
          ok: true as const,
          remainingUses: data.remainingUses as number,
          alreadyConsumed: true as const,
        };
      }

      const remainingUses =
        typeof data.remainingUses === "number" ? data.remainingUses : 0;
      if (remainingUses <= 0) {
        return {
          ok: false as const,
          code: "NO_REMAINING_USES" as const,
          error: "No remaining CBAM report uses. Unlock a new package.",
        };
      }

      // Consume 1 use
      consumedReports.push(reportId);
      tx.set(
        ref,
        {
          remainingUses: remainingUses - CBAM_REPORT_USE_COST,
          consumedReports,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      return {
        ok: true as const,
        remainingUses: remainingUses - CBAM_REPORT_USE_COST,
        alreadyConsumed: false as const,
      };
    });

    if (result.ok) {
      const updated = await getCbamEntitlement(userId);
      return { ok: true, data: updated ?? undefined };
    }
    return {
      ok: false,
      code: result.code ?? "ERROR",
      error: result.error ?? "Failed to consume CBAM report use.",
    };
  } catch (err) {
    return {
      ok: false,
      code: "ERROR",
      error:
        err instanceof Error
          ? err.message
          : "Failed to consume CBAM report use.",
    };
  }
}
