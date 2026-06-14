export type KaynakDikisHacmiMaliyetiHesabiInputs = {
  rootThickness: number;
  weldLength: number;
  reinforcementHeight: number;
  reinforcementWidth: number;
  density: number;
  scrapRate: number;
};

export type KaynakDikisHacmiMaliyetiHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const KAYNAK_DIKIS_HACMI_MALIYETI_HESABI_INPUT_KEYS: readonly (keyof KaynakDikisHacmiMaliyetiHesabiInputs)[] = [
  "rootThickness",
  "weldLength",
  "reinforcementHeight",
  "reinforcementWidth",
  "density",
  "scrapRate",
];

const INPUT_LABELS: Record<keyof KaynakDikisHacmiMaliyetiHesabiInputs, string> = {
  rootThickness: "rootThickness",
  weldLength: "weldLength",
  reinforcementHeight: "reinforcementHeight",
  reinforcementWidth: "reinforcementWidth",
  density: "density",
  scrapRate: "scrapRate",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: KaynakDikisHacmiMaliyetiHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of KAYNAK_DIKIS_HACMI_MALIYETI_HESABI_INPUT_KEYS) {
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

  if (inputs.rootThickness < 0.1 || inputs.rootThickness > 100) {
    errors.push("rootThickness must be between 0.1 and 100.");
  }

  if (inputs.rootThickness <= 0) {
    errors.push("rootThickness must be greater than zero.");
  }

  if (inputs.weldLength < 0.1 || inputs.weldLength > 10000) {
    errors.push("weldLength must be between 0.1 and 10000.");
  }

  if (inputs.weldLength <= 0) {
    errors.push("weldLength must be greater than zero.");
  }

  if (inputs.reinforcementHeight < 0 || inputs.reinforcementHeight > 50) {
    errors.push("reinforcementHeight must be between 0 and 50.");
  }

  if (inputs.reinforcementWidth < 0 || inputs.reinforcementWidth > 100) {
    errors.push("reinforcementWidth must be between 0 and 100.");
  }

  if (inputs.density < 0.0001 || inputs.density > 0.1) {
    errors.push("density must be between 0.0001 and 0.1.");
  }

  if (inputs.density <= 0) {
    errors.push("density must be greater than zero.");
  }

  if (inputs.scrapRate < 0 || inputs.scrapRate > 100) {
    errors.push("scrapRate must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: KaynakDikisHacmiMaliyetiHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateKaynakDikisHacmiMaliyetiHesabiInputs(inputs: KaynakDikisHacmiMaliyetiHesabiInputs): KaynakDikisHacmiMaliyetiHesabiValidationResult {
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
