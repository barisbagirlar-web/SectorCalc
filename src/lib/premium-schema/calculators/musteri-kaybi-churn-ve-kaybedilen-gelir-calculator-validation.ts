export type MusteriKaybiChurnVeKaybedilenGelirCalculatorInputs = {
  totalCustomersStart: number;
  customersLost: number;
  totalRecurringRevenue: number;
  variableCostRatio: number;
  averageCustomerLifespan: number;
};

export type MusteriKaybiChurnVeKaybedilenGelirCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const MUSTERI_KAYBI_CHURN_VE_KAYBEDILEN_GELIR_CALCULATOR_INPUT_KEYS: readonly (keyof MusteriKaybiChurnVeKaybedilenGelirCalculatorInputs)[] = [
  "totalCustomersStart",
  "customersLost",
  "totalRecurringRevenue",
  "variableCostRatio",
  "averageCustomerLifespan",
];

const INPUT_LABELS: Record<keyof MusteriKaybiChurnVeKaybedilenGelirCalculatorInputs, string> = {
  totalCustomersStart: "totalCustomersStart",
  customersLost: "customersLost",
  totalRecurringRevenue: "totalRecurringRevenue",
  variableCostRatio: "variableCostRatio",
  averageCustomerLifespan: "averageCustomerLifespan",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: MusteriKaybiChurnVeKaybedilenGelirCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of MUSTERI_KAYBI_CHURN_VE_KAYBEDILEN_GELIR_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.totalCustomersStart < 1 || inputs.totalCustomersStart > 10000000) {
    errors.push("totalCustomersStart must be between 1 and 10000000.");
  }

  if (inputs.totalCustomersStart <= 0) {
    errors.push("totalCustomersStart must be greater than zero.");
  }

  if (inputs.customersLost < 0 || inputs.customersLost > 10000000) {
    errors.push("customersLost must be between 0 and 10000000.");
  }

  if (inputs.totalRecurringRevenue < 0 || inputs.totalRecurringRevenue > 1000000000) {
    errors.push("totalRecurringRevenue must be between 0 and 1000000000.");
  }

  if (inputs.totalRecurringRevenue <= 0) {
    errors.push("totalRecurringRevenue must be greater than zero.");
  }

  if (inputs.variableCostRatio < 0 || inputs.variableCostRatio > 1) {
    errors.push("variableCostRatio must be between 0 and 1.");
  }

  if (inputs.averageCustomerLifespan < 1 || inputs.averageCustomerLifespan > 120) {
    errors.push("averageCustomerLifespan must be between 1 and 120.");
  }

  if (inputs.averageCustomerLifespan <= 0) {
    errors.push("averageCustomerLifespan must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: MusteriKaybiChurnVeKaybedilenGelirCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateMusteriKaybiChurnVeKaybedilenGelirCalculatorInputs(inputs: MusteriKaybiChurnVeKaybedilenGelirCalculatorInputs): MusteriKaybiChurnVeKaybedilenGelirCalculatorValidationResult {
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
