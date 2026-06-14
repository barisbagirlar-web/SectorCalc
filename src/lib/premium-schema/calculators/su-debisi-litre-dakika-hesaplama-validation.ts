export type SuDebisiLitreDakikaHesaplamaInputs = {
  pipeDiameter: number;
  flowVelocity: number;
  correctionFactor: number;
};

export type SuDebisiLitreDakikaHesaplamaValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const SU_DEBISI_LITRE_DAKIKA_HESAPLAMA_INPUT_KEYS: readonly (keyof SuDebisiLitreDakikaHesaplamaInputs)[] = [
  "pipeDiameter",
  "flowVelocity",
  "correctionFactor",
];

const INPUT_LABELS: Record<keyof SuDebisiLitreDakikaHesaplamaInputs, string> = {
  pipeDiameter: "pipeDiameter",
  flowVelocity: "flowVelocity",
  correctionFactor: "correctionFactor",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: SuDebisiLitreDakikaHesaplamaInputs): string[] {
  const errors: string[] = [];

  for (const key of SU_DEBISI_LITRE_DAKIKA_HESAPLAMA_INPUT_KEYS) {
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

  if (inputs.pipeDiameter < 0.001 || inputs.pipeDiameter > 10) {
    errors.push("pipeDiameter must be between 0.001 and 10.");
  }

  if (inputs.pipeDiameter <= 0) {
    errors.push("pipeDiameter must be greater than zero.");
  }

  if (inputs.flowVelocity < 0.01 || inputs.flowVelocity > 50) {
    errors.push("flowVelocity must be between 0.01 and 50.");
  }

  if (inputs.flowVelocity <= 0) {
    errors.push("flowVelocity must be greater than zero.");
  }

  if (inputs.correctionFactor < 0.8 || inputs.correctionFactor > 1.2) {
    errors.push("correctionFactor must be between 0.8 and 1.2.");
  }

  if (inputs.correctionFactor <= 0) {
    errors.push("correctionFactor must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: SuDebisiLitreDakikaHesaplamaInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateSuDebisiLitreDakikaHesaplamaInputs(inputs: SuDebisiLitreDakikaHesaplamaInputs): SuDebisiLitreDakikaHesaplamaValidationResult {
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
