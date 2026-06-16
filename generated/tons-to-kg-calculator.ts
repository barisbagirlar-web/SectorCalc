// Auto-generated from tons-to-kg-calculator-schema.json
import * as z from 'zod';

export interface Tons_to_kg_calculatorInput {
  metricTons: number;
  shortTons: number;
  longTons: number;
  knownKilograms: number;
}

export const Tons_to_kg_calculatorInputSchema = z.object({
  metricTons: z.number().default(0),
  shortTons: z.number().default(0),
  longTons: z.number().default(0),
  knownKilograms: z.number().default(0),
});

function evaluateAllFormulas(input: Tons_to_kg_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.metricTons * 1000) + (input.shortTons * 907.18474) + (input.longTons * 1016.0469088); results["totalKg"] = Number.isFinite(v) ? v : 0; } catch { results["totalKg"] = 0; }
  try { const v = input.metricTons * 1000; results["metricKg"] = Number.isFinite(v) ? v : 0; } catch { results["metricKg"] = 0; }
  try { const v = input.shortTons * 907.18474; results["shortKg"] = Number.isFinite(v) ? v : 0; } catch { results["shortKg"] = 0; }
  try { const v = input.longTons * 1016.0469088; results["longKg"] = Number.isFinite(v) ? v : 0; } catch { results["longKg"] = 0; }
  try { const v = input.knownKilograms - ((input.metricTons * 1000) + (input.shortTons * 907.18474) + (input.longTons * 1016.0469088)); results["difference"] = Number.isFinite(v) ? v : 0; } catch { results["difference"] = 0; }
  return results;
}


export function calculateTons_to_kg_calculator(input: Tons_to_kg_calculatorInput): Tons_to_kg_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalKg"] ?? 0;
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


export interface Tons_to_kg_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
