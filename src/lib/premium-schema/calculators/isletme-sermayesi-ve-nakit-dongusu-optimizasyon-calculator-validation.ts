export type IsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorInputs = {
  averageInventory: number;
  costOfGoodsSold: number;
  averageAccountsReceivable: number;
  netCreditSales: number;
  averageAccountsPayable: number;
  targetCCC: number;
};

export type IsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ISLETME_SERMAYESI_VE_NAKIT_DONGUSU_OPTIMIZASYON_CALCULATOR_INPUT_KEYS: readonly (keyof IsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorInputs)[] = [
  "averageInventory",
  "costOfGoodsSold",
  "averageAccountsReceivable",
  "netCreditSales",
  "averageAccountsPayable",
  "targetCCC",
];

const INPUT_LABELS: Record<keyof IsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorInputs, string> = {
  averageInventory: "averageInventory",
  costOfGoodsSold: "costOfGoodsSold",
  averageAccountsReceivable: "averageAccountsReceivable",
  netCreditSales: "netCreditSales",
  averageAccountsPayable: "averageAccountsPayable",
  targetCCC: "targetCCC",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: IsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of ISLETME_SERMAYESI_VE_NAKIT_DONGUSU_OPTIMIZASYON_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.averageInventory < 0 || inputs.averageInventory > 1000000000) {
    errors.push("averageInventory must be between 0 and 1000000000.");
  }

  if (inputs.costOfGoodsSold < 1 || inputs.costOfGoodsSold > 10000000000) {
    errors.push("costOfGoodsSold must be between 1 and 10000000000.");
  }

  if (inputs.costOfGoodsSold <= 0) {
    errors.push("costOfGoodsSold must be greater than zero.");
  }

  if (inputs.averageAccountsReceivable < 0 || inputs.averageAccountsReceivable > 1000000000) {
    errors.push("averageAccountsReceivable must be between 0 and 1000000000.");
  }

  if (inputs.averageAccountsReceivable <= 0) {
    errors.push("averageAccountsReceivable must be greater than zero.");
  }

  if (inputs.netCreditSales < 1 || inputs.netCreditSales > 10000000000) {
    errors.push("netCreditSales must be between 1 and 10000000000.");
  }

  if (inputs.netCreditSales <= 0) {
    errors.push("netCreditSales must be greater than zero.");
  }

  if (inputs.averageAccountsPayable < 0 || inputs.averageAccountsPayable > 1000000000) {
    errors.push("averageAccountsPayable must be between 0 and 1000000000.");
  }

  if (inputs.averageAccountsPayable <= 0) {
    errors.push("averageAccountsPayable must be greater than zero.");
  }

  if (inputs.targetCCC < 0 || inputs.targetCCC > 365) {
    errors.push("targetCCC must be between 0 and 365.");
  }

  return errors;
}

function collectWarnings(inputs: IsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateIsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorInputs(inputs: IsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorInputs): IsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorValidationResult {
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
