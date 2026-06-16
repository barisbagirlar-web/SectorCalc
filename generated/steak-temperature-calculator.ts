// Auto-generated from steak-temperature-calculator-schema.json
import * as z from 'zod';

export interface Steak_temperature_calculatorInput {
  thickness: number;
  initialTemp: number;
  targetTemp: number;
  grillTemp: number;
}

export const Steak_temperature_calculatorInputSchema = z.object({
  thickness: z.number().default(2.5),
  initialTemp: z.number().default(5),
  targetTemp: z.number().default(55),
  grillTemp: z.number().default(200),
});

function evaluateAllFormulas(input: Steak_temperature_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (((input.thickness / 100) ** 2) / (1.4e-7 * (Math.PI ** 2))) * Math.log((input.grillTemp - input.initialTemp) / (input.grillTemp - input.targetTemp)) / 60; results["cookingTimeMin"] = Number.isFinite(v) ? v : 0; } catch { results["cookingTimeMin"] = 0; }
  try { const v = (((input.thickness / 100) ** 2) / (1.4e-7 * (Math.PI ** 2))) * Math.log((input.grillTemp - input.initialTemp) / (input.grillTemp - input.targetTemp)); results["cookingTimeSec"] = Number.isFinite(v) ? v : 0; } catch { results["cookingTimeSec"] = 0; }
  try { const v = Math.log((input.grillTemp - input.initialTemp) / (input.grillTemp - input.targetTemp)); results["driveFactor"] = Number.isFinite(v) ? v : 0; } catch { results["driveFactor"] = 0; }
  return results;
}


export function calculateSteak_temperature_calculator(input: Steak_temperature_calculatorInput): Steak_temperature_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cookingTimeMin"] ?? 0;
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


export interface Steak_temperature_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
