export type MakineEkonomikOmruHurdaDegerHesabiInputs = {
  initialCost: number;
  salvageValue: number;
  usefulLife: number;
  currentYear: number;
};

export type MakineEkonomikOmruHurdaDegerHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const MAKINE_EKONOMIK_OMRU_HURDA_DEGER_HESABI_INPUT_KEYS: readonly (keyof MakineEkonomikOmruHurdaDegerHesabiInputs)[] = [
  "initialCost",
  "salvageValue",
  "usefulLife",
  "currentYear",
];

const INPUT_LABELS: Record<keyof MakineEkonomikOmruHurdaDegerHesabiInputs, string> = {
  initialCost: "initialCost",
  salvageValue: "salvageValue",
  usefulLife: "usefulLife",
  currentYear: "currentYear",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: MakineEkonomikOmruHurdaDegerHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of MAKINE_EKONOMIK_OMRU_HURDA_DEGER_HESABI_INPUT_KEYS) {
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

  if (inputs.initialCost < 1 || inputs.initialCost > 100000000) {
    errors.push("initialCost must be between 1 and 100000000.");
  }

  if (inputs.initialCost <= 0) {
    errors.push("initialCost must be greater than zero.");
  }

  if (inputs.salvageValue < 0 || inputs.salvageValue > 100000000) {
    errors.push("salvageValue must be between 0 and 100000000.");
  }

  if (inputs.usefulLife < 1 || inputs.usefulLife > 100) {
    errors.push("usefulLife must be between 1 and 100.");
  }

  if (inputs.usefulLife <= 0) {
    errors.push("usefulLife must be greater than zero.");
  }

  if (inputs.currentYear < 0 || inputs.currentYear > 100) {
    errors.push("currentYear must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: MakineEkonomikOmruHurdaDegerHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateMakineEkonomikOmruHurdaDegerHesabiInputs(inputs: MakineEkonomikOmruHurdaDegerHesabiInputs): MakineEkonomikOmruHurdaDegerHesabiValidationResult {
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
