/**
 * Phase 5H-B-4 + 5H-B-5 — contract vs fixture ontology drift tests.
 */

import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { buildOntologyDraftFromFormulaContract } from "@/lib/formula-governance/calculation-ontology/contract-ontology-bridge";
import { compileOntologyDraftToCalculationOntology } from "@/lib/formula-governance/calculation-ontology/ontology-compiler";
import { ROOFING_CONTRACT_MARGIN_ONTOLOGY } from "@/lib/formula-governance/calculation-ontology/fixtures/roofing-contract-margin-ontology";
import {
  compareContractOntologyWithFixture,
  computeMigrationRiskScore,
} from "@/lib/formula-governance/requirement-engine/contract-fixture-drift";
import { buildOntologyAliasMap } from "@/lib/formula-governance/calculation-ontology/ontology-alias-map";

const ROOFING_SLUG = "roofing-contract-margin-guard";

function roofingContractOntology() {
  const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
  const draft = buildOntologyDraftFromFormulaContract(contract);
  const compiled = compileOntologyDraftToCalculationOntology(draft);
  if (!compiled.ontology) {
    throw new Error("Expected roofing contract ontology to compile.");
  }
  return compiled.ontology;
}

describe("contract vs fixture ontology drift", () => {
  test("compares roofing contract ontology with fixture ontology", () => {
    const report = compareContractOntologyWithFixture({
      contractOntology: roofingContractOntology(),
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
    });

    expect(report.matchingVariables).toContain("tearOffCost");
    expect(report.contractOnlyVariables.length).toBeGreaterThan(0);
    expect(report.fixtureOnlyVariables.length).toBeGreaterThan(0);
    expect(report.aliases.length).toBeGreaterThan(0);
  });

  test("reports contractOnlyVariables", () => {
    const report = compareContractOntologyWithFixture({
      contractOntology: roofingContractOntology(),
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
    });

    expect(report.contractOnlyVariables).toEqual(
      expect.arrayContaining(["p90Cost"]),
    );
    expect(report.contractOnlyVariables).not.toContain("tearOffCost");
    expect(report.contractOnlyVariables).not.toContain("materialCost");
    expect(report.contractOnlyVariables).not.toContain("weatherDelayRiskPercent");
  });

  test("reports fixtureOnlyVariables", () => {
    const report = compareContractOntologyWithFixture({
      contractOntology: roofingContractOntology(),
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
    });

    expect(report.fixtureOnlyVariables).toEqual(
      expect.arrayContaining([
        "roofSquares",
        "wasteFactor",
        "overheadPercent",
      ]),
    );
    expect(report.fixtureOnlyVariables).not.toContain("tearOffCost");
    expect(report.fixtureOnlyVariables).not.toContain("materialCostPerSquare");
  });

  test("suggests possibleAliases between contract and fixture variables with confidence", () => {
    const report = compareContractOntologyWithFixture({
      contractOntology: roofingContractOntology(),
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
    });

    expect(report.possibleAliases.some(
      (alias) =>
        alias.contractVariable === "materialCost" &&
        alias.fixtureVariable === "materialCostPerSquare" &&
        alias.confidence === "weak",
    )).toBe(true);
    expect(report.possibleAliases.some(
      (alias) =>
        alias.contractVariable === "targetMargin" &&
        alias.fixtureVariable === "targetMarginPercent" &&
        ["strong", "exact"].includes(alias.confidence),
    )).toBe(true);
    expect(report.possibleAliases.some(
      (alias) =>
        alias.contractVariable === "minimumSafePrice" &&
        alias.fixtureVariable === "minimumSafeContractPrice" &&
        ["strong", "exact"].includes(alias.confidence),
    )).toBe(true);
  });

  test("produces deterministic drift report", () => {
    const contractOntology = roofingContractOntology();
    const first = compareContractOntologyWithFixture({
      contractOntology,
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
    });
    const second = compareContractOntologyWithFixture({
      contractOntology,
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
    });

    expect(first).toEqual(second);
    expect(first.warnings.length).toBeGreaterThan(0);
    expect(first.migrationRiskScore).toBeGreaterThanOrEqual(0);
    expect(first.migrationRiskScore).toBeLessThanOrEqual(100);
  });

  test("drift report includes aliasMap data", () => {
    const contractOntology = roofingContractOntology();
    const aliasMap = buildOntologyAliasMap({
      contractOntology,
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      slug: ROOFING_SLUG,
    });
    const report = compareContractOntologyWithFixture({
      contractOntology,
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
    });

    expect(report.slug).toBe(ROOFING_SLUG);
    expect(report.aliases).toEqual(aliasMap.aliases);
    expect(report.compositeAliases).toEqual(aliasMap.compositeAliases);
    expect(report.blockers).toEqual(aliasMap.blockers);
  });

  test("migrationRiskScore is deterministic", () => {
    const contractOntology = roofingContractOntology();
    const aliasMap = buildOntologyAliasMap({
      contractOntology,
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      slug: ROOFING_SLUG,
    });

    const first = computeMigrationRiskScore(aliasMap, aliasMap.aliases);
    const second = computeMigrationRiskScore(aliasMap, aliasMap.aliases);
    expect(first).toBe(second);

    const report = compareContractOntologyWithFixture({
      contractOntology,
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
    });
    expect(report.migrationRiskScore).toBe(first);
  });
});
