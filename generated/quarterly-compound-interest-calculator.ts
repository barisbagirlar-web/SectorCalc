// Auto-generated from quarterly-compound-interest-calculator-schema.json
import * as z from 'zod';

export interface Quarterly_compound_interest_calculatorInput {
  principal: number;
  annualInterestRate: number;
  years: number;
  compoundingFrequency: number;
  inflationRate: number;
  dataConfidence?: number;
}

export const Quarterly_compound_interest_calculatorInputSchema = z.object({
  principal: z.number().default(1000),
  annualInterestRate: z.number().default(5),
  years: z.number().default(10),
  compoundingFrequency: z.number().default(4),
  inflationRate: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Quarterly_compound_interest_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.principal * (1 + input.annualInterestRate/100 / input.compoundingFrequency) ** (input.compoundingFrequency * input.years); results["finalAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["finalAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["finalAmount"])) - input.principal; results["totalInterest"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalInterest"] = Number.NaN; }
  try { const v = ((1 + input.annualInterestRate/100 / input.compoundingFrequency) ** input.compoundingFrequency - 1) * 100; results["effectiveAnnualRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveAnnualRate"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["finalAmount"])) / (1 + input.inflationRate/100) ** input.years; results["realFinalAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["realFinalAmount"] = Number.NaN; }
  return results;
}


export function calculateQuarterly_compound_interest_calculator(input: Quarterly_compound_interest_calculatorInput): Quarterly_compound_interest_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["finalAmount"]);
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


export interface Quarterly_compound_interest_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
