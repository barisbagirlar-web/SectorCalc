/**
 * SectorCalc Central Product → Usage Policy
 *
 * Single source of truth for how general credits convert to product-specific
 * usage rights. No hardcoded credit costs scattered across routes.
 *
 * MODEL: User buys general credits. Each product converts credits to
 * usage rights on first use:
 *   AI Photo Diagnosis:       2 credits → 3 uses
 *   Engineering Diagnostics:   5 credits → 3 uses
 *   Pro Tools:                 1 credit  → 3 uses
 *   CBAM Module:             100 credits → 3 uses
 *   Free Tools:                0 credits  → unlimited
 *
 * FIRESTORE: users/{uid}/productUsage/{productKey}
 *   creditCost         number
 *   usesGranted        number
 *   remainingUses      number
 *   totalUsesGranted   number
 *   totalUsesConsumed  number
 *   lastGrantedAt      string (ISO)
 *   updatedAt          string (ISO)
 */

import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";

/* ── Product key enum ─────────────────────────────────────────── */

export const PRODUCT_KEYS = {
  FREE_TOOLS: "FREE_TOOLS",
  PRO_TOOLS: "PRO_TOOLS",
  AI_PHOTO_DIAGNOSIS: "AI_PHOTO_DIAGNOSIS",
  ENGINEERING_DIAGNOSTICS: "ENGINEERING_DIAGNOSTICS",
  CBAM: "CBAM",
} as const;

export type ProductKey = (typeof PRODUCT_KEYS)[keyof typeof PRODUCT_KEYS];

/* ── Policy definition ────────────────────────────────────────── */

export interface ProductUsagePolicy {
  creditCost: number;
  usageGrant: number; // 0 = unlimited
}

export const PRODUCT_USAGE_POLICY: Record<ProductKey, ProductUsagePolicy> = {
  [PRODUCT_KEYS.FREE_TOOLS]: { creditCost: 0, usageGrant: 0 },
  [PRODUCT_KEYS.PRO_TOOLS]: { creditCost: 1, usageGrant: 3 },
  [PRODUCT_KEYS.AI_PHOTO_DIAGNOSIS]: { creditCost: 2, usageGrant: 3 },
  [PRODUCT_KEYS.ENGINEERING_DIAGNOSTICS]: { creditCost: 5, usageGrant: 3 },
  [PRODUCT_KEYS.CBAM]: { creditCost: 100, usageGrant: 3 },
};

/* ── Firestore product usage doc shape ────────────────────────── */

export interface ProductUsageDoc {
  productKey: ProductKey;
  creditCost: number;
  usesGranted: number;
  remainingUses: number;
  totalUsesGranted: number;
  totalUsesConsumed: number;
  lastGrantedAt: string | null;
  updatedAt: string;
}

/* ── Public helpers ───────────────────────────────────────────── */

/**
 * Get policy for a product key.
 */
export function getProductUsagePolicy(productKey: ProductKey): ProductUsagePolicy {
  return PRODUCT_USAGE_POLICY[productKey];
}

/**
 * Check whether a product is a free product (no credit check needed).
 */
export function isFreeProduct(productKey: ProductKey): boolean {
  return PRODUCT_USAGE_POLICY[productKey]?.creditCost === 0;
}

/**
 * Get the usage doc reference path.
 */
function productUsageRef(userId: string, productKey: ProductKey) {
  const db = getAdminFirestore();
  if (!db) return null;
  return db
    .collection("users")
    .doc(userId)
    .collection("productUsage")
    .doc(productKey);
}

/* ── Core operations ──────────────────────────────────────────── */

/**
 * Get the current product usage document.
 */
export async function getProductUsageDoc(
  userId: string,
  productKey: ProductKey,
): Promise<ProductUsageDoc | null> {
  const ref = productUsageRef(userId, productKey);
  if (!ref) return null;
  const snap = await ref.get();
  if (!snap.exists) return null;
  return snap.data() as ProductUsageDoc;
}

/**
 * Check whether the user has remaining uses for a product.
 * Free products always return true.
 */
export async function checkProductUsage(
  userId: string,
  productKey: ProductKey,
): Promise<boolean> {
  if (isFreeProduct(productKey)) return true;
  const doc = await getProductUsageDoc(userId, productKey);
  if (!doc) return false;
  return doc.remainingUses > 0;
}

/**
 * Get remaining uses count for display purposes.
 * Free products return Infinity.
 */
export async function getRemainingProductUses(
  userId: string,
  productKey: ProductKey,
): Promise<number> {
  if (isFreeProduct(productKey)) return Infinity;
  const doc = await getProductUsageDoc(userId, productKey);
  if (!doc) return 0;
  return doc.remainingUses;
}

/**
 * Get total granted uses count for display.
 */
