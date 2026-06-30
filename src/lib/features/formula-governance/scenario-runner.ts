/**
 * Scenario test runtime — executes present scenario specs against oracle baselines (Phase 4).
 */

import type { FormulaContract, ScenarioTestSpec } from "@/lib/features/formula-governance/types";
import { getFormulaContractBySlug } from "@/lib/features/formula-governance/contracts";
import {
  calculateCompoundInterestOracle,
  calculateLoanPaymentOracle,
  calculateMortgagePaymentOracle,
  calculateProfitMarginOracle,
  calculateSimpleInterestOracle,
  isFinanceOracleSlug,
} from "@/lib/features/formula-governance/oracle/finance-oracles";
import {
  calculateBreakEvenOracle,
  calculateCashFlowGapOracle,
  calculateSalaryCostOracle,
  isBusinessOracleSlug,
} from "@/lib/features/formula-governance/oracle/business-oracles";
import {
  calculateCncQuoteRiskOracle,
  calculateMachineTimeOracle,
  isOperationsOracleSlug,
} from "@/lib/features/formula-governance/oracle/operations-oracles";
import {
  calculateFoodCostOracle,
  calculateWeldingCostOracle,
  isBatchFreeOracleSlug,
} from "@/lib/features/formula-governance/oracle/batch-free-oracles";
import {
  calculateCleaningIssaFreeOracle,
  calculateProductMarginDtcFreeOracle,
  calculateProjectChangeOrderFreeOracle,
} from "@/lib/features/formula-governance/oracle/revenue-drift-free-oracles";
import {
  calculateChangeOrderImpactOracle,
  calculateMenuProfitLeakDetectorOracle,
  calculateOfficeCleaningBidOptimizerOracle,
  calculateReturnProfitErosionOracle,
  calculateWeldingBidRiskOracle,
  isBatchPremiumOracleSlug,
} from "@/lib/features/formula-governance/oracle/batch-premium-oracles";
import { isBatchFreeBatch2OracleSlug } from "@/lib/features/formula-governance/oracle/batch-free-batch2-oracles";
import { isBatchPremiumBatch3OracleSlug } from "@/lib/features/formula-governance/oracle/batch-premium-batch3-oracles";
import { isBatchPremiumSchemaOracleSlug } from "@/lib/features/formula-governance/oracle/batch-premium-schema-oracles";
import { BATCH_FREE_BATCH2_SCENARIO_HANDLERS } from "@/lib/features/formula-governance/scenario-handlers-batch-free-batch2";
import { P77_BATCH_B_SCENARIO_HANDLERS } from "@/lib/features/formula-governance/scenario-handlers-p77-batch-b";
import { BATCH_PREMIUM_BATCH3_SCENARIO_HANDLERS } from "@/lib/features/formula-governance/scenario-handlers-batch-premium-batch3";
import { BATCH_PREMIUM_SCHEMA_SCENARIO_HANDLERS } from "@/lib/features/formula-governance/scenario-handlers-batch-premium-schema";
import { BATCH_TRAFFIC_CATALOG_SCENARIO_HANDLERS } from "@/lib/features/formula-governance/scenario-handlers-batch-traffic-catalog";
import { isBatchTrafficCatalogOracleSlug } from "@/lib/features/formula-governance/oracle/batch-traffic-catalog-oracles";
import {
  calculateRentVsBuyOracle,
  isRentVsBuyOracleSlug,
} from "@/lib/features/formula-governance/oracle/rent-vs-buy-oracle";
import { OracleValidationError } from "@/lib/features/formula-governance/oracle/oracle-types";
import { calculatePremiumDecisionReport } from "@/lib/features/tools/premium-decision-engine";

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

const RENT_VS_BUY_BASE = {
  monthlyRent: 2000,
  homePrice: 400_000,
  comparisonYears: 7,
  annualRentIncrease: 3,
  annualHomeAppreciation: 3,
  downPaymentPercent: 20,
  mortgageInterestRate: 6.5,
  mortgageTermYears: 30,
  investmentReturnRate: 5,
  ownershipCostPercent: 1.5,
  purchaseCostPercent: 2,
  sellingCostPercent: 6,
};

