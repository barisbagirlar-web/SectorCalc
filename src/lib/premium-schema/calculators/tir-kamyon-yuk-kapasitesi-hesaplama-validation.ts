export type TirKamyonYukKapasitesiHesaplamaInputs = {
  grossVehicleWeight: number;
  tareWeight: number;
  fuelWeight: number;
  crewWeight: number;
  safetyMarginPercent: number;
  actualLoad: number;
};

export type TirKamyonYukKapasitesiHesaplamaValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const TIR_KAMYON_YUK_KAPASITESI_HESAPLAMA_INPUT_KEYS: readonly (keyof TirKamyonYukKapasitesiHesaplamaInputs)[] = [
  "grossVehicleWeight",
  "tareWeight",
  "fuelWeight",
  "crewWeight",
  "safetyMarginPercent",
  "actualLoad",
];

const INPUT_LABELS: Record<keyof TirKamyonYukKapasitesiHesaplamaInputs, string> = {
  grossVehicleWeight: "grossVehicleWeight",
  tareWeight: "tareWeight",
  fuelWeight: "fuelWeight",
  crewWeight: "crewWeight",
  safetyMarginPercent: "safetyMarginPercent",
  actualLoad: "actualLoad",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: TirKamyonYukKapasitesiHesaplamaInputs): string[] {
  const errors: string[] = [];

  for (const key of TIR_KAMYON_YUK_KAPASITESI_HESAPLAMA_INPUT_KEYS) {
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

  if (inputs.grossVehicleWeight < 1000 || inputs.grossVehicleWeight > 60000) {
    errors.push("grossVehicleWeight must be between 1000 and 60000.");
  }

  if (inputs.grossVehicleWeight <= 0) {
    errors.push("grossVehicleWeight must be greater than zero.");
  }

  if (inputs.tareWeight < 1000 || inputs.tareWeight > 30000) {
    errors.push("tareWeight must be between 1000 and 30000.");
  }

  if (inputs.tareWeight <= 0) {
    errors.push("tareWeight must be greater than zero.");
  }

  if (inputs.fuelWeight < 0 || inputs.fuelWeight > 1000) {
    errors.push("fuelWeight must be between 0 and 1000.");
  }

  if (inputs.crewWeight < 0 || inputs.crewWeight > 500) {
    errors.push("crewWeight must be between 0 and 500.");
  }

  if (inputs.safetyMarginPercent < 0 || inputs.safetyMarginPercent > 100) {
    errors.push("safetyMarginPercent must be between 0 and 100.");
  }

  if (inputs.actualLoad < 0 || inputs.actualLoad > 60000) {
    errors.push("actualLoad must be between 0 and 60000.");
  }

  return errors;
}

function collectWarnings(inputs: TirKamyonYukKapasitesiHesaplamaInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateTirKamyonYukKapasitesiHesaplamaInputs(inputs: TirKamyonYukKapasitesiHesaplamaInputs): TirKamyonYukKapasitesiHesaplamaValidationResult {
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
