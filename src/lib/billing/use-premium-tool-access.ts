"use client";

import {
 isDevelopmentProBypass,
 isProBypassEmail,
} from "@/lib/billing/subscription";
import { useUserPurchases } from "@/lib/billing/use-user-purchases";
import { useUserSubscription } from "@/lib/billing/use-user-subscription";

export type CreditConsumeResult = {
 ok: boolean;
 reason?: string;
};

export type CreditPackCheckoutInput = {
 toolSlug: string;
 returnPath: string;
 locale: string;
 creditPackSize: number;
};

export type UsePremiumToolAccessState = {
 user: ReturnType<typeof useUserSubscription>["user"];
 loading: boolean;
 error: string | null;
 isPro: boolean;
 isSuperUser: boolean;
 hasSinglePurchase: boolean;
 canAccessAnalyzer: boolean;
 /** P9 WIP stubs — safe defaults until credit billing ships. */
 creditBalance: number;
 hasCredits: boolean;
 needsCreditLoad: boolean;
 requiresCreditConsume: boolean;
 creditPending: boolean;
 consumeCreditForRun: (slug: string) => Promise<CreditConsumeResult>;
 startCreditPackCheckout: (input: CreditPackCheckoutInput) => Promise<void>;
 resetCreditRunSession: (slug: string) => void;
};

const CREDIT_STUBS = {
 creditBalance: 0,
 hasCredits: false,
 needsCreditLoad: false,
 requiresCreditConsume: false,
 creditPending: false,
 consumeCreditForRun: async (_slug: string): Promise<CreditConsumeResult> => ({ ok: true }),
 startCreditPackCheckout: async (_input: CreditPackCheckoutInput): Promise<void> => undefined,
 resetCreditRunSession: (_slug: string): void => undefined,
} as const;

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
 ...CREDIT_STUBS,
 };
}
