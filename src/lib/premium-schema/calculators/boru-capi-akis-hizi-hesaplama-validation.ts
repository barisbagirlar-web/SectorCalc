export type BoruCapiAkisHiziHesaplamaInputs = {
  pipeInnerDiameter: number;
  flowVelocity: number;
  fluidDensity: number;
  dynamicViscosity: number;
};

export type BoruCapiAkisHiziHesaplamaValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const BORU_CAPI_AKIS_HIZI_HESAPLAMA_INPUT_KEYS: readonly (keyof BoruCapiAkisHiziHesaplamaInputs)[] = [
  "pipeInnerDiameter",
  "flowVelocity",
  "fluidDensity",
  "dynamicViscosity",
];

const INPUT_LABELS: Record<keyof BoruCapiAkisHiziHesaplamaInputs, string> = {
  pipeInnerDiameter: "pipeInnerDiameter",
  flowVelocity: "flowVelocity",
  fluidDensity: "fluidDensity",
  dynamicViscosity: "dynamicViscosity",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: BoruCapiAkisHiziHesaplamaInputs): string[] {
  const errors: string[] = [];

  for (const key of BORU_CAPI_AKIS_HIZI_HESAPLAMA_INPUT_KEYS) {
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

  if (inputs.pipeInnerDiameter < 1 || inputs.pipeInnerDiameter > 5000) {
    errors.push("pipeInnerDiameter must be between 1 and 5000.");
  }

  if (inputs.pipeInnerDiameter <= 0) {
    errors.push("pipeInnerDiameter must be greater than zero.");
  }

  if (inputs.flowVelocity < 0 || inputs.flowVelocity > 50) {
    errors.push("flowVelocity must be between 0 and 50.");
  }

  if (inputs.fluidDensity < 0.1 || inputs.fluidDensity > 20000) {
    errors.push("fluidDensity must be between 0.1 and 20000.");
  }

  if (inputs.fluidDensity <= 0) {
    errors.push("fluidDensity must be greater than zero.");
  }

  if (inputs.dynamicViscosity < 0.000001 || inputs.dynamicViscosity > 100) {
    errors.push("dynamicViscosity must be between 0.000001 and 100.");
  }

  if (inputs.dynamicViscosity <= 0) {
    errors.push("dynamicViscosity must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: BoruCapiAkisHiziHesaplamaInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateBoruCapiAkisHiziHesaplamaInputs(inputs: BoruCapiAkisHiziHesaplamaInputs): BoruCapiAkisHiziHesaplamaValidationResult {
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
