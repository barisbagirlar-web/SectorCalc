// SectorCalc PRO V2 — Client Wrapper
// Handles Firebase auth state, debug mode param, and renders ProExecutionFormV2.
// Uses the established useUserSubscription hook for auth (matching ProToolSessionWrapper pattern).

"use client";

import { useEffect, useState } from "react";
import ProExecutionFormV2 from "./ProExecutionFormV2";
import type { ProFieldContract, ProFieldGroup } from "./proFieldContract";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";

interface ProV2WrapperProps {
  toolKey: string;
  toolName: string;
  groups: ProFieldGroup[];
  hiddenFields: ProFieldContract[];
  fieldDefaults: Record<string, string>;
  executeEndpoint: string;
  debugRuntime?: boolean;
}

export function ProV2Wrapper(props: ProV2WrapperProps) {
  const { toolKey, toolName, groups, hiddenFields, fieldDefaults, executeEndpoint, debugRuntime } = props;
  const { user, loading } = useUserSubscription();
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      user.getIdToken(false).then(setIdToken).catch(() => setIdToken(null));
    } else {
      setIdToken(null);
    }
  }, [user]);

  // Loading only on initial mount while Firebase restores auth state
  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: "#888",
          fontSize: "14px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <ProExecutionFormV2
      toolKey={toolKey}
      toolName={toolName}
      groups={groups}
      hiddenFields={hiddenFields}
      fieldDefaults={fieldDefaults}
      executeEndpoint={executeEndpoint}
      isSignedIn={!!user}
      idToken={idToken}
      debugRuntime={debugRuntime}
    />
  );
}
