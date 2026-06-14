export type EnjeksiyonDokumCekmePayiHesabiInputs = {
  nominalPartDimension: number;
  shrinkageRatePercent: number;
  materialCorrectionFactor: number;
};

export type EnjeksiyonDokumCekmePayiHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ENJEKSIYON_DOKUM_CEKME_PAYI_HESABI_INPUT_KEYS: readonly (keyof EnjeksiyonDokumCekmePayiHesabiInputs)[] = [
  "nominalPartDimension",
  "shrinkageRatePercent",
  "materialCorrectionFactor",
];

const INPUT_LABELS: Record<keyof EnjeksiyonDokumCekmePayiHesabiInputs, string> = {
  nominalPartDimension: "nominalPartDimension",
  shrinkageRatePercent: "shrinkageRatePercent",
  materialCorrectionFactor: "materialCorrectionFactor",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: EnjeksiyonDokumCekmePayiHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of ENJEKSIYON_DOKUM_CEKME_PAYI_HESABI_INPUT_KEYS) {
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

  if (inputs.nominalPartDimension < 0.1 || inputs.nominalPartDimension > 10000) {
    errors.push("nominalPartDimension must be between 0.1 and 10000.");
  }

  if (inputs.nominalPartDimension <= 0) {
    errors.push("nominalPartDimension must be greater than zero.");
  }

  if (inputs.shrinkageRatePercent < 0 || inputs.shrinkageRatePercent > 100) {
    errors.push("shrinkageRatePercent must be between 0 and 100.");
  }

  if (inputs.materialCorrectionFactor < 0.5 || inputs.materialCorrectionFactor > 2) {
    errors.push("materialCorrectionFactor must be between 0.5 and 2.");
  }

  if (inputs.materialCorrectionFactor <= 0) {
    errors.push("materialCorrectionFactor must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: EnjeksiyonDokumCekmePayiHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateEnjeksiyonDokumCekmePayiHesabiInputs(inputs: EnjeksiyonDokumCekmePayiHesabiInputs): EnjeksiyonDokumCekmePayiHesabiValidationResult {
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
