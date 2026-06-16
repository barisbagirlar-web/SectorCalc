// Auto-generated from distance-calculator-schema.json
import * as z from 'zod';

export interface Distance_calculatorInput {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  scale: number;
}

export const Distance_calculatorInputSchema = z.object({
  x1: z.number().default(0),
  y1: z.number().default(0),
  x2: z.number().default(0),
  y2: z.number().default(0),
  scale: z.number().default(1),
});

function evaluateAllFormulas(input: Distance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.x2 - input.x1; results["deltaX"] = Number.isFinite(v) ? v : 0; } catch { results["deltaX"] = 0; }
  try { const v = input.y2 - input.y1; results["deltaY"] = Number.isFinite(v) ? v : 0; } catch { results["deltaY"] = 0; }
  try { const v = Math.sqrt( (input.x2 - input.x1)**2 + (input.y2 - input.y1)**2 ) * input.scale; results["distance"] = Number.isFinite(v) ? v : 0; } catch { results["distance"] = 0; }
  return results;
}


export function calculateDistance_calculator(input: Distance_calculatorInput): Distance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["distance"] ?? 0;
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


export interface Distance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
