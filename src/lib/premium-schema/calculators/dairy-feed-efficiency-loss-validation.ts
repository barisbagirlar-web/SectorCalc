export type DairyFeedEfficiencyLossInputs = {
  cows: number;
  feedCostPerCowPerDay: number;
  milkLitersPerCowPerDay: number;
  targetMilkLitersPerCowPerDay: number;
  milkPricePerLiter: number;
  days: number;
};

export type DairyFeedEfficiencyLossValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const DAIRY_FEED_EFFICIENCY_LOSS_INPUT_KEYS: readonly (keyof DairyFeedEfficiencyLossInputs)[] =
  [
    "cows",
    "feedCostPerCowPerDay",
    "milkLitersPerCowPerDay",
    "targetMilkLitersPerCowPerDay",
    "milkPricePerLiter",
    "days",
  ];

const INPUT_LABELS: Record<keyof DairyFeedEfficiencyLossInputs, string> = {
  cows: "cows",
  feedCostPerCowPerDay: "feedCostPerCowPerDay",
  milkLitersPerCowPerDay: "milkLitersPerCowPerDay",
  targetMilkLitersPerCowPerDay: "targetMilkLitersPerCowPerDay",
  milkPricePerLiter: "milkPricePerLiter",
  days: "days",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: DairyFeedEfficiencyLossInputs): string[] {
  const errors: string[] = [];

  for (const key of DAIRY_FEED_EFFICIENCY_LOSS_INPUT_KEYS) {
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

  if (inputs.cows < 1) {
    errors.push("cows must be greater than or equal to 1.");
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
  if (inputs.days < 1) {
    errors.push("days must be greater than or equal to 1.");
  }

  return errors;
}

function collectWarnings(inputs: DairyFeedEfficiencyLossInputs): string[] {
  const warnings: string[] = [];

  if (inputs.milkLitersPerCowPerDay < inputs.targetMilkLitersPerCowPerDay) {
    warnings.push(
      "Actual yield is below target — confirm feed efficiency and milk price assumptions.",
    );
  }

  if (inputs.milkLitersPerCowPerDay <= 22) {
    warnings.push(
      "Milk yield is below target band — feed efficiency pressure is building.",
    );
  }

  if (
    inputs.milkLitersPerCowPerDay < inputs.targetMilkLitersPerCowPerDay &&
    inputs.milkPricePerLiter === 0
  ) {
    warnings.push(
      "Milk price is zero while yield is below target. Revenue gap will remain zero until price is supplied.",
    );
  }

  if (inputs.feedCostPerCowPerDay >= 8) {
    warnings.push(
      "Daily feed cost per cow is elevated. Confirm ration formulation and purchased feed rates.",
    );
  }

  return warnings;
}

export function validateDairyFeedEfficiencyLossInputs(
  inputs: DairyFeedEfficiencyLossInputs,
): DairyFeedEfficiencyLossValidationResult {
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
