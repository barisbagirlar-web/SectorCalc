export type VidaSomunAdimDisUstuCapHesabiInputs = {
  nominalDiameter: number;
  pitch: number;
  threadClass: number;
};

export type VidaSomunAdimDisUstuCapHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const VIDA_SOMUN_ADIM_DIS_USTU_CAP_HESABI_INPUT_KEYS: readonly (keyof VidaSomunAdimDisUstuCapHesabiInputs)[] = [
  "nominalDiameter",
  "pitch",
  "threadClass",
];

const INPUT_LABELS: Record<keyof VidaSomunAdimDisUstuCapHesabiInputs, string> = {
  nominalDiameter: "nominalDiameter",
  pitch: "pitch",
  threadClass: "threadClass",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: VidaSomunAdimDisUstuCapHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of VIDA_SOMUN_ADIM_DIS_USTU_CAP_HESABI_INPUT_KEYS) {
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

  if (inputs.nominalDiameter < 1 || inputs.nominalDiameter > 1000) {
    errors.push("nominalDiameter must be between 1 and 1000.");
  }

  if (inputs.nominalDiameter <= 0) {
    errors.push("nominalDiameter must be greater than zero.");
  }

  if (inputs.pitch < 0.1 || inputs.pitch > 100) {
    errors.push("pitch must be between 0.1 and 100.");
  }

  if (inputs.pitch <= 0) {
    errors.push("pitch must be greater than zero.");
  }

  if (inputs.threadClass < 0) {
    errors.push("threadClass must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: VidaSomunAdimDisUstuCapHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateVidaSomunAdimDisUstuCapHesabiInputs(inputs: VidaSomunAdimDisUstuCapHesabiInputs): VidaSomunAdimDisUstuCapHesabiValidationResult {
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
