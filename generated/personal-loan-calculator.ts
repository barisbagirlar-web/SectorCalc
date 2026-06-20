// Auto-generated from personal-loan-calculator-schema.json
import * as z from 'zod';

export interface Personal_loan_calculatorInput {
  principal: number;
  annualRate: number;
  termMonths: number;
  originationFee: number;
  dataConfidence?: number;
}

export const Personal_loan_calculatorInputSchema = z.object({
  principal: z.number().default(50000),
  annualRate: z.number().default(5),
  termMonths: z.number().default(60),
  originationFee: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Personal_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.annualRate / 100) / 12; results["monthlyRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyRate"] = Number.NaN; }
  try { const v = input.principal * (input.originationFee / 100); results["originationFeeAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["originationFeeAmount"] = Number.NaN; }
  return results;
}


export function calculatePersonal_loan_calculator(input: Personal_loan_calculatorInput): Personal_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["originationFeeAmount"]);
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


export interface Personal_loan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
