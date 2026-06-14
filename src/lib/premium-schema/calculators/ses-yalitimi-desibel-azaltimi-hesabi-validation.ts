export type SesYalitimiDesibelAzaltimiHesabiInputs = {
  surfaceMass: number;
  frequency: number;
  absorptionCoefficient: number;
  partitionArea: number;
  roomAbsorption: number;
  sealLoss: number;
};

export type SesYalitimiDesibelAzaltimiHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const SES_YALITIMI_DESIBEL_AZALTIMI_HESABI_INPUT_KEYS: readonly (keyof SesYalitimiDesibelAzaltimiHesabiInputs)[] = [
  "surfaceMass",
  "frequency",
  "absorptionCoefficient",
  "partitionArea",
  "roomAbsorption",
  "sealLoss",
];

const INPUT_LABELS: Record<keyof SesYalitimiDesibelAzaltimiHesabiInputs, string> = {
  surfaceMass: "surfaceMass",
  frequency: "frequency",
  absorptionCoefficient: "absorptionCoefficient",
  partitionArea: "partitionArea",
  roomAbsorption: "roomAbsorption",
  sealLoss: "sealLoss",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: SesYalitimiDesibelAzaltimiHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of SES_YALITIMI_DESIBEL_AZALTIMI_HESABI_INPUT_KEYS) {
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

  if (inputs.surfaceMass < 1 || inputs.surfaceMass > 1000) {
    errors.push("surfaceMass must be between 1 and 1000.");
  }

  if (inputs.surfaceMass <= 0) {
    errors.push("surfaceMass must be greater than zero.");
  }

  if (inputs.frequency < 100 || inputs.frequency > 5000) {
    errors.push("frequency must be between 100 and 5000.");
  }

  if (inputs.frequency <= 0) {
    errors.push("frequency must be greater than zero.");
  }

  if (inputs.absorptionCoefficient < 0.01 || inputs.absorptionCoefficient > 0.99) {
    errors.push("absorptionCoefficient must be between 0.01 and 0.99.");
  }

  if (inputs.absorptionCoefficient <= 0) {
    errors.push("absorptionCoefficient must be greater than zero.");
  }

  if (inputs.partitionArea < 1 || inputs.partitionArea > 1000) {
    errors.push("partitionArea must be between 1 and 1000.");
  }

  if (inputs.partitionArea <= 0) {
    errors.push("partitionArea must be greater than zero.");
  }

  if (inputs.roomAbsorption < 0.1 || inputs.roomAbsorption > 10000) {
    errors.push("roomAbsorption must be between 0.1 and 10000.");
  }

  if (inputs.roomAbsorption <= 0) {
    errors.push("roomAbsorption must be greater than zero.");
  }

  if (inputs.sealLoss < 0 || inputs.sealLoss > 10) {
    errors.push("sealLoss must be between 0 and 10.");
  }

  return errors;
}

function collectWarnings(inputs: SesYalitimiDesibelAzaltimiHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateSesYalitimiDesibelAzaltimiHesabiInputs(inputs: SesYalitimiDesibelAzaltimiHesabiInputs): SesYalitimiDesibelAzaltimiHesabiValidationResult {
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
