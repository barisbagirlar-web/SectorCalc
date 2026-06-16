// Auto-generated from moving-cost-calculator-schema.json
import * as z from 'zod';

export interface Moving_cost_calculatorInput {
  distance: number;
  weight: number;
  laborHours: number;
  packingItems: number;
  ratePerKm: number;
  ratePerKg: number;
  hourlyRate: number;
  packingCostPerItem: number;
}

export const Moving_cost_calculatorInputSchema = z.object({
  distance: z.number().default(100),
  weight: z.number().default(1000),
  laborHours: z.number().default(8),
  packingItems: z.number().default(20),
  ratePerKm: z.number().default(0.5),
  ratePerKg: z.number().default(0.2),
  hourlyRate: z.number().default(25),
  packingCostPerItem: z.number().default(10),
});

function evaluateAllFormulas(input: Moving_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance * input.ratePerKm + input.weight * input.ratePerKg; results["transportCost"] = Number.isFinite(v) ? v : 0; } catch { results["transportCost"] = 0; }
  try { const v = input.laborHours * input.hourlyRate; results["laborCost"] = Number.isFinite(v) ? v : 0; } catch { results["laborCost"] = 0; }
  try { const v = input.packingItems * input.packingCostPerItem; results["packingCost"] = Number.isFinite(v) ? v : 0; } catch { results["packingCost"] = 0; }
  try { const v = (results["transportCost"] ?? 0) + (results["laborCost"] ?? 0) + (results["packingCost"] ?? 0); results["totalMovingCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalMovingCost"] = 0; }
  return results;
}


export function calculateMoving_cost_calculator(input: Moving_cost_calculatorInput): Moving_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalMovingCost"] ?? 0;
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


export interface Moving_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
