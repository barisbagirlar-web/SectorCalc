/**
 * Batch deploy ready audit tests — Phase 5I-G.
 */

import { describe, expect, test } from "vitest";
import { runBatchDeployReadyAudit } from "@/lib/formula-governance/tool-factory-orchestrator/human-approval/deploy-ready-audit";

describe("batch deploy ready audit — Phase 5I-G", () => {
  test("commandAllowedCount is always 0", () => {
    const result = runBatchDeployReadyAudit();
    expect(result.commandAllowedCount).toBe(0);
    expect(result.gates.every((gate) => gate.deployCommandAllowed === false)).toBe(true);
  });

  test("deterministic top blocked reasons", () => {
    const first = runBatchDeployReadyAudit();
    const second = runBatchDeployReadyAudit();
    expect(first.topBlockedReasons).toEqual(second.topBlockedReasons);
  });
});
