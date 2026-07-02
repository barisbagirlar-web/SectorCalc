/**
 * Phase 5H-G-A - smart form readiness gate tests.
 */

import { describe, expect, test } from "vitest";
import { getControlledInputDesignPatch } from "@/lib/features/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import { evaluateSmartFormReadiness } from "@/lib/features/formula-governance/smart-form-architecture/smart-form-readiness-gate";

function baseItem(slug: string) {
  return {
    slug,
    currentStatus: "usable" as const,
    inputSufficiencyScore: 80,
    professionalDepthScore: 75,
    migrationRiskScore: 10,
    recommendedPatchLevel: "none" as const,
    migrationPriority: "low" as const,
    migrationRiskLevel: "low" as const,
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
  };
}

describe("smart form readiness gate", () => {
  test("returns needs_input_design_patch without controlled patch", () => {
    const result = evaluateSmartFormReadiness({
      migrationPlanItem: baseItem("rent-vs-buy-calculator"),
    });
    expect(result.status).toBe("needs_input_design_patch");
  });

  test("returns ready_for_spec for completed patch tool", () => {
    const slug = "3d-print-cost-check";
    const result = evaluateSmartFormReadiness({
      migrationPlanItem: baseItem(slug),
      controlledInputPatch: getControlledInputDesignPatch(slug),
    });
    expect(result.status).toBe("ready_for_spec");
    expect(result.blockers).toHaveLength(0);
  });

  test("returns blocked when alignment is blocked", () => {
    const slug = "3d-print-cost-check";
    const result = evaluateSmartFormReadiness({
      migrationPlanItem: baseItem(slug),
      controlledInputPatch: getControlledInputDesignPatch(slug),
      alignmentSummary: {
        slug,
        status: "blocked",
        migrationRiskScore: 90,
        aliasCount: 0,
        manualReviewCount: 1,
        blockerCount: 1,
        warningCount: 0,
        safeToUseContractOntologyForRequirementEngine: false,
        recommendedAction: "block",
      },
    });
    expect(result.status).toBe("blocked");
  });

  test("returns needs_alignment_review for high-risk needs_review alignment", () => {
    const slug = "3d-print-cost-check";
    const result = evaluateSmartFormReadiness({
      migrationPlanItem: {
        ...baseItem(slug),
        migrationRiskLevel: "high",
      },
      controlledInputPatch: getControlledInputDesignPatch(slug),
      alignmentSummary: {
        slug,
        status: "needs_review",
        migrationRiskScore: 38,
        aliasCount: 2,
        manualReviewCount: 1,
        blockerCount: 0,
        warningCount: 1,
        safeToUseContractOntologyForRequirementEngine: false,
        recommendedAction: "review",
      },
    });
    expect(result.status).toBe("needs_alignment_review");
  });
});
