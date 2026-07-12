"use client";

// SectorCalc Pro Tool Session Wrapper
// Client component that wraps UniversalIndustrialDecisionForm with credit session management.
// Handles session creation API calls and passes session state to the form.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UniversalIndustrialDecisionForm } from "./UniversalIndustrialDecisionForm";
import type { UniversalIndustrialDecisionFormProps } from "./UniversalIndustrialDecisionForm";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { isProBypassEmail } from "@/lib/features/billing/subscription";

const BYPASS_SESSION_ID = "bypass-unlimited";

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
  const tokenRequestSeqRef = useRef(0);

  const isBypassUser = useMemo(
    () => Boolean(user?.email && isProBypassEmail(user.email)),
    [user?.email],
  );

  // Tool changes must never inherit another calculator's credit/session/auth state.
  // This also protects client-side navigation where React may reuse the wrapper instance.
  useEffect(() => {
    tokenRequestSeqRef.current += 1;
    setUsageSessionId(null);
    setRemainingRuns(null);
    setCreditSessionLoading(false);
    setExecuteAuthToken(null);
  }, [props.toolKey]);

  // Fetch a Firebase ID token for the current user/tool pair. Ignore stale async
  // completions after route or user changes.
  useEffect(() => {
    const requestSeq = ++tokenRequestSeqRef.current;

    if (!user) {
      setExecuteAuthToken(null);
      return;
    }

    setExecuteAuthToken(null);
    user
      .getIdToken(false)
      .then((token) => {
        if (tokenRequestSeqRef.current === requestSeq) {
          setExecuteAuthToken(token);
        }
      })
      .catch(() => {
        if (tokenRequestSeqRef.current === requestSeq) {
          setExecuteAuthToken(null);
        }
      });
  }, [user, props.toolKey]);

  // Owner bypass: set an unlimited session only for the current tool/user.
  useEffect(() => {
    if (isBypassUser) {
      setUsageSessionId(BYPASS_SESSION_ID);
      setRemainingRuns(999);
      return;
    }

    setUsageSessionId(null);
    setRemainingRuns(null);
  }, [isBypassUser, props.toolKey]);

  const handleRequestCreditSession = useCallback(async (toolKey: string) => {
    if (!user) {
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    // Owner bypass already has unlimited session. Refresh the token if needed so
    // the execution request cannot race Firebase Auth hydration.
    if (isBypassUser) {
      if (!executeAuthToken) {
        setCreditSessionLoading(true);
        try {
          const token = await user.getIdToken(true);
          setExecuteAuthToken(token);
        } finally {
          setCreditSessionLoading(false);
        }
      }
      return;
    }

    setCreditSessionLoading(true);
    try {
      const idToken = executeAuthToken ?? await user.getIdToken(false);
      if (!executeAuthToken) setExecuteAuthToken(idToken);

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
  }, [user, isBypassUser, executeAuthToken]);

  const authHydrating = Boolean(user && !executeAuthToken);
  const formInstanceKey = `${props.toolKey}:${props.schema.tool_id}`;

  return (
    <UniversalIndustrialDecisionForm
      key={formInstanceKey}
      {...props}
      accessTier={props.accessTier ?? "PRO"}
      isSignedIn={!!user}
      usageSessionId={usageSessionId}
      remainingRuns={remainingRuns}
      creditSessionLoading={creditSessionLoading || authHydrating}
      executeAuthToken={executeAuthToken}
      onRequestCreditSession={handleRequestCreditSession}
    />
  );
}
