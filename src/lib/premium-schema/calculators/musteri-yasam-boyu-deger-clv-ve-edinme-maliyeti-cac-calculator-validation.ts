export type MusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorInputs = {
  totalRevenue: number;
  customerCount: number;
  grossMarginPercent: number;
  discountRate: number;
  retentionPeriods: number;
  totalAcquisitionCost: number;
};

export type MusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const MUSTERI_YASAM_BOYU_DEGER_CLV_VE_EDINME_MALIYETI_CAC_CALCULATOR_INPUT_KEYS: readonly (keyof MusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorInputs)[] = [
  "totalRevenue",
  "customerCount",
  "grossMarginPercent",
  "discountRate",
  "retentionPeriods",
  "totalAcquisitionCost",
];

const INPUT_LABELS: Record<keyof MusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorInputs, string> = {
  totalRevenue: "totalRevenue",
  customerCount: "customerCount",
  grossMarginPercent: "grossMarginPercent",
  discountRate: "discountRate",
  retentionPeriods: "retentionPeriods",
  totalAcquisitionCost: "totalAcquisitionCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: MusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of MUSTERI_YASAM_BOYU_DEGER_CLV_VE_EDINME_MALIYETI_CAC_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.totalRevenue < 0 || inputs.totalRevenue > 1000000000) {
    errors.push("totalRevenue must be between 0 and 1000000000.");
  }

  if (inputs.totalRevenue <= 0) {
    errors.push("totalRevenue must be greater than zero.");
  }

  if (inputs.customerCount < 1 || inputs.customerCount > 10000000) {
    errors.push("customerCount must be between 1 and 10000000.");
  }

  if (inputs.customerCount <= 0) {
    errors.push("customerCount must be greater than zero.");
  }

  if (inputs.grossMarginPercent < 0 || inputs.grossMarginPercent > 100) {
    errors.push("grossMarginPercent must be between 0 and 100.");
  }

  if (inputs.discountRate < 0 || inputs.discountRate > 100) {
    errors.push("discountRate must be between 0 and 100.");
  }

  if (inputs.discountRate <= 0) {
    errors.push("discountRate must be greater than zero.");
  }

  if (inputs.retentionPeriods < 1 || inputs.retentionPeriods > 120) {
    errors.push("retentionPeriods must be between 1 and 120.");
  }

  if (inputs.retentionPeriods <= 0) {
    errors.push("retentionPeriods must be greater than zero.");
  }

  if (inputs.totalAcquisitionCost < 0 || inputs.totalAcquisitionCost > 1000000000) {
    errors.push("totalAcquisitionCost must be between 0 and 1000000000.");
  }

  return errors;
}

function collectWarnings(inputs: MusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateMusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorInputs(inputs: MusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorInputs): MusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorValidationResult {
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
