/**
 * Phase 5H-G-L/M — smart form staging rollout gate tests.
 */

import { describe, expect, test } from "vitest";
import { runSmartFormPilotBatchQaAudit } from "@/components/tools/smart-form/pilot-batch-qa-audit";
import { buildSmartFormPilotRolloutRollbackChecklist } from "@/components/tools/smart-form/pilot-rollout-checklist";
import {
  formatSmartFormPilotStagingRolloutReport,
  runSmartFormPilotStagingRolloutAudit,
} from "@/components/tools/smart-form/pilot-staging-rollout-audit";
import {
  buildApprovedSmartFormPilotStagingRolloutApproval,
  getDefaultSmartFormPilotStagingRolloutApproval,
  getPendingSmartFormPilotStagingRolloutApproval,
  SMART_FORM_PILOT_STAGING_APPROVAL_AT,
  SMART_FORM_PILOT_STAGING_APPROVAL_NOTES,
  SMART_FORM_PILOT_STAGING_APPROVED_BY,
  type SmartFormPilotStagingRolloutApproval,
} from "@/components/tools/smart-form/pilot-staging-rollout-approval";
import { evaluateSmartFormPilotStagingRollout } from "@/components/tools/smart-form/pilot-staging-rollout-gate";
import { evaluateSmartFormPilotQaDecision } from "@/components/tools/smart-form/pilot-qa-decision-gate";
import {
  buildDefaultPendingManualQaResults,
  getProductionDeployedManualQaResults,
} from "@/components/tools/smart-form/pilot-manual-qa-result";
import { PRODUCTION_DEPLOYED_PILOT_GOVERNANCE_SLUGS } from "@/lib/formula-governance/smart-form-ui-bridge/pilot-calculation-bridge-registry";

