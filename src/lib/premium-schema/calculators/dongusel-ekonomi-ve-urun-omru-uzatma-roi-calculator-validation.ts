export type DonguselEkonomiVeUrunOmruUzatmaRoiCalculatorInputs = {
  initialProductCost: number;
  originalLifespan: number;
  annualOperatingCost: number;
  refurbishmentCost: number;
  extendedLifespan: number;
};

export type DonguselEkonomiVeUrunOmruUzatmaRoiCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const DONGUSEL_EKONOMI_VE_URUN_OMRU_UZATMA_ROI_CALCULATOR_INPUT_KEYS: readonly (keyof DonguselEkonomiVeUrunOmruUzatmaRoiCalculatorInputs)[] = [
  "initialProductCost",
  "originalLifespan",
  "annualOperatingCost",
  "refurbishmentCost",
  "extendedLifespan",
];

const INPUT_LABELS: Record<keyof DonguselEkonomiVeUrunOmruUzatmaRoiCalculatorInputs, string> = {
  initialProductCost: "initialProductCost",
  originalLifespan: "originalLifespan",
  annualOperatingCost: "annualOperatingCost",
  refurbishmentCost: "refurbishmentCost",
  extendedLifespan: "extendedLifespan",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: DonguselEkonomiVeUrunOmruUzatmaRoiCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of DONGUSEL_EKONOMI_VE_URUN_OMRU_UZATMA_ROI_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.initialProductCost < 0 || inputs.initialProductCost > 10000000) {
    errors.push("initialProductCost must be between 0 and 10000000.");
  }

  if (inputs.originalLifespan < 1 || inputs.originalLifespan > 100) {
    errors.push("originalLifespan must be between 1 and 100.");
  }

  if (inputs.originalLifespan <= 0) {
    errors.push("originalLifespan must be greater than zero.");
  }

  if (inputs.annualOperatingCost < 0 || inputs.annualOperatingCost > 1000000) {
    errors.push("annualOperatingCost must be between 0 and 1000000.");
  }

  if (inputs.refurbishmentCost < 0.01 || inputs.refurbishmentCost > 10000000) {
    errors.push("refurbishmentCost must be between 0.01 and 10000000.");
  }

  if (inputs.refurbishmentCost <= 0) {
    errors.push("refurbishmentCost must be greater than zero.");
  }

  if (inputs.extendedLifespan < 1 || inputs.extendedLifespan > 100) {
    errors.push("extendedLifespan must be between 1 and 100.");
  }

  if (inputs.extendedLifespan <= 0) {
    errors.push("extendedLifespan must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: DonguselEkonomiVeUrunOmruUzatmaRoiCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateDonguselEkonomiVeUrunOmruUzatmaRoiCalculatorInputs(inputs: DonguselEkonomiVeUrunOmruUzatmaRoiCalculatorInputs): DonguselEkonomiVeUrunOmruUzatmaRoiCalculatorValidationResult {
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
