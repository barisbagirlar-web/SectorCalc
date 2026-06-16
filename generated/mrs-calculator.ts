// Auto-generated from mrs-calculator-schema.json
import * as z from 'zod';

export interface Mrs_calculatorInput {
  orderQuantity: number;
  unitWeight: number;
  scrapRate: number;
  machineEfficiency: number;
  materialCostPerKg: number;
}

export const Mrs_calculatorInputSchema = z.object({
  orderQuantity: z.number().default(1000),
  unitWeight: z.number().default(2.5),
  scrapRate: z.number().default(5),
  machineEfficiency: z.number().default(95),
  materialCostPerKg: z.number().default(12.5),
});

function evaluateAllFormulas(input: Mrs_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.orderQuantity * input.unitWeight * (1 + input.scrapRate / 100); results["totalMaterialWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalMaterialWeight"] = 0; }
  try { const v = (results["totalMaterialWeight"] ?? 0) / (input.machineEfficiency / 100); results["effectiveMaterialWeight"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveMaterialWeight"] = 0; }
  try { const v = (results["effectiveMaterialWeight"] ?? 0) * input.materialCostPerKg; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateMrs_calculator(input: Mrs_calculatorInput): Mrs_calculatorOutput {
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


export interface Mrs_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
