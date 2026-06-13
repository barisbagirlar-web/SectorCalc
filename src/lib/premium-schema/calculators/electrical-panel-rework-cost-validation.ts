export type ElectricalPanelReworkCostInputs = {
  panelRevenue: number;
  wiringHours: number;
  estimatedHours: number;
  laborRate: number;
  inspectionFailCost: number;
  testEquipmentCost: number;
};

export type ElectricalPanelReworkCostValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ELECTRICAL_PANEL_REWORK_COST_INPUT_KEYS: readonly (keyof ElectricalPanelReworkCostInputs)[] = [
  "panelRevenue",
  "wiringHours",
  "estimatedHours",
  "laborRate",
  "inspectionFailCost",
  "testEquipmentCost",
];

const INPUT_LABELS: Record<keyof ElectricalPanelReworkCostInputs, string> = {
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

function collectInputErrors(inputs: ElectricalPanelReworkCostInputs): string[] {
  const errors: string[] = [];

  for (const key of ELECTRICAL_PANEL_REWORK_COST_INPUT_KEYS) {
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

function collectWarnings(inputs: ElectricalPanelReworkCostInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateElectricalPanelReworkCostInputs(inputs: ElectricalPanelReworkCostInputs): ElectricalPanelReworkCostValidationResult {
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
