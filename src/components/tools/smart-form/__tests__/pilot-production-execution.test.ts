/**
 * Phase 5H-G-R — smart form production deploy execution gate tests.
 */

import { execSync } from "node:child_process";
import { describe, expect, test } from "vitest";
import {
  formatSmartFormPilotProductionDeployExecutionReport,
  runSmartFormPilotProductionDeployExecutionAudit,
} from "@/components/tools/smart-form/pilot-production-deploy-execution-audit";
import { evaluateSmartFormPilotProductionDeployExecutionGate } from "@/components/tools/smart-form/pilot-production-deploy-execution-gate";
import {
  buildSmartFormPilotProductionDeployExecutionPlan,
  SMART_FORM_PILOT_PRODUCTION_DEPLOY_COMMAND,
  SMART_FORM_PILOT_PRODUCTION_ROLLBACK_COMMAND,
} from "@/components/tools/smart-form/pilot-production-deploy-execution-plan";
import { evaluateSmartFormPilotProductionDeployGate } from "@/components/tools/smart-form/pilot-production-deploy-gate";
import { getDefaultSmartFormPilotProductionDeployApproval } from "@/components/tools/smart-form/pilot-production-deploy-approval";
import { buildSmartFormPilotProductionFinalCommandChecklist } from "@/components/tools/smart-form/pilot-production-final-command-checklist";
import { evaluateSmartFormPilotStagingSmokeTestGate } from "@/components/tools/smart-form/pilot-staging-smoke-test-gate";
import { getSmartFormPilotStagingSmokeTestResults } from "@/components/tools/smart-form/pilot-staging-smoke-test-result";

function passedProductionDeployGate() {
  const stagingSmokeGate = evaluateSmartFormPilotStagingSmokeTestGate(
    getSmartFormPilotStagingSmokeTestResults().results,
  );

  return evaluateSmartFormPilotProductionDeployGate({
    stagingSmokeGate,
    approval: getDefaultSmartFormPilotProductionDeployApproval(),
  });
}

function readyExecutionGate() {
  const productionDeployGate = passedProductionDeployGate();
  const executionPlan = buildSmartFormPilotProductionDeployExecutionPlan(productionDeployGate);

  return evaluateSmartFormPilotProductionDeployExecutionGate({
    productionDeployGate,
    executionPlan,
  });
}