const RENT_VS_BUY_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-7yr": () => {
    const result = calculateRentVsBuyOracle(RENT_VS_BUY_BASE);
    if (result.totalRentPaid <= 0) {
      throw new Error("Expected positive total rent paid.");
    }
  },
  "high-rent-growth": () => {
    const base = calculateRentVsBuyOracle(RENT_VS_BUY_BASE);
    const high = calculateRentVsBuyOracle({ ...RENT_VS_BUY_BASE, annualRentIncrease: 8 });
    if (high.totalRentPaid <= base.totalRentPaid) {
      throw new Error("Higher rent growth must increase total rent paid.");
    }
  },
  "low-appreciation": () => {
    const result = calculateRentVsBuyOracle({ ...RENT_VS_BUY_BASE, annualHomeAppreciation: 0 });
    if (result.futureHomeValue < RENT_VS_BUY_BASE.homePrice) {
      throw new Error("Zero appreciation should not reduce future home value below purchase price.");
    }
  },
  "high-mortgage-rate": () => {
    const low = calculateRentVsBuyOracle({ ...RENT_VS_BUY_BASE, mortgageInterestRate: 4 });
    const high = calculateRentVsBuyOracle({ ...RENT_VS_BUY_BASE, mortgageInterestRate: 9 });
    if (high.monthlyMortgagePayment <= low.monthlyMortgagePayment) {
      throw new Error("Higher mortgage rate must increase monthly payment.");
    }
  },
  "invalid-years": () => {
    try {
      calculateRentVsBuyOracle({ ...RENT_VS_BUY_BASE, comparisonYears: 2026 });
      throw new Error("Expected calendar year validation error.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
};

const BREAK_EVEN_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-volume": () => {
    const result = calculateBreakEvenOracle({ fixedCost: 50_000, unitPrice: 100, variableCost: 60 });
    if (result.breakEvenUnits <= 0) {
      throw new Error("Expected positive break-even units.");
    }
  },
  "edge-zero-fixed": () => {
    const result = calculateBreakEvenOracle({ fixedCost: 0, unitPrice: 80, variableCost: 35 });
    if (Math.abs(result.breakEvenUnits) > 0.01) {
      throw new Error("Zero fixed cost should yield zero break-even units.");
    }
  },
  "absurd-contribution": () => {
    try {
      calculateBreakEvenOracle({ fixedCost: 10_000, unitPrice: 50, variableCost: 60 });
      throw new Error("Expected validation error for non-positive contribution.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-fixed": () => {
    const low = calculateBreakEvenOracle({ fixedCost: 20_000, unitPrice: 100, variableCost: 60 });
    const high = calculateBreakEvenOracle({ fixedCost: 30_000, unitPrice: 100, variableCost: 60 });
    if (high.breakEvenUnits <= low.breakEvenUnits) {
      throw new Error("Higher fixed cost must increase break-even units.");
    }
  },
  "sensitivity-price": () => {
    const low = calculateBreakEvenOracle({ fixedCost: 20_000, unitPrice: 90, variableCost: 60 });
    const high = calculateBreakEvenOracle({ fixedCost: 20_000, unitPrice: 110, variableCost: 60 });
    if (high.breakEvenUnits >= low.breakEvenUnits) {
      throw new Error("Higher unit price must reduce break-even units.");
    }
  },
};

const SALARY_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-burden": () => {
    const result = calculateSalaryCostOracle({ grossSalary: 5000, employerRatePercent: 20 });
    if (Math.abs(result.totalEmployerCost - 6000) > 0.01) {
      throw new Error("Expected 20% burden to yield $6,000 total.");
    }
  },
  "edge-zero-burden": () => {
    const result = calculateSalaryCostOracle({ grossSalary: 5000, employerRatePercent: 0 });
    if (Math.abs(result.totalEmployerCost - 5000) > 0.01) {
      throw new Error("Zero burden should equal gross salary.");
    }
  },
  "absurd-burden": () => {
    try {
      calculateSalaryCostOracle({ grossSalary: -1000, employerRatePercent: 20 });
      throw new Error("Expected validation error for negative salary.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-salary": () => {
    const low = calculateSalaryCostOracle({ grossSalary: 4000, employerRatePercent: 20 });
    const high = calculateSalaryCostOracle({ grossSalary: 5000, employerRatePercent: 20 });
    if (high.totalEmployerCost <= low.totalEmployerCost) {
      throw new Error("Higher gross salary must increase total employer cost.");
    }
  },
  "sensitivity-burden": () => {
    const base = calculateSalaryCostOracle({ grossSalary: 5000, employerRatePercent: 20 });
    const bumped = calculateSalaryCostOracle({ grossSalary: 5000, employerRatePercent: 25 });
    if (bumped.totalEmployerCost <= base.totalEmployerCost) {
      throw new Error("+5% burden must increase total employer cost.");
    }
  },
};

const CASH_FLOW_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-gap": () => {
    const result = calculateCashFlowGapOracle({ receivablesDays: 45, payableDays: 30, dailyCost: 1000 });
    if (result.workingCapitalGap <= 0) {
      throw new Error("Expected positive working capital gap.");
    }
  },
  "edge-balanced": () => {
    const result = calculateCashFlowGapOracle({ receivablesDays: 30, payableDays: 30, dailyCost: 1000 });
    if (Math.abs(result.workingCapitalGap) > 0.01) {
      throw new Error("Equal receivable and payable days should yield zero gap.");
    }
  },
  "absurd-negative-days": () => {
    try {
      calculateCashFlowGapOracle({ receivablesDays: -5, payableDays: 30, dailyCost: 1000 });
      throw new Error("Expected validation error for negative days.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-receivables": () => {
    const low = calculateCashFlowGapOracle({ receivablesDays: 35, payableDays: 30, dailyCost: 1000 });
    const high = calculateCashFlowGapOracle({ receivablesDays: 45, payableDays: 30, dailyCost: 1000 });
    if (high.workingCapitalGap <= low.workingCapitalGap) {
      throw new Error("Longer receivables must widen working capital gap.");
    }
  },
  "sensitivity-daily-cost": () => {
    const base = calculateCashFlowGapOracle({ receivablesDays: 45, payableDays: 30, dailyCost: 1000 });
    const bumped = calculateCashFlowGapOracle({ receivablesDays: 45, payableDays: 30, dailyCost: 1200 });
    if (bumped.workingCapitalGap <= base.workingCapitalGap) {
      throw new Error("Higher daily cost must widen gap amount.");
    }
  },
};

const MACHINE_TIME_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-job": () => {
    const result = calculateMachineTimeOracle({
      setupMinutes: 30,
      cycleSeconds: 45,
      quantity: 100,
      machineRate: 85,
    });
    if (result.machineCost <= 0) {
      throw new Error("Expected positive machine cost.");
    }
  },
  "edge-single-part": () => {
    const result = calculateMachineTimeOracle({
      setupMinutes: 90,
      cycleSeconds: 180,
      quantity: 1,
      machineRate: 110,
    });
    if (result.totalMinutes < 90) {
      throw new Error("Setup-heavy single-part job must include setup minutes.");
    }
  },
  "absurd-quantity": () => {
    try {
      calculateMachineTimeOracle({ setupMinutes: 30, cycleSeconds: 45, quantity: 0, machineRate: 85 });
      throw new Error("Expected validation error for zero quantity.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-cycle": () => {
    const low = calculateMachineTimeOracle({
      setupMinutes: 30,
      cycleSeconds: 30,
      quantity: 100,
      machineRate: 85,
    });
    const high = calculateMachineTimeOracle({
      setupMinutes: 30,
      cycleSeconds: 60,
      quantity: 100,
      machineRate: 85,
    });
    if (high.machineCost <= low.machineCost) {
      throw new Error("Longer cycle must increase machine cost.");
    }
  },
  "sensitivity-rate": () => {
    const base = calculateMachineTimeOracle({
      setupMinutes: 30,
      cycleSeconds: 45,
      quantity: 100,
      machineRate: 85,
    });
    const bumped = calculateMachineTimeOracle({
      setupMinutes: 30,
      cycleSeconds: 45,
      quantity: 100,
      machineRate: 93.5,
    });
    if (bumped.machineCost <= base.machineCost) {
      throw new Error("+10% machine rate must increase machine cost.");
    }
  },
};

const CNC_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-quote": () => {
    const result = calculateCncQuoteRiskOracle({
      setupTime: 90,
      cycleTime: 2.5,
      quantity: 50,
      toolCost: 400,
      materialCost: 800,
      machineRate: 95,
    });
    if (result.baseCost <= 0) {
      throw new Error("Expected positive CNC base cost.");
    }
  },
  "edge-setup-heavy": () => {
    const result = calculateCncQuoteRiskOracle({
      setupTime: 240,
      cycleTime: 1.2,
      quantity: 5,
      toolCost: 900,
      materialCost: 500,
      machineRate: 100,
    });
    if (result.machineHours < 4) {
      throw new Error("Setup-heavy edge case should reflect long setup time.");
    }
  },
  "absurd-zero-rate": () => {
    try {
      calculateCncQuoteRiskOracle({
        setupTime: 90,
        cycleTime: 2.5,
        quantity: 50,
        toolCost: 400,
        materialCost: 800,
        machineRate: 0,
      });
      throw new Error("Expected validation error for zero machine rate.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-tooling": () => {
    const low = calculateCncQuoteRiskOracle({
      setupTime: 90,
      cycleTime: 2.5,
      quantity: 50,
      toolCost: 400,
      materialCost: 800,
      machineRate: 95,
    });
    const high = calculateCncQuoteRiskOracle({
      setupTime: 90,
      cycleTime: 2.5,
      quantity: 50,
      toolCost: 700,
      materialCost: 800,
      machineRate: 95,
    });
    if (high.baseCost <= low.baseCost) {
      throw new Error("Higher tool cost must increase base cost.");
    }
  },
  "sensitivity-margin": () => {
    const low = calculatePremiumDecisionReport("cnc-quote-risk-analyzer", {
      setupTime: 90,
      cycleTime: 2.5,
      quantity: 50,
      toolCost: 400,
      materialCost: 800,
      machineRate: 95,
      riskMargin: 10,
    });
    const high = calculatePremiumDecisionReport("cnc-quote-risk-analyzer", {
      setupTime: 90,
      cycleTime: 2.5,
      quantity: 50,
      toolCost: 400,
      materialCost: 800,
      machineRate: 95,
      riskMargin: 20,
    });
    if (high.minimumSafePrice <= low.minimumSafePrice) {
      throw new Error("Higher risk margin must increase minimum safe price.");
    }
  },
};

const PROJECT_COST_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-change": () => {
    const result = calculateProjectChangeOrderFreeOracle({
      originalBudget: 500_000,
      changeEstimate: 25_000,
      deadlinePressureWastePercent: 5,
    });
    if (result.adjustedChange <= 0 || result.changeRatioPercent <= 0) {
      throw new Error("Expected positive adjusted change for normal change order.");
    }
  },
  "edge-high-pressure": () => {
    const low = calculateProjectChangeOrderFreeOracle({
      originalBudget: 200_000,
      changeEstimate: 40_000,
      deadlinePressureWastePercent: 5,
    });
    const high = calculateProjectChangeOrderFreeOracle({
      originalBudget: 200_000,
      changeEstimate: 40_000,
      deadlinePressureWastePercent: 15,
    });
    if (high.adjustedChange <= low.adjustedChange) {
      throw new Error("Higher deadline pressure waste must increase adjusted change.");
    }
  },
  "absurd-zero-budget": () => {
    try {
      calculateProjectChangeOrderFreeOracle({
        originalBudget: 0,
        changeEstimate: 10_000,
        deadlinePressureWastePercent: 5,
      });
      throw new Error("Expected validation error for zero original budget.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-change": () => {
    const base = calculateProjectChangeOrderFreeOracle({
      originalBudget: 400_000,
      changeEstimate: 20_000,
      deadlinePressureWastePercent: 10,
    });
    const bumped = calculateProjectChangeOrderFreeOracle({
      originalBudget: 400_000,
      changeEstimate: 30_000,
      deadlinePressureWastePercent: 10,
    });
    if (bumped.adjustedChange <= base.adjustedChange) {
      throw new Error("Higher change estimate must increase adjusted change.");
    }
  },
  "sensitivity-waste": () => {
    const base = calculateProjectChangeOrderFreeOracle({
      originalBudget: 300_000,
      changeEstimate: 15_000,
      deadlinePressureWastePercent: 5,
    });
    const bumped = calculateProjectChangeOrderFreeOracle({
      originalBudget: 300_000,
      changeEstimate: 15_000,
      deadlinePressureWastePercent: 10,
    });
    if (bumped.adjustedChange <= base.adjustedChange) {
      throw new Error("Higher waste percent must increase adjusted change.");
    }
  },
};

const CLEANING_COST_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-office": () => {
    const result = calculateCleaningIssaFreeOracle({
      areaSize: 12_000,
      staffCount: 2,
      visitFrequency: 20,
    });
    if (result.monthlyHours <= 0) {
      throw new Error("Expected positive monthly hours for normal office.");
    }
  },
  "edge-high-frequency": () => {
    const low = calculateCleaningIssaFreeOracle({
      areaSize: 6_000,
      staffCount: 1,
      visitFrequency: 12,
    });
    const high = calculateCleaningIssaFreeOracle({
      areaSize: 6_000,
      staffCount: 1,
      visitFrequency: 30,
    });
    if (high.monthlyHours <= low.monthlyHours) {
      throw new Error("Higher visit frequency must increase monthly hours.");
    }
  },
  "absurd-zero-area": () => {
    try {
      calculateCleaningIssaFreeOracle({
        areaSize: 0,
        staffCount: 2,
        visitFrequency: 12,
      });
      throw new Error("Expected validation error for zero area.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-area": () => {
    const base = calculateCleaningIssaFreeOracle({
      areaSize: 8_000,
      staffCount: 2,
      visitFrequency: 16,
    });
    const bumped = calculateCleaningIssaFreeOracle({
      areaSize: 12_000,
      staffCount: 2,
      visitFrequency: 16,
    });
    if (bumped.monthlyHours <= base.monthlyHours) {
      throw new Error("Larger area must increase monthly hours.");
    }
  },
  "sensitivity-staff": () => {
    const oneStaff = calculateCleaningIssaFreeOracle({
      areaSize: 10_000,
      staffCount: 1,
      visitFrequency: 20,
    });
    const twoStaff = calculateCleaningIssaFreeOracle({
      areaSize: 10_000,
      staffCount: 2,
      visitFrequency: 20,
    });
    if (twoStaff.hoursPerVisit >= oneStaff.hoursPerVisit) {
      throw new Error("More staff must reduce hours per visit.");
    }
  },
};

const FOOD_COST_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-menu-item": () => {
    const result = calculateFoodCostOracle({ ingredientCost: 4.5, menuPrice: 16 });
    if (result.foodCostPercent <= 0 || result.foodCostPercent >= 100) {
      throw new Error("Normal menu item should yield food cost percent between 0 and 100.");
    }
  },
  "edge-thin-margin": () => {
    const result = calculateFoodCostOracle({ ingredientCost: 14.5, menuPrice: 16 });
    if (result.foodCostPercent < 80) {
      throw new Error("Thin margin edge case should show high food cost percent.");
    }
  },
  "absurd-zero-price": () => {
    try {
      calculateFoodCostOracle({ ingredientCost: 5, menuPrice: 0 });
      throw new Error("Expected validation error for zero menu price.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-ingredient": () => {
    const base = calculateFoodCostOracle({ ingredientCost: 4, menuPrice: 18 });
    const bumped = calculateFoodCostOracle({ ingredientCost: 5, menuPrice: 18 });
    if (bumped.foodCostPercent <= base.foodCostPercent) {
      throw new Error("Higher ingredient cost must increase food cost percent.");
    }
  },
  "sensitivity-menu-price": () => {
    const base = calculateFoodCostOracle({ ingredientCost: 5, menuPrice: 20 });
    const bumped = calculateFoodCostOracle({ ingredientCost: 5, menuPrice: 22 });
    if (bumped.foodCostPercent >= base.foodCostPercent) {
      throw new Error("+10% menu price must lower food cost percent.");
    }
  },
};

const PRODUCT_MARGIN_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-sku": () => {
    const result = calculateProductMarginDtcFreeOracle({
      productPrice: 79,
      productCost: 28,
      returnRate: 5,
    });
    if (result.marginPercent <= 0) {
      throw new Error("Healthy SKU should yield positive margin.");
    }
  },
  "edge-high-returns": () => {
    const lowReturns = calculateProductMarginDtcFreeOracle({
      productPrice: 65,
      productCost: 22,
      returnRate: 5,
    });
    const highReturns = calculateProductMarginDtcFreeOracle({
      productPrice: 65,
      productCost: 22,
      returnRate: 22,
    });
    if (highReturns.marginPercent >= lowReturns.marginPercent) {
      throw new Error("Higher return rate must erode margin.");
    }
  },
  "absurd-zero-price": () => {
    try {
      calculateProductMarginDtcFreeOracle({
        productPrice: 0,
        productCost: 10,
        returnRate: 5,
      });
      throw new Error("Expected validation error for zero product price.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-cost": () => {
    const base = calculateProductMarginDtcFreeOracle({
      productPrice: 80,
      productCost: 25,
      returnRate: 5,
    });
    const bumped = calculateProductMarginDtcFreeOracle({
      productPrice: 80,
      productCost: 32,
      returnRate: 5,
    });
    if (bumped.marginPercent >= base.marginPercent) {
      throw new Error("Higher product cost must lower margin.");
    }
  },
  "sensitivity-returns": () => {
    const base = calculateProductMarginDtcFreeOracle({
      productPrice: 90,
      productCost: 30,
      returnRate: 4,
    });
    const bumped = calculateProductMarginDtcFreeOracle({
      productPrice: 90,
      productCost: 30,
      returnRate: 12,
    });
    if (bumped.marginPercent >= base.marginPercent) {
      throw new Error("Higher return rate must erode net margin.");
    }
  },
};

const WELDING_COST_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-job": () => {
    const result = calculateWeldingCostOracle({
      materialCost: 450,
      laborHours: 12,
      laborRate: 68,
      consumablesCost: 95,
    });
    if (result.estimatedCost <= 0) {
      throw new Error("Expected positive welding cost for normal job.");
    }
  },
  "edge-material-heavy": () => {
    const result = calculateWeldingCostOracle({
      materialCost: 3_500,
      laborHours: 6,
      laborRate: 70,
      consumablesCost: 120,
    });
    if (result.estimatedCost <= result.laborCost) {
      throw new Error("Material-heavy edge case should have material dominate labor.");
    }
  },
  "absurd-zero-hours": () => {
    try {
      calculateWeldingCostOracle({
        materialCost: 500,
        laborHours: 0,
        laborRate: 65,
        consumablesCost: 80,
      });
      throw new Error("Expected validation error for zero labor hours.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-length": () => {
    const base = calculateWeldingCostOracle({
      materialCost: 400,
      laborHours: 8,
      laborRate: 65,
      consumablesCost: 70,
    });
    const bumped = calculateWeldingCostOracle({
      materialCost: 400,
      laborHours: 12,
      laborRate: 65,
      consumablesCost: 70,
    });
    if (bumped.estimatedCost <= base.estimatedCost) {
      throw new Error("Longer weld labor hours must increase estimated cost.");
    }
  },
  "sensitivity-consumables": () => {
    const base = calculateWeldingCostOracle({
      materialCost: 350,
      laborHours: 10,
      laborRate: 68,
      consumablesCost: 80,
    });
    const bumped = calculateWeldingCostOracle({
      materialCost: 350,
      laborHours: 10,
      laborRate: 68,
      consumablesCost: 120,
    });
    if (bumped.estimatedCost <= base.estimatedCost) {
      throw new Error("Higher consumables cost must increase estimated cost.");
    }
  },
};

const CHANGE_ORDER_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-change": () => {
    const result = calculateChangeOrderImpactOracle({
      originalContractValue: 25000,
      originalEstimatedCost: 18500,
      extraLaborHours: 24,
      laborHourlyRate: 42,
      extraMaterialCost: 1800,
      extraEquipmentCost: 450,
      delayDays: 5,
      dailyOverheadCost: 350,
      targetChangeMargin: 18,
      customerOfferedPrice: 4500,
    });
    if (result.extraDirectCost <= 0) {
      throw new Error("Expected positive extra direct cost for normal change.");
    }
  },
  "edge-zero-delay": () => {
    const result = calculateChangeOrderImpactOracle({
      originalContractValue: 40000,
      originalEstimatedCost: 30000,
      extraLaborHours: 16,
      laborHourlyRate: 45,
      extraMaterialCost: 2200,
      extraEquipmentCost: 600,
      delayDays: 0,
      dailyOverheadCost: 300,
      targetChangeMargin: 22,
      customerOfferedPrice: 5200,
    });
    if (result.delayCost !== 0) {
      throw new Error("Zero delay days should yield zero delay cost.");
    }
  },
  "absurd-negative-delay": () => {
    try {
      calculateChangeOrderImpactOracle({
        originalContractValue: 20000,
        originalEstimatedCost: 15000,
        extraLaborHours: 10,
        laborHourlyRate: 40,
        extraMaterialCost: 500,
        extraEquipmentCost: 100,
        delayDays: -2,
        dailyOverheadCost: 200,
        targetChangeMargin: 18,
        customerOfferedPrice: 2000,
      });
      throw new Error("Expected validation error for negative delay days.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-change-cost": () => {
    const base = calculateChangeOrderImpactOracle({
      originalContractValue: 25000,
      originalEstimatedCost: 18500,
      extraLaborHours: 20,
      laborHourlyRate: 42,
      extraMaterialCost: 1500,
      extraEquipmentCost: 400,
      delayDays: 3,
      dailyOverheadCost: 300,
      targetChangeMargin: 18,
      customerOfferedPrice: 4000,
    });
    const bumped = calculateChangeOrderImpactOracle({
      originalContractValue: 25000,
      originalEstimatedCost: 18500,
      extraLaborHours: 28,
      laborHourlyRate: 42,
      extraMaterialCost: 1500,
      extraEquipmentCost: 400,
      delayDays: 3,
      dailyOverheadCost: 300,
      targetChangeMargin: 18,
      customerOfferedPrice: 4000,
    });
    if (bumped.extraDirectCost <= base.extraDirectCost) {
      throw new Error("More extra labor hours must increase extra direct cost.");
    }
  },
  "sensitivity-crew-rate": () => {
    const base = calculateChangeOrderImpactOracle({
      originalContractValue: 25000,
      originalEstimatedCost: 18500,
      extraLaborHours: 20,
      laborHourlyRate: 40,
      extraMaterialCost: 1500,
      extraEquipmentCost: 400,
      delayDays: 4,
      dailyOverheadCost: 320,
      targetChangeMargin: 18,
      customerOfferedPrice: 4000,
    });
    const bumped = calculateChangeOrderImpactOracle({
      originalContractValue: 25000,
      originalEstimatedCost: 18500,
      extraLaborHours: 20,
      laborHourlyRate: 48,
      extraMaterialCost: 1500,
      extraEquipmentCost: 400,
      delayDays: 4,
      dailyOverheadCost: 320,
      targetChangeMargin: 18,
      customerOfferedPrice: 4000,
    });
    if (bumped.minimumSafeChangePrice <= base.minimumSafeChangePrice) {
      throw new Error("Higher labor hourly rate must widen minimum safe change price.");
    }
  },
};

const OFFICE_CLEANING_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-contract": () => {
    const result = calculateOfficeCleaningBidOptimizerOracle({
      area: 6000,
      frequencyPerMonth: 12,
      hoursPerVisit: 3,
      crewSize: 2,
      laborHourlyCost: 19,
      suppliesCostPerVisit: 18,
      travelCostPerVisit: 22,
      monthlyOverhead: 180,
      targetMargin: 30,
      customerBudget: 1800,
    });
    if (result.minimumSafeMonthlyBid <= result.monthlyDirectCost) {
      throw new Error("Minimum safe bid must exceed monthly direct cost.");
    }
  },
  "edge-high-frequency": () => {
    const low = calculateOfficeCleaningBidOptimizerOracle({
      area: 8000,
      frequencyPerMonth: 12,
      hoursPerVisit: 3,
      crewSize: 2,
      laborHourlyCost: 20,
      suppliesCostPerVisit: 15,
      travelCostPerVisit: 20,
      monthlyOverhead: 200,
      targetMargin: 22,
      customerBudget: 2000,
    });
    const high = calculateOfficeCleaningBidOptimizerOracle({
      area: 8000,
      frequencyPerMonth: 22,
      hoursPerVisit: 2,
      crewSize: 2,
      laborHourlyCost: 20,
      suppliesCostPerVisit: 15,
      travelCostPerVisit: 20,
      monthlyOverhead: 200,
      targetMargin: 22,
      customerBudget: 2500,
    });
    if (high.monthlyDirectCost <= low.monthlyDirectCost) {
      throw new Error("Higher visit frequency must increase monthly direct cost.");
    }
  },
  "absurd-zero-visits": () => {
    try {
      calculateOfficeCleaningBidOptimizerOracle({
        area: 5000,
        frequencyPerMonth: 0,
        hoursPerVisit: 3,
        crewSize: 2,
        laborHourlyCost: 19,
        suppliesCostPerVisit: 18,
        travelCostPerVisit: 22,
        monthlyOverhead: 180,
        targetMargin: 30,
        customerBudget: 1800,
      });
      throw new Error("Expected validation error for zero visit frequency.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-labor-hours": () => {
    const base = calculateOfficeCleaningBidOptimizerOracle({
      area: 6000,
      frequencyPerMonth: 12,
      hoursPerVisit: 2.5,
      crewSize: 2,
      laborHourlyCost: 19,
      suppliesCostPerVisit: 18,
      travelCostPerVisit: 22,
      monthlyOverhead: 180,
      targetMargin: 28,
      customerBudget: 1700,
    });
    const bumped = calculateOfficeCleaningBidOptimizerOracle({
      area: 6000,
      frequencyPerMonth: 12,
      hoursPerVisit: 3.5,
      crewSize: 2,
      laborHourlyCost: 19,
      suppliesCostPerVisit: 18,
      travelCostPerVisit: 22,
      monthlyOverhead: 180,
      targetMargin: 28,
      customerBudget: 1700,
    });
    if (bumped.minimumSafeMonthlyBid <= base.minimumSafeMonthlyBid) {
      throw new Error("More hours per visit must raise minimum safe bid.");
    }
  },
  "sensitivity-supply": () => {
    const base = calculateOfficeCleaningBidOptimizerOracle({
      area: 6000,
      frequencyPerMonth: 12,
      hoursPerVisit: 3,
      crewSize: 2,
      laborHourlyCost: 19,
      suppliesCostPerVisit: 18,
      travelCostPerVisit: 22,
      monthlyOverhead: 180,
      targetMargin: 30,
      customerBudget: 1800,
    });
    const bumped = calculateOfficeCleaningBidOptimizerOracle({
      area: 6000,
      frequencyPerMonth: 12,
      hoursPerVisit: 3,
      crewSize: 2,
      laborHourlyCost: 19,
      suppliesCostPerVisit: 28,
      travelCostPerVisit: 22,
      monthlyOverhead: 180,
      targetMargin: 30,
      customerBudget: 1800,
    });
    if (bumped.minimumSafeMonthlyBid <= base.minimumSafeMonthlyBid) {
      throw new Error("Higher supply cost must raise minimum safe bid.");
    }
  },
};

const MENU_PROFIT_LEAK_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-item": () => {
    const result = calculateMenuProfitLeakDetectorOracle({
      sellingPrice: 14.5,
      ingredientCost: 3.8,
      wasteRate: 8,
      packagingCost: 0.45,
      laborCostPerItem: 1.2,
      deliveryCommissionRate: 22,
      targetMargin: 55,
      monthlyUnitsSold: 420,
    });
    if (result.actualMargin <= 0) {
      throw new Error("Normal menu item should yield positive margin.");
    }
  },
  "edge-high-delivery": () => {
    const low = calculateMenuProfitLeakDetectorOracle({
      sellingPrice: 15,
      ingredientCost: 3.5,
      wasteRate: 6,
      packagingCost: 0.5,
      laborCostPerItem: 1,
      deliveryCommissionRate: 12,
      targetMargin: 52,
      monthlyUnitsSold: 500,
    });
    const high = calculateMenuProfitLeakDetectorOracle({
      sellingPrice: 15,
      ingredientCost: 3.5,
      wasteRate: 6,
      packagingCost: 0.5,
      laborCostPerItem: 1,
      deliveryCommissionRate: 32,
      targetMargin: 52,
      monthlyUnitsSold: 500,
    });
    if (high.actualMargin >= low.actualMargin) {
      throw new Error("Higher delivery commission must erode actual margin.");
    }
  },
  "absurd-waste": () => {
    try {
      calculateMenuProfitLeakDetectorOracle({
        sellingPrice: 12,
        ingredientCost: 3,
        wasteRate: 150,
        packagingCost: 0.3,
        laborCostPerItem: 0.9,
        deliveryCommissionRate: 15,
        targetMargin: 50,
        monthlyUnitsSold: 200,
      });
      throw new Error("Expected validation error for waste rate above 100%.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-waste": () => {
    const base = calculateMenuProfitLeakDetectorOracle({
      sellingPrice: 16,
      ingredientCost: 4,
      wasteRate: 5,
      packagingCost: 0.4,
      laborCostPerItem: 1.1,
      deliveryCommissionRate: 18,
      targetMargin: 55,
      monthlyUnitsSold: 300,
    });
    const bumped = calculateMenuProfitLeakDetectorOracle({
      sellingPrice: 16,
      ingredientCost: 4,
      wasteRate: 12,
      packagingCost: 0.4,
      laborCostPerItem: 1.1,
      deliveryCommissionRate: 18,
      targetMargin: 55,
      monthlyUnitsSold: 300,
    });
    if (bumped.minimumSafePrice <= base.minimumSafePrice) {
      throw new Error("Higher waste rate must increase minimum safe price.");
    }
  },
  "sensitivity-labor": () => {
    const base = calculateMenuProfitLeakDetectorOracle({
      sellingPrice: 18,
      ingredientCost: 4.2,
      wasteRate: 6,
      packagingCost: 0.35,
      laborCostPerItem: 1,
      deliveryCommissionRate: 15,
      targetMargin: 58,
      monthlyUnitsSold: 250,
    });
    const bumped = calculateMenuProfitLeakDetectorOracle({
      sellingPrice: 18,
      ingredientCost: 4.2,
      wasteRate: 6,
      packagingCost: 0.35,
      laborCostPerItem: 1.6,
      deliveryCommissionRate: 15,
      targetMargin: 58,
      monthlyUnitsSold: 250,
    });
    if (bumped.minimumSafePrice <= base.minimumSafePrice) {
      throw new Error("Higher labor cost per item must widen minimum safe price.");
    }
  },
};

const RETURN_PROFIT_EROSION_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-sku": () => {
    const result = calculateReturnProfitErosionOracle({
      sellingPrice: 79,
      productCost: 28,
      shippingCost: 6.5,
      platformFeeRate: 12,
      paymentFeeRate: 2.9,
      returnRate: 8,
      returnHandlingCost: 4.5,
      adCostPerOrder: 9,
      targetMargin: 25,
    });
    if (!Number.isFinite(result.netProfit)) {
      throw new Error("Expected finite net profit for normal SKU.");
    }
  },
  "edge-high-returns": () => {
    const low = calculateReturnProfitErosionOracle({
      sellingPrice: 65,
      productCost: 22,
      shippingCost: 7,
      platformFeeRate: 10,
      paymentFeeRate: 2.9,
      returnRate: 5,
      returnHandlingCost: 4,
      adCostPerOrder: 8,
      targetMargin: 22,
    });
    const high = calculateReturnProfitErosionOracle({
      sellingPrice: 65,
      productCost: 22,
      shippingCost: 7,
      platformFeeRate: 10,
      paymentFeeRate: 2.9,
      returnRate: 22,
      returnHandlingCost: 4,
      adCostPerOrder: 8,
      targetMargin: 22,
    });
    if (high.netProfit >= low.netProfit) {
      throw new Error("Higher return rate must reduce net profit.");
    }
  },
  "absurd-return-rate": () => {
    try {
      calculateReturnProfitErosionOracle({
        sellingPrice: 50,
        productCost: 18,
        shippingCost: 5,
        platformFeeRate: 10,
        paymentFeeRate: 3,
        returnRate: 110,
        returnHandlingCost: 4,
        adCostPerOrder: 8,
        targetMargin: 25,
      });
      throw new Error("Expected validation error for return rate above 100%.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-return": () => {
    const base = calculateReturnProfitErosionOracle({
      sellingPrice: 80,
      productCost: 28,
      shippingCost: 6,
      platformFeeRate: 10,
      paymentFeeRate: 3,
      returnRate: 6,
      returnHandlingCost: 4,
      adCostPerOrder: 9,
      targetMargin: 25,
    });
    const bumped = calculateReturnProfitErosionOracle({
      sellingPrice: 80,
      productCost: 28,
      shippingCost: 6,
      platformFeeRate: 10,
      paymentFeeRate: 3,
      returnRate: 14,
      returnHandlingCost: 4,
      adCostPerOrder: 9,
      targetMargin: 25,
    });
    if (bumped.returnImpact <= base.returnImpact) {
      throw new Error("Higher return rate must increase return impact.");
    }
  },
  "sensitivity-shipping": () => {
    const base = calculateReturnProfitErosionOracle({
      sellingPrice: 75,
      productCost: 26,
      shippingCost: 5,
      platformFeeRate: 10,
      paymentFeeRate: 3,
      returnRate: 8,
      returnHandlingCost: 4,
      adCostPerOrder: 8,
      targetMargin: 24,
    });
    const bumped = calculateReturnProfitErosionOracle({
      sellingPrice: 75,
      productCost: 26,
      shippingCost: 9,
      platformFeeRate: 10,
      paymentFeeRate: 3,
      returnRate: 8,
      returnHandlingCost: 4,
      adCostPerOrder: 8,
      targetMargin: 24,
    });
    if (bumped.requiredPriceForTargetMargin <= base.requiredPriceForTargetMargin) {
      throw new Error("Higher shipping cost must widen required price for target margin.");
    }
  },
};

const WELDING_BID_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-fab": () => {
    const result = calculateWeldingBidRiskOracle({
      materialCost: 850,
      laborHours: 14,
      laborRate: 72,
      gasConsumableCost: 95,
      fitUpHours: 3,
      reworkRiskPercent: 10,
      targetMargin: 25,
    });
    if (result.minimumSafePrice <= result.baseCost) {
      throw new Error("Minimum safe bid must exceed visible base cost.");
    }
  },
  "edge-fit-up-heavy": () => {
    const low = calculateWeldingBidRiskOracle({
      materialCost: 600,
      laborHours: 8,
      laborRate: 70,
      gasConsumableCost: 80,
      fitUpHours: 2,
      reworkRiskPercent: 10,
      targetMargin: 25,
    });
    const high = calculateWeldingBidRiskOracle({
      materialCost: 600,
      laborHours: 8,
      laborRate: 70,
      gasConsumableCost: 80,
      fitUpHours: 12,
      reworkRiskPercent: 10,
      targetMargin: 25,
    });
    if (high.baseCost <= low.baseCost) {
      throw new Error("Fit-up-heavy edge case must increase base cost.");
    }
  },
  "absurd-zero-rate": () => {
    try {
      calculateWeldingBidRiskOracle({
        materialCost: 500,
        laborHours: 10,
        laborRate: 0,
        gasConsumableCost: 60,
        fitUpHours: 2,
        reworkRiskPercent: 10,
        targetMargin: 25,
      });
      throw new Error("Expected validation error for zero labor rate.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-rework": () => {
    const low = calculateWeldingBidRiskOracle({
      materialCost: 700,
      laborHours: 12,
      laborRate: 70,
      gasConsumableCost: 90,
      fitUpHours: 4,
      reworkRiskPercent: 5,
      targetMargin: 25,
    });
    const high = calculateWeldingBidRiskOracle({
      materialCost: 700,
      laborHours: 12,
      laborRate: 70,
      gasConsumableCost: 90,
      fitUpHours: 4,
      reworkRiskPercent: 18,
      targetMargin: 25,
    });
    if (high.minimumSafePrice <= low.minimumSafePrice) {
      throw new Error("Higher rework risk must raise minimum safe bid.");
    }
  },
  "sensitivity-margin": () => {
    const low = calculateWeldingBidRiskOracle({
      materialCost: 850,
      laborHours: 14,
      laborRate: 72,
      gasConsumableCost: 95,
      fitUpHours: 3,
      reworkRiskPercent: 10,
      targetMargin: 18,
    });
    const high = calculateWeldingBidRiskOracle({
      materialCost: 850,
      laborHours: 14,
      laborRate: 72,
      gasConsumableCost: 95,
      fitUpHours: 3,
      reworkRiskPercent: 10,
      targetMargin: 28,
    });
    if (high.minimumSafePrice <= low.minimumSafePrice) {
      throw new Error("Higher target margin must raise minimum safe bid.");
    }
  },
};

const SCENARIO_HANDLERS: Record<string, Record<string, ScenarioHandler>> = {
  "project-cost-calculator": PROJECT_COST_SCENARIOS,
  "cleaning-cost-calculator": CLEANING_COST_SCENARIOS,
  "food-cost-calculator": FOOD_COST_SCENARIOS,
  "product-margin-calculator": PRODUCT_MARGIN_SCENARIOS,
  "welding-cost-estimator": WELDING_COST_SCENARIOS,
  "loan-payment-calculator": LOAN_SCENARIOS,
  "mortgage-calculator": MORTGAGE_SCENARIOS,
  "interest-calculator": INTEREST_SCENARIOS,
  "compound-interest-calculator": COMPOUND_SCENARIOS,
  "profit-margin-calculator": MARGIN_SCENARIOS,
  "rent-vs-buy-calculator": RENT_VS_BUY_SCENARIOS,
  "break-even-calculator": BREAK_EVEN_SCENARIOS,
  "salary-cost-calculator": SALARY_SCENARIOS,
  "cash-flow-gap-calculator": CASH_FLOW_SCENARIOS,
  "machine-time-calculator": MACHINE_TIME_SCENARIOS,
  "cnc-quote-risk-analyzer": CNC_SCENARIOS,
  "change-order-impact-analyzer": CHANGE_ORDER_SCENARIOS,
  "office-cleaning-bid-optimizer": OFFICE_CLEANING_SCENARIOS,
  "menu-profit-leak-detector": MENU_PROFIT_LEAK_SCENARIOS,
  "return-profit-erosion-tool": RETURN_PROFIT_EROSION_SCENARIOS,
  "welding-bid-risk-analyzer": WELDING_BID_SCENARIOS,
  ...BATCH_FREE_BATCH2_SCENARIO_HANDLERS,
  ...P77_BATCH_B_SCENARIO_HANDLERS,
  ...BATCH_PREMIUM_BATCH3_SCENARIO_HANDLERS,
  ...BATCH_PREMIUM_SCHEMA_SCENARIO_HANDLERS,
  ...BATCH_TRAFFIC_CATALOG_SCENARIO_HANDLERS,
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

  if (
    !isFinanceOracleSlug(slug) &&
    !isRentVsBuyOracleSlug(slug) &&
    !isBusinessOracleSlug(slug) &&
    !isOperationsOracleSlug(slug) &&
    !isBatchFreeOracleSlug(slug) &&
    !isBatchPremiumOracleSlug(slug) &&
    !isBatchFreeBatch2OracleSlug(slug) &&
    !isBatchPremiumBatch3OracleSlug(slug) &&
    !isBatchPremiumSchemaOracleSlug(slug) &&
    !isBatchTrafficCatalogOracleSlug(slug)
  ) {
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
