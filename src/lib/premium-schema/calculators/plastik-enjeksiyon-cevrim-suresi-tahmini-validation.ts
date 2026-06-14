export type PlastikEnjeksiyonCevrimSuresiTahminiInputs = {
  injectionTime: number;
  coolingTime: number;
  moldOpenCloseTime: number;
  ejectionTime: number;
  materialFactor: number;
  wallThickness: number;
};

export type PlastikEnjeksiyonCevrimSuresiTahminiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const PLASTIK_ENJEKSIYON_CEVRIM_SURESI_TAHMINI_INPUT_KEYS: readonly (keyof PlastikEnjeksiyonCevrimSuresiTahminiInputs)[] = [
  "injectionTime",
  "coolingTime",
  "moldOpenCloseTime",
  "ejectionTime",
  "materialFactor",
  "wallThickness",
];

const INPUT_LABELS: Record<keyof PlastikEnjeksiyonCevrimSuresiTahminiInputs, string> = {
  injectionTime: "injectionTime",
  coolingTime: "coolingTime",
  moldOpenCloseTime: "moldOpenCloseTime",
  ejectionTime: "ejectionTime",
  materialFactor: "materialFactor",
  wallThickness: "wallThickness",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: PlastikEnjeksiyonCevrimSuresiTahminiInputs): string[] {
  const errors: string[] = [];

  for (const key of PLASTIK_ENJEKSIYON_CEVRIM_SURESI_TAHMINI_INPUT_KEYS) {
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

  if (inputs.injectionTime < 0.1 || inputs.injectionTime > 60) {
    errors.push("injectionTime must be between 0.1 and 60.");
  }

  if (inputs.injectionTime <= 0) {
    errors.push("injectionTime must be greater than zero.");
  }

  if (inputs.coolingTime < 0.1 || inputs.coolingTime > 300) {
    errors.push("coolingTime must be between 0.1 and 300.");
  }

  if (inputs.coolingTime <= 0) {
    errors.push("coolingTime must be greater than zero.");
  }

  if (inputs.moldOpenCloseTime < 0.1 || inputs.moldOpenCloseTime > 60) {
    errors.push("moldOpenCloseTime must be between 0.1 and 60.");
  }

  if (inputs.moldOpenCloseTime <= 0) {
    errors.push("moldOpenCloseTime must be greater than zero.");
  }

  if (inputs.ejectionTime < 0.1 || inputs.ejectionTime > 30) {
    errors.push("ejectionTime must be between 0.1 and 30.");
  }

  if (inputs.ejectionTime <= 0) {
    errors.push("ejectionTime must be greater than zero.");
  }

  if (inputs.materialFactor < 0.5 || inputs.materialFactor > 3) {
    errors.push("materialFactor must be between 0.5 and 3.");
  }

  if (inputs.materialFactor <= 0) {
    errors.push("materialFactor must be greater than zero.");
  }

  if (inputs.wallThickness < 0.5 || inputs.wallThickness > 10) {
    errors.push("wallThickness must be between 0.5 and 10.");
  }

  if (inputs.wallThickness <= 0) {
    errors.push("wallThickness must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: PlastikEnjeksiyonCevrimSuresiTahminiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validatePlastikEnjeksiyonCevrimSuresiTahminiInputs(inputs: PlastikEnjeksiyonCevrimSuresiTahminiInputs): PlastikEnjeksiyonCevrimSuresiTahminiValidationResult {
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
