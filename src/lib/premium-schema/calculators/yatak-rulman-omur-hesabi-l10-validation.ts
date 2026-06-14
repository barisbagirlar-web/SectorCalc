export type YatakRulmanOmurHesabiL10Inputs = {
  dynamicLoadRatingC: number;
  equivalentDynamicLoadP: number;
  rotationalSpeedN: number;
  reliabilityFactorA1: number;
  materialFactorA2: number;
};

export type YatakRulmanOmurHesabiL10ValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const YATAK_RULMAN_OMUR_HESABI_L10_INPUT_KEYS: readonly (keyof YatakRulmanOmurHesabiL10Inputs)[] = [
  "dynamicLoadRatingC",
  "equivalentDynamicLoadP",
  "rotationalSpeedN",
  "reliabilityFactorA1",
  "materialFactorA2",
];

const INPUT_LABELS: Record<keyof YatakRulmanOmurHesabiL10Inputs, string> = {
  dynamicLoadRatingC: "dynamicLoadRatingC",
  equivalentDynamicLoadP: "equivalentDynamicLoadP",
  rotationalSpeedN: "rotationalSpeedN",
  reliabilityFactorA1: "reliabilityFactorA1",
  materialFactorA2: "materialFactorA2",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: YatakRulmanOmurHesabiL10Inputs): string[] {
  const errors: string[] = [];

  for (const key of YATAK_RULMAN_OMUR_HESABI_L10_INPUT_KEYS) {
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

  if (inputs.dynamicLoadRatingC < 1 || inputs.dynamicLoadRatingC > 10000000) {
    errors.push("dynamicLoadRatingC must be between 1 and 10000000.");
  }

  if (inputs.dynamicLoadRatingC <= 0) {
    errors.push("dynamicLoadRatingC must be greater than zero.");
  }

  if (inputs.equivalentDynamicLoadP < 1 || inputs.equivalentDynamicLoadP > 10000000) {
    errors.push("equivalentDynamicLoadP must be between 1 and 10000000.");
  }

  if (inputs.equivalentDynamicLoadP <= 0) {
    errors.push("equivalentDynamicLoadP must be greater than zero.");
  }

  if (inputs.rotationalSpeedN < 1 || inputs.rotationalSpeedN > 100000) {
    errors.push("rotationalSpeedN must be between 1 and 100000.");
  }

  if (inputs.rotationalSpeedN <= 0) {
    errors.push("rotationalSpeedN must be greater than zero.");
  }

  if (inputs.reliabilityFactorA1 < 0.1 || inputs.reliabilityFactorA1 > 1) {
    errors.push("reliabilityFactorA1 must be between 0.1 and 1.");
  }

  if (inputs.reliabilityFactorA1 <= 0) {
    errors.push("reliabilityFactorA1 must be greater than zero.");
  }

  if (inputs.materialFactorA2 < 0.1 || inputs.materialFactorA2 > 3) {
    errors.push("materialFactorA2 must be between 0.1 and 3.");
  }

  if (inputs.materialFactorA2 <= 0) {
    errors.push("materialFactorA2 must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: YatakRulmanOmurHesabiL10Inputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateYatakRulmanOmurHesabiL10Inputs(inputs: YatakRulmanOmurHesabiL10Inputs): YatakRulmanOmurHesabiL10ValidationResult {
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
