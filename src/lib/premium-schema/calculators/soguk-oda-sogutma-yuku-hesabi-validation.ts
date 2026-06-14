export type SogukOdaSogutmaYukuHesabiInputs = {
  roomLength: number;
  roomWidth: number;
  roomHeight: number;
  wallUValue: number;
  ceilingUValue: number;
  floorUValue: number;
};

export type SogukOdaSogutmaYukuHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const SOGUK_ODA_SOGUTMA_YUKU_HESABI_INPUT_KEYS: readonly (keyof SogukOdaSogutmaYukuHesabiInputs)[] = [
  "roomLength",
  "roomWidth",
  "roomHeight",
  "wallUValue",
  "ceilingUValue",
  "floorUValue",
];

const INPUT_LABELS: Record<keyof SogukOdaSogutmaYukuHesabiInputs, string> = {
  roomLength: "roomLength",
  roomWidth: "roomWidth",
  roomHeight: "roomHeight",
  wallUValue: "wallUValue",
  ceilingUValue: "ceilingUValue",
  floorUValue: "floorUValue",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: SogukOdaSogutmaYukuHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of SOGUK_ODA_SOGUTMA_YUKU_HESABI_INPUT_KEYS) {
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

  if (inputs.roomLength < 0.1 || inputs.roomLength > 100) {
    errors.push("roomLength must be between 0.1 and 100.");
  }

  if (inputs.roomLength <= 0) {
    errors.push("roomLength must be greater than zero.");
  }

  if (inputs.roomWidth < 0.1 || inputs.roomWidth > 100) {
    errors.push("roomWidth must be between 0.1 and 100.");
  }

  if (inputs.roomWidth <= 0) {
    errors.push("roomWidth must be greater than zero.");
  }

  if (inputs.roomHeight < 0.1 || inputs.roomHeight > 20) {
    errors.push("roomHeight must be between 0.1 and 20.");
  }

  if (inputs.roomHeight <= 0) {
    errors.push("roomHeight must be greater than zero.");
  }

  if (inputs.wallUValue < 0.1 || inputs.wallUValue > 5) {
    errors.push("wallUValue must be between 0.1 and 5.");
  }

  if (inputs.wallUValue <= 0) {
    errors.push("wallUValue must be greater than zero.");
  }

  if (inputs.ceilingUValue < 0.1 || inputs.ceilingUValue > 5) {
    errors.push("ceilingUValue must be between 0.1 and 5.");
  }

  if (inputs.ceilingUValue <= 0) {
    errors.push("ceilingUValue must be greater than zero.");
  }

  if (inputs.floorUValue < 0.1 || inputs.floorUValue > 5) {
    errors.push("floorUValue must be between 0.1 and 5.");
  }

  if (inputs.floorUValue <= 0) {
    errors.push("floorUValue must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: SogukOdaSogutmaYukuHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateSogukOdaSogutmaYukuHesabiInputs(inputs: SogukOdaSogutmaYukuHesabiInputs): SogukOdaSogutmaYukuHesabiValidationResult {
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
