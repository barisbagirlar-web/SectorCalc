/**
 * Smart form pilot staging flag application plan — Phase 5H-G-N.
 * Read-only plan; does not mutate env or deploy config.
 */

import { getSmartFormPilotBatchRegistry } from "@/components/tools/smart-form/pilot-batch-qa-registry";
import { buildSmartFormPilotRolloutRollbackChecklist } from "@/components/tools/smart-form/pilot-rollout-checklist";
import {
  getDefaultSmartFormPilotStagingRolloutApproval,
  SMART_FORM_PILOT_STAGING_FLAG_NAME,
} from "@/components/tools/smart-form/pilot-staging-rollout-approval";
import { evaluateSmartFormPilotStagingRollout } from "@/components/tools/smart-form/pilot-staging-rollout-gate";
import { evaluateSmartFormPilotQaDecision } from "@/components/tools/smart-form/pilot-qa-decision-gate";
import { getSmartFormPilotManualQaResults } from "@/components/tools/smart-form/pilot-manual-qa-result";

export const SMART_FORM_PILOT_STAGING_FLAG_PLAN_ROLLBACK_REF =
  "pilot-rollout-checklist" as const;

export type SmartFormPilotStagingFlagPlanScope = "staging_only";

export type SmartFormPilotStagingFlagPlanStatus = "ready_to_apply" | "blocked";

export type SmartFormPilotStagingFlagPlan = {
  readonly flagName: typeof SMART_FORM_PILOT_STAGING_FLAG_NAME;
  readonly targetValue: "true";
  readonly scope: SmartFormPilotStagingFlagPlanScope;
  readonly approvedForStaging: boolean;
  readonly productionDeployApproved: false;
  readonly requiresRebuild: true;
  readonly requiresSmokeTest: true;
  readonly pilotRoutes: readonly string[];
  readonly rollbackPlanRef: typeof SMART_FORM_PILOT_STAGING_FLAG_PLAN_ROLLBACK_REF;
  readonly status: SmartFormPilotStagingFlagPlanStatus;
};

export function buildSmartFormPilotStagingFlagPlan(): SmartFormPilotStagingFlagPlan {
  const manualQaResults = getSmartFormPilotManualQaResults().results;
  const qaDecision = evaluateSmartFormPilotQaDecision(manualQaResults);
  const approval = getDefaultSmartFormPilotStagingRolloutApproval();
  const rolloutDecision = evaluateSmartFormPilotStagingRollout({ qaDecision, approval });
  const pilotRoutes = getSmartFormPilotBatchRegistry().map((entry) => entry.manualQaUrl);

  const rollbackChecklist = buildSmartFormPilotRolloutRollbackChecklist();
  const rollbackRoutesMatch =
    rollbackChecklist.pilotRoutes.length === pilotRoutes.length &&
    rollbackChecklist.pilotRoutes.every((route, index) => route === pilotRoutes[index]);

  const readyToApply = rolloutDecision.stagingRolloutReady && rollbackRoutesMatch;

  return {
    flagName: SMART_FORM_PILOT_STAGING_FLAG_NAME,
    targetValue: "true",
    scope: "staging_only",
    approvedForStaging: approval.status === "approved_for_staging",
    productionDeployApproved: false,
    requiresRebuild: true,
    requiresSmokeTest: true,
    pilotRoutes,
    rollbackPlanRef: SMART_FORM_PILOT_STAGING_FLAG_PLAN_ROLLBACK_REF,
    status: readyToApply ? "ready_to_apply" : "blocked",
  };
}
