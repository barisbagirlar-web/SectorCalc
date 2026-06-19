// Auto-generated from real-return-calculator-schema.json
import * as z from 'zod';

export interface Real_return_calculatorInput {
  nominalReturn: number;
  inflationRate: number;
  taxRate: number;
  investmentAmount: number;
  dataConfidence?: number;
}

export const Real_return_calculatorInputSchema = z.object({
  nominalReturn: z.number().default(5),
  inflationRate: z.number().default(2),
  taxRate: z.number().default(0),
  investmentAmount: z.number().default(1000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Real_return_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.nominalReturn / 100) * (input.inflationRate / 100) * (input.taxRate / 100) * input.investmentAmount; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = (input.nominalReturn / 100) * (input.inflationRate / 100) * (input.taxRate / 100) * input.investmentAmount; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateReal_return_calculator(input: Real_return_calculatorInput): Real_return_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Real_return_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
