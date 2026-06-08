/**
 * Phase 5H-E — migration planner tests.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import { runBatchInputDesignAudit } from "@/lib/formula-governance/input-design-audit/batch-input-design-audit";
import { buildExistingToolMigrationPlan } from "@/lib/formula-governance/input-design-audit/migration-plan/migration-planner";
import { runBatchAlignmentAudit } from "@/lib/formula-governance/requirement-engine/batch-alignment-audit";
import type { ToolInputDesignAuditResult } from "@/lib/formula-governance/input-design-audit/input-design-audit-types";

describe("buildExistingToolMigrationPlan", () => {
  test("builds plan for 41 tools", () => {
    const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const plan = buildExistingToolMigrationPlan({ inputDesignAudit });

    expect(plan.totalTools).toBe(41);
    expect(plan.items).toHaveLength(41);
    expect(
      plan.immediate + plan.high + plan.medium + plan.low + plan.defer,
    ).toBe(41);
  });

  test("professional_ready tools can be immediate or high priority", () => {
    const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const plan = buildExistingToolMigrationPlan({ inputDesignAudit });

    const professionalReady = plan.items.filter((item) => item.currentStatus === "professional_ready");
    expect(professionalReady.length).toBeGreaterThan(0);
    expect(
      professionalReady.every(
        (item) => item.migrationPriority === "immediate" || item.migrationPriority === "high",
      ),
    ).toBe(true);
  });

  test("blocked tools are excluded from first patch batch", () => {
    const blockedSummary: ToolInputDesignAuditResult = {
      slug: "blocked-sample",
      status: "blocked",
      inputSufficiencyScore: 0,
      professionalDepthScore: 0,
      missingRequiredInputs: [],
      missingRiskDrivers: [],
      missingAdvancedInputs: [],
      derivedInputMisuse: [],
      defaultAssumptionGaps: [],
      validationGaps: [],
      dimensionGaps: [],
      alignmentStatus: "blocked",
      migrationRiskScore: 100,
      recommendedPatchLevel: "blocked",
      canPatchWithoutUIBreak: false,
      nextAction: "blocked",
      warnings: [],
      blockers: ["Hard blocker"],
    };

    const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const plan = buildExistingToolMigrationPlan({
      inputDesignAudit: {
        ...inputDesignAudit,
        summaries: [...inputDesignAudit.summaries, blockedSummary],
        totalContracts: inputDesignAudit.totalContracts + 1,
        blocked: inputDesignAudit.blocked + 1,
      },
    });

    expect(plan.recommendedFirstPatchBatch.some((item) => item.slug === "blocked-sample")).toBe(
      false,
    );
  });

  test("contract_only_analysis recommends fixture_ontology for non-ready tools", () => {
    const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const plan = buildExistingToolMigrationPlan({ inputDesignAudit });

    const shallowContractOnly = plan.items.find(
      (item) =>
        item.alignmentStatus === "contract_only_analysis" &&
        item.currentStatus !== "professional_ready",
    );

    if (shallowContractOnly) {
      expect(shallowContractOnly.recommendedPatchLevel).toBe("fixture_ontology");
    } else {
      const contractOnly = plan.items.filter(
        (item) => item.alignmentStatus === "contract_only_analysis",
      );
      expect(contractOnly.length).toBeGreaterThan(0);
    }
  });

  test("defers tools that cannot patch without UI break for smart form patches", () => {
    const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const plan = buildExistingToolMigrationPlan({ inputDesignAudit });

    const smartFormDefer = plan.items.filter(
      (item) =>
        item.recommendedPatchLevel === "smart_form_patch" && !item.canPatchWithoutUIBreak,
    );

    for (const item of smartFormDefer) {
      expect(item.migrationPriority).toBe("defer");
    }
  });

  test("is deterministic", () => {
    const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const alignmentAudit = runBatchAlignmentAudit({ contracts: FORMULA_CONTRACTS });

    const first = buildExistingToolMigrationPlan({ inputDesignAudit, alignmentAudit });
    const second = buildExistingToolMigrationPlan({ inputDesignAudit, alignmentAudit });

    expect(first).toEqual(second);
  });
});
