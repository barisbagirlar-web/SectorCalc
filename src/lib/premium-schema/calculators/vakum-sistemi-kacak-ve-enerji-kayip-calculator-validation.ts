export type VakumSistemiKacakVeEnerjiKayipCalculatorInputs = {
  powerKw: number;
  runtimeHours: number;
  operatingDays: number;
  tariffPerKwh: number;
  leakagePercent: number;
  investmentCost: number;
};

export type VakumSistemiKacakVeEnerjiKayipCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const VAKUM_SISTEMI_KACAK_VE_ENERJI_KAYIP_CALCULATOR_INPUT_KEYS: readonly (keyof VakumSistemiKacakVeEnerjiKayipCalculatorInputs)[] = [
  "powerKw",
  "runtimeHours",
  "operatingDays",
  "tariffPerKwh",
  "leakagePercent",
  "investmentCost",
];

const INPUT_LABELS: Record<keyof VakumSistemiKacakVeEnerjiKayipCalculatorInputs, string> = {
  powerKw: "powerKw",
  runtimeHours: "runtimeHours",
  operatingDays: "operatingDays",
  tariffPerKwh: "tariffPerKwh",
  leakagePercent: "leakagePercent",
  investmentCost: "investmentCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: VakumSistemiKacakVeEnerjiKayipCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of VAKUM_SISTEMI_KACAK_VE_ENERJI_KAYIP_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.powerKw < 0 || inputs.powerKw > 10000) {
    errors.push("powerKw must be between 0 and 10000.");
  }

  if (inputs.runtimeHours < 0 || inputs.runtimeHours > 24) {
    errors.push("runtimeHours must be between 0 and 24.");
  }

  if (inputs.operatingDays < 1 || inputs.operatingDays > 365) {
    errors.push("operatingDays must be between 1 and 365.");
  }

  if (inputs.operatingDays <= 0) {
    errors.push("operatingDays must be greater than zero.");
  }

  if (inputs.tariffPerKwh < 0 || inputs.tariffPerKwh > 10) {
    errors.push("tariffPerKwh must be between 0 and 10.");
  }

  if (inputs.leakagePercent < 0 || inputs.leakagePercent > 100) {
    errors.push("leakagePercent must be between 0 and 100.");
  }

  if (inputs.investmentCost < 0 || inputs.investmentCost > 1000000) {
    errors.push("investmentCost must be between 0 and 1000000.");
  }

  return errors;
}

function collectWarnings(inputs: VakumSistemiKacakVeEnerjiKayipCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateVakumSistemiKacakVeEnerjiKayipCalculatorInputs(inputs: VakumSistemiKacakVeEnerjiKayipCalculatorInputs): VakumSistemiKacakVeEnerjiKayipCalculatorValidationResult {
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
