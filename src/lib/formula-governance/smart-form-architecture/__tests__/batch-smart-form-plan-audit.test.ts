/**
 * Phase 5H-G-A — batch smart form plan audit tests.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import {
  ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY,
  FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
} from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import { runBatchInputDesignAudit } from "@/lib/formula-governance/input-design-audit/batch-input-design-audit";
import { buildExistingToolMigrationPlan } from "@/lib/formula-governance/input-design-audit/migration-plan/migration-planner";
import { runBatchSmartFormPlanAudit } from "@/lib/formula-governance/smart-form-architecture/batch-smart-form-plan-audit";
import { runBatchAlignmentAudit } from "@/lib/formula-governance/requirement-engine/batch-alignment-audit";

describe("batch smart form plan audit", () => {
  test("produces ready_for_spec for all 15 completed patches", () => {
    const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const alignmentAudit = runBatchAlignmentAudit({ contracts: FORMULA_CONTRACTS });
    const migrationPlan = buildExistingToolMigrationPlan({
      inputDesignAudit,
      alignmentAudit,
      contracts: FORMULA_CONTRACTS,
    });

    const result = runBatchSmartFormPlanAudit({
      migrationPlan,
      controlledPatchRegistry: CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY,
      alignmentAudit,
    });

    expect(result.totalTools).toBe(41);
    expect(result.readyForSpec).toBe(15);
    expect(result.needsInputDesignPatch).toBe(26);
    expect(result.blocked).toBe(0);

    for (const slug of ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS) {
      const plan = result.plans.find((entry) => entry.slug === slug);
      expect(plan?.readinessStatus).toBe("ready_for_spec");
      expect(plan?.nextGate).toBe("smart_form_rendering_ready");
    }
  });

  test("non-patched tools need input design patch", () => {
    const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const migrationPlan = buildExistingToolMigrationPlan({ inputDesignAudit });

    const result = runBatchSmartFormPlanAudit({
      migrationPlan,
      controlledPatchRegistry: CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY,
    });

    const unpatchPlan = result.plans.find((entry) => entry.slug === "rent-vs-buy-calculator");
    expect(unpatchPlan?.readinessStatus).toBe("needs_input_design_patch");
  });

  test("recommends first smart form batch from first patch slugs", () => {
    const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const alignmentAudit = runBatchAlignmentAudit({ contracts: FORMULA_CONTRACTS });
    const migrationPlan = buildExistingToolMigrationPlan({
      inputDesignAudit,
      alignmentAudit,
      contracts: FORMULA_CONTRACTS,
    });

    const result = runBatchSmartFormPlanAudit({
      migrationPlan,
      controlledPatchRegistry: CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY,
      alignmentAudit,
    });

    expect(result.recommendedFirstSmartFormBatch).toEqual([
      ...FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
    ]);
  });
});
