/**
 * Phase 5H-B-5 - ontology alias map tests.
 */

import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/features/formula-governance/contracts";
import { buildOntologyDraftFromFormulaContract } from "@/lib/features/formula-governance/calculation-ontology/contract-ontology-bridge";
import { compileOntologyDraftToCalculationOntology } from "@/lib/features/formula-governance/calculation-ontology/ontology-compiler";
import { buildOntologyAliasMap } from "@/lib/features/formula-governance/calculation-ontology/ontology-alias-map";
import { ROOFING_CONTRACT_MARGIN_ONTOLOGY } from "@/lib/features/formula-governance/calculation-ontology/fixtures/roofing-contract-margin-ontology";
import { CNC_QUOTE_RISK_ONTOLOGY } from "@/lib/features/formula-governance/calculation-ontology/fixtures/cnc-quote-risk-ontology";
import { createOntology } from "@/lib/features/formula-governance/calculation-ontology/ontology-builder";
import type { CalculationOntology } from "@/lib/features/formula-governance/calculation-ontology/ontology-types";
import { resolveContractOntologyForAlignment } from "@/lib/features/formula-governance/requirement-engine/contract-fixture-alignment";

const ROOFING_SLUG = "roofing-contract-margin-guard";
const CNC_SLUG = "cnc-quote-risk-analyzer";

function roofingContractOntology() {
  const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
  const draft = buildOntologyDraftFromFormulaContract(contract);
  const compiled = compileOntologyDraftToCalculationOntology(draft);
  const ontology = resolveContractOntologyForAlignment(draft, compiled.ontology);
  if (!ontology) {
    throw new Error("Expected roofing contract ontology to materialize.");
  }
  return ontology;
}

function cncContractOntology() {
  const contract = getFormulaContractBySlug(CNC_SLUG)!;
  const draft = buildOntologyDraftFromFormulaContract(contract);
  const compiled = compileOntologyDraftToCalculationOntology(draft);
  const ontology = resolveContractOntologyForAlignment(draft, compiled.ontology);
  if (!ontology) {
    throw new Error("Expected CNC contract ontology to materialize.");
  }
  return ontology;
}

function stubOntology(params: {
  slug: string;
  contractVariables: { id: string; dimension: "currency" | "percent" | "time" | "count"; role: "input" | "target" }[];
  fixtureVariables: { id: string; dimension: "currency" | "percent" | "time" | "count"; role: "input" | "target" }[];
  contractTarget?: string;
  fixtureTarget?: string;
}): { contract: CalculationOntology; fixture: CalculationOntology } {
  const toVar = (
    variable: { id: string; dimension: "currency" | "percent" | "time" | "count"; role: "input" | "target" },
    slug: string,
  ) => ({
    id: variable.id,
    label: variable.id,
    role: variable.role,
    dimension: variable.dimension,
    unit: variable.dimension === "percent" ? "%" : "USD",
    knowledgeLevel: "user_known" as const,
    requiredForOutputs: [params.contractTarget ?? "result"],
    description: `Stub ${variable.id}`,
    missingRisk: "medium" as const,
  });

  const contract = createOntology({
    slug: params.slug,
    sector: "test",
    defaultAssumptions: [],
    variables: params.contractVariables.map((variable) => toVar(variable, params.slug)),
    formulas: [],
    goals: [
      {
        id: "goal",
        slug: params.slug,
        targetVariable: params.contractTarget ?? "result",
        acceptedFormulaNodes: [],
        decisionGoal: "test",
        primaryOutput: params.contractTarget ?? "result",
      },
    ],
  });

  const fixture = createOntology({
    slug: params.slug,
    sector: "test",
    defaultAssumptions: [],
    variables: params.fixtureVariables.map((variable) => toVar(variable, params.slug)),
    formulas: [],
    goals: [
      {
        id: "goal-fixture",
        slug: params.slug,
        targetVariable: params.fixtureTarget ?? "result",
        acceptedFormulaNodes: [],
        decisionGoal: "test",
        primaryOutput: params.fixtureTarget ?? "result",
      },
    ],
  });

  return { contract, fixture };
}

