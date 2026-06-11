/**
 * Phase 5H-E — migration plan CLI shape tests.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import { runBatchInputDesignAudit } from "@/lib/formula-governance/input-design-audit/batch-input-design-audit";
import {
  buildExistingToolMigrationPlan,
  formatMigrationPlanReport,
} from "@/lib/formula-governance/input-design-audit/migration-plan/migration-planner";
import { ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS } from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-status";
import { runBatchAlignmentAudit } from "@/lib/formula-governance/requirement-engine/batch-alignment-audit";

describe("audit migration plan script shape", () => {
  test("summary shape is produced", () => {
    const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const alignmentAudit = runBatchAlignmentAudit({ contracts: FORMULA_CONTRACTS });
    const plan = buildExistingToolMigrationPlan({ inputDesignAudit, alignmentAudit });

    expect(plan.totalTools).toBe(261);
    expect(plan.immediate).toBeGreaterThanOrEqual(0);
    expect(plan.high).toBeGreaterThanOrEqual(0);
    expect(plan.medium).toBeGreaterThanOrEqual(0);
    expect(plan.low).toBeGreaterThanOrEqual(0);
    expect(plan.defer).toBeGreaterThanOrEqual(0);
  });

  test("recommendedFirstPatchBatch is not empty and excludes completed patches", () => {
    const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const plan = buildExistingToolMigrationPlan({ inputDesignAudit });

    expect(plan.recommendedFirstPatchBatch.length).toBeGreaterThan(0);
    expect(plan.recommendedFirstPatchBatch.length).toBeLessThanOrEqual(3);
    expect(plan.completedInputDesignPatches).toEqual([
      ...ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
    ]);
    for (const slug of ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS) {
      expect(plan.recommendedFirstPatchBatch.some((item) => item.slug === slug)).toBe(false);
    }
  });

  test("formatted report does not throw", () => {
    const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const alignmentAudit = runBatchAlignmentAudit({ contracts: FORMULA_CONTRACTS });
    const plan = buildExistingToolMigrationPlan({ inputDesignAudit, alignmentAudit });

    expect(() => formatMigrationPlanReport(plan)).not.toThrow();
    const formatted = formatMigrationPlanReport(plan);
    expect(formatted).toContain("Migration Plan Summary");
    expect(formatted).toContain("Recommended first controlled patch batch:");
    expect(formatted).toContain("Completed input design patches:");
  });
});
