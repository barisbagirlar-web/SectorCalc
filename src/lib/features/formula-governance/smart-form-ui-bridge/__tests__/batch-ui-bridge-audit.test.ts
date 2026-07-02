/**
 * Phase 5H-G-C - batch UI bridge audit tests.
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
import { runBatchSmartFormUiBridgeAudit } from "@/lib/features/formula-governance/smart-form-ui-bridge/batch-ui-bridge-audit";
import { runBatchAlignmentAudit } from "@/lib/features/formula-governance/requirement-engine/batch-alignment-audit";

describe("batch UI bridge audit", () => {
  test("15 rendering-ready tools become ui_bridge_ready", () => {
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
    const renderAudit = runBatchSmartFormRenderAudit({
      smartFormPlans: smartFormAudit.plans,
      renderMode: "free_quick_check",
    });

    const result = runBatchSmartFormUiBridgeAudit({
      renderPlans: renderAudit.renderPlans,
    });

    expect(result.renderingReady).toBe(15);
    expect(result.uiBridgeReady).toBe(15);
    expect(result.blocked).toBe(0);
    expect(result.pilotManifestsReady).toBe(10);
    expect(result.derivedReadonlyViolations).toBe(0);

    for (const slug of ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS) {
      const manifest = result.manifests.find((entry) => entry.slug === slug);
      expect(manifest?.status).toBe("ui_bridge_ready");
    }
  });

  test("keeps recommended first UI pilot slugs", () => {
    const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const migrationPlan = buildExistingToolMigrationPlan({ inputDesignAudit });
    const smartFormAudit = runBatchSmartFormPlanAudit({
      migrationPlan,
      controlledPatchRegistry: CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY,
    });
    const renderAudit = runBatchSmartFormRenderAudit({
      smartFormPlans: smartFormAudit.plans,
      renderMode: "free_quick_check",
    });

    const result = runBatchSmartFormUiBridgeAudit({
      renderPlans: renderAudit.renderPlans,
    });

    expect(result.recommendedFirstUiPilot).toEqual([...FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS]);
  });
});
