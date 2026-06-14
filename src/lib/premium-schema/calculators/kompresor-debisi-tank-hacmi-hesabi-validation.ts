export type KompresorDebisiTankHacmiHesabiInputs = {
  totalAirConsumption: number;
  diversityFactor: number;
  compressorFlowRate: number;
  pressureDifferential: number;
  dutyCycle: number;
  allowablePressureDrop: number;
};

export type KompresorDebisiTankHacmiHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const KOMPRESOR_DEBISI_TANK_HACMI_HESABI_INPUT_KEYS: readonly (keyof KompresorDebisiTankHacmiHesabiInputs)[] = [
  "totalAirConsumption",
  "diversityFactor",
  "compressorFlowRate",
  "pressureDifferential",
  "dutyCycle",
  "allowablePressureDrop",
];

const INPUT_LABELS: Record<keyof KompresorDebisiTankHacmiHesabiInputs, string> = {
  totalAirConsumption: "totalAirConsumption",
  diversityFactor: "diversityFactor",
  compressorFlowRate: "compressorFlowRate",
  pressureDifferential: "pressureDifferential",
  dutyCycle: "dutyCycle",
  allowablePressureDrop: "allowablePressureDrop",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: KompresorDebisiTankHacmiHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of KOMPRESOR_DEBISI_TANK_HACMI_HESABI_INPUT_KEYS) {
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

  if (inputs.totalAirConsumption < 0.1 || inputs.totalAirConsumption > 10000) {
    errors.push("totalAirConsumption must be between 0.1 and 10000.");
  }

  if (inputs.totalAirConsumption <= 0) {
    errors.push("totalAirConsumption must be greater than zero.");
  }

  if (inputs.diversityFactor < 0 || inputs.diversityFactor > 100) {
    errors.push("diversityFactor must be between 0 and 100.");
  }

  if (inputs.compressorFlowRate < 0.1 || inputs.compressorFlowRate > 10000) {
    errors.push("compressorFlowRate must be between 0.1 and 10000.");
  }

  if (inputs.compressorFlowRate <= 0) {
    errors.push("compressorFlowRate must be greater than zero.");
  }

  if (inputs.pressureDifferential < 0.1 || inputs.pressureDifferential > 20) {
    errors.push("pressureDifferential must be between 0.1 and 20.");
  }

  if (inputs.pressureDifferential <= 0) {
    errors.push("pressureDifferential must be greater than zero.");
  }

  if (inputs.dutyCycle < 0 || inputs.dutyCycle > 100) {
    errors.push("dutyCycle must be between 0 and 100.");
  }

  if (inputs.allowablePressureDrop < 0.01 || inputs.allowablePressureDrop > 5) {
    errors.push("allowablePressureDrop must be between 0.01 and 5.");
  }

  if (inputs.allowablePressureDrop <= 0) {
    errors.push("allowablePressureDrop must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: KompresorDebisiTankHacmiHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateKompresorDebisiTankHacmiHesabiInputs(inputs: KompresorDebisiTankHacmiHesabiInputs): KompresorDebisiTankHacmiHesabiValidationResult {
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
