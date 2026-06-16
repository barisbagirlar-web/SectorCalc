// Auto-generated from clearance-fit-calculator-schema.json
import * as z from 'zod';

export interface Clearance_fit_calculatorInput {
  holeMax: number;
  holeMin: number;
  shaftMax: number;
  shaftMin: number;
}

export const Clearance_fit_calculatorInputSchema = z.object({
  holeMax: z.number().default(20.02),
  holeMin: z.number().default(20),
  shaftMax: z.number().default(19.98),
  shaftMin: z.number().default(19.95),
});

function evaluateAllFormulas(input: Clearance_fit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.holeMin - input.shaftMax; results["minClearance"] = Number.isFinite(v) ? v : 0; } catch { results["minClearance"] = 0; }
  try { const v = input.holeMax - input.shaftMin; results["maxClearance"] = Number.isFinite(v) ? v : 0; } catch { results["maxClearance"] = 0; }
  try { const v = ((results["minClearance"] ?? 0) + (results["maxClearance"] ?? 0)) / 2; results["avgClearance"] = Number.isFinite(v) ? v : 0; } catch { results["avgClearance"] = 0; }
  return results;
}


export function calculateClearance_fit_calculator(input: Clearance_fit_calculatorInput): Clearance_fit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["avgClearance"] ?? 0;
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


export interface Clearance_fit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
