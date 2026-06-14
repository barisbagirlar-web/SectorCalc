export type HourlyRateCalculatorInputs = {
  baseHourlyWage: number;
  laborBurdenRate: number;
  totalMonthlyOverhead: number;
  totalMonthlyBillableHours: number;
  profitMarginPercent: number;
};

export type HourlyRateCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const HOURLY_RATE_CALCULATOR_INPUT_KEYS: readonly (keyof HourlyRateCalculatorInputs)[] = [
  "baseHourlyWage",
  "laborBurdenRate",
  "totalMonthlyOverhead",
  "totalMonthlyBillableHours",
  "profitMarginPercent",
];

const INPUT_LABELS: Record<keyof HourlyRateCalculatorInputs, string> = {
  baseHourlyWage: "baseHourlyWage",
  laborBurdenRate: "laborBurdenRate",
  totalMonthlyOverhead: "totalMonthlyOverhead",
  totalMonthlyBillableHours: "totalMonthlyBillableHours",
  profitMarginPercent: "profitMarginPercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: HourlyRateCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of HOURLY_RATE_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.baseHourlyWage < 0 || inputs.baseHourlyWage > 10000) {
    errors.push("baseHourlyWage must be between 0 and 10000.");
  }

  if (inputs.baseHourlyWage <= 0) {
    errors.push("baseHourlyWage must be greater than zero.");
  }

  if (inputs.laborBurdenRate < 0 || inputs.laborBurdenRate > 100) {
    errors.push("laborBurdenRate must be between 0 and 100.");
  }

  if (inputs.totalMonthlyOverhead < 0 || inputs.totalMonthlyOverhead > 10000000) {
    errors.push("totalMonthlyOverhead must be between 0 and 10000000.");
  }

  if (inputs.totalMonthlyBillableHours < 1 || inputs.totalMonthlyBillableHours > 100000) {
    errors.push("totalMonthlyBillableHours must be between 1 and 100000.");
  }

  if (inputs.totalMonthlyBillableHours <= 0) {
    errors.push("totalMonthlyBillableHours must be greater than zero.");
  }

  if (inputs.profitMarginPercent < 0 || inputs.profitMarginPercent > 100) {
    errors.push("profitMarginPercent must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: HourlyRateCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateHourlyRateCalculatorInputs(inputs: HourlyRateCalculatorInputs): HourlyRateCalculatorValidationResult {
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
