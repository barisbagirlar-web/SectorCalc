export type CobotVsManuelIscilikKarsilastirmaCalculatorInputs = {
  manualLaborHourlyRate: number;
  manualHoursPerYear: number;
  numberOfWorkers: number;
  cobotPurchasePrice: number;
  cobotDepreciationYears: number;
  cobotMaintenanceAnnual: number;
};

export type CobotVsManuelIscilikKarsilastirmaCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const COBOT_VS_MANUEL_ISCILIK_KARSILASTIRMA_CALCULATOR_INPUT_KEYS: readonly (keyof CobotVsManuelIscilikKarsilastirmaCalculatorInputs)[] = [
  "manualLaborHourlyRate",
  "manualHoursPerYear",
  "numberOfWorkers",
  "cobotPurchasePrice",
  "cobotDepreciationYears",
  "cobotMaintenanceAnnual",
];

const INPUT_LABELS: Record<keyof CobotVsManuelIscilikKarsilastirmaCalculatorInputs, string> = {
  manualLaborHourlyRate: "manualLaborHourlyRate",
  manualHoursPerYear: "manualHoursPerYear",
  numberOfWorkers: "numberOfWorkers",
  cobotPurchasePrice: "cobotPurchasePrice",
  cobotDepreciationYears: "cobotDepreciationYears",
  cobotMaintenanceAnnual: "cobotMaintenanceAnnual",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: CobotVsManuelIscilikKarsilastirmaCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of COBOT_VS_MANUEL_ISCILIK_KARSILASTIRMA_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.manualLaborHourlyRate < 0 || inputs.manualLaborHourlyRate > 200) {
    errors.push("manualLaborHourlyRate must be between 0 and 200.");
  }

  if (inputs.manualHoursPerYear < 1 || inputs.manualHoursPerYear > 8760) {
    errors.push("manualHoursPerYear must be between 1 and 8760.");
  }

  if (inputs.manualHoursPerYear <= 0) {
    errors.push("manualHoursPerYear must be greater than zero.");
  }

  if (inputs.numberOfWorkers < 1 || inputs.numberOfWorkers > 100) {
    errors.push("numberOfWorkers must be between 1 and 100.");
  }

  if (inputs.numberOfWorkers <= 0) {
    errors.push("numberOfWorkers must be greater than zero.");
  }

  if (inputs.cobotPurchasePrice < 0 || inputs.cobotPurchasePrice > 500000) {
    errors.push("cobotPurchasePrice must be between 0 and 500000.");
  }

  if (inputs.cobotDepreciationYears < 1 || inputs.cobotDepreciationYears > 20) {
    errors.push("cobotDepreciationYears must be between 1 and 20.");
  }

  if (inputs.cobotDepreciationYears <= 0) {
    errors.push("cobotDepreciationYears must be greater than zero.");
  }

  if (inputs.cobotMaintenanceAnnual < 0 || inputs.cobotMaintenanceAnnual > 50000) {
    errors.push("cobotMaintenanceAnnual must be between 0 and 50000.");
  }

  return errors;
}

function collectWarnings(inputs: CobotVsManuelIscilikKarsilastirmaCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateCobotVsManuelIscilikKarsilastirmaCalculatorInputs(inputs: CobotVsManuelIscilikKarsilastirmaCalculatorInputs): CobotVsManuelIscilikKarsilastirmaCalculatorValidationResult {
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
