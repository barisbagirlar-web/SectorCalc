export type LandscapingContractProfitToolInputs = {
  dailyCrewCost: number;
  weatherDelayDays: number;
  dumpFees: number;
  warrantyReserve: number;
};

export type LandscapingContractProfitToolValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const LANDSCAPING_CONTRACT_PROFIT_TOOL_INPUT_KEYS: readonly (keyof LandscapingContractProfitToolInputs)[] = [
  "dailyCrewCost",
  "weatherDelayDays",
  "dumpFees",
  "warrantyReserve",
];

const INPUT_LABELS: Record<keyof LandscapingContractProfitToolInputs, string> = {
  dailyCrewCost: "dailyCrewCost",
  weatherDelayDays: "weatherDelayDays",
  dumpFees: "dumpFees",
  warrantyReserve: "warrantyReserve",
};

const summaryRule = {
  fieldId: "weatherDelayDays",
  warning: 3,
  critical: 8,
  direction: "higher_is_bad",
} as const;

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

  if (errors.length > 0) {
    return errors;
  }

  if (inputs.dailyCrewCost < 0) {
    errors.push("dailyCrewCost must be greater than or equal to zero.");
  }

  if (inputs.weatherDelayDays < 0) {
    errors.push("weatherDelayDays must be greater than or equal to zero.");
  }

  if (inputs.weatherDelayDays <= 0) {
    errors.push("weatherDelayDays must be greater than zero.");
  }

  if (inputs.dumpFees < 0) {
    errors.push("dumpFees must be greater than or equal to zero.");
  }

  if (inputs.warrantyReserve < 0) {
    errors.push("warrantyReserve must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: LandscapingContractProfitToolInputs): string[] {
  const warnings: string[] = [];

  if (inputs.weatherDelayDays >= summaryRule.warning) {
    warnings.push("Weather delay exposure is elevated — verify schedule buffer.");
  }

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
