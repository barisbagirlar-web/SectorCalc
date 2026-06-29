/**
 * Phase 5H-B-3 — ontology draft compiler tests.
 */

import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { buildOntologyDraftFromFormulaContract } from "@/lib/formula-governance/calculation-ontology/contract-ontology-bridge";
import {
  inferVariableRoleFromContractField,
} from "@/lib/formula-governance/calculation-ontology/contract-variable-normalizer";
import { compileOntologyDraftToCalculationOntology } from "@/lib/formula-governance/calculation-ontology/ontology-compiler";
import type { OntologyDraft } from "@/lib/formula-governance/calculation-ontology/contract-ontology-bridge";

const ROOFING_SLUG = "roofing-contract-margin-guard";

function roofingDraft(): OntologyDraft {
  const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
  return buildOntologyDraftFromFormulaContract(contract);
}

describe("ontology draft compiler", () => {
  test("compiles valid OntologyDraft to full CalculationOntology", () => {
    const compiled = compileOntologyDraftToCalculationOntology(roofingDraft());

    expect(compiled.blockers).toHaveLength(0);
    expect(compiled.ontology).not.toBeNull();
    expect(compiled.ontology?.slug).toBe(ROOFING_SLUG);
    expect(compiled.ontology?.variables.length).toBeGreaterThan(0);
    expect(compiled.ontology?.formulas.length).toBeGreaterThan(0);
    expect(compiled.ontology?.goals[0]?.acceptedFormulaNodes.length).toBeGreaterThan(0);
  });

  test("emits blocker for duplicate variable id", () => {
    const draft = roofingDraft();
    const duplicate = draft.variables[0];
    const compiled = compileOntologyDraftToCalculationOntology({
      ...draft,
      variables: [...draft.variables, duplicate],
    });

    expect(compiled.ontology).toBeNull();
    expect(compiled.blockers.some((blocker) => blocker.includes("Duplicate"))).toBe(true);
  });

  test("emits blocker when formula required input is missing from ontology", () => {
    const draft = roofingDraft();
    const brokenNode = {
      ...draft.formulaNodes[0],
      requiredInputs: ["nonExistentInput"],
    };
    const compiled = compileOntologyDraftToCalculationOntology({
      ...draft,
      formulaNodes: [brokenNode],
    });

    expect(compiled.ontology).toBeNull();
    expect(compiled.blockers.some((blocker) => blocker.includes("nonExistentInput"))).toBe(true);
  });

  test("emits blocker when target output has no formula node", () => {
    const draft = roofingDraft();
    const compiled = compileOntologyDraftToCalculationOntology({
      ...draft,
      formulaNodes: draft.formulaNodes.filter(
        (node) => node.outputVariable !== draft.goals[0]?.targetVariable,
      ),
    });

    expect(compiled.ontology).toBeNull();
    expect(compiled.blockers.some((blocker) => blocker.includes("No formula node"))).toBe(true);
  });

  test("does not treat text verdict output as numeric target", () => {
    expect(inferVariableRoleFromContractField("quoteVerdict", "output")).toBe("constant");
    expect(inferVariableRoleFromContractField("suggestedAction", "output")).toBe("constant");

    const draft = roofingDraft();
    expect(draft.variables.some((variable) => variable.id === "quoteVerdict")).toBe(false);
  });

  test("marks minimumSafePrice as target variable", () => {
    const draft = roofingDraft();
    const target = draft.variables.find((variable) => variable.id === "minimumSafePrice");
    expect(target?.role).toBe("target");
    expect(draft.goals[0]?.targetVariable).toBe("minimumSafePrice");
  });

  test("marks baseCost and p90Cost as derived variables", () => {
    const draft = roofingDraft();
    expect(draft.variables.find((variable) => variable.id === "baseCost")?.role).toBe("derived");
    expect(draft.variables.find((variable) => variable.id === "p90Cost")?.role).toBe("derived");
  });

  test("emits warning for ambiguous unit/dimension", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const draft = buildOntologyDraftFromFormulaContract({
      ...contract,
      requiredInputs: ["costMarginPercent"],
      criticalInputs: ["costMarginPercent"],
    });

    expect(draft.warnings.some((warning) => warning.includes("ambiguous"))).toBe(true);
  });
});
