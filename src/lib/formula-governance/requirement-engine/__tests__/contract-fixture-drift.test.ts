/**
 * Phase 5H-B-4 — contract vs fixture ontology drift tests.
 */

import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { buildOntologyDraftFromFormulaContract } from "@/lib/formula-governance/calculation-ontology/contract-ontology-bridge";
import { compileOntologyDraftToCalculationOntology } from "@/lib/formula-governance/calculation-ontology/ontology-compiler";
import { ROOFING_CONTRACT_MARGIN_ONTOLOGY } from "@/lib/formula-governance/calculation-ontology/fixtures/roofing-contract-margin-ontology";
import { compareContractOntologyWithFixture } from "@/lib/formula-governance/requirement-engine/contract-fixture-drift";

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
  });

  test("reports contractOnlyVariables", () => {
    const report = compareContractOntologyWithFixture({
      contractOntology: roofingContractOntology(),
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
    });

    expect(report.contractOnlyVariables).toEqual(
      expect.arrayContaining(["materialCost", "laborHours", "laborRate", "minimumSafePrice"]),
    );
    expect(report.contractOnlyVariables).not.toContain("roofSquares");
  });

  test("reports fixtureOnlyVariables", () => {
    const report = compareContractOntologyWithFixture({
      contractOntology: roofingContractOntology(),
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
    });

    expect(report.fixtureOnlyVariables).toEqual(
      expect.arrayContaining([
        "roofSquares",
        "materialCostPerSquare",
        "laborCostPerSquare",
        "minimumSafeContractPrice",
      ]),
    );
    expect(report.fixtureOnlyVariables).not.toContain("materialCost");
  });

  test("suggests possibleAliases between contract and fixture variables", () => {
    const report = compareContractOntologyWithFixture({
      contractOntology: roofingContractOntology(),
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
    });

    expect(report.possibleAliases.some(
      (alias) =>
        alias.contractVariable === "materialCost" &&
        alias.fixtureVariable === "materialCostPerSquare",
    )).toBe(true);
    expect(report.possibleAliases.some(
      (alias) =>
        alias.contractVariable === "targetMargin" &&
        alias.fixtureVariable === "targetMarginPercent",
    )).toBe(true);
    expect(report.possibleAliases.some(
      (alias) =>
        alias.contractVariable === "minimumSafePrice" &&
        alias.fixtureVariable === "minimumSafeContractPrice",
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
  });
});
