/**
 * Smart form pilot staging rollout approval record - Phase 5H-G-L/M.
 */

import { getProductionDeployedManualQaResults } from "@/components/tools/smart-form/pilot-manual-qa-result";
import { evaluateSmartFormPilotQaDecision } from "@/components/tools/smart-form/pilot-qa-decision-gate";
import { PRODUCTION_DEPLOYED_PILOT_GOVERNANCE_SLUGS } from "@/lib/features/formula-governance/smart-form-ui-bridge/pilot-calculation-bridge-registry";

export const SMART_FORM_PILOT_STAGING_FLAG_NAME = "NEXT_PUBLIC_SMART_FORM_PILOT" as const;

export const SMART_FORM_PILOT_STAGING_APPROVED_BY = "Baris Bagirlar" as const;

/** Deterministic ISO timestamp for tests and rollout record. */
export const SMART_FORM_PILOT_STAGING_APPROVAL_AT = "2026-06-08T18:00:00.000Z" as const;

export const SMART_FORM_PILOT_STAGING_APPROVAL_NOTES =
  "Manual QA passed for 3 Smart Form pilots. Approval is limited to staging flag rollout only. Production deployment requires separate explicit approval." as const;

export type SmartFormPilotStagingRolloutApprovalStatus =
  | "pending_approval"
  | "approved_for_staging"
  | "blocked";

export type SmartFormPilotStagingRolloutScope = "staging_flag_only";

export type SmartFormPilotStagingRolloutApproval = {
  readonly approvedBy: string;
  readonly approvedAt: string;
  readonly scope: SmartFormPilotStagingRolloutScope;
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
      | "approvedBy"
      | "approvedAt"
      | "notes"
      | "rollbackRequired"
      | "smokeTestRequired"
      | "scope"
      | "manualQaStatus"
      | "stagingFlagReady"
    >
  > = {},
): SmartFormPilotStagingRolloutApproval {
  const manualQaResults = getProductionDeployedManualQaResults().results;
  const qaDecision = evaluateSmartFormPilotQaDecision(manualQaResults);

  return {
    approvedBy: overrides.approvedBy ?? "",
    approvedAt: overrides.approvedAt ?? "",
    scope: overrides.scope ?? "staging_flag_only",
    pilotSlugs: [...PRODUCTION_DEPLOYED_PILOT_GOVERNANCE_SLUGS],
    flagName: SMART_FORM_PILOT_STAGING_FLAG_NAME,
    manualQaStatus: overrides.manualQaStatus ?? qaDecision.manualQaStatus,
    stagingFlagReady: overrides.stagingFlagReady ?? qaDecision.stagingFlagReady,
    deploymentReady: false,
    rollbackRequired: overrides.rollbackRequired ?? true,
    smokeTestRequired: overrides.smokeTestRequired ?? true,
    notes:
      overrides.notes ??
      "Awaiting explicit human approval for staging flag rollout.",
    status,
  };
}

export function getPendingSmartFormPilotStagingRolloutApproval(): SmartFormPilotStagingRolloutApproval {
  return buildApprovalBase("pending_approval");
}

export function getDefaultSmartFormPilotStagingRolloutApproval(): SmartFormPilotStagingRolloutApproval {
  return buildApprovedSmartFormPilotStagingRolloutApproval();
}

export function buildApprovedSmartFormPilotStagingRolloutApproval(
  overrides: Partial<
    Pick<
      SmartFormPilotStagingRolloutApproval,
      | "approvedBy"
      | "approvedAt"
      | "notes"
      | "rollbackRequired"
      | "smokeTestRequired"
      | "scope"
      | "manualQaStatus"
      | "stagingFlagReady"
    >
  > = {},
): SmartFormPilotStagingRolloutApproval {
  return buildApprovalBase("approved_for_staging", {
    approvedBy: overrides.approvedBy ?? SMART_FORM_PILOT_STAGING_APPROVED_BY,
    approvedAt: overrides.approvedAt ?? SMART_FORM_PILOT_STAGING_APPROVAL_AT,
    manualQaStatus: overrides.manualQaStatus ?? "passed",
    stagingFlagReady: overrides.stagingFlagReady ?? true,
    notes: overrides.notes ?? SMART_FORM_PILOT_STAGING_APPROVAL_NOTES,
    ...overrides,
  });
}

export function isStagingFlagOnlyApprovalScope(
  scope: SmartFormPilotStagingRolloutApproval["scope"],
): boolean {
  return scope === "staging_flag_only";
}
