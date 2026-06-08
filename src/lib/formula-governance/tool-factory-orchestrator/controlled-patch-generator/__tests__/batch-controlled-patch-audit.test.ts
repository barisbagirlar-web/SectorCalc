/**
 * Batch controlled patch audit tests — Phase 5I-E.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import { runFullExistingToolAudit } from "@/lib/formula-governance/full-tool-audit/full-tool-audit-runner";
import { runBatchControlledPatchDraftAudit } from "@/lib/formula-governance/tool-factory-orchestrator/controlled-patch-generator/batch-controlled-patch-audit";
import { runBatchPatchPlanAudit } from "@/lib/formula-governance/tool-factory-orchestrator/patch-plan/batch-patch-plan-audit";

describe("batch controlled patch audit — Phase 5I-E", () => {
  test("canApplyCount is always 0", () => {
    const fullAudit = runFullExistingToolAudit(FORMULA_CONTRACTS, process.cwd());
    const patchAudit = runBatchPatchPlanAudit(fullAudit);
    const result = runBatchControlledPatchDraftAudit(patchAudit);

    expect(result.canApplyCount).toBe(0);
    expect(result.drafts.every((draft) => draft.canApply === false)).toBe(true);
  });

  test("batch audit is deterministic", () => {
    const fullAudit = runFullExistingToolAudit(FORMULA_CONTRACTS, process.cwd());
    const patchAudit = runBatchPatchPlanAudit(fullAudit);
    const first = runBatchControlledPatchDraftAudit(patchAudit);
    const second = runBatchControlledPatchDraftAudit(patchAudit);

    expect(first.topPatchDrafts).toEqual(second.topPatchDrafts);
  });
});
