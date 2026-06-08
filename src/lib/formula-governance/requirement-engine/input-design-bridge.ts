/**
 * Input design bridge — requirement result → UI-oriented input design adapter.
 */

import type { CalculationOntology } from "@/lib/formula-governance/calculation-ontology/ontology-types";
import type { RequirementSolveResult } from "@/lib/formula-governance/requirement-engine/requirement-engine-types";

/** Local adapter type — compatible with future ToolInputDesign without breaking existing code. */
export type ToolInputDesignField = {
  readonly variableId: string;
  readonly label: string;
  readonly required: boolean;
  readonly defaulted: boolean;
  readonly advanced: boolean;
  readonly dimension: string;
  readonly unit: string;
  readonly defaultValue?: number;
  readonly missingRisk: string;
};

export type ToolInputDesign = {
  readonly requiredFields: readonly ToolInputDesignField[];
  readonly optionalFields: readonly ToolInputDesignField[];
  readonly advancedFields: readonly ToolInputDesignField[];
  readonly defaultedFields: readonly ToolInputDesignField[];
  readonly acceptedAssumptions: readonly string[];
};

function toField(
  ontology: CalculationOntology,
  variableId: string,
  flags: { required: boolean; defaulted: boolean; advanced: boolean },
): ToolInputDesignField | undefined {
  const variable = ontology.variables.find((entry) => entry.id === variableId);
  if (!variable) {
    return undefined;
  }
  return {
    variableId,
    label: variable.label,
    required: flags.required,
    defaulted: flags.defaulted,
    advanced: flags.advanced,
    dimension: variable.dimension,
    unit: variable.unit,
    defaultValue: variable.defaultValue,
    missingRisk: variable.missingRisk,
  };
}

export function buildInputDesignFromRequirementResult(
  requirementResult: RequirementSolveResult,
  ontology: CalculationOntology,
): ToolInputDesign {
  const requiredFields = requirementResult.requiredMissingInputs
    .map((variableId) => toField(ontology, variableId, { required: true, defaulted: false, advanced: false }))
    .filter((field): field is ToolInputDesignField => field !== undefined);

  const defaultedFields = requirementResult.defaultedInputs
    .map((variableId) => toField(ontology, variableId, { required: false, defaulted: true, advanced: false }))
    .filter((field): field is ToolInputDesignField => field !== undefined);

  const optionalFields = requirementResult.optionalRecommendedInputs
    .map((variableId) => toField(ontology, variableId, { required: false, defaulted: false, advanced: false }))
    .filter((field): field is ToolInputDesignField => field !== undefined);

  const advancedFields = requirementResult.advancedRecommendedInputs
    .map((variableId) => toField(ontology, variableId, { required: false, defaulted: false, advanced: true }))
    .filter((field): field is ToolInputDesignField => field !== undefined);

  return {
    requiredFields,
    optionalFields,
    advancedFields,
    defaultedFields,
    acceptedAssumptions: requirementResult.acceptedAssumptions,
  };
}
