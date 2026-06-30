/**
 * Dependency resolver — expands formula paths into required variables.
 */

import { getFormulaById, getFormulaByOutputVariable } from "@/lib/features/formula-governance/calculation-ontology/formula-graph";
import type {
  CalculationOntology,
  CalculationVariable,
  FormulaNode,
} from "@/lib/features/formula-governance/calculation-ontology/ontology-types";
import type { DerivedResolutionStep } from "@/lib/features/formula-governance/requirement-engine/requirement-engine-types";

export type ResolvedRequirementSet = {
  readonly missingUserInputs: readonly string[];
  readonly defaultedInputs: readonly string[];
  readonly derivedResolutionPlan: readonly DerivedResolutionStep[];
  readonly selectedFormulaPath: readonly string[];
  readonly acceptedAssumptions: readonly string[];
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};

function getVariable(
  ontology: CalculationOntology,
  variableId: string,
): CalculationVariable | undefined {
  return ontology.variables.find((variable) => variable.id === variableId);
}

function isUserRequired(variable: CalculationVariable): boolean {
  return variable.knowledgeLevel === "user_known" || variable.knowledgeLevel === "expert_required";
}

function resolveFormulaRequirements(
  ontology: CalculationOntology,
  formula: FormulaNode,
  knownInputs: Readonly<Record<string, number>>,
  visitingOutputs: Set<string>,
): ResolvedRequirementSet {
  if (visitingOutputs.has(formula.outputVariable)) {
    return {
      missingUserInputs: [],
      defaultedInputs: [],
      derivedResolutionPlan: [],
      selectedFormulaPath: [],
      acceptedAssumptions: [],
      blockers: [`Circular resolution detected at "${formula.outputVariable}".`],
      warnings: [],
    };
  }

  visitingOutputs.add(formula.outputVariable);

  const missing = new Set<string>();
  const defaulted = new Set<string>();
  const assumptions = new Set<string>();
  const plan: DerivedResolutionStep[] = [];
  const path: string[] = [formula.id];
  const blockers: string[] = [];
  const warnings: string[] = [];

  for (const inputId of formula.requiredInputs) {
    if (inputId in knownInputs) {
      continue;
    }

    const variable = getVariable(ontology, inputId);
    if (!variable) {
      blockers.push(`Unknown variable "${inputId}" required by formula "${formula.id}".`);
      continue;
    }

    if (variable.knowledgeLevel === "defaultable") {
      defaulted.add(inputId);
      if (variable.defaultValue !== undefined) {
        assumptions.add(
          `${variable.label} defaulted to ${variable.defaultValue}${variable.unit === "%" ? "%" : ` ${variable.unit}`}.`,
        );
      } else {
        assumptions.add(`${variable.label} uses ontology default.`);
      }
      continue;
    }

    if (variable.knowledgeLevel === "system_derived" || variable.role === "derived") {
      const producer = getFormulaByOutputVariable(ontology, inputId);
      if (!producer) {
        blockers.push(`Derived variable "${inputId}" has no producing formula.`);
        continue;
      }
      const nested = resolveFormulaRequirements(ontology, producer, knownInputs, visitingOutputs);
      blockers.push(...nested.blockers);
      warnings.push(...nested.warnings);
      for (const item of nested.missingUserInputs) {
        missing.add(item);
      }
      for (const item of nested.defaultedInputs) {
        defaulted.add(item);
      }
      for (const item of nested.acceptedAssumptions) {
        assumptions.add(item);
      }
      path.unshift(...nested.selectedFormulaPath);
      plan.push({
        variableId: inputId,
        formulaNodeId: producer.id,
        requiredInputs: [...producer.requiredInputs],
      });
      plan.push(...nested.derivedResolutionPlan);
      continue;
    }

    if (isUserRequired(variable) || variable.knowledgeLevel === "estimable") {
      missing.add(inputId);
    }
  }

  visitingOutputs.delete(formula.outputVariable);

  return {
    missingUserInputs: Array.from(missing),
    defaultedInputs: Array.from(defaulted),
    derivedResolutionPlan: plan,
    selectedFormulaPath: Array.from(new Set(path)),
    acceptedAssumptions: Array.from(assumptions),
    blockers,
    warnings,
  };
}

export function resolveRequirementsForFormulaPath(
  ontology: CalculationOntology,
  formulaNodeId: string,
  knownInputs: Readonly<Record<string, number>>,
): ResolvedRequirementSet {
  const formula = getFormulaById(ontology, formulaNodeId);
  if (!formula) {
    return {
      missingUserInputs: [],
      defaultedInputs: [],
      derivedResolutionPlan: [],
      selectedFormulaPath: [],
      acceptedAssumptions: [],
      blockers: [`Formula node "${formulaNodeId}" not found.`],
      warnings: [],
    };
  }

  const resolved = resolveFormulaRequirements(ontology, formula, knownInputs, new Set<string>());

  return {
    ...resolved,
    acceptedAssumptions: [
      ...resolved.acceptedAssumptions,
      ...(resolved.defaultedInputs.length > 0 ? ontology.defaultAssumptions : []),
    ],
  };
}

export function scoreRequirementPath(resolved: ResolvedRequirementSet): number {
  return (
    resolved.missingUserInputs.length * 10 +
    resolved.blockers.length * 100 +
    resolved.defaultedInputs.length
  );
}
