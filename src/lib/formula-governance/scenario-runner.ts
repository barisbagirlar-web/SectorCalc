/**
 * Scenario test runtime — executes present scenario specs against oracle baselines (Phase 4).
 */

import type { FormulaContract, ScenarioTestSpec } from "@/lib/formula-governance/types";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateCompoundInterestOracle,
  calculateLoanPaymentOracle,
  calculateMortgagePaymentOracle,
  calculateProfitMarginOracle,
  calculateSimpleInterestOracle,
  isFinanceOracleSlug,
} from "@/lib/formula-governance/oracle/finance-oracles";
import { OracleValidationError } from "@/lib/formula-governance/oracle/oracle-types";

export type ScenarioRunResult = {
  readonly scenarioId: string;
  readonly description: string;
  readonly passed: boolean;
  readonly message?: string;
};

export type ScenarioRunSummary = {
  readonly slug: string;
  readonly total: number;
  readonly passed: number;
  readonly failed: number;
  readonly skipped: number;
  readonly results: readonly ScenarioRunResult[];
};

type ScenarioHandler = () => void;

function runScenario(id: string, description: string, handler: ScenarioHandler): ScenarioRunResult {
  try {
    handler();
    return { scenarioId: id, description, passed: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { scenarioId: id, description, passed: false, message };
  }
}

const LOAN_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-30yr": () => {
    const result = calculateLoanPaymentOracle({ principal: 300_000, annualRate: 6.5, months: 360 });
    if (result.monthlyPayment <= 0) {
      throw new Error("Expected positive payment for normal 30-year loan.");
    }
  },
  "edge-zero-rate": () => {
    const result = calculateLoanPaymentOracle({ principal: 120_000, annualRate: 0, months: 120 });
    if (Math.abs(result.monthlyPayment - 1_000) > 0.01) {
      throw new Error("Zero-rate payment should equal principal ÷ months.");
    }
  },
  "absurd-term": () => {
    try {
      calculateLoanPaymentOracle({ principal: 50_000, annualRate: 5, months: 0 });
      throw new Error("Expected validation error for zero term.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-rate-up": () => {
    const low = calculateLoanPaymentOracle({ principal: 200_000, annualRate: 4, months: 360 });
    const high = calculateLoanPaymentOracle({ principal: 200_000, annualRate: 6, months: 360 });
    if (high.monthlyPayment <= low.monthlyPayment) {
      throw new Error("Higher rate must increase monthly payment.");
    }
  },
  "sensitivity-principal": () => {
    const base = calculateLoanPaymentOracle({ principal: 100_000, annualRate: 5, months: 240 });
    const bumped = calculateLoanPaymentOracle({ principal: 110_000, annualRate: 5, months: 240 });
    if (bumped.monthlyPayment <= base.monthlyPayment) {
      throw new Error("+10% principal must increase monthly payment.");
    }
  },
};

const MORTGAGE_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-360": () => {
    const result = calculateMortgagePaymentOracle({ principal: 400_000, annualRate: 6, months: 360 });
    if (result.totalInterest <= 0) {
      throw new Error("Expected positive total interest for normal mortgage.");
    }
  },
  "edge-short-term": () => {
    const result = calculateMortgagePaymentOracle({ principal: 250_000, annualRate: 5.5, months: 180 });
    const longTerm = calculateMortgagePaymentOracle({ principal: 250_000, annualRate: 5.5, months: 360 });
    if (result.monthlyPayment <= longTerm.monthlyPayment) {
      throw new Error("Shorter term must have higher monthly payment than 30-year.");
    }
  },
  "absurd-rate": () => {
    try {
      calculateMortgagePaymentOracle({ principal: 100_000, annualRate: -1, months: 360 });
      throw new Error("Expected validation error for negative rate.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-principal": () => {
    const low = calculateMortgagePaymentOracle({ principal: 200_000, annualRate: 5, months: 360 });
    const high = calculateMortgagePaymentOracle({ principal: 300_000, annualRate: 5, months: 360 });
    if (high.monthlyPayment <= low.monthlyPayment) {
      throw new Error("Higher loan amount must increase payment.");
    }
  },
  "sensitivity-rate": () => {
    const base = calculateMortgagePaymentOracle({ principal: 300_000, annualRate: 5, months: 360 });
    const bumped = calculateMortgagePaymentOracle({ principal: 300_000, annualRate: 6, months: 360 });
    if (bumped.totalInterest <= base.totalInterest) {
      throw new Error("+1% rate must increase total interest.");
    }
  },
};

const INTEREST_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-1yr": () => {
    const result = calculateSimpleInterestOracle({ principal: 10_000, ratePercent: 5, years: 1 });
    if (Math.abs(result.interestAmount - 500) > 0.01) {
      throw new Error("Expected $500 interest on 10k at 5% for 1 year.");
    }
  },
  "edge-low-rate": () => {
    const result = calculateSimpleInterestOracle({ principal: 5_000, ratePercent: 0.5, years: 2 });
    if (result.interestAmount <= 0) {
      throw new Error("Low positive rate must yield positive interest.");
    }
  },
  "absurd-years": () => {
    try {
      calculateSimpleInterestOracle({ principal: 1_000, ratePercent: 5, years: 0 });
      throw new Error("Expected validation error for zero years.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-rate": () => {
    const low = calculateSimpleInterestOracle({ principal: 10_000, ratePercent: 3, years: 2 });
    const high = calculateSimpleInterestOracle({ principal: 10_000, ratePercent: 6, years: 2 });
    if (high.interestAmount <= low.interestAmount) {
      throw new Error("Higher rate must increase interest.");
    }
  },
  "sensitivity-principal": () => {
    const base = calculateSimpleInterestOracle({ principal: 10_000, ratePercent: 5, years: 3 });
    const doubled = calculateSimpleInterestOracle({ principal: 20_000, ratePercent: 5, years: 3 });
    if (Math.abs(doubled.interestAmount - base.interestAmount * 2) > 0.01) {
      throw new Error("Interest should scale linearly with principal.");
    }
  },
};

const COMPOUND_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-monthly": () => {
    const result = calculateCompoundInterestOracle({
      principal: 10_000,
      annualRate: 6,
      years: 10,
      compoundsPerYear: 12,
    });
    if (result.futureValue <= 10_000) {
      throw new Error("Future value must exceed principal for positive rate.");
    }
  },
  "edge-annual": () => {
    const monthly = calculateCompoundInterestOracle({
      principal: 5_000,
      annualRate: 8,
      years: 5,
      compoundsPerYear: 12,
    });
    const annual = calculateCompoundInterestOracle({
      principal: 5_000,
      annualRate: 8,
      years: 5,
      compoundsPerYear: 1,
    });
    if (monthly.futureValue <= annual.futureValue) {
      throw new Error("Monthly compounding should exceed annual at same nominal rate.");
    }
  },
  "absurd-frequency": () => {
    try {
      calculateCompoundInterestOracle({
        principal: 1_000,
        annualRate: 5,
        years: 1,
        compoundsPerYear: 0,
      });
      throw new Error("Expected validation error for zero compounding frequency.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-rate": () => {
    const low = calculateCompoundInterestOracle({
      principal: 10_000,
      annualRate: 3,
      years: 5,
      compoundsPerYear: 12,
    });
    const high = calculateCompoundInterestOracle({
      principal: 10_000,
      annualRate: 7,
      years: 5,
      compoundsPerYear: 12,
    });
    if (high.futureValue <= low.futureValue) {
      throw new Error("Higher rate must increase future value.");
    }
  },
  "sensitivity-horizon": () => {
    const short = calculateCompoundInterestOracle({
      principal: 10_000,
      annualRate: 5,
      years: 3,
      compoundsPerYear: 12,
    });
    const long = calculateCompoundInterestOracle({
      principal: 10_000,
      annualRate: 5,
      years: 10,
      compoundsPerYear: 12,
    });
    if (long.futureValue <= short.futureValue) {
      throw new Error("Longer horizon must increase future value.");
    }
  },
};

const MARGIN_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-margin": () => {
    const result = calculateProfitMarginOracle({ sellingPrice: 100, cost: 70 });
    if (Math.abs(result.marginPercent - 30) > 0.01) {
      throw new Error("Expected 30% margin for price 100 cost 70.");
    }
  },
  "edge-break-even": () => {
    const result = calculateProfitMarginOracle({ sellingPrice: 50, cost: 50 });
    if (Math.abs(result.marginPercent) > 0.01) {
      throw new Error("Break-even price should yield 0% margin.");
    }
  },
  "absurd-negative-price": () => {
    try {
      calculateProfitMarginOracle({ sellingPrice: 0, cost: 10 });
      throw new Error("Expected validation error for zero price.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-cost": () => {
    const low = calculateProfitMarginOracle({ sellingPrice: 100, cost: 40 });
    const high = calculateProfitMarginOracle({ sellingPrice: 100, cost: 60 });
    if (high.marginPercent >= low.marginPercent) {
      throw new Error("Higher cost must lower margin.");
    }
  },
  "sensitivity-price": () => {
    const base = calculateProfitMarginOracle({ sellingPrice: 100, cost: 60 });
    const bumped = calculateProfitMarginOracle({ sellingPrice: 110, cost: 60 });
    if (bumped.marginPercent <= base.marginPercent) {
      throw new Error("+10% price must improve margin.");
    }
  },
};

const SCENARIO_HANDLERS: Record<string, Record<string, ScenarioHandler>> = {
  "loan-payment-calculator": LOAN_SCENARIOS,
  "mortgage-calculator": MORTGAGE_SCENARIOS,
  "interest-calculator": INTEREST_SCENARIOS,
  "compound-interest-calculator": COMPOUND_SCENARIOS,
  "profit-margin-calculator": MARGIN_SCENARIOS,
};

export function runScenarioSpec(
  slug: string,
  spec: ScenarioTestSpec,
): ScenarioRunResult {
  if (!spec.present) {
    return {
      scenarioId: spec.id,
      description: spec.description,
      passed: true,
      message: "Skipped (not marked present)",
    };
  }

  if (!isFinanceOracleSlug(slug)) {
    return {
      scenarioId: spec.id,
      description: spec.description,
      passed: false,
      message: `No runtime handler registered for slug "${slug}".`,
    };
  }

  const handler = SCENARIO_HANDLERS[slug]?.[spec.id];
  if (!handler) {
    return {
      scenarioId: spec.id,
      description: spec.description,
      passed: false,
      message: `Scenario handler missing for ${slug}/${spec.id}.`,
    };
  }

  return runScenario(spec.id, spec.description, handler);
}

export function runContractScenarioTests(
  contractOrSlug: FormulaContract | string,
): ScenarioRunSummary {
  const contract =
    typeof contractOrSlug === "string"
      ? getFormulaContractBySlug(contractOrSlug)
      : contractOrSlug;

  if (!contract) {
    return {
      slug: typeof contractOrSlug === "string" ? contractOrSlug : "unknown",
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      results: [],
    };
  }

  const results = contract.scenarioTests.map((spec) => runScenarioSpec(contract.slug, spec));
  const presentResults = results.filter((r) => r.message !== "Skipped (not marked present)");
  const skipped = results.length - presentResults.length;

  return {
    slug: contract.slug,
    total: presentResults.length,
    passed: presentResults.filter((r) => r.passed).length,
    failed: presentResults.filter((r) => !r.passed).length,
    skipped,
    results,
  };
}

export function countPresentScenarioTests(contract: FormulaContract): number {
  return contract.scenarioTests.filter((spec) => spec.present).length;
}
