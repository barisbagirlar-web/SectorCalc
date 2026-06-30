/**
 * Ontology builder helpers — validation without mutating production calculators.
 */

import { detectCircularDependencies, detectUnreachableTargetVariables } from "@/lib/features/formula-governance/calculation-ontology/dependency-graph";
import type {
  CalculationOntology,
  CalculationVariable,
  DependencyGraphIssue,
  FormulaNode,
} from "@/lib/features/formula-governance/calculation-ontology/ontology-types";

export type OntologyValidationResult = {
  readonly isValid: boolean;
  readonly issues: readonly DependencyGraphIssue[];
  readonly warnings: readonly string[];
};

function indexVariables(variables: readonly CalculationVariable[]): Map<string, CalculationVariable> {
  return new Map(variables.map((variable) => [variable.id, variable]));
}

export function validateOntologyStructure(ontology: CalculationOntology): OntologyValidationResult {
  const warnings: string[] = [];
  const variableById = indexVariables(ontology.variables);

  for (const formula of ontology.formulas) {
    if (!variableById.has(formula.outputVariable)) {
      warnings.push(`Formula "${formula.id}" output "${formula.outputVariable}" is not declared.`);
    }
    for (const inputId of formula.requiredInputs) {
      if (!variableById.has(inputId)) {
        warnings.push(`Formula "${formula.id}" references unknown input "${inputId}".`);
      }
    }
  }

  for (const goal of ontology.goals) {
    if (!variableById.has(goal.targetVariable)) {
      warnings.push(`Goal "${goal.id}" references unknown target "${goal.targetVariable}".`);
    }
  }

  const issues = [...detectCircularDependencies(ontology), ...detectUnreachableTargetVariables(ontology)];

  return {
    isValid: issues.length === 0,
    issues,
    warnings,
  };
}

export function createOntology(input: CalculationOntology): CalculationOntology {
  return input;
}

export function listUserFacingVariables(ontology: CalculationOntology): readonly CalculationVariable[] {
  return ontology.variables.filter(
    (variable) =>
      variable.knowledgeLevel === "user_known" ||
      variable.knowledgeLevel === "expert_required" ||
      variable.knowledgeLevel === "estimable",
  );
}

export function listFormulaNodesForVariable(
  ontology: CalculationOntology,
  variableId: string,
): readonly FormulaNode[] {
  return ontology.formulas.filter((formula) => formula.outputVariable === variableId);
}
