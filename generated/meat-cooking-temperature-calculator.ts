// Auto-generated from meat-cooking-temperature-calculator-schema.json
import * as z from 'zod';

export interface Meat_cooking_temperature_calculatorInput {
  weight: number;
  startTemp: number;
  targetTemp: number;
  ovenTemp: number;
  thermalFactor: number;
}

export const Meat_cooking_temperature_calculatorInputSchema = z.object({
  weight: z.number().default(1),
  startTemp: z.number().default(20),
  targetTemp: z.number().default(70),
  ovenTemp: z.number().default(180),
  thermalFactor: z.number().default(20),
});

function evaluateAllFormulas(input: Meat_cooking_temperature_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.ovenTemp - input.startTemp) / (input.ovenTemp - input.targetTemp); results["tempRatio"] = Number.isFinite(v) ? v : 0; } catch { results["tempRatio"] = 0; }
  try { const v = Math.log((input.ovenTemp - input.startTemp) / (input.ovenTemp - input.targetTemp)); results["logFactor"] = Number.isFinite(v) ? v : 0; } catch { results["logFactor"] = 0; }
  try { const v = input.thermalFactor * Math.pow(input.weight, 2/3) * Math.log((input.ovenTemp - input.startTemp) / (input.ovenTemp - input.targetTemp)); results["cookingTime"] = Number.isFinite(v) ? v : 0; } catch { results["cookingTime"] = 0; }
  return results;
}


export function calculateMeat_cooking_temperature_calculator(input: Meat_cooking_temperature_calculatorInput): Meat_cooking_temperature_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cookingTime"] ?? 0;
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


export interface Meat_cooking_temperature_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
