export type InventoryCarryingCostEoqCalculatorInputs = {
  annualDemand: number;
  orderCost: number;
  unitCost: number;
  carryingCostPercent: number;
};

export type InventoryCarryingCostEoqCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const INVENTORY_CARRYING_COST_EOQ_CALCULATOR_INPUT_KEYS: readonly (keyof InventoryCarryingCostEoqCalculatorInputs)[] = [
  "annualDemand",
  "orderCost",
  "unitCost",
  "carryingCostPercent",
];

const INPUT_LABELS: Record<keyof InventoryCarryingCostEoqCalculatorInputs, string> = {
  annualDemand: "annualDemand",
  orderCost: "orderCost",
  unitCost: "unitCost",
  carryingCostPercent: "carryingCostPercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: InventoryCarryingCostEoqCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of INVENTORY_CARRYING_COST_EOQ_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.annualDemand < 0) {
    errors.push("annualDemand must be greater than or equal to zero.");
  }

  if (inputs.annualDemand <= 0) {
    errors.push("annualDemand must be greater than zero.");
  }

  if (inputs.orderCost < 0) {
    errors.push("orderCost must be greater than or equal to zero.");
  }

  if (inputs.unitCost < 0) {
    errors.push("unitCost must be greater than or equal to zero.");
  }

  if (inputs.unitCost <= 0) {
    errors.push("unitCost must be greater than zero.");
  }

  if (inputs.carryingCostPercent < 0 || inputs.carryingCostPercent > 100) {
    errors.push("carryingCostPercent must be between 0 and 100.");
  }

  if (inputs.carryingCostPercent <= 0) {
    errors.push("carryingCostPercent must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: InventoryCarryingCostEoqCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateInventoryCarryingCostEoqCalculatorInputs(inputs: InventoryCarryingCostEoqCalculatorInputs): InventoryCarryingCostEoqCalculatorValidationResult {
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
