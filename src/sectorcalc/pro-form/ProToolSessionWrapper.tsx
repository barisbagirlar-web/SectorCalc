"use client";

// SectorCalc Pro Tool Session Wrapper
// Client component that wraps UniversalIndustrialDecisionForm with
// unified product-usage credit management.
//
// Uses the product-usage-policy system (single source of truth):
//   1 credit → 3 Pro Tool uses
//
// Flow:
//   1. On mount, fetch remaining uses from /api/user/product-usage
//   2. If remaining uses > 0, allow execution (execute API decrements server-side)
//   3. If no remaining uses, show "Use 1 credit" button
//   4. Calls /api/user/product-usage to consume/grant
//   5. Remaining runs decremented server-side by /api/pro-calculator/execute

import { useCallback, useEffect, useRef, useState } from "react";
import { UniversalIndustrialDecisionForm } from "./UniversalIndustrialDecisionForm";
import type { UniversalIndustrialDecisionFormProps } from "./UniversalIndustrialDecisionForm";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { isProBypassEmail } from "@/lib/features/billing/subscription";
import { getFirebaseAuth } from "@/lib/infrastructure/firebase/auth";

const BYPASS_SESSION_ID = "bypass-unlimited";

type ProToolSessionWrapperProps = Omit<
  UniversalIndustrialDecisionFormProps,
  "onRequestCreditSession" | "usageSessionId" | "remainingRuns" | "creditSessionLoading" | "executeAuthToken"
> & {
  toolKey: string;
  accessTier?: "FREE" | "PRO";
};

export function ProToolSessionWrapper(props: ProToolSessionWrapperProps) {
  const [usageSessionId, setUsageSessionId] = useState<string | null>(null);
  const [remainingRuns, setRemainingRuns] = useState<number | null>(null);
  const [creditSessionLoading, setCreditSessionLoading] = useState(false);
  const [executeAuthToken, setExecuteAuthToken] = useState<string | null>(null);
  const { user } = useUserSubscription();
  const tokenFetchedRef = useRef(false);
  const usageFetchedRef = useRef(false);

  // Fetch Firebase ID token on mount
  useEffect(() => {
    if (user && !tokenFetchedRef.current) {
      tokenFetchedRef.current = true;
      user.getIdToken(false).then(setExecuteAuthToken).catch(() => {});
    }
  }, [user]);

  // Owner bypass: auto-set unlimited session on mount
  useEffect(() => {
    if (user?.email && isProBypassEmail(user.email)) {
      setUsageSessionId(BYPASS_SESSION_ID);
      setRemainingRuns(999);
    }
  }, [user?.email]);

  // Fetch remaining product uses on mount via unified API
  useEffect(() => {
    if (usageFetchedRef.current) return;
    if (!user) return;
    if (user?.email && isProBypassEmail(user.email)) return;

    usageFetchedRef.current = true;

    const fetchUsage = async () => {
      try {
        const auth = getFirebaseAuth();
        const currentUser = auth?.currentUser;
        if (!currentUser) return;

        const token = await currentUser.getIdToken();
        const res = await fetch(
          `/api/user/product-usage?productKey=${encodeURIComponent("PRO_TOOLS")}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (res.ok) {
          const data = await res.json();
          if (data.remainingUses > 0) {
            setUsageSessionId("unified");
            setRemainingRuns(data.remainingUses);
          } else {
            setUsageSessionId(null);
            setRemainingRuns(null);
          }
        }
      } catch {
        // Silent fallback — user will see credit gate
      }
    };

    fetchUsage();
  }, [user]);

  const handleRequestCreditSession = useCallback(
    async (toolKey: string) => {
      if (user?.email && isProBypassEmail(user.email)) {
        setUsageSessionId(BYPASS_SESSION_ID);
        setRemainingRuns(999);
        return;
      }

      setCreditSessionLoading(true);
      try {
        if (!user) {
          window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
          return;
        }

        const auth = getFirebaseAuth();
        const currentUser = auth?.currentUser;
        if (!currentUser) {
          window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
          return;
        }

        const token = await currentUser.getIdToken();
        const res = await fetch("/api/user/product-usage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action: "consume", productKey: "PRO_TOOLS" }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          if (data.error === "INSUFFICIENT_CREDITS") {
            window.location.href = "/pricing";
            return;
          }
          throw new Error(data.error || "Failed to consume product use");
        }

        const data = await res.json();
        setUsageSessionId("unified");
        setRemainingRuns(data.remainingUses);
      } catch (err) {
        console.error("Failed to create Pro session:", err);
      } finally {
        setCreditSessionLoading(false);
      }
    },
    [user],
  );

  return (
    <UniversalIndustrialDecisionForm
      {...props}
      accessTier={props.accessTier ?? "PRO"}
      isSignedIn={!!user}
      usageSessionId={usageSessionId}
      remainingRuns={remainingRuns}
      creditSessionLoading={creditSessionLoading}
      executeAuthToken={executeAuthToken}
      onRequestCreditSession={handleRequestCreditSession}
    />
  );
}
