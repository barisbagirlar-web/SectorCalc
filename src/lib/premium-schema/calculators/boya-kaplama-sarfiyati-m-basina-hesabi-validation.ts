export type BoyaKaplamaSarfiyatiMBasinaHesabiInputs = {
  jobArea: number;
  dryFilmThickness: number;
  volumeSolidsPercent: number;
  applicationLossFactor: number;
  unitPaintCost: number;
  laborHours: number;
};

export type BoyaKaplamaSarfiyatiMBasinaHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const BOYA_KAPLAMA_SARFIYATI_M_BASINA_HESABI_INPUT_KEYS: readonly (keyof BoyaKaplamaSarfiyatiMBasinaHesabiInputs)[] = [
  "jobArea",
  "dryFilmThickness",
  "volumeSolidsPercent",
  "applicationLossFactor",
  "unitPaintCost",
  "laborHours",
];

const INPUT_LABELS: Record<keyof BoyaKaplamaSarfiyatiMBasinaHesabiInputs, string> = {
  jobArea: "jobArea",
  dryFilmThickness: "dryFilmThickness",
  volumeSolidsPercent: "volumeSolidsPercent",
  applicationLossFactor: "applicationLossFactor",
  unitPaintCost: "unitPaintCost",
  laborHours: "laborHours",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: BoyaKaplamaSarfiyatiMBasinaHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of BOYA_KAPLAMA_SARFIYATI_M_BASINA_HESABI_INPUT_KEYS) {
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

  if (inputs.jobArea < 0.01 || inputs.jobArea > 100000) {
    errors.push("jobArea must be between 0.01 and 100000.");
  }

  if (inputs.jobArea <= 0) {
    errors.push("jobArea must be greater than zero.");
  }

  if (inputs.dryFilmThickness < 1 || inputs.dryFilmThickness > 1000) {
    errors.push("dryFilmThickness must be between 1 and 1000.");
  }

  if (inputs.dryFilmThickness <= 0) {
    errors.push("dryFilmThickness must be greater than zero.");
  }

  if (inputs.volumeSolidsPercent < 0 || inputs.volumeSolidsPercent > 100) {
    errors.push("volumeSolidsPercent must be between 0 and 100.");
  }

  if (inputs.volumeSolidsPercent <= 0) {
    errors.push("volumeSolidsPercent must be greater than zero.");
  }

  if (inputs.applicationLossFactor < 1 || inputs.applicationLossFactor > 2) {
    errors.push("applicationLossFactor must be between 1 and 2.");
  }

  if (inputs.applicationLossFactor <= 0) {
    errors.push("applicationLossFactor must be greater than zero.");
  }

  if (inputs.unitPaintCost < 0 || inputs.unitPaintCost > 1000) {
    errors.push("unitPaintCost must be between 0 and 1000.");
  }

  if (inputs.laborHours < 0 || inputs.laborHours > 1000) {
    errors.push("laborHours must be between 0 and 1000.");
  }

  return errors;
}

function collectWarnings(inputs: BoyaKaplamaSarfiyatiMBasinaHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateBoyaKaplamaSarfiyatiMBasinaHesabiInputs(inputs: BoyaKaplamaSarfiyatiMBasinaHesabiInputs): BoyaKaplamaSarfiyatiMBasinaHesabiValidationResult {
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
