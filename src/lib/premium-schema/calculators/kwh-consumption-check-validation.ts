export type KwhConsumptionCheckInputs = {
  powerKw: number;
  runtimeHours: number;
  energyConsumptionKwh: number;
  tariffPerKwh: number;
  peakDemandKw: number;
  efficiencyPercent: number;
};

export type KwhConsumptionCheckValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const KWH_CONSUMPTION_CHECK_INPUT_KEYS: readonly (keyof KwhConsumptionCheckInputs)[] = [
  "powerKw",
  "runtimeHours",
  "energyConsumptionKwh",
  "tariffPerKwh",
  "peakDemandKw",
  "efficiencyPercent",
];

const INPUT_LABELS: Record<keyof KwhConsumptionCheckInputs, string> = {
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

function collectInputErrors(inputs: KwhConsumptionCheckInputs): string[] {
  const errors: string[] = [];

  for (const key of KWH_CONSUMPTION_CHECK_INPUT_KEYS) {
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

  if (inputs.runtimeHours < 0 || inputs.runtimeHours > 8760) {
    errors.push("runtimeHours must be between 0 and 8760.");
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

function collectWarnings(inputs: KwhConsumptionCheckInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateKwhConsumptionCheckInputs(inputs: KwhConsumptionCheckInputs): KwhConsumptionCheckValidationResult {
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
