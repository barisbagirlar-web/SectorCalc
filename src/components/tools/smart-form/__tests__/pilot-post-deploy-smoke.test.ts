/**
 * Phase 5H-G-S-POSTSMOKE - smart form post-deploy smoke result entry tests.
 */

import { describe, expect, test } from "vitest";
import {
  formatSmartFormPilotPostDeploySmokeTestReport,
  runSmartFormPilotPostDeploySmokeTestAudit,
} from "@/components/tools/smart-form/pilot-post-deploy-smoke-test-audit";
import { evaluateSmartFormPilotPostDeploySmokeTestGate } from "@/components/tools/smart-form/pilot-post-deploy-smoke-test-gate";
import {
  buildDefaultPendingPostDeploySmokeTestResults,
  buildRecordedPassedPostDeploySmokeTestResults,
  getSmartFormPilotPostDeploySmokeTestResults,
  POST_DEPLOY_SMOKE_PASSED_NOTES,
} from "@/components/tools/smart-form/pilot-post-deploy-smoke-test";

describe("smart form post-deploy smoke - Phase 5H-G-S-POSTSMOKE", () => {
  test("recorded post-deploy smoke results are passed for 3 pilots", () => {
    const results = getSmartFormPilotPostDeploySmokeTestResults();

    expect(results.results).toHaveLength(3);
    expect(results.aggregateStatus).toBe("passed");
    expect(results.results.every((result) => result.status === "passed")).toBe(true);
    expect(results.results.every((result) => result.desktopPassed)).toBe(true);
    expect(results.results.every((result) => result.mobilePassed)).toBe(true);
    expect(results.results.every((result) => result.consoleClean)).toBe(true);
    expect(results.results.every((result) => result.networkClean)).toBe(true);
    expect(results.results.every((result) => result.smartFormVisible)).toBe(true);
    expect(results.results.every((result) => result.calculationSubmitPassed)).toBe(true);
    expect(results.results.every((result) => result.resultCardVerified)).toBe(true);
    expect(results.results.every((result) => result.fallbackFlagOffVerified)).toBe(true);
    expect(results.results.every((result) => result.analyticsShapeVerified)).toBe(true);
    expect(results.results.every((result) => result.notes === POST_DEPLOY_SMOKE_PASSED_NOTES)).toBe(
      true,
    );
  });

  test("production URLs use sectorcalc.com domain", () => {
    const results = getSmartFormPilotPostDeploySmokeTestResults();

    expect(results.results.map((result) => result.productionUrl)).toEqual([
      "https://sectorcalc.com/tools/free/3d-print-cost-check",
      "https://sectorcalc.com/tools/free/repair-time-vs-price-check",
      "https://sectorcalc.com/tools/free/cabinet-cost-estimator",
    ]);
  });

  test("passed post-deploy smoke gate reports production live with rollback not required", () => {
    const decision = evaluateSmartFormPilotPostDeploySmokeTestGate(
      getSmartFormPilotPostDeploySmokeTestResults().results,
    );

    expect(decision.postDeploySmokeStatus).toBe("passed");
    expect(decision.productionSmartFormLive).toBe(true);
    expect(decision.rollbackRequired).toBe(false);
    expect(decision.status).toBe("passed");
    expect(decision.blockedReasons).toHaveLength(0);
  });

  test("pending post-deploy smoke keeps rollback required", () => {
    const decision = evaluateSmartFormPilotPostDeploySmokeTestGate(
      buildDefaultPendingPostDeploySmokeTestResults().results,
    );

    expect(decision.postDeploySmokeStatus).toBe("pending_post_deploy_smoke");
    expect(decision.productionSmartFormLive).toBe(false);
    expect(decision.rollbackRequired).toBe(true);
    expect(decision.status).toBe("pending");
  });

  test("failed console blocks post-deploy smoke gate", () => {
    const results = buildRecordedPassedPostDeploySmokeTestResults().results.map((result, index) =>
      index === 0 ? { ...result, consoleClean: false } : result,
    );
    const decision = evaluateSmartFormPilotPostDeploySmokeTestGate(results);

    expect(decision.productionSmartFormLive).toBe(false);
    expect(decision.rollbackRequired).toBe(true);
    expect(decision.blockedReasons).toContain(
      "/tools/free/3d-print-cost-check: console is not clean",
    );
  });

  test("post-deploy smoke audit reports passed with zero blockers", () => {
    const report = formatSmartFormPilotPostDeploySmokeTestReport(
      runSmartFormPilotPostDeploySmokeTestAudit(),
    );

    expect(report).toContain("Smart Form Post-Deploy Smoke Test Gate");
    expect(report).toContain("Post-deploy smoke status: passed");
    expect(report).toContain("Production smart form live: true");
    expect(report).toContain("Rollback required: false");
    expect(report).toContain("Blockers: 0");
    expect(report).toContain("https://sectorcalc.com/tools/free/3d-print-cost-check");
  });
});
