export type DairyProfitDetectorInputs = {
  cows: number;
  feedCostPerCowPerDay: number;
  milkLitersPerCowPerDay: number;
  targetMilkLitersPerCowPerDay: number;
  milkPricePerLiter: number;
  days: number;
};

export type DairyProfitDetectorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const DAIRY_PROFIT_DETECTOR_INPUT_KEYS: readonly (keyof DairyProfitDetectorInputs)[] = [
  "cows",
  "feedCostPerCowPerDay",
  "milkLitersPerCowPerDay",
  "targetMilkLitersPerCowPerDay",
  "milkPricePerLiter",
  "days",
];

const INPUT_LABELS: Record<keyof DairyProfitDetectorInputs, string> = {
  cows: "cows",
  feedCostPerCowPerDay: "feedCostPerCowPerDay",
  milkLitersPerCowPerDay: "milkLitersPerCowPerDay",
  targetMilkLitersPerCowPerDay: "targetMilkLitersPerCowPerDay",
  milkPricePerLiter: "milkPricePerLiter",
  days: "days",
};

const summaryRule = {
  fieldId: "milkLitersPerCowPerDay",
  warning: 22,
  critical: 18,
  direction: "lower_is_bad",
} as const;

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: DairyProfitDetectorInputs): string[] {
  const errors: string[] = [];

  for (const key of DAIRY_PROFIT_DETECTOR_INPUT_KEYS) {
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

  if (inputs.cows < 0) {
    errors.push("cows must be greater than or equal to zero.");
  }

  if (inputs.cows <= 0) {
    errors.push("cows must be greater than zero.");
  }

  if (inputs.feedCostPerCowPerDay < 0) {
    errors.push("feedCostPerCowPerDay must be greater than or equal to zero.");
  }

  if (inputs.milkLitersPerCowPerDay < 0) {
    errors.push("milkLitersPerCowPerDay must be greater than or equal to zero.");
  }

  if (inputs.targetMilkLitersPerCowPerDay < 0) {
    errors.push("targetMilkLitersPerCowPerDay must be greater than or equal to zero.");
  }

  if (inputs.milkPricePerLiter < 0) {
    errors.push("milkPricePerLiter must be greater than or equal to zero.");
  }

  if (inputs.days < 0) {
    errors.push("days must be greater than or equal to zero.");
  }

  if (inputs.days <= 0) {
    errors.push("days must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: DairyProfitDetectorInputs): string[] {
  const warnings: string[] = [];

  if (inputs.milkLitersPerCowPerDay <= summaryRule.warning) {
    warnings.push("Milk yield is below target band — feed efficiency pressure is building.");
  }

  return warnings;
}

export function validateDairyProfitDetectorInputs(inputs: DairyProfitDetectorInputs): DairyProfitDetectorValidationResult {
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
