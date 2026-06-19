// Auto-generated from one-sided-limit-calculator-schema.json
import * as z from 'zod';

export interface One_sided_limit_calculatorInput {
  mean: number;
  sd: number;
  n: number;
  zp: number;
  zgamma: number;
  direction: number;
  dataConfidence?: number;
}

export const One_sided_limit_calculatorInputSchema = z.object({
  mean: z.number().default(0),
  sd: z.number().default(1),
  n: z.number().default(30),
  zp: z.number().default(2.326),
  zgamma: z.number().default(1.645),
  direction: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: One_sided_limit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mean * input.sd * input.n * input.zp; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.mean * input.sd * input.n * input.zp * (input.zgamma * input.direction); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.zgamma * input.direction; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateOne_sided_limit_calculator(input: One_sided_limit_calculatorInput): One_sided_limit_calculatorOutput {
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


export interface One_sided_limit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
