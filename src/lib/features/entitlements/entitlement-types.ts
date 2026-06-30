export type EntitlementPlan = "single_report" | "pro" | "team";

export type EntitlementStatus = "active" | "expired" | "canceled" | "pending";

export type EntitlementSource = "stripe_checkout" | "admin_manual";

export type PremiumEntitlementRecord = {
  readonly id: string;
  readonly userId?: string;
  readonly stripeCustomerId?: string;
  readonly stripeSessionId?: string;
  readonly stripeSubscriptionId?: string;
  readonly stripePaymentIntentId?: string;
  readonly plan: EntitlementPlan;
  readonly status: EntitlementStatus;
  readonly premiumSlug?: string;
  readonly reportLimit?: number;
  readonly reportsUsed?: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly expiresAt?: string;
  readonly source: EntitlementSource;
};

export const PREMIUM_ENTITLEMENTS_COLLECTION = "premiumEntitlements";

export function entitlementDocIdForStripeSession(sessionId: string): string {
  return `stripe_session_${sessionId}`;
}

export function entitlementDocIdForStripeSubscription(subscriptionId: string): string {
  return `stripe_sub_${subscriptionId}`;
}
