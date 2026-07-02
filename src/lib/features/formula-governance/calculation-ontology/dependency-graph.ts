/**
 * Dependency graph builder - pure ontology analysis (Phase 5H-B-1).
 */

import {
  getFormulaByOutputVariable,
  getFormulaCandidatesForOutput,
} from "@/lib/features/formula-governance/calculation-ontology/formula-graph";
import type {
  CalculationOntology,
  DependencyEdge,
  DependencyGraph,
  DependencyGraphIssue,
} from "@/lib/features/formula-governance/calculation-ontology/ontology-types";

function collectProducerEdges(
  ontology: CalculationOntology,
  outputVariable: string,
  formulaNodeId: string,
  visitedOutputs: Set<string>,
): DependencyEdge[] {
  if (visitedOutputs.has(outputVariable)) {
    return [];
  }
  visitedOutputs.add(outputVariable);

  const formula = ontology.formulas.find((entry) => entry.id === formulaNodeId);
  if (!formula) {
    return [];
  }

  const edges: DependencyEdge[] = [];
  for (const inputId of formula.requiredInputs) {
    edges.push({ from: inputId, to: outputVariable, formulaNodeId: formula.id });
    const producer = getFormulaByOutputVariable(ontology, inputId);
    if (producer) {
      edges.push(...collectProducerEdges(ontology, inputId, producer.id, visitedOutputs));
    }
  }
  return edges;
}

export function buildDependencyGraph(ontology: CalculationOntology): DependencyGraph {
  const edges: DependencyEdge[] = [];
  const formulaByOutput: Record<string, string> = {};

  for (const formula of ontology.formulas) {
    formulaByOutput[formula.outputVariable] = formula.id;
    edges.push(
      ...collectProducerEdges(ontology, formula.outputVariable, formula.id, new Set<string>()),
    );
  }

  const uniqueEdges = Array.from(
    new Map(edges.map((edge) => [`${edge.from}->${edge.to}:${edge.formulaNodeId}`, edge])).values(),
  );

  return {
    variableIds: ontology.variables.map((variable) => variable.id),
    edges: uniqueEdges,
    formulaByOutput,
  };
}

export function getDependenciesForTarget(
  ontology: CalculationOntology,
  targetVariable: string,
): readonly string[] {
  const graph = buildDependencyGraph(ontology);
  const required = new Set<string>();
  const queue = [targetVariable];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      continue;
    }
    for (const edge of graph.edges) {
      if (edge.to !== current || required.has(edge.from)) {
        continue;
      }
      required.add(edge.from);
      queue.push(edge.from);
    }
  }

  return Array.from(required);
}

export function getFormulaCandidatesForTarget(
  ontology: CalculationOntology,
  targetVariable: string,
): readonly string[] {
  return getFormulaCandidatesForOutput(ontology, targetVariable).map((formula) => formula.id);
}

export function getDerivedVariableChain(
  ontology: CalculationOntology,
  variableId: string,
): readonly string[] {
  const chain: string[] = [];
  const visited = new Set<string>();

  const walk = (current: string): void => {
    if (visited.has(current)) {
      return;
    }
    visited.add(current);

    const variable = ontology.variables.find((entry) => entry.id === current);
    if (variable?.role === "derived") {
      chain.push(current);
    }

    const producer = getFormulaByOutputVariable(ontology, current);
    if (!producer) {
      return;
    }

    for (const inputId of producer.requiredInputs) {
      walk(inputId);
    }
  };

  walk(variableId);
  return chain;
}

export function detectCircularDependencies(
  ontology: CalculationOntology,
): readonly DependencyGraphIssue[] {
  const graph = buildDependencyGraph(ontology);
  const adjacency = new Map<string, string[]>();

  for (const edge of graph.edges) {
    const list = adjacency.get(edge.from) ?? [];
    list.push(edge.to);
    adjacency.set(edge.from, list);
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const cycles = new Set<string>();

  const dfs = (node: string, path: string[]): void => {
    if (visiting.has(node)) {
      const cycleStart = path.indexOf(node);
      if (cycleStart >= 0) {
        for (const item of path.slice(cycleStart)) {
          cycles.add(item);
        }
      }
      return;
    }
    if (visited.has(node)) {
      return;
    }
    visiting.add(node);
    for (const next of adjacency.get(node) ?? []) {
      dfs(next, [...path, node]);
    }
    visiting.delete(node);
    visited.add(node);
  };

  for (const variableId of graph.variableIds) {
    dfs(variableId, []);
  }

  if (cycles.size === 0) {
    return [];
  }

  return [
    {
      code: "CIRCULAR_DEPENDENCY",
      message: "Circular dependency detected in ontology formula graph.",
      variableIds: Array.from(cycles),
    },
  ];
}

export function detectUnreachableTargetVariables(
  ontology: CalculationOntology,
): readonly DependencyGraphIssue[] {
  const issues: DependencyGraphIssue[] = [];

  for (const variable of ontology.variables) {
    if (variable.role !== "target") {
      continue;
    }
    const candidates = getFormulaCandidatesForTarget(ontology, variable.id);
    if (candidates.length === 0) {
      issues.push({
        code: "UNREACHABLE_TARGET",
        message: `Target variable "${variable.id}" has no producing formula node.`,
        variableIds: [variable.id],
      });
    }
  }

  for (const goal of ontology.goals) {
    const candidates = getFormulaCandidatesForTarget(ontology, goal.targetVariable);
    if (candidates.length === 0) {
      issues.push({
        code: "UNREACHABLE_TARGET",
        message: `Goal "${goal.id}" target "${goal.targetVariable}" is unreachable.`,
        variableIds: [goal.targetVariable],
      });
    }
  }

  return issues;
}
