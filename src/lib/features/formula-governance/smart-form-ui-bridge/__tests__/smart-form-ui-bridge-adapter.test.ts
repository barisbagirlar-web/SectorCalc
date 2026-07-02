/**
 * Phase 5H-G-C - smart form UI bridge adapter tests.
 */

import { describe, expect, test } from "vitest";
import { getControlledInputDesignPatch } from "@/lib/features/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import { buildSmartFormPlan } from "@/lib/features/formula-governance/smart-form-architecture/smart-form-plan-builder";
import { buildSmartFormRenderPlan } from "@/lib/features/formula-governance/smart-form-rendering/smart-form-render-adapter";
import { buildSmartFormUiBridgeManifest } from "@/lib/features/formula-governance/smart-form-ui-bridge/smart-form-ui-bridge-adapter";

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

function buildManifestForSlug(slug: string) {
  const spec = buildSmartFormPlan({
    migrationPlanItem: buildMigrationItem(slug),
    controlledInputPatch: getControlledInputDesignPatch(slug),
  });
  const renderPlan = buildSmartFormRenderPlan({ smartFormSpec: spec, renderMode: "free_quick_check" });
  return buildSmartFormUiBridgeManifest({ renderPlan });
}

describe("smart form UI bridge adapter", () => {
  test("converts 3d-print render plan to UI bridge manifest", () => {
    const manifest = buildManifestForSlug("3d-print-cost-check");

    expect(manifest.slug).toBe("3d-print-cost-check");
    expect(manifest.status).toBe("ui_bridge_ready");
    expect(manifest.sections.length).toBeGreaterThan(0);
    expect(manifest.fields.length).toBeGreaterThan(0);
    expect(manifest.blockers).toHaveLength(0);
  });

  test("auto-shop manifest includes field, section, and trust trace props", () => {
    const manifest = buildManifestForSlug("auto-shop-margin-leak-detector");

    expect(manifest.status).toBe("ui_bridge_ready");
    expect(manifest.sections.some((section) => section.fields.length > 0)).toBe(true);
    expect(manifest.trustTrace.enabled).toBe(true);
    expect(manifest.trustTrace.usedInputs.length).toBeGreaterThan(0);
  });

  test("cabinet manifest is ui_bridge_ready", () => {
    const manifest = buildManifestForSlug("cabinet-cost-estimator");
    expect(manifest.status).toBe("ui_bridge_ready");
  });

  test("derived fields map to field_readonly", () => {
    const manifest = buildManifestForSlug("3d-print-cost-check");
    const derivedFields = manifest.fields.filter((field) => field.badges.includes("Derived"));

    expect(derivedFields.length).toBeGreaterThan(0);
    for (const field of derivedFields) {
      expect(field.componentKind).toBe("field_readonly");
      expect(field.editable).toBe(false);
    }
  });

  test("assumption fields map to assumption_callout", () => {
    const manifest = buildManifestForSlug("3d-print-cost-check");
    const assumptions = manifest.fields.filter(
      (field) => field.componentKind === "assumption_callout",
    );

    expect(assumptions.length).toBeGreaterThan(0);
    expect(assumptions.some((field) => field.badges.includes("Assumption"))).toBe(true);
  });

  test("manifest is serializable without React/UI imports", () => {
    const manifest = buildManifestForSlug("3d-print-cost-check");
    expect(() => JSON.stringify(manifest)).not.toThrow();
    const parsed = JSON.parse(JSON.stringify(manifest)) as typeof manifest;
    expect(parsed.slug).toBe("3d-print-cost-check");
    expect(parsed.mobileProps.sectionOrder.length).toBeGreaterThan(0);
    expect(parsed.desktopProps.placements.length).toBeGreaterThan(0);
  });
});
