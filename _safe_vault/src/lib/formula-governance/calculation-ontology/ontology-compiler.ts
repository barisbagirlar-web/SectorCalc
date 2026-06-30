/**
 * Ontology draft compiler — OntologyDraft → CalculationOntology (Phase 5H-B-3).
 */

import { createOntology } from "@/lib/formula-governance/calculation-ontology/ontology-builder";
import type { OntologyDraft } from "@/lib/formula-governance/calculation-ontology/contract-ontology-bridge";
import type {
  CalculationGoal,
  CalculationOntology,
  CalculationVariable,
  FormulaNode,
} from "@/lib/formula-governance/calculation-ontology/ontology-types";
import type { OntologyDraftWithProductionSource } from "@/lib/formula-governance/calculation-ontology/production-source-reference";

export type OntologyCompileResult = {
  readonly ontology: CalculationOntology | null;
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};

type CompileDraft = OntologyDraft | OntologyDraftWithProductionSource;

function indexVariableIds(draft: CompileDraft): Map<string, number> {
  const counts = new Map<string, number>();
  for (const variable of draft.variables) {
    counts.set(variable.id, (counts.get(variable.id) ?? 0) + 1);
  }
  return counts;
}

function compileVariables(draft: CompileDraft, warnings: string[]): CalculationVariable[] {
  const variables: CalculationVariable[] = [];

  for (const draftVariable of draft.variables) {
    if (draftVariable.dimensionInferred && draftVariable.dimension === "dimensionless") {
      warnings.push(
        `Variable "${draftVariable.id}" is missing declared dimension/unit.`,
      );
    }

    if (
      (draftVariable.role === "derived" || draftVariable.role === "target") &&
      (draftVariable.knowledgeLevel === "user_known" || draftVariable.knowledgeLevel === "estimable")
    ) {
      warnings.push(
        `Derived/target output "${draftVariable.id}" appears as user-facing input.`,
      );
    }

    variables.push({
      id: draftVariable.id,
      label: draftVariable.label,
      role: draftVariable.role,
      dimension: draftVariable.dimension,
      unit: draftVariable.unit,
      knowledgeLevel: draftVariable.knowledgeLevel,
      requiredForOutputs: draftVariable.requiredForOutputs,
      constraints: draftVariable.constraints,
      description: draftVariable.description,
      missingRisk: draftVariable.missingRisk,
    });
  }

  return variables;
}

function compileFormulas(draft: CompileDraft): FormulaNode[] {
  return draft.formulaNodes.map((node) => ({
    id: node.id,
    label: node.label,
    outputVariable: node.outputVariable,
    requiredInputs: node.requiredInputs,
    formulaType: node.formulaType,
    reversible: node.reversible,
    expression: node.expression,
    assumptions: node.assumptions,
    limitations: node.limitations,
    invariants: node.invariants,
  }));
}

function compileGoals(draft: CompileDraft, formulas: readonly FormulaNode[]): CalculationGoal[] {
  return draft.goals.map((goal) => {
    const acceptedFormulaNodes = formulas
      .filter((formula) => formula.outputVariable === goal.targetVariable)
      .map((formula) => formula.id);

    return {
      id: goal.id,
      slug: goal.slug,
      targetVariable: goal.targetVariable,
      acceptedFormulaNodes,
      decisionGoal: goal.decisionGoal,
      primaryOutput: goal.primaryOutput,
      secondaryOutputs: goal.secondaryOutputs,
    };
  });
}

export function compileOntologyDraftToCalculationOntology(draft: CompileDraft): OntologyCompileResult {
  const warnings = [...draft.warnings];
  const blockers = [...draft.blockers];

  if ("productionSource" in draft && draft.productionSource) {
    warnings.push(
      `Production source metadata attached (${draft.productionSource.productionFilePath}); calculator not imported.`,
    );
  }

  const idCounts = indexVariableIds(draft);
  for (const [variableId, count] of idCounts.entries()) {
    if (count > 1) {
      blockers.push(`Duplicate variable id "${variableId}" in ontology draft.`);
    }
  }

  for (const goal of draft.goals) {
    if (!goal.targetVariable) {
      blockers.push(`Goal "${goal.id}" is missing targetVariable.`);
      continue;
    }

    const targetVariable = draft.variables.find((variable) => variable.id === goal.targetVariable);
    if (!targetVariable) {
      blockers.push(`Goal "${goal.id}" targetVariable "${goal.targetVariable}" is not declared.`);
    } else if (targetVariable.role !== "target") {
      warnings.push(
        `Goal target "${goal.targetVariable}" is not marked as target role in draft variables.`,
      );
    }

    const targetFormulas = draft.formulaNodes.filter(
      (node) => node.outputVariable === goal.targetVariable,
    );
    if (targetFormulas.length === 0) {
      blockers.push(`No formula node produces target output "${goal.targetVariable}".`);
    }
  }

  const variableIds = new Set(draft.variables.map((variable) => variable.id));
  for (const formula of draft.formulaNodes) {
    for (const inputId of formula.requiredInputs) {
      if (!variableIds.has(inputId)) {
        blockers.push(
          `Formula "${formula.id}" requires unknown variable "${inputId}".`,
        );
      }
    }
  }

  if (blockers.length > 0) {
    return { ontology: null, warnings, blockers };
  }

  const variables = compileVariables(draft, warnings);
  const formulas = compileFormulas(draft);
  const goals = compileGoals(draft, formulas);

  const ontology = createOntology({
    slug: draft.slug,
    sector: draft.sector,
    variables,
    formulas,
    goals,
    defaultAssumptions: draft.assumptions,
    professionalUpgradeVariables: variables
      .filter((variable) => variable.knowledgeLevel === "estimable")
      .map((variable) => variable.id),
  });

  return { ontology, warnings, blockers };
}
