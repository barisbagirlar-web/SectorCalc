export type SignageBidSafePriceToolInputs = {
  jobRevenue: number;
  materialCost: number;
  reprintRatePercent: number;
  designRevisionHours: number;
  laborRate: number;
  installReworkCost: number;
};

export type SignageBidSafePriceToolValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const SIGNAGE_BID_SAFE_PRICE_TOOL_INPUT_KEYS: readonly (keyof SignageBidSafePriceToolInputs)[] = [
  "jobRevenue",
  "materialCost",
  "reprintRatePercent",
  "designRevisionHours",
  "laborRate",
  "installReworkCost",
];

const INPUT_LABELS: Record<keyof SignageBidSafePriceToolInputs, string> = {
  jobRevenue: "jobRevenue",
  materialCost: "materialCost",
  reprintRatePercent: "reprintRatePercent",
  designRevisionHours: "designRevisionHours",
  laborRate: "laborRate",
  installReworkCost: "installReworkCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: SignageBidSafePriceToolInputs): string[] {
  const errors: string[] = [];

  for (const key of SIGNAGE_BID_SAFE_PRICE_TOOL_INPUT_KEYS) {
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

  if (inputs.jobRevenue < 0) {
    errors.push("jobRevenue must be greater than or equal to zero.");
  }

  if (inputs.jobRevenue <= 0) {
    errors.push("jobRevenue must be greater than zero.");
  }

  if (inputs.materialCost < 0) {
    errors.push("materialCost must be greater than or equal to zero.");
  }

  if (inputs.reprintRatePercent < 0 || inputs.reprintRatePercent > 100) {
    errors.push("reprintRatePercent must be between 0 and 100.");
  }

  if (inputs.designRevisionHours < 0) {
    errors.push("designRevisionHours must be greater than or equal to zero.");
  }

  if (inputs.laborRate < 0) {
    errors.push("laborRate must be greater than or equal to zero.");
  }

  if (inputs.installReworkCost < 0) {
    errors.push("installReworkCost must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: SignageBidSafePriceToolInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateSignageBidSafePriceToolInputs(inputs: SignageBidSafePriceToolInputs): SignageBidSafePriceToolValidationResult {
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
