export type SuIsitmaKazanBoylerKapasiteHesabiInputs = {
  powerKw: number;
  runtimeHours: number;
  energyConsumptionKwh: number;
  tariffPerKwh: number;
  peakDemandKw: number;
  efficiencyPercent: number;
};

export type SuIsitmaKazanBoylerKapasiteHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const SU_ISITMA_KAZAN_BOYLER_KAPASITE_HESABI_INPUT_KEYS: readonly (keyof SuIsitmaKazanBoylerKapasiteHesabiInputs)[] = [
  "powerKw",
  "runtimeHours",
  "energyConsumptionKwh",
  "tariffPerKwh",
  "peakDemandKw",
  "efficiencyPercent",
];

const INPUT_LABELS: Record<keyof SuIsitmaKazanBoylerKapasiteHesabiInputs, string> = {
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

function collectInputErrors(inputs: SuIsitmaKazanBoylerKapasiteHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of SU_ISITMA_KAZAN_BOYLER_KAPASITE_HESABI_INPUT_KEYS) {
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

  if (inputs.powerKw < 0 || inputs.powerKw > 100000) {
    errors.push("powerKw must be between 0 and 100000.");
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

  if (inputs.peakDemandKw < 0 || inputs.peakDemandKw > 100000) {
    errors.push("peakDemandKw must be between 0 and 100000.");
  }

  if (inputs.efficiencyPercent < 0 || inputs.efficiencyPercent > 100) {
    errors.push("efficiencyPercent must be between 0 and 100.");
  }

  if (inputs.efficiencyPercent <= 0) {
    errors.push("efficiencyPercent must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: SuIsitmaKazanBoylerKapasiteHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateSuIsitmaKazanBoylerKapasiteHesabiInputs(inputs: SuIsitmaKazanBoylerKapasiteHesabiInputs): SuIsitmaKazanBoylerKapasiteHesabiValidationResult {
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
