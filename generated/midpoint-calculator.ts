// Auto-generated from midpoint-calculator-schema.json
import * as z from 'zod';

export interface Midpoint_calculatorInput {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const Midpoint_calculatorInputSchema = z.object({
  x1: z.number().default(0),
  y1: z.number().default(0),
  x2: z.number().default(0),
  y2: z.number().default(0),
});

function evaluateAllFormulas(input: Midpoint_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.x1 + input.x2) / 2; results["midX"] = Number.isFinite(v) ? v : 0; } catch { results["midX"] = 0; }
  try { const v = (input.y1 + input.y2) / 2; results["midY"] = Number.isFinite(v) ? v : 0; } catch { results["midY"] = 0; }
  try { const v = Math.sqrt(Math.pow(input.x2 - input.x1, 2) + Math.pow(input.y2 - input.y1, 2)); results["dist"] = Number.isFinite(v) ? v : 0; } catch { results["dist"] = 0; }
  results["__dist__m"] = 0;
  results["__midX__m"] = 0;
  results["__midY__m"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateMidpoint_calculator(input: Midpoint_calculatorInput): Midpoint_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Midpoint_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
