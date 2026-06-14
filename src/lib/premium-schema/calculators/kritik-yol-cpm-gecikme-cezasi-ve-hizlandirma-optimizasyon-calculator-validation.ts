export type KritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorInputs = {
  contractDurationDays: number;
  actualDurationDays: number;
  penaltyRatePerDay: number;
  baselineCost: number;
  crashCostPerDay: number;
  maxCrashDays: number;
};

export type KritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const KRITIK_YOL_CPM_GECIKME_CEZASI_VE_HIZLANDIRMA_OPTIMIZASYON_CALCULATOR_INPUT_KEYS: readonly (keyof KritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorInputs)[] = [
  "contractDurationDays",
  "actualDurationDays",
  "penaltyRatePerDay",
  "baselineCost",
  "crashCostPerDay",
  "maxCrashDays",
];

const INPUT_LABELS: Record<keyof KritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorInputs, string> = {
  contractDurationDays: "contractDurationDays",
  actualDurationDays: "actualDurationDays",
  penaltyRatePerDay: "penaltyRatePerDay",
  baselineCost: "baselineCost",
  crashCostPerDay: "crashCostPerDay",
  maxCrashDays: "maxCrashDays",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: KritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of KRITIK_YOL_CPM_GECIKME_CEZASI_VE_HIZLANDIRMA_OPTIMIZASYON_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.contractDurationDays < 1 || inputs.contractDurationDays > 3650) {
    errors.push("contractDurationDays must be between 1 and 3650.");
  }

  if (inputs.contractDurationDays <= 0) {
    errors.push("contractDurationDays must be greater than zero.");
  }

  if (inputs.actualDurationDays < 0 || inputs.actualDurationDays > 3650) {
    errors.push("actualDurationDays must be between 0 and 3650.");
  }

  if (inputs.actualDurationDays <= 0) {
    errors.push("actualDurationDays must be greater than zero.");
  }

  if (inputs.penaltyRatePerDay < 0 || inputs.penaltyRatePerDay > 1000000) {
    errors.push("penaltyRatePerDay must be between 0 and 1000000.");
  }

  if (inputs.baselineCost < 0 || inputs.baselineCost > 1000000000) {
    errors.push("baselineCost must be between 0 and 1000000000.");
  }

  if (inputs.baselineCost <= 0) {
    errors.push("baselineCost must be greater than zero.");
  }

  if (inputs.crashCostPerDay < 0 || inputs.crashCostPerDay > 1000000) {
    errors.push("crashCostPerDay must be between 0 and 1000000.");
  }

  if (inputs.maxCrashDays < 0 || inputs.maxCrashDays > 365) {
    errors.push("maxCrashDays must be between 0 and 365.");
  }

  if (inputs.maxCrashDays <= 0) {
    errors.push("maxCrashDays must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: KritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateKritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorInputs(inputs: KritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorInputs): KritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorValidationResult {
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
