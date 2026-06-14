export type ToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorInputs = {
  purchasePrice: number;
  installationCost: number;
  trainingCost: number;
  expectedLifeYears: number;
  annualEnergyCost: number;
  annualConsumablesCost: number;
};

export type ToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const TOPLAM_SAHIP_OLMA_MALIYETI_TCO_EKIPMAN_KARSILASTIRMA_CALCULATOR_INPUT_KEYS: readonly (keyof ToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorInputs)[] = [
  "purchasePrice",
  "installationCost",
  "trainingCost",
  "expectedLifeYears",
  "annualEnergyCost",
  "annualConsumablesCost",
];

const INPUT_LABELS: Record<keyof ToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorInputs, string> = {
  purchasePrice: "purchasePrice",
  installationCost: "installationCost",
  trainingCost: "trainingCost",
  expectedLifeYears: "expectedLifeYears",
  annualEnergyCost: "annualEnergyCost",
  annualConsumablesCost: "annualConsumablesCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: ToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of TOPLAM_SAHIP_OLMA_MALIYETI_TCO_EKIPMAN_KARSILASTIRMA_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.purchasePrice < 0 || inputs.purchasePrice > 100000000) {
    errors.push("purchasePrice must be between 0 and 100000000.");
  }

  if (inputs.installationCost < 0 || inputs.installationCost > 100000000) {
    errors.push("installationCost must be between 0 and 100000000.");
  }

  if (inputs.trainingCost < 0 || inputs.trainingCost > 100000000) {
    errors.push("trainingCost must be between 0 and 100000000.");
  }

  if (inputs.expectedLifeYears < 1 || inputs.expectedLifeYears > 50) {
    errors.push("expectedLifeYears must be between 1 and 50.");
  }

  if (inputs.expectedLifeYears <= 0) {
    errors.push("expectedLifeYears must be greater than zero.");
  }

  if (inputs.annualEnergyCost < 0 || inputs.annualEnergyCost > 100000000) {
    errors.push("annualEnergyCost must be between 0 and 100000000.");
  }

  if (inputs.annualConsumablesCost < 0 || inputs.annualConsumablesCost > 100000000) {
    errors.push("annualConsumablesCost must be between 0 and 100000000.");
  }

  return errors;
}

function collectWarnings(inputs: ToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorInputs(inputs: ToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorInputs): ToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorValidationResult {
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
