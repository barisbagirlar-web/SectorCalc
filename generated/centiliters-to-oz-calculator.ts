// Auto-generated from centiliters-to-oz-calculator-schema.json
import * as z from 'zod';

export interface Centiliters_to_oz_calculatorInput {
  centiliters: number;
  conversionType: number;
  containerCount: number;
  wasteFactor: number;
  roundingPrecision: number;
}

export const Centiliters_to_oz_calculatorInputSchema = z.object({
  centiliters: z.number().default(100),
  conversionType: z.number().default(0),
  containerCount: z.number().default(1),
  wasteFactor: z.number().default(0),
  roundingPrecision: z.number().default(2),
});

function evaluateAllFormulas(input: Centiliters_to_oz_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.33814 + input.conversionType * (0.35195 - 0.33814); results["conversionFactor"] = Number.isFinite(v) ? v : 0; } catch { results["conversionFactor"] = 0; }
  try { const v = input.centiliters * (results["conversionFactor"] ?? 0) * input.containerCount; results["rawOunces"] = Number.isFinite(v) ? v : 0; } catch { results["rawOunces"] = 0; }
  try { const v = (results["rawOunces"] ?? 0) * input.wasteFactor / 100; results["wasteOunces"] = Number.isFinite(v) ? v : 0; } catch { results["wasteOunces"] = 0; }
  try { const v = (results["rawOunces"] ?? 0) + (results["wasteOunces"] ?? 0); results["totalOunces"] = Number.isFinite(v) ? v : 0; } catch { results["totalOunces"] = 0; }
  try { const v = 10 ** input.roundingPrecision; results["roundingFactor"] = Number.isFinite(v) ? v : 0; } catch { results["roundingFactor"] = 0; }
  try { const v = Math.round((results["totalOunces"] ?? 0) * (results["roundingFactor"] ?? 0)) / (results["roundingFactor"] ?? 0); results["totalOuncesRounded"] = Number.isFinite(v) ? v : 0; } catch { results["totalOuncesRounded"] = 0; }
  return results;
}


export function calculateCentiliters_to_oz_calculator(input: Centiliters_to_oz_calculatorInput): Centiliters_to_oz_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalOuncesRounded"] ?? 0;
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


export interface Centiliters_to_oz_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
