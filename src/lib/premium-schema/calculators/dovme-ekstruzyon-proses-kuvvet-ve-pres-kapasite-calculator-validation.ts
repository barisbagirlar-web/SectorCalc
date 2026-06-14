export type DovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorInputs = {
  partLength: number;
  partWidth: number;
  flowStress: number;
  shapeComplexityFactor: number;
  safetyFactor: number;
  pressNominalCapacity: number;
};

export type DovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const DOVME_EKSTRUZYON_PROSES_KUVVET_VE_PRES_KAPASITE_CALCULATOR_INPUT_KEYS: readonly (keyof DovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorInputs)[] = [
  "partLength",
  "partWidth",
  "flowStress",
  "shapeComplexityFactor",
  "safetyFactor",
  "pressNominalCapacity",
];

const INPUT_LABELS: Record<keyof DovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorInputs, string> = {
  partLength: "partLength",
  partWidth: "partWidth",
  flowStress: "flowStress",
  shapeComplexityFactor: "shapeComplexityFactor",
  safetyFactor: "safetyFactor",
  pressNominalCapacity: "pressNominalCapacity",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: DovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of DOVME_EKSTRUZYON_PROSES_KUVVET_VE_PRES_KAPASITE_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.partLength < 1 || inputs.partLength > 10000) {
    errors.push("partLength must be between 1 and 10000.");
  }

  if (inputs.partLength <= 0) {
    errors.push("partLength must be greater than zero.");
  }

  if (inputs.partWidth < 1 || inputs.partWidth > 10000) {
    errors.push("partWidth must be between 1 and 10000.");
  }

  if (inputs.partWidth <= 0) {
    errors.push("partWidth must be greater than zero.");
  }

  if (inputs.flowStress < 1 || inputs.flowStress > 2000) {
    errors.push("flowStress must be between 1 and 2000.");
  }

  if (inputs.flowStress <= 0) {
    errors.push("flowStress must be greater than zero.");
  }

  if (inputs.shapeComplexityFactor < 1 || inputs.shapeComplexityFactor > 3) {
    errors.push("shapeComplexityFactor must be between 1 and 3.");
  }

  if (inputs.shapeComplexityFactor <= 0) {
    errors.push("shapeComplexityFactor must be greater than zero.");
  }

  if (inputs.safetyFactor < 1 || inputs.safetyFactor > 1.5) {
    errors.push("safetyFactor must be between 1 and 1.5.");
  }

  if (inputs.safetyFactor <= 0) {
    errors.push("safetyFactor must be greater than zero.");
  }

  if (inputs.pressNominalCapacity < 100 || inputs.pressNominalCapacity > 1000000) {
    errors.push("pressNominalCapacity must be between 100 and 1000000.");
  }

  if (inputs.pressNominalCapacity <= 0) {
    errors.push("pressNominalCapacity must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: DovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateDovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorInputs(inputs: DovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorInputs): DovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorValidationResult {
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
