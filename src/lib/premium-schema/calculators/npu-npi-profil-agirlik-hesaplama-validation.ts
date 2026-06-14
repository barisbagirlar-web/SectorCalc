export type NpuNpiProfilAgirlikHesaplamaInputs = {
  profileHeight: number;
  flangeWidth: number;
  webThickness: number;
  flangeThickness: number;
  profileLength: number;
  nominalWeightPerMeter: number;
};

export type NpuNpiProfilAgirlikHesaplamaValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const NPU_NPI_PROFIL_AGIRLIK_HESAPLAMA_INPUT_KEYS: readonly (keyof NpuNpiProfilAgirlikHesaplamaInputs)[] = [
  "profileHeight",
  "flangeWidth",
  "webThickness",
  "flangeThickness",
  "profileLength",
  "nominalWeightPerMeter",
];

const INPUT_LABELS: Record<keyof NpuNpiProfilAgirlikHesaplamaInputs, string> = {
  profileHeight: "profileHeight",
  flangeWidth: "flangeWidth",
  webThickness: "webThickness",
  flangeThickness: "flangeThickness",
  profileLength: "profileLength",
  nominalWeightPerMeter: "nominalWeightPerMeter",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: NpuNpiProfilAgirlikHesaplamaInputs): string[] {
  const errors: string[] = [];

  for (const key of NPU_NPI_PROFIL_AGIRLIK_HESAPLAMA_INPUT_KEYS) {
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

  if (inputs.profileHeight < 50 || inputs.profileHeight > 500) {
    errors.push("profileHeight must be between 50 and 500.");
  }

  if (inputs.profileHeight <= 0) {
    errors.push("profileHeight must be greater than zero.");
  }

  if (inputs.flangeWidth < 40 || inputs.flangeWidth > 300) {
    errors.push("flangeWidth must be between 40 and 300.");
  }

  if (inputs.flangeWidth <= 0) {
    errors.push("flangeWidth must be greater than zero.");
  }

  if (inputs.webThickness < 4 || inputs.webThickness > 20) {
    errors.push("webThickness must be between 4 and 20.");
  }

  if (inputs.webThickness <= 0) {
    errors.push("webThickness must be greater than zero.");
  }

  if (inputs.flangeThickness < 4 || inputs.flangeThickness > 30) {
    errors.push("flangeThickness must be between 4 and 30.");
  }

  if (inputs.flangeThickness <= 0) {
    errors.push("flangeThickness must be greater than zero.");
  }

  if (inputs.profileLength < 0.5 || inputs.profileLength > 24) {
    errors.push("profileLength must be between 0.5 and 24.");
  }

  if (inputs.profileLength <= 0) {
    errors.push("profileLength must be greater than zero.");
  }

  if (inputs.nominalWeightPerMeter < 5 || inputs.nominalWeightPerMeter > 200) {
    errors.push("nominalWeightPerMeter must be between 5 and 200.");
  }

  if (inputs.nominalWeightPerMeter <= 0) {
    errors.push("nominalWeightPerMeter must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: NpuNpiProfilAgirlikHesaplamaInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateNpuNpiProfilAgirlikHesaplamaInputs(inputs: NpuNpiProfilAgirlikHesaplamaInputs): NpuNpiProfilAgirlikHesaplamaValidationResult {
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
