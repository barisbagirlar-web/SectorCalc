/**
 * Tool factory demo flow tests - Phase 5I-N.
 */

import { describe, expect, test } from "vitest";
import { runToolFactoryDemoFlowAudit } from "@/lib/features/formula-governance/tool-factory-orchestrator/demo-flow/demo-flow-audit";

describe("tool factory demo flow - Phase 5I-N", () => {
  test("demo flow reaches patch plan stage", () => {
    const result = runToolFactoryDemoFlowAudit();
    expect(result.completedStages).toBeGreaterThanOrEqual(12);
    expect(result.demoFlowReady).toBe(true);
  });

  test("deploy command disabled", () => {
    const result = runToolFactoryDemoFlowAudit();
    expect(result.deployCommandDisabled).toBe(true);
    expect(result.blockedStages).toContain("DeployReady");
  });

  test("human approval required", () => {
    const result = runToolFactoryDemoFlowAudit();
    expect(result.humanApprovalRequired).toBe(true);
    expect(result.blockedStages).toContain("HumanApproval");
  });
});
