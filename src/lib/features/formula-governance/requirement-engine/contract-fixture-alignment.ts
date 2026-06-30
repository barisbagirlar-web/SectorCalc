/**
 * Contract ↔ fixture alignment context builder (Phase 5H-B-7).
 * Shared by batch alignment audit and contract requirement runner.
 */

import type { OntologyDraft } from "@/lib/features/formula-governance/calculation-ontology/contract-ontology-bridge";
import { buildOntologyAliasMap } from "@/lib/features/formula-governance/calculation-ontology/ontology-alias-map";
import type { OntologyAlignmentPlan } from "@/lib/features/formula-governance/calculation-ontology/ontology-alignment-plan";
import { buildOntologyAlignmentPlan } from "@/lib/features/formula-governance/calculation-ontology/ontology-alignment-plan";
import type { OntologyAliasMap } from "@/lib/features/formula-governance/calculation-ontology/ontology-alias-types";
import { createOntology } from "@/lib/features/formula-governance/calculation-ontology/ontology-builder";
import { compileOntologyDraftToCalculationOntology } from "@/lib/features/formula-governance/calculation-ontology/ontology-compiler";
import { getFixtureOntologyForSlug } from "@/lib/features/formula-governance/calculation-ontology/fixture-ontology-registry";
import type { CalculationOntology } from "@/lib/features/formula-governance/calculation-ontology/ontology-types";

export type ContractFixtureAlignmentContext = {
  readonly fixtureOntology: CalculationOntology;
  readonly contractOntology: CalculationOntology;
  readonly aliasMap: OntologyAliasMap;
  readonly alignmentPlan: OntologyAlignmentPlan;
};

export type BuildContractFixtureAlignmentContextParams = {
  readonly slug: string;
  readonly ontologyDraft: OntologyDraft;
  readonly compiledOntology?: CalculationOntology | null;
  readonly fixtureOntology?: CalculationOntology | null;
};

function buildContractOntologyFromDraft(draft: OntologyDraft): CalculationOntology {
  return createOntology({
    slug: draft.slug,
    sector: draft.sector,
    defaultAssumptions: draft.assumptions,
    variables: draft.variables.map((variable) => ({
      id: variable.id,
      label: variable.label,
      role: variable.role,
      dimension: variable.dimension,
      unit: variable.unit,
      knowledgeLevel: variable.knowledgeLevel,
      requiredForOutputs: variable.requiredForOutputs,
      constraints: variable.constraints,
      description: variable.description,
      missingRisk: variable.missingRisk,
    })),
    formulas: [],
    goals: draft.goals.map((goal) => ({
      id: goal.id,
      slug: goal.slug,
      targetVariable: goal.targetVariable,
      acceptedFormulaNodes: [],
      decisionGoal: goal.decisionGoal,
      primaryOutput: goal.primaryOutput,
      secondaryOutputs: goal.secondaryOutputs,
    })),
  });
}

export function resolveContractOntologyForAlignment(
  draft: OntologyDraft,
  compiledOntology?: CalculationOntology | null,
): CalculationOntology | null {
  if (compiledOntology) {
    return compiledOntology;
  }
  const compiled = compileOntologyDraftToCalculationOntology(draft);
  if (compiled.ontology) {
    return compiled.ontology;
  }
  if (draft.variables.length === 0) {
    return null;
  }
  return buildContractOntologyFromDraft(draft);
}

export function buildContractFixtureAlignmentContext(
  params: BuildContractFixtureAlignmentContextParams,
): ContractFixtureAlignmentContext | null {
  const { slug, ontologyDraft, compiledOntology } = params;
  const fixtureOntology =
    params.fixtureOntology ?? getFixtureOntologyForSlug(slug);
  if (!fixtureOntology) {
    return null;
  }

  const contractOntology = resolveContractOntologyForAlignment(
    ontologyDraft,
    compiledOntology,
  );
  if (!contractOntology) {
    return null;
  }

  const aliasMap = buildOntologyAliasMap({
    contractOntology,
    fixtureOntology,
    slug,
  });
  const alignmentPlan = buildOntologyAlignmentPlan({
    contractOntology,
    fixtureOntology,
    aliasMap,
  });

  return {
    fixtureOntology,
    contractOntology,
    aliasMap,
    alignmentPlan,
  };
}
