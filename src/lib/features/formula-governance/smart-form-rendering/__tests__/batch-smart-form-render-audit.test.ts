/**
 * Phase 5H-G-B — batch smart form render audit tests.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts";
import {
  ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY,
  FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
} from "@/lib/features/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import { runBatchInputDesignAudit } from "@/lib/features/formula-governance/input-design-audit/batch-input-design-audit";
import { buildExistingToolMigrationPlan } from "@/lib/features/formula-governance/input-design-audit/migration-plan/migration-planner";
import { runBatchSmartFormPlanAudit } from "@/lib/features/formula-governance/smart-form-architecture/batch-smart-form-plan-audit";
import { runBatchSmartFormRenderAudit } from "@/lib/features/formula-governance/smart-form-rendering/batch-smart-form-render-audit";
import { runBatchAlignmentAudit } from "@/lib/features/formula-governance/requirement-engine/batch-alignment-audit";

describe("batch smart form render audit", () => {
  test("15 ready specs become rendering_adapter_ready", () => {
    const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const alignmentAudit = runBatchAlignmentAudit({ contracts: FORMULA_CONTRACTS });
    const migrationPlan = buildExistingToolMigrationPlan({
      inputDesignAudit,
      alignmentAudit,
      contracts: FORMULA_CONTRACTS,
    });

    const smartFormAudit = runBatchSmartFormPlanAudit({
      migrationPlan,
      controlledPatchRegistry: CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY,
      alignmentAudit,
    });

    const result = runBatchSmartFormRenderAudit({
      smartFormPlans: smartFormAudit.plans,
      renderMode: "free_quick_check",
    });

    expect(result.readySpecs).toBe(15);
    expect(result.renderingAdapterReady).toBe(15);
    expect(result.blocked).toBe(0);
    expect(result.derivedReadonlyViolations).toBe(0);
    expect(result.trustTracePanelCount).toBe(15);

    for (const slug of ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS) {
      const plan = result.renderPlans.find((entry) => entry.slug === slug);
      expect(plan?.readinessStatus).toBe("rendering_adapter_ready");
      expect(plan?.requiredFieldCount).toBeGreaterThan(0);
    }
  });

  test("non-ready spec stays needs_smart_form_spec", () => {
    const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const migrationPlan = buildExistingToolMigrationPlan({ inputDesignAudit });
    const smartFormAudit = runBatchSmartFormPlanAudit({
      migrationPlan,
      controlledPatchRegistry: CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY,
    });

    const result = runBatchSmartFormRenderAudit({
      smartFormPlans: smartFormAudit.plans,
      renderMode: "free_quick_check",
    });

    const unpatchPlan = result.renderPlans.find((entry) => entry.slug === "rent-vs-buy-calculator");
    expect(unpatchPlan?.readinessStatus).toBe("needs_smart_form_spec");
  });

  test("recommends first UI pilot from first patch batch", () => {
    const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const alignmentAudit = runBatchAlignmentAudit({ contracts: FORMULA_CONTRACTS });
    const migrationPlan = buildExistingToolMigrationPlan({
      inputDesignAudit,
      alignmentAudit,
      contracts: FORMULA_CONTRACTS,
    });
    const smartFormAudit = runBatchSmartFormPlanAudit({
      migrationPlan,
      controlledPatchRegistry: CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY,
      alignmentAudit,
    });

    const result = runBatchSmartFormRenderAudit({
      smartFormPlans: smartFormAudit.plans,
      renderMode: "free_quick_check",
    });

    expect(result.recommendedFirstUiPilot).toEqual([...FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS]);
  });
});
