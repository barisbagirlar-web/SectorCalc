export type CelikRafDepoRafiYukKapasitesiInputs = {
  beamLength: number;
  beamWidth: number;
  beamHeight: number;
  columnHeight: number;
  numberOfLevels: number;
  numberOfColumns: number;
};

export type CelikRafDepoRafiYukKapasitesiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const CELIK_RAF_DEPO_RAFI_YUK_KAPASITESI_INPUT_KEYS: readonly (keyof CelikRafDepoRafiYukKapasitesiInputs)[] = [
  "beamLength",
  "beamWidth",
  "beamHeight",
  "columnHeight",
  "numberOfLevels",
  "numberOfColumns",
];

const INPUT_LABELS: Record<keyof CelikRafDepoRafiYukKapasitesiInputs, string> = {
  beamLength: "beamLength",
  beamWidth: "beamWidth",
  beamHeight: "beamHeight",
  columnHeight: "columnHeight",
  numberOfLevels: "numberOfLevels",
  numberOfColumns: "numberOfColumns",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: CelikRafDepoRafiYukKapasitesiInputs): string[] {
  const errors: string[] = [];

  for (const key of CELIK_RAF_DEPO_RAFI_YUK_KAPASITESI_INPUT_KEYS) {
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

  if (inputs.beamLength < 0.5 || inputs.beamLength > 5) {
    errors.push("beamLength must be between 0.5 and 5.");
  }

  if (inputs.beamLength <= 0) {
    errors.push("beamLength must be greater than zero.");
  }

  if (inputs.beamWidth < 0.05 || inputs.beamWidth > 0.3) {
    errors.push("beamWidth must be between 0.05 and 0.3.");
  }

  if (inputs.beamWidth <= 0) {
    errors.push("beamWidth must be greater than zero.");
  }

  if (inputs.beamHeight < 0.05 || inputs.beamHeight > 0.3) {
    errors.push("beamHeight must be between 0.05 and 0.3.");
  }

  if (inputs.beamHeight <= 0) {
    errors.push("beamHeight must be greater than zero.");
  }

  if (inputs.columnHeight < 1 || inputs.columnHeight > 15) {
    errors.push("columnHeight must be between 1 and 15.");
  }

  if (inputs.columnHeight <= 0) {
    errors.push("columnHeight must be greater than zero.");
  }

  if (inputs.numberOfLevels < 1 || inputs.numberOfLevels > 10) {
    errors.push("numberOfLevels must be between 1 and 10.");
  }

  if (inputs.numberOfLevels <= 0) {
    errors.push("numberOfLevels must be greater than zero.");
  }

  if (inputs.numberOfColumns < 2 || inputs.numberOfColumns > 50) {
    errors.push("numberOfColumns must be between 2 and 50.");
  }

  if (inputs.numberOfColumns <= 0) {
    errors.push("numberOfColumns must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: CelikRafDepoRafiYukKapasitesiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateCelikRafDepoRafiYukKapasitesiInputs(inputs: CelikRafDepoRafiYukKapasitesiInputs): CelikRafDepoRafiYukKapasitesiValidationResult {
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
