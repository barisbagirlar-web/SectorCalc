/**
 * Production readiness audit tests — Phase 5I-P.
 */

import { describe, expect, test } from "vitest";
import { runProductionReadinessAudit } from "@/lib/formula-governance/production-readiness/production-readiness-report";

describe("production readiness audit — Phase 5I-P", () => {
  test("readiness score is computed", () => {
    const result = runProductionReadinessAudit();
    expect(result.readinessScore).toBeGreaterThan(0);
    expect(result.readinessScore).toBeLessThanOrEqual(100);
  });

  test("deploy safety ready when command disabled", () => {
    const result = runProductionReadinessAudit();
    expect(result.deploySafetyReady).toBe(true);
    expect(result.gateResults.deploy_command_disabled).toBe(true);
  });

  test("production live proof includes 3 pilots", () => {
    const result = runProductionReadinessAudit();
    expect(result.productionLiveProof.length).toBe(3);
  });
});
