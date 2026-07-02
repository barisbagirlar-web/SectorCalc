/**
 * Requirement Engine - Mind 2: goal + known inputs → missing requirements.
 */

import { detectCircularDependencies, detectUnreachableTargetVariables } from "@/lib/features/formula-governance/calculation-ontology/dependency-graph";
import { getAcceptedFormulaCandidatesForGoal } from "@/lib/features/formula-governance/calculation-ontology/formula-graph";
import {
  resolveRequirementsForFormulaPath,
  scoreRequirementPath,
} from "@/lib/features/formula-governance/requirement-engine/dependency-resolver";
import type {
  RequirementSolveResult,
  SolveRequiredInputsParams,
} from "@/lib/features/formula-governance/requirement-engine/requirement-engine-types";

export function solveRequiredInputs(params: SolveRequiredInputsParams): RequirementSolveResult {
  const { ontology, goalId, knownInputs } = params;
  const goal = ontology.goals.find((entry) => entry.id === goalId);

  if (!goal) {
    return {
      status: "blocked",
      requiredMissingInputs: [],
      optionalRecommendedInputs: [],
      advancedRecommendedInputs: [],
      defaultedInputs: [],
      acceptedAssumptions: [],
      derivedResolutionPlan: [],
      selectedFormulaPath: [],
      blockers: [`Goal "${goalId}" not found in ontology.`],
      warnings: [],
    };
  }

  const structuralBlockers = [
    ...detectCircularDependencies(ontology),
    ...detectUnreachableTargetVariables(ontology),
  ].flatMap((issue) => issue.message);

  const candidates = getAcceptedFormulaCandidatesForGoal(
    ontology,
    goalId,
    goal.targetVariable,
  );

  if (candidates.length === 0) {
    return {
      status: "blocked",
      requiredMissingInputs: [],
      optionalRecommendedInputs: [],
      advancedRecommendedInputs: ontology.professionalUpgradeVariables ?? [],
      defaultedInputs: [],
      acceptedAssumptions: [],
      derivedResolutionPlan: [],
      selectedFormulaPath: [],
      blockers: [
        ...structuralBlockers,
        `No formula path found for target "${goal.targetVariable}".`,
      ],
      warnings: [],
    };
  }

  const evaluated = candidates.map((formula) => ({
    formulaId: formula.id,
    resolved: resolveRequirementsForFormulaPath(ontology, formula.id, knownInputs),
  }));

  evaluated.sort(
    (left, right) => scoreRequirementPath(left.resolved) - scoreRequirementPath(right.resolved),
  );

  const best = evaluated[0];
  if (!best) {
    return {
      status: "blocked",
      requiredMissingInputs: [],
      optionalRecommendedInputs: [],
      advancedRecommendedInputs: ontology.professionalUpgradeVariables ?? [],
      defaultedInputs: [],
      acceptedAssumptions: [],
      derivedResolutionPlan: [],
      selectedFormulaPath: [],
      blockers: [...structuralBlockers, "No viable formula path could be evaluated."],
      warnings: [],
    };
  }

  const optionalRecommended = new Set<string>();
  for (const formula of candidates) {
    for (const optionalInput of formula.optionalInputs ?? []) {
      if (!(optionalInput in knownInputs)) {
        optionalRecommended.add(optionalInput);
      }
    }
  }

  const advancedRecommended = (ontology.professionalUpgradeVariables ?? []).filter(
    (variableId) => !(variableId in knownInputs),
  );

  const blockers = [...structuralBlockers, ...best.resolved.blockers];
  const status =
    blockers.length > 0
      ? "blocked"
      : best.resolved.missingUserInputs.length > 0
        ? "need_more_data"
        : "ready_to_calculate";

  return {
    status,
    requiredMissingInputs: best.resolved.missingUserInputs,
    optionalRecommendedInputs: Array.from(optionalRecommended),
    advancedRecommendedInputs: advancedRecommended,
    defaultedInputs: best.resolved.defaultedInputs,
    acceptedAssumptions: best.resolved.acceptedAssumptions,
    derivedResolutionPlan: best.resolved.derivedResolutionPlan,
    selectedFormulaPath: best.resolved.selectedFormulaPath,
    blockers,
    warnings: best.resolved.warnings,
  };
}
