export type SolarPanelOutputCalculatorInputs = {
  panelRating_kW: number;
  peakSunHours: number;
  performanceRatio: number;
  temperatureCoefficient: number;
  cellTemperature: number;
  inverterEfficiency: number;
};

export type SolarPanelOutputCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const SOLAR_PANEL_OUTPUT_CALCULATOR_INPUT_KEYS: readonly (keyof SolarPanelOutputCalculatorInputs)[] = [
  "panelRating_kW",
  "peakSunHours",
  "performanceRatio",
  "temperatureCoefficient",
  "cellTemperature",
  "inverterEfficiency",
];

const INPUT_LABELS: Record<keyof SolarPanelOutputCalculatorInputs, string> = {
  panelRating_kW: "panelRating_kW",
  peakSunHours: "peakSunHours",
  performanceRatio: "performanceRatio",
  temperatureCoefficient: "temperatureCoefficient",
  cellTemperature: "cellTemperature",
  inverterEfficiency: "inverterEfficiency",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: SolarPanelOutputCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of SOLAR_PANEL_OUTPUT_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.panelRating_kW < 0.001 || inputs.panelRating_kW > 1000) {
    errors.push("panelRating_kW must be between 0.001 and 1000.");
  }

  if (inputs.panelRating_kW <= 0) {
    errors.push("panelRating_kW must be greater than zero.");
  }

  if (inputs.peakSunHours < 0.5 || inputs.peakSunHours > 12) {
    errors.push("peakSunHours must be between 0.5 and 12.");
  }

  if (inputs.peakSunHours <= 0) {
    errors.push("peakSunHours must be greater than zero.");
  }

  if (inputs.performanceRatio < 0 || inputs.performanceRatio > 100) {
    errors.push("performanceRatio must be between 0 and 100.");
  }

  if (inputs.performanceRatio <= 0) {
    errors.push("performanceRatio must be greater than zero.");
  }

  if (inputs.temperatureCoefficient < -0.6 || inputs.temperatureCoefficient > -0.2) {
    errors.push("temperatureCoefficient must be between -0.6 and -0.2.");
  }

  if (inputs.cellTemperature < -10 || inputs.cellTemperature > 80) {
    errors.push("cellTemperature must be between -10 and 80.");
  }

  if (inputs.inverterEfficiency < 0 || inputs.inverterEfficiency > 100) {
    errors.push("inverterEfficiency must be between 0 and 100.");
  }

  if (inputs.inverterEfficiency <= 0) {
    errors.push("inverterEfficiency must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: SolarPanelOutputCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateSolarPanelOutputCalculatorInputs(inputs: SolarPanelOutputCalculatorInputs): SolarPanelOutputCalculatorValidationResult {
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
