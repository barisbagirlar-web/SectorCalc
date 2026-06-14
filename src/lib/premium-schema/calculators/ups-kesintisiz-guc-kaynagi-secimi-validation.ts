export type UpsKesintisizGucKaynagiSecimiInputs = {
  totalLoadVA: number;
  diversityFactorPercent: number;
  expansionMarginPercent: number;
  requiredAutonomyMinutes: number;
  dcBusVoltage: number;
  inverterEfficiencyPercent: number;
};

export type UpsKesintisizGucKaynagiSecimiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const UPS_KESINTISIZ_GUC_KAYNAGI_SECIMI_INPUT_KEYS: readonly (keyof UpsKesintisizGucKaynagiSecimiInputs)[] = [
  "totalLoadVA",
  "diversityFactorPercent",
  "expansionMarginPercent",
  "requiredAutonomyMinutes",
  "dcBusVoltage",
  "inverterEfficiencyPercent",
];

const INPUT_LABELS: Record<keyof UpsKesintisizGucKaynagiSecimiInputs, string> = {
  totalLoadVA: "totalLoadVA",
  diversityFactorPercent: "diversityFactorPercent",
  expansionMarginPercent: "expansionMarginPercent",
  requiredAutonomyMinutes: "requiredAutonomyMinutes",
  dcBusVoltage: "dcBusVoltage",
  inverterEfficiencyPercent: "inverterEfficiencyPercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: UpsKesintisizGucKaynagiSecimiInputs): string[] {
  const errors: string[] = [];

  for (const key of UPS_KESINTISIZ_GUC_KAYNAGI_SECIMI_INPUT_KEYS) {
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

  if (inputs.totalLoadVA < 1 || inputs.totalLoadVA > 10000000) {
    errors.push("totalLoadVA must be between 1 and 10000000.");
  }

  if (inputs.totalLoadVA <= 0) {
    errors.push("totalLoadVA must be greater than zero.");
  }

  if (inputs.diversityFactorPercent < 0 || inputs.diversityFactorPercent > 100) {
    errors.push("diversityFactorPercent must be between 0 and 100.");
  }

  if (inputs.expansionMarginPercent < 0 || inputs.expansionMarginPercent > 100) {
    errors.push("expansionMarginPercent must be between 0 and 100.");
  }

  if (inputs.requiredAutonomyMinutes < 1 || inputs.requiredAutonomyMinutes > 1440) {
    errors.push("requiredAutonomyMinutes must be between 1 and 1440.");
  }

  if (inputs.requiredAutonomyMinutes <= 0) {
    errors.push("requiredAutonomyMinutes must be greater than zero.");
  }

  if (inputs.dcBusVoltage < 12 || inputs.dcBusVoltage > 600) {
    errors.push("dcBusVoltage must be between 12 and 600.");
  }

  if (inputs.dcBusVoltage <= 0) {
    errors.push("dcBusVoltage must be greater than zero.");
  }

  if (inputs.inverterEfficiencyPercent < 0 || inputs.inverterEfficiencyPercent > 100) {
    errors.push("inverterEfficiencyPercent must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: UpsKesintisizGucKaynagiSecimiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateUpsKesintisizGucKaynagiSecimiInputs(inputs: UpsKesintisizGucKaynagiSecimiInputs): UpsKesintisizGucKaynagiSecimiValidationResult {
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
