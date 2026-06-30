/**
 * Phase 5H-B-6 — drift score gate tests.
 */

import { describe, expect, test } from "vitest";
import { evaluateDriftScoreGate } from "@/lib/formula-governance/requirement-engine/drift-score-gate";
import type { OntologyAliasMap } from "@/lib/formula-governance/calculation-ontology/ontology-alias-types";

function emptyAliasMap(overrides: Partial<OntologyAliasMap> = {}): OntologyAliasMap {
  return {
    slug: "test-tool",
    aliases: [],
    compositeAliases: [],
    unmatchedContractVariables: [],
    unmatchedOntologyVariables: [],
    warnings: [],
    blockers: [],
    ...overrides,
  };
}

describe("evaluateDriftScoreGate", () => {
  test("low migration risk yields low_risk", () => {
    const result = evaluateDriftScoreGate({
      migrationRiskScore: 20,
      blockers: [],
      warnings: [],
      aliasMap: emptyAliasMap(),
    });

    expect(result.status).toBe("low_risk");
  });

  test("migration risk 35–69 yields needs_review", () => {
    const result = evaluateDriftScoreGate({
      migrationRiskScore: 45,
      blockers: [],
      warnings: [],
      aliasMap: emptyAliasMap(),
    });

    expect(result.status).toBe("needs_review");
    expect(result.reasons.some((reason) => reason.includes("review band"))).toBe(true);
  });

  test("migration risk >= 70 yields blocked", () => {
    const result = evaluateDriftScoreGate({
      migrationRiskScore: 75,
      blockers: [],
      warnings: [],
      aliasMap: emptyAliasMap(),
    });

    expect(result.status).toBe("blocked");
  });

  test("target alias missing blocker yields blocked", () => {
    const result = evaluateDriftScoreGate({
      migrationRiskScore: 10,
      blockers: ['No alias for contract target "minimumSafePrice" → fixture target "minimumSafeContractPrice".'],
      warnings: [],
      aliasMap: emptyAliasMap({
        blockers: ['No alias for contract target "minimumSafePrice" → fixture target "minimumSafeContractPrice".'],
      }),
    });

    expect(result.status).toBe("blocked");
    expect(result.reasons.some((reason) => reason.includes("target"))).toBe(true);
  });

  test("composite alias yields needs_review", () => {
    const result = evaluateDriftScoreGate({
      migrationRiskScore: 10,
      blockers: [],
      warnings: [],
      aliasMap: emptyAliasMap({
        compositeAliases: [
          {
            contractVariableIds: ["laborHours", "laborRate"],
            ontologyVariableId: "laborCostPerSquare",
            confidence: "manual_review",
            source: "semantic_name",
            reason: "composite",
          },
        ],
      }),
    });

    expect(result.status).toBe("needs_review");
    expect(result.reasons.some((reason) => reason.includes("composite"))).toBe(true);
  });

  test("high manual_review alias count yields needs_review", () => {
    const result = evaluateDriftScoreGate({
      migrationRiskScore: 10,
      blockers: [],
      warnings: [],
      aliasMap: emptyAliasMap({
        aliases: [
          {
            contractVariableId: "a",
            ontologyVariableId: "a1",
            confidence: "manual_review",
            source: "semantic_name",
            reason: "r",
            dimensionCompatible: true,
            roleCompatible: true,
          },
          {
            contractVariableId: "b",
            ontologyVariableId: "b1",
            confidence: "manual_review",
            source: "semantic_name",
            reason: "r",
            dimensionCompatible: true,
            roleCompatible: true,
          },
          {
            contractVariableId: "c",
            ontologyVariableId: "c1",
            confidence: "manual_review",
            source: "semantic_name",
            reason: "r",
            dimensionCompatible: true,
            roleCompatible: true,
          },
        ],
      }),
    });

    expect(result.status).toBe("needs_review");
    expect(result.reasons.some((reason) => reason.includes("manual_review"))).toBe(true);
  });
});
