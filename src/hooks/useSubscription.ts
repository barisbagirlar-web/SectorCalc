"use client";

import {
 isDevelopmentProBypass,
 isProBypassEmail,
} from "@/lib/features/billing/subscription";
import { canAccessPremiumRoute } from "@/lib/features/auth/premium-route-access";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";

export type UseSubscriptionState = {
 user: ReturnType<typeof useUserSubscription>["user"];
 loading: boolean;
 isPro: boolean;
 isSuperUser: boolean;
};

/** Pro access: active subscription, super-user email, or dev bypass. */
export function useSubscription(): UseSubscriptionState {
 const { user, subscription, isActive, loading } = useUserSubscription();

 // BARIS BAGIRLAR — tam yetki bypass (production + local)
 const isSuperUser = isProBypassEmail(user?.email);

 if (isDevelopmentProBypass()) {
 return { user, loading: false, isPro: true, isSuperUser };
 }

 const isPro =
 isSuperUser ||
 canAccessPremiumRoute({
 email: user?.email,
 subscriptionStatus: subscription?.status,
 }) ||
 isActive;

 return {
 user,
 loading,
 isPro,
 isSuperUser,
 };
}
