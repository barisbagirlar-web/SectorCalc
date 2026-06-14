export type CpkPpkHataMaliyetiPpmCalculatorInputs = {
  cpkValue: number;
  ppkValue: number;
  unitCost: number;
  productionVolume: number;
};

export type CpkPpkHataMaliyetiPpmCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const CPK_PPK_HATA_MALIYETI_PPM_CALCULATOR_INPUT_KEYS: readonly (keyof CpkPpkHataMaliyetiPpmCalculatorInputs)[] = [
  "cpkValue",
  "ppkValue",
  "unitCost",
  "productionVolume",
];

const INPUT_LABELS: Record<keyof CpkPpkHataMaliyetiPpmCalculatorInputs, string> = {
  cpkValue: "cpkValue",
  ppkValue: "ppkValue",
  unitCost: "unitCost",
  productionVolume: "productionVolume",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: CpkPpkHataMaliyetiPpmCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of CPK_PPK_HATA_MALIYETI_PPM_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.cpkValue < 0 || inputs.cpkValue > 3) {
    errors.push("cpkValue must be between 0 and 3.");
  }

  if (inputs.ppkValue < 0 || inputs.ppkValue > 3) {
    errors.push("ppkValue must be between 0 and 3.");
  }

  if (inputs.unitCost < 0 || inputs.unitCost > 100000) {
    errors.push("unitCost must be between 0 and 100000.");
  }

  if (inputs.productionVolume < 1 || inputs.productionVolume > 1000000000) {
    errors.push("productionVolume must be between 1 and 1000000000.");
  }

  if (inputs.productionVolume <= 0) {
    errors.push("productionVolume must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: CpkPpkHataMaliyetiPpmCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateCpkPpkHataMaliyetiPpmCalculatorInputs(inputs: CpkPpkHataMaliyetiPpmCalculatorInputs): CpkPpkHataMaliyetiPpmCalculatorValidationResult {
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
