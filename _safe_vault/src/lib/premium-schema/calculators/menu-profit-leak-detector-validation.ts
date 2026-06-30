export type MenuProfitLeakDetectorInputs = {
  menuPrice: number;
  ingredientCost: number;
  wasteRate: number;
  deliveryCommission: number;
  laborCostPerItem: number;
  targetMargin: number;
};

export type MenuProfitLeakDetectorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const MENU_PROFIT_LEAK_DETECTOR_INPUT_KEYS: readonly (keyof MenuProfitLeakDetectorInputs)[] = [
  "menuPrice",
  "ingredientCost",
  "wasteRate",
  "deliveryCommission",
  "laborCostPerItem",
  "targetMargin",
];

const INPUT_LABELS: Record<keyof MenuProfitLeakDetectorInputs, string> = {
  menuPrice: "menuPrice",
  ingredientCost: "ingredientCost",
  wasteRate: "wasteRate",
  deliveryCommission: "deliveryCommission",
  laborCostPerItem: "laborCostPerItem",
  targetMargin: "targetMargin",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: MenuProfitLeakDetectorInputs): string[] {
  const errors: string[] = [];
  for (const key of MENU_PROFIT_LEAK_DETECTOR_INPUT_KEYS) {
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

function collectWarnings(inputs: MenuProfitLeakDetectorInputs): string[] {
  const warnings: string[] = [];
  return warnings;
}

export function validateMenuProfitLeakDetectorInputs(inputs: MenuProfitLeakDetectorInputs): MenuProfitLeakDetectorValidationResult {
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
