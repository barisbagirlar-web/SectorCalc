export type SubscriptionStatus = "active" | "canceled" | "past_due" | "none";

export type UserSubscription = {
 status: SubscriptionStatus;
 stripeCustomerId?: string;
 stripeSubscriptionId?: string;
 stripePriceId?: string;
 currentPeriodEnd?: string;
 updatedAt?: string;
};

export const PRO_BYPASS_EMAIL = "barisbagirlar@gmail.com";

export function isProBypassEmail(email: string | null | undefined): boolean {
 if (!email) {
 return false;
 }

 return email.toLowerCase() === PRO_BYPASS_EMAIL.toLowerCase();
}

export function hasActiveSubscription(
 subscription?: UserSubscription | null
): boolean {
 return subscription?.status === "active";
}

/** Force Pro in local development (client hooks only). */
export function isDevelopmentProBypass(): boolean {
 return process.env.NODE_ENV === "development";
}

/** Active Stripe subscription, owner bypass email, or local dev bypass. */
export function hasProAccess(
 subscription?: UserSubscription | null,
 email?: string | null
): boolean {
 return (
 hasActiveSubscription(subscription) ||
 isProBypassEmail(email) ||
 isDevelopmentProBypass()
 );
}

export const PREMIUM_SUBSCRIPTION_NOTE =
 "SectorCalc Pro renews monthly. Digital product. No refunds.";

export const PRICING_CHECKOUT_LEGAL =
 "Subscription renews monthly. Cancel anytime. Digital product. No refunds. Estimates only. Not financial, legal or engineering advice. Verify all outputs before making business decisions.";

/** @deprecated Use hasActiveSubscription — mock always false in v1E */
export function hasActiveSubscriptionMock(): boolean {
 return false;
}

/** @deprecated Use hasActiveSubscription directly */
export function resolvePremiumToolAccess(
 subscription: UserSubscription | null | undefined
): boolean {
 return hasActiveSubscription(subscription);
}

export function normalizeUserSubscription(value: unknown): UserSubscription | null {
 if (!value || typeof value !== "object") {
 return null;
 }

 const data = value as Record<string, unknown>;
 const rawStatus = data.status;

 const status: SubscriptionStatus =
 rawStatus === "active" ||
 rawStatus === "canceled" ||
 rawStatus === "past_due" ||
 rawStatus === "none"
 ? rawStatus
 : "none";

 return {
 status,
 stripeCustomerId:
 typeof data.stripeCustomerId === "string" ? data.stripeCustomerId : undefined,
 stripeSubscriptionId:
 typeof data.stripeSubscriptionId === "string"
 ? data.stripeSubscriptionId
 : undefined,
 stripePriceId:
 typeof data.stripePriceId === "string" ? data.stripePriceId : undefined,
 currentPeriodEnd:
 typeof data.currentPeriodEnd === "string" ? data.currentPeriodEnd : undefined,
 updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : undefined,
 };
}
