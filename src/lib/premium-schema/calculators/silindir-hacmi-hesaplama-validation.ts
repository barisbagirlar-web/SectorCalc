export type SilindirHacmiHesaplamaInputs = {
  diameter: number;
  height: number;
  outputUnit: number;
};

export type SilindirHacmiHesaplamaValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const SILINDIR_HACMI_HESAPLAMA_INPUT_KEYS: readonly (keyof SilindirHacmiHesaplamaInputs)[] = [
  "diameter",
  "height",
  "outputUnit",
];

const INPUT_LABELS: Record<keyof SilindirHacmiHesaplamaInputs, string> = {
  diameter: "diameter",
  height: "height",
  outputUnit: "outputUnit",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: SilindirHacmiHesaplamaInputs): string[] {
  const errors: string[] = [];

  for (const key of SILINDIR_HACMI_HESAPLAMA_INPUT_KEYS) {
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

  if (inputs.diameter < 0.1 || inputs.diameter > 10000) {
    errors.push("diameter must be between 0.1 and 10000.");
  }

  if (inputs.diameter <= 0) {
    errors.push("diameter must be greater than zero.");
  }

  if (inputs.height < 0.1 || inputs.height > 10000) {
    errors.push("height must be between 0.1 and 10000.");
  }

  if (inputs.height <= 0) {
    errors.push("height must be greater than zero.");
  }

  if (inputs.outputUnit < 0) {
    errors.push("outputUnit must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: SilindirHacmiHesaplamaInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateSilindirHacmiHesaplamaInputs(inputs: SilindirHacmiHesaplamaInputs): SilindirHacmiHesaplamaValidationResult {
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
