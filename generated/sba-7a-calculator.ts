// @ts-nocheck
// Auto-generated from sba-7a-calculator-schema.json
import * as z from 'zod';

export interface Sba_7a_calculatorInput {
  loanAmount: number;
  interestRate: number;
  loanTermMonths: number;
  guaranteeFeeRate: number;
  originationFeeRate: number;
  annualRevenue: number;
}

export const Sba_7a_calculatorInputSchema = z.object({
  loanAmount: z.number().default(500000),
  interestRate: z.number().default(7.5),
  loanTermMonths: z.number().default(120),
  guaranteeFeeRate: z.number().default(2),
  originationFeeRate: z.number().default(1),
  annualRevenue: z.number().default(2000000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sba_7a_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.interestRate / 100 / 12; results["monthlyInterestRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  try { const v = input.loanAmount * ((asFormulaNumber(results["monthlyInterestRate"])) * (1 + (asFormulaNumber(results["monthlyInterestRate"]))) ** input.loanTermMonths) / ((1 + (asFormulaNumber(results["monthlyInterestRate"]))) ** input.loanTermMonths - 1); results["monthlyPayment"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = (asFormulaNumber(results["monthlyPayment"])) * input.loanTermMonths; results["totalPayment"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalPayment"] = 0; }
  try { const v = (asFormulaNumber(results["totalPayment"])) - input.loanAmount; results["totalInterest"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalInterest"] = 0; }
  try { const v = input.loanAmount * (input.guaranteeFeeRate / 100); results["guaranteeFee"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["guaranteeFee"] = 0; }
  try { const v = input.loanAmount * (input.originationFeeRate / 100); results["originationFee"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["originationFee"] = 0; }
  try { const v = (asFormulaNumber(results["guaranteeFee"])) + (asFormulaNumber(results["originationFee"])); results["totalFees"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalFees"] = 0; }
  try { const v = (asFormulaNumber(results["totalInterest"])) + (asFormulaNumber(results["totalFees"])); results["effectiveLoanCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectiveLoanCost"] = 0; }
  try { const v = input.annualRevenue / ((asFormulaNumber(results["monthlyPayment"])) * 12); results["debtServiceCoverageRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["debtServiceCoverageRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSba_7a_calculator(input: Sba_7a_calculatorInput): Sba_7a_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthlyPayment"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Sba_7a_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
