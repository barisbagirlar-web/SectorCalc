import type { SubscriptionStatus, UserSubscription } from "@/lib/billing/subscription";

export type { SubscriptionStatus, UserSubscription };

export interface UserProfile {
 email?: string;
 subscription?: UserSubscription;
}