export async function getTotalProductUsesGranted(
  userId: string,
  productKey: ProductKey,
): Promise<number> {
  if (isFreeProduct(productKey)) return 0;
  const doc = await getProductUsageDoc(userId, productKey);
  if (!doc) return 0;
  return doc.totalUsesGranted;
}

/**
 * ATOMIC OPERATION:
 * Deduct credits from general balance AND grant product uses in the same
 * transaction. Never one without the other.
 *
 * 1. Check general credit balance >= creditCost
 * 2. Deduct creditCost from general balance
 * 3. Grant usageGrant uses to product
 * 4. If product usage doc already exists, add uses to existing
 *
 * Returns { ok: true, remainingUses } or { ok: false, reason }.
 */
export async function grantProductUsesFromCredits(
  userId: string,
  productKey: ProductKey,
): Promise<{ ok: true; remainingUses: number } | { ok: false; reason: string }> {
  if (isFreeProduct(productKey)) {
    return { ok: true, remainingUses: Infinity };
  }

  const policy = getProductUsagePolicy(productKey);
  const db = getAdminFirestore();
  if (!db) return { ok: false, reason: "DATABASE_UNAVAILABLE" };

  const balanceRef = db.collection("users").doc(userId).collection("credits").doc("balance");
  const usageRef = db.collection("users").doc(userId).collection("productUsage").doc(productKey);

  try {
    return await db.runTransaction(async (tx) => {
      // Read current credit balance
      const balanceSnap = await tx.get(balanceRef);
      const currentBalance =
        balanceSnap.exists && typeof balanceSnap.data()?.amount === "number"
          ? balanceSnap.data()!.amount
          : 0;

      if (currentBalance < policy.creditCost) {
        throw new Error("INSUFFICIENT_CREDITS");
      }

      // Read current product usage
      const usageSnap = await tx.get(usageRef);
      const existing = usageSnap.exists ? (usageSnap.data() as ProductUsageDoc) : null;

      const now = new Date().toISOString();
      const remainingBefore = existing?.remainingUses ?? 0;
      const newRemaining = remainingBefore + policy.usageGrant;

      // Deduct credits
      tx.update(balanceRef, {
        amount: currentBalance - policy.creditCost,
        updatedAt: now,
      });

      // Grant (or add to) product uses
      tx.set(
        usageRef,
        {
          productKey,
          creditCost: policy.creditCost,
          usesGranted: policy.usageGrant,
          remainingUses: newRemaining,
          totalUsesGranted: (existing?.totalUsesGranted ?? 0) + policy.usageGrant,
          totalUsesConsumed: existing?.totalUsesConsumed ?? 0,
          lastGrantedAt: now,
          updatedAt: now,
        },
        { merge: false },
      );

      return { ok: true, remainingUses: newRemaining };
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg === "INSUFFICIENT_CREDITS") {
      return { ok: false, reason: "INSUFFICIENT_CREDITS" };
    }
    return { ok: false, reason: `TRANSACTION_FAILED: ${msg}` };
  }
}

/**
 * ATOMIC OPERATION:
 * Decrement 1 product use. Only call this AFTER successful output generation.
 * If the product execution failed, DO NOT call this.
 *
 * Free products are no-ops (always return true).
 */
export async function decrementProductUse(
  userId: string,
  productKey: ProductKey,
): Promise<boolean> {
  if (isFreeProduct(productKey)) return true;

  const db = getAdminFirestore();
  if (!db) return false;

  const usageRef = db.collection("users").doc(userId).collection("productUsage").doc(productKey);

  try {
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(usageRef);
      if (!snap.exists) throw new Error("NO_USAGE_DOC");

      const doc = snap.data() as ProductUsageDoc;
      if (doc.remainingUses <= 0) throw new Error("NO_REMAINING_USES");

      const now = new Date().toISOString();
      tx.update(usageRef, {
        remainingUses: doc.remainingUses - 1,
        totalUsesConsumed: doc.totalUsesConsumed + 1,
        updatedAt: now,
      });
    });

    return true;
  } catch {
    return false;
  }
}

/**
 * Get the policy summary for a product — for UI copy.
 */
export function getProductUsageSummary(productKey: ProductKey): {
  creditCost: number;
  usageGrant: number;
  label: string;
} {
  const policy = getProductUsagePolicy(productKey);
  const labels: Record<ProductKey, string> = {
    [PRODUCT_KEYS.FREE_TOOLS]: "Free",
    [PRODUCT_KEYS.PRO_TOOLS]: "Pro Tools",
    [PRODUCT_KEYS.AI_PHOTO_DIAGNOSIS]: "AI Photo Diagnosis",
    [PRODUCT_KEYS.ENGINEERING_DIAGNOSTICS]: "Engineering Diagnostics",
    [PRODUCT_KEYS.CBAM]: "CBAM Module",
  };
  return {
    creditCost: policy.creditCost,
    usageGrant: policy.usageGrant,
    label: labels[productKey],
  };
}
