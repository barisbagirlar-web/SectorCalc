/**
 * Batch patch plan audit tests — Phase 5I-B.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import { runFullExistingToolAudit } from "@/lib/formula-governance/full-tool-audit/full-tool-audit-runner";
import { runBatchPatchPlanAudit } from "@/lib/formula-governance/tool-factory-orchestrator/patch-plan/batch-patch-plan-audit";

describe("batch patch plan audit — Phase 5I-B", () => {
  test("produces deterministic top candidates", () => {
    const fullAudit = runFullExistingToolAudit(FORMULA_CONTRACTS, process.cwd());
    const first = runBatchPatchPlanAudit(fullAudit);
    const second = runBatchPatchPlanAudit(fullAudit);

    expect(first.top10PatchCandidates).toEqual(second.top10PatchCandidates);
    expect(first.totalPlans).toBeGreaterThan(0);
  });

  test("all plans forbid calculators/**", () => {
    const fullAudit = runFullExistingToolAudit(FORMULA_CONTRACTS, process.cwd());
    const result = runBatchPatchPlanAudit(fullAudit);

    expect(result.plans.every((plan) => plan.forbiddenFiles.includes("src/lib/calculators/**"))).toBe(
      true,
    );
    expect(result.forbiddenFileViolations).toHaveLength(0);
  });
});
