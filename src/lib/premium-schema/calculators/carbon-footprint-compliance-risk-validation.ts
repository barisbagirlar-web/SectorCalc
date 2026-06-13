export type CarbonFootprintComplianceRiskInputs = {
  energyEmissionsTon: number;
  fuelEmissionsTon: number;
  carbonPrice: number;
  exposurePercent: number;
};

export type CarbonFootprintComplianceRiskValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const CARBON_FOOTPRINT_COMPLIANCE_RISK_INPUT_KEYS: readonly (keyof CarbonFootprintComplianceRiskInputs)[] = [
  "energyEmissionsTon",
  "fuelEmissionsTon",
  "carbonPrice",
  "exposurePercent",
];

const INPUT_LABELS: Record<keyof CarbonFootprintComplianceRiskInputs, string> = {
  energyEmissionsTon: "energyEmissionsTon",
  fuelEmissionsTon: "fuelEmissionsTon",
  carbonPrice: "carbonPrice",
  exposurePercent: "exposurePercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: CarbonFootprintComplianceRiskInputs): string[] {
  const errors: string[] = [];

  for (const key of CARBON_FOOTPRINT_COMPLIANCE_RISK_INPUT_KEYS) {
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

  if (inputs.energyEmissionsTon < 0) {
    errors.push("energyEmissionsTon must be greater than or equal to zero.");
  }

  if (inputs.fuelEmissionsTon < 0) {
    errors.push("fuelEmissionsTon must be greater than or equal to zero.");
  }

  if (inputs.carbonPrice < 0) {
    errors.push("carbonPrice must be greater than or equal to zero.");
  }

  if (inputs.exposurePercent < 0 || inputs.exposurePercent > 100) {
    errors.push("exposurePercent must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: CarbonFootprintComplianceRiskInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateCarbonFootprintComplianceRiskInputs(inputs: CarbonFootprintComplianceRiskInputs): CarbonFootprintComplianceRiskValidationResult {
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
