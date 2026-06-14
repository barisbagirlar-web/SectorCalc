export type AracKiraSatinAlmaKarsilastirmaInputs = {
  purchasePrice: number;
  monthlyLeasePayment: number;
  leaseTermMonths: number;
  leaseDownPayment: number;
  leaseEndFees: number;
  ownershipYears: number;
};

export type AracKiraSatinAlmaKarsilastirmaValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ARAC_KIRA_SATIN_ALMA_KARSILASTIRMA_INPUT_KEYS: readonly (keyof AracKiraSatinAlmaKarsilastirmaInputs)[] = [
  "purchasePrice",
  "monthlyLeasePayment",
  "leaseTermMonths",
  "leaseDownPayment",
  "leaseEndFees",
  "ownershipYears",
];

const INPUT_LABELS: Record<keyof AracKiraSatinAlmaKarsilastirmaInputs, string> = {
  purchasePrice: "purchasePrice",
  monthlyLeasePayment: "monthlyLeasePayment",
  leaseTermMonths: "leaseTermMonths",
  leaseDownPayment: "leaseDownPayment",
  leaseEndFees: "leaseEndFees",
  ownershipYears: "ownershipYears",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: AracKiraSatinAlmaKarsilastirmaInputs): string[] {
  const errors: string[] = [];

  for (const key of ARAC_KIRA_SATIN_ALMA_KARSILASTIRMA_INPUT_KEYS) {
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

  if (inputs.purchasePrice < 0 || inputs.purchasePrice > 1000000) {
    errors.push("purchasePrice must be between 0 and 1000000.");
  }

  if (inputs.monthlyLeasePayment < 0 || inputs.monthlyLeasePayment > 100000) {
    errors.push("monthlyLeasePayment must be between 0 and 100000.");
  }

  if (inputs.leaseTermMonths < 1 || inputs.leaseTermMonths > 120) {
    errors.push("leaseTermMonths must be between 1 and 120.");
  }

  if (inputs.leaseTermMonths <= 0) {
    errors.push("leaseTermMonths must be greater than zero.");
  }

  if (inputs.leaseDownPayment < 0 || inputs.leaseDownPayment > 100000) {
    errors.push("leaseDownPayment must be between 0 and 100000.");
  }

  if (inputs.leaseEndFees < 0 || inputs.leaseEndFees > 10000) {
    errors.push("leaseEndFees must be between 0 and 10000.");
  }

  if (inputs.ownershipYears < 1 || inputs.ownershipYears > 30) {
    errors.push("ownershipYears must be between 1 and 30.");
  }

  if (inputs.ownershipYears <= 0) {
    errors.push("ownershipYears must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: AracKiraSatinAlmaKarsilastirmaInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateAracKiraSatinAlmaKarsilastirmaInputs(inputs: AracKiraSatinAlmaKarsilastirmaInputs): AracKiraSatinAlmaKarsilastirmaValidationResult {
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
