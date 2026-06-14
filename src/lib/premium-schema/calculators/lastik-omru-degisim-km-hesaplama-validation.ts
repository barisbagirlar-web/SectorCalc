export type LastikOmruDegisimKmHesaplamaInputs = {
  initialTreadDepth: number;
  currentTreadDepth: number;
  replacementThreshold: number;
  wearRatePer10kKm: number;
  loadFactor: number;
  roadConditionFactor: number;
};

export type LastikOmruDegisimKmHesaplamaValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const LASTIK_OMRU_DEGISIM_KM_HESAPLAMA_INPUT_KEYS: readonly (keyof LastikOmruDegisimKmHesaplamaInputs)[] = [
  "initialTreadDepth",
  "currentTreadDepth",
  "replacementThreshold",
  "wearRatePer10kKm",
  "loadFactor",
  "roadConditionFactor",
];

const INPUT_LABELS: Record<keyof LastikOmruDegisimKmHesaplamaInputs, string> = {
  initialTreadDepth: "initialTreadDepth",
  currentTreadDepth: "currentTreadDepth",
  replacementThreshold: "replacementThreshold",
  wearRatePer10kKm: "wearRatePer10kKm",
  loadFactor: "loadFactor",
  roadConditionFactor: "roadConditionFactor",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: LastikOmruDegisimKmHesaplamaInputs): string[] {
  const errors: string[] = [];

  for (const key of LASTIK_OMRU_DEGISIM_KM_HESAPLAMA_INPUT_KEYS) {
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

  if (inputs.initialTreadDepth < 1 || inputs.initialTreadDepth > 20) {
    errors.push("initialTreadDepth must be between 1 and 20.");
  }

  if (inputs.initialTreadDepth <= 0) {
    errors.push("initialTreadDepth must be greater than zero.");
  }

  if (inputs.currentTreadDepth < 0 || inputs.currentTreadDepth > 20) {
    errors.push("currentTreadDepth must be between 0 and 20.");
  }

  if (inputs.replacementThreshold < 0 || inputs.replacementThreshold > 5) {
    errors.push("replacementThreshold must be between 0 and 5.");
  }

  if (inputs.wearRatePer10kKm < 0.1 || inputs.wearRatePer10kKm > 5) {
    errors.push("wearRatePer10kKm must be between 0.1 and 5.");
  }

  if (inputs.wearRatePer10kKm <= 0) {
    errors.push("wearRatePer10kKm must be greater than zero.");
  }

  if (inputs.loadFactor < 0.5 || inputs.loadFactor > 1.5) {
    errors.push("loadFactor must be between 0.5 and 1.5.");
  }

  if (inputs.loadFactor <= 0) {
    errors.push("loadFactor must be greater than zero.");
  }

  if (inputs.roadConditionFactor < 0.5 || inputs.roadConditionFactor > 1.5) {
    errors.push("roadConditionFactor must be between 0.5 and 1.5.");
  }

  if (inputs.roadConditionFactor <= 0) {
    errors.push("roadConditionFactor must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: LastikOmruDegisimKmHesaplamaInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateLastikOmruDegisimKmHesaplamaInputs(inputs: LastikOmruDegisimKmHesaplamaInputs): LastikOmruDegisimKmHesaplamaValidationResult {
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
