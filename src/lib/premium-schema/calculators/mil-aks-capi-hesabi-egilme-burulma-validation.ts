export type MilAksCapiHesabiEgilmeBurulmaInputs = {
  bendingMoment: number;
  torsionMoment: number;
  yieldStrength: number;
  safetyFactor: number;
  fatigueStressConcentrationFactor: number;
  hasKeyway: number;
};

export type MilAksCapiHesabiEgilmeBurulmaValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const MIL_AKS_CAPI_HESABI_EGILME_BURULMA_INPUT_KEYS: readonly (keyof MilAksCapiHesabiEgilmeBurulmaInputs)[] = [
  "bendingMoment",
  "torsionMoment",
  "yieldStrength",
  "safetyFactor",
  "fatigueStressConcentrationFactor",
  "hasKeyway",
];

const INPUT_LABELS: Record<keyof MilAksCapiHesabiEgilmeBurulmaInputs, string> = {
  bendingMoment: "bendingMoment",
  torsionMoment: "torsionMoment",
  yieldStrength: "yieldStrength",
  safetyFactor: "safetyFactor",
  fatigueStressConcentrationFactor: "fatigueStressConcentrationFactor",
  hasKeyway: "hasKeyway",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: MilAksCapiHesabiEgilmeBurulmaInputs): string[] {
  const errors: string[] = [];

  for (const key of MIL_AKS_CAPI_HESABI_EGILME_BURULMA_INPUT_KEYS) {
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

  if (inputs.bendingMoment < 0 || inputs.bendingMoment > 1000000000) {
    errors.push("bendingMoment must be between 0 and 1000000000.");
  }

  if (inputs.torsionMoment < 0 || inputs.torsionMoment > 1000000000) {
    errors.push("torsionMoment must be between 0 and 1000000000.");
  }

  if (inputs.yieldStrength < 1 || inputs.yieldStrength > 3000) {
    errors.push("yieldStrength must be between 1 and 3000.");
  }

  if (inputs.yieldStrength <= 0) {
    errors.push("yieldStrength must be greater than zero.");
  }

  if (inputs.safetyFactor < 1 || inputs.safetyFactor > 10) {
    errors.push("safetyFactor must be between 1 and 10.");
  }

  if (inputs.safetyFactor <= 0) {
    errors.push("safetyFactor must be greater than zero.");
  }

  if (inputs.fatigueStressConcentrationFactor < 1 || inputs.fatigueStressConcentrationFactor > 5) {
    errors.push("fatigueStressConcentrationFactor must be between 1 and 5.");
  }

  if (inputs.fatigueStressConcentrationFactor <= 0) {
    errors.push("fatigueStressConcentrationFactor must be greater than zero.");
  }

  if (inputs.hasKeyway < 0) {
    errors.push("hasKeyway must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: MilAksCapiHesabiEgilmeBurulmaInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateMilAksCapiHesabiEgilmeBurulmaInputs(inputs: MilAksCapiHesabiEgilmeBurulmaInputs): MilAksCapiHesabiEgilmeBurulmaValidationResult {
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
