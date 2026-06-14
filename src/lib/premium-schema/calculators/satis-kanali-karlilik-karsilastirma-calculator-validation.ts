export type SatisKanaliKarlilikKarsilastirmaCalculatorInputs = {
  channelName: number;
  unitPrice: number;
  quantitySold: number;
  discountPercent: number;
  returnsPercent: number;
  unitCost: number;
};

export type SatisKanaliKarlilikKarsilastirmaCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const SATIS_KANALI_KARLILIK_KARSILASTIRMA_CALCULATOR_INPUT_KEYS: readonly (keyof SatisKanaliKarlilikKarsilastirmaCalculatorInputs)[] = [
  "channelName",
  "unitPrice",
  "quantitySold",
  "discountPercent",
  "returnsPercent",
  "unitCost",
];

const INPUT_LABELS: Record<keyof SatisKanaliKarlilikKarsilastirmaCalculatorInputs, string> = {
  channelName: "channelName",
  unitPrice: "unitPrice",
  quantitySold: "quantitySold",
  discountPercent: "discountPercent",
  returnsPercent: "returnsPercent",
  unitCost: "unitCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: SatisKanaliKarlilikKarsilastirmaCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of SATIS_KANALI_KARLILIK_KARSILASTIRMA_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.channelName < 0) {
    errors.push("channelName must be greater than or equal to zero.");
  }

  if (inputs.unitPrice < 0 || inputs.unitPrice > 1000000) {
    errors.push("unitPrice must be between 0 and 1000000.");
  }

  if (inputs.quantitySold < 1 || inputs.quantitySold > 10000000) {
    errors.push("quantitySold must be between 1 and 10000000.");
  }

  if (inputs.quantitySold <= 0) {
    errors.push("quantitySold must be greater than zero.");
  }

  if (inputs.discountPercent < 0 || inputs.discountPercent > 100) {
    errors.push("discountPercent must be between 0 and 100.");
  }

  if (inputs.returnsPercent < 0 || inputs.returnsPercent > 100) {
    errors.push("returnsPercent must be between 0 and 100.");
  }

  if (inputs.unitCost < 0 || inputs.unitCost > 1000000) {
    errors.push("unitCost must be between 0 and 1000000.");
  }

  return errors;
}

function collectWarnings(inputs: SatisKanaliKarlilikKarsilastirmaCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateSatisKanaliKarlilikKarsilastirmaCalculatorInputs(inputs: SatisKanaliKarlilikKarsilastirmaCalculatorInputs): SatisKanaliKarlilikKarsilastirmaCalculatorValidationResult {
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
