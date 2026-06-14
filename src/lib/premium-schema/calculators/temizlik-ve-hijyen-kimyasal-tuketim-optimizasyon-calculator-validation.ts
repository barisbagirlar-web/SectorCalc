export type TemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorInputs = {
  areaPerCycle: number;
  doseRatePerArea: number;
  dilutionFactor: number;
  wasteFactorPercent: number;
  numberOfCycles: number;
  unitCost: number;
};

export type TemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const TEMIZLIK_VE_HIJYEN_KIMYASAL_TUKETIM_OPTIMIZASYON_CALCULATOR_INPUT_KEYS: readonly (keyof TemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorInputs)[] = [
  "areaPerCycle",
  "doseRatePerArea",
  "dilutionFactor",
  "wasteFactorPercent",
  "numberOfCycles",
  "unitCost",
];

const INPUT_LABELS: Record<keyof TemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorInputs, string> = {
  areaPerCycle: "areaPerCycle",
  doseRatePerArea: "doseRatePerArea",
  dilutionFactor: "dilutionFactor",
  wasteFactorPercent: "wasteFactorPercent",
  numberOfCycles: "numberOfCycles",
  unitCost: "unitCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: TemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of TEMIZLIK_VE_HIJYEN_KIMYASAL_TUKETIM_OPTIMIZASYON_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.areaPerCycle < 1 || inputs.areaPerCycle > 100000) {
    errors.push("areaPerCycle must be between 1 and 100000.");
  }

  if (inputs.areaPerCycle <= 0) {
    errors.push("areaPerCycle must be greater than zero.");
  }

  if (inputs.doseRatePerArea < 0.001 || inputs.doseRatePerArea > 10) {
    errors.push("doseRatePerArea must be between 0.001 and 10.");
  }

  if (inputs.doseRatePerArea <= 0) {
    errors.push("doseRatePerArea must be greater than zero.");
  }

  if (inputs.dilutionFactor < 1 || inputs.dilutionFactor > 1000) {
    errors.push("dilutionFactor must be between 1 and 1000.");
  }

  if (inputs.dilutionFactor <= 0) {
    errors.push("dilutionFactor must be greater than zero.");
  }

  if (inputs.wasteFactorPercent < 0 || inputs.wasteFactorPercent > 100) {
    errors.push("wasteFactorPercent must be between 0 and 100.");
  }

  if (inputs.numberOfCycles < 1 || inputs.numberOfCycles > 10000) {
    errors.push("numberOfCycles must be between 1 and 10000.");
  }

  if (inputs.numberOfCycles <= 0) {
    errors.push("numberOfCycles must be greater than zero.");
  }

  if (inputs.unitCost < 0.01 || inputs.unitCost > 1000) {
    errors.push("unitCost must be between 0.01 and 1000.");
  }

  if (inputs.unitCost <= 0) {
    errors.push("unitCost must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: TemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateTemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorInputs(inputs: TemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorInputs): TemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorValidationResult {
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
