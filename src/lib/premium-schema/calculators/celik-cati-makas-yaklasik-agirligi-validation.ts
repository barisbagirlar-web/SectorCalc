export type CelikCatiMakasYaklasikAgirligiInputs = {
  spanLength: number;
  trussHeight: number;
  trussType: number;
};

export type CelikCatiMakasYaklasikAgirligiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const CELIK_CATI_MAKAS_YAKLASIK_AGIRLIGI_INPUT_KEYS: readonly (keyof CelikCatiMakasYaklasikAgirligiInputs)[] = [
  "spanLength",
  "trussHeight",
  "trussType",
];

const INPUT_LABELS: Record<keyof CelikCatiMakasYaklasikAgirligiInputs, string> = {
  spanLength: "spanLength",
  trussHeight: "trussHeight",
  trussType: "trussType",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: CelikCatiMakasYaklasikAgirligiInputs): string[] {
  const errors: string[] = [];

  for (const key of CELIK_CATI_MAKAS_YAKLASIK_AGIRLIGI_INPUT_KEYS) {
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

  if (inputs.spanLength < 1 || inputs.spanLength > 100) {
    errors.push("spanLength must be between 1 and 100.");
  }

  if (inputs.spanLength <= 0) {
    errors.push("spanLength must be greater than zero.");
  }

  if (inputs.trussHeight < 0.5 || inputs.trussHeight > 50) {
    errors.push("trussHeight must be between 0.5 and 50.");
  }

  if (inputs.trussHeight <= 0) {
    errors.push("trussHeight must be greater than zero.");
  }

  if (inputs.trussType < 0) {
    errors.push("trussType must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: CelikCatiMakasYaklasikAgirligiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateCelikCatiMakasYaklasikAgirligiInputs(inputs: CelikCatiMakasYaklasikAgirligiInputs): CelikCatiMakasYaklasikAgirligiValidationResult {
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
