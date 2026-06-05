export type SubscriptionStatus =
  | "active"
  | "inactive"
  | "canceled"
  | "past_due"
  | "trialing";

export interface UserSubscription {
  status: SubscriptionStatus;
  plan: "pro";
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: string;
  updatedAt?: string;
}

export interface UserProfile {
  email?: string;
  subscription?: UserSubscription;
}
