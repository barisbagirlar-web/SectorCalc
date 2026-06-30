/**
 * Formula graph lookups — pure helpers over ontology formulas.
 */

import type { CalculationOntology, FormulaNode } from "@/lib/features/formula-governance/calculation-ontology/ontology-types";

export function getFormulaById(
  ontology: CalculationOntology,
  formulaNodeId: string,
): FormulaNode | undefined {
  return ontology.formulas.find((formula) => formula.id === formulaNodeId);
}

export function getFormulaByOutputVariable(
  ontology: CalculationOntology,
  outputVariable: string,
): FormulaNode | undefined {
  return ontology.formulas.find((formula) => formula.outputVariable === outputVariable);
}

export function getFormulaCandidatesForOutput(
  ontology: CalculationOntology,
  outputVariable: string,
): readonly FormulaNode[] {
  return ontology.formulas.filter((formula) => formula.outputVariable === outputVariable);
}

export function getAcceptedFormulaCandidatesForGoal(
  ontology: CalculationOntology,
  goalId: string,
  outputVariable: string,
): readonly FormulaNode[] {
  const goal = ontology.goals.find((entry) => entry.id === goalId);
  if (!goal) {
    return [];
  }
  const candidates = getFormulaCandidatesForOutput(ontology, outputVariable);
  if (goal.acceptedFormulaNodes.length === 0) {
    return candidates;
  }
  return candidates.filter((formula) => goal.acceptedFormulaNodes.includes(formula.id));
}

export function topologicalFormulaOrder(ontology: CalculationOntology): readonly string[] {
  const formulaIds = ontology.formulas.map((formula) => formula.id);
  const inDegree = new Map<string, number>();
  const dependents = new Map<string, string[]>();

  for (const formula of ontology.formulas) {
    inDegree.set(formula.id, 0);
    dependents.set(formula.id, []);
  }

  for (const formula of ontology.formulas) {
    for (const inputId of formula.requiredInputs) {
      const producer = getFormulaByOutputVariable(ontology, inputId);
      if (!producer || producer.id === formula.id) {
        continue;
      }
      inDegree.set(formula.id, (inDegree.get(formula.id) ?? 0) + 1);
      const list = dependents.get(producer.id) ?? [];
      list.push(formula.id);
      dependents.set(producer.id, list);
    }
  }

  const queue = formulaIds.filter((id) => (inDegree.get(id) ?? 0) === 0);
  const ordered: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      break;
    }
    ordered.push(current);
    for (const next of dependents.get(current) ?? []) {
      const nextDegree = (inDegree.get(next) ?? 0) - 1;
      inDegree.set(next, nextDegree);
      if (nextDegree === 0) {
        queue.push(next);
      }
    }
  }

  return ordered.length === formulaIds.length ? ordered : formulaIds;
}
