export type DepoRafPaletYerlesimOptimizasyonuInputs = {
  rackLength: number;
  rackDepth: number;
  numberOfLevels: number;
  palletLength: number;
  palletWidth: number;
  gapBetweenPallets: number;
};

export type DepoRafPaletYerlesimOptimizasyonuValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const DEPO_RAF_PALET_YERLESIM_OPTIMIZASYONU_INPUT_KEYS: readonly (keyof DepoRafPaletYerlesimOptimizasyonuInputs)[] = [
  "rackLength",
  "rackDepth",
  "numberOfLevels",
  "palletLength",
  "palletWidth",
  "gapBetweenPallets",
];

const INPUT_LABELS: Record<keyof DepoRafPaletYerlesimOptimizasyonuInputs, string> = {
  rackLength: "rackLength",
  rackDepth: "rackDepth",
  numberOfLevels: "numberOfLevels",
  palletLength: "palletLength",
  palletWidth: "palletWidth",
  gapBetweenPallets: "gapBetweenPallets",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: DepoRafPaletYerlesimOptimizasyonuInputs): string[] {
  const errors: string[] = [];

  for (const key of DEPO_RAF_PALET_YERLESIM_OPTIMIZASYONU_INPUT_KEYS) {
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

  if (inputs.rackLength < 0.1 || inputs.rackLength > 100) {
    errors.push("rackLength must be between 0.1 and 100.");
  }

  if (inputs.rackLength <= 0) {
    errors.push("rackLength must be greater than zero.");
  }

  if (inputs.rackDepth < 0.1 || inputs.rackDepth > 10) {
    errors.push("rackDepth must be between 0.1 and 10.");
  }

  if (inputs.rackDepth <= 0) {
    errors.push("rackDepth must be greater than zero.");
  }

  if (inputs.numberOfLevels < 1 || inputs.numberOfLevels > 20) {
    errors.push("numberOfLevels must be between 1 and 20.");
  }

  if (inputs.numberOfLevels <= 0) {
    errors.push("numberOfLevels must be greater than zero.");
  }

  if (inputs.palletLength < 0.1 || inputs.palletLength > 3) {
    errors.push("palletLength must be between 0.1 and 3.");
  }

  if (inputs.palletLength <= 0) {
    errors.push("palletLength must be greater than zero.");
  }

  if (inputs.palletWidth < 0.1 || inputs.palletWidth > 3) {
    errors.push("palletWidth must be between 0.1 and 3.");
  }

  if (inputs.palletWidth <= 0) {
    errors.push("palletWidth must be greater than zero.");
  }

  if (inputs.gapBetweenPallets < 0 || inputs.gapBetweenPallets > 0.5) {
    errors.push("gapBetweenPallets must be between 0 and 0.5.");
  }

  return errors;
}

function collectWarnings(inputs: DepoRafPaletYerlesimOptimizasyonuInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateDepoRafPaletYerlesimOptimizasyonuInputs(inputs: DepoRafPaletYerlesimOptimizasyonuInputs): DepoRafPaletYerlesimOptimizasyonuValidationResult {
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
