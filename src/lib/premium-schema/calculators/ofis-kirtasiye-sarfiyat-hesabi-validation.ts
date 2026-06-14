export type OfisKirtasiyeSarfiyatHesabiInputs = {
  monthlyConsumption: number;
  unitPrice: number;
  wasteRate: number;
  overheadRate: number;
  employeeCount: number;
  monthlyBudget: number;
};

export type OfisKirtasiyeSarfiyatHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const OFIS_KIRTASIYE_SARFIYAT_HESABI_INPUT_KEYS: readonly (keyof OfisKirtasiyeSarfiyatHesabiInputs)[] = [
  "monthlyConsumption",
  "unitPrice",
  "wasteRate",
  "overheadRate",
  "employeeCount",
  "monthlyBudget",
];

const INPUT_LABELS: Record<keyof OfisKirtasiyeSarfiyatHesabiInputs, string> = {
  monthlyConsumption: "monthlyConsumption",
  unitPrice: "unitPrice",
  wasteRate: "wasteRate",
  overheadRate: "overheadRate",
  employeeCount: "employeeCount",
  monthlyBudget: "monthlyBudget",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: OfisKirtasiyeSarfiyatHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of OFIS_KIRTASIYE_SARFIYAT_HESABI_INPUT_KEYS) {
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

  if (inputs.monthlyConsumption < 1 || inputs.monthlyConsumption > 1000000) {
    errors.push("monthlyConsumption must be between 1 and 1000000.");
  }

  if (inputs.monthlyConsumption <= 0) {
    errors.push("monthlyConsumption must be greater than zero.");
  }

  if (inputs.unitPrice < 0.01 || inputs.unitPrice > 1000) {
    errors.push("unitPrice must be between 0.01 and 1000.");
  }

  if (inputs.unitPrice <= 0) {
    errors.push("unitPrice must be greater than zero.");
  }

  if (inputs.wasteRate < 0 || inputs.wasteRate > 100) {
    errors.push("wasteRate must be between 0 and 100.");
  }

  if (inputs.overheadRate < 0 || inputs.overheadRate > 100) {
    errors.push("overheadRate must be between 0 and 100.");
  }

  if (inputs.employeeCount < 1 || inputs.employeeCount > 100000) {
    errors.push("employeeCount must be between 1 and 100000.");
  }

  if (inputs.employeeCount <= 0) {
    errors.push("employeeCount must be greater than zero.");
  }

  if (inputs.monthlyBudget < 0 || inputs.monthlyBudget > 10000000) {
    errors.push("monthlyBudget must be between 0 and 10000000.");
  }

  if (inputs.monthlyBudget <= 0) {
    errors.push("monthlyBudget must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: OfisKirtasiyeSarfiyatHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateOfisKirtasiyeSarfiyatHesabiInputs(inputs: OfisKirtasiyeSarfiyatHesabiInputs): OfisKirtasiyeSarfiyatHesabiValidationResult {
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
