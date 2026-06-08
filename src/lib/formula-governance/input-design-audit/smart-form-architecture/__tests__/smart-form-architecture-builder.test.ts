/**
 * Phase 5H-G-A — smart form architecture builder tests.
 */

import { describe, expect, test } from "vitest";
import { ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS } from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-status";
import {
  buildBatchSmartFormArchitecturePlan,
  buildSmartFormArchitectureSpec,
  formatSmartFormArchitectureReport,
} from "@/lib/formula-governance/input-design-audit/smart-form-architecture/smart-form-architecture-builder";
import { resolveSmartFormArchitectureCoverage } from "@/lib/formula-governance/input-design-audit/smart-form-architecture/smart-form-architecture-status";

describe("smart form architecture builder", () => {
  test("builds spec for each completed input design patch", () => {
    for (const slug of ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS) {
      const spec = buildSmartFormArchitectureSpec(slug);
      expect(spec).toBeDefined();
      expect(spec?.slug).toBe(slug);
      expect(spec?.nextGate).toBe("smart_form_rendering_ready");
      expect(spec?.productionImpact).toBe("none");
      expect(spec?.uiImpact).toBe("none");
      expect(spec?.blockers).toHaveLength(0);
    }
  });

  test("includes required field groups and section plan", () => {
    const spec = buildSmartFormArchitectureSpec("3d-print-cost-check");
    expect(spec).toBeDefined();

    const groups = new Set(spec?.fields.map((field) => field.group));
    expect(groups.has("required")).toBe(true);
    expect(groups.has("optional")).toBe(true);
    expect(groups.has("advanced")).toBe(true);
    expect(groups.has("derived")).toBe(true);

    expect(spec?.sections.some((section) => section.id === "core-inputs")).toBe(true);
    expect(spec?.sections.some((section) => section.id === "optional-drivers")).toBe(true);
    expect(spec?.sections.some((section) => section.id === "advanced-risk")).toBe(true);
    expect(spec?.sections.some((section) => section.id === "assumptions")).toBe(true);
    expect(spec?.sections.some((section) => section.id === "derived-outputs")).toBe(true);
    expect(spec?.sections.some((section) => section.id === "trust-trace")).toBe(true);
  });

  test("plans missing input questions and validation messages", () => {
    const spec = buildSmartFormArchitectureSpec("auto-shop-margin-leak-detector");
    expect(spec).toBeDefined();
    expect(spec?.missingInputQuestions.length).toBeGreaterThan(0);
    expect(spec?.missingInputQuestions.some((entry) => entry.priority === "required")).toBe(true);
    expect(spec?.validationMessagePlans.length).toBeGreaterThan(0);
    expect(spec?.assumptionDisplays.length).toBeGreaterThan(0);
  });

  test("maps trust trace outputs from contract", () => {
    const spec = buildSmartFormArchitectureSpec("plumbing-job-margin-verdict");
    expect(spec).toBeDefined();
    expect(spec?.trustTraceMappings.length).toBeGreaterThan(0);
    expect(
      spec?.trustTraceMappings.some((entry) => entry.narrativeOutput || entry.disclaimerRequired),
    ).toBe(true);
  });

  test("batch plan covers all 15 patched tools with zero blockers", () => {
    const plan = buildBatchSmartFormArchitecturePlan(ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS);
    expect(plan.totalTools).toBe(15);
    expect(plan.renderingReady).toBe(15);
    expect(plan.pending).toBe(0);
    expect(plan.blockers).toHaveLength(0);
    expect(plan.specs).toHaveLength(15);
  });

  test("coverage helper matches batch plan", () => {
    const coverage = resolveSmartFormArchitectureCoverage();
    expect(coverage.total).toBe(15);
    expect(coverage.renderingReady).toBe(15);
    expect(coverage.pending).toBe(0);
  });

  test("formatted report is stable", () => {
    const plan = buildBatchSmartFormArchitecturePlan(ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS);
    const formatted = formatSmartFormArchitectureReport(plan);
    expect(formatted).toContain("Smart Form Architecture Summary");
    expect(formatted).toContain("Rendering ready: 15");
  });

  test("returns undefined for non-patched slug", () => {
    expect(buildSmartFormArchitectureSpec("rent-vs-buy-calculator")).toBeUndefined();
  });
});
