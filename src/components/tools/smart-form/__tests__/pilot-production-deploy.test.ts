/**
 * Phase 5H-G-Q — smart form production deploy approval gate tests.
 */

import { execSync } from "node:child_process";
import { describe, expect, test } from "vitest";
import {
  formatSmartFormPilotProductionDeployReport,
  runSmartFormPilotProductionDeployAudit,
} from "@/components/tools/smart-form/pilot-production-deploy-audit";
import {
  buildApprovedSmartFormPilotProductionDeployApproval,
  getDefaultSmartFormPilotProductionDeployApproval,
  getPendingSmartFormPilotProductionDeployApproval,
  type SmartFormPilotProductionDeployApproval,
} from "@/components/tools/smart-form/pilot-production-deploy-approval";
import { evaluateSmartFormPilotProductionDeployGate } from "@/components/tools/smart-form/pilot-production-deploy-gate";
import { buildSmartFormPilotProductionRollbackChecklist } from "@/components/tools/smart-form/pilot-production-rollback-checklist";
import { getSmartFormPilotPostDeploySmokeTestResults } from "@/components/tools/smart-form/pilot-post-deploy-smoke-test";
import {
  formatSmartFormPilotStagingSmokeTestReport,
  runSmartFormPilotStagingSmokeTestAudit,
} from "@/components/tools/smart-form/pilot-staging-smoke-test-audit";
import { evaluateSmartFormPilotStagingSmokeTestGate } from "@/components/tools/smart-form/pilot-staging-smoke-test-gate";
import { getSmartFormPilotStagingSmokeTestResults } from "@/components/tools/smart-form/pilot-staging-smoke-test-result";

function passedStagingSmokeGate() {
  return evaluateSmartFormPilotStagingSmokeTestGate(
    getSmartFormPilotStagingSmokeTestResults().results,
  );
}

