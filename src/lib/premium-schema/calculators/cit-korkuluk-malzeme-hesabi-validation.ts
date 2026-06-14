export type CitKorkulukMalzemeHesabiInputs = {
  totalLength: number;
  postSpacing: number;
  numberOfRails: number;
  panelWidth: number;
  wasteFactorPercent: number;
  materialDensity: number;
};

export type CitKorkulukMalzemeHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const CIT_KORKULUK_MALZEME_HESABI_INPUT_KEYS: readonly (keyof CitKorkulukMalzemeHesabiInputs)[] = [
  "totalLength",
  "postSpacing",
  "numberOfRails",
  "panelWidth",
  "wasteFactorPercent",
  "materialDensity",
];

const INPUT_LABELS: Record<keyof CitKorkulukMalzemeHesabiInputs, string> = {
  totalLength: "totalLength",
  postSpacing: "postSpacing",
  numberOfRails: "numberOfRails",
  panelWidth: "panelWidth",
  wasteFactorPercent: "wasteFactorPercent",
  materialDensity: "materialDensity",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: CitKorkulukMalzemeHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of CIT_KORKULUK_MALZEME_HESABI_INPUT_KEYS) {
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

  if (inputs.totalLength < 0.1 || inputs.totalLength > 10000) {
    errors.push("totalLength must be between 0.1 and 10000.");
  }

  if (inputs.totalLength <= 0) {
    errors.push("totalLength must be greater than zero.");
  }

  if (inputs.postSpacing < 0.5 || inputs.postSpacing > 10) {
    errors.push("postSpacing must be between 0.5 and 10.");
  }

  if (inputs.postSpacing <= 0) {
    errors.push("postSpacing must be greater than zero.");
  }

  if (inputs.numberOfRails < 1 || inputs.numberOfRails > 10) {
    errors.push("numberOfRails must be between 1 and 10.");
  }

  if (inputs.numberOfRails <= 0) {
    errors.push("numberOfRails must be greater than zero.");
  }

  if (inputs.panelWidth < 0.01 || inputs.panelWidth > 5) {
    errors.push("panelWidth must be between 0.01 and 5.");
  }

  if (inputs.panelWidth <= 0) {
    errors.push("panelWidth must be greater than zero.");
  }

  if (inputs.wasteFactorPercent < 0 || inputs.wasteFactorPercent > 100) {
    errors.push("wasteFactorPercent must be between 0 and 100.");
  }

  if (inputs.materialDensity < 0 || inputs.materialDensity > 100000) {
    errors.push("materialDensity must be between 0 and 100000.");
  }

  return errors;
}

function collectWarnings(inputs: CitKorkulukMalzemeHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateCitKorkulukMalzemeHesabiInputs(inputs: CitKorkulukMalzemeHesabiInputs): CitKorkulukMalzemeHesabiValidationResult {
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
