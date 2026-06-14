export type TahtaMdfSuntaMAgirlikHesabiInputs = {
  panelLength: number;
  panelWidth: number;
  panelThickness: number;
  materialDensity: number;
  moistureContent: number;
};

export type TahtaMdfSuntaMAgirlikHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const TAHTA_MDF_SUNTA_M_AGIRLIK_HESABI_INPUT_KEYS: readonly (keyof TahtaMdfSuntaMAgirlikHesabiInputs)[] = [
  "panelLength",
  "panelWidth",
  "panelThickness",
  "materialDensity",
  "moistureContent",
];

const INPUT_LABELS: Record<keyof TahtaMdfSuntaMAgirlikHesabiInputs, string> = {
  panelLength: "panelLength",
  panelWidth: "panelWidth",
  panelThickness: "panelThickness",
  materialDensity: "materialDensity",
  moistureContent: "moistureContent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: TahtaMdfSuntaMAgirlikHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of TAHTA_MDF_SUNTA_M_AGIRLIK_HESABI_INPUT_KEYS) {
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

  if (inputs.panelLength < 0.001 || inputs.panelLength > 10) {
    errors.push("panelLength must be between 0.001 and 10.");
  }

  if (inputs.panelLength <= 0) {
    errors.push("panelLength must be greater than zero.");
  }

  if (inputs.panelWidth < 0.001 || inputs.panelWidth > 10) {
    errors.push("panelWidth must be between 0.001 and 10.");
  }

  if (inputs.panelWidth <= 0) {
    errors.push("panelWidth must be greater than zero.");
  }

  if (inputs.panelThickness < 0.001 || inputs.panelThickness > 0.1) {
    errors.push("panelThickness must be between 0.001 and 0.1.");
  }

  if (inputs.panelThickness <= 0) {
    errors.push("panelThickness must be greater than zero.");
  }

  if (inputs.materialDensity < 100 || inputs.materialDensity > 1200) {
    errors.push("materialDensity must be between 100 and 1200.");
  }

  if (inputs.materialDensity <= 0) {
    errors.push("materialDensity must be greater than zero.");
  }

  if (inputs.moistureContent < 0 || inputs.moistureContent > 100) {
    errors.push("moistureContent must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: TahtaMdfSuntaMAgirlikHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateTahtaMdfSuntaMAgirlikHesabiInputs(inputs: TahtaMdfSuntaMAgirlikHesabiInputs): TahtaMdfSuntaMAgirlikHesabiValidationResult {
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
