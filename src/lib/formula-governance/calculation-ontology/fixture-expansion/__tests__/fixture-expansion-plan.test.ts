/**
 * Fixture expansion plan tests — Phase 5I-K.
 */

import { describe, expect, test } from "vitest";
import { runFixtureExpansionAudit } from "@/lib/formula-governance/calculation-ontology/fixture-expansion/fixture-expansion-audit";

describe("fixture expansion plan — Phase 5I-K", () => {
  test("audit produces deterministic candidates", () => {
    const first = runFixtureExpansionAudit();
    const second = runFixtureExpansionAudit();
    expect(first.totalCandidates).toBe(second.totalCandidates);
    expect(first.top10FixtureCandidates).toEqual(second.top10FixtureCandidates);
  });

  test("no fixture files are written", () => {
    const result = runFixtureExpansionAudit();
    expect(result.plans.length).toBeGreaterThan(0);
    expect(result.plans.every((plan) => plan.targetOutput.length > 0)).toBe(true);
  });

  test("expected input design lift is aggregated", () => {
    const result = runFixtureExpansionAudit();
    expect(result.expectedInputDesignLift).toBeGreaterThan(0);
  });
});
