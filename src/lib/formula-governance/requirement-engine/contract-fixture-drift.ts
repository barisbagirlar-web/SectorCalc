/**
 * Contract vs fixture ontology drift report v2 (Phase 5H-B-4 + 5H-B-5).
 */

import { buildOntologyAliasMap } from "@/lib/formula-governance/calculation-ontology/ontology-alias-map";
import type {
  CompositeOntologyAlias,
  OntologyAliasConfidence,
  OntologyAliasMap,
  OntologyVariableAlias,
} from "@/lib/formula-governance/calculation-ontology/ontology-alias-types";
import type { CalculationOntology } from "@/lib/formula-governance/calculation-ontology/ontology-types";

export type { OntologyVariableAlias } from "@/lib/formula-governance/calculation-ontology/ontology-alias-types";

export type PossibleAliasReport = {
  readonly contractVariable: string;
  readonly fixtureVariable: string;
  readonly confidence: OntologyAliasConfidence;
  readonly reason: string;
  readonly warning?: string;
};

export type ContractFixtureDriftReport = {
  readonly slug: string;
  readonly matchingVariables: readonly string[];
  readonly aliases: readonly OntologyVariableAlias[];
  readonly contractOnlyVariables: readonly string[];
  readonly fixtureOnlyVariables: readonly string[];
  readonly possibleAliases: readonly PossibleAliasReport[];
  readonly compositeAliases: readonly CompositeOntologyAlias[];
  readonly migrationRiskScore: number;
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};

export type CompareContractOntologyWithFixtureParams = {
  readonly contractOntology: CalculationOntology;
  readonly fixtureOntology: CalculationOntology;
};

function collectExactMatches(
  contractOntology: CalculationOntology,
  fixtureOntology: CalculationOntology,
): string[] {
  const fixtureIds = new Set(fixtureOntology.variables.map((variable) => variable.id));
  return contractOntology.variables
    .map((variable) => variable.id)
    .filter((id) => fixtureIds.has(id))
    .sort();
}

function toPossibleAliases(aliases: readonly OntologyVariableAlias[]): PossibleAliasReport[] {
  return aliases
    .filter((alias) => alias.confidence !== "exact")
    .map((alias) => ({
      contractVariable: alias.contractVariableId,
      fixtureVariable: alias.ontologyVariableId,
      confidence: alias.confidence,
      reason: alias.reason,
      warning: alias.warning,
    }));
}

export function computeMigrationRiskScore(
  aliasMap: OntologyAliasMap,
  aliases: readonly OntologyVariableAlias[],
): number {
  if (aliases.length === 0 && aliasMap.unmatchedContractVariables.length > 0) {
    return 100;
  }

  const weights: Record<OntologyAliasConfidence, number> = {
    exact: 0,
    strong: 10,
    weak: 40,
    manual_review: 60,
  };

  let score = 0;
  for (const alias of aliases) {
    score += weights[alias.confidence];
    if (!alias.dimensionCompatible) {
      score += 15;
    }
    if (!alias.roleCompatible) {
      score += 25;
    }
  }

  score += aliasMap.unmatchedContractVariables.length * 12;
  score += aliasMap.unmatchedOntologyVariables.length * 8;
  score += aliasMap.compositeAliases.length * 10;
  score += aliasMap.blockers.length * 30;

  const maxScore = Math.max(aliases.length * 100, 100);
  return Math.min(100, Math.round((score / maxScore) * 100));
}

export function compareContractOntologyWithFixture(
  params: CompareContractOntologyWithFixtureParams,
): ContractFixtureDriftReport {
  const { contractOntology, fixtureOntology } = params;
  const slug = contractOntology.slug;

  const aliasMap = buildOntologyAliasMap({
    contractOntology,
    fixtureOntology,
    slug,
  });

  const matchingVariables = collectExactMatches(contractOntology, fixtureOntology);
  const possibleAliases = toPossibleAliases(aliasMap.aliases);
  const migrationRiskScore = computeMigrationRiskScore(aliasMap, aliasMap.aliases);

  const warnings = [...aliasMap.warnings];
  if (migrationRiskScore >= 60) {
    warnings.push(`Migration risk score is high (${migrationRiskScore}/100).`);
  } else if (migrationRiskScore >= 30) {
    warnings.push(`Migration risk score is moderate (${migrationRiskScore}/100).`);
  }

  return {
    slug,
    matchingVariables,
    aliases: aliasMap.aliases,
    contractOnlyVariables: aliasMap.unmatchedContractVariables,
    fixtureOnlyVariables: aliasMap.unmatchedOntologyVariables,
    possibleAliases,
    compositeAliases: aliasMap.compositeAliases,
    migrationRiskScore,
    warnings,
    blockers: aliasMap.blockers,
  };
}
