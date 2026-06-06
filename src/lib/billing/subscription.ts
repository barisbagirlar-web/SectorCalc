import type { UserSubscription } from "@/lib/subscription/types";

/**
 * Firestore-backed subscription check.
 * Subscription writes happen only via stripeWebhook Cloud Function.
 */
export function hasActiveSubscription(
  subscription: UserSubscription | null | undefined
): boolean {
  if (!subscription) {
    return false;
  }

  return subscription.status === "active";
}

/** v1C fallback when no subscription document exists — defaults to paywall. */
export function hasActiveSubscriptionMock(): boolean {
  return false;
}

export function resolvePremiumToolAccess(
  subscription: UserSubscription | null | undefined
): boolean {
  if (hasActiveSubscription(subscription)) {
    return true;
  }
  return hasActiveSubscriptionMock();
}

export const PREMIUM_SUBSCRIPTION_NOTE =
  "SectorCalc Pro renews monthly. Digital product. No refunds.";

export const PRICING_CHECKOUT_LEGAL =
  "Subscription renews monthly. Cancel anytime. Digital product. No refunds. Estimates only; verify before business decisions.";
