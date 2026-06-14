export type FotokopiYaziciTonerSayfaMaliyetiInputs = {
  tonerPrice: number;
  tonerYield: number;
  drumPrice: number;
  drumYield: number;
  paperCostPerSheet: number;
  wasteRate: number;
};

export type FotokopiYaziciTonerSayfaMaliyetiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const FOTOKOPI_YAZICI_TONER_SAYFA_MALIYETI_INPUT_KEYS: readonly (keyof FotokopiYaziciTonerSayfaMaliyetiInputs)[] = [
  "tonerPrice",
  "tonerYield",
  "drumPrice",
  "drumYield",
  "paperCostPerSheet",
  "wasteRate",
];

const INPUT_LABELS: Record<keyof FotokopiYaziciTonerSayfaMaliyetiInputs, string> = {
  tonerPrice: "tonerPrice",
  tonerYield: "tonerYield",
  drumPrice: "drumPrice",
  drumYield: "drumYield",
  paperCostPerSheet: "paperCostPerSheet",
  wasteRate: "wasteRate",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: FotokopiYaziciTonerSayfaMaliyetiInputs): string[] {
  const errors: string[] = [];

  for (const key of FOTOKOPI_YAZICI_TONER_SAYFA_MALIYETI_INPUT_KEYS) {
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

  if (inputs.tonerPrice < 0 || inputs.tonerPrice > 10000) {
    errors.push("tonerPrice must be between 0 and 10000.");
  }

  if (inputs.tonerYield < 1 || inputs.tonerYield > 100000) {
    errors.push("tonerYield must be between 1 and 100000.");
  }

  if (inputs.tonerYield <= 0) {
    errors.push("tonerYield must be greater than zero.");
  }

  if (inputs.drumPrice < 0 || inputs.drumPrice > 10000) {
    errors.push("drumPrice must be between 0 and 10000.");
  }

  if (inputs.drumYield < 1 || inputs.drumYield > 100000) {
    errors.push("drumYield must be between 1 and 100000.");
  }

  if (inputs.drumYield <= 0) {
    errors.push("drumYield must be greater than zero.");
  }

  if (inputs.paperCostPerSheet < 0 || inputs.paperCostPerSheet > 10) {
    errors.push("paperCostPerSheet must be between 0 and 10.");
  }

  if (inputs.wasteRate < 0 || inputs.wasteRate > 100) {
    errors.push("wasteRate must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: FotokopiYaziciTonerSayfaMaliyetiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateFotokopiYaziciTonerSayfaMaliyetiInputs(inputs: FotokopiYaziciTonerSayfaMaliyetiInputs): FotokopiYaziciTonerSayfaMaliyetiValidationResult {
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