describe("smart form production deploy execution gate — Phase 5H-G-R", () => {
  test("approved production gate → execution ready_for_final_command", () => {
    const decision = readyExecutionGate();

    expect(decision.executionStatus).toBe("ready_for_final_command");
    expect(decision.deploymentReady).toBe(true);
    expect(decision.productionDeployApproved).toBe(true);
    expect(decision.blockedReasons).toHaveLength(0);
  });

  test("deploymentReady false → blocked", () => {
    const productionDeployGate = {
      ...passedProductionDeployGate(),
      productionDeploymentReady: false,
      productionDeployApproved: false,
      status: "blocked" as const,
    };
    const executionPlan = buildSmartFormPilotProductionDeployExecutionPlan(productionDeployGate);
    const decision = evaluateSmartFormPilotProductionDeployExecutionGate({
      productionDeployGate,
      executionPlan,
    });

    expect(decision.executionStatus).toBe("blocked");
    expect(decision.blockedReasons).toContain("Production deployment is not ready");
  });

  test("productionDeployApproved false → blocked", () => {
    const productionDeployGate = {
      ...passedProductionDeployGate(),
      productionDeployApproved: false,
    };
    const executionPlan = buildSmartFormPilotProductionDeployExecutionPlan(productionDeployGate);
    const decision = evaluateSmartFormPilotProductionDeployExecutionGate({
      productionDeployGate,
      executionPlan,
    });

    expect(decision.executionStatus).toBe("blocked");
    expect(decision.blockedReasons).toContain("Production deploy is not approved");
  });

  test("finalHumanCommandApproval false → blocked", () => {
    const productionDeployGate = passedProductionDeployGate();
    const executionPlan = {
      ...buildSmartFormPilotProductionDeployExecutionPlan(productionDeployGate),
      requiresFinalHumanCommandApproval: false,
    };
    const decision = evaluateSmartFormPilotProductionDeployExecutionGate({
      productionDeployGate,
      executionPlan,
    });

    expect(decision.executionStatus).toBe("blocked");
    expect(decision.blockedReasons).toContain("Final human command approval is not required");
  });

  test("postDeploySmoke false → blocked", () => {
    const productionDeployGate = {
      ...passedProductionDeployGate(),
      postDeploySmokeRequired: false,
    };
    const executionPlan = buildSmartFormPilotProductionDeployExecutionPlan(productionDeployGate);
    const decision = evaluateSmartFormPilotProductionDeployExecutionGate({
      productionDeployGate,
      executionPlan,
    });

    expect(decision.executionStatus).toBe("blocked");
    expect(decision.blockedReasons).toContain("Post-deploy smoke test is not required");
  });

  test("monitoring false → blocked", () => {
    const productionDeployGate = {
      ...passedProductionDeployGate(),
      monitoringRequired: false,
    };
    const executionPlan = buildSmartFormPilotProductionDeployExecutionPlan(productionDeployGate);
    const decision = evaluateSmartFormPilotProductionDeployExecutionGate({
      productionDeployGate,
      executionPlan,
    });

    expect(decision.executionStatus).toBe("blocked");
    expect(decision.blockedReasons).toContain("Production monitoring is not required");
  });

  test("deploy command string is generated but not executed", () => {
    const decision = readyExecutionGate();

    expect(decision.deployCommand).toBe(SMART_FORM_PILOT_PRODUCTION_DEPLOY_COMMAND);
    expect(decision.deployCommand).toContain("NEXT_PUBLIC_SMART_FORM_PILOT=true");
    expect(decision.deployCommand).toContain("firebase deploy --only hosting");
    expect(decision.deployCommandExecuted).toBe(false);
  });

  test("rollback command string is generated", () => {
    const productionDeployGate = passedProductionDeployGate();
    const executionPlan = buildSmartFormPilotProductionDeployExecutionPlan(productionDeployGate);
    const decision = evaluateSmartFormPilotProductionDeployExecutionGate({
      productionDeployGate,
      executionPlan,
    });

    expect(executionPlan.rollbackCommand).toBe(SMART_FORM_PILOT_PRODUCTION_ROLLBACK_COMMAND);
    expect(executionPlan.rollbackCommand).toContain("NEXT_PUBLIC_SMART_FORM_PILOT=false");
    expect(decision.rollbackCommandReady).toBe(true);
  });

  test("final command checklist includes 3 pilot routes", () => {
    const checklist = buildSmartFormPilotProductionFinalCommandChecklist();

    expect(checklist.pilotRoutes).toEqual([
      "/tools/free/3d-print-cost-check",
      "/tools/free/repair-time-vs-price-check",
      "/tools/free/cabinet-cost-estimator",
    ]);
    expect(checklist.items.length).toBeGreaterThanOrEqual(9);
    expect(checklist.deployCommand).toBe(SMART_FORM_PILOT_PRODUCTION_DEPLOY_COMMAND);
    expect(checklist.rollbackCommand).toBe(SMART_FORM_PILOT_PRODUCTION_ROLLBACK_COMMAND);
  });

  test("CLI audit prints ready_for_final_command", () => {
    const report = formatSmartFormPilotProductionDeployExecutionReport(
      runSmartFormPilotProductionDeployExecutionAudit(),
    );

    expect(report).toContain("Smart Form Production Execution Gate");
    expect(report).toContain("Production deployment ready: true");
    expect(report).toContain("Production deploy approved: true");
    expect(report).toContain("Execution status: ready_for_final_command");
    expect(report).toContain("Final human command approval required: true");
    expect(report).toContain("Deploy command: NOT EXECUTED");
    expect(report).toContain("Rollback command: READY");
    expect(report).toContain("Post-deploy smoke required: true");
    expect(report).toContain("Monitoring required: true");
  });

  test("npm audit:smart-form-production-execution CLI exits 0 with ready output", () => {
    const output = execSync("npm run audit:smart-form-production-execution", {
      cwd: process.cwd(),
      encoding: "utf8",
    });

    expect(output).toContain("Execution status: ready_for_final_command");
    expect(output).toContain("Deploy command: NOT EXECUTED");
    expect(output).toContain("Rollback command: READY");
    expect(output).toContain("Production deployment ready: true");
  });
});
