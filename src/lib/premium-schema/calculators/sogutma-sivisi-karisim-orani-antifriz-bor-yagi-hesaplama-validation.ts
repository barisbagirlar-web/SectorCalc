export type SogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaInputs = {
  totalVolume: number;
  desiredConcentration: number;
  boricOilRatio: number;
};

export type SogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const SOGUTMA_SIVISI_KARISIM_ORANI_ANTIFRIZ_BOR_YAGI_HESAPLAMA_INPUT_KEYS: readonly (keyof SogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaInputs)[] = [
  "totalVolume",
  "desiredConcentration",
  "boricOilRatio",
];

const INPUT_LABELS: Record<keyof SogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaInputs, string> = {
  totalVolume: "totalVolume",
  desiredConcentration: "desiredConcentration",
  boricOilRatio: "boricOilRatio",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: SogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaInputs): string[] {
  const errors: string[] = [];

  for (const key of SOGUTMA_SIVISI_KARISIM_ORANI_ANTIFRIZ_BOR_YAGI_HESAPLAMA_INPUT_KEYS) {
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

  if (inputs.totalVolume < 0.1 || inputs.totalVolume > 10000) {
    errors.push("totalVolume must be between 0.1 and 10000.");
  }

  if (inputs.totalVolume <= 0) {
    errors.push("totalVolume must be greater than zero.");
  }

  if (inputs.desiredConcentration < 0 || inputs.desiredConcentration > 100) {
    errors.push("desiredConcentration must be between 0 and 100.");
  }

  if (inputs.boricOilRatio < 0 || inputs.boricOilRatio > 100) {
    errors.push("boricOilRatio must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: SogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateSogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaInputs(inputs: SogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaInputs): SogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaValidationResult {
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
