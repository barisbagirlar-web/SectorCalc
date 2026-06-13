export type ShopRateHourlyCostCalculatorInputs = {
  fixedMonthlyCost: number;
  monthlyMachineHours: number;
  variableCostPerHour: number;
};

export type ShopRateHourlyCostCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const SHOP_RATE_HOURLY_COST_CALCULATOR_INPUT_KEYS: readonly (keyof ShopRateHourlyCostCalculatorInputs)[] = [
  "fixedMonthlyCost",
  "monthlyMachineHours",
  "variableCostPerHour",
];

const INPUT_LABELS: Record<keyof ShopRateHourlyCostCalculatorInputs, string> = {
  fixedMonthlyCost: "fixedMonthlyCost",
  monthlyMachineHours: "monthlyMachineHours",
  variableCostPerHour: "variableCostPerHour",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: ShopRateHourlyCostCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of SHOP_RATE_HOURLY_COST_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.fixedMonthlyCost < 0) {
    errors.push("fixedMonthlyCost must be greater than or equal to zero.");
  }

  if (inputs.monthlyMachineHours < 0) {
    errors.push("monthlyMachineHours must be greater than or equal to zero.");
  }

  if (inputs.monthlyMachineHours <= 0) {
    errors.push("monthlyMachineHours must be greater than zero.");
  }

  if (inputs.variableCostPerHour < 0) {
    errors.push("variableCostPerHour must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: ShopRateHourlyCostCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateShopRateHourlyCostCalculatorInputs(inputs: ShopRateHourlyCostCalculatorInputs): ShopRateHourlyCostCalculatorValidationResult {
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
