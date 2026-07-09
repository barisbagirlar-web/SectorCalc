// SectorCalc PRO V5.3.1 — Baris Entitlement Guard (Key-Pool Model)
// Server-side only. Blocks execution if user has insufficient barisProKeys.
// Key-pool: users purchase key packs via Paddle, each tool execution costs 1 key.
import "server-only";

import { getBarisProduct } from "./baris-pro-products";
import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";

export type EntitlementResult =
  | { ok: true; reason: null }
  | { ok: false; reason: "PRO_ENTITLEMENT_REQUIRED" }
  | { ok: false; reason: "ASSISTED_DOSSIER_ONLY" }
  | { ok: false; reason: "BLOCKED_PAYMENT_INFRASTRUCTURE_NOT_BOUND" }
  | { ok: false; reason: "PRODUCT_NOT_FOUND" };

export interface EntitlementContext {
  toolKey: string;
  userId: string | null;
  userEmail: string | null;
}

/**
 * Check Baris PRO execution entitlement.
 * Instant calculators require user to have >= 1 barisProKey.
 * Assisted dossiers are never instant-executable.
 * Owner/Dev bypass via email check remains for testing.
 */
export async function checkBarisExecutionEntitlement(ctx: EntitlementContext): Promise<EntitlementResult> {
  const product = getBarisProduct(ctx.toolKey);
  if (!product) {
    return { ok: false, reason: "PRODUCT_NOT_FOUND" };
  }

  // Assisted dossier products are never instant-executable
  if (product.productMode === "ASSISTED_PRO_DOSSIER") {
    return { ok: false, reason: "ASSISTED_DOSSIER_ONLY" };
  }

  // Dev bypass: owner email or dev mode
  if (ctx.userEmail) {
    const ownerBypass = process.env.OWNER_BYPASS_EMAIL ?? "barisbagirlar@gmail.com";
    if (ctx.userEmail === ownerBypass || process.env.NODE_ENV === "development") {
      return { ok: true, reason: null };
    }
  }

  // Production: check credits/balance (single source of truth — identical path to session-create)
  // NOTE: barisProKeys top-level field is LEGACY; only credits/balance is written by Paddle webhook.
  if (!ctx.userId) {
    return { ok: false, reason: "PRO_ENTITLEMENT_REQUIRED" };
  }

  try {
    const db = getAdminFirestore();
    if (!db) {
      return { ok: false, reason: "BLOCKED_PAYMENT_INFRASTRUCTURE_NOT_BOUND" };
    }

    const balanceRef = db.collection("users").doc(ctx.userId).collection("credits").doc("balance");
    const snap = await balanceRef.get();
    const amount = snap.exists && typeof snap.data()?.amount === "number"
      ? snap.data()!.amount
      : 0;

    if (amount < 1) {
      return { ok: false, reason: "PRO_ENTITLEMENT_REQUIRED" };
    }

    return { ok: true, reason: null };
  } catch {
    return { ok: false, reason: "BLOCKED_PAYMENT_INFRASTRUCTURE_NOT_BOUND" };
  }
}

/**
 * Quick check: is this tool key allowed to execute at all?
 * Returns the failure reason if blocked, or null if execution is permitted.
 */
export function getBarisExecutionBlockReason(toolKey: string): string | null {
  const product = getBarisProduct(toolKey);
  if (!product) return null; // not a Baris tool, let existing pipeline handle it
  if (product.productMode === "ASSISTED_PRO_DOSSIER") return "ASSISTED_DOSSIER_ONLY";
  return null; // instant calculators can proceed to entitlement check
}
