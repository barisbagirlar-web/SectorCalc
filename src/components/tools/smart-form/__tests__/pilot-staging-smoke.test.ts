/**
 * Phase 5H-G-N — smart form staging flag plan and smoke test gate tests.
 */

import { execSync } from "node:child_process";
import { describe, expect, test } from "vitest";
import { buildSmartFormPilotRolloutRollbackChecklist } from "@/components/tools/smart-form/pilot-rollout-checklist";
import {
  buildSmartFormPilotStagingFlagPlan,
  SMART_FORM_PILOT_STAGING_FLAG_PLAN_ROLLBACK_REF,
} from "@/components/tools/smart-form/pilot-staging-flag-plan";
import {
  formatSmartFormPilotStagingSmokeTestReport,
  runSmartFormPilotStagingSmokeTestAudit,
} from "@/components/tools/smart-form/pilot-staging-smoke-test-audit";
import { evaluateSmartFormPilotStagingSmokeTestGate } from "@/components/tools/smart-form/pilot-staging-smoke-test-gate";
import {
  buildDefaultPendingSmokeTestResults,
  buildPassedSmokeTestResult,
  getSmartFormPilotStagingSmokeTestResults,
  type SmartFormPilotSmokeTestResult,
} from "@/components/tools/smart-form/pilot-staging-smoke-test-result";

function withSmokeOverrides(
  base: SmartFormPilotSmokeTestResult,
  overrides: Partial<SmartFormPilotSmokeTestResult>,
): SmartFormPilotSmokeTestResult {
  return { ...base, ...overrides };
}

