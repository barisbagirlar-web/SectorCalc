export type RoofingWeatherDelayRiskInputs = {
  dailyCrewCost: number;
  weatherDelayDays: number;
  dumpFees: number;
  warrantyReserve: number;
};

export type RoofingWeatherDelayRiskValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ROOFING_WEATHER_DELAY_RISK_INPUT_KEYS: readonly (keyof RoofingWeatherDelayRiskInputs)[] = [
  "dailyCrewCost",
  "weatherDelayDays",
  "dumpFees",
  "warrantyReserve",
];

const INPUT_LABELS: Record<keyof RoofingWeatherDelayRiskInputs, string> = {
  dailyCrewCost: "dailyCrewCost",
  weatherDelayDays: "weatherDelayDays",
  dumpFees: "dumpFees",
  warrantyReserve: "warrantyReserve",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: RoofingWeatherDelayRiskInputs): string[] {
  const errors: string[] = [];

  for (const key of ROOFING_WEATHER_DELAY_RISK_INPUT_KEYS) {
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

function collectWarnings(inputs: RoofingWeatherDelayRiskInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateRoofingWeatherDelayRiskInputs(inputs: RoofingWeatherDelayRiskInputs): RoofingWeatherDelayRiskValidationResult {
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
