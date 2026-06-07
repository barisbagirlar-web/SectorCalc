"use client";

import {
 isDevelopmentProBypass,
 isProBypassEmail,
} from "@/lib/billing/subscription";
import { useUserPurchases } from "@/lib/billing/use-user-purchases";
import { useUserSubscription } from "@/lib/billing/use-user-subscription";

export type UsePremiumToolAccessState = {
 user: ReturnType<typeof useUserSubscription>["user"];
 loading: boolean;
 error: string | null;
 isPro: boolean;
 isSuperUser: boolean;
 hasSinglePurchase: boolean;
 canAccessAnalyzer: boolean;
};

export function usePremiumToolAccess(toolSlug: string): UsePremiumToolAccessState {
 const {
 user,
 isActive,
 loading: subscriptionLoading,
 error: subscriptionError,
 } = useUserSubscription();
 const {
 loading: purchasesLoading,
 error: purchasesError,
 hasSingleReportForTool,
 } = useUserPurchases();

 const hasSinglePurchase = hasSingleReportForTool(toolSlug);
 const isSuperUser = isProBypassEmail(user?.email);
 const devPro = isDevelopmentProBypass();
 const canAccessAnalyzer = devPro || isSuperUser || isActive || hasSinglePurchase;
 const loading = devPro ? false : subscriptionLoading || purchasesLoading;
 const error = subscriptionError ?? purchasesError;

 return {
 user,
 loading,
 error,
 isPro: devPro || isSuperUser || isActive,
 isSuperUser,
 hasSinglePurchase,
 canAccessAnalyzer,
 };
}
