// Auto-generated from annual-compound-interest-calculator-schema.json
import * as z from 'zod';

export interface Annual_compound_interest_calculatorInput {
  principal: number;
  annualRate: number;
  years: number;
  compoundFreq: number;
  dataConfidence?: number;
}

export const Annual_compound_interest_calculatorInputSchema = z.object({
  principal: z.number().default(1000),
  annualRate: z.number().default(5),
  years: z.number().default(10),
  compoundFreq: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Annual_compound_interest_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.principal * (1 + input.annualRate / (100 * input.compoundFreq)) ^ (input.compoundFreq * input.years); results["finalAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["finalAmount"] = 0; }
  try { const v = (asFormulaNumber(results["finalAmount"])) - input.principal; results["totalInterest"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  try { const v = (1 + input.annualRate / (100 * input.compoundFreq)) ^ input.compoundFreq - 1; results["effectiveAnnualRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveAnnualRate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAnnual_compound_interest_calculator(input: Annual_compound_interest_calculatorInput): Annual_compound_interest_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["finalAmount"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Annual_compound_interest_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
