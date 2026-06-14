export type BuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorInputs = {
  powerKw: number;
  runtimeHours: number;
  energyConsumptionKwh: number;
  tariffPerKwh: number;
  peakDemandKw: number;
  efficiencyPercent: number;
};

export type BuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const BUHAR_KAPANI_STEAM_TRAP_KACAK_VE_ENERJI_KAYIP_CALCULATOR_INPUT_KEYS: readonly (keyof BuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorInputs)[] = [
  "powerKw",
  "runtimeHours",
  "energyConsumptionKwh",
  "tariffPerKwh",
  "peakDemandKw",
  "efficiencyPercent",
];

const INPUT_LABELS: Record<keyof BuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorInputs, string> = {
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

function collectInputErrors(inputs: BuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of BUHAR_KAPANI_STEAM_TRAP_KACAK_VE_ENERJI_KAYIP_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.powerKw < 0 || inputs.powerKw > 10000) {
    errors.push("powerKw must be between 0 and 10000.");
  }

  if (inputs.runtimeHours < 0 || inputs.runtimeHours > 24) {
    errors.push("runtimeHours must be between 0 and 24.");
  }

  if (inputs.energyConsumptionKwh < 0 || inputs.energyConsumptionKwh > 1000000) {
    errors.push("energyConsumptionKwh must be between 0 and 1000000.");
  }

  if (inputs.tariffPerKwh < 0 || inputs.tariffPerKwh > 10) {
    errors.push("tariffPerKwh must be between 0 and 10.");
  }

  if (inputs.peakDemandKw < 0 || inputs.peakDemandKw > 10000) {
    errors.push("peakDemandKw must be between 0 and 10000.");
  }

  if (inputs.efficiencyPercent < 0 || inputs.efficiencyPercent > 100) {
    errors.push("efficiencyPercent must be between 0 and 100.");
  }

  if (inputs.efficiencyPercent <= 0) {
    errors.push("efficiencyPercent must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: BuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateBuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorInputs(inputs: BuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorInputs): BuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorValidationResult {
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
