export type Iso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorInputs = {
  powerKw: number;
  runtimeHours: number;
  energyConsumptionKwh: number;
  tariffPerKwh: number;
  peakDemandKw: number;
  efficiencyPercent: number;
};

export type Iso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ISO_50001_ENERJI_YONETIMI_TABAN_CIZGISI_VE_TASARRUF_CALCULATOR_INPUT_KEYS: readonly (keyof Iso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorInputs)[] = [
  "powerKw",
  "runtimeHours",
  "energyConsumptionKwh",
  "tariffPerKwh",
  "peakDemandKw",
  "efficiencyPercent",
];

const INPUT_LABELS: Record<keyof Iso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorInputs, string> = {
  powerKw: "powerKw",
  runtimeHours: "runtimeHours",
  energyConsumptionKwh: "energyConsumptionKwh",
  tariffPerKwh: "tariffPerKwh",
  peakDemandKw: "peakDemandKw",
  efficiencyPercent: "efficiencyPercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: Iso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of ISO_50001_ENERJI_YONETIMI_TABAN_CIZGISI_VE_TASARRUF_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.powerKw < 0 || inputs.powerKw > 1000000) {
    errors.push("powerKw must be between 0 and 1000000.");
  }

  if (inputs.runtimeHours < 0 || inputs.runtimeHours > 24) {
    errors.push("runtimeHours must be between 0 and 24.");
  }

  if (inputs.energyConsumptionKwh < 0 || inputs.energyConsumptionKwh > 100000000) {
    errors.push("energyConsumptionKwh must be between 0 and 100000000.");
  }

  if (inputs.tariffPerKwh < 0 || inputs.tariffPerKwh > 10) {
    errors.push("tariffPerKwh must be between 0 and 10.");
  }

  if (inputs.peakDemandKw < 0 || inputs.peakDemandKw > 1000000) {
    errors.push("peakDemandKw must be between 0 and 1000000.");
  }

  if (inputs.efficiencyPercent < 0 || inputs.efficiencyPercent > 100) {
    errors.push("efficiencyPercent must be between 0 and 100.");
  }

  if (inputs.efficiencyPercent <= 0) {
    errors.push("efficiencyPercent must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: Iso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateIso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorInputs(inputs: Iso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorInputs): Iso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorValidationResult {
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
