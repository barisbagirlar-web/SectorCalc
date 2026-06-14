export type PompaGucuBasmaYuksekligiHesabiInputs = {
  flowRate: number;
  density: number;
  suctionPressure: number;
  dischargePressure: number;
  suctionVelocity: number;
  dischargeVelocity: number;
};

export type PompaGucuBasmaYuksekligiHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const POMPA_GUCU_BASMA_YUKSEKLIGI_HESABI_INPUT_KEYS: readonly (keyof PompaGucuBasmaYuksekligiHesabiInputs)[] = [
  "flowRate",
  "density",
  "suctionPressure",
  "dischargePressure",
  "suctionVelocity",
  "dischargeVelocity",
];

const INPUT_LABELS: Record<keyof PompaGucuBasmaYuksekligiHesabiInputs, string> = {
  flowRate: "flowRate",
  density: "density",
  suctionPressure: "suctionPressure",
  dischargePressure: "dischargePressure",
  suctionVelocity: "suctionVelocity",
  dischargeVelocity: "dischargeVelocity",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: PompaGucuBasmaYuksekligiHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of POMPA_GUCU_BASMA_YUKSEKLIGI_HESABI_INPUT_KEYS) {
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

  if (inputs.flowRate < 0.001 || inputs.flowRate > 100000) {
    errors.push("flowRate must be between 0.001 and 100000.");
  }

  if (inputs.flowRate <= 0) {
    errors.push("flowRate must be greater than zero.");
  }

  if (inputs.density < 1 || inputs.density > 20000) {
    errors.push("density must be between 1 and 20000.");
  }

  if (inputs.density <= 0) {
    errors.push("density must be greater than zero.");
  }

  if (inputs.suctionPressure < 0 || inputs.suctionPressure > 1000) {
    errors.push("suctionPressure must be between 0 and 1000.");
  }

  if (inputs.dischargePressure < 0 || inputs.dischargePressure > 1000) {
    errors.push("dischargePressure must be between 0 and 1000.");
  }

  if (inputs.suctionVelocity < 0 || inputs.suctionVelocity > 50) {
    errors.push("suctionVelocity must be between 0 and 50.");
  }

  if (inputs.dischargeVelocity < 0 || inputs.dischargeVelocity > 50) {
    errors.push("dischargeVelocity must be between 0 and 50.");
  }

  return errors;
}

function collectWarnings(inputs: PompaGucuBasmaYuksekligiHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validatePompaGucuBasmaYuksekligiHesabiInputs(inputs: PompaGucuBasmaYuksekligiHesabiInputs): PompaGucuBasmaYuksekligiHesabiValidationResult {
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
