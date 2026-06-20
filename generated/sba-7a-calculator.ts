// Auto-generated from sba-7a-calculator-schema.json
import * as z from 'zod';

export interface Sba_7a_calculatorInput {
  loanAmount: number;
  interestRate: number;
  loanTermMonths: number;
  guaranteeFeeRate: number;
  originationFeeRate: number;
  annualRevenue: number;
  dataConfidence?: number;
}

export const Sba_7a_calculatorInputSchema = z.object({
  loanAmount: z.number().default(500000),
  interestRate: z.number().default(7.5),
  loanTermMonths: z.number().default(120),
  guaranteeFeeRate: z.number().default(2),
  originationFeeRate: z.number().default(1),
  annualRevenue: z.number().default(2000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sba_7a_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.interestRate / 100 / 12; results["monthlyInterestRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyInterestRate"] = Number.NaN; }
  try { const v = input.loanAmount * ((toNumericFormulaValue(results["monthlyInterestRate"])) * (1 + (toNumericFormulaValue(results["monthlyInterestRate"]))) ** input.loanTermMonths) / ((1 + (toNumericFormulaValue(results["monthlyInterestRate"]))) ** input.loanTermMonths - 1); results["monthlyPayment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyPayment"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["monthlyPayment"])) * input.loanTermMonths; results["totalPayment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPayment"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalPayment"])) - input.loanAmount; results["totalInterest"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalInterest"] = Number.NaN; }
  try { const v = input.loanAmount * (input.guaranteeFeeRate / 100); results["guaranteeFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["guaranteeFee"] = Number.NaN; }
  try { const v = input.loanAmount * (input.originationFeeRate / 100); results["originationFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["originationFee"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["guaranteeFee"])) + (toNumericFormulaValue(results["originationFee"])); results["totalFees"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalFees"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalInterest"])) + (toNumericFormulaValue(results["totalFees"])); results["effectiveLoanCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveLoanCost"] = Number.NaN; }
  try { const v = input.annualRevenue / ((toNumericFormulaValue(results["monthlyPayment"])) * 12); results["debtServiceCoverageRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["debtServiceCoverageRatio"] = Number.NaN; }
  return results;
}


export function calculateSba_7a_calculator(input: Sba_7a_calculatorInput): Sba_7a_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthlyPayment"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
