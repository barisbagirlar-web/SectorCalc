/**
 * Phase 5H-G-B — audit smart form rendering CLI shape tests.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import { CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY } from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import { runBatchInputDesignAudit } from "@/lib/formula-governance/input-design-audit/batch-input-design-audit";
import { buildExistingToolMigrationPlan } from "@/lib/formula-governance/input-design-audit/migration-plan/migration-planner";
import { runBatchSmartFormPlanAudit } from "@/lib/formula-governance/smart-form-architecture/batch-smart-form-plan-audit";
import {
  formatBatchSmartFormRenderAuditReport,
  runBatchSmartFormRenderAudit,
} from "@/lib/formula-governance/smart-form-rendering/batch-smart-form-render-audit";
import { runBatchAlignmentAudit } from "@/lib/formula-governance/requirement-engine/batch-alignment-audit";

describe("audit smart form rendering script shape", () => {
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

    const result = runBatchSmartFormRenderAudit({
      smartFormPlans: smartFormAudit.plans,
      renderMode: "free_quick_check",
    });

    expect(result.readySpecs).toBe(15);
    expect(result.renderingAdapterReady).toBe(15);
    expect(result.blocked).toBe(0);
    expect(result.derivedReadonlyViolations).toBe(0);
    expect(result.recommendedFirstUiPilot.length).toBe(3);
  });

  test("formatted report does not throw", () => {
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

    expect(() => formatBatchSmartFormRenderAuditReport(result)).not.toThrow();
    const formatted = formatBatchSmartFormRenderAuditReport(result);
    expect(formatted).toContain("Smart Form Rendering Audit");
    expect(formatted).toContain("Rendering adapter ready: 15");
    expect(formatted).toContain("Recommended first UI pilot:");
    expect(formatted).toContain("3d-print-cost-check");
  });
});
