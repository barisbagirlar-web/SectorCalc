export type BoilerEfficiencyCalculatorInputs = {
  steamFlow: number;
  steamEnthalpy: number;
  feedwaterEnthalpy: number;
  fuelFlow: number;
  fuelHeatingValue: number;
  blowdownRate: number;
};

export type BoilerEfficiencyCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const BOILER_EFFICIENCY_CALCULATOR_INPUT_KEYS: readonly (keyof BoilerEfficiencyCalculatorInputs)[] = [
  "steamFlow",
  "steamEnthalpy",
  "feedwaterEnthalpy",
  "fuelFlow",
  "fuelHeatingValue",
  "blowdownRate",
];

const INPUT_LABELS: Record<keyof BoilerEfficiencyCalculatorInputs, string> = {
  steamFlow: "steamFlow",
  steamEnthalpy: "steamEnthalpy",
  feedwaterEnthalpy: "feedwaterEnthalpy",
  fuelFlow: "fuelFlow",
  fuelHeatingValue: "fuelHeatingValue",
  blowdownRate: "blowdownRate",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: BoilerEfficiencyCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of BOILER_EFFICIENCY_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.steamFlow < 0.1 || inputs.steamFlow > 1000000) {
    errors.push("steamFlow must be between 0.1 and 1000000.");
  }

  if (inputs.steamFlow <= 0) {
    errors.push("steamFlow must be greater than zero.");
  }

  if (inputs.steamEnthalpy < 100 || inputs.steamEnthalpy > 4000) {
    errors.push("steamEnthalpy must be between 100 and 4000.");
  }

  if (inputs.steamEnthalpy <= 0) {
    errors.push("steamEnthalpy must be greater than zero.");
  }

  if (inputs.feedwaterEnthalpy < 0 || inputs.feedwaterEnthalpy > 1000) {
    errors.push("feedwaterEnthalpy must be between 0 and 1000.");
  }

  if (inputs.fuelFlow < 0.1 || inputs.fuelFlow > 100000) {
    errors.push("fuelFlow must be between 0.1 and 100000.");
  }

  if (inputs.fuelFlow <= 0) {
    errors.push("fuelFlow must be greater than zero.");
  }

  if (inputs.fuelHeatingValue < 1000 || inputs.fuelHeatingValue > 50000) {
    errors.push("fuelHeatingValue must be between 1000 and 50000.");
  }

  if (inputs.fuelHeatingValue <= 0) {
    errors.push("fuelHeatingValue must be greater than zero.");
  }

  if (inputs.blowdownRate < 0 || inputs.blowdownRate > 100) {
    errors.push("blowdownRate must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: BoilerEfficiencyCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateBoilerEfficiencyCalculatorInputs(inputs: BoilerEfficiencyCalculatorInputs): BoilerEfficiencyCalculatorValidationResult {
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
