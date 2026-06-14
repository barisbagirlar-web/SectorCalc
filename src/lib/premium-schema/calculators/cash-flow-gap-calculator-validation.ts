export type CashFlowGapCalculatorInputs = {
  totalSalesRevenue: number;
  accountsReceivableIncrease: number;
  totalOperatingCosts: number;
  inventoryIncrease: number;
  accountsPayableIncrease: number;
  daysPayableOutstanding: number;
};

export type CashFlowGapCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const CASH_FLOW_GAP_CALCULATOR_INPUT_KEYS: readonly (keyof CashFlowGapCalculatorInputs)[] = [
  "totalSalesRevenue",
  "accountsReceivableIncrease",
  "totalOperatingCosts",
  "inventoryIncrease",
  "accountsPayableIncrease",
  "daysPayableOutstanding",
];

const INPUT_LABELS: Record<keyof CashFlowGapCalculatorInputs, string> = {
  totalSalesRevenue: "totalSalesRevenue",
  accountsReceivableIncrease: "accountsReceivableIncrease",
  totalOperatingCosts: "totalOperatingCosts",
  inventoryIncrease: "inventoryIncrease",
  accountsPayableIncrease: "accountsPayableIncrease",
  daysPayableOutstanding: "daysPayableOutstanding",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: CashFlowGapCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of CASH_FLOW_GAP_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.totalSalesRevenue < 0 || inputs.totalSalesRevenue > 1000000000) {
    errors.push("totalSalesRevenue must be between 0 and 1000000000.");
  }

  if (inputs.totalSalesRevenue <= 0) {
    errors.push("totalSalesRevenue must be greater than zero.");
  }

  if (inputs.accountsReceivableIncrease < 0 || inputs.accountsReceivableIncrease > 1000000000) {
    errors.push("accountsReceivableIncrease must be between 0 and 1000000000.");
  }

  if (inputs.accountsReceivableIncrease <= 0) {
    errors.push("accountsReceivableIncrease must be greater than zero.");
  }

  if (inputs.totalOperatingCosts < 0 || inputs.totalOperatingCosts > 1000000000) {
    errors.push("totalOperatingCosts must be between 0 and 1000000000.");
  }

  if (inputs.inventoryIncrease < 0 || inputs.inventoryIncrease > 1000000000) {
    errors.push("inventoryIncrease must be between 0 and 1000000000.");
  }

  if (inputs.accountsPayableIncrease < 0 || inputs.accountsPayableIncrease > 1000000000) {
    errors.push("accountsPayableIncrease must be between 0 and 1000000000.");
  }

  if (inputs.accountsPayableIncrease <= 0) {
    errors.push("accountsPayableIncrease must be greater than zero.");
  }

  if (inputs.daysPayableOutstanding < 0 || inputs.daysPayableOutstanding > 365) {
    errors.push("daysPayableOutstanding must be between 0 and 365.");
  }

  if (inputs.daysPayableOutstanding <= 0) {
    errors.push("daysPayableOutstanding must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: CashFlowGapCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateCashFlowGapCalculatorInputs(inputs: CashFlowGapCalculatorInputs): CashFlowGapCalculatorValidationResult {
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
