export type DepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorInputs = {
  pickQuantity: number;
  averageTravelDistancePerPick: number;
  optimalRouteDistance: number;
  laborRatePerHour: number;
  averageTravelSpeed: number;
  slottingScore: number;
};

export type DepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const DEPO_YERLESIMI_VE_TOPLAMA_ROTASI_OPTIMIZASYON_CALCULATOR_INPUT_KEYS: readonly (keyof DepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorInputs)[] = [
  "pickQuantity",
  "averageTravelDistancePerPick",
  "optimalRouteDistance",
  "laborRatePerHour",
  "averageTravelSpeed",
  "slottingScore",
];

const INPUT_LABELS: Record<keyof DepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorInputs, string> = {
  pickQuantity: "pickQuantity",
  averageTravelDistancePerPick: "averageTravelDistancePerPick",
  optimalRouteDistance: "optimalRouteDistance",
  laborRatePerHour: "laborRatePerHour",
  averageTravelSpeed: "averageTravelSpeed",
  slottingScore: "slottingScore",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: DepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of DEPO_YERLESIMI_VE_TOPLAMA_ROTASI_OPTIMIZASYON_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.pickQuantity < 1 || inputs.pickQuantity > 10000) {
    errors.push("pickQuantity must be between 1 and 10000.");
  }

  if (inputs.pickQuantity <= 0) {
    errors.push("pickQuantity must be greater than zero.");
  }

  if (inputs.averageTravelDistancePerPick < 0.1 || inputs.averageTravelDistancePerPick > 1000) {
    errors.push("averageTravelDistancePerPick must be between 0.1 and 1000.");
  }

  if (inputs.averageTravelDistancePerPick <= 0) {
    errors.push("averageTravelDistancePerPick must be greater than zero.");
  }

  if (inputs.optimalRouteDistance < 0.1 || inputs.optimalRouteDistance > 1000) {
    errors.push("optimalRouteDistance must be between 0.1 and 1000.");
  }

  if (inputs.optimalRouteDistance <= 0) {
    errors.push("optimalRouteDistance must be greater than zero.");
  }

  if (inputs.laborRatePerHour < 0 || inputs.laborRatePerHour > 200) {
    errors.push("laborRatePerHour must be between 0 and 200.");
  }

  if (inputs.averageTravelSpeed < 0.1 || inputs.averageTravelSpeed > 200) {
    errors.push("averageTravelSpeed must be between 0.1 and 200.");
  }

  if (inputs.averageTravelSpeed <= 0) {
    errors.push("averageTravelSpeed must be greater than zero.");
  }

  if (inputs.slottingScore < 0 || inputs.slottingScore > 100) {
    errors.push("slottingScore must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: DepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateDepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorInputs(inputs: DepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorInputs): DepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorValidationResult {
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
