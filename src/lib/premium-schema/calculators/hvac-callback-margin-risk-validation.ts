export type HvacCallbackMarginRiskInputs = {
  projectRevenue: number;
  ductworkVariance: number;
  commissioningHours: number;
  laborRate: number;
  callbackRiskPercent: number;
};

export type HvacCallbackMarginRiskValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const HVAC_CALLBACK_MARGIN_RISK_INPUT_KEYS: readonly (keyof HvacCallbackMarginRiskInputs)[] =
  [
    "projectRevenue",
    "ductworkVariance",
    "commissioningHours",
    "laborRate",
    "callbackRiskPercent",
  ];

const INPUT_LABELS: Record<keyof HvacCallbackMarginRiskInputs, string> = {
  projectRevenue: "projectRevenue",
  ductworkVariance: "ductworkVariance",
  commissioningHours: "commissioningHours",
  laborRate: "laborRate",
  callbackRiskPercent: "callbackRiskPercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: HvacCallbackMarginRiskInputs): string[] {
  const errors: string[] = [];

  for (const key of HVAC_CALLBACK_MARGIN_RISK_INPUT_KEYS) {
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

  if (inputs.projectRevenue <= 0) {
    errors.push("projectRevenue must be greater than zero.");
  }
  if (inputs.ductworkVariance < 0) {
    errors.push("ductworkVariance must be greater than or equal to zero.");
  }
  if (inputs.commissioningHours < 0) {
    errors.push("commissioningHours must be greater than or equal to zero.");
  }
  if (inputs.laborRate < 0) {
    errors.push("laborRate must be greater than or equal to zero.");
  }
  if (inputs.callbackRiskPercent < 0 || inputs.callbackRiskPercent > 100) {
    errors.push("callbackRiskPercent must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: HvacCallbackMarginRiskInputs): string[] {
  const warnings: string[] = [];
  const commissioningCost = inputs.commissioningHours * inputs.laborRate;
  const callbackRiskCost = inputs.projectRevenue * (inputs.callbackRiskPercent / 100);
  const totalExposure = inputs.ductworkVariance + commissioningCost + callbackRiskCost;
  const marginPressure = (totalExposure / inputs.projectRevenue) * 100;

  if (inputs.callbackRiskPercent >= 3) {
    warnings.push(
      "Callback risk is elevated — verify commissioning and duct assumptions.",
    );
  }

  if (marginPressure >= 5) {
    warnings.push("Margin pressure is building on this project envelope.");
  }

  if (inputs.commissioningHours >= 24 && inputs.laborRate > 0) {
    warnings.push(
      "Commissioning hours are elevated. Confirm start-up and balance scope before final bid.",
    );
  }

  return warnings;
}

export function validateHvacCallbackMarginRiskInputs(
  inputs: HvacCallbackMarginRiskInputs,
): HvacCallbackMarginRiskValidationResult {
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
