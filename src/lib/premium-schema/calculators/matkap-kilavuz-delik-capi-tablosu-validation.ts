export type MatkapKilavuzDelikCapiTablosuInputs = {
  nominalThreadDiameter: number;
  threadPitch: number;
  materialType: number;
};

export type MatkapKilavuzDelikCapiTablosuValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const MATKAP_KILAVUZ_DELIK_CAPI_TABLOSU_INPUT_KEYS: readonly (keyof MatkapKilavuzDelikCapiTablosuInputs)[] = [
  "nominalThreadDiameter",
  "threadPitch",
  "materialType",
];

const INPUT_LABELS: Record<keyof MatkapKilavuzDelikCapiTablosuInputs, string> = {
  nominalThreadDiameter: "nominalThreadDiameter",
  threadPitch: "threadPitch",
  materialType: "materialType",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: MatkapKilavuzDelikCapiTablosuInputs): string[] {
  const errors: string[] = [];

  for (const key of MATKAP_KILAVUZ_DELIK_CAPI_TABLOSU_INPUT_KEYS) {
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

  if (inputs.nominalThreadDiameter < 1 || inputs.nominalThreadDiameter > 100) {
    errors.push("nominalThreadDiameter must be between 1 and 100.");
  }

  if (inputs.nominalThreadDiameter <= 0) {
    errors.push("nominalThreadDiameter must be greater than zero.");
  }

  if (inputs.threadPitch < 0.1 || inputs.threadPitch > 10) {
    errors.push("threadPitch must be between 0.1 and 10.");
  }

  if (inputs.threadPitch <= 0) {
    errors.push("threadPitch must be greater than zero.");
  }

  if (inputs.materialType < 0) {
    errors.push("materialType must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: MatkapKilavuzDelikCapiTablosuInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateMatkapKilavuzDelikCapiTablosuInputs(inputs: MatkapKilavuzDelikCapiTablosuInputs): MatkapKilavuzDelikCapiTablosuValidationResult {
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
