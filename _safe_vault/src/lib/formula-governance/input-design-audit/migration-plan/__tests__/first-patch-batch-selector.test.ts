/**
 * Phase 5H-E — first controlled patch batch selector tests.
 */

import { describe, expect, test } from "vitest";
import { selectFirstControlledPatchBatch } from "@/lib/formula-governance/input-design-audit/migration-plan/first-patch-batch-selector";
import type {
  BatchMigrationPlan,
  ToolMigrationPlanItem,
} from "@/lib/formula-governance/input-design-audit/migration-plan/migration-plan-types";

function buildItem(overrides: Partial<ToolMigrationPlanItem>): ToolMigrationPlanItem {
  return {
    slug: "sample-tool",
    currentStatus: "professional_ready",
    inputSufficiencyScore: 90,
    professionalDepthScore: 85,
    alignmentStatus: "contract_only_analysis",
    migrationRiskScore: 0,
    recommendedPatchLevel: "input_design_only",
    migrationPriority: "immediate",
    migrationRiskLevel: "low",
    canPatchWithoutUIBreak: true,
    hasFullGovernanceCoverage: true,
    requiredActions: [],
    blockedBy: [],
    expectedBenefit: "benefit",
    affectedAreas: [],
    testRequirements: [],
    nextGate: "controlled_patch_ready",
    notes: [],
    inputDesignPatchCompleted: false,
    smartFormArchitectureReady: false,
    ...overrides,
  };
}

function buildPlan(items: readonly ToolMigrationPlanItem[]): BatchMigrationPlan {
  return {
    totalTools: items.length,
    immediate: 0,
    high: 0,
    medium: 0,
    low: 0,
    defer: 0,
    items,
    recommendedFirstPatchBatch: [],
    completedInputDesignPatches: [],
    smartFormRenderingReadyCount: 0,
    warnings: [],
    blockers: [],
  };
}

describe("selectFirstControlledPatchBatch", () => {
  test("selects 1 to 3 tools", () => {
    const plan = buildPlan([
      buildItem({ slug: "alpha-tool" }),
      buildItem({ slug: "beta-tool", migrationPriority: "high" }),
      buildItem({ slug: "gamma-tool", migrationPriority: "medium" }),
      buildItem({ slug: "delta-tool", migrationPriority: "low" }),
    ]);

    const batch = selectFirstControlledPatchBatch(plan);
    expect(batch.length).toBeGreaterThanOrEqual(1);
    expect(batch.length).toBeLessThanOrEqual(3);
  });

  test("does not select blocked tools", () => {
    const plan = buildPlan([
      buildItem({ slug: "blocked-tool", recommendedPatchLevel: "blocked", currentStatus: "blocked" }),
      buildItem({ slug: "ready-tool" }),
    ]);

    const batch = selectFirstControlledPatchBatch(plan);
    expect(batch.some((item) => item.slug === "blocked-tool")).toBe(false);
    expect(batch.some((item) => item.slug === "ready-tool")).toBe(true);
  });

  test("does not select high-risk tools", () => {
    const plan = buildPlan([
      buildItem({ slug: "high-risk-tool", migrationRiskLevel: "high", migrationRiskScore: 35 }),
      buildItem({ slug: "low-risk-tool", migrationRiskLevel: "low" }),
    ]);

    const batch = selectFirstControlledPatchBatch(plan);
    expect(batch.some((item) => item.slug === "high-risk-tool")).toBe(false);
    expect(batch[0]?.slug).toBe("low-risk-tool");
  });

  test("deprioritizes tools without oracle scenario property coverage", () => {
    const plan = buildPlan([
      buildItem({
        slug: "uncovered-tool",
        hasFullGovernanceCoverage: false,
        inputSufficiencyScore: 95,
      }),
      buildItem({
        slug: "covered-tool",
        hasFullGovernanceCoverage: true,
        inputSufficiencyScore: 80,
      }),
    ]);

    const batch = selectFirstControlledPatchBatch(plan);
    expect(batch.some((item) => item.slug === "uncovered-tool")).toBe(false);
    expect(batch[0]?.slug).toBe("covered-tool");
  });

  test("does not re-select completed input design patch tools", () => {
    const plan = buildPlan([
      buildItem({ slug: "3d-print-cost-check", inputDesignPatchCompleted: true }),
      buildItem({ slug: "electrical-labor-estimator" }),
      buildItem({ slug: "print-job-cost-check" }),
    ]);

    const batch = selectFirstControlledPatchBatch(plan);
    expect(batch.some((item) => item.slug === "3d-print-cost-check")).toBe(false);
    expect(batch.length).toBeGreaterThan(0);
  });

  test("produces deterministic ordering", () => {
    const plan = buildPlan([
      buildItem({ slug: "zulu-tool", inputSufficiencyScore: 88 }),
      buildItem({ slug: "alpha-tool", inputSufficiencyScore: 88 }),
      buildItem({ slug: "mike-tool", inputSufficiencyScore: 88 }),
    ]);

    const first = selectFirstControlledPatchBatch(plan);
    const second = selectFirstControlledPatchBatch(plan);
    expect(first).toEqual(second);
  });
});
