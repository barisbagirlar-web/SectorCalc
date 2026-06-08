/**
 * Phase 5H-G-L — smart form staging rollout gate tests.
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
} from "@/components/tools/smart-form/pilot-staging-rollout-approval";
import { evaluateSmartFormPilotStagingRollout } from "@/components/tools/smart-form/pilot-staging-rollout-gate";
import { evaluateSmartFormPilotQaDecision } from "@/components/tools/smart-form/pilot-qa-decision-gate";
import {
  buildDefaultPendingManualQaResults,
  getSmartFormPilotManualQaResults,
} from "@/components/tools/smart-form/pilot-manual-qa-result";

describe("smart form staging rollout gate — Phase 5H-G-L", () => {
  test("QA passed with pending approval keeps stagingRolloutReady false", () => {
    const qaDecision = evaluateSmartFormPilotQaDecision(getSmartFormPilotManualQaResults().results);
    const decision = evaluateSmartFormPilotStagingRollout({
      qaDecision,
      approval: getDefaultSmartFormPilotStagingRolloutApproval(),
    });

    expect(qaDecision.stagingFlagReady).toBe(true);
    expect(decision.humanApprovalStatus).toBe("pending_approval");
    expect(decision.stagingRolloutReady).toBe(false);
    expect(decision.deploymentReady).toBe(false);
    expect(decision.status).toBe("pending");
  });

  test("QA passed with approved_for_staging enables stagingRolloutReady", () => {
    const qaDecision = evaluateSmartFormPilotQaDecision(getSmartFormPilotManualQaResults().results);
    const decision = evaluateSmartFormPilotStagingRollout({
      qaDecision,
      approval: buildApprovedSmartFormPilotStagingRolloutApproval(),
    });

    expect(decision.stagingRolloutReady).toBe(true);
    expect(decision.deploymentReady).toBe(false);
    expect(decision.status).toBe("ready");
  });

  test("QA pending or fail blocks staging rollout", () => {
    const qaDecision = evaluateSmartFormPilotQaDecision(buildDefaultPendingManualQaResults().results);
    const decision = evaluateSmartFormPilotStagingRollout({
      qaDecision,
      approval: buildApprovedSmartFormPilotStagingRolloutApproval(),
    });

    expect(qaDecision.stagingFlagReady).toBe(false);
    expect(decision.stagingRolloutReady).toBe(false);
    expect(decision.status).toBe("blocked");
  });

  test("deploymentReady is false in every rollout decision path", () => {
    const qaDecision = evaluateSmartFormPilotQaDecision(getSmartFormPilotManualQaResults().results);

    expect(
      evaluateSmartFormPilotStagingRollout({
        qaDecision,
        approval: getDefaultSmartFormPilotStagingRolloutApproval(),
      }).deploymentReady,
    ).toBe(false);

    expect(
      evaluateSmartFormPilotStagingRollout({
        qaDecision,
        approval: buildApprovedSmartFormPilotStagingRolloutApproval(),
      }).deploymentReady,
    ).toBe(false);
  });

  test("rollbackRequired false blocks rollout", () => {
    const qaDecision = evaluateSmartFormPilotQaDecision(getSmartFormPilotManualQaResults().results);
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
    const qaDecision = evaluateSmartFormPilotQaDecision(getSmartFormPilotManualQaResults().results);
    const decision = evaluateSmartFormPilotStagingRollout({
      qaDecision,
      approval: buildApprovedSmartFormPilotStagingRolloutApproval({
        smokeTestRequired: false,
      }),
    });

    expect(decision.stagingRolloutReady).toBe(false);
    expect(decision.blockedReasons).toContain("Smoke test gate is not required");
  });

  test("rollback checklist includes all 3 pilot routes", () => {
    const checklist = buildSmartFormPilotRolloutRollbackChecklist();

    expect(checklist.pilotRoutes).toEqual([
      "/tools/free/3d-print-cost-check",
      "/tools/free/repair-time-vs-price-check",
      "/tools/free/cabinet-cost-estimator",
    ]);
    expect(checklist.items.some((item) => item.label.includes("NEXT_PUBLIC_SMART_FORM_PILOT=false"))).toBe(
      true,
    );
  });

  test("staging rollout audit CLI report shows pending approval status", () => {
    const report = formatSmartFormPilotStagingRolloutReport(runSmartFormPilotStagingRolloutAudit());

    expect(report).toContain("Smart Form Staging Rollout Gate");
    expect(report).toContain("Manual QA status: passed");
    expect(report).toContain("Staging flag ready: true");
    expect(report).toContain("Human approval: pending_approval");
    expect(report).toContain("Staging rollout ready: false");
    expect(report).toContain("Deployment ready: false");
    expect(report).toContain("Rollback required: true");
    expect(report).toContain("Smoke test required: true");
  });

  test("existing pilot QA audit metrics remain unchanged", () => {
    const audit = runSmartFormPilotBatchQaAudit();

    expect(audit.totalPilots).toBe(3);
    expect(audit.calculationBridgeReady).toBe(3);
    expect(audit.manualQaStatus).toBe("passed");
    expect(audit.stagingFlagReady).toBe(true);
    expect(audit.deploymentReady).toBe(false);
    expect(audit.blockers).toHaveLength(0);
  });
});
