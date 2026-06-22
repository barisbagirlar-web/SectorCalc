export type SixSigmaProjectPrioritizerInputs = {
  estimatedAnnualSavings: number;
  probabilityOfSuccess: number;
  projectDurationMonths: number;
  resourceCost: number;
};

export type SixSigmaProjectPrioritizerValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const SIX_SIGMA_PROJECT_PRIORITIZER_INPUT_KEYS: readonly (keyof SixSigmaProjectPrioritizerInputs)[] = [
  "estimatedAnnualSavings",
  "probabilityOfSuccess",
  "projectDurationMonths",
  "resourceCost",
];

const INPUT_LABELS: Record<keyof SixSigmaProjectPrioritizerInputs, string> = {
  estimatedAnnualSavings: "estimatedAnnualSavings",
  probabilityOfSuccess: "probabilityOfSuccess",
  projectDurationMonths: "projectDurationMonths",
  resourceCost: "resourceCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: SixSigmaProjectPrioritizerInputs): string[] {
  const errors: string[] = [];
  for (const key of SIX_SIGMA_PROJECT_PRIORITIZER_INPUT_KEYS) {
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

function collectWarnings(inputs: SixSigmaProjectPrioritizerInputs): string[] {
  const warnings: string[] = [];
  return warnings;
}

export function validateSixSigmaProjectPrioritizerInputs(inputs: SixSigmaProjectPrioritizerInputs): SixSigmaProjectPrioritizerValidationResult {
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
