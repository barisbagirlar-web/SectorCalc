export type AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInputs = {
  directMaterialCost: number;
  directLaborCost: number;
  machineOrEquipmentCost: number;
  overheadPercent: number;
  contingencyPercent: number;
  targetGrossMarginPercent: number;
};

export type AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ANDON_SISTEMI_DURUS_VE_TEPKI_SURESI_MALIYET_CALCULATOR_INPUT_KEYS: readonly (keyof AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInputs)[] = [
  "directMaterialCost",
  "directLaborCost",
  "machineOrEquipmentCost",
  "overheadPercent",
  "contingencyPercent",
  "targetGrossMarginPercent",
];

const INPUT_LABELS: Record<keyof AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInputs, string> = {
  directMaterialCost: "directMaterialCost",
  directLaborCost: "directLaborCost",
  machineOrEquipmentCost: "machineOrEquipmentCost",
  overheadPercent: "overheadPercent",
  contingencyPercent: "contingencyPercent",
  targetGrossMarginPercent: "targetGrossMarginPercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of ANDON_SISTEMI_DURUS_VE_TEPKI_SURESI_MALIYET_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.directMaterialCost < 0 || inputs.directMaterialCost > 1000000) {
    errors.push("directMaterialCost must be between 0 and 1000000.");
  }

  if (inputs.directLaborCost < 0 || inputs.directLaborCost > 1000000) {
    errors.push("directLaborCost must be between 0 and 1000000.");
  }

  if (inputs.machineOrEquipmentCost < 0 || inputs.machineOrEquipmentCost > 1000000) {
    errors.push("machineOrEquipmentCost must be between 0 and 1000000.");
  }

  if (inputs.overheadPercent < 0 || inputs.overheadPercent > 100) {
    errors.push("overheadPercent must be between 0 and 100.");
  }

  if (inputs.contingencyPercent < 0 || inputs.contingencyPercent > 100) {
    errors.push("contingencyPercent must be between 0 and 100.");
  }

  if (inputs.targetGrossMarginPercent < 0 || inputs.targetGrossMarginPercent > 100) {
    errors.push("targetGrossMarginPercent must be between 0 and 100.");
  }

  if (inputs.targetGrossMarginPercent <= 0) {
    errors.push("targetGrossMarginPercent must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateAndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInputs(inputs: AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInputs): AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorValidationResult {
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
