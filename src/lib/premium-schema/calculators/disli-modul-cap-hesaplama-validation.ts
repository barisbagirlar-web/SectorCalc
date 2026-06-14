export type DisliModulCapHesaplamaInputs = {
  module: number;
  numberOfTeeth: number;
  addendumCoefficient: number;
  dedendumCoefficient: number;
};

export type DisliModulCapHesaplamaValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const DISLI_MODUL_CAP_HESAPLAMA_INPUT_KEYS: readonly (keyof DisliModulCapHesaplamaInputs)[] = [
  "module",
  "numberOfTeeth",
  "addendumCoefficient",
  "dedendumCoefficient",
];

const INPUT_LABELS: Record<keyof DisliModulCapHesaplamaInputs, string> = {
  module: "module",
  numberOfTeeth: "numberOfTeeth",
  addendumCoefficient: "addendumCoefficient",
  dedendumCoefficient: "dedendumCoefficient",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: DisliModulCapHesaplamaInputs): string[] {
  const errors: string[] = [];

  for (const key of DISLI_MODUL_CAP_HESAPLAMA_INPUT_KEYS) {
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

  if (inputs.module < 0.1 || inputs.module > 100) {
    errors.push("module must be between 0.1 and 100.");
  }

  if (inputs.module <= 0) {
    errors.push("module must be greater than zero.");
  }

  if (inputs.numberOfTeeth < 1 || inputs.numberOfTeeth > 1000) {
    errors.push("numberOfTeeth must be between 1 and 1000.");
  }

  if (inputs.numberOfTeeth <= 0) {
    errors.push("numberOfTeeth must be greater than zero.");
  }

  if (inputs.addendumCoefficient < 0.5 || inputs.addendumCoefficient > 1.5) {
    errors.push("addendumCoefficient must be between 0.5 and 1.5.");
  }

  if (inputs.addendumCoefficient <= 0) {
    errors.push("addendumCoefficient must be greater than zero.");
  }

  if (inputs.dedendumCoefficient < 1 || inputs.dedendumCoefficient > 2) {
    errors.push("dedendumCoefficient must be between 1 and 2.");
  }

  if (inputs.dedendumCoefficient <= 0) {
    errors.push("dedendumCoefficient must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: DisliModulCapHesaplamaInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateDisliModulCapHesaplamaInputs(inputs: DisliModulCapHesaplamaInputs): DisliModulCapHesaplamaValidationResult {
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
