/**
 * Roadmap debt register tests — Phase 5I-Q.
 */

import { describe, expect, test } from "vitest";
import { runRoadmapDebtAudit } from "@/lib/features/formula-governance/roadmap-debt-register/roadmap-debt-audit";

describe("roadmap debt register — Phase 5I-Q", () => {
  test("debt register has expected categories", () => {
    const result = runRoadmapDebtAudit();
    expect(result.totalRemainingDebt).toBe(10);
    expect(result.entries.some((e) => e.category === "fixture_ontology_expansion")).toBe(true);
    expect(result.entries.some((e) => e.category === "smart_form_rollout_expansion")).toBe(true);
  });

  test("next 3 batches compressed", () => {
    const result = runRoadmapDebtAudit();
    expect(result.next3Batches).toHaveLength(3);
  });

  test("investor demo minimum path defined", () => {
    const result = runRoadmapDebtAudit();
    expect(result.investorDemoMinimumPath.length).toBeGreaterThan(0);
    expect(result.fullProductizationPath.length).toBeGreaterThan(result.investorDemoMinimumPath.length);
  });
});
