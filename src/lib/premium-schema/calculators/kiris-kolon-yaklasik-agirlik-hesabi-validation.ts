export type KirisKolonYaklasikAgirlikHesabiInputs = {
  elementWidth: number;
  elementDepth: number;
  elementLength: number;
  reinforcementRatioPercent: number;
};

export type KirisKolonYaklasikAgirlikHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const KIRIS_KOLON_YAKLASIK_AGIRLIK_HESABI_INPUT_KEYS: readonly (keyof KirisKolonYaklasikAgirlikHesabiInputs)[] = [
  "elementWidth",
  "elementDepth",
  "elementLength",
  "reinforcementRatioPercent",
];

const INPUT_LABELS: Record<keyof KirisKolonYaklasikAgirlikHesabiInputs, string> = {
  elementWidth: "elementWidth",
  elementDepth: "elementDepth",
  elementLength: "elementLength",
  reinforcementRatioPercent: "reinforcementRatioPercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: KirisKolonYaklasikAgirlikHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of KIRIS_KOLON_YAKLASIK_AGIRLIK_HESABI_INPUT_KEYS) {
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

  if (inputs.elementWidth < 0.1 || inputs.elementWidth > 5) {
    errors.push("elementWidth must be between 0.1 and 5.");
  }

  if (inputs.elementWidth <= 0) {
    errors.push("elementWidth must be greater than zero.");
  }

  if (inputs.elementDepth < 0.1 || inputs.elementDepth > 5) {
    errors.push("elementDepth must be between 0.1 and 5.");
  }

  if (inputs.elementDepth <= 0) {
    errors.push("elementDepth must be greater than zero.");
  }

  if (inputs.elementLength < 0.5 || inputs.elementLength > 20) {
    errors.push("elementLength must be between 0.5 and 20.");
  }

  if (inputs.elementLength <= 0) {
    errors.push("elementLength must be greater than zero.");
  }

  if (inputs.reinforcementRatioPercent < 0 || inputs.reinforcementRatioPercent > 100) {
    errors.push("reinforcementRatioPercent must be between 0 and 100.");
  }

  if (inputs.reinforcementRatioPercent <= 0) {
    errors.push("reinforcementRatioPercent must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: KirisKolonYaklasikAgirlikHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateKirisKolonYaklasikAgirlikHesabiInputs(inputs: KirisKolonYaklasikAgirlikHesabiInputs): KirisKolonYaklasikAgirlikHesabiValidationResult {
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
