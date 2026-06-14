export type RadyatorPetekBoyuHesaplamaInputs = {
  roomLength: number;
  roomWidth: number;
  roomHeight: number;
  heatDemandPerVolume: number;
  panelType: number;
  flowTemperature: number;
};

export type RadyatorPetekBoyuHesaplamaValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const RADYATOR_PETEK_BOYU_HESAPLAMA_INPUT_KEYS: readonly (keyof RadyatorPetekBoyuHesaplamaInputs)[] = [
  "roomLength",
  "roomWidth",
  "roomHeight",
  "heatDemandPerVolume",
  "panelType",
  "flowTemperature",
];

const INPUT_LABELS: Record<keyof RadyatorPetekBoyuHesaplamaInputs, string> = {
  roomLength: "roomLength",
  roomWidth: "roomWidth",
  roomHeight: "roomHeight",
  heatDemandPerVolume: "heatDemandPerVolume",
  panelType: "panelType",
  flowTemperature: "flowTemperature",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: RadyatorPetekBoyuHesaplamaInputs): string[] {
  const errors: string[] = [];

  for (const key of RADYATOR_PETEK_BOYU_HESAPLAMA_INPUT_KEYS) {
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

  if (inputs.roomLength < 0.1 || inputs.roomLength > 100) {
    errors.push("roomLength must be between 0.1 and 100.");
  }

  if (inputs.roomLength <= 0) {
    errors.push("roomLength must be greater than zero.");
  }

  if (inputs.roomWidth < 0.1 || inputs.roomWidth > 100) {
    errors.push("roomWidth must be between 0.1 and 100.");
  }

  if (inputs.roomWidth <= 0) {
    errors.push("roomWidth must be greater than zero.");
  }

  if (inputs.roomHeight < 0.1 || inputs.roomHeight > 10) {
    errors.push("roomHeight must be between 0.1 and 10.");
  }

  if (inputs.roomHeight <= 0) {
    errors.push("roomHeight must be greater than zero.");
  }

  if (inputs.heatDemandPerVolume < 10 || inputs.heatDemandPerVolume > 200) {
    errors.push("heatDemandPerVolume must be between 10 and 200.");
  }

  if (inputs.heatDemandPerVolume <= 0) {
    errors.push("heatDemandPerVolume must be greater than zero.");
  }

  if (inputs.panelType < 0) {
    errors.push("panelType must be greater than or equal to zero.");
  }

  if (inputs.flowTemperature < 30 || inputs.flowTemperature > 90) {
    errors.push("flowTemperature must be between 30 and 90.");
  }

  if (inputs.flowTemperature <= 0) {
    errors.push("flowTemperature must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: RadyatorPetekBoyuHesaplamaInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateRadyatorPetekBoyuHesaplamaInputs(inputs: RadyatorPetekBoyuHesaplamaInputs): RadyatorPetekBoyuHesaplamaValidationResult {
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
