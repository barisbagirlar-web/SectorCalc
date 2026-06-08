/**
 * Phase 5H-E — migration planner tests.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import { runBatchInputDesignAudit } from "@/lib/formula-governance/input-design-audit/batch-input-design-audit";
import { buildExistingToolMigrationPlan } from "@/lib/formula-governance/input-design-audit/migration-plan/migration-planner";
import { runBatchAlignmentAudit } from "@/lib/formula-governance/requirement-engine/batch-alignment-audit";
import {
  ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  SECOND_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  THIRD_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  FOURTH_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  FIFTH_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
} from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-status";
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

  test("marks patched tools as completed with smart form rendering gate", () => {
    const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const plan = buildExistingToolMigrationPlan({ inputDesignAudit });

    for (const slug of ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS) {
      const item = plan.items.find((entry) => entry.slug === slug);
      expect(item?.inputDesignPatchCompleted).toBe(true);
      expect(item?.nextGate).toBe("smart_form_rendering_ready");
      expect(item?.smartFormArchitectureReady).toBe(true);
      expect(item?.recommendedPatchLevel).toBe("none");
    }

    expect(plan.completedInputDesignPatches).toEqual([
      ...ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
    ]);
    expect(plan.smartFormRenderingReadyCount).toBe(15);
    expect(
      plan.recommendedFirstPatchBatch.some((item) =>
        ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS.includes(
          item.slug as (typeof ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS)[number],
        ),
      ),
    ).toBe(false);
  });

  test("marks second batch tools as completed with smart form gate", () => {
    const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const plan = buildExistingToolMigrationPlan({ inputDesignAudit });

    for (const slug of SECOND_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS) {
      const item = plan.items.find((entry) => entry.slug === slug);
      expect(item?.inputDesignPatchCompleted).toBe(true);
      expect(item?.nextGate).toBe("smart_form_rendering_ready");
      expect(item?.smartFormArchitectureReady).toBe(true);
    }

    for (const slug of FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS) {
      expect(plan.recommendedFirstPatchBatch.some((item) => item.slug === slug)).toBe(false);
    }
  });

  test("marks third batch tools as completed and excludes them from first patch batch", () => {
    const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const plan = buildExistingToolMigrationPlan({ inputDesignAudit });

    for (const slug of THIRD_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS) {
      const item = plan.items.find((entry) => entry.slug === slug);
      expect(item?.inputDesignPatchCompleted).toBe(true);
      expect(item?.nextGate).toBe("smart_form_rendering_ready");
      expect(item?.smartFormArchitectureReady).toBe(true);
      expect(plan.recommendedFirstPatchBatch.some((entry) => entry.slug === slug)).toBe(false);
    }
  });

  test("marks fourth batch tools as completed and excludes them from first patch batch", () => {
    const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const plan = buildExistingToolMigrationPlan({ inputDesignAudit });

    for (const slug of FOURTH_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS) {
      const item = plan.items.find((entry) => entry.slug === slug);
      expect(item?.inputDesignPatchCompleted).toBe(true);
      expect(item?.nextGate).toBe("smart_form_rendering_ready");
      expect(item?.smartFormArchitectureReady).toBe(true);
      expect(plan.recommendedFirstPatchBatch.some((entry) => entry.slug === slug)).toBe(false);
    }
  });

  test("marks fifth batch tools as completed and excludes them from first patch batch", () => {
    const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const plan = buildExistingToolMigrationPlan({ inputDesignAudit });

    expect(plan.completedInputDesignPatches).toHaveLength(15);

    for (const slug of FIFTH_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS) {
      const item = plan.items.find((entry) => entry.slug === slug);
      expect(item?.inputDesignPatchCompleted).toBe(true);
      expect(item?.nextGate).toBe("smart_form_rendering_ready");
      expect(item?.smartFormArchitectureReady).toBe(true);
      expect(plan.recommendedFirstPatchBatch.some((entry) => entry.slug === slug)).toBe(false);
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
