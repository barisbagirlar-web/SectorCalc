export type KumlamaRaspaKumSarfiyatiHesabiInputs = {
  surfaceArea: number;
  consumptionRatePerUnitArea: number;
  nozzleEfficiency: number;
  lossFactor: number;
  unitCost: number;
};

export type KumlamaRaspaKumSarfiyatiHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const KUMLAMA_RASPA_KUM_SARFIYATI_HESABI_INPUT_KEYS: readonly (keyof KumlamaRaspaKumSarfiyatiHesabiInputs)[] = [
  "surfaceArea",
  "consumptionRatePerUnitArea",
  "nozzleEfficiency",
  "lossFactor",
  "unitCost",
];

const INPUT_LABELS: Record<keyof KumlamaRaspaKumSarfiyatiHesabiInputs, string> = {
  surfaceArea: "surfaceArea",
  consumptionRatePerUnitArea: "consumptionRatePerUnitArea",
  nozzleEfficiency: "nozzleEfficiency",
  lossFactor: "lossFactor",
  unitCost: "unitCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: KumlamaRaspaKumSarfiyatiHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of KUMLAMA_RASPA_KUM_SARFIYATI_HESABI_INPUT_KEYS) {
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

  if (inputs.surfaceArea < 0.01 || inputs.surfaceArea > 100000) {
    errors.push("surfaceArea must be between 0.01 and 100000.");
  }

  if (inputs.surfaceArea <= 0) {
    errors.push("surfaceArea must be greater than zero.");
  }

  if (inputs.consumptionRatePerUnitArea < 0.1 || inputs.consumptionRatePerUnitArea > 50) {
    errors.push("consumptionRatePerUnitArea must be between 0.1 and 50.");
  }

  if (inputs.consumptionRatePerUnitArea <= 0) {
    errors.push("consumptionRatePerUnitArea must be greater than zero.");
  }

  if (inputs.nozzleEfficiency < 0.1 || inputs.nozzleEfficiency > 1) {
    errors.push("nozzleEfficiency must be between 0.1 and 1.");
  }

  if (inputs.nozzleEfficiency <= 0) {
    errors.push("nozzleEfficiency must be greater than zero.");
  }

  if (inputs.lossFactor < 0 || inputs.lossFactor > 100) {
    errors.push("lossFactor must be between 0 and 100.");
  }

  if (inputs.unitCost < 0 || inputs.unitCost > 100) {
    errors.push("unitCost must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: KumlamaRaspaKumSarfiyatiHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateKumlamaRaspaKumSarfiyatiHesabiInputs(inputs: KumlamaRaspaKumSarfiyatiHesabiInputs): KumlamaRaspaKumSarfiyatiHesabiValidationResult {
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
