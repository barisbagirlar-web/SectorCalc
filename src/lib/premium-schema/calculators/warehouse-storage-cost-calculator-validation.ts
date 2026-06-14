export type WarehouseStorageCostCalculatorInputs = {
  storageAreaUsed: number;
  storageCostPerSqMeterPerDay: number;
  storageDays: number;
  handlingCostPerShipment: number;
  shipmentCount: number;
  driverHourlyRate: number;
};

export type WarehouseStorageCostCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const WAREHOUSE_STORAGE_COST_CALCULATOR_INPUT_KEYS: readonly (keyof WarehouseStorageCostCalculatorInputs)[] = [
  "storageAreaUsed",
  "storageCostPerSqMeterPerDay",
  "storageDays",
  "handlingCostPerShipment",
  "shipmentCount",
  "driverHourlyRate",
];

const INPUT_LABELS: Record<keyof WarehouseStorageCostCalculatorInputs, string> = {
  storageAreaUsed: "storageAreaUsed",
  storageCostPerSqMeterPerDay: "storageCostPerSqMeterPerDay",
  storageDays: "storageDays",
  handlingCostPerShipment: "handlingCostPerShipment",
  shipmentCount: "shipmentCount",
  driverHourlyRate: "driverHourlyRate",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: WarehouseStorageCostCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of WAREHOUSE_STORAGE_COST_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.storageAreaUsed < 0 || inputs.storageAreaUsed > 100000) {
    errors.push("storageAreaUsed must be between 0 and 100000.");
  }

  if (inputs.storageCostPerSqMeterPerDay < 0 || inputs.storageCostPerSqMeterPerDay > 100) {
    errors.push("storageCostPerSqMeterPerDay must be between 0 and 100.");
  }

  if (inputs.storageCostPerSqMeterPerDay <= 0) {
    errors.push("storageCostPerSqMeterPerDay must be greater than zero.");
  }

  if (inputs.storageDays < 1 || inputs.storageDays > 365) {
    errors.push("storageDays must be between 1 and 365.");
  }

  if (inputs.storageDays <= 0) {
    errors.push("storageDays must be greater than zero.");
  }

  if (inputs.handlingCostPerShipment < 0 || inputs.handlingCostPerShipment > 10000) {
    errors.push("handlingCostPerShipment must be between 0 and 10000.");
  }

  if (inputs.shipmentCount < 1 || inputs.shipmentCount > 100000) {
    errors.push("shipmentCount must be between 1 and 100000.");
  }

  if (inputs.shipmentCount <= 0) {
    errors.push("shipmentCount must be greater than zero.");
  }

  if (inputs.driverHourlyRate < 0 || inputs.driverHourlyRate > 200) {
    errors.push("driverHourlyRate must be between 0 and 200.");
  }

  return errors;
}

function collectWarnings(inputs: WarehouseStorageCostCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateWarehouseStorageCostCalculatorInputs(inputs: WarehouseStorageCostCalculatorInputs): WarehouseStorageCostCalculatorValidationResult {
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
