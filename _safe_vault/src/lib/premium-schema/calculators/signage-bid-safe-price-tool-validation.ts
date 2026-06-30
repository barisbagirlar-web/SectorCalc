export type SignageBidSafePriceToolInputs = {
  materialCost: number;
  inkCost: number;
  designHours: number;
  laborRate: number;
  installHours: number;
  reprintRiskPercent: number;
  targetMargin: number;
};

export type SignageBidSafePriceToolValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const SIGNAGE_BID_SAFE_PRICE_TOOL_INPUT_KEYS: readonly (keyof SignageBidSafePriceToolInputs)[] = [
  "materialCost",
  "inkCost",
  "designHours",
  "laborRate",
  "installHours",
  "reprintRiskPercent",
  "targetMargin",
];

const INPUT_LABELS: Record<keyof SignageBidSafePriceToolInputs, string> = {
  materialCost: "materialCost",
  inkCost: "inkCost",
  designHours: "designHours",
  laborRate: "laborRate",
  installHours: "installHours",
  reprintRiskPercent: "reprintRiskPercent",
  targetMargin: "targetMargin",
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
