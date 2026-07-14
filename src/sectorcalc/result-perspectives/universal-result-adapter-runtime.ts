import type {
  DecisionStateCard,
  ResultPerspective,
  ServerOutput,
  SuperV4Schema,
  UniversalCalculationResult,
  UniversalResultCard,
} from "@/sectorcalc/pro-form/contract-types";
import {
  buildUniversalResult as buildProfileResult,
} from "./universal-result-adapter";

export * from "./universal-result-adapter";

function humanizeOutputId(id: string): string {
  return id
    .replace(/^out_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function isFiniteNumericOutput(output: ServerOutput): boolean {
  return typeof output.value === "number" && Number.isFinite(output.value);
}

function isDecisionOnlyOutput(output: ServerOutput): boolean {
  const id = output.id.toLowerCase();
  return id.includes("decision_state") || id.endsWith("_status") || id === "status";
}

function roundForDisplay(value: number): number {
  return Math.round(value * 100) / 100;
}

function resolvePrimaryOutput(
  schema: SuperV4Schema,
  outputs: ServerOutput[],
): ServerOutput | null {
  const numeric = outputs.filter(isFiniteNumericOutput).filter((output) => !isDecisionOnlyOutput(output));
  if (numeric.length === 0) return null;

  const declaredPrimary = schema.decision_context?.primary_metric;
  if (typeof declaredPrimary === "string") {
    const match = numeric.find((output) => output.id === declaredPrimary);
    if (match) return match;
  }

  const decisionUseMatch = numeric.find((output) =>
    output.decision_use.trim().toUpperCase() === "PRIMARY_DECISION",
  );
  return decisionUseMatch ?? numeric[0];
}

function buildVisibleFallback(
  schema: SuperV4Schema,
  outputs: ServerOutput[],
  profiled: UniversalCalculationResult | null,
): UniversalCalculationResult | null {
  const primaryOutput = resolvePrimaryOutput(schema, outputs);
  if (!primaryOutput) return profiled;

  const numeric = outputs
    .filter(isFiniteNumericOutput)
    .filter((output) => !isDecisionOnlyOutput(output));
  const cards: UniversalResultCard[] = numeric.map((output) => ({
    id: output.id,
    label: output.name && output.name !== "Result"
      ? output.name
      : humanizeOutputId(output.id),
    value: roundForDisplay(output.value as number),
    unit: output.unit ?? undefined,
    perspective: output.id === primaryOutput.id
      ? "primary"
      : ("cost_basis" as ResultPerspective),
    priority: output.id === primaryOutput.id ? 10 : 20,
    severity: output.status === "REVIEW" ? "warning" : "info",
  }));
  cards.sort((left, right) => left.priority - right.priority);

  const primary = cards.find((card) => card.id === primaryOutput.id) ?? cards[0];
  const decisionState: DecisionStateCard = {
    label: "Calculation completed. Review the displayed outputs before making the operating decision.",
    severity: outputs.some((output) => output.status === "REVIEW") ? "warning" : "pass",
    reason: `${primary.label}: ${String(primary.value)}${primary.unit ? ` ${primary.unit}` : ""}`,
  };

  return {
    primary,
    cards,
    decisionState,
    assumptions: profiled?.assumptions?.length
      ? profiled.assumptions
      : ["Calculation performed with the entered project values."],
    warnings: profiled?.warnings ?? [],
  };
}

/**
 * Builds the specialized category result first. When that profile does not
 * recognize a tool's governed output namespace, it falls back to finite server
 * outputs instead of returning an empty result panel. Formula execution remains
 * server-only and no arithmetic is repeated here.
 */
export function buildUniversalResult(
  schema: SuperV4Schema,
  rawInputs: Record<string, number> | Record<string, unknown>,
  outputs: ServerOutput[],
): UniversalCalculationResult | null {
  const profiled = buildProfileResult(schema, rawInputs, outputs);
  if (profiled && profiled.cards.length > 0 && profiled.primary.value !== "") {
    return profiled;
  }
  return buildVisibleFallback(schema, outputs, profiled);
}
