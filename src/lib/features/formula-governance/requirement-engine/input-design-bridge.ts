/**
 * Input design bridge — requirement result → UI-oriented input design adapter.
 */

import type { CalculationOntology } from "@/lib/features/formula-governance/calculation-ontology/ontology-types";
import type { RequirementSolveResult } from "@/lib/features/formula-governance/requirement-engine/requirement-engine-types";

import type { FormulaContract } from "@/lib/features/formula-governance/types";

/** Local adapter type — compatible with future ToolInputDesign without breaking existing code. */
export type ToolInputDesignField = {
  readonly variableId: string;
  readonly label: string;
  readonly required: boolean;
  readonly defaulted: boolean;
  readonly advanced: boolean;
  readonly derived?: boolean;
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
  readonly derivedFields?: readonly ToolInputDesignField[];
  readonly acceptedAssumptions: readonly string[];
};

export type BuildInputDesignOptions = {
  readonly contract?: FormulaContract;
};

function humanizeKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

function resolveFieldLabel(
  ontology: CalculationOntology,
  variableId: string,
  contract?: FormulaContract,
): string {
  const variable = ontology.variables.find((entry) => entry.id === variableId);
  if (contract?.criticalInputs.includes(variableId) || contract?.requiredInputs.includes(variableId)) {
    return humanizeKey(variableId);
  }
  return variable?.label ?? humanizeKey(variableId);
}

function toField(
  ontology: CalculationOntology,
  variableId: string,
  flags: { required: boolean; defaulted: boolean; advanced: boolean; derived?: boolean },
  contract?: FormulaContract,
): ToolInputDesignField | undefined {
  const variable = ontology.variables.find((entry) => entry.id === variableId);
  if (!variable) {
    return undefined;
  }
  return {
    variableId,
    label: resolveFieldLabel(ontology, variableId, contract),
    required: flags.required,
    defaulted: flags.defaulted,
    advanced: flags.advanced,
    derived: flags.derived,
    dimension: variable.dimension,
    unit: variable.unit,
    defaultValue: variable.defaultValue,
    missingRisk: variable.missingRisk,
  };
}

export function buildInputDesignFromRequirementResult(
  requirementResult: RequirementSolveResult,
  ontology: CalculationOntology,
  options?: BuildInputDesignOptions,
): ToolInputDesign {
  const contract = options?.contract;

  const requiredFields = requirementResult.requiredMissingInputs
    .map((variableId) =>
      toField(ontology, variableId, { required: true, defaulted: false, advanced: false }, contract),
    )
    .filter((field): field is ToolInputDesignField => field !== undefined);

  const defaultedFields = requirementResult.defaultedInputs
    .map((variableId) =>
      toField(ontology, variableId, { required: false, defaulted: true, advanced: false }, contract),
    )
    .filter((field): field is ToolInputDesignField => field !== undefined);

  const optionalFields = requirementResult.optionalRecommendedInputs
    .map((variableId) =>
      toField(ontology, variableId, { required: false, defaulted: false, advanced: false }, contract),
    )
    .filter((field): field is ToolInputDesignField => field !== undefined);

  const advancedFields = requirementResult.advancedRecommendedInputs
    .map((variableId) =>
      toField(ontology, variableId, { required: false, defaulted: false, advanced: true }, contract),
    )
    .filter((field): field is ToolInputDesignField => field !== undefined);

  const derivedVariableIds = Array.from(
    new Set(requirementResult.derivedResolutionPlan.map((step) => step.variableId)),
  );
  const derivedFields = derivedVariableIds
    .map((variableId) =>
      toField(ontology, variableId, { required: false, defaulted: false, advanced: false, derived: true }, contract),
    )
    .filter((field): field is ToolInputDesignField => field !== undefined);

  const assumptionFromDefaults = defaultedFields.map(
    (field) => `${field.label} accepted via default (${field.unit}).`,
  );

  return {
    requiredFields,
    optionalFields,
    advancedFields,
    defaultedFields,
    derivedFields: derivedFields.length > 0 ? derivedFields : undefined,
    acceptedAssumptions: [
      ...requirementResult.acceptedAssumptions,
      ...assumptionFromDefaults,
    ],
  };
}
