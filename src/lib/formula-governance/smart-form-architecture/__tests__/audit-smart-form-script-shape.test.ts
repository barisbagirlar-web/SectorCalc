/**
 * Phase 5H-G-A — audit smart form CLI shape tests.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import { CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY } from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import { runBatchInputDesignAudit } from "@/lib/formula-governance/input-design-audit/batch-input-design-audit";
import { buildExistingToolMigrationPlan } from "@/lib/formula-governance/input-design-audit/migration-plan/migration-planner";
import {
  formatBatchSmartFormPlanAuditReport,
  runBatchSmartFormPlanAudit,
} from "@/lib/formula-governance/smart-form-architecture/batch-smart-form-plan-audit";
import { runBatchAlignmentAudit } from "@/lib/formula-governance/requirement-engine/batch-alignment-audit";

describe("audit smart form script shape", () => {
  test("summary shape matches CLI contract", () => {
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

    expect(result.totalTools).toBe(131);
    expect(result.readyForSpec).toBe(15);
    expect(result.needsInputDesignPatch).toBe(116);
    expect(result.blocked).toBe(0);
    expect(result.recommendedFirstSmartFormBatch.length).toBe(3);
  });

  test("formatted report does not throw", () => {
    const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const migrationPlan = buildExistingToolMigrationPlan({ inputDesignAudit });
    const result = runBatchSmartFormPlanAudit({
      migrationPlan,
      controlledPatchRegistry: CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY,
    });

    expect(() => formatBatchSmartFormPlanAuditReport(result)).not.toThrow();
    const formatted = formatBatchSmartFormPlanAuditReport(result);
    expect(formatted).toContain("Smart Form Architecture Audit");
    expect(formatted).toContain("Ready for spec: 15");
    expect(formatted).toContain("Recommended first smart form batch:");
    expect(formatted).toContain("3d-print-cost-check");
  });
});
