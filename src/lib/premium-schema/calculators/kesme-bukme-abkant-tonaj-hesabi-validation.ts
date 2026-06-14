export type KesmeBukmeAbkantTonajHesabiInputs = {
  tensileStrength: number;
  materialThickness: number;
  bendLength: number;
  dieOpening: number;
  materialFactor: number;
  safetyFactor: number;
};

export type KesmeBukmeAbkantTonajHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const KESME_BUKME_ABKANT_TONAJ_HESABI_INPUT_KEYS: readonly (keyof KesmeBukmeAbkantTonajHesabiInputs)[] = [
  "tensileStrength",
  "materialThickness",
  "bendLength",
  "dieOpening",
  "materialFactor",
  "safetyFactor",
];

const INPUT_LABELS: Record<keyof KesmeBukmeAbkantTonajHesabiInputs, string> = {
  tensileStrength: "tensileStrength",
  materialThickness: "materialThickness",
  bendLength: "bendLength",
  dieOpening: "dieOpening",
  materialFactor: "materialFactor",
  safetyFactor: "safetyFactor",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: KesmeBukmeAbkantTonajHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of KESME_BUKME_ABKANT_TONAJ_HESABI_INPUT_KEYS) {
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

  if (inputs.tensileStrength < 100 || inputs.tensileStrength > 2000) {
    errors.push("tensileStrength must be between 100 and 2000.");
  }

  if (inputs.tensileStrength <= 0) {
    errors.push("tensileStrength must be greater than zero.");
  }

  if (inputs.materialThickness < 0.5 || inputs.materialThickness > 25) {
    errors.push("materialThickness must be between 0.5 and 25.");
  }

  if (inputs.materialThickness <= 0) {
    errors.push("materialThickness must be greater than zero.");
  }

  if (inputs.bendLength < 10 || inputs.bendLength > 6000) {
    errors.push("bendLength must be between 10 and 6000.");
  }

  if (inputs.bendLength <= 0) {
    errors.push("bendLength must be greater than zero.");
  }

  if (inputs.dieOpening < 6 || inputs.dieOpening > 200) {
    errors.push("dieOpening must be between 6 and 200.");
  }

  if (inputs.dieOpening <= 0) {
    errors.push("dieOpening must be greater than zero.");
  }

  if (inputs.materialFactor < 0.5 || inputs.materialFactor > 2) {
    errors.push("materialFactor must be between 0.5 and 2.");
  }

  if (inputs.materialFactor <= 0) {
    errors.push("materialFactor must be greater than zero.");
  }

  if (inputs.safetyFactor < 1 || inputs.safetyFactor > 2) {
    errors.push("safetyFactor must be between 1 and 2.");
  }

  if (inputs.safetyFactor <= 0) {
    errors.push("safetyFactor must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: KesmeBukmeAbkantTonajHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateKesmeBukmeAbkantTonajHesabiInputs(inputs: KesmeBukmeAbkantTonajHesabiInputs): KesmeBukmeAbkantTonajHesabiValidationResult {
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
