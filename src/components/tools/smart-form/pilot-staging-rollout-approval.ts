/**
 * Smart form pilot staging rollout approval record — Phase 5H-G-L.
 */

import { getSmartFormPilotManualQaResults } from "@/components/tools/smart-form/pilot-manual-qa-result";
import { evaluateSmartFormPilotQaDecision } from "@/components/tools/smart-form/pilot-qa-decision-gate";
import { PILOT_CALCULATION_BRIDGE_GOVERNANCE_SLUGS } from "@/lib/formula-governance/smart-form-ui-bridge/pilot-calculation-bridge-registry";

export const SMART_FORM_PILOT_STAGING_FLAG_NAME = "NEXT_PUBLIC_SMART_FORM_PILOT" as const;

export type SmartFormPilotStagingRolloutApprovalStatus =
  | "pending_approval"
  | "approved_for_staging"
  | "blocked";

export type SmartFormPilotStagingRolloutApproval = {
  readonly approvedBy: string;
  readonly approvedAt: string;
  readonly scope: "staging_flag_only";
  readonly pilotSlugs: readonly string[];
  readonly flagName: typeof SMART_FORM_PILOT_STAGING_FLAG_NAME;
  readonly manualQaStatus: string;
  readonly stagingFlagReady: boolean;
  readonly deploymentReady: false;
  readonly rollbackRequired: boolean;
  readonly smokeTestRequired: boolean;
  readonly notes: string;
  readonly status: SmartFormPilotStagingRolloutApprovalStatus;
};

function buildApprovalBase(
  status: SmartFormPilotStagingRolloutApprovalStatus,
  overrides: Partial<
    Pick<
      SmartFormPilotStagingRolloutApproval,
      "approvedBy" | "approvedAt" | "notes" | "rollbackRequired" | "smokeTestRequired"
    >
  > = {},
): SmartFormPilotStagingRolloutApproval {
  const manualQaResults = getSmartFormPilotManualQaResults().results;
  const qaDecision = evaluateSmartFormPilotQaDecision(manualQaResults);

  return {
    approvedBy: overrides.approvedBy ?? "",
    approvedAt: overrides.approvedAt ?? "",
    scope: "staging_flag_only",
    pilotSlugs: [...PILOT_CALCULATION_BRIDGE_GOVERNANCE_SLUGS],
    flagName: SMART_FORM_PILOT_STAGING_FLAG_NAME,
    manualQaStatus: qaDecision.manualQaStatus,
    stagingFlagReady: qaDecision.stagingFlagReady,
    deploymentReady: false,
    rollbackRequired: overrides.rollbackRequired ?? true,
    smokeTestRequired: overrides.smokeTestRequired ?? true,
    notes:
      overrides.notes ??
      "Awaiting explicit human approval for staging flag rollout.",
    status,
  };
}

export function getDefaultSmartFormPilotStagingRolloutApproval(): SmartFormPilotStagingRolloutApproval {
  return buildApprovalBase("pending_approval");
}

export function buildApprovedSmartFormPilotStagingRolloutApproval(
  overrides: Partial<
    Pick<
      SmartFormPilotStagingRolloutApproval,
      "approvedBy" | "approvedAt" | "notes" | "rollbackRequired" | "smokeTestRequired"
    >
  > = {},
): SmartFormPilotStagingRolloutApproval {
  return buildApprovalBase("approved_for_staging", {
    approvedBy: overrides.approvedBy ?? "staging-ops",
    approvedAt: overrides.approvedAt ?? "2026-06-08T00:00:00.000Z",
    notes:
      overrides.notes ??
      "Explicit human approval recorded for staging flag rollout only.",
    ...overrides,
  });
}
