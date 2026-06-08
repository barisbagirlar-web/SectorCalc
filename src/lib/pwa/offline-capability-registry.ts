/**
 * PWA offline capability registry — policy only, no service worker sync.
 */

export type OfflineCapabilityTier = "offline_safe" | "online_required" | "premium_gated";

export type OfflineCapabilityEntry = {
  readonly slug: string;
  readonly tier: "free" | "premium";
  readonly capability: OfflineCapabilityTier;
  readonly reason: string;
};

/** Free traffic tools with browser-only calc may be offline-safe when cached. */
export const OFFLINE_CAPABLE_FREE_SLUGS = [
  "vat-calculator",
  "percentage-calculator",
  "desi-calculator",
  "loan-payment-calculator",
] as const;

export const OFFLINE_ONLINE_REQUIRED_FEATURES = [
  "premium_gated_tools",
  "report_verification",
  "ai_assistant",
  "payment",
  "user_account",
  "firestore_feedback",
] as const;

export function isOfflineSafeFreeSlug(slug: string): boolean {
  return (OFFLINE_CAPABLE_FREE_SLUGS as readonly string[]).includes(slug);
}

export function resolveOfflineCapability(slug: string, tier: "free" | "premium"): OfflineCapabilityTier {
  if (tier === "premium") {
    return "premium_gated";
  }
  if (isOfflineSafeFreeSlug(slug)) {
    return "offline_safe";
  }
  return "online_required";
}
