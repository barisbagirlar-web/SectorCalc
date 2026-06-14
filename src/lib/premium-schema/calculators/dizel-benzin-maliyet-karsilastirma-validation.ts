export type DizelBenzinMaliyetKarsilastirmaInputs = {
  annualMileage: number;
  fuelEfficiencyDiesel: number;
  fuelEfficiencyGasoline: number;
  fuelPriceDiesel: number;
  fuelPriceGasoline: number;
};

export type DizelBenzinMaliyetKarsilastirmaValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const DIZEL_BENZIN_MALIYET_KARSILASTIRMA_INPUT_KEYS: readonly (keyof DizelBenzinMaliyetKarsilastirmaInputs)[] = [
  "annualMileage",
  "fuelEfficiencyDiesel",
  "fuelEfficiencyGasoline",
  "fuelPriceDiesel",
  "fuelPriceGasoline",
];

const INPUT_LABELS: Record<keyof DizelBenzinMaliyetKarsilastirmaInputs, string> = {
  annualMileage: "annualMileage",
  fuelEfficiencyDiesel: "fuelEfficiencyDiesel",
  fuelEfficiencyGasoline: "fuelEfficiencyGasoline",
  fuelPriceDiesel: "fuelPriceDiesel",
  fuelPriceGasoline: "fuelPriceGasoline",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: DizelBenzinMaliyetKarsilastirmaInputs): string[] {
  const errors: string[] = [];

  for (const key of DIZEL_BENZIN_MALIYET_KARSILASTIRMA_INPUT_KEYS) {
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

  if (inputs.annualMileage < 1 || inputs.annualMileage > 1000000) {
    errors.push("annualMileage must be between 1 and 1000000.");
  }

  if (inputs.annualMileage <= 0) {
    errors.push("annualMileage must be greater than zero.");
  }

  if (inputs.fuelEfficiencyDiesel < 0.1 || inputs.fuelEfficiencyDiesel > 50) {
    errors.push("fuelEfficiencyDiesel must be between 0.1 and 50.");
  }

  if (inputs.fuelEfficiencyDiesel <= 0) {
    errors.push("fuelEfficiencyDiesel must be greater than zero.");
  }

  if (inputs.fuelEfficiencyGasoline < 0.1 || inputs.fuelEfficiencyGasoline > 50) {
    errors.push("fuelEfficiencyGasoline must be between 0.1 and 50.");
  }

  if (inputs.fuelEfficiencyGasoline <= 0) {
    errors.push("fuelEfficiencyGasoline must be greater than zero.");
  }

  if (inputs.fuelPriceDiesel < 0.001 || inputs.fuelPriceDiesel > 100) {
    errors.push("fuelPriceDiesel must be between 0.001 and 100.");
  }

  if (inputs.fuelPriceDiesel <= 0) {
    errors.push("fuelPriceDiesel must be greater than zero.");
  }

  if (inputs.fuelPriceGasoline < 0.001 || inputs.fuelPriceGasoline > 100) {
    errors.push("fuelPriceGasoline must be between 0.001 and 100.");
  }

  if (inputs.fuelPriceGasoline <= 0) {
    errors.push("fuelPriceGasoline must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: DizelBenzinMaliyetKarsilastirmaInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateDizelBenzinMaliyetKarsilastirmaInputs(inputs: DizelBenzinMaliyetKarsilastirmaInputs): DizelBenzinMaliyetKarsilastirmaValidationResult {
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
