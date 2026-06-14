export type TelKabloUzunluguAgirlikHesabiInputs = {
  length: number;
  linearDensity: number;
  coatingFactor: number;
  quantity: number;
};

export type TelKabloUzunluguAgirlikHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const TEL_KABLO_UZUNLUGU_AGIRLIK_HESABI_INPUT_KEYS: readonly (keyof TelKabloUzunluguAgirlikHesabiInputs)[] = [
  "length",
  "linearDensity",
  "coatingFactor",
  "quantity",
];

const INPUT_LABELS: Record<keyof TelKabloUzunluguAgirlikHesabiInputs, string> = {
  length: "length",
  linearDensity: "linearDensity",
  coatingFactor: "coatingFactor",
  quantity: "quantity",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: TelKabloUzunluguAgirlikHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of TEL_KABLO_UZUNLUGU_AGIRLIK_HESABI_INPUT_KEYS) {
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

  if (inputs.length < 0.001 || inputs.length > 100000) {
    errors.push("length must be between 0.001 and 100000.");
  }

  if (inputs.length <= 0) {
    errors.push("length must be greater than zero.");
  }

  if (inputs.linearDensity < 0.0001 || inputs.linearDensity > 100) {
    errors.push("linearDensity must be between 0.0001 and 100.");
  }

  if (inputs.linearDensity <= 0) {
    errors.push("linearDensity must be greater than zero.");
  }

  if (inputs.coatingFactor < 0 || inputs.coatingFactor > 100) {
    errors.push("coatingFactor must be between 0 and 100.");
  }

  if (inputs.quantity < 1 || inputs.quantity > 1000000) {
    errors.push("quantity must be between 1 and 1000000.");
  }

  if (inputs.quantity <= 0) {
    errors.push("quantity must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: TelKabloUzunluguAgirlikHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateTelKabloUzunluguAgirlikHesabiInputs(inputs: TelKabloUzunluguAgirlikHesabiInputs): TelKabloUzunluguAgirlikHesabiValidationResult {
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
