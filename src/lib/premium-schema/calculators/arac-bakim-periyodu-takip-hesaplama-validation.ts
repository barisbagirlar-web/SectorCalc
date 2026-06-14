export type AracBakimPeriyoduTakipHesaplamaInputs = {
  downtimeMinutes: number;
  machineHourlyRate: number;
  laborHourlyRate: number;
  lostProductionUnits: number;
  contributionMarginPerUnit: number;
  repairCost: number;
};

export type AracBakimPeriyoduTakipHesaplamaValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ARAC_BAKIM_PERIYODU_TAKIP_HESAPLAMA_INPUT_KEYS: readonly (keyof AracBakimPeriyoduTakipHesaplamaInputs)[] = [
  "downtimeMinutes",
  "machineHourlyRate",
  "laborHourlyRate",
  "lostProductionUnits",
  "contributionMarginPerUnit",
  "repairCost",
];

const INPUT_LABELS: Record<keyof AracBakimPeriyoduTakipHesaplamaInputs, string> = {
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

function collectInputErrors(inputs: AracBakimPeriyoduTakipHesaplamaInputs): string[] {
  const errors: string[] = [];

  for (const key of ARAC_BAKIM_PERIYODU_TAKIP_HESAPLAMA_INPUT_KEYS) {
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

  if (inputs.downtimeMinutes < 0 || inputs.downtimeMinutes > 1000000) {
    errors.push("downtimeMinutes must be between 0 and 1000000.");
  }

  if (inputs.machineHourlyRate < 0 || inputs.machineHourlyRate > 100000) {
    errors.push("machineHourlyRate must be between 0 and 100000.");
  }

  if (inputs.laborHourlyRate < 0 || inputs.laborHourlyRate > 100000) {
    errors.push("laborHourlyRate must be between 0 and 100000.");
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

function collectWarnings(inputs: AracBakimPeriyoduTakipHesaplamaInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateAracBakimPeriyoduTakipHesaplamaInputs(inputs: AracBakimPeriyoduTakipHesaplamaInputs): AracBakimPeriyoduTakipHesaplamaValidationResult {
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
