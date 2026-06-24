export type GurultuVeTitresimMaruziyetRiskMaliyetCalculatorInputs = {
  soundLevelDb: number;
  exposureDuration: number;
  hearingLossCost: number;
  efficiencyLossCost: number;
  errorRateCost: number;
  ppeCost: number;
};

export type GurultuVeTitresimMaruziyetRiskMaliyetCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const GURULTU_VE_TITRESIM_MARUZIYET_RISK_MALIYET_CALCULATOR_INPUT_KEYS: readonly (keyof GurultuVeTitresimMaruziyetRiskMaliyetCalculatorInputs)[] =
  ["soundLevelDb", "exposureDuration", "hearingLossCost", "efficiencyLossCost", "errorRateCost", "ppeCost"];

const INPUT_LABELS: Record<keyof GurultuVeTitresimMaruziyetRiskMaliyetCalculatorInputs, string> = {
  soundLevelDb: "soundLevelDb",
  exposureDuration: "exposureDuration",
  hearingLossCost: "hearingLossCost",
  efficiencyLossCost: "efficiencyLossCost",
  errorRateCost: "errorRateCost",
  ppeCost: "ppeCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: GurultuVeTitresimMaruziyetRiskMaliyetCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of GURULTU_VE_TITRESIM_MARUZIYET_RISK_MALIYET_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.soundLevelDb < 40 || inputs.soundLevelDb > 140) {
    errors.push("soundLevelDb must be between 40 and 140.");
  }
  if (inputs.exposureDuration < 0.1 || inputs.exposureDuration > 24) {
    errors.push("exposureDuration must be between 0.1 and 24.");
  }
  if (inputs.hearingLossCost < 0) {
    errors.push("hearingLossCost must be greater than or equal to zero.");
  }
  if (inputs.efficiencyLossCost < 0) {
    errors.push("efficiencyLossCost must be greater than or equal to zero.");
  }
  if (inputs.errorRateCost < 0) {
    errors.push("errorRateCost must be greater than or equal to zero.");
  }
  if (inputs.ppeCost < 0) {
    errors.push("ppeCost must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: GurultuVeTitresimMaruziyetRiskMaliyetCalculatorInputs): string[] {
  const warnings: string[] = [];
  const exposureIndex = inputs.soundLevelDb * inputs.exposureDuration;

  if (exposureIndex >= 680) {
    warnings.push(
      "Maruziyet seviyesi sınıra yakın. KKD kullanımı ve rotasyon önerilir.",
    );
  }

  return warnings;
}

export function validateGurultuVeTitresimMaruziyetRiskMaliyetCalculatorInputs(
  inputs: GurultuVeTitresimMaruziyetRiskMaliyetCalculatorInputs,
): GurultuVeTitresimMaruziyetRiskMaliyetCalculatorValidationResult {
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
