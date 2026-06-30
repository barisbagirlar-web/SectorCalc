/**
 * Phase 5H-G-B — smart form layout planner tests.
 */

import { describe, expect, test } from "vitest";
import { getControlledInputDesignPatch } from "@/lib/features/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import { buildSmartFormPlan } from "@/lib/features/formula-governance/smart-form-architecture/smart-form-plan-builder";
import { buildSmartFormRenderPlan } from "@/lib/features/formula-governance/smart-form-rendering/smart-form-render-adapter";
import { buildSmartFormLayoutPlan } from "@/lib/features/formula-governance/smart-form-rendering/smart-form-layout-planner";

describe("smart form layout planner", () => {
  test("mobile layout is single column", () => {
    const slug = "3d-print-cost-check";
    const spec = buildSmartFormPlan({
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

    const renderPlan = buildSmartFormRenderPlan({ smartFormSpec: spec, renderMode: "free_quick_check" });
    const layouts = buildSmartFormLayoutPlan(renderPlan);

    expect(layouts.mobileLayout.columns).toBe(1);
    for (const placement of layouts.mobileLayout.placements) {
      expect(placement.columnIndex).toBe(0);
    }
  });

  test("desktop layout uses max 2 columns", () => {
    const slug = "3d-print-cost-check";
    const spec = buildSmartFormPlan({
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

    const renderPlan = buildSmartFormRenderPlan({ smartFormSpec: spec, renderMode: "free_quick_check" });
    const layouts = buildSmartFormLayoutPlan(renderPlan);

    expect(layouts.desktopLayout.maxColumns).toBe(2);
    for (const placement of layouts.desktopLayout.placements) {
      expect(placement.columnIndex).toBeLessThanOrEqual(1);
    }
  });

  test("required section appears before advanced in layout order", () => {
    const slug = "3d-print-cost-check";
    const spec = buildSmartFormPlan({
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

    const renderPlan = buildSmartFormRenderPlan({ smartFormSpec: spec, renderMode: "free_quick_check" });
    const layouts = buildSmartFormLayoutPlan(renderPlan);

    const requiredId = renderPlan.sections.find((section) => section.sectionType === "required_inputs")?.id;
    const advancedId = renderPlan.sections.find(
      (section) => section.sectionType === "advanced_professional_inputs",
    )?.id;

    const requiredIndex = layouts.mobileLayout.sectionOrder.indexOf(requiredId ?? "");
    const advancedIndex = layouts.mobileLayout.sectionOrder.indexOf(advancedId ?? "");

    expect(requiredIndex).toBeGreaterThanOrEqual(0);
    expect(advancedIndex).toBeGreaterThan(requiredIndex);
  });
});
