export type ForkliftTranspaletKullanimMaliyetiInputs = {
  purchasePrice: number;
  residualValue: number;
  usefulLifeYears: number;
  operatingHoursPerYear: number;
  energyConsumptionPerHour: number;
  energyUnitCost: number;
};

export type ForkliftTranspaletKullanimMaliyetiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const FORKLIFT_TRANSPALET_KULLANIM_MALIYETI_INPUT_KEYS: readonly (keyof ForkliftTranspaletKullanimMaliyetiInputs)[] = [
  "purchasePrice",
  "residualValue",
  "usefulLifeYears",
  "operatingHoursPerYear",
  "energyConsumptionPerHour",
  "energyUnitCost",
];

const INPUT_LABELS: Record<keyof ForkliftTranspaletKullanimMaliyetiInputs, string> = {
  purchasePrice: "purchasePrice",
  residualValue: "residualValue",
  usefulLifeYears: "usefulLifeYears",
  operatingHoursPerYear: "operatingHoursPerYear",
  energyConsumptionPerHour: "energyConsumptionPerHour",
  energyUnitCost: "energyUnitCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: ForkliftTranspaletKullanimMaliyetiInputs): string[] {
  const errors: string[] = [];

  for (const key of FORKLIFT_TRANSPALET_KULLANIM_MALIYETI_INPUT_KEYS) {
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

  if (inputs.purchasePrice < 0 || inputs.purchasePrice > 500000) {
    errors.push("purchasePrice must be between 0 and 500000.");
  }

  if (inputs.residualValue < 0 || inputs.residualValue > 500000) {
    errors.push("residualValue must be between 0 and 500000.");
  }

  if (inputs.usefulLifeYears < 1 || inputs.usefulLifeYears > 30) {
    errors.push("usefulLifeYears must be between 1 and 30.");
  }

  if (inputs.usefulLifeYears <= 0) {
    errors.push("usefulLifeYears must be greater than zero.");
  }

  if (inputs.operatingHoursPerYear < 1 || inputs.operatingHoursPerYear > 8760) {
    errors.push("operatingHoursPerYear must be between 1 and 8760.");
  }

  if (inputs.operatingHoursPerYear <= 0) {
    errors.push("operatingHoursPerYear must be greater than zero.");
  }

  if (inputs.energyConsumptionPerHour < 0 || inputs.energyConsumptionPerHour > 100) {
    errors.push("energyConsumptionPerHour must be between 0 and 100.");
  }

  if (inputs.energyUnitCost < 0 || inputs.energyUnitCost > 10) {
    errors.push("energyUnitCost must be between 0 and 10.");
  }

  return errors;
}

function collectWarnings(inputs: ForkliftTranspaletKullanimMaliyetiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateForkliftTranspaletKullanimMaliyetiInputs(inputs: ForkliftTranspaletKullanimMaliyetiInputs): ForkliftTranspaletKullanimMaliyetiValidationResult {
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
