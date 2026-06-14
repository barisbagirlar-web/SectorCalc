export type KazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorInputs = {
  numberOfAccidents: number;
  medicalCostPerAccident: number;
  propertyDamageCostPerAccident: number;
  lostTimeCostPerAccident: number;
  indirectMultiplier: number;
  annualRevenue: number;
};

export type KazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const KAZA_MALIYETI_DOGRUDAN_VE_DOLAYLI_TOPLAM_KAYIP_CALCULATOR_INPUT_KEYS: readonly (keyof KazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorInputs)[] = [
  "numberOfAccidents",
  "medicalCostPerAccident",
  "propertyDamageCostPerAccident",
  "lostTimeCostPerAccident",
  "indirectMultiplier",
  "annualRevenue",
];

const INPUT_LABELS: Record<keyof KazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorInputs, string> = {
  numberOfAccidents: "numberOfAccidents",
  medicalCostPerAccident: "medicalCostPerAccident",
  propertyDamageCostPerAccident: "propertyDamageCostPerAccident",
  lostTimeCostPerAccident: "lostTimeCostPerAccident",
  indirectMultiplier: "indirectMultiplier",
  annualRevenue: "annualRevenue",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: KazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of KAZA_MALIYETI_DOGRUDAN_VE_DOLAYLI_TOPLAM_KAYIP_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.numberOfAccidents < 1 || inputs.numberOfAccidents > 100000) {
    errors.push("numberOfAccidents must be between 1 and 100000.");
  }

  if (inputs.numberOfAccidents <= 0) {
    errors.push("numberOfAccidents must be greater than zero.");
  }

  if (inputs.medicalCostPerAccident < 0 || inputs.medicalCostPerAccident > 1000000) {
    errors.push("medicalCostPerAccident must be between 0 and 1000000.");
  }

  if (inputs.propertyDamageCostPerAccident < 0 || inputs.propertyDamageCostPerAccident > 1000000) {
    errors.push("propertyDamageCostPerAccident must be between 0 and 1000000.");
  }

  if (inputs.lostTimeCostPerAccident < 0 || inputs.lostTimeCostPerAccident > 1000000) {
    errors.push("lostTimeCostPerAccident must be between 0 and 1000000.");
  }

  if (inputs.indirectMultiplier < 1 || inputs.indirectMultiplier > 10) {
    errors.push("indirectMultiplier must be between 1 and 10.");
  }

  if (inputs.indirectMultiplier <= 0) {
    errors.push("indirectMultiplier must be greater than zero.");
  }

  if (inputs.annualRevenue < 1 || inputs.annualRevenue > 10000000000) {
    errors.push("annualRevenue must be between 1 and 10000000000.");
  }

  if (inputs.annualRevenue <= 0) {
    errors.push("annualRevenue must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: KazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateKazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorInputs(inputs: KazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorInputs): KazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorValidationResult {
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
