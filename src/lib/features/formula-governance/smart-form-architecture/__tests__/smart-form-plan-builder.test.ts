/**
 * Phase 5H-G-A - smart form plan builder tests.
 */

import { describe, expect, test } from "vitest";
import { getControlledInputDesignPatch } from "@/lib/features/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import { buildSmartFormPlan } from "@/lib/features/formula-governance/smart-form-architecture/smart-form-plan-builder";

function buildMigrationItem(slug: string) {
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

describe("smart form plan builder", () => {
  test("builds plan for 3d-print-cost-check with full sections", () => {
    const slug = "3d-print-cost-check";
    const patch = getControlledInputDesignPatch(slug);
    const plan = buildSmartFormPlan({
      migrationPlanItem: buildMigrationItem(slug),
      controlledInputPatch: patch,
    });

    expect(plan.slug).toBe(slug);
    expect(plan.readinessStatus).toBe("ready_for_spec");
    expect(plan.nextGate).toBe("smart_form_rendering_ready");
    expect(plan.blockers).toHaveLength(0);

    const sectionTypes = plan.sections.map((section) => section.type);
    expect(sectionTypes).toContain("required_inputs");
    expect(sectionTypes).toContain("optional_refinements");
    expect(sectionTypes).toContain("advanced_professional_inputs");
    expect(sectionTypes).toContain("default_assumptions");
    expect(sectionTypes).toContain("derived_values");
    expect(sectionTypes).toContain("validation_messages");
    expect(sectionTypes).toContain("trust_trace");
  });

  test("marks derived fields as non-editable", () => {
    const slug = "3d-print-cost-check";
    const plan = buildSmartFormPlan({
      migrationPlanItem: buildMigrationItem(slug),
      controlledInputPatch: getControlledInputDesignPatch(slug),
    });

    const derivedFields = plan.fields.filter((field) => field.role === "derived");
    expect(derivedFields.length).toBeGreaterThan(0);
    for (const field of derivedFields) {
      expect(field.userEditable).toBe(false);
      expect(field.visibility).toBe("hidden_derived");
    }
  });

  test("routes default assumptions to display list", () => {
    const slug = "cabinet-cost-estimator";
    const plan = buildSmartFormPlan({
      migrationPlanItem: buildMigrationItem(slug),
      controlledInputPatch: getControlledInputDesignPatch(slug),
    });

    expect(plan.defaultAssumptionDisplays.length).toBeGreaterThan(0);
    expect(plan.fields.some((field) => field.role === "assumption")).toBe(true);
  });

  test("non-patched tool needs input design patch", () => {
    const plan = buildSmartFormPlan({
      migrationPlanItem: buildMigrationItem("rent-vs-buy-calculator"),
    });

    expect(plan.readinessStatus).toBe("needs_input_design_patch");
    expect(plan.nextGate).toBe("controlled_input_patch");
  });
});
