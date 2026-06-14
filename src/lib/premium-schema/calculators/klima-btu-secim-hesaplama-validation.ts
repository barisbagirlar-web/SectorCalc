export type KlimaBtuSecimHesaplamaInputs = {
  roomArea: number;
  solarHeatGain: number;
  conductionHeatGain: number;
  internalHeatGain: number;
  occupants: number;
  insulationFactor: number;
};

export type KlimaBtuSecimHesaplamaValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const KLIMA_BTU_SECIM_HESAPLAMA_INPUT_KEYS: readonly (keyof KlimaBtuSecimHesaplamaInputs)[] = [
  "roomArea",
  "solarHeatGain",
  "conductionHeatGain",
  "internalHeatGain",
  "occupants",
  "insulationFactor",
];

const INPUT_LABELS: Record<keyof KlimaBtuSecimHesaplamaInputs, string> = {
  roomArea: "roomArea",
  solarHeatGain: "solarHeatGain",
  conductionHeatGain: "conductionHeatGain",
  internalHeatGain: "internalHeatGain",
  occupants: "occupants",
  insulationFactor: "insulationFactor",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: KlimaBtuSecimHesaplamaInputs): string[] {
  const errors: string[] = [];

  for (const key of KLIMA_BTU_SECIM_HESAPLAMA_INPUT_KEYS) {
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

  if (inputs.roomArea < 1 || inputs.roomArea > 1000) {
    errors.push("roomArea must be between 1 and 1000.");
  }

  if (inputs.roomArea <= 0) {
    errors.push("roomArea must be greater than zero.");
  }

  if (inputs.solarHeatGain < 0 || inputs.solarHeatGain > 500) {
    errors.push("solarHeatGain must be between 0 and 500.");
  }

  if (inputs.conductionHeatGain < 0 || inputs.conductionHeatGain > 200) {
    errors.push("conductionHeatGain must be between 0 and 200.");
  }

  if (inputs.internalHeatGain < 0 || inputs.internalHeatGain > 5000) {
    errors.push("internalHeatGain must be between 0 and 5000.");
  }

  if (inputs.occupants < 1 || inputs.occupants > 100) {
    errors.push("occupants must be between 1 and 100.");
  }

  if (inputs.occupants <= 0) {
    errors.push("occupants must be greater than zero.");
  }

  if (inputs.insulationFactor < 0.5 || inputs.insulationFactor > 2) {
    errors.push("insulationFactor must be between 0.5 and 2.");
  }

  if (inputs.insulationFactor <= 0) {
    errors.push("insulationFactor must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: KlimaBtuSecimHesaplamaInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateKlimaBtuSecimHesaplamaInputs(inputs: KlimaBtuSecimHesaplamaInputs): KlimaBtuSecimHesaplamaValidationResult {
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
