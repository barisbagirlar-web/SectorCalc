export type TitresimFrekansPeriyotHesaplamaInputs = {
  periodSeconds: number;
  frequencyHz: number;
  displacementMeters: number;
  timeSeconds: number;
};

export type TitresimFrekansPeriyotHesaplamaValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const TITRESIM_FREKANS_PERIYOT_HESAPLAMA_INPUT_KEYS: readonly (keyof TitresimFrekansPeriyotHesaplamaInputs)[] = [
  "periodSeconds",
  "frequencyHz",
  "displacementMeters",
  "timeSeconds",
];

const INPUT_LABELS: Record<keyof TitresimFrekansPeriyotHesaplamaInputs, string> = {
  periodSeconds: "periodSeconds",
  frequencyHz: "frequencyHz",
  displacementMeters: "displacementMeters",
  timeSeconds: "timeSeconds",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: TitresimFrekansPeriyotHesaplamaInputs): string[] {
  const errors: string[] = [];

  for (const key of TITRESIM_FREKANS_PERIYOT_HESAPLAMA_INPUT_KEYS) {
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

  if (inputs.periodSeconds < 0.0001 || inputs.periodSeconds > 100000) {
    errors.push("periodSeconds must be between 0.0001 and 100000.");
  }

  if (inputs.periodSeconds <= 0) {
    errors.push("periodSeconds must be greater than zero.");
  }

  if (inputs.frequencyHz < 0.0001 || inputs.frequencyHz > 100000) {
    errors.push("frequencyHz must be between 0.0001 and 100000.");
  }

  if (inputs.frequencyHz <= 0) {
    errors.push("frequencyHz must be greater than zero.");
  }

  if (inputs.displacementMeters < 0 || inputs.displacementMeters > 1000) {
    errors.push("displacementMeters must be between 0 and 1000.");
  }

  if (inputs.timeSeconds < 0 || inputs.timeSeconds > 100000) {
    errors.push("timeSeconds must be between 0 and 100000.");
  }

  return errors;
}

function collectWarnings(inputs: TitresimFrekansPeriyotHesaplamaInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateTitresimFrekansPeriyotHesaplamaInputs(inputs: TitresimFrekansPeriyotHesaplamaInputs): TitresimFrekansPeriyotHesaplamaValidationResult {
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
