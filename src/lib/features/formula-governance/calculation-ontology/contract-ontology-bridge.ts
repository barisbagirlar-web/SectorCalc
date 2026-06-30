/**
 * Contract → ontology draft bridge (Phase 5H-B-2).
 * Read-only mapping from FormulaContract metadata; does not mutate contracts.
 */

import {
  inferVariableRoleFromContractField,
  isVerdictOutput,
  normalizeContractInputsToVariables,
  normalizeContractOutputsToVariables,
  resolveContractTargetOutput,
} from "@/lib/features/formula-governance/calculation-ontology/contract-variable-normalizer";
import type { FormulaContract } from "@/lib/features/formula-governance/types";
import type {
  FormulaType,
  MissingRisk,
  VariableConstraint,
  VariableDimension,
  VariableKnowledgeLevel,
  VariableRole,
} from "@/lib/features/formula-governance/calculation-ontology/ontology-types";

const PRODUCTION_ASSUMPTION_PREFIX = "Production:";

const PERCENT_HINTS = ["percent", "pct", "margin", "yield", "risk", "waste", "scrap", "buffer"];

export type OntologyVariableDraft = {
  readonly id: string;
  readonly label: string;
  readonly role: VariableRole;
  readonly dimension: VariableDimension;
  readonly unit: string;
  readonly knowledgeLevel: VariableKnowledgeLevel;
  readonly requiredForOutputs: readonly string[];
  readonly description: string;
  readonly missingRisk: MissingRisk;
  readonly constraints?: VariableConstraint;
  readonly dimensionInferred: boolean;
};

export type OntologyFormulaNodeDraft = {
  readonly id: string;
  readonly label: string;
  readonly outputVariable: string;
  readonly requiredInputs: readonly string[];
  readonly formulaType: FormulaType;
  readonly reversible: boolean;
  readonly expression: string;
  readonly assumptions: readonly string[];
  readonly limitations: readonly string[];
  readonly invariants: readonly string[];
};

export type OntologyGoalDraft = {
  readonly id: string;
  readonly slug: string;
  readonly targetVariable: string;
  readonly decisionGoal: string;
  readonly primaryOutput: string;
  readonly secondaryOutputs: readonly string[];
};

export type OntologyDraft = {
  readonly slug: string;
  readonly sector: string;
  readonly variables: readonly OntologyVariableDraft[];
  readonly goals: readonly OntologyGoalDraft[];
  readonly formulaNodes: readonly OntologyFormulaNodeDraft[];
  readonly assumptions: readonly string[];
  readonly limitations: readonly string[];
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};

function inferSector(slug: string): string {
  if (slug.includes("roofing")) {
    return "roofing";
  }
  if (slug.includes("cnc")) {
    return "cnc-manufacturing";
  }
  if (slug.includes("hvac")) {
    return "hvac";
  }
  if (slug.includes("cleaning")) {
    return "cleaning";
  }
  return "general";
}

function extractProductionAssumption(contract: FormulaContract): string | undefined {
  return contract.assumptions.find((line) => line.startsWith(PRODUCTION_ASSUMPTION_PREFIX));
}

function inferOutputRole(outputId: string): VariableRole {
  return inferVariableRoleFromContractField(outputId, "output");
}

function buildFormulaNodeDrafts(
  contract: FormulaContract,
  targetOutput: string,
): readonly OntologyFormulaNodeDraft[] {
  const limitations = contract.warningPolicy?.modelLimitations ?? [];
  const formulaAssumptions = contract.warningPolicy?.acceptedAssumptions ?? [];

  const nodes: OntologyFormulaNodeDraft[] = [];

  for (const output of contract.outputs) {
    if (isVerdictOutput(output)) {
      continue;
    }
    const role = inferOutputRole(output);
    if (role === "constant") {
      continue;
    }

    const requiredInputs =
      role === "target"
        ? [...contract.criticalInputs]
        : contract.criticalInputs.filter((input) => !PERCENT_HINTS.some((hint) => input.toLowerCase().includes(hint)) || input === "targetMargin");

    nodes.push({
      id: `${contract.slug}-${output}`,
      label: `${contract.toolName} → ${output}`,
      outputVariable: output,
      requiredInputs: role === "derived" && output === "baseCost" ? [...contract.criticalInputs] : requiredInputs,
      formulaType: role === "target" ? "ratio" : "expression",
      reversible: false,
      expression: contract.formulaSummary,
      assumptions: formulaAssumptions,
      limitations,
      invariants:
        role === "target"
          ? [`${output} >= baseCost`, "targetMargin < 100"]
          : [`${output} >= 0`],
    });
  }

  if (nodes.length === 0) {
    nodes.push({
      id: `${contract.slug}-target`,
      label: contract.toolName,
      outputVariable: targetOutput,
      requiredInputs: [...contract.criticalInputs],
      formulaType: "expression",
      reversible: false,
      expression: contract.formulaSummary,
      assumptions: formulaAssumptions,
      limitations,
      invariants: [`${targetOutput} >= 0`],
    });
  }

  return nodes;
}

export function buildOntologyDraftFromFormulaContract(contract: FormulaContract): OntologyDraft {
  const warnings: string[] = [];
  const blockers: string[] = [];

  const productionLine = extractProductionAssumption(contract);
  if (!productionLine) {
    blockers.push(`Contract "${contract.slug}" is missing Production: assumption line.`);
  }

  const targetOutput = resolveContractTargetOutput(contract.outputs);
  if (!targetOutput) {
    blockers.push(`Contract "${contract.slug}" has no identifiable target output variable.`);
  }

  const primaryTarget = targetOutput ?? contract.outputs[0] ?? "result";

  const normalizedInputs = normalizeContractInputsToVariables(contract, primaryTarget);
  const normalizedOutputs = normalizeContractOutputsToVariables(contract, primaryTarget);
  warnings.push(...normalizedInputs.warnings, ...normalizedOutputs.warnings);
  const variables: OntologyVariableDraft[] = [
    ...normalizedInputs.variables,
    ...normalizedOutputs.variables,
  ];

  const limitations = contract.warningPolicy?.modelLimitations ?? [];
  const assumptions = [
    ...contract.assumptions.filter((line) => !line.startsWith(PRODUCTION_ASSUMPTION_PREFIX)),
    ...(contract.warningPolicy?.acceptedAssumptions ?? []),
  ];

  const goal: OntologyGoalDraft = {
    id: `${contract.slug}-goal`,
    slug: contract.slug,
    targetVariable: primaryTarget,
    decisionGoal: contract.userDecision,
    primaryOutput: primaryTarget,
    secondaryOutputs: contract.outputs.filter(
      (output) => output !== primaryTarget && !isVerdictOutput(output),
    ),
  };

  return {
    slug: contract.slug,
    sector: inferSector(contract.slug),
    variables,
    goals: [goal],
    formulaNodes: buildFormulaNodeDrafts(contract, primaryTarget),
    assumptions,
    limitations,
    warnings,
    blockers,
  };
}
