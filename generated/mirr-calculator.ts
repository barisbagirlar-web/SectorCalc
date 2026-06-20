// Auto-generated from mirr-calculator-schema.json
import * as z from 'zod';

export interface Mirr_calculatorInput {
  initialInvestment: number;
  cf1: number;
  cf2: number;
  cf3: number;
  cf4: number;
  cf5: number;
  financeRate: number;
  reinvestmentRate: number;
  dataConfidence?: number;
}

export const Mirr_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(-100000),
  cf1: z.number().default(20000),
  cf2: z.number().default(25000),
  cf3: z.number().default(30000),
  cf4: z.number().default(35000),
  cf5: z.number().default(40000),
  financeRate: z.number().default(10),
  reinvestmentRate: z.number().default(12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mirr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialInvestment * input.cf1 * input.cf2 * input.cf3; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.initialInvestment * input.cf1 * input.cf2 * input.cf3 * (input.cf4 * input.cf5 * (input.financeRate / 100) * (input.reinvestmentRate / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.cf4 * input.cf5 * (input.financeRate / 100) * (input.reinvestmentRate / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateMirr_calculator(input: Mirr_calculatorInput): Mirr_calculatorOutput {
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


export interface Mirr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
