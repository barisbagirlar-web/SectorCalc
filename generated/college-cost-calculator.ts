// Auto-generated from college-cost-calculator-schema.json
import * as z from 'zod';

export interface College_cost_calculatorInput {
  tuition: number;
  living: number;
  books: number;
  years: number;
  inflation: number;
  scholarship: number;
}

export const College_cost_calculatorInputSchema = z.object({
  tuition: z.number().default(20000),
  living: z.number().default(15000),
  books: z.number().default(2000),
  years: z.number().default(4),
  inflation: z.number().default(3),
  scholarship: z.number().default(0),
});

function evaluateAllFormulas(input: College_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { let sum = 0; for (let i = 0; i < years; i++) { sum += (tuition + living + books) * Math.pow(1 + inflation/100, i); } return sum; })(); results["grossTotal"] = Number.isFinite(v) ? v : 0; } catch { results["grossTotal"] = 0; }
  try { const v = input.scholarship * input.years; results["totalScholarship"] = Number.isFinite(v) ? v : 0; } catch { results["totalScholarship"] = 0; }
  try { const v = Math.max(0, (results["grossTotal"] ?? 0) - (results["totalScholarship"] ?? 0)); results["netCost"] = Number.isFinite(v) ? v : 0; } catch { results["netCost"] = 0; }
  return results;
}


export function calculateCollege_cost_calculator(input: College_cost_calculatorInput): College_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netCost"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface College_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
