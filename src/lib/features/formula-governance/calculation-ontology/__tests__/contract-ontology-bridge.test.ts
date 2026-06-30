/**
 * Phase 5H-B-2 — contract → ontology draft bridge tests.
 */

import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/features/formula-governance/contracts";
import {
  buildOntologyDraftFromFormulaContract,
} from "@/lib/features/formula-governance/calculation-ontology/contract-ontology-bridge";
import {
  attachProductionSourceToOntologyDraft,
  buildOntologyDraftWithProductionSource,
  buildProductionSourceReference,
} from "@/lib/features/formula-governance/calculation-ontology/production-source-reference";
import { ROOFING_CONTRACT_MARGIN_ONTOLOGY } from "@/lib/features/formula-governance/calculation-ontology/fixtures/roofing-contract-margin-ontology";
import { solveRequiredInputs } from "@/lib/features/formula-governance/requirement-engine/requirement-engine";
import { auditFormulaContractInputReadiness } from "@/lib/features/formula-governance/requirement-engine/contract-requirement-bridge";
import type { FormulaContract } from "@/lib/features/formula-governance/types";

const ROOFING_SLUG = "roofing-contract-margin-guard";
const CNC_SLUG = "cnc-quote-risk-analyzer";

describe("contract → ontology draft bridge", () => {
  test("maps FormulaContract inputs to ontology variable drafts", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG);
    expect(contract).toBeDefined();
    const draft = buildOntologyDraftFromFormulaContract(contract!);

    const inputDrafts = draft.variables.filter((variable) => variable.role === "input");
    expect(inputDrafts.map((variable) => variable.id)).toEqual(
      expect.arrayContaining([...contract!.criticalInputs]),
    );
    expect(inputDrafts.find((variable) => variable.id === "materialCost")?.dimension).toBe(
      "currency",
    );
    expect(inputDrafts.find((variable) => variable.id === "laborHours")?.dimension).toBe("time");
  });

  test("maps FormulaContract outputs to target and derived variable candidates", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG);
    const draft = buildOntologyDraftFromFormulaContract(contract!);

    const target = draft.variables.find((variable) => variable.id === "minimumSafePrice");
    const derived = draft.variables.find((variable) => variable.id === "baseCost");
    const verdict = draft.variables.find((variable) => variable.id === "quoteVerdict");

    expect(target?.role).toBe("target");
    expect(derived?.role).toBe("derived");
    expect(verdict).toBeUndefined();
    expect(draft.goals[0]?.targetVariable).toBe("minimumSafePrice");
  });

  test("emits warning when unit/dimension cannot be inferred", () => {
    const stubContract: FormulaContract = {
      ...getFormulaContractBySlug(ROOFING_SLUG)!,
      requiredInputs: ["opaqueMetric"],
      criticalInputs: ["opaqueMetric"],
    };
    const draft = buildOntologyDraftFromFormulaContract(stubContract);

    expect(
      draft.warnings.some((warning) => warning.includes("opaqueMetric")),
    ).toBe(true);
    expect(
      draft.variables.find((variable) => variable.id === "opaqueMetric")?.dimension,
    ).toBe("dimensionless");
  });

  test("emits blocker when production source assumption is missing", () => {
    const contract = getFormulaContractBySlug(CNC_SLUG)!;
    const draft = buildOntologyDraftFromFormulaContract({
      ...contract,
      assumptions: contract.assumptions.filter((line) => !line.startsWith("Production:")),
    });

    expect(draft.blockers.some((blocker) => blocker.includes("Production:"))).toBe(true);
  });

  test("builds ontology draft for roofing-contract-margin-guard pilot", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG);
    const draft = buildOntologyDraftFromFormulaContract(contract!);

    expect(draft.slug).toBe(ROOFING_SLUG);
    expect(draft.sector).toBe("roofing");
    expect(draft.formulaNodes.length).toBeGreaterThan(0);
    expect(draft.limitations.length).toBeGreaterThan(0);
    expect(draft.assumptions.some((line) => line.includes("Warranty"))).toBe(true);
    expect(draft.blockers).toHaveLength(0);
  });

  test("attaches production source reference metadata without importing calculators", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG);
    const draft = buildOntologyDraftFromFormulaContract(contract!);
    const source = buildProductionSourceReference(ROOFING_SLUG);

    expect(source).toBeDefined();
    expect(source?.productionFilePath).toContain("premium-decision-engine.ts");
    expect(source?.calculatorEntry).toContain("calcRoofing");
    expect(source?.registryKey).toBe("revenue-premium.roofing-contract-margin-guard");

    const withSource = attachProductionSourceToOntologyDraft(draft, source);
    expect(withSource.productionSource?.slug).toBe(ROOFING_SLUG);
    expect(withSource.blockers).toHaveLength(0);
  });

  test("roofing pilot: contract draft + fixture requirement + readiness audit", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const draft = buildOntologyDraftWithProductionSource(ROOFING_SLUG, buildOntologyDraftFromFormulaContract(contract));

    const requirementResult = solveRequiredInputs({
      ontology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      goalId: "roofing-safe-contract-price",
      knownInputs: {},
    });

    const audit = auditFormulaContractInputReadiness({
      contract,
      ontologyDraft: draft,
      requirementResult,
    });

    expect(draft.productionSource).toBeDefined();
    expect(requirementResult.status).toBe("need_more_data");
    expect(audit.status).toBe("needs_input_design");
    expect(audit.missingInputMetadata.length).toBeGreaterThan(0);
  });

  test("optional cnc pilot: draft and locator reference without production execution", () => {
    const contract = getFormulaContractBySlug(CNC_SLUG)!;
    const draft = buildOntologyDraftFromFormulaContract(contract);
    const withSource = buildOntologyDraftWithProductionSource(CNC_SLUG, draft);

    expect(withSource.productionSource?.productionFunctionName).toBe(
      "calculatePremiumDecisionReport",
    );
    expect(withSource.blockers.some((blocker) => blocker.includes("Production:"))).toBe(false);
    expect(withSource.variables.map((variable) => variable.id)).toEqual(
      expect.arrayContaining(["setupTime", "machineRate", "minimumSafePrice"] as const),
    );
  });
});
