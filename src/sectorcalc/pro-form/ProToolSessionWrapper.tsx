"use client";

// SectorCalc Pro Tool Session Wrapper
// Client component that wraps UniversalIndustrialDecisionForm with credit session management.
// Handles session creation API calls and passes session state to the form.

import { useCallback, useEffect, useRef, useState } from "react";
import { UniversalIndustrialDecisionForm } from "./UniversalIndustrialDecisionForm";
import type { UniversalIndustrialDecisionFormProps } from "./UniversalIndustrialDecisionForm";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";

type ProToolSessionWrapperProps = Omit<UniversalIndustrialDecisionFormProps, "onRequestCreditSession" | "usageSessionId" | "remainingRuns" | "creditSessionLoading" | "executeAuthToken"> & {
  toolKey: string;
  /** Access tier: "PRO" (default) requires credits; "FREE" skips credit gating. */
  accessTier?: "FREE" | "PRO";
};

export function ProToolSessionWrapper(props: ProToolSessionWrapperProps) {
  const [usageSessionId, setUsageSessionId] = useState<string | null>(null);
  const [remainingRuns, setRemainingRuns] = useState<number | null>(null);
  const [creditSessionLoading, setCreditSessionLoading] = useState(false);
  const [executeAuthToken, setExecuteAuthToken] = useState<string | null>(null);
  const { user } = useUserSubscription();
  const tokenFetchedRef = useRef(false);

  // Fetch Firebase ID token on mount for execute API authorization
  useEffect(() => {
    if (user && !tokenFetchedRef.current) {
      tokenFetchedRef.current = true;
      user.getIdToken(false).then(setExecuteAuthToken).catch(() => {});
    }
  }, [user]);

  const handleRequestCreditSession = useCallback(async (toolKey: string) => {
    setCreditSessionLoading(true);
    try {
      if (!user) {
        window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
        return;
      }

      const idToken = await user.getIdToken(false);

      // Create session
      const response = await fetch("/api/pro-tool-session/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ toolKey }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        if (data.error === "INSUFFICIENT_CREDITS") {
          window.location.href = "/pricing";
          return;
        }
        throw new Error(data.error || "Failed to create session");
      }

      const session = await response.json();
      setUsageSessionId(session.usageSessionId);
      setRemainingRuns(session.remainingRuns);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to create Pro session:", err);
    } finally {
      setCreditSessionLoading(false);
    }
  }, [user]);

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
