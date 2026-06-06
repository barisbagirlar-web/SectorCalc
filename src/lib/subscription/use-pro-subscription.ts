"use client";

import { useUserSubscription } from "@/lib/billing/use-user-subscription";

interface ProSubscriptionState {
  user: ReturnType<typeof useUserSubscription>["user"];
  loading: boolean;
  isPro: boolean;
  subscription: ReturnType<typeof useUserSubscription>["subscription"];
}

/** Backward-compatible alias for billing subscription hook. */
export function useProSubscription(): ProSubscriptionState {
  const { user, subscription, isActive, loading } = useUserSubscription();

  return {
    user,
    loading,
    isPro: isActive,
    subscription,
  };
}
