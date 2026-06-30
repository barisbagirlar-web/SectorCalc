/**
 * Phase 5H-C — input sufficiency scorer tests.
 */

import { describe, expect, test } from "vitest";
import { scoreInputSufficiency } from "@/lib/features/formula-governance/input-design-audit/input-sufficiency-scorer";
import { getFormulaContractBySlug } from "@/lib/features/formula-governance/contracts";
import type { InputReadinessAudit } from "@/lib/features/formula-governance/requirement-engine/contract-requirement-bridge";
import type { RequirementSolveResult } from "@/lib/features/formula-governance/requirement-engine/requirement-engine-types";

const ROOFING_SLUG = "roofing-contract-margin-guard";

function baseRequirementResult(overrides?: Partial<RequirementSolveResult>): RequirementSolveResult {
  return {
    status: "need_more_data",
    requiredMissingInputs: ["materialCost", "laborHours", "laborRate"],
    optionalRecommendedInputs: [],
    advancedRecommendedInputs: [],
    defaultedInputs: [],
    acceptedAssumptions: [],
    derivedResolutionPlan: [],
    selectedFormulaPath: [],
    blockers: [],
    warnings: [],
    ...overrides,
  };
}

function baseReadinessAudit(overrides?: Partial<InputReadinessAudit>): InputReadinessAudit {
  return {
    slug: ROOFING_SLUG,
    status: "needs_input_design",
    missingInputMetadata: [],
    missingDimensionRules: [],
    defaultAssumptionGaps: [],
    derivedInputRisks: [],
    professionalUpgradeGaps: [],
    warnings: [],
    blockers: [],
    ...overrides,
  };
}

describe("scoreInputSufficiency", () => {
  test("complete required inputs produce high score", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const result = scoreInputSufficiency({
      contract,
      requirementResult: baseRequirementResult({
        requiredMissingInputs: [...contract.criticalInputs],
      }),
      readinessAudit: baseReadinessAudit(),
    });

    expect(result.score).toBeGreaterThanOrEqual(85);
    expect(result.missingRequiredInputs).toHaveLength(0);
  });

  test("missing critical input lowers score", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const baseline = scoreInputSufficiency({
      contract,
      requirementResult: baseRequirementResult({
        requiredMissingInputs: [...contract.criticalInputs],
      }),
      readinessAudit: baseReadinessAudit(),
    });
    const degraded = scoreInputSufficiency({
      contract,
      requirementResult: baseRequirementResult({
        requiredMissingInputs: [...contract.criticalInputs, "phantomCriticalInput"],
      }),
      readinessAudit: baseReadinessAudit({
        missingInputMetadata: [
          'Requirement missing input "phantomCriticalInput" is not declared in FormulaContract inputs.',
        ],
      }),
    });

    expect(degraded.score).toBeLessThan(baseline.score);
    expect(degraded.missingRequiredInputs).toContain("phantomCriticalInput");
  });

  test("dimension gap lowers score", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const baseline = scoreInputSufficiency({
      contract,
      requirementResult: baseRequirementResult({
        requiredMissingInputs: [...contract.criticalInputs],
      }),
      readinessAudit: baseReadinessAudit(),
    });
    const degraded = scoreInputSufficiency({
      contract,
      requirementResult: baseRequirementResult({
        requiredMissingInputs: [...contract.criticalInputs],
      }),
      readinessAudit: baseReadinessAudit({
        missingDimensionRules: ['Dimensional rule "dim-1" has no mapped ontology variable.'],
      }),
    });

    expect(degraded.score).toBeLessThan(baseline.score);
    expect(degraded.dimensionGaps.length).toBeGreaterThan(0);
  });

  test("default assumption gap lowers score", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const baseline = scoreInputSufficiency({
      contract,
      requirementResult: baseRequirementResult({
        requiredMissingInputs: [...contract.criticalInputs],
      }),
      readinessAudit: baseReadinessAudit(),
    });
    const degraded = scoreInputSufficiency({
      contract,
      requirementResult: baseRequirementResult({
        requiredMissingInputs: [...contract.criticalInputs],
        defaultedInputs: ["wasteFactor"],
      }),
      readinessAudit: baseReadinessAudit({
        defaultAssumptionGaps: [
          'Defaulted input "wasteFactor" has no accepted assumption in contract metadata.',
        ],
      }),
    });

    expect(degraded.score).toBeLessThan(baseline.score);
    expect(degraded.defaultAssumptionGaps.length).toBeGreaterThan(0);
  });

  test("alignment blocked produces blocked alignment flag and capped score", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const result = scoreInputSufficiency({
      contract,
      requirementResult: baseRequirementResult({
        requiredMissingInputs: [...contract.criticalInputs],
      }),
      readinessAudit: baseReadinessAudit(),
      alignmentSummary: {
        migrationRisk: 72,
        driftGateStatus: "blocked",
        driftGateRecommendedAction: "Blocked",
        manualReviewRequired: true,
        suggestedMetadataImprovements: [],
        variableAliasContexts: [],
        alignmentStatus: "blocked",
      },
    });

    expect(result.alignmentBlocked).toBe(true);
    expect(result.score).toBeLessThanOrEqual(45);
    expect(result.blockers.some((blocker) => blocker.includes("Alignment blocked"))).toBe(true);
  });

  test("derived input misuse produces warning/blocker", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const result = scoreInputSufficiency({
      contract,
      requirementResult: baseRequirementResult({
        requiredMissingInputs: ["baseCost", ...contract.criticalInputs],
      }),
      readinessAudit: baseReadinessAudit({
        derivedInputRisks: ['Derived variable "baseCost" incorrectly requested from user.'],
      }),
    });

    expect(result.derivedInputMisuse.length).toBeGreaterThan(0);
    expect(result.blockers.some((blocker) => blocker.includes("baseCost"))).toBe(true);
  });
});
