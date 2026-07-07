// SectorCalc PRO V5.3.1 — Baris Entitlement Guard
// Server-side only. Blocks execution if entitlement is missing.
// Binds to existing subscription infrastructure: hasProAccess().
import "server-only";

import { getBarisProduct } from "./baris-pro-products";
import { hasProAccess } from "@/lib/features/billing/subscription";

export type EntitlementResult =
  | { ok: true; reason: null }
  | { ok: false; reason: "PRO_ENTITLEMENT_REQUIRED" }
  | { ok: false; reason: "ASSISTED_DOSSIER_ONLY" }
  | { ok: false; reason: "BLOCKED_PAYMENT_INFRASTRUCTURE_NOT_BOUND" }
  | { ok: false; reason: "PRODUCT_NOT_FOUND" };

export interface EntitlementContext {
  toolKey: string;
  userEmail: string | null;
  subscriptionStatus?: string;
}

export function checkBarisExecutionEntitlement(ctx: EntitlementContext): EntitlementResult {
  const product = getBarisProduct(ctx.toolKey);
  if (!product) {
    return { ok: false, reason: "PRODUCT_NOT_FOUND" };
  }

  // Assisted dossier products are never instant-executable
  if (product.productMode === "ASSISTED_PRO_DOSSIER") {
    return { ok: false, reason: "ASSISTED_DOSSIER_ONLY" };
  }

  // Instant calculator: require entitlement
  if (!ctx.userEmail) {
    return { ok: false, reason: "PRO_ENTITLEMENT_REQUIRED" };
  }

  try {
    const hasAccess = hasProAccess(
      ctx.subscriptionStatus ? { status: ctx.subscriptionStatus as any } : null,
      ctx.userEmail
    );
    if (!hasAccess) {
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