describe("buildOntologyAliasMap", () => {
  test("exact variable match produces exact confidence", () => {
    const { contract, fixture } = stubOntology({
      slug: "exact-match-tool",
      contractVariables: [
        { id: "tearOffCost", dimension: "currency", role: "input" },
        { id: "minimumSafePrice", dimension: "currency", role: "target" },
      ],
      fixtureVariables: [
        { id: "tearOffCost", dimension: "currency", role: "input" },
        { id: "minimumSafePrice", dimension: "currency", role: "target" },
      ],
      contractTarget: "minimumSafePrice",
      fixtureTarget: "minimumSafePrice",
    });

    const aliasMap = buildOntologyAliasMap({
      contractOntology: contract,
      fixtureOntology: fixture,
      slug: "exact-match-tool",
    });

    const tearOff = aliasMap.aliases.find((alias) => alias.contractVariableId === "tearOffCost");
    expect(tearOff?.confidence).toBe("exact");
    expect(tearOff?.source).toBe("exact_key");
  });

  test("normalized key match works", () => {
    const { contract, fixture } = stubOntology({
      slug: "normalized-match-tool",
      contractVariables: [
        { id: "targetMargin", dimension: "percent", role: "input" },
        { id: "minimumSafePrice", dimension: "currency", role: "target" },
      ],
      fixtureVariables: [
        { id: "targetMarginPercent", dimension: "percent", role: "input" },
        { id: "minimumSafePrice", dimension: "currency", role: "target" },
      ],
      contractTarget: "minimumSafePrice",
      fixtureTarget: "minimumSafePrice",
    });

    const aliasMap = buildOntologyAliasMap({
      contractOntology: contract,
      fixtureOntology: fixture,
      slug: "normalized-match-tool",
    });

    const marginAlias = aliasMap.aliases.find(
      (alias) => alias.contractVariableId === "targetMargin",
    );
    expect(marginAlias?.ontologyVariableId).toBe("targetMarginPercent");
    expect(["normalized_key", "semantic_name", "strong"]).toContain(marginAlias?.confidence === "strong" ? "strong" : marginAlias?.source);
    expect(marginAlias?.confidence === "strong" || marginAlias?.source === "normalized_key").toBe(true);
  });

  test("roofing minimumSafePrice aliases minimumSafeContractPrice", () => {
    const aliasMap = buildOntologyAliasMap({
      contractOntology: roofingContractOntology(),
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      slug: ROOFING_SLUG,
    });

    const targetAlias = aliasMap.aliases.find(
      (alias) => alias.contractVariableId === "minimumSafePrice",
    );
    expect(targetAlias?.ontologyVariableId).toBe("minimumSafeContractPrice");
    expect(["exact", "strong"]).toContain(targetAlias?.confidence);
  });

  test("roofing materialCost ↔ materialCostPerSquare produces warning", () => {
    const aliasMap = buildOntologyAliasMap({
      contractOntology: roofingContractOntology(),
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      slug: ROOFING_SLUG,
    });

    const materialAlias = aliasMap.aliases.find(
      (alias) => alias.contractVariableId === "materialCost",
    );
    expect(materialAlias?.ontologyVariableId).toBe("materialCostPerSquare");
    expect(materialAlias?.confidence).toBe("weak");
    expect(materialAlias?.warning).toBeDefined();
  });

  test("composite alias produces manual_review or warning", () => {
    const aliasMap = buildOntologyAliasMap({
      contractOntology: roofingContractOntology(),
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      slug: ROOFING_SLUG,
    });

    expect(aliasMap.compositeAliases.length).toBeGreaterThan(0);
    const laborComposite = aliasMap.compositeAliases.find(
      (composite) => composite.ontologyVariableId === "laborCostPerSquare",
    );
    expect(laborComposite?.contractVariableIds).toEqual(
      expect.arrayContaining(["laborHours", "laborRate"]),
    );
    expect(laborComposite?.confidence).toBe("manual_review");
    expect(laborComposite?.warning).toBeDefined();
  });

  test("dimension mismatch produces warning", () => {
    const { contract, fixture } = stubOntology({
      slug: "dimension-mismatch-tool",
      contractVariables: [{ id: "feeAmount", dimension: "currency", role: "input" }],
      fixtureVariables: [{ id: "feePercent", dimension: "percent", role: "input" }],
    });

    const aliasMap = buildOntologyAliasMap({
      contractOntology: contract,
      fixtureOntology: fixture,
      slug: "dimension-mismatch-tool",
    });

    const alias = aliasMap.aliases.find((entry) => entry.contractVariableId === "feeAmount");
    if (alias) {
      expect(alias.dimensionCompatible).toBe(false);
      expect(alias.warning).toContain("Dimension mismatch");
    } else {
      expect(aliasMap.unmatchedContractVariables).toContain("feeAmount");
    }
  });

  test("lists unmatched variables", () => {
    const aliasMap = buildOntologyAliasMap({
      contractOntology: roofingContractOntology(),
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      slug: ROOFING_SLUG,
    });

    expect(aliasMap.unmatchedContractVariables).toEqual(
      expect.arrayContaining(["p90Cost"]),
    );
    expect(aliasMap.unmatchedOntologyVariables).toEqual(
      expect.arrayContaining(["roofSquares", "wasteFactor"]),
    );
  });

  test("cnc riskMargin aliases riskBufferPercent", () => {
    const aliasMap = buildOntologyAliasMap({
      contractOntology: cncContractOntology(),
      fixtureOntology: CNC_QUOTE_RISK_ONTOLOGY,
      slug: CNC_SLUG,
    });

    const alias = aliasMap.aliases.find((entry) => entry.contractVariableId === "riskMargin");
    expect(alias?.ontologyVariableId).toBe("riskBufferPercent");
    expect(alias?.confidence).toBe("strong");
  });

  test("cnc toolCost aliases toolingCost", () => {
    const aliasMap = buildOntologyAliasMap({
      contractOntology: cncContractOntology(),
      fixtureOntology: CNC_QUOTE_RISK_ONTOLOGY,
      slug: CNC_SLUG,
    });

    const alias = aliasMap.aliases.find((entry) => entry.contractVariableId === "toolCost");
    expect(alias?.ontologyVariableId).toBe("toolingCost");
    expect(alias?.confidence).toBe("strong");
  });

  test("cnc cycleTime stays weak or manual_review", () => {
    const aliasMap = buildOntologyAliasMap({
      contractOntology: cncContractOntology(),
      fixtureOntology: CNC_QUOTE_RISK_ONTOLOGY,
      slug: CNC_SLUG,
    });

    const alias = aliasMap.aliases.find((entry) => entry.contractVariableId === "cycleTime");
    expect(alias?.ontologyVariableId).toBe("machineHours");
    expect(["weak", "manual_review"]).toContain(alias?.confidence);
    expect(alias?.confidence).not.toBe("strong");
    expect(alias?.confidence).not.toBe("exact");
  });

  test("ambiguous cnc aliases do not become strong", () => {
    const aliasMap = buildOntologyAliasMap({
      contractOntology: cncContractOntology(),
      fixtureOntology: CNC_QUOTE_RISK_ONTOLOGY,
      slug: CNC_SLUG,
    });

    const p90Alias = aliasMap.aliases.find((entry) => entry.contractVariableId === "p90Cost");
    expect(p90Alias?.confidence).not.toBe("strong");
    expect(p90Alias?.confidence).not.toBe("exact");

    const cycleAlias = aliasMap.aliases.find((entry) => entry.contractVariableId === "cycleTime");
    expect(cycleAlias?.confidence).not.toBe("strong");
    expect(cycleAlias?.confidence).not.toBe("exact");
  });

  test("produces blocker when target variable alias is missing", () => {
    const { contract, fixture } = stubOntology({
      slug: "missing-target-alias-tool",
      contractVariables: [
        { id: "inputA", dimension: "currency", role: "input" },
        { id: "minimumSafePrice", dimension: "currency", role: "target" },
      ],
      fixtureVariables: [
        { id: "inputA", dimension: "currency", role: "input" },
        { id: "minimumSafeContractPrice", dimension: "currency", role: "target" },
      ],
      contractTarget: "minimumSafePrice",
      fixtureTarget: "minimumSafeContractPrice",
    });

    const aliasMap = buildOntologyAliasMap({
      contractOntology: contract,
      fixtureOntology: fixture,
      slug: "missing-target-alias-tool",
    });

    expect(aliasMap.blockers.some((blocker) => blocker.includes("No alias for contract target"))).toBe(
      true,
    );
  });
});
