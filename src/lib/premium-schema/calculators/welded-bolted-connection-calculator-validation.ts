export type WeldedBoltedConnectionCalculatorInputs = {
  throatMm: number;
  weldLengthMm: number;
  allowableStressMpa: number;
  safetyFactor: number;
  boltDiameterMm: number;
  boltCount: number;
};

export type WeldedBoltedConnectionCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const WELDED_BOLTED_CONNECTION_CALCULATOR_INPUT_KEYS: readonly (keyof WeldedBoltedConnectionCalculatorInputs)[] = [
  "throatMm",
  "weldLengthMm",
  "allowableStressMpa",
  "safetyFactor",
  "boltDiameterMm",
  "boltCount",
];

const INPUT_LABELS: Record<keyof WeldedBoltedConnectionCalculatorInputs, string> = {
  throatMm: "throatMm",
  weldLengthMm: "weldLengthMm",
  allowableStressMpa: "allowableStressMpa",
  safetyFactor: "safetyFactor",
  boltDiameterMm: "boltDiameterMm",
  boltCount: "boltCount",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: WeldedBoltedConnectionCalculatorInputs): string[] {
  const errors: string[] = [];
  for (const key of WELDED_BOLTED_CONNECTION_CALCULATOR_INPUT_KEYS) {
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

function collectWarnings(inputs: WeldedBoltedConnectionCalculatorInputs): string[] {
  const warnings: string[] = [];
  return warnings;
}

export function validateWeldedBoltedConnectionCalculatorInputs(inputs: WeldedBoltedConnectionCalculatorInputs): WeldedBoltedConnectionCalculatorValidationResult {
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
