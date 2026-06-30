/**
 * Phase 5H-G-A — missing input question planner tests.
 */

import { describe, expect, test } from "vitest";
import { getControlledInputDesignPatch } from "@/lib/features/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import { buildMissingInputQuestions } from "@/lib/features/formula-governance/smart-form-architecture/missing-input-question-planner";
import { buildSmartFormPlan } from "@/lib/features/formula-governance/smart-form-architecture/smart-form-plan-builder";

describe("missing input question planner", () => {
  test("generates required question for materialCost", () => {
    const plan = buildSmartFormPlan({
      migrationPlanItem: {
        slug: "3d-print-cost-check",
        currentStatus: "usable",
        inputSufficiencyScore: 80,
        professionalDepthScore: 75,
        migrationRiskScore: 10,
        recommendedPatchLevel: "none",
        migrationPriority: "low",
        migrationRiskLevel: "low",
        canPatchWithoutUIBreak: true,
        hasFullGovernanceCoverage: true,
        requiredActions: [],
        blockedBy: [],
        expectedBenefit: "",
        affectedAreas: [],
        testRequirements: [],
        nextGate: "",
        notes: [],
        inputDesignPatchCompleted: true,
        smartFormArchitectureReady: false,
      },
      controlledInputPatch: getControlledInputDesignPatch("3d-print-cost-check"),
    });

    const questions = buildMissingInputQuestions(plan.fields);
    const materialQuestion = questions.find((entry) => entry.fieldKey === "materialCost");
    expect(materialQuestion?.question).toContain("direct material cost");
    expect(materialQuestion?.priority).toBe("required");
  });

  test("does not generate questions for derived fields", () => {
    const plan = buildSmartFormPlan({
      migrationPlanItem: {
        slug: "3d-print-cost-check",
        currentStatus: "usable",
        inputSufficiencyScore: 80,
        professionalDepthScore: 75,
        migrationRiskScore: 10,
        recommendedPatchLevel: "none",
        migrationPriority: "low",
        migrationRiskLevel: "low",
        canPatchWithoutUIBreak: true,
        hasFullGovernanceCoverage: true,
        requiredActions: [],
        blockedBy: [],
        expectedBenefit: "",
        affectedAreas: [],
        testRequirements: [],
        nextGate: "",
        notes: [],
        inputDesignPatchCompleted: true,
        smartFormArchitectureReady: false,
      },
      controlledInputPatch: getControlledInputDesignPatch("3d-print-cost-check"),
    });

    const questions = buildMissingInputQuestions(plan.fields);
    const derivedKeys = plan.fields
      .filter((field) => field.role === "derived")
      .map((field) => field.key);

    for (const key of derivedKeys) {
      expect(questions.some((entry) => entry.fieldKey === key)).toBe(false);
    }
  });
});
