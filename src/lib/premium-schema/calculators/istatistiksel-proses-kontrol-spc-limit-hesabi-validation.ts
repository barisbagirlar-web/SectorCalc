export type IstatistikselProsesKontrolSpcLimitHesabiInputs = {
  subgroupAverages: number;
  subgroupRanges: number;
  sampleSize: number;
};

export type IstatistikselProsesKontrolSpcLimitHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ISTATISTIKSEL_PROSES_KONTROL_SPC_LIMIT_HESABI_INPUT_KEYS: readonly (keyof IstatistikselProsesKontrolSpcLimitHesabiInputs)[] = [
  "subgroupAverages",
  "subgroupRanges",
  "sampleSize",
];

const INPUT_LABELS: Record<keyof IstatistikselProsesKontrolSpcLimitHesabiInputs, string> = {
  subgroupAverages: "subgroupAverages",
  subgroupRanges: "subgroupRanges",
  sampleSize: "sampleSize",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: IstatistikselProsesKontrolSpcLimitHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of ISTATISTIKSEL_PROSES_KONTROL_SPC_LIMIT_HESABI_INPUT_KEYS) {
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

  if (inputs.subgroupAverages < 0 || inputs.subgroupAverages > 1000000) {
    errors.push("subgroupAverages must be between 0 and 1000000.");
  }

  if (inputs.subgroupRanges < 0 || inputs.subgroupRanges > 1000000) {
    errors.push("subgroupRanges must be between 0 and 1000000.");
  }

  if (inputs.sampleSize < 2 || inputs.sampleSize > 25) {
    errors.push("sampleSize must be between 2 and 25.");
  }

  if (inputs.sampleSize <= 0) {
    errors.push("sampleSize must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: IstatistikselProsesKontrolSpcLimitHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateIstatistikselProsesKontrolSpcLimitHesabiInputs(inputs: IstatistikselProsesKontrolSpcLimitHesabiInputs): IstatistikselProsesKontrolSpcLimitHesabiValidationResult {
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
