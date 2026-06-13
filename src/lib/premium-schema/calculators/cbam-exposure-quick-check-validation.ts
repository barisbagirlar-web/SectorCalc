export type CbamExposureQuickCheckInputs = {
  embeddedEmissionsTon: number;
  cbamCertificatePrice: number;
  eurTryRate: number;
  productQuantity: number;
  adminCost: number;
};

export type CbamExposureQuickCheckValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const CBAM_EXPOSURE_QUICK_CHECK_INPUT_KEYS: readonly (keyof CbamExposureQuickCheckInputs)[] = [
  "embeddedEmissionsTon",
  "cbamCertificatePrice",
  "eurTryRate",
  "productQuantity",
  "adminCost",
];

const INPUT_LABELS: Record<keyof CbamExposureQuickCheckInputs, string> = {
  embeddedEmissionsTon: "embeddedEmissionsTon",
  cbamCertificatePrice: "cbamCertificatePrice",
  eurTryRate: "eurTryRate",
  productQuantity: "productQuantity",
  adminCost: "adminCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: CbamExposureQuickCheckInputs): string[] {
  const errors: string[] = [];

  for (const key of CBAM_EXPOSURE_QUICK_CHECK_INPUT_KEYS) {
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

  if (inputs.embeddedEmissionsTon < 0) {
    errors.push("embeddedEmissionsTon must be greater than or equal to zero.");
  }

  if (inputs.cbamCertificatePrice < 0) {
    errors.push("cbamCertificatePrice must be greater than or equal to zero.");
  }

  if (inputs.eurTryRate < 0) {
    errors.push("eurTryRate must be greater than or equal to zero.");
  }

  if (inputs.eurTryRate <= 0) {
    errors.push("eurTryRate must be greater than zero.");
  }

  if (inputs.productQuantity < 0) {
    errors.push("productQuantity must be greater than or equal to zero.");
  }

  if (inputs.productQuantity <= 0) {
    errors.push("productQuantity must be greater than zero.");
  }

  if (inputs.adminCost < 0) {
    errors.push("adminCost must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: CbamExposureQuickCheckInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateCbamExposureQuickCheckInputs(inputs: CbamExposureQuickCheckInputs): CbamExposureQuickCheckValidationResult {
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