describe("smart form staging rollout gate — Phase 5H-G-L/M", () => {
  test("approved default record enables stagingRolloutReady", () => {
    const qaDecision = evaluateSmartFormPilotQaDecision(
      getProductionDeployedManualQaResults().results,
    );
    const approval = getDefaultSmartFormPilotStagingRolloutApproval();
    const decision = evaluateSmartFormPilotStagingRollout({ qaDecision, approval });

    expect(approval.status).toBe("approved_for_staging");
    expect(approval.approvedBy).toBe(SMART_FORM_PILOT_STAGING_APPROVED_BY);
    expect(decision.stagingRolloutReady).toBe(true);
    expect(decision.deploymentReady).toBe(false);
    expect(decision.status).toBe("ready");
  });

  test("deploymentReady remains false after explicit approval", () => {
    const audit = runSmartFormPilotStagingRolloutAudit();

    expect(audit.rolloutDecision.stagingRolloutReady).toBe(true);
    expect(audit.rolloutDecision.deploymentReady).toBe(false);
    expect(audit.approval.deploymentReady).toBe(false);
  });

  test("non staging_flag_only scope blocks rollout", () => {
    const qaDecision = evaluateSmartFormPilotQaDecision(
      getProductionDeployedManualQaResults().results,
    );
    const invalidApproval = {
      ...getDefaultSmartFormPilotStagingRolloutApproval(),
      scope: "production_deploy",
    } as unknown as SmartFormPilotStagingRolloutApproval;

    const decision = evaluateSmartFormPilotStagingRollout({
      qaDecision,
      approval: invalidApproval,
    });

    expect(decision.stagingRolloutReady).toBe(false);
    expect(decision.blockedReasons).toContain(
      "Approval scope is not limited to staging_flag_only",
    );
  });

  test("rollbackRequired false blocks rollout", () => {
    const qaDecision = evaluateSmartFormPilotQaDecision(
      getProductionDeployedManualQaResults().results,
    );
    const decision = evaluateSmartFormPilotStagingRollout({
      qaDecision,
      approval: buildApprovedSmartFormPilotStagingRolloutApproval({
        rollbackRequired: false,
      }),
    });

    expect(decision.stagingRolloutReady).toBe(false);
    expect(decision.blockedReasons).toContain("Rollback checklist is not required");
  });

  test("smokeTestRequired false blocks rollout", () => {
    const qaDecision = evaluateSmartFormPilotQaDecision(
      getProductionDeployedManualQaResults().results,
    );
    const decision = evaluateSmartFormPilotStagingRollout({
      qaDecision,
      approval: buildApprovedSmartFormPilotStagingRolloutApproval({
        smokeTestRequired: false,
      }),
    });

    expect(decision.stagingRolloutReady).toBe(false);
    expect(decision.blockedReasons).toContain("Smoke test gate is not required");
  });

  test("approval pilotSlugs include all 3 governance pilots", () => {
    const approval = getDefaultSmartFormPilotStagingRolloutApproval();

    expect(approval.pilotSlugs).toEqual([...PRODUCTION_DEPLOYED_PILOT_GOVERNANCE_SLUGS]);
    expect(approval.pilotSlugs).toEqual([
      "3d-print-cost-check",
      "auto-shop-margin-leak-detector",
      "cabinet-cost-estimator",
    ]);
  });

  test("staging rollout audit report shows approved_for_staging", () => {
    const report = formatSmartFormPilotStagingRolloutReport(runSmartFormPilotStagingRolloutAudit());

    expect(report).toContain("Smart Form Staging Rollout Gate");
    expect(report).toContain("Manual QA status: passed");
    expect(report).toContain("Staging flag ready: true");
    expect(report).toContain("Human approval: approved_for_staging");
    expect(report).toContain("Staging rollout ready: true");
    expect(report).toContain("Deployment ready: false");
    expect(report).toContain("Rollback required: true");
    expect(report).toContain("Smoke test required: true");
    expect(report).toContain("Blockers: 0");
  });

  test("QA passed with pending approval keeps stagingRolloutReady false", () => {
    const qaDecision = evaluateSmartFormPilotQaDecision(
      getProductionDeployedManualQaResults().results,
    );
    const decision = evaluateSmartFormPilotStagingRollout({
      qaDecision,
      approval: getPendingSmartFormPilotStagingRolloutApproval(),
    });

    expect(decision.humanApprovalStatus).toBe("pending_approval");
    expect(decision.stagingRolloutReady).toBe(false);
    expect(decision.status).toBe("pending");
  });

  test("QA pending or fail blocks staging rollout even with approval record", () => {
    const qaDecision = evaluateSmartFormPilotQaDecision(buildDefaultPendingManualQaResults().results);
    const decision = evaluateSmartFormPilotStagingRollout({
      qaDecision,
      approval: getDefaultSmartFormPilotStagingRolloutApproval(),
    });

    expect(decision.stagingRolloutReady).toBe(false);
    expect(decision.status).toBe("blocked");
  });

  test("rollback checklist includes all 3 pilot routes", () => {
    const checklist = buildSmartFormPilotRolloutRollbackChecklist();

    expect(checklist.pilotRoutes).toEqual([
      "/tools/free/3d-print-cost-check",
      "/tools/free/repair-time-vs-price-check",
      "/tools/free/cabinet-cost-estimator",
    ]);
  });

  test("explicit approval record fields match Phase 5H-G-M spec", () => {
    const approval = getDefaultSmartFormPilotStagingRolloutApproval();

    expect(approval.approvedBy).toBe("Baris Bagirlar");
    expect(approval.approvedAt).toBe(SMART_FORM_PILOT_STAGING_APPROVAL_AT);
    expect(approval.scope).toBe("staging_flag_only");
    expect(approval.flagName).toBe("NEXT_PUBLIC_SMART_FORM_PILOT");
    expect(approval.manualQaStatus).toBe("passed");
    expect(approval.stagingFlagReady).toBe(true);
    expect(approval.notes).toBe(SMART_FORM_PILOT_STAGING_APPROVAL_NOTES);
  });

  test("batch H QA audit tracks 10 pilots with production deployed QA passed subset", () => {
    const audit = runSmartFormPilotBatchQaAudit();

    expect(audit.totalPilots).toBe(10);
    expect(audit.calculationBridgeReady).toBe(10);
    expect(audit.manualQaStatus).toBe("pending_manual_qa");
    expect(audit.stagingFlagReady).toBe(false);
    expect(audit.deploymentReady).toBe(false);
    expect(audit.blockers).toHaveLength(0);
  });
});
