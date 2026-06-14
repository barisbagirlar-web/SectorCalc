export type AmperKilowattKwCeviriciInputs = {
  currentAmperes: number;
  voltageVolts: number;
  powerFactor: number;
  phaseType: number;
};

export type AmperKilowattKwCeviriciValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const AMPER_KILOWATT_KW_CEVIRICI_INPUT_KEYS: readonly (keyof AmperKilowattKwCeviriciInputs)[] = [
  "currentAmperes",
  "voltageVolts",
  "powerFactor",
  "phaseType",
];

const INPUT_LABELS: Record<keyof AmperKilowattKwCeviriciInputs, string> = {
  currentAmperes: "currentAmperes",
  voltageVolts: "voltageVolts",
  powerFactor: "powerFactor",
  phaseType: "phaseType",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: AmperKilowattKwCeviriciInputs): string[] {
  const errors: string[] = [];

  for (const key of AMPER_KILOWATT_KW_CEVIRICI_INPUT_KEYS) {
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

  if (inputs.currentAmperes < 0.001 || inputs.currentAmperes > 100000) {
    errors.push("currentAmperes must be between 0.001 and 100000.");
  }

  if (inputs.currentAmperes <= 0) {
    errors.push("currentAmperes must be greater than zero.");
  }

  if (inputs.voltageVolts < 0.1 || inputs.voltageVolts > 1000000) {
    errors.push("voltageVolts must be between 0.1 and 1000000.");
  }

  if (inputs.voltageVolts <= 0) {
    errors.push("voltageVolts must be greater than zero.");
  }

  if (inputs.powerFactor < 0.1 || inputs.powerFactor > 1) {
    errors.push("powerFactor must be between 0.1 and 1.");
  }

  if (inputs.powerFactor <= 0) {
    errors.push("powerFactor must be greater than zero.");
  }

  if (inputs.phaseType < 0) {
    errors.push("phaseType must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: AmperKilowattKwCeviriciInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateAmperKilowattKwCeviriciInputs(inputs: AmperKilowattKwCeviriciInputs): AmperKilowattKwCeviriciValidationResult {
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
