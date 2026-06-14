export type EnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorInputs = {
  partThickness: number;
  thermalDiffusivity: number;
  meltTemperature: number;
  moldTemperature: number;
  ejectionTemperature: number;
  moldCorrectionFactor: number;
};

export type EnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ENJEKSIYON_SOGUTMA_SURESI_VE_CEVRIM_OPTIMIZASYON_CALCULATOR_INPUT_KEYS: readonly (keyof EnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorInputs)[] = [
  "partThickness",
  "thermalDiffusivity",
  "meltTemperature",
  "moldTemperature",
  "ejectionTemperature",
  "moldCorrectionFactor",
];

const INPUT_LABELS: Record<keyof EnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorInputs, string> = {
  partThickness: "partThickness",
  thermalDiffusivity: "thermalDiffusivity",
  meltTemperature: "meltTemperature",
  moldTemperature: "moldTemperature",
  ejectionTemperature: "ejectionTemperature",
  moldCorrectionFactor: "moldCorrectionFactor",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: EnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of ENJEKSIYON_SOGUTMA_SURESI_VE_CEVRIM_OPTIMIZASYON_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.partThickness < 0.1 || inputs.partThickness > 100) {
    errors.push("partThickness must be between 0.1 and 100.");
  }

  if (inputs.partThickness <= 0) {
    errors.push("partThickness must be greater than zero.");
  }

  if (inputs.thermalDiffusivity < 0.01 || inputs.thermalDiffusivity > 100) {
    errors.push("thermalDiffusivity must be between 0.01 and 100.");
  }

  if (inputs.thermalDiffusivity <= 0) {
    errors.push("thermalDiffusivity must be greater than zero.");
  }

  if (inputs.meltTemperature < 100 || inputs.meltTemperature > 400) {
    errors.push("meltTemperature must be between 100 and 400.");
  }

  if (inputs.meltTemperature <= 0) {
    errors.push("meltTemperature must be greater than zero.");
  }

  if (inputs.moldTemperature < 10 || inputs.moldTemperature > 150) {
    errors.push("moldTemperature must be between 10 and 150.");
  }

  if (inputs.moldTemperature <= 0) {
    errors.push("moldTemperature must be greater than zero.");
  }

  if (inputs.ejectionTemperature < 20 || inputs.ejectionTemperature > 200) {
    errors.push("ejectionTemperature must be between 20 and 200.");
  }

  if (inputs.ejectionTemperature <= 0) {
    errors.push("ejectionTemperature must be greater than zero.");
  }

  if (inputs.moldCorrectionFactor < 0.5 || inputs.moldCorrectionFactor > 2) {
    errors.push("moldCorrectionFactor must be between 0.5 and 2.");
  }

  if (inputs.moldCorrectionFactor <= 0) {
    errors.push("moldCorrectionFactor must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: EnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateEnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorInputs(inputs: EnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorInputs): EnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorValidationResult {
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
