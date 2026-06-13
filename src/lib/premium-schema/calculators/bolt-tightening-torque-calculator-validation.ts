export type BoltTighteningTorqueCalculatorInputs = {
  clampForceKn: number;
  boltDiameterMm: number;
  frictionFactor: number;
};

export type BoltTighteningTorqueCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const BOLT_TIGHTENING_TORQUE_CALCULATOR_INPUT_KEYS: readonly (keyof BoltTighteningTorqueCalculatorInputs)[] = [
  "clampForceKn",
  "boltDiameterMm",
  "frictionFactor",
];

const INPUT_LABELS: Record<keyof BoltTighteningTorqueCalculatorInputs, string> = {
  clampForceKn: "clampForceKn",
  boltDiameterMm: "boltDiameterMm",
  frictionFactor: "frictionFactor",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: BoltTighteningTorqueCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of BOLT_TIGHTENING_TORQUE_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.clampForceKn < 0) {
    errors.push("clampForceKn must be greater than or equal to zero.");
  }

  if (inputs.clampForceKn <= 0) {
    errors.push("clampForceKn must be greater than zero.");
  }

  if (inputs.boltDiameterMm < 0) {
    errors.push("boltDiameterMm must be greater than or equal to zero.");
  }

  if (inputs.boltDiameterMm <= 0) {
    errors.push("boltDiameterMm must be greater than zero.");
  }

  if (inputs.frictionFactor < 0.05 || inputs.frictionFactor > 1) {
    errors.push("frictionFactor must be between 0.05 and 1.");
  }

  if (inputs.frictionFactor <= 0) {
    errors.push("frictionFactor must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: BoltTighteningTorqueCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateBoltTighteningTorqueCalculatorInputs(inputs: BoltTighteningTorqueCalculatorInputs): BoltTighteningTorqueCalculatorValidationResult {
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
