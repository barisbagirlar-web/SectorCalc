export type AutoRepairComebackCostInputs = {
  monthlyRepairRevenue: number;
  comebackRatePercent: number;
  averageJobCost: number;
  diagnosticHours: number;
  laborRate: number;
  partsHandlingCost: number;
};

export type AutoRepairComebackCostValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const AUTO_REPAIR_COMEBACK_COST_INPUT_KEYS: readonly (keyof AutoRepairComebackCostInputs)[] = [
  "monthlyRepairRevenue",
  "comebackRatePercent",
  "averageJobCost",
  "diagnosticHours",
  "laborRate",
  "partsHandlingCost",
];

const INPUT_LABELS: Record<keyof AutoRepairComebackCostInputs, string> = {
  monthlyRepairRevenue: "monthlyRepairRevenue",
  comebackRatePercent: "comebackRatePercent",
  averageJobCost: "averageJobCost",
  diagnosticHours: "diagnosticHours",
  laborRate: "laborRate",
  partsHandlingCost: "partsHandlingCost",
};

const summaryRule = {
  fieldId: "comebackRatePercent",
  warning: 4,
  critical: 8,
  direction: "higher_is_bad",
} as const;

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: AutoRepairComebackCostInputs): string[] {
  const errors: string[] = [];

  for (const key of AUTO_REPAIR_COMEBACK_COST_INPUT_KEYS) {
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

  if (inputs.monthlyRepairRevenue < 0) {
    errors.push("monthlyRepairRevenue must be greater than or equal to zero.");
  }

  if (inputs.monthlyRepairRevenue <= 0) {
    errors.push("monthlyRepairRevenue must be greater than zero.");
  }

  if (inputs.comebackRatePercent < 0 || inputs.comebackRatePercent > 100) {
    errors.push("comebackRatePercent must be between 0 and 100.");
  }

  if (inputs.averageJobCost < 0) {
    errors.push("averageJobCost must be greater than or equal to zero.");
  }

  if (inputs.diagnosticHours < 0) {
    errors.push("diagnosticHours must be greater than or equal to zero.");
  }

  if (inputs.laborRate < 0) {
    errors.push("laborRate must be greater than or equal to zero.");
  }

  if (inputs.partsHandlingCost < 0) {
    errors.push("partsHandlingCost must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: AutoRepairComebackCostInputs): string[] {
  const warnings: string[] = [];

  if (inputs.comebackRatePercent >= summaryRule.warning) {
    warnings.push("Comeback rate is elevated — verify diagnostic and QC assumptions.");
  }

  return warnings;
}

export function validateAutoRepairComebackCostInputs(inputs: AutoRepairComebackCostInputs): AutoRepairComebackCostValidationResult {
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
