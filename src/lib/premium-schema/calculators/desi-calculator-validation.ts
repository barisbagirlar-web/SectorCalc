export type DesiCalculatorInputs = {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  routeType: number;
};

export type DesiCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const DESI_CALCULATOR_INPUT_KEYS: readonly (keyof DesiCalculatorInputs)[] = [
  "lengthCm",
  "widthCm",
  "heightCm",
  "routeType",
];

const INPUT_LABELS: Record<keyof DesiCalculatorInputs, string> = {
  lengthCm: "lengthCm",
  widthCm: "widthCm",
  heightCm: "heightCm",
  routeType: "routeType",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: DesiCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of DESI_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.lengthCm < 0.1 || inputs.lengthCm > 1000) {
    errors.push("lengthCm must be between 0.1 and 1000.");
  }

  if (inputs.lengthCm <= 0) {
    errors.push("lengthCm must be greater than zero.");
  }

  if (inputs.widthCm < 0.1 || inputs.widthCm > 1000) {
    errors.push("widthCm must be between 0.1 and 1000.");
  }

  if (inputs.widthCm <= 0) {
    errors.push("widthCm must be greater than zero.");
  }

  if (inputs.heightCm < 0.1 || inputs.heightCm > 1000) {
    errors.push("heightCm must be between 0.1 and 1000.");
  }

  if (inputs.heightCm <= 0) {
    errors.push("heightCm must be greater than zero.");
  }

  if (inputs.routeType < 0) {
    errors.push("routeType must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: DesiCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateDesiCalculatorInputs(inputs: DesiCalculatorInputs): DesiCalculatorValidationResult {
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
