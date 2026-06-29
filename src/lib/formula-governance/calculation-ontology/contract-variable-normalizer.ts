/**
 * Contract variable normalization — FormulaContract fields → ontology variable standard (Phase 5H-B-3).
 */

import type { FormulaContract } from "@/lib/formula-governance/types";
import type {
  MissingRisk,
  VariableConstraint,
  VariableDimension,
  VariableKnowledgeLevel,
  VariableRole,
} from "@/lib/formula-governance/calculation-ontology/ontology-types";
import type { OntologyVariableDraft } from "@/lib/formula-governance/calculation-ontology/contract-ontology-bridge";

const TARGET_OUTPUT_PATTERNS = [
  "minimumsafeprice",
  "minimumsafecontractprice",
  "minimumsafequoteprice",
  "minimumsafebid",
  "minimumsafemonthlybid",
  "safeprice",
  "recommendedprice",
];

const DERIVED_OUTPUT_PATTERNS = [
  "basecost",
  "p90cost",
  "riskadjustedcost",
  "adjustedcost",
  "minimumsafechangeprice",
];

const VERDICT_OUTPUT_PATTERNS = [
  "quoteverdict",
  "suggestedaction",
  "verdict",
  "recommendation",
  "narrative",
  "netmargin",
];

const PERCENT_HINTS = ["percent", "pct", "margin", "yield", "risk", "waste", "scrap", "buffer"];
const CURRENCY_HINTS = [
  "cost",
  "price",
  "fee",
  "budget",
  "rent",
  "payment",
  "material",
  "tooling",
  "tool",
  "revenue",
  "profit",
];
const TIME_HINTS = ["hours", "hour", "minutes", "minute", "time", "cycle", "setup"];
const COUNT_HINTS = ["quantity", "count", "squares", "qty", "units"];

export type ContractFieldKind = "input" | "output";

export type NormalizedContractVariable = {
  readonly id: string;
  readonly label: string;
  readonly role: VariableRole;
  readonly dimension: VariableDimension;
  readonly unit: string;
  readonly knowledgeLevel: VariableKnowledgeLevel;
  readonly missingRisk: MissingRisk;
  readonly dimensionInferred: boolean;
  readonly ambiguous: boolean;
};

export function normalizeContractVariableKey(key: string): string {
  return key.trim();
}

function humanizeKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

function matchesPattern(normalized: string, patterns: readonly string[]): boolean {
  return patterns.some(
    (pattern) => normalized === pattern || normalized.includes(pattern),
  );
}

export function inferVariableRoleFromContractField(
  field: string,
  kind: ContractFieldKind,
): VariableRole {
  const normalized = field.toLowerCase();

  if (kind === "input") {
    return "input";
  }

  if (matchesPattern(normalized, VERDICT_OUTPUT_PATTERNS)) {
    return "constant";
  }
  if (
    matchesPattern(normalized, TARGET_OUTPUT_PATTERNS) ||
    normalized.includes("safeprice") ||
    normalized.includes("recommendedprice")
  ) {
    return "target";
  }
  if (matchesPattern(normalized, DERIVED_OUTPUT_PATTERNS)) {
    return "derived";
  }

  return "derived";
}

export function inferVariableDimensionFromContractField(field: string): {
  readonly dimension: VariableDimension;
  readonly unit: string;
  readonly inferred: boolean;
  readonly ambiguous: boolean;
} {
  const normalized = field.toLowerCase();
  let ambiguous = false;

  const hasPercent = PERCENT_HINTS.some((hint) => normalized.includes(hint));
  const hasCurrency = CURRENCY_HINTS.some((hint) => normalized.includes(hint));

  if (hasPercent && hasCurrency) {
    ambiguous = true;
  }

  if (normalized.includes("rate") && !normalized.includes("percent")) {
    return { dimension: "rate", unit: "USD/hour", inferred: true, ambiguous };
  }
  if (TIME_HINTS.some((hint) => normalized.includes(hint))) {
    return { dimension: "time", unit: normalized.includes("minute") ? "min" : "hour", inferred: true, ambiguous };
  }
  if (COUNT_HINTS.some((hint) => normalized.includes(hint))) {
    return { dimension: "count", unit: "unit", inferred: true, ambiguous };
  }
  if (hasPercent) {
    return { dimension: "percent", unit: "%", inferred: true, ambiguous };
  }
  if (hasCurrency) {
    return { dimension: "currency", unit: "USD", inferred: true, ambiguous };
  }

  return { dimension: "dimensionless", unit: "unit", inferred: true, ambiguous: true };
}

export function inferVariableKnowledgeLevelFromContractField(
  field: string,
  contract: FormulaContract,
  kind: ContractFieldKind,
  role: VariableRole,
): VariableKnowledgeLevel {
  if (kind === "output" || role === "derived" || role === "target") {
    return "system_derived";
  }
  if (contract.criticalInputs.includes(field)) {
    return "user_known";
  }
  return "estimable";
}

function ruleAppliesToInput(ruleDescription: string, inputKey: string): boolean {
  const normalizedRule = ruleDescription.toLowerCase();
  const normalizedInput = inputKey.toLowerCase();
  return (
    normalizedRule.includes(normalizedInput) ||
    normalizedInput.split(/(?=[A-Z])/).some((segment) => {
      const token = segment.toLowerCase();
      return token.length > 2 && normalizedRule.includes(token);
    })
  );
}

