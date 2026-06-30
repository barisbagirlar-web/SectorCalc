/**
 * Validation loop — Mind 1 input/result checks and closed intelligence loop.
 */

import { getFormulaById } from "@/lib/features/formula-governance/calculation-ontology/formula-graph";
import { solveRequiredInputs } from "@/lib/features/formula-governance/requirement-engine/requirement-engine";
import { checkAllBoundaries } from "@/lib/features/formula-governance/runtime-validation/boundary-checker";
import { checkDimensionConsistency } from "@/lib/features/formula-governance/runtime-validation/dimension-consistency-checker";
import { evaluateInvariants } from "@/lib/features/formula-governance/runtime-validation/invariant-engine";
import type { CalculationOntology } from "@/lib/features/formula-governance/calculation-ontology/ontology-types";
import type {
  CalculationIntelligenceLoopParams,
  CalculationIntelligenceLoopResult,
  CalculationValues,
  ValidateCalculationParams,
  ValidationResult,
} from "@/lib/features/formula-governance/runtime-validation/invariant-types";
import { allowsSignedCurrencyOutput } from "@/lib/features/formula-governance/runtime-validation/signed-currency-outputs";

function validateContractDerivedTargets(
  ontology: CalculationOntology,
  result: CalculationValues,
): { readonly errors: readonly string[]; readonly warnings: readonly string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const goal of ontology.goals) {
    const targetId = goal.targetVariable;
    if (!(targetId in result)) {
      continue;
    }
    const variable = ontology.variables.find((entry) => entry.id === targetId);
    if (!variable) {
      continue;
    }
    const value = result[targetId];
    if (
      variable.dimension === "currency" &&
      value < 0 &&
      !allowsSignedCurrencyOutput(targetId)
    ) {
      errors.push(`${targetId} target currency result must be non-negative.`);
    }
    if (variable.dimension === "percent" && (value < 0 || value > 100)) {
      errors.push(`${targetId} target percent result must be between 0 and 100.`);
    }
    if (variable.role === "target" && variable.dimension === "currency" && value === 0) {
      warnings.push(`${targetId} target currency is zero — verify pricing inputs.`);
    }
  }

  for (const variable of ontology.variables) {
    if (variable.role !== "derived" || !(variable.id in result)) {
      continue;
    }
    const value = result[variable.id];
    if (
      variable.dimension === "currency" &&
      value < 0 &&
      !allowsSignedCurrencyOutput(variable.id)
    ) {
      errors.push(`${variable.id} derived currency must be non-negative.`);
    }
    if (variable.dimension === "percent" && (value < 0 || value > 100)) {
      errors.push(`${variable.id} derived percent must be between 0 and 100.`);
    }
  }

  return { errors, warnings };
}

export function validateCalculationInputsAndResult(
  params: ValidateCalculationParams,
): ValidationResult {
  const { ontology, formulaNode, inputs, result } = params;
  const mergedValues = { ...inputs, ...result };
  const variables = ontology.variables.filter((variable) => variable.id in mergedValues);

  const boundary = checkAllBoundaries(variables, mergedValues);
  const dimensionErrors = checkDimensionConsistency(ontology, mergedValues);
  const invariantViolations = evaluateInvariants(formulaNode, mergedValues);
  const targetChecks = validateContractDerivedTargets(ontology, result);

  const errors = [
    ...boundary.errors,
    ...dimensionErrors,
    ...invariantViolations,
    ...targetChecks.errors,
  ];
  const warnings = [
    ...boundary.warnings,
    ...targetChecks.warnings,
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
