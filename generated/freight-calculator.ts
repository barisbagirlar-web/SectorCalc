// Auto-generated from freight-calculator-schema.json
import * as z from 'zod';

export interface Freight_calculatorInput {
  distance: number;
  weight: number;
  fuelCostPerLiter: number;
  fuelEfficiency: number;
  ratePerKg: number;
  otherCharges: number;
}

export const Freight_calculatorInputSchema = z.object({
  distance: z.number().default(100),
  weight: z.number().default(1000),
  fuelCostPerLiter: z.number().default(1.5),
  fuelEfficiency: z.number().default(5),
  ratePerKg: z.number().default(0.1),
  otherCharges: z.number().default(0),
});

function evaluateAllFormulas(input: Freight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance / input.fuelEfficiency * input.fuelCostPerLiter; results["fuelCost"] = Number.isFinite(v) ? v : 0; } catch { results["fuelCost"] = 0; }
  try { const v = input.weight * input.ratePerKg; results["weightCost"] = Number.isFinite(v) ? v : 0; } catch { results["weightCost"] = 0; }
  try { const v = (results["fuelCost"] ?? 0) + (results["weightCost"] ?? 0) + input.otherCharges; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateFreight_calculator(input: Freight_calculatorInput): Freight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
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


export interface Freight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
