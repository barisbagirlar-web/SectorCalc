// Auto-generated from hydration-calculator-schema.json
import * as z from 'zod';

export interface Hydration_calculatorInput {
  weight: number;
  moderate_activity_hours: number;
  heavy_activity_hours: number;
  average_temperature: number;
}

export const Hydration_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  moderate_activity_hours: z.number().default(0),
  heavy_activity_hours: z.number().default(0),
  average_temperature: z.number().default(25),
});

function evaluateAllFormulas(input: Hydration_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * 0.033 + input.moderate_activity_hours * 0.35 + input.heavy_activity_hours * 0.7 + (input.average_temperature > 30 ? (input.average_temperature - 30) * 0.2 : 0); results["total"] = Number.isFinite(v) ? v : 0; } catch { results["total"] = 0; }
  try { const v = input.weight * 0.033; results["base"] = Number.isFinite(v) ? v : 0; } catch { results["base"] = 0; }
  try { const v = input.moderate_activity_hours * 0.35 + input.heavy_activity_hours * 0.7; results["activity"] = Number.isFinite(v) ? v : 0; } catch { results["activity"] = 0; }
  try { const v = input.average_temperature > 30 ? (input.average_temperature - 30) * 0.2 : 0; results["tempAdjust"] = Number.isFinite(v) ? v : 0; } catch { results["tempAdjust"] = 0; }
  results["__base_toFixed_1___L"] = 0;
  results["__activity_toFixed_1___L"] = 0;
  results["__tempAdjust_toFixed_1___L"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateHydration_calculator(input: Hydration_calculatorInput): Hydration_calculatorOutput {
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


export interface Hydration_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
