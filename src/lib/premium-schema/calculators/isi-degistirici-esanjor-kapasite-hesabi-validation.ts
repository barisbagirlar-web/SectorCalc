export type IsiDegistiriciEsanjorKapasiteHesabiInputs = {
  hotFluidInletTemp: number;
  hotFluidOutletTemp: number;
  coldFluidInletTemp: number;
  coldFluidOutletTemp: number;
  overallHeatTransferCoefficient: number;
  foulingMarginPercent: number;
};

export type IsiDegistiriciEsanjorKapasiteHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ISI_DEGISTIRICI_ESANJOR_KAPASITE_HESABI_INPUT_KEYS: readonly (keyof IsiDegistiriciEsanjorKapasiteHesabiInputs)[] = [
  "hotFluidInletTemp",
  "hotFluidOutletTemp",
  "coldFluidInletTemp",
  "coldFluidOutletTemp",
  "overallHeatTransferCoefficient",
  "foulingMarginPercent",
];

const INPUT_LABELS: Record<keyof IsiDegistiriciEsanjorKapasiteHesabiInputs, string> = {
  hotFluidInletTemp: "hotFluidInletTemp",
  hotFluidOutletTemp: "hotFluidOutletTemp",
  coldFluidInletTemp: "coldFluidInletTemp",
  coldFluidOutletTemp: "coldFluidOutletTemp",
  overallHeatTransferCoefficient: "overallHeatTransferCoefficient",
  foulingMarginPercent: "foulingMarginPercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: IsiDegistiriciEsanjorKapasiteHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of ISI_DEGISTIRICI_ESANJOR_KAPASITE_HESABI_INPUT_KEYS) {
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

  if (inputs.hotFluidInletTemp < -50 || inputs.hotFluidInletTemp > 1000) {
    errors.push("hotFluidInletTemp must be between -50 and 1000.");
  }

  if (inputs.hotFluidOutletTemp < -50 || inputs.hotFluidOutletTemp > 1000) {
    errors.push("hotFluidOutletTemp must be between -50 and 1000.");
  }

  if (inputs.coldFluidInletTemp < -50 || inputs.coldFluidInletTemp > 1000) {
    errors.push("coldFluidInletTemp must be between -50 and 1000.");
  }

  if (inputs.coldFluidOutletTemp < -50 || inputs.coldFluidOutletTemp > 1000) {
    errors.push("coldFluidOutletTemp must be between -50 and 1000.");
  }

  if (inputs.overallHeatTransferCoefficient < 1 || inputs.overallHeatTransferCoefficient > 10000) {
    errors.push("overallHeatTransferCoefficient must be between 1 and 10000.");
  }

  if (inputs.overallHeatTransferCoefficient <= 0) {
    errors.push("overallHeatTransferCoefficient must be greater than zero.");
  }

  if (inputs.foulingMarginPercent < 0 || inputs.foulingMarginPercent > 100) {
    errors.push("foulingMarginPercent must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: IsiDegistiriciEsanjorKapasiteHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateIsiDegistiriciEsanjorKapasiteHesabiInputs(inputs: IsiDegistiriciEsanjorKapasiteHesabiInputs): IsiDegistiriciEsanjorKapasiteHesabiValidationResult {
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
