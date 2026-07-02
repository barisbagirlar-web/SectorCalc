/**
 * Phase 5H-G-C - audit smart form UI bridge CLI shape tests.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts";
import { CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY } from "@/lib/features/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import { runBatchInputDesignAudit } from "@/lib/features/formula-governance/input-design-audit/batch-input-design-audit";
import { buildExistingToolMigrationPlan } from "@/lib/features/formula-governance/input-design-audit/migration-plan/migration-planner";
import { runBatchSmartFormPlanAudit } from "@/lib/features/formula-governance/smart-form-architecture/batch-smart-form-plan-audit";
import { runBatchSmartFormRenderAudit } from "@/lib/features/formula-governance/smart-form-rendering/batch-smart-form-render-audit";
import {
  formatBatchSmartFormUiBridgeAuditReport,
  runBatchSmartFormUiBridgeAudit,
} from "@/lib/features/formula-governance/smart-form-ui-bridge/batch-ui-bridge-audit";
import { runBatchAlignmentAudit } from "@/lib/features/formula-governance/requirement-engine/batch-alignment-audit";

describe("audit smart form UI bridge script shape", () => {
  test("summary shape matches CLI contract", () => {
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
    expect(result.recommendedFirstUiPilot.length).toBe(3);
  });

  test("formatted report does not throw", () => {
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

    expect(() => formatBatchSmartFormUiBridgeAuditReport(result)).not.toThrow();
    const formatted = formatBatchSmartFormUiBridgeAuditReport(result);
    expect(formatted).toContain("Smart Form UI Bridge Audit");
    expect(formatted).toContain("UI bridge ready: 15");
    expect(formatted).toContain("Pilot manifests ready: 10");
    expect(formatted).toContain("3d-print-cost-check");
  });
});
