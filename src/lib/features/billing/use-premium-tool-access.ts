"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  isDevelopmentProBypass,
  isProBypassEmail,
} from "@/lib/features/billing/subscription";
import { useUserPurchases } from "@/lib/features/billing/use-user-purchases";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { getFirebaseAuth } from "@/lib/infrastructure/firebase/auth";

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
  /** Real credit balance from Firestore. */
  creditBalance: number;
  /** True if user has remaining product uses OR sufficient credits to auto-grant. */
  hasCredits: boolean;
  /** True if user has no credits and no remaining uses — needs to purchase. */
  needsCreditLoad: boolean;
  /** True if this tool requires credit consumption (not free/subscription). */
  requiresCreditConsume: boolean;
  creditPending: boolean;
  /** Remaining product uses for current tool. */
  remainingUses: number;
  /** Total uses granted for current tool. */
  totalUsesGranted: number;
  consumeCreditForRun: (slug: string) => Promise<CreditConsumeResult>;
  startCreditPackCheckout: (input: CreditPackCheckoutInput) => Promise<void>;
  resetCreditRunSession: (slug: string) => void;
};

/* ── Tool slug → product key mapping ── */

function toolSlugToProductKey(slug: string): string {
  // The unified product usage API uses PRODUCT_KEYS.PRO_TOOLS for all premium/pro tools
  // Engineering Diagnostics and other products map separately.
  // For PremiumToolPage, all premium tools map to PRO_TOOLS.
  const lower = slug.toLowerCase();
  if (lower.includes("diagnostic") || lower.includes("engineering-diagnostic")) {
    return "ENGINEERING_DIAGNOSTICS";
  }
  return "PRO_TOOLS";
}

/* ── Hook ── */

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

  // ── Credit / usage state ──
  const [creditBalance, setCreditBalance] = useState(0);
  const [remainingUses, setRemainingUses] = useState(0);
  const [totalUsesGranted, setTotalUsesGranted] = useState(0);
  const [creditPending, setCreditPending] = useState(false);
  const [usageFetched, setUsageFetched] = useState(false);
  const fetchRef = useRef(false);

  const productKey = toolSlugToProductKey(toolSlug);

  // Fetch product usage data on mount
  useEffect(() => {
    if (fetchRef.current) return;
    if (!user && !devPro) return;

    fetchRef.current = true;

    const fetchData = async () => {
      try {
        const auth = getFirebaseAuth();
        const currentUser = auth?.currentUser;
        if (!currentUser) {
          setUsageFetched(true);
          return;
        }

        const token = await currentUser.getIdToken();
        const res = await fetch(
          `/api/user/product-usage?productKey=${encodeURIComponent(productKey)}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (res.ok) {
          const data = await res.json();
          setCreditBalance(data.creditBalance ?? 0);
          setRemainingUses(data.remainingUses ?? 0);
          setTotalUsesGranted(data.totalUsesGranted ?? 0);
        }
      } catch {
        // Silently fail — stubs will handle fallback
      } finally {
        setUsageFetched(true);
      }
    };

    fetchData();
  }, [user, productKey, devPro]);

  // Determine credit state
  // requiresCreditConsume: true if user is not pro and has no subscription bypass
  const requiresCreditConsume = !devPro && !isSuperUser && !isActive && !!user;

  // hasCredits: true if remainingUses > 0 OR creditBalance >= cost of 1 product
  const productCost = productKey === "ENGINEERING_DIAGNOSTICS" ? 5 : 1;
  const hasCredits = remainingUses > 0 || creditBalance >= productCost;

  // needsCreditLoad: true if has no remaining uses AND no credits to auto-grant
  const needsCreditLoad = requiresCreditConsume && !hasCredits && usageFetched;

  const consumeCreditForRun = useCallback(
    async (slug: string): Promise<CreditConsumeResult> => {
      const pk = toolSlugToProductKey(slug);
      setCreditPending(true);

      try {
        const auth = getFirebaseAuth();
        const currentUser = auth?.currentUser;
        if (!currentUser) {
          return { ok: false, reason: "NOT_AUTHENTICATED" };
        }

        const token = await currentUser.getIdToken();
        const res = await fetch("/api/user/product-usage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action: "consume", productKey: pk }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          if (body.error === "INSUFFICIENT_CREDITS") {
            return { ok: false, reason: "INSUFFICIENT_CREDITS" };
          }
          return { ok: false, reason: body.error ?? "CONSUME_FAILED" };
        }

        const data = await res.json();
        setCreditBalance(data.creditBalance ?? 0);
        setRemainingUses(data.remainingUses ?? 0);

        return { ok: true };
      } catch {
        return { ok: false, reason: "NETWORK_ERROR" };
      } finally {
        setCreditPending(false);
      }
    },
    [],
  );

  const startCreditPackCheckout = useCallback(
    async (_input: CreditPackCheckoutInput): Promise<void> => {
      // Redirect to pricing page
      window.location.href = "/pricing";
    },
    [],
  );

  const resetCreditRunSession = useCallback((_slug: string): void => {
    // No-op for the new unified system
  }, []);

  return {
    user,
    loading,
    error,
    isPro: devPro || isSuperUser || isActive,
    isSuperUser,
    hasSinglePurchase,
    canAccessAnalyzer,
    creditBalance,
    hasCredits,
    needsCreditLoad,
    requiresCreditConsume,
    creditPending,
    remainingUses,
    totalUsesGranted,
    consumeCreditForRun,
    startCreditPackCheckout,
    resetCreditRunSession,
  };
}
