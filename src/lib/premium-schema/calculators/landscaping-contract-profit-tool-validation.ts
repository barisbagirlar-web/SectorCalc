export type LandscapingContractProfitToolInputs = {
  crewHoursPerVisit: number;
  laborRate: number;
  fuelCostPerVisit: number;
  supplyCostPerMonth: number;
  visitsPerMonth: number;
  equipmentWearCost: number;
  targetMargin: number;
};

export type LandscapingContractProfitToolValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const LANDSCAPING_CONTRACT_PROFIT_TOOL_INPUT_KEYS: readonly (keyof LandscapingContractProfitToolInputs)[] = [
  "crewHoursPerVisit",
  "laborRate",
  "fuelCostPerVisit",
  "supplyCostPerMonth",
  "visitsPerMonth",
  "equipmentWearCost",
  "targetMargin",
];

const INPUT_LABELS: Record<keyof LandscapingContractProfitToolInputs, string> = {
  crewHoursPerVisit: "crewHoursPerVisit",
  laborRate: "laborRate",
  fuelCostPerVisit: "fuelCostPerVisit",
  supplyCostPerMonth: "supplyCostPerMonth",
  visitsPerMonth: "visitsPerMonth",
  equipmentWearCost: "equipmentWearCost",
  targetMargin: "targetMargin",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: LandscapingContractProfitToolInputs): string[] {
  const errors: string[] = [];
  for (const key of LANDSCAPING_CONTRACT_PROFIT_TOOL_INPUT_KEYS) {
    const value = inputs[key];
    if (value === undefined || value === null) {
      errors.push(`${INPUT_LABELS[key]} is required.`);
      continue;
    }
    if (!isValidNumber(value)) {
      errors.push(`${INPUT_LABELS[key]} must be a finite number.`);
    }
  }
  return errors;
}

function collectWarnings(inputs: LandscapingContractProfitToolInputs): string[] {
  const warnings: string[] = [];
  return warnings;
}

export function validateLandscapingContractProfitToolInputs(inputs: LandscapingContractProfitToolInputs): LandscapingContractProfitToolValidationResult {
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
