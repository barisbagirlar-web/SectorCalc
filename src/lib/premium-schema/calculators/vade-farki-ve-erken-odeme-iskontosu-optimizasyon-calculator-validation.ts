export type VadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorInputs = {
  faturaTutari: number;
  vadeFarkiYuzde: number;
  erkenOdemeIskontoYuzde: number;
};

export type VadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const VADE_FARKI_VE_ERKEN_ODEME_ISKONTOSU_OPTIMIZASYON_CALCULATOR_INPUT_KEYS: readonly (keyof VadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorInputs)[] = [
  "faturaTutari",
  "vadeFarkiYuzde",
  "erkenOdemeIskontoYuzde",
];

const INPUT_LABELS: Record<keyof VadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorInputs, string> = {
  faturaTutari: "faturaTutari",
  vadeFarkiYuzde: "vadeFarkiYuzde",
  erkenOdemeIskontoYuzde: "erkenOdemeIskontoYuzde",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: VadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of VADE_FARKI_VE_ERKEN_ODEME_ISKONTOSU_OPTIMIZASYON_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.faturaTutari < 0.01 || inputs.faturaTutari > 1000000000) {
    errors.push("faturaTutari must be between 0.01 and 1000000000.");
  }

  if (inputs.faturaTutari <= 0) {
    errors.push("faturaTutari must be greater than zero.");
  }

  if (inputs.vadeFarkiYuzde < 0 || inputs.vadeFarkiYuzde > 100) {
    errors.push("vadeFarkiYuzde must be between 0 and 100.");
  }

  if (inputs.erkenOdemeIskontoYuzde < 0 || inputs.erkenOdemeIskontoYuzde > 100) {
    errors.push("erkenOdemeIskontoYuzde must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: VadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateVadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorInputs(inputs: VadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorInputs): VadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorValidationResult {
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
