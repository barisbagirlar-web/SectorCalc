export type LpgBenzinTasarrufKarsilastirmaInputs = {
  monthlyDistanceKm: number;
  gasolineFuelEfficiency: number;
  lpgFuelEfficiency: number;
  gasolinePricePerLiter: number;
  lpgPricePerLiter: number;
};

export type LpgBenzinTasarrufKarsilastirmaValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const LPG_BENZIN_TASARRUF_KARSILASTIRMA_INPUT_KEYS: readonly (keyof LpgBenzinTasarrufKarsilastirmaInputs)[] = [
  "monthlyDistanceKm",
  "gasolineFuelEfficiency",
  "lpgFuelEfficiency",
  "gasolinePricePerLiter",
  "lpgPricePerLiter",
];

const INPUT_LABELS: Record<keyof LpgBenzinTasarrufKarsilastirmaInputs, string> = {
  monthlyDistanceKm: "monthlyDistanceKm",
  gasolineFuelEfficiency: "gasolineFuelEfficiency",
  lpgFuelEfficiency: "lpgFuelEfficiency",
  gasolinePricePerLiter: "gasolinePricePerLiter",
  lpgPricePerLiter: "lpgPricePerLiter",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: LpgBenzinTasarrufKarsilastirmaInputs): string[] {
  const errors: string[] = [];

  for (const key of LPG_BENZIN_TASARRUF_KARSILASTIRMA_INPUT_KEYS) {
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

  if (inputs.monthlyDistanceKm < 1 || inputs.monthlyDistanceKm > 100000) {
    errors.push("monthlyDistanceKm must be between 1 and 100000.");
  }

  if (inputs.monthlyDistanceKm <= 0) {
    errors.push("monthlyDistanceKm must be greater than zero.");
  }

  if (inputs.gasolineFuelEfficiency < 1 || inputs.gasolineFuelEfficiency > 50) {
    errors.push("gasolineFuelEfficiency must be between 1 and 50.");
  }

  if (inputs.gasolineFuelEfficiency <= 0) {
    errors.push("gasolineFuelEfficiency must be greater than zero.");
  }

  if (inputs.lpgFuelEfficiency < 1 || inputs.lpgFuelEfficiency > 50) {
    errors.push("lpgFuelEfficiency must be between 1 and 50.");
  }

  if (inputs.lpgFuelEfficiency <= 0) {
    errors.push("lpgFuelEfficiency must be greater than zero.");
  }

  if (inputs.gasolinePricePerLiter < 0 || inputs.gasolinePricePerLiter > 100) {
    errors.push("gasolinePricePerLiter must be between 0 and 100.");
  }

  if (inputs.lpgPricePerLiter < 0 || inputs.lpgPricePerLiter > 100) {
    errors.push("lpgPricePerLiter must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: LpgBenzinTasarrufKarsilastirmaInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateLpgBenzinTasarrufKarsilastirmaInputs(inputs: LpgBenzinTasarrufKarsilastirmaInputs): LpgBenzinTasarrufKarsilastirmaValidationResult {
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
