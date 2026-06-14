export type KaynakMaliyetiVeDolguMetaliTuketimCalculatorInputs = {
  weldSize: number;
  weldLength: number;
  numberOfJoints: number;
  fillerDensity: number;
  depositionEfficiency: number;
  unitCostFiller: number;
};

export type KaynakMaliyetiVeDolguMetaliTuketimCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const KAYNAK_MALIYETI_VE_DOLGU_METALI_TUKETIM_CALCULATOR_INPUT_KEYS: readonly (keyof KaynakMaliyetiVeDolguMetaliTuketimCalculatorInputs)[] = [
  "weldSize",
  "weldLength",
  "numberOfJoints",
  "fillerDensity",
  "depositionEfficiency",
  "unitCostFiller",
];

const INPUT_LABELS: Record<keyof KaynakMaliyetiVeDolguMetaliTuketimCalculatorInputs, string> = {
  weldSize: "weldSize",
  weldLength: "weldLength",
  numberOfJoints: "numberOfJoints",
  fillerDensity: "fillerDensity",
  depositionEfficiency: "depositionEfficiency",
  unitCostFiller: "unitCostFiller",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: KaynakMaliyetiVeDolguMetaliTuketimCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of KAYNAK_MALIYETI_VE_DOLGU_METALI_TUKETIM_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.weldSize < 1 || inputs.weldSize > 100) {
    errors.push("weldSize must be between 1 and 100.");
  }

  if (inputs.weldSize <= 0) {
    errors.push("weldSize must be greater than zero.");
  }

  if (inputs.weldLength < 1 || inputs.weldLength > 10000) {
    errors.push("weldLength must be between 1 and 10000.");
  }

  if (inputs.weldLength <= 0) {
    errors.push("weldLength must be greater than zero.");
  }

  if (inputs.numberOfJoints < 1 || inputs.numberOfJoints > 100000) {
    errors.push("numberOfJoints must be between 1 and 100000.");
  }

  if (inputs.numberOfJoints <= 0) {
    errors.push("numberOfJoints must be greater than zero.");
  }

  if (inputs.fillerDensity < 1000 || inputs.fillerDensity > 20000) {
    errors.push("fillerDensity must be between 1000 and 20000.");
  }

  if (inputs.fillerDensity <= 0) {
    errors.push("fillerDensity must be greater than zero.");
  }

  if (inputs.depositionEfficiency < 0 || inputs.depositionEfficiency > 100) {
    errors.push("depositionEfficiency must be between 0 and 100.");
  }

  if (inputs.depositionEfficiency <= 0) {
    errors.push("depositionEfficiency must be greater than zero.");
  }

  if (inputs.unitCostFiller < 0 || inputs.unitCostFiller > 1000) {
    errors.push("unitCostFiller must be between 0 and 1000.");
  }

  return errors;
}

function collectWarnings(inputs: KaynakMaliyetiVeDolguMetaliTuketimCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateKaynakMaliyetiVeDolguMetaliTuketimCalculatorInputs(inputs: KaynakMaliyetiVeDolguMetaliTuketimCalculatorInputs): KaynakMaliyetiVeDolguMetaliTuketimCalculatorValidationResult {
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
