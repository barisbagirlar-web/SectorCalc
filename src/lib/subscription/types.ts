export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "none";

export interface UserSubscription {
  status: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  currentPeriodEnd?: string;
  updatedAt?: string;
}

export interface UserProfile {
  email?: string;
  subscription?: UserSubscription;
}
