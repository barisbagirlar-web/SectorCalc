// SectorCalc PRO V2 — Client Wrapper
// Handles Firebase auth state, debug mode param, tool registry lookup, and renders ProExecutionFormV2.

"use client";

import { useEffect, useState } from "react";
import ProExecutionFormV2 from "./ProExecutionFormV2";
import type { ProFieldContract, ProFieldGroup } from "./proFieldContract";
import type { ProPreset, ProReportAdapter, ProExecutePayloadAdapter } from "./proToolRegistry";
import { getToolDefinition } from "./init-registry";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";

interface ProV2WrapperProps {
  toolKey: string;
  toolName: string;
  groups: ProFieldGroup[];
  hiddenFields: ProFieldContract[];
  executeEndpoint: string;
  debugRuntime?: boolean;
}

export function ProV2Wrapper(props: ProV2WrapperProps) {
  const { toolKey, toolName, groups, hiddenFields, executeEndpoint, debugRuntime } = props;
  const { user, loading } = useUserSubscription();
  const [idToken, setIdToken] = useState<string | null>(null);

  // Look up registry for presets, report builder, and execute payload adapter
  const def = getToolDefinition(toolKey);
  const presets: ProPreset[] = def?.presets ?? [];
  const buildReport: ProReportAdapter | undefined = def?.buildReport;
  const buildExecutePayload: ProExecutePayloadAdapter | undefined = def?.buildExecutePayload;

  useEffect(() => {
    if (user) {
      user.getIdToken(false).then(setIdToken).catch(() => setIdToken(null));
    } else {
      setIdToken(null);
    }
  }, [user]);

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>
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
      executeEndpoint={executeEndpoint}
      isSignedIn={!!user}
      idToken={idToken}
      debugRuntime={debugRuntime}
      presets={presets}
      buildReport={buildReport}
      buildExecutePayload={buildExecutePayload}
    />
  );
}
