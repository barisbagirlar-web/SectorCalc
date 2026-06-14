export type IsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorInputs = {
  heatTransferArea: number;
  heatDuty: number;
  lmtdClean: number;
  lmtdActual: number;
  maxFoulingFactor: number;
  operatingHoursPerYear: number;
};

export type IsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ISI_DEGISTIRICI_ESANJOR_KIRLENME_VE_VERIM_KAYBI_CALCULATOR_INPUT_KEYS: readonly (keyof IsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorInputs)[] = [
  "heatTransferArea",
  "heatDuty",
  "lmtdClean",
  "lmtdActual",
  "maxFoulingFactor",
  "operatingHoursPerYear",
];

const INPUT_LABELS: Record<keyof IsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorInputs, string> = {
  heatTransferArea: "heatTransferArea",
  heatDuty: "heatDuty",
  lmtdClean: "lmtdClean",
  lmtdActual: "lmtdActual",
  maxFoulingFactor: "maxFoulingFactor",
  operatingHoursPerYear: "operatingHoursPerYear",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: IsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of ISI_DEGISTIRICI_ESANJOR_KIRLENME_VE_VERIM_KAYBI_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.heatTransferArea < 0.01 || inputs.heatTransferArea > 10000) {
    errors.push("heatTransferArea must be between 0.01 and 10000.");
  }

  if (inputs.heatTransferArea <= 0) {
    errors.push("heatTransferArea must be greater than zero.");
  }

  if (inputs.heatDuty < 1 || inputs.heatDuty > 100000000) {
    errors.push("heatDuty must be between 1 and 100000000.");
  }

  if (inputs.heatDuty <= 0) {
    errors.push("heatDuty must be greater than zero.");
  }

  if (inputs.lmtdClean < 0.1 || inputs.lmtdClean > 500) {
    errors.push("lmtdClean must be between 0.1 and 500.");
  }

  if (inputs.lmtdClean <= 0) {
    errors.push("lmtdClean must be greater than zero.");
  }

  if (inputs.lmtdActual < 0.1 || inputs.lmtdActual > 500) {
    errors.push("lmtdActual must be between 0.1 and 500.");
  }

  if (inputs.lmtdActual <= 0) {
    errors.push("lmtdActual must be greater than zero.");
  }

  if (inputs.maxFoulingFactor < 0 || inputs.maxFoulingFactor > 0.01) {
    errors.push("maxFoulingFactor must be between 0 and 0.01.");
  }

  if (inputs.operatingHoursPerYear < 0 || inputs.operatingHoursPerYear > 8760) {
    errors.push("operatingHoursPerYear must be between 0 and 8760.");
  }

  return errors;
}

function collectWarnings(inputs: IsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateIsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorInputs(inputs: IsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorInputs): IsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorValidationResult {
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
