// Auto-generated from yogurt-calculator-schema.json
import * as z from 'zod';

export interface Yogurt_calculatorInput {
  milkCostPerLiter: number;
  milkYieldPerLiter: number;
  starterCultureCostPerBatch: number;
  batchSizeLiters: number;
  packagingCostPerKg: number;
  overheadCostPerBatch: number;
}

export const Yogurt_calculatorInputSchema = z.object({
  milkCostPerLiter: z.number().default(5),
  milkYieldPerLiter: z.number().default(0.95),
  starterCultureCostPerBatch: z.number().default(10),
  batchSizeLiters: z.number().default(100),
  packagingCostPerKg: z.number().default(2),
  overheadCostPerBatch: z.number().default(50),
});

function evaluateAllFormulas(input: Yogurt_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.milkYieldPerLiter * input.batchSizeLiters; results["totalYogurt"] = Number.isFinite(v) ? v : 0; } catch { results["totalYogurt"] = 0; }
  try { const v = input.milkCostPerLiter * input.batchSizeLiters; results["milkCostTotal"] = Number.isFinite(v) ? v : 0; } catch { results["milkCostTotal"] = 0; }
  try { const v = (results["milkCostTotal"] ?? 0) + input.starterCultureCostPerBatch + (input.packagingCostPerKg * (results["totalYogurt"] ?? 0)) + input.overheadCostPerBatch; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCost"] ?? 0) / (results["totalYogurt"] ?? 0); results["costPerKg"] = Number.isFinite(v) ? v : 0; } catch { results["costPerKg"] = 0; }
  return results;
}


export function calculateYogurt_calculator(input: Yogurt_calculatorInput): Yogurt_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["costPerKg"] ?? 0;
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


export interface Yogurt_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
