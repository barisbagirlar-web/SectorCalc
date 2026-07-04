"use client";

// SectorCalc Pro Tool Session Wrapper
// Client component that wraps UniversalIndustrialDecisionForm with credit session management.
// Handles session creation API calls and passes session state to the form.

import { useCallback, useState } from "react";
import { UniversalIndustrialDecisionForm } from "./UniversalIndustrialDecisionForm";
import type { UniversalIndustrialDecisionFormProps } from "./UniversalIndustrialDecisionForm";

type ProToolSessionWrapperProps = Omit<UniversalIndustrialDecisionFormProps, "accessTier" | "onRequestCreditSession" | "usageSessionId" | "remainingRuns" | "creditSessionLoading"> & {
  toolKey: string;
};

export function ProToolSessionWrapper(props: ProToolSessionWrapperProps) {
  const [usageSessionId, setUsageSessionId] = useState<string | null>(null);
  const [remainingRuns, setRemainingRuns] = useState<number | null>(null);
  const [creditSessionLoading, setCreditSessionLoading] = useState(false);

  const handleRequestCreditSession = useCallback(async (toolKey: string) => {
    setCreditSessionLoading(true);
    try {
      // Get auth token
      const tokenResult = await fetch("/api/auth/session");
      if (!tokenResult.ok) {
        // Redirect to login
        window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        return;
      }

      const tokenData = await tokenResult.json();
      const idToken = tokenData.idToken;

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
  }, []);

  return (
    <UniversalIndustrialDecisionForm
      {...props}
      accessTier="PRO"
      usageSessionId={usageSessionId}
      remainingRuns={remainingRuns}
      creditSessionLoading={creditSessionLoading}
      onRequestCreditSession={handleRequestCreditSession}
    />
  );
}