function buildInputConstraints(
  contract: FormulaContract,
  inputKey: string,
): VariableConstraint | undefined {
  const dimensionalRules = contract.validationRules.filter((rule) => rule.kind === "dimensional");
  const edgeRules = contract.validationRules.filter((rule) => rule.kind === "edge");
  const normalized = inputKey.toLowerCase();

  const draft: { nonNegative?: boolean; min?: number; max?: number } = {};
  for (const rule of edgeRules) {
    if (!ruleAppliesToInput(rule.description, inputKey)) {
      continue;
    }
    if (rule.description.toLowerCase().includes("non-negative")) {
      draft.nonNegative = true;
    }
    if (rule.description.includes("≥ 1") || rule.description.includes("> 0")) {
      draft.min = rule.description.includes("≥ 1") ? 1 : 0;
    }
  }
  for (const rule of dimensionalRules) {
    if (!ruleAppliesToInput(rule.description, inputKey)) {
      continue;
    }
    if (rule.description.includes("0–100") || rule.description.includes("percent")) {
      draft.max = 100;
      draft.min = 0;
    }
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

export function normalizeContractInputsToVariables(
  contract: FormulaContract,
  primaryTarget: string,
): { readonly variables: readonly OntologyVariableDraft[]; readonly warnings: readonly string[] } {
  const warnings: string[] = [];
  const inputIds = Array.from(new Set([...contract.requiredInputs, ...contract.criticalInputs]));

  const variables = inputIds.map((inputKey) => {
    const id = normalizeContractVariableKey(inputKey);
    const role = inferVariableRoleFromContractField(id, "input");
    const dimensionMeta = inferVariableDimensionFromContractField(id);
    const knowledgeLevel = inferVariableKnowledgeLevelFromContractField(id, contract, "input", role);
    const isCritical = contract.criticalInputs.includes(inputKey);

    if (dimensionMeta.ambiguous) {
      warnings.push(`Input "${id}" has ambiguous dimension (currency vs percent) — manual review required.`);
    } else if (dimensionMeta.inferred && dimensionMeta.dimension === "dimensionless") {
      warnings.push(`Input "${id}" has no inferred unit/dimension — manual ontology review required.`);
    }

    return {
      id,
      label: humanizeKey(id),
      role,
      dimension: dimensionMeta.dimension,
      unit: dimensionMeta.unit,
      knowledgeLevel,
      requiredForOutputs: [primaryTarget],
      description: `Contract ${isCritical ? "critical" : "required"} input for ${contract.toolName}.`,
      missingRisk: isCritical ? "high" : "medium",
      constraints: buildInputConstraints(contract, id),
      dimensionInferred: dimensionMeta.inferred,
    } satisfies OntologyVariableDraft;
  });

  return { variables, warnings };
}

export function normalizeContractOutputsToVariables(
  contract: FormulaContract,
  primaryTarget: string,
): { readonly variables: readonly OntologyVariableDraft[]; readonly warnings: readonly string[] } {
  const warnings: string[] = [];
  const variables: OntologyVariableDraft[] = [];

  for (const output of contract.outputs) {
    const id = normalizeContractVariableKey(output);
    const role = inferVariableRoleFromContractField(id, "output");

    if (role === "constant") {
      continue;
    }

    const dimensionMeta = inferVariableDimensionFromContractField(id);
    if (role === "target" && dimensionMeta.dimension === "dimensionless") {
      warnings.push(`Output "${id}" was classified as target but has no numeric dimension.`);
    }

    variables.push({
      id,
      label: humanizeKey(id),
      role,
      dimension:
        role === "target" || dimensionMeta.dimension === "currency"
          ? inferOutputDimension(id, role)
          : dimensionMeta.dimension,
      unit:
        role === "target" || inferOutputDimension(id, role) === "currency" ? "USD" : dimensionMeta.unit,
      knowledgeLevel: "system_derived",
      requiredForOutputs: [primaryTarget],
      description: `Contract output mapped as ${role} variable.`,
      missingRisk: role === "target" ? "high" : "low",
      dimensionInferred: true,
    });
  }

  return { variables, warnings };
}

function inferOutputDimension(outputId: string, role: VariableRole): VariableDimension {
  const normalized = outputId.toLowerCase();
  if (role === "constant" || matchesPattern(normalized, VERDICT_OUTPUT_PATTERNS)) {
    return "dimensionless";
  }
  if (normalized.includes("margin") && !normalized.includes("price")) {
    return "percent";
  }
  return "currency";
}

export function resolveContractTargetOutput(outputs: readonly string[]): string | undefined {
  return outputs.find((output) => {
    const normalized = output.toLowerCase();
    return (
      matchesPattern(normalized, TARGET_OUTPUT_PATTERNS) ||
      normalized.includes("safeprice") ||
      normalized.includes("recommendedprice")
    );
  });
}

export function isVerdictOutput(output: string): boolean {
  return inferVariableRoleFromContractField(output, "output") === "constant";
}
