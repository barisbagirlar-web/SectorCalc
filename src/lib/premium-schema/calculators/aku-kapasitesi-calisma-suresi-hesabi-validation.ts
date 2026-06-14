export type AkuKapasitesiCalismaSuresiHesabiInputs = {
  nominalCapacityAh: number;
  depthOfDischargePercent: number;
  loadCurrentA: number;
  loadFactor: number;
  temperatureC: number;
  agingFactor: number;
};

export type AkuKapasitesiCalismaSuresiHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const AKU_KAPASITESI_CALISMA_SURESI_HESABI_INPUT_KEYS: readonly (keyof AkuKapasitesiCalismaSuresiHesabiInputs)[] = [
  "nominalCapacityAh",
  "depthOfDischargePercent",
  "loadCurrentA",
  "loadFactor",
  "temperatureC",
  "agingFactor",
];

const INPUT_LABELS: Record<keyof AkuKapasitesiCalismaSuresiHesabiInputs, string> = {
  nominalCapacityAh: "nominalCapacityAh",
  depthOfDischargePercent: "depthOfDischargePercent",
  loadCurrentA: "loadCurrentA",
  loadFactor: "loadFactor",
  temperatureC: "temperatureC",
  agingFactor: "agingFactor",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: AkuKapasitesiCalismaSuresiHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of AKU_KAPASITESI_CALISMA_SURESI_HESABI_INPUT_KEYS) {
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

  if (inputs.nominalCapacityAh < 1 || inputs.nominalCapacityAh > 10000) {
    errors.push("nominalCapacityAh must be between 1 and 10000.");
  }

  if (inputs.nominalCapacityAh <= 0) {
    errors.push("nominalCapacityAh must be greater than zero.");
  }

  if (inputs.depthOfDischargePercent < 0 || inputs.depthOfDischargePercent > 100) {
    errors.push("depthOfDischargePercent must be between 0 and 100.");
  }

  if (inputs.loadCurrentA < 0.1 || inputs.loadCurrentA > 10000) {
    errors.push("loadCurrentA must be between 0.1 and 10000.");
  }

  if (inputs.loadCurrentA <= 0) {
    errors.push("loadCurrentA must be greater than zero.");
  }

  if (inputs.loadFactor < 0.1 || inputs.loadFactor > 1) {
    errors.push("loadFactor must be between 0.1 and 1.");
  }

  if (inputs.loadFactor <= 0) {
    errors.push("loadFactor must be greater than zero.");
  }

  if (inputs.temperatureC < -20 || inputs.temperatureC > 60) {
    errors.push("temperatureC must be between -20 and 60.");
  }

  if (inputs.agingFactor < 0.5 || inputs.agingFactor > 1) {
    errors.push("agingFactor must be between 0.5 and 1.");
  }

  if (inputs.agingFactor <= 0) {
    errors.push("agingFactor must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: AkuKapasitesiCalismaSuresiHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateAkuKapasitesiCalismaSuresiHesabiInputs(inputs: AkuKapasitesiCalismaSuresiHesabiInputs): AkuKapasitesiCalismaSuresiHesabiValidationResult {
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
