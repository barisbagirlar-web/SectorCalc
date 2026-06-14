export type KoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorInputs = {
  downtimeMinutes: number;
  machineHourlyRate: number;
  laborHourlyRate: number;
  lostProductionUnits: number;
  contributionMarginPerUnit: number;
  repairCost: number;
};

export type KoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const KORUYUCU_BAKIM_FREKANSI_VE_MALIYET_OPTIMIZASYON_CALCULATOR_INPUT_KEYS: readonly (keyof KoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorInputs)[] = [
  "downtimeMinutes",
  "machineHourlyRate",
  "laborHourlyRate",
  "lostProductionUnits",
  "contributionMarginPerUnit",
  "repairCost",
];

const INPUT_LABELS: Record<keyof KoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorInputs, string> = {
  downtimeMinutes: "downtimeMinutes",
  machineHourlyRate: "machineHourlyRate",
  laborHourlyRate: "laborHourlyRate",
  lostProductionUnits: "lostProductionUnits",
  contributionMarginPerUnit: "contributionMarginPerUnit",
  repairCost: "repairCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: KoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of KORUYUCU_BAKIM_FREKANSI_VE_MALIYET_OPTIMIZASYON_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.downtimeMinutes < 0 || inputs.downtimeMinutes > 10080) {
    errors.push("downtimeMinutes must be between 0 and 10080.");
  }

  if (inputs.machineHourlyRate < 0 || inputs.machineHourlyRate > 10000) {
    errors.push("machineHourlyRate must be between 0 and 10000.");
  }

  if (inputs.laborHourlyRate < 0 || inputs.laborHourlyRate > 1000) {
    errors.push("laborHourlyRate must be between 0 and 1000.");
  }

  if (inputs.lostProductionUnits < 0 || inputs.lostProductionUnits > 1000000) {
    errors.push("lostProductionUnits must be between 0 and 1000000.");
  }

  if (inputs.lostProductionUnits <= 0) {
    errors.push("lostProductionUnits must be greater than zero.");
  }

  if (inputs.contributionMarginPerUnit < 0 || inputs.contributionMarginPerUnit > 100000) {
    errors.push("contributionMarginPerUnit must be between 0 and 100000.");
  }

  if (inputs.repairCost < 0 || inputs.repairCost > 1000000) {
    errors.push("repairCost must be between 0 and 1000000.");
  }

  return errors;
}

function collectWarnings(inputs: KoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateKoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorInputs(inputs: KoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorInputs): KoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorValidationResult {
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
