/**
 * Contract → ontology draft bridge (Phase 5H-B-2).
 * Read-only mapping from FormulaContract metadata; does not mutate contracts.
 */

import type { FormulaContract } from "@/lib/formula-governance/types";
import type {
  FormulaType,
  MissingRisk,
  VariableConstraint,
  VariableDimension,
  VariableKnowledgeLevel,
  VariableRole,
} from "@/lib/formula-governance/calculation-ontology/ontology-types";

const PRODUCTION_ASSUMPTION_PREFIX = "Production:";

const TARGET_OUTPUT_IDS = new Set([
  "minimumSafePrice",
  "minimumSafeContractPrice",
  "minimumSafeQuotePrice",
  "minimumSafeBid",
  "minimumSafeMonthlyBid",
]);

const DERIVED_OUTPUT_IDS = new Set([
  "baseCost",
  "p90Cost",
  "riskAdjustedCost",
  "adjustedCost",
  "minimumSafeChangePrice",
]);

const VERDICT_OUTPUT_IDS = new Set([
  "quoteVerdict",
  "suggestedAction",
  "verdict",
  "netMargin",
]);

const PERCENT_HINTS = ["percent", "pct", "margin", "yield", "risk", "waste", "scrap", "buffer"];
const CURRENCY_HINTS = ["cost", "price", "fee", "budget", "rent", "payment", "material", "tooling", "tool"];
const TIME_HINTS = ["hours", "hour", "minutes", "minute", "time", "cycle", "setup"];
const COUNT_HINTS = ["quantity", "count", "squares", "qty", "units"];

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

function humanizeKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

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

function inferDimension(inputKey: string): {
  readonly dimension: VariableDimension;
  readonly unit: string;
  readonly inferred: boolean;
} {
  const normalized = inputKey.toLowerCase();

  if (normalized.includes("rate") && !normalized.includes("percent")) {
    return { dimension: "rate", unit: "USD/hour", inferred: true };
  }
  if (TIME_HINTS.some((hint) => normalized.includes(hint))) {
    return { dimension: "time", unit: normalized.includes("minute") ? "min" : "hour", inferred: true };
  }
  if (COUNT_HINTS.some((hint) => normalized.includes(hint))) {
    return { dimension: "count", unit: "unit", inferred: true };
  }
  if (PERCENT_HINTS.some((hint) => normalized.includes(hint))) {
    return { dimension: "percent", unit: "%", inferred: true };
  }
  if (CURRENCY_HINTS.some((hint) => normalized.includes(hint))) {
    return { dimension: "currency", unit: "USD", inferred: true };
  }

  return { dimension: "dimensionless", unit: "unit", inferred: true };
}

function inferOutputRole(outputId: string): VariableRole {
  if (TARGET_OUTPUT_IDS.has(outputId)) {
    return "target";
  }
  if (DERIVED_OUTPUT_IDS.has(outputId)) {
    return "derived";
  }
  if (VERDICT_OUTPUT_IDS.has(outputId)) {
    return "constant";
  }
  return "derived";
}

function inferOutputDimension(outputId: string): VariableDimension {
  if (VERDICT_OUTPUT_IDS.has(outputId)) {
    return "dimensionless";
  }
  if (outputId.toLowerCase().includes("margin") && !outputId.toLowerCase().includes("price")) {
    return "percent";
  }
  return "currency";
}

function buildInputConstraints(
  contract: FormulaContract,
  inputKey: string,
): VariableConstraint | undefined {
  const dimensionalRules = contract.validationRules.filter((rule) => rule.kind === "dimensional");
  const edgeRules = contract.validationRules.filter((rule) => rule.kind === "edge");
  const normalized = inputKey.toLowerCase();

  const draft: { nonNegative?: boolean; min?: number; max?: number } = {};
  if (edgeRules.some((rule) => rule.description.toLowerCase().includes("non-negative"))) {
    draft.nonNegative = true;
  }
  if (edgeRules.some((rule) => rule.description.includes("≥ 1"))) {
    draft.min = 1;
  }
  if (dimensionalRules.some((rule) => rule.description.includes("0–100"))) {
    draft.max = 100;
    draft.min = 0;
  }
  if (PERCENT_HINTS.some((hint) => normalized.includes(hint))) {
    draft.max = 100;
    draft.min = 0;
  }
  if (CURRENCY_HINTS.some((hint) => normalized.includes(hint))) {
    draft.nonNegative = true;
  }

  return Object.keys(draft).length > 0 ? (draft as VariableConstraint) : undefined;
}

function extractProductionAssumption(contract: FormulaContract): string | undefined {
  return contract.assumptions.find((line) => line.startsWith(PRODUCTION_ASSUMPTION_PREFIX));
}

function resolveTargetOutput(outputs: readonly string[]): string | undefined {
  return outputs.find((output) => TARGET_OUTPUT_IDS.has(output) || output.toLowerCase().includes("safeprice"));
}

function buildFormulaNodeDrafts(
  contract: FormulaContract,
  targetOutput: string,
): readonly OntologyFormulaNodeDraft[] {
  const limitations = contract.warningPolicy?.modelLimitations ?? [];
  const formulaAssumptions = contract.warningPolicy?.acceptedAssumptions ?? [];

  const nodes: OntologyFormulaNodeDraft[] = [];

  for (const output of contract.outputs) {
    if (VERDICT_OUTPUT_IDS.has(output)) {
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

  const targetOutput = resolveTargetOutput(contract.outputs);
  if (!targetOutput) {
    blockers.push(`Contract "${contract.slug}" has no identifiable target output variable.`);
  }

  const primaryTarget = targetOutput ?? contract.outputs[0] ?? "result";

  const inputIds = Array.from(new Set([...contract.requiredInputs, ...contract.criticalInputs]));
  const variables: OntologyVariableDraft[] = inputIds.map((inputKey) => {
    const dimensionMeta = inferDimension(inputKey);
    if (dimensionMeta.inferred && dimensionMeta.dimension === "dimensionless") {
      warnings.push(`Input "${inputKey}" has no inferred unit/dimension — manual ontology review required.`);
    }

    const isCritical = contract.criticalInputs.includes(inputKey);
    const knowledgeLevel: VariableKnowledgeLevel = isCritical ? "user_known" : "estimable";

    return {
      id: inputKey,
      label: humanizeKey(inputKey),
      role: "input",
      dimension: dimensionMeta.dimension,
      unit: dimensionMeta.unit,
      knowledgeLevel,
      requiredForOutputs: [primaryTarget],
      description: `Contract ${isCritical ? "critical" : "required"} input for ${contract.toolName}.`,
      missingRisk: isCritical ? "high" : "medium",
      constraints: buildInputConstraints(contract, inputKey),
      dimensionInferred: dimensionMeta.inferred,
    };
  });

  for (const output of contract.outputs) {
    if (VERDICT_OUTPUT_IDS.has(output)) {
      continue;
    }
    const role = inferOutputRole(output);
    if (role === "constant") {
      continue;
    }
    variables.push({
      id: output,
      label: humanizeKey(output),
      role,
      dimension: inferOutputDimension(output),
      unit: role === "target" || inferOutputDimension(output) === "currency" ? "USD" : "unit",
      knowledgeLevel: "system_derived",
      requiredForOutputs: [primaryTarget],
      description: `Contract output mapped as ${role} variable.`,
      missingRisk: role === "target" ? "high" : "low",
      dimensionInferred: true,
    });
  }

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
      (output) => output !== primaryTarget && !VERDICT_OUTPUT_IDS.has(output),
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
