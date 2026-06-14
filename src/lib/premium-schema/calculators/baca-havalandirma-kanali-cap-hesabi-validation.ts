export type BacaHavalandirmaKanaliCapHesabiInputs = {
  airflowRate: number;
  airVelocity: number;
  ductLength: number;
  frictionFactor: number;
  airDensity: number;
  localLossCoefficient: number;
};

export type BacaHavalandirmaKanaliCapHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const BACA_HAVALANDIRMA_KANALI_CAP_HESABI_INPUT_KEYS: readonly (keyof BacaHavalandirmaKanaliCapHesabiInputs)[] = [
  "airflowRate",
  "airVelocity",
  "ductLength",
  "frictionFactor",
  "airDensity",
  "localLossCoefficient",
];

const INPUT_LABELS: Record<keyof BacaHavalandirmaKanaliCapHesabiInputs, string> = {
  airflowRate: "airflowRate",
  airVelocity: "airVelocity",
  ductLength: "ductLength",
  frictionFactor: "frictionFactor",
  airDensity: "airDensity",
  localLossCoefficient: "localLossCoefficient",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: BacaHavalandirmaKanaliCapHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of BACA_HAVALANDIRMA_KANALI_CAP_HESABI_INPUT_KEYS) {
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

  if (inputs.airflowRate < 0.01 || inputs.airflowRate > 1000) {
    errors.push("airflowRate must be between 0.01 and 1000.");
  }

  if (inputs.airflowRate <= 0) {
    errors.push("airflowRate must be greater than zero.");
  }

  if (inputs.airVelocity < 1 || inputs.airVelocity > 30) {
    errors.push("airVelocity must be between 1 and 30.");
  }

  if (inputs.airVelocity <= 0) {
    errors.push("airVelocity must be greater than zero.");
  }

  if (inputs.ductLength < 0.1 || inputs.ductLength > 1000) {
    errors.push("ductLength must be between 0.1 and 1000.");
  }

  if (inputs.ductLength <= 0) {
    errors.push("ductLength must be greater than zero.");
  }

  if (inputs.frictionFactor < 0.01 || inputs.frictionFactor > 0.1) {
    errors.push("frictionFactor must be between 0.01 and 0.1.");
  }

  if (inputs.frictionFactor <= 0) {
    errors.push("frictionFactor must be greater than zero.");
  }

  if (inputs.airDensity < 0.9 || inputs.airDensity > 1.3) {
    errors.push("airDensity must be between 0.9 and 1.3.");
  }

  if (inputs.airDensity <= 0) {
    errors.push("airDensity must be greater than zero.");
  }

  if (inputs.localLossCoefficient < 0 || inputs.localLossCoefficient > 100) {
    errors.push("localLossCoefficient must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: BacaHavalandirmaKanaliCapHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateBacaHavalandirmaKanaliCapHesabiInputs(inputs: BacaHavalandirmaKanaliCapHesabiInputs): BacaHavalandirmaKanaliCapHesabiValidationResult {
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
