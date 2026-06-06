import { isProSubscriptionActive } from "@/lib/tools/revenue-tools";
import type { UserSubscription } from "@/lib/subscription/types";

/**
 * Firestore-backed subscription check.
 * Wire Stripe webhook updates to users/{uid}.subscription in a later phase.
 */
export function hasActiveSubscription(
  subscription: UserSubscription | null | undefined
): boolean {
  if (!subscription) {
    return false;
  }

  return isProSubscriptionActive(
    subscription.status,
    subscription.currentPeriodEnd
  );
}

/** v1C fallback when no subscription document exists — defaults to paywall. */
export function hasActiveSubscriptionMock(): boolean {
  return false;
}

export function resolvePremiumToolAccess(
  subscription: UserSubscription | null | undefined
): boolean {
  const active = hasActiveSubscription(subscription);
  if (active) {
    return true;
  }
  return hasActiveSubscriptionMock();
}

export const PREMIUM_SUBSCRIPTION_NOTE =
  "SectorCalc Pro renews monthly. Digital product. No refunds.";
