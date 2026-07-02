/**
 * Phase 5H-G-B - smart form render adapter tests.
 */

import { describe, expect, test } from "vitest";
import { getControlledInputDesignPatch } from "@/lib/features/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import { buildSmartFormPlan } from "@/lib/features/formula-governance/smart-form-architecture/smart-form-plan-builder";
import { buildSmartFormRenderPlan } from "@/lib/features/formula-governance/smart-form-rendering/smart-form-render-adapter";

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

describe("smart form render adapter", () => {
  test("converts 3d-print spec to render plan", () => {
    const slug = "3d-print-cost-check";
    const spec = buildSmartFormPlan({
      migrationPlanItem: buildMigrationItem(slug),
      controlledInputPatch: getControlledInputDesignPatch(slug),
    });

    const plan = buildSmartFormRenderPlan({ smartFormSpec: spec, renderMode: "free_quick_check" });

    expect(plan.slug).toBe(slug);
    expect(plan.readinessStatus).toBe("rendering_adapter_ready");
    expect(plan.sections.length).toBeGreaterThan(0);
    expect(plan.fieldCount).toBeGreaterThan(0);
  });

  test("places required section first", () => {
    const slug = "3d-print-cost-check";
    const spec = buildSmartFormPlan({
      migrationPlanItem: buildMigrationItem(slug),
      controlledInputPatch: getControlledInputDesignPatch(slug),
    });

    const plan = buildSmartFormRenderPlan({ smartFormSpec: spec, renderMode: "free_quick_check" });
    const requiredSection = plan.sections.find(
      (section) => section.sectionType === "required_inputs",
    );

    expect(requiredSection).toBeDefined();
    expect(plan.sections[0]?.sectionType).toBe("decision_goal");
    expect(plan.sections.some((section) => section.sectionType === "required_inputs")).toBe(true);
    expect(
      plan.sections.findIndex((section) => section.sectionType === "required_inputs"),
    ).toBeLessThan(
      plan.sections.findIndex((section) => section.sectionType === "optional_refinements"),
    );
  });

  test("derived fields are not editable", () => {
    const slug = "auto-shop-margin-leak-detector";
    const spec = buildSmartFormPlan({
      migrationPlanItem: buildMigrationItem(slug),
      controlledInputPatch: getControlledInputDesignPatch(slug),
    });

    const plan = buildSmartFormRenderPlan({ smartFormSpec: spec, renderMode: "free_quick_check" });
    const derivedFields = plan.sections.flatMap((section) =>
      section.fields.filter((field) => field.role === "derived"),
    );

    expect(derivedFields.length).toBeGreaterThan(0);
    for (const field of derivedFields) {
      expect(field.editable).toBe(false);
      expect(field.inputType).toBe("readonly_display");
    }
  });

  test("advanced section is collapsible", () => {
    const slug = "cabinet-cost-estimator";
    const spec = buildSmartFormPlan({
      migrationPlanItem: buildMigrationItem(slug),
      controlledInputPatch: getControlledInputDesignPatch(slug),
    });

    const plan = buildSmartFormRenderPlan({ smartFormSpec: spec, renderMode: "free_quick_check" });
    const advancedSection = plan.sections.find(
      (section) => section.sectionType === "advanced_professional_inputs",
    );

    expect(advancedSection?.collapsible).toBe(true);
  });

  test("free mode collapses advanced section", () => {
    const slug = "3d-print-cost-check";
    const spec = buildSmartFormPlan({
      migrationPlanItem: buildMigrationItem(slug),
      controlledInputPatch: getControlledInputDesignPatch(slug),
    });

    const freePlan = buildSmartFormRenderPlan({ smartFormSpec: spec, renderMode: "free_quick_check" });
    const premiumPlan = buildSmartFormRenderPlan({
      smartFormSpec: spec,
      renderMode: "premium_decision",
    });

    const freeAdvanced = freePlan.sections.find(
      (section) => section.sectionType === "advanced_professional_inputs",
    );
    const premiumAdvanced = premiumPlan.sections.find(
      (section) => section.sectionType === "advanced_professional_inputs",
    );

    expect(freeAdvanced?.defaultExpanded).toBe(false);
    expect(premiumAdvanced?.defaultExpanded).toBe(true);
  });

  test("builds trust trace panel when mapping exists", () => {
    const slug = "plumbing-job-margin-verdict";
    const spec = buildSmartFormPlan({
      migrationPlanItem: buildMigrationItem(slug),
      controlledInputPatch: getControlledInputDesignPatch(slug),
    });

    const plan = buildSmartFormRenderPlan({ smartFormSpec: spec, renderMode: "free_quick_check" });
    expect(plan.trustTracePanel.enabled).toBe(true);
    expect(plan.trustTracePanel.usedInputKeys.length).toBeGreaterThan(0);
  });
});
