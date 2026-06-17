// Auto-generated from beer-calculator-schema.json
import * as z from 'zod';

export interface Beer_calculatorInput {
  maltQuantity: number;
  maltCostPerKg: number;
  hopsQuantity: number;
  hopsCostPer100g: number;
  yeastCost: number;
  energyCost: number;
  batchVolume: number;
  overheadCost: number;
}

export const Beer_calculatorInputSchema = z.object({
  maltQuantity: z.number().default(5),
  maltCostPerKg: z.number().default(15),
  hopsQuantity: z.number().default(100),
  hopsCostPer100g: z.number().default(50),
  yeastCost: z.number().default(25),
  energyCost: z.number().default(2.5),
  batchVolume: z.number().default(1000),
  overheadCost: z.number().default(500),
});

function evaluateAllFormulas(input: Beer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.maltQuantity * input.maltCostPerKg + input.hopsQuantity * (input.hopsCostPer100g / 100) + input.yeastCost; results["materialCost"] = Number.isFinite(v) ? v : 0; } catch { results["materialCost"] = 0; }
  try { const v = input.batchVolume * 0.3; results["energyUsage"] = Number.isFinite(v) ? v : 0; } catch { results["energyUsage"] = 0; }
  try { const v = (results["energyUsage"] ?? 0) * input.energyCost; results["energyTotalCost"] = Number.isFinite(v) ? v : 0; } catch { results["energyTotalCost"] = 0; }
  try { const v = (results["materialCost"] ?? 0) + (results["energyTotalCost"] ?? 0) + input.overheadCost; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCost"] ?? 0) / input.batchVolume; results["costPerLiter"] = Number.isFinite(v) ? v : 0; } catch { results["costPerLiter"] = 0; }
  return results;
}


export function calculateBeer_calculator(input: Beer_calculatorInput): Beer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["materialCost"] ?? 0;
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


export interface Beer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
