export type CbamUnitProductCarbonFootprintCalculatorInputs = {
  energyEmissionsTon: number;
  fuelEmissionsTon: number;
  productionUnits: number;
  carbonPrice: number;
};

export type CbamUnitProductCarbonFootprintCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const CBAM_UNIT_PRODUCT_CARBON_FOOTPRINT_CALCULATOR_INPUT_KEYS: readonly (keyof CbamUnitProductCarbonFootprintCalculatorInputs)[] = [
  "energyEmissionsTon",
  "fuelEmissionsTon",
  "productionUnits",
  "carbonPrice",
];

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: CbamUnitProductCarbonFootprintCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of CBAM_UNIT_PRODUCT_CARBON_FOOTPRINT_CALCULATOR_INPUT_KEYS) {
    const value = inputs[key];
    if (value === undefined || value === null) {
      errors.push(`${key} is required.`);
      continue;
    }
    if (!isValidNumber(value)) {
      errors.push(`${key} must be a finite number.`);
    }
  }

  if (errors.length > 0) {
    return errors;
  }

  if (inputs.energyEmissionsTon < 0) {
    errors.push("energyEmissionsTon must be greater than or equal to zero.");
  }

  if (inputs.fuelEmissionsTon < 0) {
    errors.push("fuelEmissionsTon must be greater than or equal to zero.");
  }

  if (inputs.productionUnits <= 0) {
    errors.push("productionUnits must be greater than zero.");
  }

  if (inputs.carbonPrice < 0) {
    errors.push("carbonPrice must be greater than or equal to zero.");
  }

  return errors;
}

export function validateCbamUnitProductCarbonFootprintCalculatorInputs(
  inputs: CbamUnitProductCarbonFootprintCalculatorInputs,
): CbamUnitProductCarbonFootprintCalculatorValidationResult {
  const errors = collectInputErrors(inputs);
  if (errors.length > 0) {
    return { ok: false, errors, warnings: [] };
  }

  const warnings: string[] = [];
  if (inputs.energyEmissionsTon + inputs.fuelEmissionsTon === 0) {
    warnings.push("Total emissions are zero — unit footprint will be zero.");
  }

  return { ok: true, errors: [], warnings };
}
