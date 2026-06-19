// Auto-generated from xirr-calculator-schema.json
import * as z from 'zod';

export interface Xirr_calculatorInput {
  initialInvestment: number;
  initialDate: number;
  cf1Amount: number;
  cf1Days: number;
  cf2Amount: number;
  cf2Days: number;
  finalValue: number;
  finalDays: number;
  dataConfidence?: number;
}

export const Xirr_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(-10000),
  initialDate: z.number().default(0),
  cf1Amount: z.number().default(0),
  cf1Days: z.number().default(0),
  cf2Amount: z.number().default(0),
  cf2Days: z.number().default(0),
  finalValue: z.number().default(11000),
  finalDays: z.number().default(365),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Xirr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialInvestment * input.initialDate * input.cf1Amount * input.cf1Days; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.initialInvestment * input.initialDate * input.cf1Amount * input.cf1Days * (input.cf2Amount * input.cf2Days * input.finalValue * input.finalDays); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.cf2Amount * input.cf2Days * input.finalValue * input.finalDays; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateXirr_calculator(input: Xirr_calculatorInput): Xirr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Xirr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
