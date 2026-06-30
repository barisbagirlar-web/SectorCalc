"use client";

import {
 isDevelopmentProBypass,
 isProBypassEmail,
} from "@/lib/billing/subscription";
import { useUserSubscription } from "@/lib/billing/use-user-subscription";

interface ProSubscriptionState {
 user: ReturnType<typeof useUserSubscription>["user"];
 loading: boolean;
 isPro: boolean;
 isSuperUser: boolean;
 subscription: ReturnType<typeof useUserSubscription>["subscription"];
}

/** Backward-compatible alias for billing subscription hook. */
export function useProSubscription(): ProSubscriptionState {
 const { user, subscription, isActive, loading } = useUserSubscription();
 const isSuperUser = isProBypassEmail(user?.email);
 const subscriptionActive = subscription?.status === "active";

 if (isDevelopmentProBypass()) {
 return { user, subscription, loading: false, isPro: true, isSuperUser };
 }

 return {
 user,
 loading,
 isPro: isSuperUser || subscriptionActive || isActive,
 isSuperUser,
 subscription,
 };
}
