export type CloudApiCostOverrunInputs = {
  monthlyApiCalls: number;
  costPerThousandCalls: number;
  monthlyRevenue: number;
  computeCost: number;
  storageCost: number;
};

export type CloudApiCostOverrunValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const CLOUD_API_COST_OVERRUN_INPUT_KEYS: readonly (keyof CloudApiCostOverrunInputs)[] = [
  "monthlyApiCalls",
  "costPerThousandCalls",
  "monthlyRevenue",
  "computeCost",
  "storageCost",
];

const INPUT_LABELS: Record<keyof CloudApiCostOverrunInputs, string> = {
  monthlyApiCalls: "monthlyApiCalls",
  costPerThousandCalls: "costPerThousandCalls",
  monthlyRevenue: "monthlyRevenue",
  computeCost: "computeCost",
  storageCost: "storageCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: CloudApiCostOverrunInputs): string[] {
  const errors: string[] = [];

  for (const key of CLOUD_API_COST_OVERRUN_INPUT_KEYS) {
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

  if (inputs.monthlyApiCalls < 0) {
    errors.push("monthlyApiCalls must be greater than or equal to zero.");
  }
  if (inputs.costPerThousandCalls < 0) {
    errors.push("costPerThousandCalls must be greater than or equal to zero.");
  }
  if (inputs.monthlyRevenue <= 0) {
    errors.push("monthlyRevenue must be greater than zero.");
  }
  if (inputs.computeCost < 0) {
    errors.push("computeCost must be greater than or equal to zero.");
  }
  if (inputs.storageCost < 0) {
    errors.push("storageCost must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: CloudApiCostOverrunInputs): string[] {
  const warnings: string[] = [];
  const apiCallCost = (inputs.monthlyApiCalls / 1000) * inputs.costPerThousandCalls;
  const totalCloudCost = apiCallCost + inputs.computeCost + inputs.storageCost;
  const revenuePressure = (totalCloudCost / inputs.monthlyRevenue) * 100;

  if (revenuePressure >= 15) {
    warnings.push(
      "Cloud stack is consuming a rising share of revenue. Review API unit economics and fixed compute spend.",
    );
  }

  if (apiCallCost > inputs.computeCost + inputs.storageCost) {
    warnings.push(
      "API call cost exceeds compute plus storage in this scenario. Confirm call volume and per-thousand rate assumptions.",
    );
  }

  if (inputs.monthlyRevenue < totalCloudCost) {
    warnings.push(
      "Total cloud cost exceeds monthly revenue in this scenario. Confirm revenue period alignment and cost scope.",
    );
  }

  return warnings;
}

export function validateCloudApiCostOverrunInputs(
  inputs: CloudApiCostOverrunInputs,
): CloudApiCostOverrunValidationResult {
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
