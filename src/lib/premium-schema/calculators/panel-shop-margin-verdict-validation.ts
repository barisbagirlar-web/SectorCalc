export type PanelShopMarginVerdictInputs = {
  panelRevenue: number;
  wiringHours: number;
  estimatedHours: number;
  laborRate: number;
  inspectionFailCost: number;
  testEquipmentCost: number;
};

export type PanelShopMarginVerdictValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const PANEL_SHOP_MARGIN_VERDICT_INPUT_KEYS: readonly (keyof PanelShopMarginVerdictInputs)[] = [
  "panelRevenue",
  "wiringHours",
  "estimatedHours",
  "laborRate",
  "inspectionFailCost",
  "testEquipmentCost",
];

const INPUT_LABELS: Record<keyof PanelShopMarginVerdictInputs, string> = {
  panelRevenue: "panelRevenue",
  wiringHours: "wiringHours",
  estimatedHours: "estimatedHours",
  laborRate: "laborRate",
  inspectionFailCost: "inspectionFailCost",
  testEquipmentCost: "testEquipmentCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: PanelShopMarginVerdictInputs): string[] {
  const errors: string[] = [];

  for (const key of PANEL_SHOP_MARGIN_VERDICT_INPUT_KEYS) {
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

  if (inputs.panelRevenue < 0) {
    errors.push("panelRevenue must be greater than or equal to zero.");
  }

  if (inputs.panelRevenue <= 0) {
    errors.push("panelRevenue must be greater than zero.");
  }

  if (inputs.wiringHours < 0) {
    errors.push("wiringHours must be greater than or equal to zero.");
  }

  if (inputs.estimatedHours < 0) {
    errors.push("estimatedHours must be greater than or equal to zero.");
  }

  if (inputs.laborRate < 0) {
    errors.push("laborRate must be greater than or equal to zero.");
  }

  if (inputs.inspectionFailCost < 0) {
    errors.push("inspectionFailCost must be greater than or equal to zero.");
  }

  if (inputs.testEquipmentCost < 0) {
    errors.push("testEquipmentCost must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: PanelShopMarginVerdictInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validatePanelShopMarginVerdictInputs(inputs: PanelShopMarginVerdictInputs): PanelShopMarginVerdictValidationResult {
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