describe("smart form staging smoke gate — Phase 5H-G-N", () => {
  test("flag plan is staging_only and ready_to_apply", () => {
    const plan = buildSmartFormPilotStagingFlagPlan();

    expect(plan.scope).toBe("staging_only");
    expect(plan.flagName).toBe("NEXT_PUBLIC_SMART_FORM_PILOT");
    expect(plan.targetValue).toBe("true");
    expect(plan.status).toBe("ready_to_apply");
    expect(plan.requiresRebuild).toBe(true);
    expect(plan.requiresSmokeTest).toBe(true);
  });

  test("production deploy approved remains false on flag plan", () => {
    const plan = buildSmartFormPilotStagingFlagPlan();

    expect(plan.productionDeployApproved).toBe(false);
    expect(plan.approvedForStaging).toBe(true);
  });

  test("default smoke results are pending_smoke_test for all pilots", () => {
    const results = getSmartFormPilotStagingSmokeTestResults();

    expect(results.results).toHaveLength(3);
    expect(results.aggregateStatus).toBe("pending_smoke_test");
    expect(results.results.every((result) => result.status === "pending_smoke_test")).toBe(true);
  });

  test("pending smoke keeps stagingSmokePassed false", () => {
    const decision = evaluateSmartFormPilotStagingSmokeTestGate(
      buildDefaultPendingSmokeTestResults().results,
    );

    expect(decision.smokeTestStatus).toBe("pending_smoke_test");
    expect(decision.stagingSmokePassed).toBe(false);
    expect(decision.productionDeploymentReady).toBe(false);
    expect(decision.status).toBe("pending");
  });

  test("all passed smoke enables stagingSmokePassed", () => {
    const passedResults = getSmartFormPilotStagingSmokeTestResults().results.map((result) =>
      buildPassedSmokeTestResult(result.route),
    );
    const decision = evaluateSmartFormPilotStagingSmokeTestGate(passedResults);

    expect(decision.smokeTestStatus).toBe("passed");
    expect(decision.stagingSmokePassed).toBe(true);
    expect(decision.productionDeploymentReady).toBe(false);
    expect(decision.status).toBe("passed");
  });

  test("console fail marks gate blocked", () => {
    const [first, ...rest] = getSmartFormPilotStagingSmokeTestResults().results;
    const results = [
      withSmokeOverrides(buildPassedSmokeTestResult(first.route), {
        consoleClean: false,
        status: "blocked",
      }),
      ...rest.map((result) => buildPassedSmokeTestResult(result.route)),
    ];
    const decision = evaluateSmartFormPilotStagingSmokeTestGate(results);

    expect(decision.status).toBe("blocked");
    expect(decision.stagingSmokePassed).toBe(false);
    expect(decision.blockedReasons.some((reason) => reason.includes("console is not clean"))).toBe(
      true,
    );
  });

  test("network fail marks gate blocked", () => {
    const [first, ...rest] = getSmartFormPilotStagingSmokeTestResults().results;
    const results = [
      withSmokeOverrides(buildPassedSmokeTestResult(first.route), {
        networkClean: false,
        status: "blocked",
      }),
      ...rest.map((result) => buildPassedSmokeTestResult(result.route)),
    ];
    const decision = evaluateSmartFormPilotStagingSmokeTestGate(results);

    expect(decision.status).toBe("blocked");
    expect(decision.stagingSmokePassed).toBe(false);
    expect(decision.blockedReasons.some((reason) => reason.includes("network is not clean"))).toBe(
      true,
    );
  });

  test("submit fail marks gate blocked", () => {
    const [first, ...rest] = getSmartFormPilotStagingSmokeTestResults().results;
    const results = [
      withSmokeOverrides(buildPassedSmokeTestResult(first.route), {
        calculationSubmitPassed: false,
        status: "blocked",
      }),
      ...rest.map((result) => buildPassedSmokeTestResult(result.route)),
    ];
    const decision = evaluateSmartFormPilotStagingSmokeTestGate(results);

    expect(decision.status).toBe("blocked");
    expect(decision.stagingSmokePassed).toBe(false);
    expect(decision.blockedReasons.some((reason) => reason.includes("calculation submit failed"))).toBe(
      true,
    );
  });

  test("CLI audit prints pending smoke status", () => {
    const report = formatSmartFormPilotStagingSmokeTestReport(runSmartFormPilotStagingSmokeTestAudit());

    expect(report).toContain("Smart Form Staging Smoke Test Gate");
    expect(report).toContain("Flag: NEXT_PUBLIC_SMART_FORM_PILOT=true");
    expect(report).toContain("Scope: staging_only");
    expect(report).toContain("Approved for staging: true");
    expect(report).toContain("Production deploy approved: false");
    expect(report).toContain("Smoke test status: pending_smoke_test");
    expect(report).toContain("Staging smoke passed: false");
    expect(report).toContain("Production deployment ready: false");
    expect(report).toContain("/tools/free/3d-print-cost-check");
    expect(report).toContain("/tools/free/repair-time-vs-price-check");
    expect(report).toContain("/tools/free/cabinet-cost-estimator");
  });

  test("rollback plan ref covers all 3 pilot routes", () => {
    const plan = buildSmartFormPilotStagingFlagPlan();
    const rollbackChecklist = buildSmartFormPilotRolloutRollbackChecklist();

    expect(plan.rollbackPlanRef).toBe(SMART_FORM_PILOT_STAGING_FLAG_PLAN_ROLLBACK_REF);
    expect(plan.pilotRoutes).toEqual(rollbackChecklist.pilotRoutes);
    expect(plan.pilotRoutes).toEqual([
      "/tools/free/3d-print-cost-check",
      "/tools/free/repair-time-vs-price-check",
      "/tools/free/cabinet-cost-estimator",
    ]);
  });

  test("npm audit:smart-form-staging-smoke CLI exits 0 with pending output", () => {
    const output = execSync("npm run audit:smart-form-staging-smoke", {
      cwd: process.cwd(),
      encoding: "utf8",
    });

    expect(output).toContain("Smoke test status: pending_smoke_test");
    expect(output).toContain("Staging smoke passed: false");
    expect(output).toContain("Production deployment ready: false");
  });
});
