/**
 * Contract vs fixture ontology drift report (Phase 5H-B-4).
 */

import type { CalculationOntology } from "@/lib/formula-governance/calculation-ontology/ontology-types";

export type OntologyVariableAlias = {
  readonly contractVariable: string;
  readonly fixtureVariable: string;
  readonly reason: string;
};

export type ContractFixtureDriftReport = {
  readonly matchingVariables: readonly string[];
  readonly contractOnlyVariables: readonly string[];
  readonly fixtureOnlyVariables: readonly string[];
  readonly possibleAliases: readonly OntologyVariableAlias[];
  readonly warnings: readonly string[];
};

export type CompareContractOntologyWithFixtureParams = {
  readonly contractOntology: CalculationOntology;
  readonly fixtureOntology: CalculationOntology;
};

const ALIAS_RULES: readonly {
  readonly contractVariables: readonly string[];
  readonly fixtureVariable: string;
  readonly reason: string;
}[] = [
  {
    contractVariables: ["materialCost"],
    fixtureVariable: "materialCostPerSquare",
    reason: "Contract uses lump material cost; fixture uses per-square material rate.",
  },
  {
    contractVariables: ["laborHours", "laborRate"],
    fixtureVariable: "laborCostPerSquare",
    reason: "Contract splits labor into hours and rate; fixture uses per-square labor cost.",
  },
  {
    contractVariables: ["targetMargin"],
    fixtureVariable: "targetMarginPercent",
    reason: "Margin field naming differs between contract and fixture.",
  },
  {
    contractVariables: ["minimumSafePrice"],
    fixtureVariable: "minimumSafeContractPrice",
    reason: "Target output naming differs between contract and fixture.",
  },
  {
    contractVariables: ["dumpFees"],
    fixtureVariable: "permitCost",
    reason: "Disposal/permit fees may be modeled under different variable names.",
  },
  {
    contractVariables: ["weatherDelayRiskPercent"],
    fixtureVariable: "riskBufferPercent",
    reason: "Weather delay risk may overlap with fixture risk buffer percent.",
  },
];

function collectVariableIds(ontology: CalculationOntology): Set<string> {
  return new Set(ontology.variables.map((variable) => variable.id));
}

function suggestAliases(
  contractOnly: readonly string[],
  fixtureOnly: readonly string[],
): OntologyVariableAlias[] {
  const aliases: OntologyVariableAlias[] = [];
  const fixtureSet = new Set(fixtureOnly);

  for (const rule of ALIAS_RULES) {
    const contractPresent = rule.contractVariables.every((variableId) => contractOnly.includes(variableId));
    if (contractPresent && fixtureSet.has(rule.fixtureVariable)) {
      for (const contractVariable of rule.contractVariables) {
        aliases.push({
          contractVariable,
          fixtureVariable: rule.fixtureVariable,
          reason: rule.reason,
        });
      }
    }
  }

  return aliases;
}

export function compareContractOntologyWithFixture(
  params: CompareContractOntologyWithFixtureParams,
): ContractFixtureDriftReport {
  const { contractOntology, fixtureOntology } = params;
  const warnings: string[] = [];

  if (contractOntology.slug !== fixtureOntology.slug) {
    warnings.push(
      `Slug mismatch: contract "${contractOntology.slug}" vs fixture "${fixtureOntology.slug}".`,
    );
  }

  const contractIds = collectVariableIds(contractOntology);
  const fixtureIds = collectVariableIds(fixtureOntology);

  const matchingVariables = [...contractIds].filter((id) => fixtureIds.has(id)).sort();
  const contractOnlyVariables = [...contractIds].filter((id) => !fixtureIds.has(id)).sort();
  const fixtureOnlyVariables = [...fixtureIds].filter((id) => !contractIds.has(id)).sort();
  const possibleAliases = suggestAliases(contractOnlyVariables, fixtureOnlyVariables);

  if (contractOnlyVariables.length > 0) {
    warnings.push(
      `${contractOnlyVariables.length} variable(s) exist only in contract-derived ontology.`,
    );
  }
  if (fixtureOnlyVariables.length > 0) {
    warnings.push(
      `${fixtureOnlyVariables.length} variable(s) exist only in fixture ontology.`,
    );
  }
  if (possibleAliases.length > 0) {
    warnings.push(`${possibleAliases.length} possible alias mapping(s) detected.`);
  }

  return {
    matchingVariables,
    contractOnlyVariables,
    fixtureOnlyVariables,
    possibleAliases,
    warnings,
  };
}
