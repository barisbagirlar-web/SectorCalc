export type PaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliInputs = {
  sampleMass: number;
  sampleVolume: number;
  tolerancePercent: number;
};

export type PaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const PASLANMAZ_CELIK_ALUMINYUM_AYIRT_ETME_HESAPLAYICISI_YOGUNLUK_BAZLI_INPUT_KEYS: readonly (keyof PaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliInputs)[] = [
  "sampleMass",
  "sampleVolume",
  "tolerancePercent",
];

const INPUT_LABELS: Record<keyof PaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliInputs, string> = {
  sampleMass: "sampleMass",
  sampleVolume: "sampleVolume",
  tolerancePercent: "tolerancePercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: PaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliInputs): string[] {
  const errors: string[] = [];

  for (const key of PASLANMAZ_CELIK_ALUMINYUM_AYIRT_ETME_HESAPLAYICISI_YOGUNLUK_BAZLI_INPUT_KEYS) {
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

  if (inputs.sampleMass < 0.1 || inputs.sampleMass > 100000) {
    errors.push("sampleMass must be between 0.1 and 100000.");
  }

  if (inputs.sampleMass <= 0) {
    errors.push("sampleMass must be greater than zero.");
  }

  if (inputs.sampleVolume < 0.1 || inputs.sampleVolume > 100000) {
    errors.push("sampleVolume must be between 0.1 and 100000.");
  }

  if (inputs.sampleVolume <= 0) {
    errors.push("sampleVolume must be greater than zero.");
  }

  if (inputs.tolerancePercent < 0 || inputs.tolerancePercent > 100) {
    errors.push("tolerancePercent must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: PaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validatePaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliInputs(inputs: PaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliInputs): PaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliValidationResult {
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
