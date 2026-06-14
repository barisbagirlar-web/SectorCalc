export type ChangeOrderImpactAnalyzerInputs = {
  dailySiteCost: number;
  delayDays: number;
  laborBudget: number;
  laborOverrunPercent: number;
  materialBudget: number;
  materialOverrunPercent: number;
};

export type ChangeOrderImpactAnalyzerValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const CHANGE_ORDER_IMPACT_ANALYZER_INPUT_KEYS: readonly (keyof ChangeOrderImpactAnalyzerInputs)[] = [
  "dailySiteCost",
  "delayDays",
  "laborBudget",
  "laborOverrunPercent",
  "materialBudget",
  "materialOverrunPercent",
];

const INPUT_LABELS: Record<keyof ChangeOrderImpactAnalyzerInputs, string> = {
  dailySiteCost: "dailySiteCost",
  delayDays: "delayDays",
  laborBudget: "laborBudget",
  laborOverrunPercent: "laborOverrunPercent",
  materialBudget: "materialBudget",
  materialOverrunPercent: "materialOverrunPercent",
};

const summaryRule = {
  fieldId: "delayDays",
  warning: 3,
  critical: 10,
  direction: "higher_is_bad",
} as const;

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

  if (errors.length > 0) {
    return errors;
  }

  if (inputs.dailySiteCost < 0) {
    errors.push("dailySiteCost must be greater than or equal to zero.");
  }

  if (inputs.delayDays < 0) {
    errors.push("delayDays must be greater than or equal to zero.");
  }

  if (inputs.delayDays <= 0) {
    errors.push("delayDays must be greater than zero.");
  }

  if (inputs.laborBudget < 0) {
    errors.push("laborBudget must be greater than or equal to zero.");
  }

  if (inputs.laborBudget <= 0) {
    errors.push("laborBudget must be greater than zero.");
  }

  if (inputs.laborOverrunPercent < 0 || inputs.laborOverrunPercent > 100) {
    errors.push("laborOverrunPercent must be between 0 and 100.");
  }

  if (inputs.materialBudget < 0) {
    errors.push("materialBudget must be greater than or equal to zero.");
  }

  if (inputs.materialBudget <= 0) {
    errors.push("materialBudget must be greater than zero.");
  }

  if (inputs.materialOverrunPercent < 0 || inputs.materialOverrunPercent > 100) {
    errors.push("materialOverrunPercent must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: ChangeOrderImpactAnalyzerInputs): string[] {
  const warnings: string[] = [];

  if (inputs.delayDays >= summaryRule.warning) {
    warnings.push("Schedule slip is building — delay cost may erase contingency before closeout.");
  }

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
