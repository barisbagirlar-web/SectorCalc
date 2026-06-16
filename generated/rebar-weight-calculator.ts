// Auto-generated from rebar-weight-calculator-schema.json
import * as z from 'zod';

export interface Rebar_weight_calculatorInput {
  diameter: number;
  length: number;
  quantity: number;
  density: number;
}

export const Rebar_weight_calculatorInputSchema = z.object({
  diameter: z.number().default(12),
  length: z.number().default(12),
  quantity: z.number().default(1),
  density: z.number().default(7850),
});

function evaluateAllFormulas(input: Rebar_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * Math.pow(input.diameter/1000, 2) / 4 * input.length * input.density; results["weightPerPiece"] = Number.isFinite(v) ? v : 0; } catch { results["weightPerPiece"] = 0; }
  try { const v = (results["weightPerPiece"] ?? 0) * input.quantity; results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  return results;
}


export function calculateRebar_weight_calculator(input: Rebar_weight_calculatorInput): Rebar_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalWeight"] ?? 0;
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


export interface Rebar_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
