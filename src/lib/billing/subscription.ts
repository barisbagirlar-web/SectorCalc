export type SubscriptionStatus = "active" | "canceled" | "past_due" | "none";

export type UserSubscription = {
  status: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  currentPeriodEnd?: string;
  updatedAt?: string;
};

export function hasActiveSubscription(
  subscription?: UserSubscription | null
): boolean {
  return subscription?.status === "active";
}

export const PREMIUM_SUBSCRIPTION_NOTE =
  "SectorCalc Pro renews monthly. Digital product. No refunds.";

export const PRICING_CHECKOUT_LEGAL =
  "Subscription renews monthly. Cancel anytime. Digital product. No refunds. Estimates only; verify before business decisions.";

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
