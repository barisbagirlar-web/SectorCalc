/**
 * Engineering Diagnostics Package Model
 *
 * Thin wrapper around the unified product-usage-policy system.
 * All credit deduction and usage tracking delegates to product-usage-policy.ts
 * as the single source of truth.
 *
 * PACKAGE RULE:
 *   5 Credits → 3 Full Engineering Diagnostic uses
 *   1 Full Diagnostic use consumed per successful generation
 *
 * Firestore (delegated to product-usage-policy):
 *   users/{uid}/productUsage/ENGINEERING_DIAGNOSTICS
 *     { remainingUses, totalUsesGranted, totalUsesConsumed, ... }
 */

import {
  checkProductUsage,
  grantProductUsesFromCredits,
  decrementProductUse,
  getProductUsageDoc,
  getRemainingProductUses,
  PRODUCT_KEYS,
  type ProductKey,
} from "@/lib/credits/product-usage-policy";

const PRODUCT_KEY: ProductKey = PRODUCT_KEYS.ENGINEERING_DIAGNOSTICS;

export const DIAGNOSTIC_PACKAGE_CREDITS = 5;
export const DIAGNOSTIC_PACKAGE_USES = 3;
export const FULL_DIAGNOSTIC_USE_COST = 1;

/* ── Read current usage ── */

/**
 * Get remaining diagnostic uses for a user from the unified product-usage system.
 */
export async function getRemainingDiagnosticUses(uid: string): Promise<number> {
  return getRemainingProductUses(uid, PRODUCT_KEY);
}

/* ── Access gate ── */

/**
 * Ensure the user has diagnostic access.
 *
 * Flow:
 * 1. If remainingUses > 0, return true immediately (no grant needed).
 * 2. If remainingUses == 0, try to grant from credits via product-usage-policy.
 * 3. If credits sufficient, deduct 5 and grant 3 uses.
 * 4. If insufficient, return false.
 */
export async function ensureDiagnosticAccess(uid: string): Promise<boolean> {
  // Check remaining uses first (fast path)
  const hasUsage = await checkProductUsage(uid, PRODUCT_KEY);
  if (hasUsage) {
    return true;
  }

  // No remaining uses — try to grant from credits
  const grantResult = await grantProductUsesFromCredits(uid, PRODUCT_KEY);
  if (!grantResult.ok) {
    return false;
  }

  return true;
}

/**
 * Decrement 1 diagnostic use after successful report generation.
 * Must only be called after PDF/report/Firestore writes succeed.
 */
export async function decrementDiagnosticUse(uid: string): Promise<boolean> {
  return decrementProductUse(uid, PRODUCT_KEY);
}
