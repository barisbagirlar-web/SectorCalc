export type ChangeOrderImpactAnalyzerInputs = {
  originalBudget: number;
  changeEstimate: number;
  delayDays: number;
  crewCostPerDay: number;
  marginTarget: number;
};

export type ChangeOrderImpactAnalyzerValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const CHANGE_ORDER_IMPACT_ANALYZER_INPUT_KEYS: readonly (keyof ChangeOrderImpactAnalyzerInputs)[] = [
  "originalBudget",
  "changeEstimate",
  "delayDays",
  "crewCostPerDay",
  "marginTarget",
];

const INPUT_LABELS: Record<keyof ChangeOrderImpactAnalyzerInputs, string> = {
  originalBudget: "originalBudget",
  changeEstimate: "changeEstimate",
  delayDays: "delayDays",
  crewCostPerDay: "crewCostPerDay",
  marginTarget: "marginTarget",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: ChangeOrderImpactAnalyzerInputs): string[] {
  const errors: string[] = [];
  for (const key of CHANGE_ORDER_IMPACT_ANALYZER_INPUT_KEYS) {
    const value = inputs[key];
    if (value === undefined || value === null) {
      errors.push(`${INPUT_LABELS[key]} is required.`);
      continue;
    }
    if (!isValidNumber(value)) {
      errors.push(`${INPUT_LABELS[key]} must be a finite number.`);
    }
  }
  return errors;
}

function collectWarnings(inputs: ChangeOrderImpactAnalyzerInputs): string[] {
  const warnings: string[] = [];
  return warnings;
}

export function validateChangeOrderImpactAnalyzerInputs(inputs: ChangeOrderImpactAnalyzerInputs): ChangeOrderImpactAnalyzerValidationResult {
  const errors = collectInputErrors(inputs);
  if (errors.length > 0) {
    return { ok: false, errors, warnings: [] };
  }
  return {
    ok: true,
    errors: [],
    warnings: collectWarnings(inputs),
  };
}
