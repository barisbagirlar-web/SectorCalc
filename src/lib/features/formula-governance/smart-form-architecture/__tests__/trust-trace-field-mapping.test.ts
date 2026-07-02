/**
 * Phase 5H-G-A - trust trace field mapping tests.
 */

import { describe, expect, test } from "vitest";
import { getControlledInputDesignPatch } from "@/lib/features/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import { buildSmartFormPlan } from "@/lib/features/formula-governance/smart-form-architecture/smart-form-plan-builder";
import { buildTrustTraceFieldMapping } from "@/lib/features/formula-governance/smart-form-architecture/trust-trace-field-mapping";

describe("trust trace field mapping", () => {
  test("maps usedInputs, defaultAssumptions, and derivedValues", () => {
    const slug = "plumbing-job-margin-verdict";
    const plan = buildSmartFormPlan({
      migrationPlanItem: {
        slug,
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
      controlledInputPatch: getControlledInputDesignPatch(slug),
    });

    const mapping = buildTrustTraceFieldMapping(plan);

    expect(mapping.usedInputs.length).toBeGreaterThan(0);
    expect(mapping.defaultAssumptions.length).toBeGreaterThan(0);
    expect(mapping.derivedValues.length).toBeGreaterThan(0);
    expect(mapping.validationSources.length).toBeGreaterThan(0);
    expect(mapping.professionalInputs.length).toBeGreaterThan(0);
    expect(mapping.hiddenNonEditableValues.length).toBeGreaterThan(0);
  });
});
