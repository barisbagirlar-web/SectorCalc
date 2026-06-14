export type IsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiInputs = {
  numberOfWorkers: number;
  usageRatePerPeriod: number;
  unitCost: number;
  wasteRatePercent: number;
  overheadRatePercent: number;
  productionQuantity: number;
};

export type IsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const IS_ELBISESI_KKD_KISISEL_KORUYUCU_DONANIM_SARFIYATI_INPUT_KEYS: readonly (keyof IsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiInputs)[] = [
  "numberOfWorkers",
  "usageRatePerPeriod",
  "unitCost",
  "wasteRatePercent",
  "overheadRatePercent",
  "productionQuantity",
];

const INPUT_LABELS: Record<keyof IsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiInputs, string> = {
  numberOfWorkers: "numberOfWorkers",
  usageRatePerPeriod: "usageRatePerPeriod",
  unitCost: "unitCost",
  wasteRatePercent: "wasteRatePercent",
  overheadRatePercent: "overheadRatePercent",
  productionQuantity: "productionQuantity",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: IsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiInputs): string[] {
  const errors: string[] = [];

  for (const key of IS_ELBISESI_KKD_KISISEL_KORUYUCU_DONANIM_SARFIYATI_INPUT_KEYS) {
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

  if (inputs.numberOfWorkers < 1 || inputs.numberOfWorkers > 10000) {
    errors.push("numberOfWorkers must be between 1 and 10000.");
  }

  if (inputs.numberOfWorkers <= 0) {
    errors.push("numberOfWorkers must be greater than zero.");
  }

  if (inputs.usageRatePerPeriod < 0.01 || inputs.usageRatePerPeriod > 100) {
    errors.push("usageRatePerPeriod must be between 0.01 and 100.");
  }

  if (inputs.usageRatePerPeriod <= 0) {
    errors.push("usageRatePerPeriod must be greater than zero.");
  }

  if (inputs.unitCost < 0 || inputs.unitCost > 10000) {
    errors.push("unitCost must be between 0 and 10000.");
  }

  if (inputs.wasteRatePercent < 0 || inputs.wasteRatePercent > 100) {
    errors.push("wasteRatePercent must be between 0 and 100.");
  }

  if (inputs.overheadRatePercent < 0 || inputs.overheadRatePercent > 100) {
    errors.push("overheadRatePercent must be between 0 and 100.");
  }

  if (inputs.productionQuantity < 1 || inputs.productionQuantity > 1000000) {
    errors.push("productionQuantity must be between 1 and 1000000.");
  }

  if (inputs.productionQuantity <= 0) {
    errors.push("productionQuantity must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: IsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateIsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiInputs(inputs: IsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiInputs): IsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiValidationResult {
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
