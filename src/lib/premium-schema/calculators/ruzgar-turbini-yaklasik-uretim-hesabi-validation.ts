export type RuzgarTurbiniYaklasikUretimHesabiInputs = {
  averageWindSpeed: number;
  weibullShapeParameter: number;
  rotorDiameter: number;
  ratedPower: number;
  airDensity: number;
  availabilityFactor: number;
};

export type RuzgarTurbiniYaklasikUretimHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const RUZGAR_TURBINI_YAKLASIK_URETIM_HESABI_INPUT_KEYS: readonly (keyof RuzgarTurbiniYaklasikUretimHesabiInputs)[] = [
  "averageWindSpeed",
  "weibullShapeParameter",
  "rotorDiameter",
  "ratedPower",
  "airDensity",
  "availabilityFactor",
];

const INPUT_LABELS: Record<keyof RuzgarTurbiniYaklasikUretimHesabiInputs, string> = {
  averageWindSpeed: "averageWindSpeed",
  weibullShapeParameter: "weibullShapeParameter",
  rotorDiameter: "rotorDiameter",
  ratedPower: "ratedPower",
  airDensity: "airDensity",
  availabilityFactor: "availabilityFactor",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: RuzgarTurbiniYaklasikUretimHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of RUZGAR_TURBINI_YAKLASIK_URETIM_HESABI_INPUT_KEYS) {
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

  if (inputs.averageWindSpeed < 0 || inputs.averageWindSpeed > 40) {
    errors.push("averageWindSpeed must be between 0 and 40.");
  }

  if (inputs.weibullShapeParameter < 1 || inputs.weibullShapeParameter > 4) {
    errors.push("weibullShapeParameter must be between 1 and 4.");
  }

  if (inputs.weibullShapeParameter <= 0) {
    errors.push("weibullShapeParameter must be greater than zero.");
  }

  if (inputs.rotorDiameter < 1 || inputs.rotorDiameter > 200) {
    errors.push("rotorDiameter must be between 1 and 200.");
  }

  if (inputs.rotorDiameter <= 0) {
    errors.push("rotorDiameter must be greater than zero.");
  }

  if (inputs.ratedPower < 1 || inputs.ratedPower > 20000) {
    errors.push("ratedPower must be between 1 and 20000.");
  }

  if (inputs.ratedPower <= 0) {
    errors.push("ratedPower must be greater than zero.");
  }

  if (inputs.airDensity < 0.9 || inputs.airDensity > 1.4) {
    errors.push("airDensity must be between 0.9 and 1.4.");
  }

  if (inputs.airDensity <= 0) {
    errors.push("airDensity must be greater than zero.");
  }

  if (inputs.availabilityFactor < 0 || inputs.availabilityFactor > 100) {
    errors.push("availabilityFactor must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: RuzgarTurbiniYaklasikUretimHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateRuzgarTurbiniYaklasikUretimHesabiInputs(inputs: RuzgarTurbiniYaklasikUretimHesabiInputs): RuzgarTurbiniYaklasikUretimHesabiValidationResult {
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
