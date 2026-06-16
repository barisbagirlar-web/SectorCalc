// Auto-generated from shipping-calculator-schema.json
import * as z from 'zod';

export interface Shipping_calculatorInput {
  distance: number;
  weight: number;
  volume: number;
  fuelPrice: number;
}

export const Shipping_calculatorInputSchema = z.object({
  distance: z.number().default(100),
  weight: z.number().default(10),
  volume: z.number().default(1),
  fuelPrice: z.number().default(1.5),
});

function evaluateAllFormulas(input: Shipping_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.5; results["costPerKm"] = Number.isFinite(v) ? v : 0; } catch { results["costPerKm"] = 0; }
  try { const v = 0.2; results["costPerKg"] = Number.isFinite(v) ? v : 0; } catch { results["costPerKg"] = 0; }
  try { const v = 10; results["costPerM3"] = Number.isFinite(v) ? v : 0; } catch { results["costPerM3"] = 0; }
  try { const v = 1.5; results["baseFuelPrice"] = Number.isFinite(v) ? v : 0; } catch { results["baseFuelPrice"] = 0; }
  try { const v = input.distance * (results["costPerKm"] ?? 0); results["baseCost"] = Number.isFinite(v) ? v : 0; } catch { results["baseCost"] = 0; }
  try { const v = input.weight * (results["costPerKg"] ?? 0); results["weightSurcharge"] = Number.isFinite(v) ? v : 0; } catch { results["weightSurcharge"] = 0; }
  try { const v = input.volume * (results["costPerM3"] ?? 0); results["volumeSurcharge"] = Number.isFinite(v) ? v : 0; } catch { results["volumeSurcharge"] = 0; }
  try { const v = input.fuelPrice / (results["baseFuelPrice"] ?? 0); results["fuelAdjustmentFactor"] = Number.isFinite(v) ? v : 0; } catch { results["fuelAdjustmentFactor"] = 0; }
  try { const v = (results["baseCost"] ?? 0) * ((results["fuelAdjustmentFactor"] ?? 0) - 1); results["fuelSurcharge"] = Number.isFinite(v) ? v : 0; } catch { results["fuelSurcharge"] = 0; }
  try { const v = (results["baseCost"] ?? 0) + (results["weightSurcharge"] ?? 0) + (results["volumeSurcharge"] ?? 0) + (results["fuelSurcharge"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateShipping_calculator(input: Shipping_calculatorInput): Shipping_calculatorOutput {
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


export interface Shipping_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