describe("smart form production deploy gate — Phase 5H-G-P", () => {
  test("staging smoke passed + pending approval keeps productionDeploymentReady false", () => {
    const decision = evaluateSmartFormPilotProductionDeployGate({
      stagingSmokeGate: passedStagingSmokeGate(),
      approval: getPendingSmartFormPilotProductionDeployApproval(),
    });

    expect(decision.stagingSmokePassed).toBe(true);
    expect(decision.productionApprovalStatus).toBe("pending_approval");
    expect(decision.productionDeploymentReady).toBe(false);
    expect(decision.productionDeployApproved).toBe(false);
    expect(decision.status).toBe("pending");
  });

  test("default approved record enables productionDeploymentReady", () => {
    const approval = getDefaultSmartFormPilotProductionDeployApproval();
    const decision = evaluateSmartFormPilotProductionDeployGate({
      stagingSmokeGate: passedStagingSmokeGate(),
      approval,
    });

    expect(approval.status).toBe("approved_for_production");
    expect(approval.productionDeployApproved).toBe(true);
    expect(approval.approvedBy).toBe("Barış Bağırlar");
    expect(approval.approvedAt).toBe("2026-06-08T19:55:00.000Z");
    expect(decision.productionDeploymentReady).toBe(true);
    expect(decision.productionDeployApproved).toBe(true);
    expect(decision.rollbackRequired).toBe(true);
    expect(decision.postDeploySmokeRequired).toBe(true);
    expect(decision.monitoringRequired).toBe(true);
    expect(decision.status).toBe("ready");
    expect(decision.blockedReasons).toHaveLength(0);
  });

  test("staging smoke passed + approved_for_production enables productionDeploymentReady", () => {
    const decision = evaluateSmartFormPilotProductionDeployGate({
      stagingSmokeGate: passedStagingSmokeGate(),
      approval: buildApprovedSmartFormPilotProductionDeployApproval({
        approvedBy: "Barış Bağırlar",
        approvedAt: "2026-06-08T19:55:00.000Z",
      }),
    });

    expect(decision.productionDeploymentReady).toBe(true);
    expect(decision.productionDeployApproved).toBe(true);
    expect(decision.status).toBe("ready");
    expect(decision.blockedReasons).toHaveLength(0);
  });

  test("staging smoke false blocks production deploy", () => {
    const decision = evaluateSmartFormPilotProductionDeployGate({
      stagingSmokeGate: {
        smokeTestStatus: "pending_smoke_test",
        stagingSmokePassed: false,
        productionDeploymentReady: false,
        status: "pending",
        blockedReasons: [],
      },
      approval: buildApprovedSmartFormPilotProductionDeployApproval(),
    });

    expect(decision.status).toBe("blocked");
    expect(decision.productionDeploymentReady).toBe(false);
    expect(decision.blockedReasons).toContain("Staging smoke has not passed");
  });

  test("rollbackRequired false blocks production deploy", () => {
    const decision = evaluateSmartFormPilotProductionDeployGate({
      stagingSmokeGate: passedStagingSmokeGate(),
      approval: {
        ...buildApprovedSmartFormPilotProductionDeployApproval(),
        rollbackRequired: false,
      },
    });

    expect(decision.productionDeploymentReady).toBe(false);
    expect(decision.blockedReasons).toContain("Rollback checklist is not required");
  });

  test("postDeploySmokeRequired false blocks production deploy", () => {
    const decision = evaluateSmartFormPilotProductionDeployGate({
      stagingSmokeGate: passedStagingSmokeGate(),
      approval: {
        ...buildApprovedSmartFormPilotProductionDeployApproval(),
        postDeploySmokeRequired: false,
      },
    });

    expect(decision.productionDeploymentReady).toBe(false);
    expect(decision.blockedReasons).toContain("Post-deploy smoke test is not required");
  });

  test("monitoringRequired false blocks production deploy", () => {
    const decision = evaluateSmartFormPilotProductionDeployGate({
      stagingSmokeGate: passedStagingSmokeGate(),
      approval: {
        ...buildApprovedSmartFormPilotProductionDeployApproval(),
        monitoringRequired: false,
      },
    });

    expect(decision.productionDeploymentReady).toBe(false);
    expect(decision.blockedReasons).toContain("Production monitoring is not required");
  });

  test("wrong scope blocks production deploy", () => {
    const invalidApproval = {
      ...getDefaultSmartFormPilotProductionDeployApproval(),
      scope: "staging_flag_only",
    } as unknown as SmartFormPilotProductionDeployApproval;

    const decision = evaluateSmartFormPilotProductionDeployGate({
      stagingSmokeGate: passedStagingSmokeGate(),
      approval: invalidApproval,
    });

    expect(decision.productionDeploymentReady).toBe(false);
    expect(decision.blockedReasons).toContain("Approval scope is not production_deploy");
  });

  test("production rollback checklist includes 3 pilot routes", () => {
    const checklist = buildSmartFormPilotProductionRollbackChecklist();

    expect(checklist.pilotRoutes).toEqual([
      "/tools/free/3d-print-cost-check",
      "/tools/free/repair-time-vs-price-check",
      "/tools/free/cabinet-cost-estimator",
    ]);
    expect(checklist.items.length).toBeGreaterThanOrEqual(9);
  });

  test("post-deploy smoke recorded as passed for 3 pilots", () => {
    const results = getSmartFormPilotPostDeploySmokeTestResults();

    expect(results.results).toHaveLength(3);
    expect(results.aggregateStatus).toBe("passed");
    expect(results.results.every((result) => result.status === "passed")).toBe(true);
  });

  test("CLI audit prints approved_for_production status", () => {
    const report = formatSmartFormPilotProductionDeployReport(
      runSmartFormPilotProductionDeployAudit(),
    );

    expect(report).toContain("Smart Form Production Deploy Gate");
    expect(report).toContain("Manual QA status: passed");
    expect(report).toContain("Staging smoke passed: true");
    expect(report).toContain("Production approval: approved_for_production");
    expect(report).toContain("Production deployment ready: true");
    expect(report).toContain("Production deploy approved: true");
    expect(report).toContain("Rollback required: true");
    expect(report).toContain("Post-deploy smoke required: true");
    expect(report).toContain("Monitoring required: true");
    expect(report).toContain("Post-deploy smoke status: passed");
    expect(report).toContain("Production smart form live: true");
    expect(report).toContain("Blockers: 0");
    expect(report).not.toContain("Post-deploy smoke tests are pending after production rollout");
  });

  test("existing staging smoke audit remains passed", () => {
    const report = formatSmartFormPilotStagingSmokeTestReport(
      runSmartFormPilotStagingSmokeTestAudit(),
    );

    expect(report).toContain("Smoke test status: passed");
    expect(report).toContain("Staging smoke passed: true");
    expect(report).toContain("Production deployment ready: false");
  });

  test("npm audit:smart-form-production-deploy CLI exits 0 with approved output", () => {
    const output = execSync("npm run audit:smart-form-production-deploy", {
      cwd: process.cwd(),
      encoding: "utf8",
    });

    expect(output).toContain("Production approval: approved_for_production");
    expect(output).toContain("Production deployment ready: true");
    expect(output).toContain("Production deploy approved: true");
    expect(output).toContain("Staging smoke passed: true");
    expect(output).toContain("Post-deploy smoke status: passed");
    expect(output).toContain("Production smart form live: true");
    expect(output).toContain("Blockers: 0");
  });
});
