/**
 * Business oracle baselines — independent reference implementations (Phase 5C).
 * Does NOT import production calculator functions.
 */

import { OracleValidationError } from "@/lib/formula-governance/oracle/oracle-types";

export const BUSINESS_ORACLE_SLUGS = [
  "break-even-calculator",
  "salary-cost-calculator",
  "cash-flow-gap-calculator",
] as const;

export type BusinessOracleSlug = (typeof BUSINESS_ORACLE_SLUGS)[number];

export function isBusinessOracleSlug(slug: string): slug is BusinessOracleSlug {
  return (BUSINESS_ORACLE_SLUGS as readonly string[]).includes(slug);
}

export type BreakEvenOracleInput = {
  readonly fixedCost: number;
  readonly unitPrice: number;
  readonly variableCost: number;
};

export type BreakEvenOracleOutput = {
  readonly breakEvenUnits: number;
  readonly contributionMargin: number;
};

export type SalaryCostOracleInput = {
  readonly grossSalary: number;
  readonly employerRatePercent: number;
};

export type SalaryCostOracleOutput = {
  readonly totalEmployerCost: number;
};

export type CashFlowGapOracleInput = {
  readonly receivablesDays: number;
  readonly payableDays: number;
  readonly dailyCost: number;
};

export type CashFlowGapOracleOutput = {
  readonly gapDays: number;
  readonly workingCapitalGap: number;
};

function assertNonNegative(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new OracleValidationError("INVALID_COST", `${label} must be a non-negative finite number.`);
  }
}

function assertPositive(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new OracleValidationError("INVALID_PRICE", `${label} must be a positive finite number.`);
  }
}

/** Reference break-even units = fixedCost ÷ (unitPrice − variableCost). */
export function calculateBreakEvenOracle(input: BreakEvenOracleInput): BreakEvenOracleOutput {
  assertNonNegative(input.fixedCost, "Fixed cost");
  assertPositive(input.unitPrice, "Unit price");
  assertNonNegative(input.variableCost, "Variable cost");

  const contributionMargin = input.unitPrice - input.variableCost;
  if (contributionMargin <= 0) {
    throw new OracleValidationError(
      "INVALID_CONTRIBUTION",
      "Contribution margin is zero or negative — break-even volume is not defined.",
    );
  }

  return {
    breakEvenUnits: input.fixedCost / contributionMargin,
    contributionMargin,
  };
}

/** Reference employer cost = grossSalary × (1 + employerRatePercent/100). */
export function calculateSalaryCostOracle(input: SalaryCostOracleInput): SalaryCostOracleOutput {
  assertPositive(input.grossSalary, "Gross salary");
  if (!Number.isFinite(input.employerRatePercent) || input.employerRatePercent < 0 || input.employerRatePercent > 200) {
    throw new OracleValidationError(
      "INVALID_RATE",
      "Employer rate must be between 0 and 200 percent.",
    );
  }

  return {
    totalEmployerCost: input.grossSalary * (1 + input.employerRatePercent / 100),
  };
}

/** Reference working capital gap = (receivablesDays − payableDays) × dailyCost. */
export function calculateCashFlowGapOracle(input: CashFlowGapOracleInput): CashFlowGapOracleOutput {
  assertNonNegative(input.receivablesDays, "Receivables days");
  assertNonNegative(input.payableDays, "Payable days");
  assertPositive(input.dailyCost, "Daily cost");

  const gapDays = input.receivablesDays - input.payableDays;
  return {
    gapDays,
    workingCapitalGap: gapDays * input.dailyCost,
  };
}
