export type KonteynerYuklemeKapasitesiTeuHesabiInputs = {
  totalContainerVolume: number;
  standardTEUVolume: number;
  stowageFactor: number;
  weightCapacity: number;
  averageCargoWeightPerTEU: number;
  safetyReductionFactor: number;
};

export type KonteynerYuklemeKapasitesiTeuHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const KONTEYNER_YUKLEME_KAPASITESI_TEU_HESABI_INPUT_KEYS: readonly (keyof KonteynerYuklemeKapasitesiTeuHesabiInputs)[] = [
  "totalContainerVolume",
  "standardTEUVolume",
  "stowageFactor",
  "weightCapacity",
  "averageCargoWeightPerTEU",
  "safetyReductionFactor",
];

const INPUT_LABELS: Record<keyof KonteynerYuklemeKapasitesiTeuHesabiInputs, string> = {
  totalContainerVolume: "totalContainerVolume",
  standardTEUVolume: "standardTEUVolume",
  stowageFactor: "stowageFactor",
  weightCapacity: "weightCapacity",
  averageCargoWeightPerTEU: "averageCargoWeightPerTEU",
  safetyReductionFactor: "safetyReductionFactor",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: KonteynerYuklemeKapasitesiTeuHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of KONTEYNER_YUKLEME_KAPASITESI_TEU_HESABI_INPUT_KEYS) {
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

  if (inputs.totalContainerVolume < 1 || inputs.totalContainerVolume > 1000) {
    errors.push("totalContainerVolume must be between 1 and 1000.");
  }

  if (inputs.totalContainerVolume <= 0) {
    errors.push("totalContainerVolume must be greater than zero.");
  }

  if (inputs.standardTEUVolume < 1 || inputs.standardTEUVolume > 100) {
    errors.push("standardTEUVolume must be between 1 and 100.");
  }

  if (inputs.standardTEUVolume <= 0) {
    errors.push("standardTEUVolume must be greater than zero.");
  }

  if (inputs.stowageFactor < 0 || inputs.stowageFactor > 100) {
    errors.push("stowageFactor must be between 0 and 100.");
  }

  if (inputs.weightCapacity < 0 || inputs.weightCapacity > 30) {
    errors.push("weightCapacity must be between 0 and 30.");
  }

  if (inputs.averageCargoWeightPerTEU < 0.1 || inputs.averageCargoWeightPerTEU > 30) {
    errors.push("averageCargoWeightPerTEU must be between 0.1 and 30.");
  }

  if (inputs.averageCargoWeightPerTEU <= 0) {
    errors.push("averageCargoWeightPerTEU must be greater than zero.");
  }

  if (inputs.safetyReductionFactor < 0 || inputs.safetyReductionFactor > 100) {
    errors.push("safetyReductionFactor must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: KonteynerYuklemeKapasitesiTeuHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateKonteynerYuklemeKapasitesiTeuHesabiInputs(inputs: KonteynerYuklemeKapasitesiTeuHesabiInputs): KonteynerYuklemeKapasitesiTeuHesabiValidationResult {
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
