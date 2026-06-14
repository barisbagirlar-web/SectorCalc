export type AltiSigmaDpmoSigmaSeviyesiCeviriciInputs = {
  totalUnits: number;
  totalDefects: number;
  opportunitiesPerUnit: number;
};

export type AltiSigmaDpmoSigmaSeviyesiCeviriciValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ALTI_SIGMA_DPMO_SIGMA_SEVIYESI_CEVIRICI_INPUT_KEYS: readonly (keyof AltiSigmaDpmoSigmaSeviyesiCeviriciInputs)[] = [
  "totalUnits",
  "totalDefects",
  "opportunitiesPerUnit",
];

const INPUT_LABELS: Record<keyof AltiSigmaDpmoSigmaSeviyesiCeviriciInputs, string> = {
  totalUnits: "totalUnits",
  totalDefects: "totalDefects",
  opportunitiesPerUnit: "opportunitiesPerUnit",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: AltiSigmaDpmoSigmaSeviyesiCeviriciInputs): string[] {
  const errors: string[] = [];

  for (const key of ALTI_SIGMA_DPMO_SIGMA_SEVIYESI_CEVIRICI_INPUT_KEYS) {
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

  if (inputs.totalUnits < 1 || inputs.totalUnits > 1000000000) {
    errors.push("totalUnits must be between 1 and 1000000000.");
  }

  if (inputs.totalUnits <= 0) {
    errors.push("totalUnits must be greater than zero.");
  }

  if (inputs.totalDefects < 0 || inputs.totalDefects > 1000000000) {
    errors.push("totalDefects must be between 0 and 1000000000.");
  }

  if (inputs.opportunitiesPerUnit < 1 || inputs.opportunitiesPerUnit > 10000) {
    errors.push("opportunitiesPerUnit must be between 1 and 10000.");
  }

  if (inputs.opportunitiesPerUnit <= 0) {
    errors.push("opportunitiesPerUnit must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: AltiSigmaDpmoSigmaSeviyesiCeviriciInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateAltiSigmaDpmoSigmaSeviyesiCeviriciInputs(inputs: AltiSigmaDpmoSigmaSeviyesiCeviriciInputs): AltiSigmaDpmoSigmaSeviyesiCeviriciValidationResult {
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
