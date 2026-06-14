export type BoruHattiSurtunmeVePompaEnerjiKayipCalculatorInputs = {
  pipeLengthM: number;
  pipeDiameterM: number;
  flowRateM3PerS: number;
  frictionFactor: number;
  fluidDensityKgPerM3: number;
  pumpEfficiencyPercent: number;
};

export type BoruHattiSurtunmeVePompaEnerjiKayipCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const BORU_HATTI_SURTUNME_VE_POMPA_ENERJI_KAYIP_CALCULATOR_INPUT_KEYS: readonly (keyof BoruHattiSurtunmeVePompaEnerjiKayipCalculatorInputs)[] = [
  "pipeLengthM",
  "pipeDiameterM",
  "flowRateM3PerS",
  "frictionFactor",
  "fluidDensityKgPerM3",
  "pumpEfficiencyPercent",
];

const INPUT_LABELS: Record<keyof BoruHattiSurtunmeVePompaEnerjiKayipCalculatorInputs, string> = {
  pipeLengthM: "pipeLengthM",
  pipeDiameterM: "pipeDiameterM",
  flowRateM3PerS: "flowRateM3PerS",
  frictionFactor: "frictionFactor",
  fluidDensityKgPerM3: "fluidDensityKgPerM3",
  pumpEfficiencyPercent: "pumpEfficiencyPercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: BoruHattiSurtunmeVePompaEnerjiKayipCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of BORU_HATTI_SURTUNME_VE_POMPA_ENERJI_KAYIP_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.pipeLengthM < 0.1 || inputs.pipeLengthM > 100000) {
    errors.push("pipeLengthM must be between 0.1 and 100000.");
  }

  if (inputs.pipeLengthM <= 0) {
    errors.push("pipeLengthM must be greater than zero.");
  }

  if (inputs.pipeDiameterM < 0.01 || inputs.pipeDiameterM > 10) {
    errors.push("pipeDiameterM must be between 0.01 and 10.");
  }

  if (inputs.pipeDiameterM <= 0) {
    errors.push("pipeDiameterM must be greater than zero.");
  }

  if (inputs.flowRateM3PerS < 0.001 || inputs.flowRateM3PerS > 100) {
    errors.push("flowRateM3PerS must be between 0.001 and 100.");
  }

  if (inputs.flowRateM3PerS <= 0) {
    errors.push("flowRateM3PerS must be greater than zero.");
  }

  if (inputs.frictionFactor < 0.001 || inputs.frictionFactor > 0.1) {
    errors.push("frictionFactor must be between 0.001 and 0.1.");
  }

  if (inputs.frictionFactor <= 0) {
    errors.push("frictionFactor must be greater than zero.");
  }

  if (inputs.fluidDensityKgPerM3 < 1 || inputs.fluidDensityKgPerM3 > 2000) {
    errors.push("fluidDensityKgPerM3 must be between 1 and 2000.");
  }

  if (inputs.fluidDensityKgPerM3 <= 0) {
    errors.push("fluidDensityKgPerM3 must be greater than zero.");
  }

  if (inputs.pumpEfficiencyPercent < 0 || inputs.pumpEfficiencyPercent > 100) {
    errors.push("pumpEfficiencyPercent must be between 0 and 100.");
  }

  if (inputs.pumpEfficiencyPercent <= 0) {
    errors.push("pumpEfficiencyPercent must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: BoruHattiSurtunmeVePompaEnerjiKayipCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateBoruHattiSurtunmeVePompaEnerjiKayipCalculatorInputs(inputs: BoruHattiSurtunmeVePompaEnerjiKayipCalculatorInputs): BoruHattiSurtunmeVePompaEnerjiKayipCalculatorValidationResult {
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
