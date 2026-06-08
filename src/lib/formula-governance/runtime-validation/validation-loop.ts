/**
 * Validation loop — Mind 1 input/result checks and closed intelligence loop.
 */

import { getFormulaById } from "@/lib/formula-governance/calculation-ontology/formula-graph";
import { solveRequiredInputs } from "@/lib/formula-governance/requirement-engine/requirement-engine";
import { checkAllBoundaries } from "@/lib/formula-governance/runtime-validation/boundary-checker";
import { checkDimensionConsistency } from "@/lib/formula-governance/runtime-validation/dimension-consistency-checker";
import { evaluateInvariants } from "@/lib/formula-governance/runtime-validation/invariant-engine";
import type {
  CalculationIntelligenceLoopParams,
  CalculationIntelligenceLoopResult,
  ValidateCalculationParams,
  ValidationResult,
} from "@/lib/formula-governance/runtime-validation/invariant-types";

export function validateCalculationInputsAndResult(
  params: ValidateCalculationParams,
): ValidationResult {
  const { ontology, formulaNode, inputs, result } = params;
  const mergedValues = { ...inputs, ...result };
  const variables = ontology.variables.filter((variable) => variable.id in mergedValues);

  const boundary = checkAllBoundaries(variables, mergedValues);
  const dimensionErrors = checkDimensionConsistency(ontology, mergedValues);
  const invariantViolations = evaluateInvariants(formulaNode, mergedValues);

  const errors = [...boundary.errors, ...dimensionErrors, ...invariantViolations];
  const warnings = [
    ...boundary.warnings,
    ...formulaNode.limitations.map((limitation) => `Model limitation: ${limitation}`),
    ...ontology.defaultAssumptions.map((assumption) => `Accepted assumption: ${assumption}`),
  ];

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    invariantViolations,
    dimensionErrors,
  };
}

export function runCalculationIntelligenceLoop(
  params: CalculationIntelligenceLoopParams,
): CalculationIntelligenceLoopResult {
  const requirement = solveRequiredInputs({
    ontology: params.ontology,
    goalId: params.goalId,
    knownInputs: params.knownInputs,
  });

  if (requirement.status === "blocked") {
    return {
      status: "BLOCKED",
      requirement,
      blockers: requirement.blockers,
      warnings: requirement.warnings,
    };
  }

  if (requirement.status === "need_more_data") {
    return {
      status: "NEED_DATA",
      requirement,
      blockers: requirement.blockers,
      warnings: requirement.warnings,
    };
  }

  if (!params.calculatedResult) {
    return {
      status: "READY_TO_CALCULATE",
      requirement,
      blockers: [],
      warnings: requirement.warnings,
    };
  }

  const formulaNodeId =
    params.formulaNodeId ?? requirement.selectedFormulaPath[requirement.selectedFormulaPath.length - 1];
  const formulaNode = formulaNodeId ? getFormulaById(params.ontology, formulaNodeId) : undefined;

  if (!formulaNode) {
    return {
      status: "BLOCKED",
      requirement,
      blockers: [`Formula node "${formulaNodeId ?? "unknown"}" not found for validation.`],
      warnings: requirement.warnings,
    };
  }

  const validation = validateCalculationInputsAndResult({
    ontology: params.ontology,
    formulaNode,
    inputs: params.knownInputs,
    result: params.calculatedResult,
  });

  if (!validation.isValid) {
    return {
      status: "PHYSICS_OR_LOGIC_ERROR",
      requirement,
      validation,
      blockers: validation.errors,
      warnings: [...requirement.warnings, ...validation.warnings],
    };
  }

  return {
    status: "SUCCESS",
    requirement,
    validation,
    blockers: [],
    warnings: [...requirement.warnings, ...validation.warnings],
  };
}
