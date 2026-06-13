export type OeeEquipmentEffectivenessCalculatorInputs = {
  availability: number;
  performance: number;
  quality: number;
  machineRate: number;
  plannedHours: number;
  downtimeHours: number;
};

export type OeeEquipmentEffectivenessCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const OEE_EQUIPMENT_EFFECTIVENESS_CALCULATOR_INPUT_KEYS: readonly (keyof OeeEquipmentEffectivenessCalculatorInputs)[] = [
  "availability",
  "performance",
  "quality",
  "machineRate",
  "plannedHours",
  "downtimeHours",
];

const INPUT_LABELS: Record<keyof OeeEquipmentEffectivenessCalculatorInputs, string> = {
  availability: "availability",
  performance: "performance",
  quality: "quality",
  machineRate: "machineRate",
  plannedHours: "plannedHours",
  downtimeHours: "downtimeHours",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: OeeEquipmentEffectivenessCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of OEE_EQUIPMENT_EFFECTIVENESS_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.availability < 0 || inputs.availability > 100) {
    errors.push("availability must be between 0 and 100.");
  }

  if (inputs.performance < 0 || inputs.performance > 100) {
    errors.push("performance must be between 0 and 100.");
  }

  if (inputs.quality < 0 || inputs.quality > 100) {
    errors.push("quality must be between 0 and 100.");
  }

  if (inputs.machineRate < 0) {
    errors.push("machineRate must be greater than or equal to zero.");
  }

  if (inputs.plannedHours < 0) {
    errors.push("plannedHours must be greater than or equal to zero.");
  }

  if (inputs.plannedHours <= 0) {
    errors.push("plannedHours must be greater than zero.");
  }

  if (inputs.downtimeHours < 0) {
    errors.push("downtimeHours must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: OeeEquipmentEffectivenessCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateOeeEquipmentEffectivenessCalculatorInputs(inputs: OeeEquipmentEffectivenessCalculatorInputs): OeeEquipmentEffectivenessCalculatorValidationResult {
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
