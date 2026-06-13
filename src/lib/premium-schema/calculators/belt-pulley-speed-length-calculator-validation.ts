export type BeltPulleySpeedLengthCalculatorInputs = {
  driverRpm: number;
  driverDiameterMm: number;
  drivenDiameterMm: number;
  centerDistanceMm: number;
};

export type BeltPulleySpeedLengthCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const BELT_PULLEY_SPEED_LENGTH_CALCULATOR_INPUT_KEYS: readonly (keyof BeltPulleySpeedLengthCalculatorInputs)[] = [
  "driverRpm",
  "driverDiameterMm",
  "drivenDiameterMm",
  "centerDistanceMm",
];

const INPUT_LABELS: Record<keyof BeltPulleySpeedLengthCalculatorInputs, string> = {
  driverRpm: "driverRpm",
  driverDiameterMm: "driverDiameterMm",
  drivenDiameterMm: "drivenDiameterMm",
  centerDistanceMm: "centerDistanceMm",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: BeltPulleySpeedLengthCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of BELT_PULLEY_SPEED_LENGTH_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.driverRpm < 0) {
    errors.push("driverRpm must be greater than or equal to zero.");
  }

  if (inputs.driverRpm <= 0) {
    errors.push("driverRpm must be greater than zero.");
  }

  if (inputs.driverDiameterMm < 0) {
    errors.push("driverDiameterMm must be greater than or equal to zero.");
  }

  if (inputs.driverDiameterMm <= 0) {
    errors.push("driverDiameterMm must be greater than zero.");
  }

  if (inputs.drivenDiameterMm < 0) {
    errors.push("drivenDiameterMm must be greater than or equal to zero.");
  }

  if (inputs.drivenDiameterMm <= 0) {
    errors.push("drivenDiameterMm must be greater than zero.");
  }

  if (inputs.centerDistanceMm < 0) {
    errors.push("centerDistanceMm must be greater than or equal to zero.");
  }

  if (inputs.centerDistanceMm <= 0) {
    errors.push("centerDistanceMm must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: BeltPulleySpeedLengthCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateBeltPulleySpeedLengthCalculatorInputs(inputs: BeltPulleySpeedLengthCalculatorInputs): BeltPulleySpeedLengthCalculatorValidationResult {
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
