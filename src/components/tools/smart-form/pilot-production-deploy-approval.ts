/**
 * Smart form pilot production deploy approval record — Phase 5H-G-P.
 */

import { getSmartFormPilotManualQaResults } from "@/components/tools/smart-form/pilot-manual-qa-result";
import { evaluateSmartFormPilotQaDecision } from "@/components/tools/smart-form/pilot-qa-decision-gate";
import { runSmartFormPilotStagingRolloutAudit } from "@/components/tools/smart-form/pilot-staging-rollout-audit";
import { runSmartFormPilotStagingSmokeTestAudit } from "@/components/tools/smart-form/pilot-staging-smoke-test-audit";
import {
  SMART_FORM_PILOT_STAGING_FLAG_NAME,
} from "@/components/tools/smart-form/pilot-staging-rollout-approval";
import { PILOT_CALCULATION_BRIDGE_GOVERNANCE_SLUGS } from "@/lib/formula-governance/smart-form-ui-bridge/pilot-calculation-bridge-registry";

export type SmartFormPilotProductionDeployApprovalStatus =
  | "pending_approval"
  | "approved_for_production"
  | "blocked";

export type SmartFormPilotProductionDeployScope = "production_deploy";

export type SmartFormPilotProductionDeployApproval = {
  readonly approvedBy: string;
  readonly approvedAt: string;
  readonly scope: SmartFormPilotProductionDeployScope;
  readonly pilotSlugs: readonly string[];
  readonly flagName: typeof SMART_FORM_PILOT_STAGING_FLAG_NAME;
  readonly manualQaStatus: string;
  readonly stagingRolloutReady: boolean;
  readonly stagingSmokePassed: boolean;
  readonly productionDeployApproved: boolean;
  readonly rollbackRequired: boolean;
  readonly postDeploySmokeRequired: boolean;
  readonly monitoringRequired: boolean;
  readonly notes: string;
  readonly status: SmartFormPilotProductionDeployApprovalStatus;
};

function resolveStagingSignals(): {
  readonly manualQaStatus: string;
  readonly stagingRolloutReady: boolean;
  readonly stagingSmokePassed: boolean;
} {
  const manualQaResults = getSmartFormPilotManualQaResults().results;
  const qaDecision = evaluateSmartFormPilotQaDecision(manualQaResults);
  const rolloutAudit = runSmartFormPilotStagingRolloutAudit();
  const smokeAudit = runSmartFormPilotStagingSmokeTestAudit();

  return {
    manualQaStatus: qaDecision.manualQaStatus,
    stagingRolloutReady: rolloutAudit.rolloutDecision.stagingRolloutReady,
    stagingSmokePassed: smokeAudit.smokeTestDecision.stagingSmokePassed,
  };
}

function buildApprovalBase(
  status: SmartFormPilotProductionDeployApprovalStatus,
  overrides: Partial<
    Pick<
      SmartFormPilotProductionDeployApproval,
      | "approvedBy"
      | "approvedAt"
      | "notes"
      | "rollbackRequired"
      | "postDeploySmokeRequired"
      | "monitoringRequired"
      | "scope"
      | "manualQaStatus"
      | "stagingRolloutReady"
      | "stagingSmokePassed"
      | "productionDeployApproved"
    >
  > = {},
): SmartFormPilotProductionDeployApproval {
  const stagingSignals = resolveStagingSignals();
  const productionDeployApproved =
    overrides.productionDeployApproved ??
    (status === "approved_for_production");

  return {
    approvedBy: overrides.approvedBy ?? "",
    approvedAt: overrides.approvedAt ?? "",
    scope: overrides.scope ?? "production_deploy",
    pilotSlugs: [...PILOT_CALCULATION_BRIDGE_GOVERNANCE_SLUGS],
    flagName: SMART_FORM_PILOT_STAGING_FLAG_NAME,
    manualQaStatus: overrides.manualQaStatus ?? stagingSignals.manualQaStatus,
    stagingRolloutReady: overrides.stagingRolloutReady ?? stagingSignals.stagingRolloutReady,
    stagingSmokePassed: overrides.stagingSmokePassed ?? stagingSignals.stagingSmokePassed,
    productionDeployApproved,
    rollbackRequired: overrides.rollbackRequired ?? true,
    postDeploySmokeRequired: overrides.postDeploySmokeRequired ?? true,
    monitoringRequired: overrides.monitoringRequired ?? true,
    notes:
      overrides.notes ??
      "Awaiting explicit human approval for production Smart Form pilot deploy.",
    status,
  };
}

export function getPendingSmartFormPilotProductionDeployApproval(): SmartFormPilotProductionDeployApproval {
  return buildApprovalBase("pending_approval");
}

export function getDefaultSmartFormPilotProductionDeployApproval(): SmartFormPilotProductionDeployApproval {
  return getPendingSmartFormPilotProductionDeployApproval();
}

export function buildApprovedSmartFormPilotProductionDeployApproval(
  overrides: Partial<
    Pick<
      SmartFormPilotProductionDeployApproval,
      | "approvedBy"
      | "approvedAt"
      | "notes"
      | "rollbackRequired"
      | "postDeploySmokeRequired"
      | "monitoringRequired"
    >
  > = {},
): SmartFormPilotProductionDeployApproval {
  return buildApprovalBase("approved_for_production", {
    productionDeployApproved: true,
    ...overrides,
  });
}

export function isProductionDeployApprovalScope(
  scope: SmartFormPilotProductionDeployApproval["scope"],
): boolean {
  return scope === "production_deploy";
}
