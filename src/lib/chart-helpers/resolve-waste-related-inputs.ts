import { normalizeWasteTypeKey } from "@/lib/chart-helpers";
import type { GeneratedToolInput } from "@/lib/generated-tools/types";

export type RelatedBreakdownInput = {
  readonly id: string;
  readonly label: string;
  readonly value: unknown;
};

function normalizeToken(value: string): string {
  return value.replace(/([A-Z])/g, (match) => match.toLowerCase()).replace(/[_\s-]+/g, "");
}

function inputMatchesBreakdownKey(inputId: string, breakdownKey: string): boolean {
  const wasteKey = normalizeWasteTypeKey(breakdownKey);
  const normalizedInputId = normalizeToken(inputId);
  const normalizedBreakdownKey = normalizeToken(breakdownKey);

  if (normalizedInputId.includes(wasteKey) || wasteKey.includes(normalizedInputId)) {
    return true;
  }

  return (
    normalizedInputId.includes(normalizedBreakdownKey) ||
    normalizedBreakdownKey.includes(normalizedInputId)
  );
}

export function resolveRelatedInputsForBreakdownKey(
  breakdownKey: string,
  inputs: readonly GeneratedToolInput[],
  values: Record<string, unknown>,
  resolveLabel: (input: GeneratedToolInput) => string,
): RelatedBreakdownInput[] {
  const matched = inputs.filter((input) => inputMatchesBreakdownKey(input.id, breakdownKey));

  const selectedInputs = matched.length > 0 ? matched : inputs;

  return selectedInputs.map((input) => ({
    id: input.id,
    label: resolveLabel(input),
    value: values[input.id],
  }));
}
