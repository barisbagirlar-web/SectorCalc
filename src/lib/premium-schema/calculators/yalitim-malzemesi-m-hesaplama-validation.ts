export type YalitimMalzemesiMHesaplamaInputs = {
  length: number;
  width: number;
  wasteRatePercent: number;
  unitCostPerSqm: number;
  laborRatePerSqm: number;
};

export type YalitimMalzemesiMHesaplamaValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const YALITIM_MALZEMESI_M_HESAPLAMA_INPUT_KEYS: readonly (keyof YalitimMalzemesiMHesaplamaInputs)[] = [
  "length",
  "width",
  "wasteRatePercent",
  "unitCostPerSqm",
  "laborRatePerSqm",
];

const INPUT_LABELS: Record<keyof YalitimMalzemesiMHesaplamaInputs, string> = {
  length: "length",
  width: "width",
  wasteRatePercent: "wasteRatePercent",
  unitCostPerSqm: "unitCostPerSqm",
  laborRatePerSqm: "laborRatePerSqm",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: YalitimMalzemesiMHesaplamaInputs): string[] {
  const errors: string[] = [];

  for (const key of YALITIM_MALZEMESI_M_HESAPLAMA_INPUT_KEYS) {
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

  if (inputs.length < 0.01 || inputs.length > 1000) {
    errors.push("length must be between 0.01 and 1000.");
  }

  if (inputs.length <= 0) {
    errors.push("length must be greater than zero.");
  }

  if (inputs.width < 0.01 || inputs.width > 1000) {
    errors.push("width must be between 0.01 and 1000.");
  }

  if (inputs.width <= 0) {
    errors.push("width must be greater than zero.");
  }

  if (inputs.wasteRatePercent < 0 || inputs.wasteRatePercent > 100) {
    errors.push("wasteRatePercent must be between 0 and 100.");
  }

  if (inputs.unitCostPerSqm < 0 || inputs.unitCostPerSqm > 1000) {
    errors.push("unitCostPerSqm must be between 0 and 1000.");
  }

  if (inputs.unitCostPerSqm <= 0) {
    errors.push("unitCostPerSqm must be greater than zero.");
  }

  if (inputs.laborRatePerSqm < 0 || inputs.laborRatePerSqm > 500) {
    errors.push("laborRatePerSqm must be between 0 and 500.");
  }

  if (inputs.laborRatePerSqm <= 0) {
    errors.push("laborRatePerSqm must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: YalitimMalzemesiMHesaplamaInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateYalitimMalzemesiMHesaplamaInputs(inputs: YalitimMalzemesiMHesaplamaInputs): YalitimMalzemesiMHesaplamaValidationResult {
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
